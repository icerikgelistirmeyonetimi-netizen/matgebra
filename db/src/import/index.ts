import { sql } from 'drizzle-orm'
import { kaynakAc, veritabaniAc } from '../baglanti.js'
import * as s from '../schema/index.js'
import { kazanimKoduAyir, maddeleriAyir, normalize, slugla, temaKoduAyir, temizle } from '../metin.js'
import {
  alanBelirle,
  BOLUM_ADLARI,
  dersSaatiCikar,
  KADEMELER,
  MATEMATIK_DERSLERI,
  ozetCikar,
  seviyeCevir,
  sinifAdi,
  uniteBolumleriOku,
  type UniteBolumleri,
} from './kaynak.js'

/**
 * MEB mufredatini ice aktarir.
 *
 * Tek yonludur: veri/icerik.db ve veri/unite/*.json okunur, matgebra.db
 * yazilir. Yeniden calistirilabilir - mufredat tablolari once bosaltilir,
 * bizim urettigimiz taksonomi ve sahne verisine dokunulmaz.
 *
 * Kapsam: yalnizca matematik dersleri. Kaynakta 78 ders var; digerleri
 * projenin konusu degil.
 */

interface KaynakKayit {
  id: string
  ders_adi: string
  sinif: string
  unite: string
  unite_id: string | null
  kazanim: string
  aciklama: string | null
}

