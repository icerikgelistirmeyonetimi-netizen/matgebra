import { eq, sql } from 'drizzle-orm'
import { deneySemasi, teorikOlasilik, type Deney } from '@matgebra/core'
import * as s from '../schema/index.js'
import type { Veritabani } from '../baglanti.js'

/**
 * Deney yazici.
 *
 * Deneyi, sonuc uzayini ve olaylari tek islemde yazar. Her olayin teorik
 * olasiligi yazma aninda hesaplanip saklanir; arayuz onu deneysel degerle
 * yan yana gosterir. Yeniden calistirilabilir.
 *
 * sahneYaz gibi bu da MCP `deney_yaz` araciyla paylasilir; tohumlama ile
 * arac uzerinden uretim ayni kapidan gecer.
 */
export function deneyYaz(db: Veritabani, ham: unknown): { deneyId: number; olay: number } {
  const deney: Deney = deneySemasi.parse(ham)

  const konu = db
    .select({ id: s.konu.id })
    .from(s.konu)
    .where(eq(s.konu.slug, deney.konuSlug))
    .get()
  if (!konu) throw new Error(`Deney "${deney.slug}": konu bulunamadi (${deney.konuSlug})`)

  db.insert(s.deney)
    .values({
      konuId: konu.id,
      tur: deney.tur,
      ad: deney.ad,
      slug: deney.slug,
      aciklama: deney.aciklama,
      bagimsizMi: deney.bagimsizMi,
      iadeVarMi: deney.iadeVarMi,
      cekimSayisi: deney.cekimSayisi,
      durum: 'yayin',
    })
    .onConflictDoUpdate({
      target: s.deney.slug,
      set: {
        konuId: konu.id,
        tur: deney.tur,
        ad: deney.ad,
        aciklama: deney.aciklama,
        bagimsizMi: deney.bagimsizMi,
        iadeVarMi: deney.iadeVarMi,
        cekimSayisi: deney.cekimSayisi,
        surum: sql`${s.deney.surum} + 1`,
        guncelleme: sql`(datetime('now'))`,
      },
    })
    .run()

  const kayit = db
    .select({ id: s.deney.id })
    .from(s.deney)
    .where(eq(s.deney.slug, deney.slug))
    .get()!

  db.delete(s.deneySonuc).where(eq(s.deneySonuc.deneyId, kayit.id)).run()
  db.delete(s.olay).where(eq(s.olay.deneyId, kayit.id)).run()

  for (const c of deney.sonuclar) {
    db.insert(s.deneySonuc)
      .values({
        deneyId: kayit.id,
        sonuc: c.sonuc,
        agirlik: c.agirlik,
        renkAnahtari: c.renkAnahtari,
        sira: c.sira,
      })
      .run()
  }

  for (const o of deney.olaylar) {
    db.insert(s.olay)
      .values({
        deneyId: kayit.id,
        ad: o.ad,
        kosulJson: JSON.stringify({ sonuclar: o.sonuclar, kosul: o.kosul, deger: o.deger }),
        beklenenOlasilik: teorikOlasilik(deney, o),
      })
      .run()
  }

  return { deneyId: kayit.id, olay: deney.olaylar.length }
}
