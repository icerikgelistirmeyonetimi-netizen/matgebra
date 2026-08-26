import { z } from 'zod'
import {
  BAGIMLILIK_ROLLERI,
  DURUMLAR,
  EKSEN_MODLARI,
  NESNE_TIPLERI,
  PALET_ROLLERI,
  SAHNE_TURLERI,
} from './sabitler.js'

/**
 * Sahne JSON semasi.
 *
 * Bu, veritabani satirlari ile motor arasindaki tek sozlesmedir:
 *  - API sahneyi bu sekle serilestirip arayuze verir
 *  - MCP `sahne_yaz` araci bu semayla dogrular
 *  - Cizim atolyesi tahtayi bu sekle geri serilestirir
 *
 * Kasitli olarak motor bagimsizdir: JSXGraph terimleri gecmez.
 */

export const paletRoluSemasi = z.enum(PALET_ROLLERI)

export const stilSemasi = z.object({
  rol: paletRoluSemasi.default('gok'),
  dolgu: z.string().optional(),
  kenar: z.string().optional(),
  kalinlik: z.number().min(0).max(12).default(2),
  opaklik: z.number().min(0).max(1).default(1),
  cizgiTipi: z.enum(['duz', 'kesik', 'noktali']).default('duz'),
  noktaBoyutu: z.number().min(1).max(12).default(4),
})
export type Stil = z.infer<typeof stilSemasi>

export const parametreSemasi = z.object({
  anahtar: z.string().min(1),
  /** Sayi, metin ya da bagimli ifade ("A.x + 2") olabilir. */
  deger: z.union([z.number(), z.string(), z.boolean()]),
  tur: z.enum(['sayi', 'metin', 'mantik', 'ifade']).default('sayi'),
})

export const bagimlilikSemasi = z.object({
  /** Kaynak nesnenin sahne icindeki adi (id degil) — insan okur. */
  kaynak: z.string().min(1),
  rol: z.enum(BAGIMLILIK_ROLLERI),
  sira: z.number().int().min(0).default(0),
})

export const nesneSemasi = z.object({
  /** Sahne icinde benzersiz. Ornek: "A", "d1", "cember_c". */
  ad: z.string().min(1).max(64),
  tip: z.enum(NESNE_TIPLERI),
  etiket: z.string().max(120).optional(),
  sira: z.number().int().min(0).default(0),
  katman: z.number().int().min(0).max(20).default(0),
  gorunur: z.boolean().default(true),
  kilitli: z.boolean().default(false),
  /** 'yok' = sabit, 'serbest' = her yone, 'x'/'y' = tek eksende. */
  surukleme: z.enum(['yok', 'serbest', 'x', 'y', 'uzerinde']).default('yok'),
  stil: stilSemasi.partial().optional(),
  parametreler: z.array(parametreSemasi).default([]),
  bagimliliklar: z.array(bagimlilikSemasi).default([]),
})
export type Nesne = z.infer<typeof nesneSemasi>

export const olcekSemasi = z.object({
  /** Arka plan gorselini gercek dunyaya baglayan iki referans nokta. */
  referansA: z.tuple([z.number(), z.number()]),
  referansB: z.tuple([z.number(), z.number()]),
  gercekUzunluk: z.number().positive(),
  birim: z.string().min(1).max(16),
  aciklama: z.string().max(280).optional(),
})

export const sahneAyarSemasi = z.object({
  eksenModu: z.enum(EKSEN_MODLARI).default('tam'),
  /** [solX, ustY, sagX, altY] — JSXGraph sirasi degil, matematiksel sinir kutusu. */
  sinir: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([-10, 10, 10, -10]),
  izgaraAdimi: z.number().positive().default(1),
  birim: z.string().max(16).default(''),
  yapisma: z.enum(['yok', 'izgara', 'tamsayi', 'nesne']).default('izgara'),
  oranKilidi: z.boolean().default(true),
  arkaPlanMedyaId: z.number().int().positive().nullable().default(null),
  olcek: olcekSemasi.nullable().default(null),
})
export type SahneAyar = z.infer<typeof sahneAyarSemasi>

export const adimSemasi = z.object({
  sira: z.number().int().min(1),
  baslik: z.string().min(1).max(160),
  anlatim: z.string().min(1),
  /** Bu adimda vurgulanacak nesne adlari. */
  vurgu: z.array(z.string()).default([]),
  /** Adim acilinca otomatik uygulanacak degisiklikler. */
  aksiyon: z.record(z.unknown()).nullable().default(null),
  /** Ogrenciden beklenen sonuc (insa gorevlerinde kontrol icin). */
  beklenen: z.record(z.unknown()).nullable().default(null),
})
export type Adim = z.infer<typeof adimSemasi>

export const sahneSemasi = z.object({
  slug: z
    .string()
    .min(3)
    .max(96)
    .regex(/^[a-z0-9-]+$/, 'slug yalniz kucuk harf, rakam ve tire icerebilir'),
  konuSlug: z.string().min(3).max(96),
  tur: z.enum(SAHNE_TURLERI),
  baslik: z.string().min(1).max(160),
  ozet: z.string().max(600).default(''),
  zorluk: z.number().int().min(1).max(5).default(2),
  sira: z.number().int().min(0).default(0),
  durum: z.enum(DURUMLAR).default('taslak'),
  ayar: sahneAyarSemasi,
  nesneler: z.array(nesneSemasi).default([]),
  adimlar: z.array(adimSemasi).default([]),
})
export type Sahne = z.infer<typeof sahneSemasi>

/**
 * Bagimlilik grafigini dogrular: her kaynak tanimli mi, dongu var mi.
 * MCP `sahne_yaz` ve cizim kaydetme bu kontrolden gecer.
 */
export function bagimlilikGrafiginiDogrula(nesneler: Nesne[]): string[] {
  const hatalar: string[] = []
  const adlar = new Set(nesneler.map((n) => n.ad))

  for (const n of nesneler) {
    if (nesneler.filter((d) => d.ad === n.ad).length > 1) {
      hatalar.push(`Yinelenen nesne adi: ${n.ad}`)
    }
    for (const b of n.bagimliliklar) {
      if (!adlar.has(b.kaynak)) {
        hatalar.push(`${n.ad} tanimsiz bir nesneye bagli: ${b.kaynak}`)
      }
    }
  }

  const durum = new Map<string, 'beyaz' | 'gri' | 'siyah'>()
  const komsu = new Map(nesneler.map((n) => [n.ad, n.bagimliliklar.map((b) => b.kaynak)]))
  const gez = (ad: string, yol: string[]): void => {
    const d = durum.get(ad) ?? 'beyaz'
    if (d === 'siyah') return
    if (d === 'gri') {
      hatalar.push(`Dongusel bagimlilik: ${[...yol, ad].join(' -> ')}`)
      return
    }
    durum.set(ad, 'gri')
    for (const k of komsu.get(ad) ?? []) {
      if (adlar.has(k)) gez(k, [...yol, ad])
    }
    durum.set(ad, 'siyah')
  }
  for (const n of nesneler) gez(n.ad, [])

  return [...new Set(hatalar)]
}
