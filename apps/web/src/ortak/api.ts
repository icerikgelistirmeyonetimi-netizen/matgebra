import { normalize } from '@matgebra/core'

/**
 * API istemcisi.
 *
 * Tek kural: veri daima buradan gelir. Hicbir bilesen icerik verisini
 * kendi icinde tasimaz.
 *
 * Iki calisma kipi var:
 *  - gelistirme / sunuculu yayin: Fastify'a vekil uzerinden istek
 *  - statik yayin (VITE_STATIK=1): derleme aninda veritabanindan uretilmis
 *    JSON dosyalari. Ayni depo fonksiyonlari urettigi icin yanitlar birebir
 *    aynidir; degisen yalnizca tasima.
 */

const STATIK = import.meta.env.VITE_STATIK === '1'
const TEMEL = STATIK ? `${import.meta.env.BASE_URL}api` : '/api'

async function gonder<T>(yol: string, govde: unknown, yontem = 'POST'): Promise<T> {
  if (STATIK) throw new Error('Statik sürümde kaydetme yok; uygulamayı sunucuyla çalıştırın.')
  const yanit = await fetch(`${TEMEL}${yol}`, {
    method: yontem,
    headers: { 'content-type': 'application/json' },
    body: govde === undefined ? undefined : JSON.stringify(govde),
  })
  if (!yanit.ok) throw new Error(`${yanit.status} ${yol}: ${(await yanit.text()).slice(0, 200)}`)
  return (await yanit.json()) as T
}

async function getir<T>(yol: string): Promise<T> {
  const yanit = await fetch(`${TEMEL}${yol}`)
  if (!yanit.ok) {
    const govde = await yanit.text()
    throw new Error(`${yanit.status} ${yol}: ${govde.slice(0, 200)}`)
  }
  return (await yanit.json()) as T
}

/** Statik kipte dosya adina, sunuculu kipte rotaya cevirir. */
const yol = (statikYol: string, sunucuYol: string) =>
  STATIK ? `/${statikYol}.json` : sunucuYol

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

export interface CizimOzeti {
  id: number
  ad: string
  olusturma: string
  sahneSlug: string | null
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
  agac: () => getir<KademeDugumu[]>(yol('mufredat/agac', '/mufredat/agac')),
  alanlar: () =>
    getir<Array<{ id: number; slug: string; ad: string; renkAnahtari: string }>>(
      yol('alanlar', '/alanlar'),
    ),
  konular: (seviye: number, alan?: string) =>
    getir<KonuOzeti[]>(
      yol(
        `siniflar/${seviye}/konular`,
        `/siniflar/${seviye}/konular${alan ? `?alan=${alan}` : ''}`,
      ),
    ).then((liste) => (STATIK && alan ? liste.filter((k) => k.alan === alan) : liste)),
  konu: (slug: string) => getir<KonuAyrinti>(yol(`konular/${slug}`, `/konular/${slug}`)),
  sahne: (slug: string) => getir<SahneVerisi>(yol(`sahneler/${slug}`, `/sahneler/${slug}`)),
  araclar: (sinif?: number) =>
    getir<Arac[]>(yol(`araclar/${sinif ?? 12}`, `/araclar${sinif ? `?sinif=${sinif}` : ''}`)),
  palet: () =>
    getir<Array<{ ad: string; rol: string; kalinlik: number; opaklik: number }>>(
      yol('palet', '/palet'),
    ),
  ara: (q: string) => (STATIK ? statikAra(q) : getir<AramaSonucu>(`/ara?q=${encodeURIComponent(q)}`)),
  cizimler: () => getir<CizimOzeti[]>(yol('cizimler', '/cizimler')),
  cizim: (id: number) => getir<{ id: number; ad: string; veri: unknown }>(`/cizimler/${id}`),
  cizimKaydet: (govde: { ad: string; sahneSlug?: string; veri: unknown }) =>
    gonder<{ id: number }>('/cizimler', govde),
  cizimSil: (id: number) => gonder<{ silindi: number }>(`/cizimler/${id}`, undefined, 'DELETE'),
  /** Statik sürümde kaydetme kapalı; arayüz düğmeyi ona göre gizler. */
  kaydedebilir: !STATIK,
  kapsama: () =>
    getir<{
      siniflar: Array<{ seviye: number; alan: string; konu: number; sahne: number; ornek: number }>
    }>(yol('kapsama', '/kapsama')),
}

/* ---------------------------------------------------------------- arama --
 * Sunuculu kipte arama SQLite FTS5 ile yapilir. Statik kipte ayni isi
 * tarayici yapar: dizin bir kez indirilir, eslesme sunucudakiyle ayni
 * normalize kurallariyla yurur ("acilar" -> "Açılar").
 */

interface AramaDizini {
  konular: Array<{
    ad: string
    slug: string
    ozet: string
    alan: string
    seviye: number
    norm: string
  }>
  kazanimlar: Array<{
    kod: string
    metin: string
    temaAd: string
    alan: string | null
    seviye: number
    norm: string
  }>
}

let dizin: Promise<AramaDizini> | null = null

async function statikAra(sorgu: string): Promise<AramaSonucu> {
  const q = normalize(sorgu).trim()
  if (q.length < 2) return { konular: [], kazanimlar: [] }
  dizin ??= getir<AramaDizini>(yol('ara-dizin', '/ara-dizin'))
  const veri = await dizin
  const kelimeler = q.split(/\s+/)
  const uyar = (metin: string) => kelimeler.every((k) => metin.includes(k))

  return {
    konular: veri.konular.filter((k) => uyar(k.norm)).slice(0, 20),
    kazanimlar: veri.kazanimlar.filter((k) => uyar(k.norm)).slice(0, 20),
  }
}
