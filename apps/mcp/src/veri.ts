import { and, asc, eq, inArray, like, sql } from 'drizzle-orm'
import { normalize, slugla, type Sahne } from '@matgebra/core'
import { sema, veritabaniAc } from '@matgebra/db'

/**
 * MCP veri katmani.
 *
 * Icerik uretimi dosyaya degil veritabanina yazilir; bu dosya o yazmanin
 * ve okumanin sorgularini tutar. Sahne yazma mantigi tohumlamayla ortaktir
 * (@matgebra/db -> sahneYaz), boylece iki yol ayrisamaz.
 */

export const { ham, db } = veritabaniAc()
export const s = sema

/** Tablo listesi, kolonlari ve satir sayilari. */
export function semaOzeti() {
  const tablolar = ham
    .prepare(
      `SELECT name FROM sqlite_master
       WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
         AND name NOT LIKE '%_fts%' AND name NOT LIKE '__drizzle%'
       ORDER BY name`,
    )
    .all() as Array<{ name: string }>

  return tablolar.map((t) => {
    const kolonlar = ham.prepare(`PRAGMA table_info(${t.name})`).all() as Array<{
      name: string
      type: string
      notnull: number
      pk: number
    }>
    const { n } = ham.prepare(`SELECT count(*) AS n FROM ${t.name}`).get() as { n: number }
    return {
      tablo: t.name,
      satir: n,
      kolonlar: kolonlar.map(
        (k) => `${k.name}:${k.type.toLowerCase()}${k.pk ? ' PK' : ''}${k.notnull ? '' : ' ?'}`,
      ),
    }
  })
}

export interface KazanimAramaGirdisi {
  sinif?: number
  alan?: 'geometri' | 'olasilik'
  metin?: string
  limit?: number
}

/** MEB kazanimlarinda arama. Metin normalize edilir: "acilar" -> "Açılar". */
export function kazanimAra(g: KazanimAramaGirdisi) {
  const kosullar = [sql`${s.tema.alanSlug} is not null`]
  if (typeof g.sinif === 'number') kosullar.push(eq(s.sinif.seviye, g.sinif))
  if (g.alan) kosullar.push(eq(s.tema.alanSlug, g.alan))
  if (g.metin) {
    const q = `%${normalize(g.metin)}%`
    kosullar.push(sql`(${s.kazanim.metinNorm} like ${q} or lower(${s.kazanim.kod}) like ${q})`)
  }

  const satirlar = db
    .select({
      id: s.kazanim.id,
      kod: s.kazanim.kod,
      metin: s.kazanim.metin,
      seviye: s.sinif.seviye,
      alan: s.tema.alanSlug,
      temaKod: s.tema.kod,
      temaAd: s.tema.ad,
    })
    .from(s.kazanim)
    .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.tema.sinifId))
    .where(and(...kosullar))
    .orderBy(asc(s.sinif.seviye), asc(s.kazanim.kod))
    .limit(g.limit ?? 40)
    .all()

  if (!satirlar.length) return []

  const maddeler = db
    .select()
    .from(s.kazanimMaddesi)
    .where(
      inArray(
        s.kazanimMaddesi.kazanimId,
        satirlar.map((k) => k.id),
      ),
    )
    .orderBy(asc(s.kazanimMaddesi.sira))
    .all()

  const kapsayan = db
    .select({ kazanimId: s.konuKazanim.kazanimId, konuSlug: s.konu.slug })
    .from(s.konuKazanim)
    .innerJoin(s.konu, eq(s.konu.id, s.konuKazanim.konuId))
    .where(
      inArray(
        s.konuKazanim.kazanimId,
        satirlar.map((k) => k.id),
      ),
    )
    .all()

  return satirlar.map((k) => ({
    kod: k.kod,
    metin: k.metin,
    seviye: k.seviye,
    alan: k.alan,
    tema: `${k.temaKod} ${k.temaAd}`,
    maddeler: maddeler
      .filter((m) => m.kazanimId === k.id)
      .map((m) => `${m.harf}) ${m.metin}`),
    konular: kapsayan.filter((c) => c.kazanimId === k.id).map((c) => c.konuSlug),
  }))
}