function main(): void {
  const kaynak = kaynakAc()
  const { ham, db } = veritabaniAc()

  console.log('MEB mufredati ice aktariliyor...\n')

  const uniteHtml = new Map<string, string>()
  for (const r of kaynak
    .prepare('SELECT id, html FROM unite_bilgileri')
    .all() as Array<{ id: string; html: string | null }>) {
    if (r.html) uniteHtml.set(String(r.id), r.html)
  }

  const dersAdlari = MATEMATIK_DERSLERI.map((d) => d.kaynak)
  const yerTutucu = dersAdlari.map(() => '?').join(',')
  const kayitlar = kaynak
    .prepare(
      `SELECT id, ders_adi, sinif, unite, unite_id, kazanim, aciklama
       FROM icerik_kayitlari
       WHERE ders_adi IN (${yerTutucu}) AND durum = '1'
       ORDER BY ders_adi, CAST(sinif AS INTEGER), unite, CAST(id AS INTEGER)`,
    )
    .all(...dersAdlari) as KaynakKayit[]

  console.log(`kaynakta ${kayitlar.length} matematik kazanimi bulundu`)

  const aktar = ham.transaction(() => {
    // Mufredat tablolari sifirlanir; taksonomi ve sahne verisi korunur.
    db.delete(s.kazanimMaddesi).run()
    db.delete(s.kazanim).run()
    db.delete(s.temaBolum).run()
    db.delete(s.tema).run()
    db.delete(s.sinif).run()
    db.delete(s.ders).run()
    db.delete(s.kademe).run()

    const kademeId = new Map<string, number>()
    for (const k of KADEMELER) {
      const [satir] = db.insert(s.kademe).values({ ...k }).returning({ id: s.kademe.id }).all()
      kademeId.set(k.slug, satir!.id)
    }

    const dersId = new Map<string, number>()
    for (const d of MATEMATIK_DERSLERI) {
      const [satir] = db
        .insert(s.ders)
        .values({ ad: d.ad, slug: slugla(d.ad), kaynakDersAdi: d.kaynak })
        .returning({ id: s.ders.id })
        .all()
      dersId.set(d.kaynak, satir!.id)
    }

    const sinifId = new Map<string, number>()
    const sinifBul = (kademeSlug: string, seviye: number): number => {
      const anahtar = `${kademeSlug}:${seviye}`
      const mevcut = sinifId.get(anahtar)
      if (mevcut) return mevcut
      const ad = sinifAdi(seviye)
      const [satir] = db
        .insert(s.sinif)
        .values({
          kademeId: kademeId.get(kademeSlug)!,
          seviye,
          ad,
          slug: slugla(`${kademeSlug} ${ad}`),
          sira: seviye,
        })
        .returning({ id: s.sinif.id })
        .all()
      sinifId.set(anahtar, satir!.id)
      return satir!.id
    }

    const temaId = new Map<string, number>()
    let temaSayisi = 0
    let kazanimSayisi = 0
    let maddeSayisi = 0
    let bolumSayisi = 0

    for (const kayit of kayitlar) {
      const dersBilgi = MATEMATIK_DERSLERI.find((d) => d.kaynak === kayit.ders_adi)!
      const seviye = seviyeCevir(kayit.sinif)
      if (seviye < 0) continue
      const sId = sinifBul(dersBilgi.kademe, seviye)

      const uniteAnahtar = kayit.unite_id ?? `${kayit.ders_adi}|${kayit.sinif}|${kayit.unite}`
      let tId = temaId.get(uniteAnahtar)

      if (!tId) {
        const { kod, ad, sira } = temaKoduAyir(kayit.unite)
        const html = kayit.unite_id ? (uniteHtml.get(kayit.unite_id) ?? null) : null
        const [satir] = db
          .insert(s.tema)
          .values({
            dersId: dersId.get(kayit.ders_adi)!,
            sinifId: sId,
            kod,
            ad,
            adNorm: normalize(ad),
            sira,
            dersSaati: dersSaatiCikar(html),
            ozet: ozetCikar(html),
            kaynakUniteId: kayit.unite_id,
            alanSlug: alanBelirle(kayit.unite),
          })
          .returning({ id: s.tema.id })
          .all()
        tId = satir!.id
        temaId.set(uniteAnahtar, tId)
        temaSayisi++

        if (kayit.unite_id) {
          const bolumler = uniteBolumleriOku(kayit.unite_id)
          for (const [alan, tur] of Object.entries(BOLUM_ADLARI)) {
            const icerik = bolumler[alan as keyof UniteBolumleri]
            if (icerik) {
              db.insert(s.temaBolum).values({ temaId: tId, tur, icerik }).run()
              bolumSayisi++
            }
          }
        }
      }

      const { kod, govde } = kazanimKoduAyir(kayit.kazanim)
      const [kSatir] = db
        .insert(s.kazanim)
        .values({
          temaId: tId,
          kod: kod || `?.${kayit.id}`,
          metin: govde,
          metinNorm: normalize(govde),
          sira: kazanimSayisi,
          kaynakId: kayit.id,
        })
        .returning({ id: s.kazanim.id })
        .all()
      kazanimSayisi++

      const maddeler = maddeleriAyir(kayit.aciklama)
      maddeler.forEach((m, i) => {
        db.insert(s.kazanimMaddesi)
          .values({ kazanimId: kSatir!.id, harf: m.harf, metin: temizle(m.metin), sira: i })
          .run()
        maddeSayisi++
      })
    }

    return { temaSayisi, kazanimSayisi, maddeSayisi, bolumSayisi }
  })

  const sonuc = aktar()

  // Tam metin arama dizinini yeniden kur.
  ham.exec('DELETE FROM kazanim_fts')
  ham
    .prepare(
      `INSERT INTO kazanim_fts(rowid, kod, metin, tema, sinif)
       SELECT k.id, k.kod, k.metin_norm, t.ad_norm, si.seviye
       FROM kazanim k
       JOIN tema t ON t.id = k.tema_id
       JOIN sinif si ON si.id = t.sinif_id`,
    )
    .run()

  console.log(`
tema           : ${sonuc.temaSayisi}
tema bolumu    : ${sonuc.bolumSayisi}
kazanim        : ${sonuc.kazanimSayisi}
kazanim maddesi: ${sonuc.maddeSayisi}`)

  const alanDagilimi = db
    .select({
      alan: s.tema.alanSlug,
      tema: sql<number>`count(distinct ${s.tema.id})`,
      kazanim: sql<number>`count(${s.kazanim.id})`,
    })
    .from(s.tema)
    .leftJoin(s.kazanim, sql`${s.kazanim.temaId} = ${s.tema.id}`)
    .groupBy(s.tema.alanSlug)
    .all()

  console.log('\nalan dagilimi:')
  for (const a of alanDagilimi) {
    console.log(`  ${(a.alan ?? 'kapsam disi').padEnd(12)} ${String(a.tema).padStart(3)} tema  ${String(a.kazanim).padStart(4)} kazanim`)
  }

  kaynak.close()
  ham.close()
}

main()
