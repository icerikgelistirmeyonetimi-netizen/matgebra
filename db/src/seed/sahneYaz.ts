import { eq, sql } from 'drizzle-orm'
import { bagimlilikGrafiginiDogrula, sahneSemasi, type Sahne } from '@matgebra/core'
import * as s from '../schema/index.js'
import type { Veritabani } from '../baglanti.js'

/**
 * Sahne yazici.
 *
 * Tek islemde sahneyi, ayarini, nesnelerini, bagimliliklarini, parametrelerini
 * ve adimlarini yazar. Yeniden calistirilabilir: ayni slug ile cagrilirsa
 * sahnenin icerigi bastan kurulur.
 *
 * MCP `sahne_yaz` araci da bu fonksiyonu cagiracak; dogrulama ve yazma
 * mantigi tek yerde kalsin diye tohumlamayla paylasilir.
 */

export interface YazmaSonucu {
  sahneId: number
  nesne: number
  adim: number
}

export function sahneYaz(db: Veritabani, ham: unknown): YazmaSonucu {
  const sahne: Sahne = sahneSemasi.parse(ham)

  const hatalar = bagimlilikGrafiginiDogrula(sahne.nesneler)
  if (hatalar.length) {
    throw new Error(`Sahne "${sahne.slug}" gecersiz:\n  ${hatalar.join('\n  ')}`)
  }

  const konu = db
    .select({ id: s.konu.id })
    .from(s.konu)
    .where(eq(s.konu.slug, sahne.konuSlug))
    .get()
  if (!konu) throw new Error(`Sahne "${sahne.slug}": konu bulunamadi (${sahne.konuSlug})`)

  const stilId = new Map<string, number>()
  for (const st of db.select({ id: s.stil.id, ad: s.stil.ad }).from(s.stil).all()) {
    stilId.set(st.ad, st.id)
  }

  db.insert(s.sahne)
    .values({
      konuId: konu.id,
      tur: sahne.tur,
      baslik: sahne.baslik,
      slug: sahne.slug,
      ozet: sahne.ozet,
      zorluk: sahne.zorluk,
      sira: sahne.sira,
      durum: sahne.durum,
    })
    .onConflictDoUpdate({
      target: s.sahne.slug,
      set: {
        konuId: konu.id,
        tur: sahne.tur,
        baslik: sahne.baslik,
        ozet: sahne.ozet,
        zorluk: sahne.zorluk,
        sira: sahne.sira,
        durum: sahne.durum,
        surum: sql`${s.sahne.surum} + 1`,
        guncelleme: sql`(datetime('now'))`,
      },
    })
    .run()

  const kayit = db
    .select({ id: s.sahne.id })
    .from(s.sahne)
    .where(eq(s.sahne.slug, sahne.slug))
    .get()!

  // Icerik bastan kurulur; nesne silinince bagimlilik ve parametre de gider.
  db.delete(s.nesne).where(eq(s.nesne.sahneId, kayit.id)).run()
  db.delete(s.adim).where(eq(s.adim.sahneId, kayit.id)).run()
  db.delete(s.sahneAyar).where(eq(s.sahneAyar.sahneId, kayit.id)).run()

  const a = sahne.ayar
  db.insert(s.sahneAyar)
    .values({
      sahneId: kayit.id,
      eksenModu: a.eksenModu,
      sinirX1: a.sinir[0],
      sinirY1: a.sinir[1],
      sinirX2: a.sinir[2],
      sinirY2: a.sinir[3],
      izgaraAdimi: a.izgaraAdimi,
      birim: a.birim,
      yapisma: a.yapisma,
      oranKilidi: a.oranKilidi,
      arkaPlanMedyaId: a.arkaPlanMedyaId,
      olcekJson: a.olcek ? JSON.stringify(a.olcek) : null,
    })
    .run()

  // Once butun nesneler, sonra bagimliliklar: bir nesne kendinden sonra
  // tanimlanmis bir nesneye de baglanabilir.
  const nesneId = new Map<string, number>()
  for (const n of sahne.nesneler) {
    const [satir] = db
      .insert(s.nesne)
      .values({
        sahneId: kayit.id,
        ad: n.ad,
        tip: n.tip,
        etiket: n.etiket ?? null,
        sira: n.sira,
        katman: n.katman,
        gorunur: n.gorunur,
        kilitli: n.kilitli,
        surukleme: n.surukleme,
        stilId: n.stil?.rol ? (stilId.get(n.stil.rol) ?? null) : null,
      })
      .returning({ id: s.nesne.id })
      .all()
    nesneId.set(n.ad, satir!.id)
  }

  for (const n of sahne.nesneler) {
    const id = nesneId.get(n.ad)!
    for (const p of n.parametreler) {
      db.insert(s.nesneParametre)
        .values({ nesneId: id, anahtar: p.anahtar, deger: String(p.deger), tur: p.tur })
        .run()
    }
    // Stil, palet rolu disinda deger tasiyorsa nesne parametresi olarak saklanir;
    // boylece sahne basina ince ayar mumkun kalir.
    for (const [anahtar, deger] of Object.entries(n.stil ?? {})) {
      if (anahtar === 'rol' || deger === undefined) continue
      db.insert(s.nesneParametre)
        .values({ nesneId: id, anahtar: `stil_${anahtar}`, deger: String(deger), tur: 'metin' })
        .run()
    }
    for (const b of n.bagimliliklar) {
      db.insert(s.nesneBagimlilik)
        .values({
          nesneId: id,
          kaynakNesneId: nesneId.get(b.kaynak)!,
          rol: b.rol,
          sira: b.sira,
        })
        .run()
    }
  }

  for (const ad of sahne.adimlar) {
    db.insert(s.adim)
      .values({
        sahneId: kayit.id,
        sira: ad.sira,
        baslik: ad.baslik,
        anlatim: ad.anlatim,
        vurguJson: JSON.stringify(ad.vurgu),
        aksiyonJson: ad.aksiyon ? JSON.stringify(ad.aksiyon) : null,
        beklenenJson: ad.beklenen ? JSON.stringify(ad.beklenen) : null,
      })
      .run()
  }

  return { sahneId: kayit.id, nesne: sahne.nesneler.length, adim: sahne.adimlar.length }
}