/** Konu listesi; her konunun sahne ve ornek sayisi ile. */
export function konuListele(g: { sinif?: number; alan?: string }) {
  const kosullar = []
  if (typeof g.sinif === 'number') kosullar.push(eq(s.sinif.seviye, g.sinif))
  if (g.alan) kosullar.push(eq(s.alan.slug, g.alan))

  const satirlar = db
    .select({
      id: s.konu.id,
      slug: s.konu.slug,
      ad: s.konu.ad,
      ozet: s.konu.ozet,
      seviye: s.sinif.seviye,
      alan: s.alan.slug,
      zorluk: s.konu.zorluk,
      durum: s.konu.durum,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(kosullar.length ? and(...kosullar) : undefined)
    .orderBy(asc(s.sinif.seviye), asc(s.konu.sira))
    .all()

  if (!satirlar.length) return []
  const idler = satirlar.map((k) => k.id)

  const say = (
    liste: Array<{ konuId: number; adet: number }>,
    id: number,
  ) => liste.find((x) => x.konuId === id)?.adet ?? 0

  const sahneler = db
    .select({ konuId: s.sahne.konuId, adet: sql<number>`count(*)` })
    .from(s.sahne)
    .where(inArray(s.sahne.konuId, idler))
    .groupBy(s.sahne.konuId)
    .all()
  const ornekler = db
    .select({ konuId: s.gercekHayatOrnegi.konuId, adet: sql<number>`count(*)` })
    .from(s.gercekHayatOrnegi)
    .where(inArray(s.gercekHayatOrnegi.konuId, idler))
    .groupBy(s.gercekHayatOrnegi.konuId)
    .all()
  const sorular = db
    .select({ konuId: s.soru.konuId, adet: sql<number>`count(*)` })
    .from(s.soru)
    .where(inArray(s.soru.konuId, idler))
    .groupBy(s.soru.konuId)
    .all()
  const kazanimlar = db
    .select({ konuId: s.konuKazanim.konuId, kod: s.kazanim.kod })
    .from(s.konuKazanim)
    .innerJoin(s.kazanim, eq(s.kazanim.id, s.konuKazanim.kazanimId))
    .where(inArray(s.konuKazanim.konuId, idler))
    .all()

  return satirlar.map((k) => ({
    slug: k.slug,
    ad: k.ad,
    ozet: k.ozet,
    seviye: k.seviye,
    alan: k.alan,
    zorluk: k.zorluk,
    durum: k.durum,
    kazanimlar: kazanimlar.filter((c) => c.konuId === k.id).map((c) => c.kod),
    sahne: say(sahneler, k.id),
    ornek: say(ornekler, k.id),
    soru: say(sorular, k.id),
  }))
}

/** Sahneyi yazim bicimiyle dondurur; sahne_yaz'a oldugu gibi geri verilebilir. */
export function sahneGetir(slug: string): Sahne | null {
  const temel = db
    .select({
      id: s.sahne.id,
      slug: s.sahne.slug,
      tur: s.sahne.tur,
      baslik: s.sahne.baslik,
      ozet: s.sahne.ozet,
      zorluk: s.sahne.zorluk,
      sira: s.sahne.sira,
      durum: s.sahne.durum,
      konuSlug: s.konu.slug,
    })
    .from(s.sahne)
    .innerJoin(s.konu, eq(s.konu.id, s.sahne.konuId))
    .where(eq(s.sahne.slug, slug))
    .get()
  if (!temel) return null

  const a = db.select().from(s.sahneAyar).where(eq(s.sahneAyar.sahneId, temel.id)).get()

  const nesneler = db
    .select({
      id: s.nesne.id,
      ad: s.nesne.ad,
      tip: s.nesne.tip,
      etiket: s.nesne.etiket,
      sira: s.nesne.sira,
      katman: s.nesne.katman,
      gorunur: s.nesne.gorunur,
      kilitli: s.nesne.kilitli,
      surukleme: s.nesne.surukleme,
      rol: s.stil.rol,
    })
    .from(s.nesne)
    .leftJoin(s.stil, eq(s.stil.id, s.nesne.stilId))
    .where(eq(s.nesne.sahneId, temel.id))
    .orderBy(asc(s.nesne.sira))
    .all()

  const idler = nesneler.map((n) => n.id)
  const ad = new Map(nesneler.map((n) => [n.id, n.ad]))
  const parametreler = idler.length
    ? db.select().from(s.nesneParametre).where(inArray(s.nesneParametre.nesneId, idler)).all()
    : []
  const bagimliliklar = idler.length
    ? db
        .select()
        .from(s.nesneBagimlilik)
        .where(inArray(s.nesneBagimlilik.nesneId, idler))
        .orderBy(asc(s.nesneBagimlilik.sira))
        .all()
    : []
  const adimlar = db
    .select()
    .from(s.adim)
    .where(eq(s.adim.sahneId, temel.id))
    .orderBy(asc(s.adim.sira))
    .all()

  return {
    slug: temel.slug,
    konuSlug: temel.konuSlug,
    tur: temel.tur as Sahne['tur'],
    baslik: temel.baslik,
    ozet: temel.ozet,
    zorluk: temel.zorluk,
    sira: temel.sira,
    durum: temel.durum as Sahne['durum'],
    ayar: {
      eksenModu: (a?.eksenModu ?? 'tam') as Sahne['ayar']['eksenModu'],
      sinir: [a?.sinirX1 ?? -10, a?.sinirY1 ?? 10, a?.sinirX2 ?? 10, a?.sinirY2 ?? -10],
      izgaraAdimi: a?.izgaraAdimi ?? 1,
      birim: a?.birim ?? '',
      yapisma: (a?.yapisma ?? 'izgara') as Sahne['ayar']['yapisma'],
      oranKilidi: a?.oranKilidi ?? true,
      arkaPlanMedyaId: a?.arkaPlanMedyaId ?? null,
      olcek: a?.olcekJson ? JSON.parse(a.olcekJson) : null,
    },
    nesneler: nesneler.map((n) => ({
      ad: n.ad,
      tip: n.tip as never,
      ...(n.etiket ? { etiket: n.etiket } : {}),
      sira: n.sira,
      katman: n.katman,
      gorunur: n.gorunur,
      kilitli: n.kilitli,
      surukleme: n.surukleme as never,
      stil: { rol: (n.rol ?? 'notr') as never },
      parametreler: parametreler
        .filter((p) => p.nesneId === n.id && !p.anahtar.startsWith('stil_'))
        .map((p) => ({
          anahtar: p.anahtar,
          deger: p.tur === 'sayi' ? Number(p.deger) : p.deger,
          tur: p.tur as never,
        })),
      bagimliliklar: bagimliliklar
        .filter((b) => b.nesneId === n.id)
        .map((b) => ({ kaynak: ad.get(b.kaynakNesneId) ?? '', rol: b.rol as never, sira: b.sira })),
    })),
    adimlar: adimlar.map((x) => ({
      sira: x.sira,
      baslik: x.baslik,
      anlatim: x.anlatim,
      vurgu: JSON.parse(x.vurguJson) as string[],
      aksiyon: x.aksiyonJson ? JSON.parse(x.aksiyonJson) : null,
      beklenen: x.beklenenJson ? JSON.parse(x.beklenenJson) : null,
    })),
  }
}

export interface KonuYazmaGirdisi {
  sinif: number
  alan: 'geometri' | 'olasilik'
  ad: string
  ozet: string
  kazanimlar: string[]
  onKosul?: string[]
  zorluk?: number
  slug?: string
}

/** Konu ekler ya da gunceller; kazanim koprusunu ve on kosullari kurar. */
export function konuYaz(g: KonuYazmaGirdisi) {
  const alan = db.select({ id: s.alan.id }).from(s.alan).where(eq(s.alan.slug, g.alan)).get()
  if (!alan) throw new Error(`Alan bulunamadi: ${g.alan}`)
  const sinif = db.select({ id: s.sinif.id }).from(s.sinif).where(eq(s.sinif.seviye, g.sinif)).get()
  if (!sinif) throw new Error(`Sinif bulunamadi: ${g.sinif}`)

  const slug = g.slug ?? `s${g.sinif}-${slugla(g.ad)}`
  const eksikKazanim: string[] = []
  const eksikOnKosul: string[] = []

  const yaz = ham.transaction(() => {
    const sonSira = db
      .select({ n: sql<number>`coalesce(max(${s.konu.sira}), 0)` })
      .from(s.konu)
      .get()!.n

    db.insert(s.konu)
      .values({
        alanId: alan.id,
        sinifId: sinif.id,
        ad: g.ad,
        adNorm: normalize(g.ad),
        slug,
        ozet: g.ozet,
        sira: sonSira + 1,
        zorluk: g.zorluk ?? 2,
        durum: 'taslak',
      })
      .onConflictDoUpdate({
        target: s.konu.slug,
        set: {
          alanId: alan.id,
          sinifId: sinif.id,
          ad: g.ad,
          adNorm: normalize(g.ad),
          ozet: g.ozet,
          zorluk: g.zorluk ?? 2,
          surum: sql`${s.konu.surum} + 1`,
          guncelleme: sql`(datetime('now'))`,
        },
      })
      .run()

    const konu = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, slug)).get()!

    db.delete(s.konuKazanim).where(eq(s.konuKazanim.konuId, konu.id)).run()
    for (const kod of g.kazanimlar) {
      const k = db.select({ id: s.kazanim.id }).from(s.kazanim).where(eq(s.kazanim.kod, kod)).get()
      if (!k) {
        eksikKazanim.push(kod)
        continue
      }
      db.insert(s.konuKazanim).values({ konuId: konu.id, kazanimId: k.id, kapsama: 'tam' }).run()
    }

    db.delete(s.onKosul).where(eq(s.onKosul.konuId, konu.id)).run()
    for (const gereken of g.onKosul ?? []) {
      const o = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, gereken)).get()
      if (!o) {
        eksikOnKosul.push(gereken)
        continue
      }
      if (o.id === konu.id) {
        eksikOnKosul.push(`${gereken} (kendine on kosul olamaz)`)
        continue
      }
      db.insert(s.onKosul).values({ konuId: konu.id, gerekenKonuId: o.id, zorunlu: true }).run()
    }
    return konu.id
  })

  const id = yaz()
  return { slug, id, eksikKazanim, eksikOnKosul }
}

