/**
 * Kontrast denetimi.
 *
 * stil.css icindeki token ciftlerini WCAG 2.1 oranina gore olcer. Pastel
 * palet guzel gorunuyor diye gecilemez: dolgu pastel, uzerine yazilan
 * her sey koyu kardes ton olmali ve oran AA esigini gecmeli.
 *
 * Esik: normal metin 4.5, buyuk metin 3.0. Burada hepsi normal metin
 * varsayiliyor cunku bu tonlar en cok kucuk puntoda kullaniliyor.
 *
 * Calistir: npm run kontrast -w @matgebra/web
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(resolve(kok, 'src', 'stil.css'), 'utf-8')

/** @theme blogundaki renk tokenlari. */
const token = new Map()
for (const [, ad, deger] of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)) {
  token.set(ad, deger)
}

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const isik = (h) =>
  rgb(h)
    .map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    .reduce((t, v, i) => t + v * [0.2126, 0.7152, 0.0722][i], 0)
const oran = (a, b) => {
  const [x, y] = [isik(a), isik(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const ESIK = 4.5
const PASTELLER = ['nane', 'lavanta', 'seftali', 'gok', 'gul', 'tereyagi', 'notr']

const ciftler = [
  ['murekkep', 'yuzey'],
  ['murekkep-2', 'yuzey'],
  ['murekkep-3', 'yuzey'],
  ['murekkep', 'zemin'],
  ['murekkep-2', 'zemin'],
  ['murekkep-3', 'zemin'],
  ['murekkep-2', 'yuzey-2'],
  ['marka', 'yuzey'],
  ['marka-koyu', 'marka-soft'],
  ['basari', 'yuzey'],
  ['uyari', 'yuzey'],
  ['hata', 'yuzey'],
  // Her pastel ton kendi koyu kardesiyle: dolgu uzerine yazilan yazi.
  ...PASTELLER.map((p) => [`${p}-koyu`, p]),
  // Pastel dolgular beyaz uzerinde de kullaniliyor (rozet, kart zemini);
  // uzerlerindeki yazi koyu kardes oldugu icin ayrica sinaniyor.
  ...PASTELLER.map((p) => [`${p}-koyu`, 'yuzey']),
]

let kalan = 0
const satirlar = []
for (const [on, arka] of ciftler) {
  const a = token.get(on)
  const b = token.get(arka)
  if (!a || !b) {
    satirlar.push(`  ?     ${on} / ${arka}  — token bulunamadı`)
    kalan++
    continue
  }
  const o = oran(a, b)
  const gecti = o >= ESIK
  if (!gecti) kalan++
  satirlar.push(
    `  ${gecti ? 'tamam' : 'DÜŞÜK'} ${o.toFixed(2).padStart(6)}  ${on} / ${arka}`,
  )
}

console.log(`Kontrast denetimi — eşik ${ESIK}:1 (WCAG AA, normal metin)\n`)
console.log(satirlar.join('\n'))
console.log(`\n${ciftler.length - kalan}/${ciftler.length} çift eşiği geçiyor.`)

if (kalan) {
  console.error(`\n${kalan} çift eşiğin altında. Koyu kardeş tonu koyulaştırın.`)
  process.exit(1)
}
