import { and, desc, eq, inArray } from 'drizzle-orm'
import { sema, veritabaniAc } from '@matgebra/db'
import { DURUMLAR, normalize } from '@matgebra/core'

/**
 * Yonetim katmani.
 *
 * Icerik okuma tarafi `depo.ts`'te; burasi YAZMA tarafidir. Iki kural var:
 *
 *  1. Her yazma once mevcut satiri okur, sonra yazar, sonra `revizyon`
 *     tablosuna oncesini ve sonrasini birakir. Boylece her degisiklik geri
 *     alinabilir ve fark goruntulenebilir - panelin en kritik ozelligi bu.
 *  2. Yasam dongusu tek yonlu degil: taslak <-> inceleme <-> yayin <-> arsiv
 *     serbestce gidilir ama her gecis kaydedilir. Yayindan cikarma da bir
 *     revizyondur, sessiz bir silme degil.
 *
 * Tablolar calisma aninda secildigi icin bu dosya Drizzle'in tip guvenli
 * sorgu kurucusu yerine hazir SQL kullaniyor. Guvenlik ada degil LISTEYE
 * dayaniyor: hem tablo hem kolon adlari asagidaki sabit listelerden gecmek
 * zorunda, degerler her zaman parametre olarak baglaniyor.
 *
 * Sema Faz 2'de bu is icin hazirlandi; bu dosya tek bir goc bile
 * gerektirmedi (plandaki "bitti kriteri" tam olarak buydu).
 */

const { ham, db } = veritabaniAc()
const s = sema

/** Panelin dokunabildigi tablolar ve baslik olarak gosterilecek kolon. */
const YONETILEN = {
  // normKolonu yalnizca o tabloda gercekten varsa yazilir. Arama icin
  // normalize kopya tutan tek tablo `konu`; digerlerinde FTS dizini
  // tohumlamada yeniden kuruluyor.
  sahne: { tablo: 'sahne', baslikKolonu: 'baslik', normKolonu: null },
  konu: { tablo: 'konu', baslikKolonu: 'ad', normKolonu: 'ad_norm' },
  soru: { tablo: 'soru', baslikKolonu: 'govde', normKolonu: null },
  deney: { tablo: 'deney', baslikKolonu: 'ad', normKolonu: null },
  gercek_hayat_ornegi: { tablo: 'gercek_hayat_ornegi', baslikKolonu: 'baslik', normKolonu: null },
} as const

/*
 * kavram ve formul bilerek disarida.
 *
 * O iki tabloda yasam dongusu alanlari (durum, surum, guncelleme) yok:
 * sozluk girisleri ve formul kartlari konuyla birlikte tohumlaniyor,
 * taslak/inceleme/yayin akisi tasimiyorlar. Panele almak icin semayi
 * degistirmek gerekirdi; plandaki "goc gerekmeden yalnizca arayuz
 * eklenerek tamamlanir" kosulu tam da bunu yasakliyor. Ikisi de MCP
 * araclariyla (kavram_yaz, formul_yaz) yazilmaya devam ediyor.
 */

export type YonetilenTablo = keyof typeof YONETILEN

/** Panelde gorunen tablo adlarinin Turkce karsiligi. */
export const TABLO_ADI: Record<YonetilenTablo, string> = {
  sahne: 'Sahneler',
  konu: 'Konular',
  soru: 'Sorular',
  deney: 'Deneyler',
  gercek_hayat_ornegi: 'Gerçek hayat örnekleri',
}

/**
 * Duzenlenebilir kolonlar. Bu listede olmayan hicbir kolon yazilamaz -
 * ne panelden ne de dogrudan istekle. Geometri (nesne, bagimlilik) bilerek
 * disarida: sahne kurulumu MCP araclariyla dogrulanarak yaziliyor, panelden
 * elle bozulmasi kolay olurdu.
 */
const DUZENLENEBILIR: Record<YonetilenTablo, string[]> = {
  sahne: ['baslik', 'ozet', 'zorluk', 'sira', 'durum'],
  konu: ['ad', 'ozet', 'sira', 'zorluk', 'durum'],
  soru: ['govde', 'ipucu', 'cozum', 'zorluk', 'puan', 'durum'],
  deney: ['ad', 'aciklama', 'durum'],
  gercek_hayat_ornegi: ['baslik', 'hikaye', 'soru', 'olcek_aciklama', 'kaynak', 'durum'],
}

export function tabloGecerli(ad: string): ad is YonetilenTablo {
  return Object.hasOwn(YONETILEN, ad)
}

