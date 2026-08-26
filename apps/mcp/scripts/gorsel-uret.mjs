/**
 * Gercek hayat sahnelerinin arka plan gorselleri.
 *
 * Fotograf kullanmiyoruz: telif takibi zorunlu (medya.lisans) ve serbest
 * lisansli, konuya tam oturan fotograf bulmak guvenilir degil. Bunun
 * yerine gorselleri kendimiz uretiyoruz - lisans "kendi-uretimimiz",
 * kaynagi da bu betik. Ileride lisansli bir fotograf eklenmek istenirse
 * sema hazir: medya satirini degistirmek yetiyor.
 *
 * Her gorsel, ait oldugu sahnenin sinir kutusuna birebir oturacak sekilde
 * uretiliyor: 1 tahta birimi = OLCEK piksel. Boylece gorseldeki bir nesne
 * ile tahtadaki koordinat ayni yerde durur.
 *
 * Calistir: npm run gorsel -w @matgebra/mcp
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const HEDEF = join(kok, 'apps', 'web', 'public', 'medya')
const OLCEK = 50

/** Sahne sinir kutusundan SVG basligi uretir. */
function baslik([sx, uy, sagX, altY], ic) {
  const g = Math.round((sagX - sx) * OLCEK)
  const y = Math.round((uy - altY) * OLCEK)
  // Tahta koordinatlarini SVG koordinatlarina ceviren tek donusum:
  // x sola kayiyor, y ters cevriliyor.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${y}" viewBox="0 0 ${g} ${y}">
<g transform="translate(${-sx * OLCEK} ${uy * OLCEK}) scale(1 -1)">
${ic}
</g>
</svg>
`
}

const b = (n) => n * OLCEK

/* ------------------------------------------------------- cini deseni */

/**
 * Iznik cinisi duzeninde altigen kaplama.
 * Altigenler cevrel yaricapi 5 birim olacak sekilde diziliyor; sahnedeki
 * pergel insasi tam bir karonun uzerine oturuyor.
 */
function ciniDeseni() {
  const R = 5
  const parcalar = []
  parcalar.push(`<rect x="${b(-9)}" y="${b(-9)}" width="${b(18)}" height="${b(18)}" fill="#EAF4F6"/>`)

  const altigen = (cx, cy, r) =>
    Array.from({ length: 6 }, (_, i) => {
      const t = (Math.PI / 3) * i
      return `${b(cx + r * Math.cos(t)).toFixed(1)},${b(cy + r * Math.sin(t)).toFixed(1)}`
    }).join(' ')

  // Altigen kafes: yatay adim 1.5R, dikey adim sqrt(3)R, tek sutunlar kaydirilir.
  const yatay = 1.5 * R
  const dikey = Math.sqrt(3) * R
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      const cx = i * yatay
      const cy = j * dikey + (i % 2 === 0 ? 0 : dikey / 2)
      const koyu = (i + j) % 2 === 0
      parcalar.push(
        `<polygon points="${altigen(cx, cy, R * 0.97)}" fill="${koyu ? '#CFE6EC' : '#DCEEF2'}" stroke="#7FB2C4" stroke-width="2"/>`,
      )
      // Ortadaki lale motifi: uc yaprak + sap.
      parcalar.push(`<g transform="translate(${b(cx)} ${b(cy)}) scale(1 -1)">
  <path d="M0,${b(1.6)} C ${b(-1.4)},${b(0.6)} ${b(-1.4)},${b(-1.2)} 0,${b(-1.7)} C ${b(1.4)},${b(-1.2)} ${b(1.4)},${b(0.6)} 0,${b(1.6)} Z" fill="#9FC9B4" opacity="0.85"/>
  <circle cx="0" cy="${b(-0.2)}" r="${b(0.5)}" fill="#E2B4C6"/>
  <path d="M${b(-2.6)},${b(2.1)} Q 0,${b(0.4)} ${b(2.6)},${b(2.1)}" fill="none" stroke="#7FB2C4" stroke-width="2.5" opacity="0.7"/>
</g>`)
    }
  }
  return baslik([-9, 9, 9, -9], parcalar.join('\n'))
}

/* ------------------------------------------------------- yaya gecidi */

function yayaGecidi() {
  const parcalar = []
  parcalar.push(`<rect x="${b(-10)}" y="${b(-8)}" width="${b(20)}" height="${b(16)}" fill="#DCE3EA"/>`)
  // Asfalt serit: iki paralel kaldirim kenari arasi.
  parcalar.push(`<rect x="${b(-10)}" y="${b(-4)}" width="${b(20)}" height="${b(8)}" fill="#9AA5B1"/>`)
  parcalar.push(
    `<line x1="${b(-10)}" y1="${b(4)}" x2="${b(10)}" y2="${b(4)}" stroke="#6C7885" stroke-width="4"/>`,
  )
  parcalar.push(
    `<line x1="${b(-10)}" y1="${b(-4)}" x2="${b(10)}" y2="${b(-4)}" stroke="#6C7885" stroke-width="4"/>`,
  )
  // Yaya gecidi seritleri: yola egik, birbirine paralel.
  // Egim 1/3 - sahnedeki kesen dogruyla ayni dogrultu.
  for (let i = -4; i <= 4; i++) {
    const x = i * 2
    parcalar.push(
      `<polygon points="${b(x - 0.5)},${b(-4)} ${b(x + 0.5)},${b(-4)} ${b(x + 0.5 + 2.67)},${b(4)} ${b(x - 0.5 + 2.67)},${b(4)}" fill="#F7F9FB" opacity="0.9"/>`,
    )
  }
  // Kaldirim dokusu
  for (let i = -10; i < 10; i += 2) {
    parcalar.push(
      `<rect x="${b(i)}" y="${b(4)}" width="${b(1.9)}" height="${b(3.9)}" fill="#C9D2DB" stroke="#B4BEC8" stroke-width="1"/>`,
    )
    parcalar.push(
      `<rect x="${b(i)}" y="${b(-7.9)}" width="${b(1.9)}" height="${b(3.9)}" fill="#C9D2DB" stroke="#B4BEC8" stroke-width="1"/>`,
    )
  }
  return baslik([-10, 8, 10, -8], parcalar.join('\n'))
}

/* --------------------------------------------------------- merdiven */

function merdivenDuvari() {
  const parcalar = []
  parcalar.push(`<rect x="${b(-1)}" y="${b(-2)}" width="${b(14)}" height="${b(13)}" fill="#EFEAE3"/>`)
  // Duvar: x = 1'in solunda tugla dokusu.
  parcalar.push(`<rect x="${b(-1)}" y="${b(0)}" width="${b(2)}" height="${b(11)}" fill="#DCC3B0"/>`)
  for (let y = 0; y < 11; y += 0.8) {
    parcalar.push(
      `<line x1="${b(-1)}" y1="${b(y)}" x2="${b(1)}" y2="${b(y)}" stroke="#C6A78F" stroke-width="1.5"/>`,
    )
  }
  // Zemin: y = 0'in altinda parke.
  parcalar.push(`<rect x="${b(-1)}" y="${b(-2)}" width="${b(14)}" height="${b(2)}" fill="#C7B49C"/>`)
  for (let x = -1; x < 13; x += 1.5) {
    parcalar.push(
      `<line x1="${b(x)}" y1="${b(-2)}" x2="${b(x)}" y2="${b(0)}" stroke="#B09B82" stroke-width="1.5"/>`,
    )
  }
  parcalar.push(
    `<line x1="${b(-1)}" y1="${b(0)}" x2="${b(13)}" y2="${b(0)}" stroke="#8E7B64" stroke-width="4"/>`,
  )
  parcalar.push(
    `<line x1="${b(1)}" y1="${b(0)}" x2="${b(1)}" y2="${b(11)}" stroke="#8E7B64" stroke-width="4"/>`,
  )
  // Duvarda bir pencere: olcek referansi olarak kullaniliyor (1 metre genis).
  parcalar.push(
    `<rect x="${b(4)}" y="${b(5)}" width="${b(1)}" height="${b(1.4)}" fill="#CDE3EC" stroke="#8E7B64" stroke-width="3"/>`,
  )
  return baslik([-1, 11, 13, -2], parcalar.join('\n'))
}

/* -------------------------------------------------------------- akis */

const GORSELLER = [
  { ad: 'cini-altigen.svg', uret: ciniDeseni },
  { ad: 'yaya-gecidi.svg', uret: yayaGecidi },
  { ad: 'merdiven-duvari.svg', uret: merdivenDuvari },
]

mkdirSync(HEDEF, { recursive: true })
for (const g of GORSELLER) {
  const govde = g.uret()
  writeFileSync(join(HEDEF, g.ad), govde, 'utf-8')
  console.log(`${g.ad.padEnd(22)} ${(govde.length / 1024).toFixed(1)} KB`)
}
console.log(`\n-> ${HEDEF}`)