/**
 * Sahneye bagli gercek hayat anlatisi.
 *
 * Tekrar calistirilabilir: ayni konu ve baslik ile cagrilirsa var olan kayit
 * degistirilir. Icerik betikleri bir kez degil defalarca kosuluyor; onceki
 * hali her cagrida yeni satir aciyordu ve ornekler cogaliyordu.
 */
export function gercekHayatYaz(g: {
  konuSlug: string
  sahneSlug?: string
  baslik: string
  hikaye: string
  soru?: string
  olcekAciklama?: string
  kaynak?: string
  yasAraligi?: string
}) {
  const konu = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, g.konuSlug)).get()
  if (!konu) throw new Error(`Konu bulunamadi: ${g.konuSlug}`)
  const sahne = g.sahneSlug
    ? db.select({ id: s.sahne.id }).from(s.sahne).where(eq(s.sahne.slug, g.sahneSlug)).get()
    : undefined
  if (g.sahneSlug && !sahne) throw new Error(`Sahne bulunamadi: ${g.sahneSlug}`)

  db.delete(s.gercekHayatOrnegi)
    .where(and(eq(s.gercekHayatOrnegi.konuId, konu.id), eq(s.gercekHayatOrnegi.baslik, g.baslik)))
    .run()

  const [satir] = db
    .insert(s.gercekHayatOrnegi)
    .values({
      konuId: konu.id,
      sahneId: sahne?.id ?? null,
      baslik: g.baslik,
      hikaye: g.hikaye,
      soru: g.soru ?? '',
      olcekAciklama: g.olcekAciklama ?? '',
      kaynak: g.kaynak ?? '',
      yasAraligi: g.yasAraligi ?? '',
      durum: 'taslak',
    })
    .returning({ id: s.gercekHayatOrnegi.id })
    .all()
  return { id: satir!.id }
}