function tabloAl(ad: string) {
  if (!tabloGecerli(ad)) throw new Error(`Yönetilmeyen tablo: ${ad}`)
  return YONETILEN[ad]
}

type Satir = Record<string, unknown>

function satirOku(tablo: YonetilenTablo, id: number): Satir | undefined {
  const t = YONETILEN[tablo]
  return ham.prepare(`SELECT * FROM ${t.tablo} WHERE id = ?`).get(id) as Satir | undefined
}

function revizyonYaz(
  tablo: string,
  kayitId: number,
  islem: 'ekle' | 'guncelle' | 'arsivle' | 'geri_al',
  onceki: unknown,
  sonraki: unknown,
  kullaniciId?: number,
): void {
  db.insert(s.revizyon)
    .values({
      tablo,
      kayitId,
      islem,
      oncekiJson: onceki ? JSON.stringify(onceki) : null,
      sonrakiJson: sonraki ? JSON.stringify(sonraki) : null,
      kullaniciId: kullaniciId ?? null,
    })
    .run()
}

/* ------------------------------------------------------------- listeleme */

export function icerikListesi(girdi: {
  tablo: YonetilenTablo
  durum?: string
  arama?: string
  limit?: number
}) {
  const t = tabloAl(girdi.tablo)
  const limit = Math.min(Math.max(girdi.limit ?? 200, 1), 500)
  const durumSuzgeci = girdi.durum && girdi.durum !== 'hepsi'
  if (durumSuzgeci && !DURUMLAR.includes(girdi.durum as never)) {
    throw new Error(`Geçersiz durum: ${girdi.durum}`)
  }

  const sorgu = `
    SELECT id, ${t.baslikKolonu} AS baslik, durum, surum, guncelleme
           ${t.tablo === 'sahne' || t.tablo === 'konu' ? ', slug' : ''}
    FROM ${t.tablo}
    ${durumSuzgeci ? 'WHERE durum = ?' : ''}
    ORDER BY guncelleme DESC
    LIMIT ?`
  const satirlar = ham
    .prepare(sorgu)
    .all(...(durumSuzgeci ? [girdi.durum, limit] : [limit])) as Array<{
    id: number
    baslik: string
    durum: string
    surum: number
    guncelleme: string
    slug?: string
  }>

  if (!girdi.arama) return satirlar
  // Turkce arama daima normalize uzerinden: NOCASE i/I ciftinde yaniliyor.
  const n = normalize(girdi.arama)
  return satirlar.filter((r) => normalize(r.baslik ?? '').includes(n))
}

/** Her tablo icin durum dokumu - panelin ust seridi. */
export function durumOzeti() {
  return (Object.keys(YONETILEN) as YonetilenTablo[]).map((ad) => {
    const t = YONETILEN[ad]
    const satirlar = ham
      .prepare(`SELECT durum, count(*) AS adet FROM ${t.tablo} GROUP BY durum`)
      .all() as Array<{ durum: string; adet: number }>
    return {
      tablo: ad,
      ad: TABLO_ADI[ad],
      toplam: satirlar.reduce((x, y) => x + y.adet, 0),
      durumlar: Object.fromEntries(
        DURUMLAR.map((d) => [d, satirlar.find((x) => x.durum === d)?.adet ?? 0]),
      ),
    }
  })
}

export function kayitAyrinti(tablo: YonetilenTablo, id: number) {
  const satir = satirOku(tablo, id)
  if (!satir) throw new Error(`Kayıt bulunamadı: ${tablo}#${id}`)
  return {
    tablo,
    id,
    duzenlenebilir: DUZENLENEBILIR[tablo],
    kayit: satir,
  }
}

/* ---------------------------------------------------------------- yazma */

