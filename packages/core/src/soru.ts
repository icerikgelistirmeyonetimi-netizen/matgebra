import { z } from 'zod'
import { SORU_TIPLERI } from './sabitler.js'
import { normalize } from './metin.js'

/**
 * Soru cekirdegi.
 *
 * Cevap bicimleri ve denetim kurali burada; arayuz, MCP dogrulamasi ve
 * ileride yonetim paneli ayni kodu kullanir. Boylece "dogru cevap" tanimi
 * tek yerde kalir.
 *
 * Not: denetim istemcide yapiliyor, yani cevaplar tarayiciya iniyor. Bu bir
 * ogretim araci; sinav degil. Sinav kipi gerekirse denetim sunucuya tasinir
 * ve cevap alanlari yanittan cikarilir.
 */

export const cevapSemasi = z.discriminatedUnion('tip', [
  z.object({
    tip: z.literal('coktan_secmeli'),
    /** Dogru secenegin sirasi (0 tabanli). */
    dogru: z.number().int().min(0),
  }),
  z.object({
    tip: z.literal('dogru_yanlis'),
    dogru: z.boolean(),
  }),
  z.object({
    tip: z.literal('sayisal'),
    deger: z.number(),
    /** Kabul edilen sapma; olcum sorularinda kucuk bir pay birakilir. */
    tolerans: z.number().min(0).default(0),
    birim: z.string().default(''),
  }),
  z.object({
    tip: z.literal('tahtadan_olcum'),
    deger: z.number(),
    tolerans: z.number().min(0).default(0.05),
    birim: z.string().default(''),
  }),
  z.object({
    tip: z.literal('insa_gorevi'),
    /** Tahtada bulunmasi gereken nesne tipleri ve en az sayilari. */
    beklenen: z.record(z.number().int().min(1)),
  }),
  z.object({
    tip: z.literal('acik_uclu'),
    /** Ornek cevap; otomatik denetlenmez, ogrenciye karsilastirma icin gosterilir. */
    ornek: z.string(),
    /** Cevapta gecmesi beklenen anahtar kelimeler - ipucu amacli. */
    anahtarlar: z.array(z.string()).default([]),
  }),
])
export type Cevap = z.infer<typeof cevapSemasi>

export const soruSemasi = z.object({
  tip: z.enum(SORU_TIPLERI),
  govde: z.string().min(5),
  secenekler: z.array(z.string()).default([]),
  cevap: cevapSemasi,
  ipucu: z.string().default(''),
  cozum: z.string().default(''),
  zorluk: z.number().int().min(1).max(5).default(2),
  puan: z.number().int().min(1).max(20).default(1),
})
export type SoruTanimi = z.infer<typeof soruSemasi>

/** Ogrencinin verdigi cevap. */
export type VerilenCevap =
  | { tip: 'secim'; deger: number }
  | { tip: 'mantik'; deger: boolean }
  | { tip: 'sayi'; deger: number }
  | { tip: 'metin'; deger: string }
  | { tip: 'tahta'; sayim: Record<string, number> }

export interface DenetimSonucu {
  /** Otomatik denetlenemeyen sorularda null. */
  dogru: boolean | null
  aciklama: string
  /**
   * Insa gorevlerinde eksik nesneler, motorun tip adiyla.
   * Cekirdek motor terimlerini Turkceye cevirmez; adlandirma arayuzun isi.
   */
  eksikler?: Array<{ tip: string; adet: number }>
}

/** Cevabi denetler. Otomatik denetlenemeyen tiplerde dogru = null doner. */
export function cevapDenetle(cevap: Cevap, verilen: VerilenCevap): DenetimSonucu {
  switch (cevap.tip) {
    case 'coktan_secmeli':
      if (verilen.tip !== 'secim') return { dogru: null, aciklama: 'Bir seçenek işaretleyin.' }
      return {
        dogru: verilen.deger === cevap.dogru,
        aciklama: verilen.deger === cevap.dogru ? 'Doğru.' : 'Bu seçenek doğru değil.',
      }

    case 'dogru_yanlis':
      if (verilen.tip !== 'mantik') return { dogru: null, aciklama: 'Doğru ya da yanlış seçin.' }
      return {
        dogru: verilen.deger === cevap.dogru,
        aciklama: verilen.deger === cevap.dogru ? 'Doğru.' : 'Bu doğru değil.',
      }

    case 'sayisal':
    case 'tahtadan_olcum': {
      if (verilen.tip !== 'sayi') return { dogru: null, aciklama: 'Bir sayı yazın.' }
      const fark = Math.abs(verilen.deger - cevap.deger)
      const gecti = fark <= cevap.tolerans
      const birim = cevap.birim ? ` ${cevap.birim}` : ''
      return {
        dogru: gecti,
        aciklama: gecti
          ? 'Doğru.'
          : cevap.tolerans > 0
            ? `Beklenen ${cevap.deger}${birim} (±${cevap.tolerans}). Sizin cevabınız ${verilen.deger}${birim}.`
            : `Beklenen ${cevap.deger}${birim}, sizinki ${verilen.deger}${birim}.`,
      }
    }

    case 'insa_gorevi': {
      if (verilen.tip !== 'tahta') {
        return { dogru: null, aciklama: 'Tahtadaki çizim okunamadı.' }
      }
      const eksikler: Array<{ tip: string; adet: number }> = []
      for (const [tip, gereken] of Object.entries(cevap.beklenen)) {
        const mevcut = verilen.sayim[tip] ?? 0
        if (mevcut < gereken) eksikler.push({ tip, adet: gereken - mevcut })
      }
      return {
        dogru: eksikler.length === 0,
        aciklama: eksikler.length
          ? 'Çizimde eksik var.'
          : 'Beklenen nesnelerin hepsi tahtada.',
        eksikler,
      }
    }

    case 'acik_uclu': {
      if (verilen.tip !== 'metin') return { dogru: null, aciklama: 'Cevabınızı yazın.' }
      const metin = normalize(verilen.deger)
      const bulunan = cevap.anahtarlar.filter((a) => metin.includes(normalize(a)))
      return {
        dogru: null,
        aciklama: cevap.anahtarlar.length
          ? `${bulunan.length}/${cevap.anahtarlar.length} anahtar kavram geçti. Örnek cevapla karşılaştırın.`
          : 'Örnek cevapla karşılaştırın.',
      }
    }
  }
}

/** Soru tipine gore bos bir cevap kalibi - arayuzun ne soracagini bilmesi icin. */
export function bosCevap(tip: string): VerilenCevap | null {
  switch (tip) {
    case 'coktan_secmeli':
      return { tip: 'secim', deger: -1 }
    case 'dogru_yanlis':
      return { tip: 'mantik', deger: false }
    case 'sayisal':
    case 'tahtadan_olcum':
      return { tip: 'sayi', deger: Number.NaN }
    case 'acik_uclu':
      return { tip: 'metin', deger: '' }
    case 'insa_gorevi':
      return { tip: 'tahta', sayim: {} }
    default:
      return null
  }
}
