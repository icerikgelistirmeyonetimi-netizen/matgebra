/**
 * API istemcisi.
 *
 * Tek kural: veri daima buradan gelir. Hicbir bilesen icerik verisini
 * kendi icinde tasimaz.
 */

const TEMEL = '/api'

async function getir<T>(yol: string): Promise<T> {
  const yanit = await fetch(`${TEMEL}${yol}`)
  if (!yanit.ok) {
    const govde = await yanit.text()
    throw new Error(`${yanit.status} ${yol}: ${govde.slice(0, 200)}`)
  }
  return (await yanit.json()) as T
}

export interface SinifOzeti {
  id: number
  seviye: number
  ad: string
  slug: string
  konuSayisi: Record<string, number>
}

export interface KademeDugumu {
  id: number
  slug: string
  ad: string
  sira: number
  siniflar: SinifOzeti[]
}

export interface KonuOzeti {
  id: number
  ad: string
  slug: string
  ozet: string
  zorluk: number
  sira: number
  durum: string
  alan: string
  alanAd: string
  seviye: number
  sahneSayisi: number
  ornekSayisi: number
  kazanimSayisi: number
}

export interface KazanimMaddesi {
  id: number
  harf: string
  metin: string
}

export interface Kazanim {
  id: number
  kod: string
  metin: string
  temaAd: string
  temaKod: string
  temaOzet: string
  dersSaati: number | null
  maddeler: KazanimMaddesi[]
}

export interface KonuBagi {
  ad: string
  slug: string
  seviye: number
  alan: string
}

export interface SahneOzeti {
  id: number
  slug: string
  baslik: string
  tur: string
  ozet: string
  zorluk: number
}

export interface KonuAyrinti extends Omit<KonuOzeti, 'sira' | 'sahneSayisi' | 'ornekSayisi' | 'kazanimSayisi'> {
  sinifAd: string
  kazanimlar: Kazanim[]
  onKosullar: KonuBagi[]
  sonrakiKonular: KonuBagi[]
  sahneler: SahneOzeti[]
  ornekler: Array<{ id: number; baslik: string; hikaye: string; soru: string }>
}

export interface Arac {
  id: number
  anahtar: string
  etiket: string
  grup: string
  ikon: string
  minSinif: number
  kisayol: string | null
  sira: number
}

export interface AramaSonucu {
  konular: Array<{ ad: string; slug: string; ozet: string; alan: string; seviye: number }>
  kazanimlar: Array<{ kod: string; metin: string; temaAd: string; seviye: number; alan: string | null }>
}


export interface SahneNesnesi {
  ad: string
  tip: string
  etiket: string | null
  sira: number
  katman: number
  gorunur: boolean
  kilitli: boolean
  surukleme: string
  stil: {
    rol: string
    kalinlik: number
    opaklik: number
    cizgiTipi: string
    noktaBoyutu: number
  }
  parametreler: Array<{ anahtar: string; deger: string; tur: string }>
  bagimliliklar: Array<{ kaynak: string; rol: string; sira: number }>
}

export interface SahneAdimi {
  sira: number
  baslik: string
  anlatim: string
  vurgu: string[]
}

export interface SahneVerisi {
  id: number
  slug: string
  baslik: string
  tur: string
  ozet: string
  zorluk: number
  durum: string
  surum: number
  konuSlug: string
  konuAd: string
  alan: string
  alanAd: string
  seviye: number
  sinifAd: string
  ayar: {
    eksenModu: 'yok' | 'izgara' | 'tam'
    sinir: [number, number, number, number]
    izgaraAdimi: number
    birim: string
    yapisma: string
    oranKilidi: boolean
    olcek: unknown
  }
  nesneler: SahneNesnesi[]
  adimlar: SahneAdimi[]
  ornek: {
    baslik: string
    hikaye: string
    soru: string
    olcekAciklama: string
    kaynak: string
  } | null
}

export const api = {
  agac: () => getir<KademeDugumu[]>('/mufredat/agac'),
  alanlar: () => getir<Array<{ id: number; slug: string; ad: string; renkAnahtari: string }>>('/alanlar'),
  konular: (seviye: number, alan?: string) =>
    getir<KonuOzeti[]>(`/siniflar/${seviye}/konular${alan ? `?alan=${alan}` : ''}`),
  konu: (slug: string) => getir<KonuAyrinti>(`/konular/${slug}`),
  sahne: (slug: string) => getir<SahneVerisi>(`/sahneler/${slug}`),
  araclar: (sinif?: number) => getir<Arac[]>(`/araclar${sinif ? `?sinif=${sinif}` : ''}`),
  palet: () => getir<Array<{ ad: string; rol: string; kalinlik: number; opaklik: number }>>('/palet'),
  ara: (q: string) => getir<AramaSonucu>(`/ara?q=${encodeURIComponent(q)}`),
  kapsama: () => getir<{ siniflar: Array<{ seviye: number; alan: string; konu: number; sahne: number; ornek: number }> }>('/kapsama'),
}