export function kayitGuncelle(girdi: {
  tablo: YonetilenTablo
  id: number
  degisiklikler: Record<string, unknown>
  kullaniciId?: number
}) {
  const t = tabloAl(girdi.tablo)
  const onceki = satirOku(girdi.tablo, girdi.id)
  if (!onceki) throw new Error(`Kayıt bulunamadı: ${girdi.tablo}#${girdi.id}`)

  const izinli = DUZENLENEBILIR[girdi.tablo]
  const kolonlar: string[] = []
  const degerler: unknown[] = []
  for (const [anahtar, deger] of Object.entries(girdi.degisiklikler)) {
    if (!izinli.includes(anahtar)) continue
    if (anahtar === 'durum' && !DURUMLAR.includes(deger as never)) {
      throw new Error(`Geçersiz durum: ${String(deger)}`)
    }
    kolonlar.push(anahtar)
    degerler.push(deger as never)
  }
  if (!kolonlar.length) {
    throw new Error(`Değiştirilebilir alan yok. İzinli alanlar: ${izinli.join(', ')}`)
  }

  // Arama kolonu ana metinle birlikte tazelenmeli, yoksa arama eskiyi bulur.
  if (t.normKolonu && kolonlar.includes(t.baslikKolonu)) {
    kolonlar.push(t.normKolonu)
    degerler.push(normalize(String(degerler[kolonlar.indexOf(t.baslikKolonu)])))
  }

  const islem = ham.transaction(() => {
    ham
      .prepare(
        `UPDATE ${t.tablo}
         SET ${kolonlar.map((k) => `${k} = ?`).join(', ')},
             surum = surum + 1,
             guncelleme = datetime('now')
         WHERE id = ?`,
      )
      .run(...(degerler as never[]), girdi.id)
    const sonraki = satirOku(girdi.tablo, girdi.id)
    revizyonYaz(
      girdi.tablo,
      girdi.id,
      girdi.degisiklikler.durum === 'arsiv' ? 'arsivle' : 'guncelle',
      onceki,
      sonraki,
      girdi.kullaniciId,
    )
    return sonraki
  })

  return { tablo: girdi.tablo, id: girdi.id, kayit: islem() }
}

/** Toplu durum degisikligi: secilen kayitlari tek islemde yayina alir. */
export function topluDurum(girdi: {
  tablo: YonetilenTablo
  idler: number[]
  durum: string
  kullaniciId?: number
}) {
  const t = tabloAl(girdi.tablo)
  if (!DURUMLAR.includes(girdi.durum as never)) throw new Error(`Geçersiz durum: ${girdi.durum}`)
  if (!girdi.idler.length) throw new Error('Kayıt seçilmedi.')

  const islem = ham.transaction(() => {
    let degisen = 0
    for (const id of girdi.idler) {
      const onceki = satirOku(girdi.tablo, id)
      if (!onceki || String(onceki.durum) === girdi.durum) continue
      ham
        .prepare(
          `UPDATE ${t.tablo} SET durum = ?, surum = surum + 1, guncelleme = datetime('now') WHERE id = ?`,
        )
        .run(girdi.durum, id)
      revizyonYaz(
        girdi.tablo,
        id,
        girdi.durum === 'arsiv' ? 'arsivle' : 'guncelle',
        onceki,
        satirOku(girdi.tablo, id),
        girdi.kullaniciId,
      )
      degisen++
    }
    return degisen
  })

  return { tablo: girdi.tablo, durum: girdi.durum, degisen: islem(), istenen: girdi.idler.length }
}

/* -------------------------------------------------------------- revizyon */

/** Iki satirin alan alan farki. Panelde "neyi degistirdim" sorusunu yanitlar. */
function fark(
  onceki: Satir | null,
  sonraki: Satir | null,
): Array<{ alan: string; onceki: string; sonraki: string }> {
  const anahtarlar = new Set([...Object.keys(onceki ?? {}), ...Object.keys(sonraki ?? {})])
  const sonuc: Array<{ alan: string; onceki: string; sonraki: string }> = []
  for (const a of anahtarlar) {
    // Surum ve guncelleme her yazmada degisir; farkta gurultu yapar.
    if (a === 'surum' || a === 'guncelleme') continue
    const x = String(onceki?.[a] ?? '')
    const y = String(sonraki?.[a] ?? '')
    if (x === y) continue
    sonuc.push({ alan: a, onceki: x, sonraki: y })
  }
  return sonuc
}

export function revizyonlar(girdi: { tablo?: string; kayitId?: number; limit?: number }) {
  const kosullar = []
  if (girdi.tablo) kosullar.push(eq(s.revizyon.tablo, girdi.tablo))
  if (girdi.kayitId) kosullar.push(eq(s.revizyon.kayitId, girdi.kayitId))

  return db
    .select()
    .from(s.revizyon)
    .where(kosullar.length ? and(...kosullar) : undefined)
    .orderBy(desc(s.revizyon.id))
    .limit(Math.min(girdi.limit ?? 60, 200))
    .all()
    .map((r) => ({
      id: r.id,
      tablo: r.tablo,
      kayitId: r.kayitId,
      islem: r.islem,
      zaman: r.zaman,
      kullaniciId: r.kullaniciId,
      geriAlinabilir: Boolean(r.oncekiJson),
      fark: fark(
        r.oncekiJson ? (JSON.parse(r.oncekiJson) as Satir) : null,
        r.sonrakiJson ? (JSON.parse(r.sonrakiJson) as Satir) : null,
      ),
    }))
}

