/**
 * Alan sabitleri. Veritabani, API, MCP ve arayuz bu listeleri paylasir.
 * Buraya eklenen her deger, sema dogrulamasindan araç çubuğuna kadar akar.
 */

/** Ogretim kademeleri. */
export const KADEMELER = ['ilkokul', 'ortaokul', 'lise'] as const
export type Kademe = (typeof KADEMELER)[number]

/** Calisma alanlari. */
export const ALANLAR = ['geometri', 'olasilik'] as const
export type Alan = (typeof ALANLAR)[number]

/**
 * Koordinat düzleminin gorunum kipi.
 * 1-3. sinifta eksen ve sayi yok (kroki), 3-5'te sayisiz izgara,
 * 6. siniftan itibaren tam koordinat düzlemi.
 */
export const EKSEN_MODLARI = ['yok', 'izgara', 'tam'] as const
export type EksenModu = (typeof EKSEN_MODLARI)[number]

/** Sahne sablonlari. */
export const SAHNE_TURLERI = [
  'kesif',
  'gercek_hayat',
  'insa',
  'olasilik',
  'bos_tuval',
] as const
export type SahneTuru = (typeof SAHNE_TURLERI)[number]

/** Icerik yasam dongusu. Yonetim paneli bu akisi kullanacak. */
export const DURUMLAR = ['taslak', 'inceleme', 'yayin', 'arsiv'] as const
export type Durum = (typeof DURUMLAR)[number]

/** Tahtaya konabilecek nesne tipleri. Motor bagimsizdir. */
export const NESNE_TIPLERI = [
  // temel
  'nokta',
  'nokta_uzerinde',
  // Iki kaynaktan bilesen alir: (A.x, B.y). Dikdortgen ve eksene paralel
  // yapilar bununla kurulur; tek surukleneblir kose yeter.
  'nokta_bilesen',
  'orta_nokta',
  'kesisim',
  'dogru_parcasi',
  'isin',
  'dogru',
  'vektor',
  // sekil
  'cokgen',
  'duzgun_cokgen',
  'cember',
  'yay',
  'daire_dilimi',
  'elips',
  'parabol',
  'hiperbol',
  // insa
  'dikme',
  'paralel',
  'orta_dikme',
  'aci_ortay',
  'teget',
  // olcum
  'aci',
  'olcum_uzunluk',
  'olcum_aci',
  'olcum_alan',
  'olcum_cevre',
  'olcum_egim',
  // donusum
  'oteleme',
  'yansima',
  'dondurme',
  'homoteti',
  // ileri
  'fonksiyon',
  'kaydirici',
  'egri_yeri',
  'iz',
  // not
  'metin',
  'etiket',
  'kalem',
] as const
export type NesneTipi = (typeof NESNE_TIPLERI)[number]

/** Bir nesnenin baska bir nesneye baglanma rolu. */
export const BAGIMLILIK_ROLLERI = [
  'uc1',
  'uc2',
  'uc3',
  'merkez',
  'uzerinde',
  'yaricap_noktasi',
  'kaynak',
  'hedef',
  'eksen',
  'kesisen_a',
  'kesisen_b',
  'kose',
  /** Bilesen noktasinda: apsis (x) bu kaynaktan, ordinat (y) digerinden. */
  'apsis',
  'ordinat',
] as const
export type BagimlilikRolu = (typeof BAGIMLILIK_ROLLERI)[number]

/** Palet rolleri. styles.css icindeki @theme tokenlariyla birebir eslesir. */
export const PALET_ROLLERI = [
  'nane',
  'lavanta',
  'seftali',
  'gok',
  'gul',
  'tereyagi',
  'notr',
] as const
export type PaletRolu = (typeof PALET_ROLLERI)[number]

/** Olasilik deneyi turleri. */
export const DENEY_TURLERI = ['zar', 'para', 'cark', 'torba', 'kart', 'ozel'] as const
export type DeneyTuru = (typeof DENEY_TURLERI)[number]

/** Soru tipleri. */
export const SORU_TIPLERI = [
  'coktan_secmeli',
  'sayisal',
  'tahtadan_olcum',
  'insa_gorevi',
  'dogru_yanlis',
  'acik_uclu',
] as const
export type SoruTipi = (typeof SORU_TIPLERI)[number]
