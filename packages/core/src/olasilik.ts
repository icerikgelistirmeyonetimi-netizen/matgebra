import { z } from 'zod'
import { DENEY_TURLERI } from './sabitler.js'

/**
 * Olasilik cekirdegi.
 *
 * Tohumlu rastgelelik: ayni tohum ayni sonuc dizisini uretir. Ders tekrar
 * edilebilir olsun diye sart - ogretmen tahtada gordugunu ogrenciye aynen
 * yeniden gosterebilmeli, kosum kaydi da sonradan dogrulanabilmeli.
 *
 * Benzetim burada, arayuzden bagimsiz duruyor; hem tarayici hem sunucu
 * ayni kodu calistirir, bu yuzden kayitli kosum her yerde ayni cikar.
 */

/** Sonuc uzayinin bir elemani. */
export const deneySonucuSemasi = z.object({
  sonuc: z.string().min(1),
  /** Adil deneyde hepsi esit; hileli zarda farklilasir. */
  agirlik: z.number().positive().default(1),
  renkAnahtari: z.string().default('gok'),
  sira: z.number().int().min(0).default(0),
})
export type DeneySonucu = z.infer<typeof deneySonucuSemasi>

export const deneySemasi = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  konuSlug: z.string(),
  tur: z.enum(DENEY_TURLERI),
  ad: z.string().min(2),
  aciklama: z.string().default(''),
  /** Ardisik denemeler birbirinden bagimsiz mi. */
  bagimsizMi: z.boolean().default(true),
  /** Torba deneylerinde cekilen geri konuyor mu. */
  iadeVarMi: z.boolean().default(true),
  /** Kac cekim bir denemeyi olusturur (iki zar = 2). */
  cekimSayisi: z.number().int().min(1).max(6).default(1),
  sonuclar: z.array(deneySonucuSemasi).min(2),
  olaylar: z
    .array(
      z.object({
        ad: z.string(),
        /** Bu olaya dahil sonuclar; bos ise kosul ifadesi kullanilir. */
        sonuclar: z.array(z.string()).default([]),
        /** toplam / en_az / hepsi_ayni gibi bilesik kosullar. */
        kosul: z.string().nullable().default(null),
        deger: z.number().nullable().default(null),
      }),
    )
    .default([]),
})
export type Deney = z.infer<typeof deneySemasi>

/**
 * mulberry32 - kucuk, hizli, tohumlu uretec.
 * Math.random yerine bunu kullaniyoruz cunku tekrar edilebilirlik gerek.
 */