/** Bir revizyondaki "onceki" durumu geri yazar. */
export function revizyonaDon(girdi: { revizyonId: number; kullaniciId?: number }) {
  const r = db.select().from(s.revizyon).where(eq(s.revizyon.id, girdi.revizyonId)).get()
  if (!r) throw new Error(`Revizyon bulunamadı: ${girdi.revizyonId}`)
  if (!r.oncekiJson) throw new Error('Bu revizyonun öncesi yok (ekleme kaydı).')
  const t = tabloAl(r.tablo)

  const hedef = JSON.parse(r.oncekiJson) as Satir
  const izinli = DUZENLENEBILIR[r.tablo as YonetilenTablo]
  const kolonlar = izinli.filter((k) => k in hedef)
  if (!kolonlar.length) throw new Error('Geri alınacak alan yok.')

  const simdiki = satirOku(r.tablo as YonetilenTablo, r.kayitId)
  if (!simdiki) throw new Error('Kayıt artık yok.')

  const islem = ham.transaction(() => {
    ham
      .prepare(
        `UPDATE ${t.tablo}
         SET ${kolonlar.map((k) => `${k} = ?`).join(', ')},
             surum = surum + 1,
             guncelleme = datetime('now')
         WHERE id = ?`,
      )
      .run(...(kolonlar.map((k) => hedef[k]) as never[]), r.kayitId)
    const sonraki = satirOku(r.tablo as YonetilenTablo, r.kayitId)
    revizyonYaz(r.tablo, r.kayitId, 'geri_al', simdiki, sonraki, girdi.kullaniciId)
    return sonraki
  })

  return { tablo: r.tablo, id: r.kayitId, kayit: islem() }
}

/* ------------------------------------------------------------- kullanici */

const ROLLER = ['ogrenci', 'ogretmen', 'yonetici'] as const

export function kullanicilar() {
  return db
    .select({
      id: s.kullanici.id,
      ad: s.kullanici.ad,
      rol: s.kullanici.rol,
      sinifId: s.kullanici.sinifId,
      olusturma: s.kullanici.olusturma,
    })
    .from(s.kullanici)
    .all()
}

export function rolYaz(girdi: { id: number; rol: string }) {
  if (!ROLLER.includes(girdi.rol as never)) {
    throw new Error(`Geçersiz rol: ${girdi.rol}. Geçerli: ${ROLLER.join(', ')}`)
  }
  const onceki = db.select().from(s.kullanici).where(eq(s.kullanici.id, girdi.id)).get()
  if (!onceki) throw new Error(`Kullanıcı bulunamadı: ${girdi.id}`)
  db.update(s.kullanici).set({ rol: girdi.rol }).where(eq(s.kullanici.id, girdi.id)).run()
  revizyonYaz('kullanici', girdi.id, 'guncelle', onceki, { ...onceki, rol: girdi.rol })
  return { id: girdi.id, rol: girdi.rol }
}

/* -------------------------------------------------- toplu ice/disa aktarim */

/**
 * Bir konunun butun icerigini tek JSON'a doker.
 * Yedekleme ve baska bir kuruluma tasima icin.
 */
export function konuDisaAktar(slug: string) {
  const konu = db.select().from(s.konu).where(eq(s.konu.slug, slug)).get()
  if (!konu) throw new Error(`Konu bulunamadı: ${slug}`)

  const sahneler = db.select().from(s.sahne).where(eq(s.sahne.konuId, konu.id)).all()
  const sahneIdleri = sahneler.map((x) => x.id)

  return {
    surum: 1,
    konu: { slug: konu.slug, ad: konu.ad, ozet: konu.ozet, durum: konu.durum },
    sahneler: sahneler.map((sh) => ({
      slug: sh.slug,
      baslik: sh.baslik,
      tur: sh.tur,
      ozet: sh.ozet,
      zorluk: sh.zorluk,
      sira: sh.sira,
      durum: sh.durum,
      ayar: db.select().from(s.sahneAyar).where(eq(s.sahneAyar.sahneId, sh.id)).get() ?? null,
      nesneler: db.select().from(s.nesne).where(eq(s.nesne.sahneId, sh.id)).all(),
      adimlar: db.select().from(s.adim).where(eq(s.adim.sahneId, sh.id)).all(),
    })),
    ornekler: sahneIdleri.length
      ? db
          .select()
          .from(s.gercekHayatOrnegi)
          .where(inArray(s.gercekHayatOrnegi.sahneId, sahneIdleri))
          .all()
      : [],
    sorular: db.select().from(s.soru).where(eq(s.soru.konuId, konu.id)).all(),
  }
}
