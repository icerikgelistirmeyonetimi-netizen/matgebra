/**
 * Geometri ikonu ureteci.
 *
 * Ikonlari goz karari cizmek yerine koordinatlarini hesaplar: duzgun cokgenin
 * kosesi gercekten duzgun cokgenin kosesinde, teget noktasi gercekten teget
 * noktasinda olur. Lucide'in insa kurallariyla ayni izgara kullanilir:
 * 24x24 kutu, 2px kenar boslugu, 2 birim kalinlik, yuvarlak uc.
 *
 * Calistir: node apps/web/scripts/ikon-uret.mjs > src/ortak/bilesenler/geometri-ikonlari.ts
 */

const y = (n) => Number(n.toFixed(2))
const M = 12 // merkez

/** Duzgun cokgenin kose listesi. a0 derece, saat 12'den baslar. */
const cokgen = (n, r, a0 = -90, cx = M, cy = M) =>
  Array.from({ length: n }, (_, i) => {
    const t = ((a0 + (360 / n) * i) * Math.PI) / 180
    return [y(cx + r * Math.cos(t)), y(cy + r * Math.sin(t))]
  })

const kapali = (noktalar) =>
  `M${noktalar.map(([a, b]) => `${a} ${b}`).join('L')}Z`

const cizgi = (a, b) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`

/** Tam cember. */
const cember = (r, cx = M, cy = M) =>
  `M${y(cx - r)} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

const kutup = (r, derece, cx = M, cy = M) => {
  const t = (derece * Math.PI) / 180
  return [y(cx + r * Math.cos(t)), y(cy + r * Math.sin(t))]
}

/** Iki aci arasinda yay. Ekran koordinatinda saat yonu sweep=1. */
const yay = (r, d1, d2, cx = M, cy = M) => {
  const a = kutup(r, d1, cx, cy)
  const b = kutup(r, d2, cx, cy)
  const buyuk = Math.abs(d2 - d1) > 180 ? 1 : 0
  const yon = d2 > d1 ? 1 : 0
  return `M${a[0]} ${a[1]}A${r} ${r} 0 ${buyuk} ${yon} ${b[0]} ${b[1]}`
}

/** Merkezli daire dilimi. */
const dilim = (r, d1, d2, cx = M, cy = M) => {
  const a = kutup(r, d1, cx, cy)
  const b = kutup(r, d2, cx, cy)
  const buyuk = Math.abs(d2 - d1) > 180 ? 1 : 0
  return `M${cx} ${cy}L${a[0]} ${a[1]}A${r} ${r} 0 ${buyuk} 1 ${b[0]} ${b[1]}Z`
}

/** Dik aci isareti: kosede, iki kenar yonunde b uzunlugunda kare. */
const dikAci = (kose, yon1, yon2, b = 3.2) => {
  const bir = (v) => {
    const u = Math.hypot(v[0], v[1])
    return [v[0] / u, v[1] / u]
  }
  const u1 = bir(yon1)
  const u2 = bir(yon2)
  const p1 = [y(kose[0] + u1[0] * b), y(kose[1] + u1[1] * b)]
  const p3 = [y(kose[0] + u2[0] * b), y(kose[1] + u2[1] * b)]
  const p2 = [y(p1[0] + u2[0] * b), y(p1[1] + u2[1] * b)]
  return `M${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}L${p3[0]} ${p3[1]}`
}

