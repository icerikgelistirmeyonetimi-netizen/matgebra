import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { temizle } from '../metin.js'

/**
 * MEB kaynak verisine erisim yardimcilari.
 * veri/ klasoru salt okunurdur; buradaki hicbir fonksiyon ona yazmaz.
 */

const buradan = dirname(fileURLToPath(import.meta.url))
export const VERI_KLASORU = resolve(buradan, '..', '..', '..', 'veri')

/** Matematik derslerinin kaynak adlari ve dustukleri kademe. */
export const MATEMATIK_DERSLERI = [
  { kaynak: 'İlkokul Matematik Dersi', kademe: 'ilkokul', ad: 'İlkokul Matematik' },
  { kaynak: 'Ortaokul Matematik Dersi', kademe: 'ortaokul', ad: 'Ortaokul Matematik' },
  { kaynak: 'Matematik Dersi', kademe: 'lise', ad: 'Lise Matematik' },
] as const

export const KADEMELER = [
  { slug: 'ilkokul', ad: 'İlkokul', sira: 1 },
  { slug: 'ortaokul', ad: 'Ortaokul', sira: 2 },
  { slug: 'lise', ad: 'Lise', sira: 3 },
] as const

/**
 * Tema adindan calisma alanini cikarir.
 *
 * Geometri temalari mufredatta dort farkli adla geciyor (Nesnelerin Geometrisi,
 * Geometrik Sekiller/Nicelikler/Cisimler), ayrica Donusum, Eslik ve Benzerlik,
 * Analitik Inceleme de geometri kapsaminda. Olasilik yalniz "Olasilik" gecen
 * temalarda; 11-12. sinifta ayri olasilik temasi yok.
 */
export function alanBelirle(temaAdi: string): 'geometri' | 'olasilik' | null {
  const u = temaAdi.toLocaleUpperCase('tr')
  if (u.includes('OLASILI')) return 'olasilik'
  if (
    u.includes('GEOMETR') ||
    u.includes('NESNELERİN') ||
    u.includes('DÖNÜŞÜM') ||
    u.includes('EŞLİK') ||
    u.includes('ANALİTİK')
  ) {
    return 'geometri'
  }
  return null
}

/** Sinif etiketini sayisal seviyeye cevirir. Hazirlik = 0. */
export function seviyeCevir(sinif: string): number {
  const t = sinif.trim()
  if (/hazırlık/i.test(t)) return 0
  const n = Number(t)
  return Number.isFinite(n) ? n : -1
}

export function sinifAdi(seviye: number): string {
  return seviye === 0 ? 'Hazırlık' : `${seviye}. Sınıf`
}

const VARLIKLAR: Record<string, string> = {
  '&Ccedil;': 'Ç',
  '&ccedil;': 'ç',
  '&Gbreve;': 'Ğ',
  '&gbreve;': 'ğ',
  '&Idot;': 'İ',
  '&Ouml;': 'Ö',
  '&ouml;': 'ö',
  '&Scedil;': 'Ş',
  '&scedil;': 'ş',
  '&Uuml;': 'Ü',
  '&uuml;': 'ü',
  '&acirc;': 'â',
  '&icirc;': 'î',
  '&ucirc;': 'û',
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&rsquo;': '’',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&ndash;': '–',
  '&mdash;': '—',
  '&hellip;': '…',
}

/** HTML varliklarini cozer ve etiketleri siyirir. */
export function htmlCoz(parca: string): string {
  const govde = parca.replace(/<[^>]+>/g, ' ')
  const cozulmus = govde
    .replace(/&#(\d+);/g, (_, k: string) => String.fromCodePoint(Number(k)))
    .replace(/&[A-Za-z]+;|&#\d+;/g, (v) => VARLIKLAR[v] ?? v)
  return temizle(cozulmus).replace(/\s+/g, ' ')
}

/** Tema HTML'inden ozet paragrafini cikarir. */
export function ozetCikar(html: string | null): string {
  if (!html) return ''
  const m = html.match(/<div class="text mb-3">([\s\S]*?)<\/div>/)
  return m ? htmlCoz(m[1] ?? '') : ''
}

/** Tema HTML'inden ders saatini cikarir. */
export function dersSaatiCikar(html: string | null): number | null {
  if (!html) return null
  const m = html.match(/Ders Saati[\s\S]{0,400}?class="col-md-9 p-2 content">\s*(\d+)\s*</)
  return m ? Number(m[1]) : null
}

/** Tema HTML'inden etiketli bir satiri cikarir (Alan Becerileri gibi). */
export function satirCikar(html: string | null, baslik: string): string {
  if (!html) return ''
  const kalip = new RegExp(
    `${baslik}[\\s\\S]{0,400}?class="col-md-9 p-2 content">([\\s\\S]*?)</div>`,
  )
  const m = html.match(kalip)
  return m ? htmlCoz(m[1] ?? '') : ''
}

export interface UniteBolumleri {
  ogrenmeKanitlari?: string
  temelKabuller?: string
  onDegerlendirme?: string
  zenginlestirme?: string
  destekleme?: string
}

/** veri/unite/<id>.json dosyasindaki pedagojik bolumleri okur. */
export function uniteBolumleriOku(uniteId: string): UniteBolumleri {
  const yol = resolve(VERI_KLASORU, 'unite', `${uniteId}.json`)
  if (!existsSync(yol)) return {}
  try {
    const ham = JSON.parse(readFileSync(yol, 'utf-8')) as { bolumler?: UniteBolumleri }
    const b = ham.bolumler ?? {}
    return Object.fromEntries(
      Object.entries(b).map(([k, v]) => [k, temizle(String(v ?? ''))]),
    ) as UniteBolumleri
  } catch {
    return {}
  }
}

export const BOLUM_ADLARI: Record<keyof UniteBolumleri, string> = {
  ogrenmeKanitlari: 'ogrenme_kaniti',
  temelKabuller: 'temel_kabul',
  onDegerlendirme: 'on_degerlendirme',
  zenginlestirme: 'zenginlestirme',
  destekleme: 'destekleme',
}