/**
 * Konuya ya da sahneye bagli soru.
 * Ayni konu ve ayni govde ile cagrilirsa var olan soru degistirilir.
 */
export function soruYaz(g: {
  konuSlug: string
  sahneSlug?: string
  tip: string
  govde: string
  cevap: unknown
  secenekler?: unknown
  ipucu?: string
  cozum?: string
  zorluk?: number
  puan?: number
}) {
  const konu = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, g.konuSlug)).get()
  if (!konu) throw new Error(`Konu bulunamadi: ${g.konuSlug}`)
  const sahne = g.sahneSlug
    ? db.select({ id: s.sahne.id }).from(s.sahne).where(eq(s.sahne.slug, g.sahneSlug)).get()
    : undefined

  db.delete(s.soru)
    .where(and(eq(s.soru.konuId, konu.id), eq(s.soru.govde, g.govde)))
    .run()

  const [satir] = db
    .insert(s.soru)
    .values({
      konuId: konu.id,
      sahneId: sahne?.id ?? null,
      tip: g.tip,
      govde: g.govde,
      secenekJson: g.secenekler ? JSON.stringify(g.secenekler) : null,
      cevapJson: JSON.stringify(g.cevap ?? {}),
      ipucu: g.ipucu ?? '',
      cozum: g.cozum ?? '',
      zorluk: g.zorluk ?? 2,
      puan: g.puan ?? 1,
      durum: 'taslak',
    })
    .returning({ id: s.soru.id })
    .all()
  return { id: satir!.id }
}