/** Dolu nokta - kisit noktalarini isaretler. */
const dolu = (p, r = 2.1) =>
  `M${y(p[0] - r)} ${p[1]}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

// --------------------------------------------------------------- ikonlar
const I = {}
const ekle = (ad, cizgiler, noktalar = []) => {
  I[ad] = { c: cizgiler.filter(Boolean), n: noktalar }
}

// --- arac cubugu: temel
ekle('nokta', [], [dolu([M, M], 3)])
ekle('nokta-uzeri', [`M3 16.5C7 8 17 8 21 16.5`], [dolu([M, y(11.06)])])
ekle('parca', [cizgi([5, 19], [19, 5])], [dolu([5, 19]), dolu([19, 5])])
ekle('isin', [cizgi([5, 19], [19.5, 4.5]), `M14.5 4.5H19.5V9.5`], [dolu([5, 19])])
ekle('dogru', [cizgi([3, 20.5], [21, 3.5])], [dolu([8, 15.78]), dolu([16, 8.22])])
ekle('vektor', [cizgi([4.5, 19.5], [19, 5]), `M13.5 5H19V10.5`], [dolu([4.5, 19.5])])

// --- sekil
ekle('cember-merkez-nokta', [cember(8.5)], [dolu([M, M]), dolu(kutup(8.5, 0))])
ekle('cember-yaricap', [cember(8.5), cizgi([M, M], kutup(8.5, 0))], [dolu([M, M])])
ekle('cember-uc-nokta', [cember(8.5)], cokgen(3, 8.5).map((p) => dolu(p)))
ekle('yay', [yay(8.5, 180, 0)], [dolu(kutup(8.5, 180)), dolu(kutup(8.5, 0))])
ekle('daire-dilimi', [dilim(8.5, -90, 30)], [dolu([M, M])])

// --- insa
ekle(
  'orta-nokta',
  [cizgi([4.5, 19.5], [19.5, 4.5]), `M10 13.2l1.5 1.5M12.5 10.7l1.5 1.5`],
  [dolu([4.5, 19.5]), dolu([19.5, 4.5]), dolu([M, M])],
)
ekle('dikme', [cizgi([3.5, 17], [20.5, 17]), cizgi([M, 3.5], [M, 20.5]), dikAci([M, 17], [1, 0], [0, -1])])
ekle('paralel', [cizgi([3.5, 9], [20.5, 9]), cizgi([3.5, 15], [20.5, 15])])
ekle(
  'orta-dikme',
  [cizgi([4.5, 19.5], [19.5, 4.5]), cizgi([5.5, 5.5], [18.5, 18.5]), dikAci([M, M], [0.707, -0.707], [0.707, 0.707], 2.6)],
  [dolu([M, M])],
)
ekle('aci-ortay', [cizgi([4, 20], [21, 20]), cizgi([4, 20], [17.5, 6.5]), cizgi([4, 20], [20, 12.5]), yay(6.5, -22.5, 0, 4, 20), yay(6.5, -45, -22.5, 4, 20)])
ekle('kesisim', [cizgi([4, 6], [20, 18]), cizgi([20, 6], [4, 18])], [dolu([M, M])])
ekle('teget', [cember(7, 13, 11), cizgi([3, 21], [21, 3])], [dolu([8.05, 15.95])])
ekle('aci', [cizgi([4, 20], [21, 20]), cizgi([4, 20], [18.5, 7]), yay(6.5, -41.9, 0, 4, 20)])

// --- olcum
ekle('olcum-alan', [`M4 4h16v16H4Z`, `M4 9.33h16M4 14.67h16M9.33 4v16M14.67 4v16`])
ekle('olcum-cevre', [`M4.5 4.5h15v15h-15Z`], cokgen(4, 10.6, -45).map((p) => dolu(p, 1.9)))
ekle('iletki', [yay(8.5, 180, 0), cizgi([3.5, M], [20.5, M]), cizgi([M, M], kutup(8.5, -135))], [dolu([M, M], 1.8)])

// --- sinif motifleri
const ucgen = cokgen(3, 9)
const orta = (a, b) => [y((a[0] + b[0]) / 2), y((a[1] + b[1]) / 2)]
ekle('sinif-hz', [kapali(ucgen), kapali([orta(ucgen[0], ucgen[1]), orta(ucgen[1], ucgen[2]), orta(ucgen[2], ucgen[0])])])
ekle('sinif-1', [`M12 3.2L18.4 20L12 16.4L5.6 20Z`, cizgi([M, 3.2], [M, 16.4])])
ekle('sinif-2', [`M3.5 3.5h7.2v7.2H3.5Z`, kapali(cokgen(3, 4.4, -90, 16.9, 7.6)), cember(3.6, 7.1, 16.9), `M13.6 13.4h7v7h-7Z`])
ekle('sinif-3', [cizgi([M, 3], [M, 21]), `M9.6 6.4L4 12l5.6 5.6Z`, `M14.4 6.4L20 12l-5.6 5.6Z`])
ekle('sinif-4', [cizgi([4, 20], [21, 20]), cizgi([4, 20], [18.8, 7.2]), yay(7, -40.6, 0, 4, 20)])
ekle('sinif-5', [cember(9), kapali(cokgen(6, 9))])
ekle('sinif-6', [cember(8.6), cizgi([M, M], kutup(8.6, 0))], [dolu([M, M], 1.9)])
ekle('sinif-7', [dilim(9, -90, 45), yay(4.5, -90, 45)])
ekle('sinif-8', [`M4 20h14L4 6Z`, dikAci([4, 20], [1, 0], [0, -1], 3.4)])
ekle('sinif-9', [kapali(cokgen(3, 9.2)), cizgi(orta(cokgen(3, 9.2)[0], cokgen(3, 9.2)[1]), orta(cokgen(3, 9.2)[0], cokgen(3, 9.2)[2]))])
ekle('sinif-10', [cizgi([4, 21], [4, 3.5]), cizgi([3, 20], [20.5, 20]), cizgi([4.5, 18], [19.5, 5.5])], [dolu([12, 11.75], 2)])
const bes = cokgen(5, 9)
ekle('sinif-11', [kapali(bes), cizgi(bes[0], bes[2]), cizgi(bes[0], bes[3])])
ekle('sinif-12', [
  `M12 2.8L20.2 7.4V16.6L12 21.2L3.8 16.6V7.4Z`,
  cizgi([M, 12.1], [20.2, 7.4]),
  cizgi([M, 12.1], [3.8, 7.4]),
  cizgi([M, 12.1], [M, 21.2]),
])

const govde = Object.entries(I)
  .map(([ad, { c, n }]) => {
    const cizgiler = c.map((d) => `    { d: '${d}' },`).join('\n')
    const noktalar = n.map((d) => `    { d: '${d}', dolu: true },`).join('\n')
    return `  '${ad}': [\n${[cizgiler, noktalar].filter(Boolean).join('\n')}\n  ],`
  })
  .join('\n')

process.stdout.write(`/**
 * Geometri ikonlari - URETILMIS DOSYA, ELLE DUZENLEMEYIN.
 *
 * Kaynak: apps/web/scripts/ikon-uret.mjs
 * Yeniden uret: node scripts/ikon-uret.mjs > src/ortak/bilesenler/geometri-ikonlari.ts
 *
 * Koordinatlar hesaplanir, goz karari cizilmez: duzgun cokgenin kosesi
 * gercekten duzgun cokgenin kosesinde, teget noktasi gercekten teget
 * noktasindadir. Lucide ile ayni izgara: 24x24, 2px kenar boslugu.
 */

export interface IkonSekli {
  d: string
  /** true ise dolu boyanir (kisit noktalari); degilse cizgi. */
  dolu?: boolean
}

export const GEOMETRI_IKONLARI: Record<string, IkonSekli[]> = {
${govde}
}
`)
