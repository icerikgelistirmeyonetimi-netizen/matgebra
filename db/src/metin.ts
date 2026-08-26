/**
 * Turkce metin normalizasyonu.
 *
 * SQLite'in NOCASE karsilastirmasi yalnizca ASCII harflerde dogru calisir;
 * Turkce noktali/noktasiz i ciftinde yanlis sonuc verir. Bu yuzden aranabilir
 * her metin alaninin yaninda normalize edilmis bir kopya (ad_norm, metin_norm)
 * tutulur ve arama daima onun uzerinden yurur.
 */

/** Turkce'ye ozgu buyuk harf -> kucuk harf esleri. */
const BUYUK_HARITA: Record<string, string> = {
  I: 'ı', // noktasiz i
  İ: 'i', // noktali i
}

/** Aksanli harfleri ASCII karsiliklarina indirger. */
const AKSAN_HARITA: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  â: 'a',
  î: 'i',
  û: 'u',
}

/**
 * Metinden temizlenecek gorunmez isaretler:
 * U+0002, yumusak tire, sifir genislikli bosluklar, BOM.
 */
const GORUNMEZ = new RegExp('[­​‌‍﻿]', 'g')

/** Turkce kurallarina gore kucuk harfe cevirir. */
export function kucult(metin: string): string {
  return [...metin].map((h) => BUYUK_HARITA[h] ?? h.toLowerCase()).join('')
}

/**
 * Arama icin normalize eder: gorunmezleri sil, Turkce kucult,
 * aksanlari duselt, fazla bosluklari tekile indir.
 */
export function normalize(metin: string): string {
  return [...kucult(metin.replace(GORUNMEZ, ''))]
    .map((h) => AKSAN_HARITA[h] ?? h)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

/** URL ve slug uretimi: normalize + yalniz harf, rakam ve tire. */
export function slugla(metin: string): string {
  return normalize(metin)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/**
 * Kaynak metni temizler.
 *
 * MEB verisi PDF'ten cikarildigi icin satir sonu tirelemelerinin yerinde
 * U+0002 ve yumusak tire birakmis; bu isaretler kelimeyi ortadan boler.
 * Silinince kelime kendiliginden butunlesir.
 */
export function temizle(metin: string): string {
  return metin
    .replace(GORUNMEZ, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

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