/** Icerik uretiminin ilerleme gostergesi: hangi kazanimin sahnesi eksik. */
export function kapsamaRaporu() {
  const siniflar = db
    .select({
      seviye: s.sinif.seviye,
      alan: s.alan.slug,
      konu: sql<number>`count(distinct ${s.konu.id})`,
      sahne: sql<number>`count(distinct ${s.sahne.id})`,
      ornek: sql<number>`count(distinct ${s.gercekHayatOrnegi.id})`,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .leftJoin(s.sahne, eq(s.sahne.konuId, s.konu.id))
    .leftJoin(s.gercekHayatOrnegi, eq(s.gercekHayatOrnegi.konuId, s.konu.id))
    .groupBy(s.sinif.seviye, s.alan.slug)
    .orderBy(asc(s.sinif.seviye))
    .all()

  const sahnesizKonular = db
    .select({ slug: s.konu.slug, ad: s.konu.ad, seviye: s.sinif.seviye, alan: s.alan.slug })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(sql`${s.konu.id} not in (select konu_id from sahne)`)
    .orderBy(asc(s.sinif.seviye))
    .all()

  const toplam = db
    .select({
      hedef: sql<number>`count(*)`,
      kapsanan: sql<number>`sum(case when ${s.kazanim.id} in (select kazanim_id from konu_kazanim) then 1 else 0 end)`,
    })
    .from(s.kazanim)
    .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
    .where(sql`${s.tema.alanSlug} is not null`)
    .get()

  return {
    kazanimKapsamasi: toplam,
    siniflar,
    sahnesizKonuSayisi: sahnesizKonular.length,
    sahnesizKonular: sahnesizKonular.slice(0, 40),
  }
}

const YAZMA_KALIBI = /\b(insert|update|delete|drop|alter|create|replace|attach|pragma|vacuum)\b/i

/** Salt okunur SQL. Yazma ifadeleri reddedilir. */
export function sqlSorgu(sorgu: string, limit = 200) {
  if (YAZMA_KALIBI.test(sorgu)) {
    throw new Error('Yalnizca okuma sorgusu calistirilabilir (SELECT / WITH).')
  }
  if (!/^\s*(select|with)\b/i.test(sorgu)) {
    throw new Error('Sorgu SELECT ya da WITH ile baslamali.')
  }
  const satirlar = ham.prepare(sorgu).all() as unknown[]
  return { satir: satirlar.length, kesildi: satirlar.length > limit, veri: satirlar.slice(0, limit) }
}

/** Palet: sahne yazarken kullanilabilecek stil rolleri. */
export function palet() {
  return db
    .select({ ad: s.stil.ad, rol: s.stil.rol, opaklik: s.stil.opaklik, cizgi: s.stil.cizgiTipi })
    .from(s.stil)
    .orderBy(asc(s.stil.ad))
    .all()
}

/** Sahne kurarken kullanilabilecek nesne tipleri, tabloda gecen haliyle. */
export function kullanilanNesneTipleri() {
  return db
    .select({ tip: s.nesne.tip, adet: sql<number>`count(*)` })
    .from(s.nesne)
    .groupBy(s.nesne.tip)
    .all()
}

export function konuVarMi(slug: string): boolean {
  return Boolean(db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, slug)).get())
}