export function uretec(tohum: number): () => number {
  let a = tohum >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Agirliklara gore bir sonuc secer. */
function agirlikliSec(sonuclar: DeneySonucu[], rastgele: number): DeneySonucu {
  const toplam = sonuclar.reduce((t, s) => t + s.agirlik, 0)
  let esik = rastgele * toplam
  for (const s of sonuclar) {
    esik -= s.agirlik
    if (esik <= 0) return s
  }
  return sonuclar[sonuclar.length - 1]!
}

export interface Deneme {
  /** Bu denemede cekilen sonuclar; tek cekimde tek elemanli. */
  cekimler: string[]
  /** Cok cekimli deneylerde birlesik etiket: "3+5". */
  etiket: string
}

/**
 * Deneyi n kez kosar.
 *
 * Iadesiz torbada her deneme icin havuz bastan kurulur: bir "deneme"
 * cekimSayisi kadar cekimden olusur ve deneme bitince torba yenilenir.
 */
export function kos(deney: Deney, tohum: number, denemeSayisi: number): Deneme[] {
  const rnd = uretec(tohum)
  const denemeler: Deneme[] = []

  for (let i = 0; i < denemeSayisi; i++) {
    const havuz = deney.iadeVarMi ? null : [...deney.sonuclar]
    const cekimler: string[] = []
    for (let c = 0; c < deney.cekimSayisi; c++) {
      const kaynak = havuz ?? deney.sonuclar
      if (!kaynak.length) break
      const secilen = agirlikliSec(kaynak, rnd())
      cekimler.push(secilen.sonuc)
      if (havuz) havuz.splice(havuz.indexOf(secilen), 1)
    }
    denemeler.push({ cekimler, etiket: cekimler.join('+') })
  }
  return denemeler
}

/** Sonuc sayimlari: { "3": 17, "5": 12, ... } */
export function sayim(denemeler: Deneme[], birlesik = false): Record<string, number> {
  const s: Record<string, number> = {}
  for (const d of denemeler) {
    if (birlesik) {
      s[d.etiket] = (s[d.etiket] ?? 0) + 1
    } else {
      for (const c of d.cekimler) s[c] = (s[c] ?? 0) + 1
    }
  }
  return s
}

/** Bir denemenin olaya uyup uymadigi. */
export function olayGerceklesti(
  olay: Deney['olaylar'][number],
  deneme: Deneme,
): boolean {
  if (olay.kosul === 'toplam' && olay.deger !== null) {
    const t = deneme.cekimler.reduce((a, c) => a + (Number(c) || 0), 0)
    return t === olay.deger
  }
  if (olay.kosul === 'toplam_en_az' && olay.deger !== null) {
    const t = deneme.cekimler.reduce((a, c) => a + (Number(c) || 0), 0)
    return t >= olay.deger
  }
  if (olay.kosul === 'hepsi_ayni') {
    return new Set(deneme.cekimler).size === 1
  }
  if (olay.kosul === 'en_az_bir' && olay.sonuclar.length) {
    return deneme.cekimler.some((c) => olay.sonuclar.includes(c))
  }
  if (olay.kosul === 'hepsi' && olay.sonuclar.length) {
    return deneme.cekimler.every((c) => olay.sonuclar.includes(c))
  }
  return deneme.cekimler.some((c) => olay.sonuclar.includes(c))
}

/**
 * Bir olayin teorik olasiligi.
 *
 * Tek cekimli deneylerde agirlik orani; cok cekimli deneylerde butun
 * sonuc uzayi sayilir. Sonuc uzayi 10.000'i asarsa null doner - o zaman
 * yalnizca deneysel olasilik gosterilir.
 */
export function teorikOlasilik(
  deney: Deney,
  olay: Deney['olaylar'][number],
): number | null {
  const toplamAgirlik = deney.sonuclar.reduce((t, s) => t + s.agirlik, 0)

  if (deney.cekimSayisi === 1) {
    const uygun = deney.sonuclar.filter((s) =>
      olayGerceklesti(olay, { cekimler: [s.sonuc], etiket: s.sonuc }),
    )
    return uygun.reduce((t, s) => t + s.agirlik, 0) / toplamAgirlik
  }

  const boyut = deney.sonuclar.length ** deney.cekimSayisi
  if (boyut > 10000) return null

  let uygunAgirlik = 0
  let tumAgirlik = 0
  const gez = (derinlik: number, secilen: DeneySonucu[], agirlik: number): void => {
    if (derinlik === deney.cekimSayisi) {
      tumAgirlik += agirlik
      const deneme = { cekimler: secilen.map((s) => s.sonuc), etiket: secilen.map((s) => s.sonuc).join('+') }
      if (olayGerceklesti(olay, deneme)) uygunAgirlik += agirlik
      return
    }
    for (const s of deney.sonuclar) {
      // Iadesiz cekimde ayni sonuc tekrar secilemez.
      if (!deney.iadeVarMi && secilen.includes(s)) continue
      gez(derinlik + 1, [...secilen, s], agirlik * s.agirlik)
    }
  }
  gez(0, [], 1)
  return tumAgirlik === 0 ? null : uygunAgirlik / tumAgirlik
}

/** Butun sonuc uzayi - iki zar icin 6x6 izgarasi gibi gosterimler icin. */
export function sonucUzayi(deney: Deney): Deneme[] {
  if (deney.sonuclar.length ** deney.cekimSayisi > 10000) return []
  const sonuc: Deneme[] = []
  const gez = (derinlik: number, secilen: string[]): void => {
    if (derinlik === deney.cekimSayisi) {
      sonuc.push({ cekimler: [...secilen], etiket: secilen.join('+') })
      return
    }
    for (const s of deney.sonuclar) {
      if (!deney.iadeVarMi && secilen.includes(s.sonuc)) continue
      gez(derinlik + 1, [...secilen, s.sonuc])
    }
  }
  gez(0, [])
  return sonuc
}

/**
 * Goreli frekansin adim adim seyri - yakinsama grafigi icin.
 * Her noktada o ana kadarki oran verilir.
 */
export function yakinsama(
  denemeler: Deneme[],
  olay: Deney['olaylar'][number],
  nokta = 60,
): Array<{ deneme: number; oran: number }> {
  if (!denemeler.length) return []
  const adim = Math.max(1, Math.floor(denemeler.length / nokta))
  const seyir: Array<{ deneme: number; oran: number }> = []
  let uygun = 0
  for (let i = 0; i < denemeler.length; i++) {
    if (olayGerceklesti(olay, denemeler[i]!)) uygun++
    if ((i + 1) % adim === 0 || i === denemeler.length - 1) {
      seyir.push({ deneme: i + 1, oran: uygun / (i + 1) })
    }
  }
  return seyir
}
