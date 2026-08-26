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