export function konuAra(metin: string) {
  const q = `%${normalize(metin)}%`
  return db
    .select({ slug: s.konu.slug, ad: s.konu.ad, seviye: s.sinif.seviye })
    .from(s.konu)
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(like(s.konu.adNorm, q))
    .limit(20)
    .all()
}

/** Yazilmis olasilik deneyleri. */
export function deneyListele(sinif?: number) {
  const kosullar = []
  if (typeof sinif === 'number') kosullar.push(eq(s.sinif.seviye, sinif))
  return db
    .select({
      slug: s.deney.slug,
      ad: s.deney.ad,
      tur: s.deney.tur,
      cekimSayisi: s.deney.cekimSayisi,
      iadeVarMi: s.deney.iadeVarMi,
      konuSlug: s.konu.slug,
      seviye: s.sinif.seviye,
      olaySayisi: sql<number>`(select count(*) from olay where olay.deney_id = ${s.deney.id})`,
    })
    .from(s.deney)
    .innerJoin(s.konu, eq(s.konu.id, s.deney.konuId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(kosullar.length ? and(...kosullar) : undefined)
    .orderBy(asc(s.sinif.seviye))
    .all()
}

/** Kavram sozlugune giris ekler ve konulara baglar. */
export function kavramYaz(g: {
  alan: 'geometri' | 'olasilik'
  ad: string
  tanim: string
  latex?: string
  tanitilan?: string[]
  kullanilan?: string[]
}) {
  const alan = db.select({ id: s.alan.id }).from(s.alan).where(eq(s.alan.slug, g.alan)).get()
  if (!alan) throw new Error(`Alan bulunamadi: ${g.alan}`)
  const slug = slugla(g.ad)
  const eksik: string[] = []

  const yaz = ham.transaction(() => {
    db.insert(s.kavram)
      .values({
        alanId: alan.id,
        ad: g.ad,
        adNorm: normalize(g.ad),
        slug,
        tanim: g.tanim,
        latex: g.latex ?? null,
      })
      .onConflictDoUpdate({
        target: s.kavram.slug,
        set: { tanim: g.tanim, latex: g.latex ?? null, adNorm: normalize(g.ad) },
      })
      .run()
    const kavramId = db
      .select({ id: s.kavram.id })
      .from(s.kavram)
      .where(eq(s.kavram.slug, slug))
      .get()!.id

    db.delete(s.konuKavram).where(eq(s.konuKavram.kavramId, kavramId)).run()
    for (const [rol, liste] of [
      ['tanitilan', g.tanitilan ?? []],
      ['kullanilan', g.kullanilan ?? []],
    ] as const) {
      for (const konuSlug of liste) {
        const konu = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, konuSlug)).get()
        if (!konu) {
          eksik.push(konuSlug)
          continue
        }
        db.insert(s.konuKavram).values({ konuId: konu.id, kavramId, rol }).onConflictDoNothing().run()
      }
    }
    return kavramId
  })

  return { slug, id: yaz(), eksikKonular: eksik }
}

/** Konuya formul karti ekler. */
export function formulYaz(g: { konuSlug: string; ad: string; latex: string; aciklama?: string }) {
  const konu = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, g.konuSlug)).get()
  if (!konu) throw new Error(`Konu bulunamadi: ${g.konuSlug}`)
  const sonSira = db
    .select({ n: sql<number>`coalesce(max(${s.formul.sira}), 0)` })
    .from(s.formul)
    .get()!.n
  const [satir] = db
    .insert(s.formul)
    .values({
      konuId: konu.id,
      ad: g.ad,
      latex: g.latex,
      aciklama: g.aciklama ?? '',
      sira: sonSira + 1,
    })
    .returning({ id: s.formul.id })
    .all()
  return { id: satir!.id }
}
