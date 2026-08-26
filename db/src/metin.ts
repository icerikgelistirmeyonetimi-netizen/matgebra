import { kucult, normalize, slugla, temizle } from '@matgebra/core'

export { kucult, normalize, slugla, temizle }

/**
 * MEB kaynak metnini ayristirma yardimcilari.
 * Genel Turkce normalizasyon @matgebra/core icinde; arayuz de ayni islevleri
 * kullanmali (statik yayinda arama tarayicida yurutuluyor).
 */

/**
 * "3.TEMA: GEOMETRIK SEKILLER" gibi bir baslikta tema kodunu ve adini ayirir.
 * Kaynak veride nokta ve bosluk kullanimi tutarsiz oldugu icin esnek eslesir.
 */
export function temaKoduAyir(baslik: string): { kod: string; ad: string; sira: number } {
  const temiz = temizle(baslik)
  const m = temiz.match(/^\s*(\d+)\s*\.?\s*TEMA\s*:?\s*(.*)$/i)
  if (!m) return { kod: '', ad: temiz, sira: 0 }
  const sira = Number(m[1] ?? 0)
  return { kod: `${sira}.TEMA`, ad: (m[2] ?? '').trim(), sira }
}

/**
 * Kazanim aciklamasini "a) ... b) ..." maddelerine ayirir.
 * Isaretler genelde satir basinda gelir; satiri kaymis kayitlar icin
 * yakalayici satir ici de calisir.
 */
export function maddeleriAyir(aciklama: string | null): Array<{ harf: string; metin: string }> {
  if (!aciklama) return []
  const temiz = temizle(aciklama)
  const kalip = /(^|\n)\s*([a-zçğıöşü])\)\s*/gi
  const isaretler: Array<{ harf: string; bas: number; son: number }> = []
  let m: RegExpExecArray | null
  while ((m = kalip.exec(temiz)) !== null) {
    isaretler.push({ harf: kucult(m[2] ?? ''), bas: m.index, son: kalip.lastIndex })
  }
  if (isaretler.length === 0) {
    const govde = temiz.replace(/\s+/g, ' ').trim()
    return govde ? [{ harf: 'a', metin: govde }] : []
  }
  const parcalar: Array<{ harf: string; metin: string }> = []
  isaretler.forEach((isaret, i) => {
    const bitis = isaretler[i + 1]?.bas ?? temiz.length
    const metin = temiz.slice(isaret.son, bitis).replace(/\s+/g, ' ').trim()
    if (metin) parcalar.push({ harf: isaret.harf, metin })
  })
  return parcalar
}

/**
 * Kazanim metninin basindaki kodu ayirir.
 * Bicimler: "MAT.5.3.1." (sinif numarali) ve "MAT.H.4.1." (hazirlik sinifi).
 */
export function kazanimKoduAyir(metin: string): { kod: string; govde: string } {
  const temiz = temizle(metin)
  const m = temiz.match(/^\s*([A-ZÇĞİÖŞÜ]{2,8}(?:\.(?:\d+|[A-ZÇĞİÖŞÜ]{1,3})){2,5})\.?\s*/)
  if (!m) return { kod: '', govde: temiz }
  return { kod: (m[1] ?? '').trim(), govde: temiz.slice(m[0].length).trim() }
}
