/**
 * Icerik betikleri icin ortak yardimcilar.
 *
 * Sahne nesnelerini elle yazmak yerine burada toplandi; her sinif dilimi
 * ayni kaliplari kullaniyor. Kaliplarin dogru kullanimi README'deki
 * "sahne yazarken bilinmesi gerekenler" bolumunde anlatiliyor.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

/** MCP sunucusuna baglanir ve arac cagirici dondurur. */
export async function baglan(ad) {
  const istemci = new Client({ name: ad, version: '1' })
  await istemci.connect(
    new StdioClientTransport({
      command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
      args: ['tsx', 'apps/mcp/src/main.ts'],
      cwd: kok,
    }),
  )
  const cagir = async (arac, girdi = {}) => {
    const y = await istemci.callTool({ name: arac, arguments: girdi })
    const govde = y.content?.[0]?.text ?? ''
    if (y.isError) throw new Error(`${arac}: ${govde}`)
    return govde
  }
  return { istemci, cagir }
}

const temel = (ad, tip, sira, { rol = 'gok', etiket = null, katman = 1, gorunur = true } = {}) => ({
  ad,
  tip,
  etiket,
  sira,
  katman,
  gorunur,
  kilitli: true,
  surukleme: 'yok',
  stil: { rol },
  parametreler: [],
  bagimliliklar: [],
})

/** Serbest ya da sabit nokta. */
export const nokta = (ad, x, y, sira, o = {}) => ({
  ...temel(ad, 'nokta', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  kilitli: (o.surukleme ?? 'serbest') === 'yok',
  surukleme: o.surukleme ?? 'serbest',
  parametreler: [
    { anahtar: 'x', deger: x, tur: 'sayi' },
    { anahtar: 'y', deger: y, tur: 'sayi' },
  ],
})

/**
 * (apsisKaynak.x, ordinatKaynak.y) — dikdortgen koseleri.
 *
 * o.apsisEksen / o.ordinatEksen ile kaynaktan hangi eksenin okunacagi
 * secilir; o.dx / o.dy sabit kaydirma ekler. Bir olcuyu bir yerde yatay,
 * baska yerde dikey kullanmak gerektiginde takas boyle yapilir.
 */
export const bilesen = (ad, apsis, ordinat, sira, o = {}) => ({
  ...temel(ad, 'nokta_bilesen', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  parametreler: [
    ...(o.apsisEksen ? [{ anahtar: 'apsis_eksen', deger: o.apsisEksen, tur: 'metin' }] : []),
    ...(o.ordinatEksen ? [{ anahtar: 'ordinat_eksen', deger: o.ordinatEksen, tur: 'metin' }] : []),
    ...(o.dx ? [{ anahtar: 'dx', deger: o.dx, tur: 'sayi' }] : []),
    ...(o.dy ? [{ anahtar: 'dy', deger: o.dy, tur: 'sayi' }] : []),
  ],
  bagimliliklar: [
    { kaynak: apsis, rol: 'apsis', sira: 0 },
    { kaynak: ordinat, rol: 'ordinat', sira: 1 },
  ],
})

/** Kaynagi (dx, dy) kadar tasir — paralelkenarin dorduncu kosesi. */
export const oteleme = (ad, kaynak, dx, dy, sira, o = {}) => ({
  ...temel(ad, 'nokta_oteleme', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  parametreler: [
    { anahtar: 'dx', deger: dx, tur: 'sayi' },
    { anahtar: 'dy', deger: dy, tur: 'sayi' },
  ],
  bagimliliklar: [{ kaynak, rol: 'kaynak', sira: 0 }],
})

/** Kaynagi merkez etrafinda aci kadar dondurur. */
export const donme = (ad, kaynak, merkez, aciDerece, sira, o = {}) => ({
  ...temel(ad, 'nokta_donme', sira, {
    rol: o.rol ?? 'gul',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  parametreler: [{ anahtar: 'aci', deger: aciDerece, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak, rol: 'kaynak', sira: 0 },
    { kaynak: merkez, rol: 'merkez', sira: 1 },
  ],
})

/** Kaynagi merkeze gore oran katinda uzaklastirir (homoteti / benzerlik). */
export const homoteti = (ad, kaynak, merkez, oran, sira, o = {}) => ({
  ...temel(ad, 'nokta_homoteti', sira, {
    rol: o.rol ?? 'gok',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  parametreler: [{ anahtar: 'oran', deger: oran, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak, rol: 'kaynak', sira: 0 },
    { kaynak: merkez, rol: 'merkez', sira: 1 },
  ],
})

/** Bir noktanin bir dogru uzerindeki dik izdusumu - yuksekligin ayagi. */
export const izdusum = (ad, kaynak, dogru, sira, o = {}) => ({
  ...temel(ad, 'dik_izdusum', sira, {
    rol: o.rol ?? 'gok',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  bagimliliklar: [
    { kaynak, rol: 'kaynak', sira: 0 },
    { kaynak: dogru, rol: 'uzerinde', sira: 1 },
  ],
})

/** Merkez kosesindeki acinin ortay dogrusu. */
export const aciOrtay = (ad, a, merkez, b, sira, o = {}) => ({
  ...temel(ad, 'aci_ortay', sira, { rol: o.rol ?? 'seftali', gorunur: o.gorunur ?? true }),
  stil: { rol: o.rol ?? 'seftali', kalinlik: o.kalinlik ?? 2, cizgiTipi: o.cizgiTipi ?? 'kesik' },
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: merkez, rol: 'merkez', sira: 1 },
    { kaynak: b, rol: 'uc2', sira: 2 },
  ],
})

/** Iki noktanin orta dikmesi. */
export const ortaDikme = (ad, a, b, sira, o = {}) => ({
  ...temel(ad, 'orta_dikme', sira, { rol: o.rol ?? 'lavanta', gorunur: o.gorunur ?? true }),
  stil: { rol: o.rol ?? 'lavanta', kalinlik: o.kalinlik ?? 2, cizgiTipi: o.cizgiTipi ?? 'kesik' },
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: b, rol: 'uc2', sira: 1 },
  ],
})

/** Iki komsu koseden n kenarli duzgun cokgen. */
export const duzgunCokgen = (ad, a, b, kenarSayisi, sira, o = {}) => ({
  ...temel(ad, 'duzgun_cokgen', sira, {
    rol: o.rol ?? 'nane',
    etiket: o.etiket ?? null,
    katman: 0,
  }),
  stil: { rol: o.rol ?? 'nane', opaklik: o.opaklik ?? 0.4, kalinlik: o.kalinlik ?? 2 },
  parametreler: [{ anahtar: 'kenar_sayisi', deger: kenarSayisi, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: b, rol: 'uc2', sira: 1 },
  ],
})

/**
 * Cembere teget.
 * o.uzerinde verilirse cember uzerindeki surgunun tegeti,
 * o.disNokta verilirse disaridaki noktadan cizilen teget olur.
 */
export const teget = (ad, sira, o = {}) => ({
  ...temel(ad, 'teget', sira, { rol: o.rol ?? 'gul', gorunur: o.gorunur ?? true }),
  stil: { rol: o.rol ?? 'gul', kalinlik: o.kalinlik ?? 2, cizgiTipi: o.cizgiTipi ?? 'duz' },
  bagimliliklar: o.uzerinde
    ? [{ kaynak: o.uzerinde, rol: 'uzerinde', sira: 0 }]
    : [
        { kaynak: o.cember, rol: 'kaynak', sira: 0 },
        { kaynak: o.disNokta, rol: 'hedef', sira: 1 },
      ],
})

/** Ucgenin uc kosesinden turetilen merkez ya da cember. */
export const ucgenMerkezi = (ad, tip, koseler, sira, o = {}) => ({
  ...temel(ad, tip, sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? null,
    katman: tip.endsWith('cember') ? 0 : 2,
    gorunur: o.gorunur ?? true,
  }),
  stil: {
    rol: o.rol ?? 'lavanta',
    opaklik: o.opaklik ?? 0.15,
    kalinlik: o.kalinlik ?? 2,
    cizgiTipi: o.cizgiTipi ?? 'duz',
  },
  bagimliliklar: koseler.map((k, i) => ({ kaynak: k, rol: `uc${i + 1}`, sira: i })),
})

/**
 * Iki dogru parcasinin uzunluk orani - trigonometrik oranlar burada canli
 * okunuyor. `pay` ve `payda` cizgi nesnelerinin adlaridir, nokta degil.
 */
export const oran = (ad, pay, payda, sira, o = {}) => ({
  ...temel(ad, 'olcum_oran', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? null,
    katman: 3,
  }),
  parametreler: o.dy === undefined ? [] : [{ anahtar: 'dy', deger: o.dy, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak: pay, rol: 'kaynak', sira: 0 },
    { kaynak: payda, rol: 'hedef', sira: 1 },
  ],
})

/** Iki nokta arasindaki egim olcumu. */
export const egim = (ad, a, b, sira, o = {}) => ({
  ...temel(ad, 'olcum_egim', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? null,
    katman: 3,
  }),
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: b, rol: 'uc2', sira: 1 },
  ],
})

/** Merkeze gore tam karsi nokta (180 derece otesi). */
export const karsi = (ad, merkez, kaynak, sira, o = {}) => ({
  ...temel(ad, 'nokta_uzerinde', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  parametreler: [{ anahtar: 'aci_ofset', deger: 180, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak: merkez, rol: 'merkez', sira: 0 },
    { kaynak, rol: 'yaricap_noktasi', sira: 1 },
  ],
})

/**
 * Bir egri (dogru, cember, cokgen kenari) uzerinde kayan nokta.
 * Baslangic yeri (x, y) ile verilir; motor en yakin noktaya oturtur.
 * Merdiven ayagi, golge ucu gibi "kaymasi gereken ama cikmamasi gereken"
 * noktalar bununla kurulur.
 */
export const surgu = (ad, tasiyici, x, y, sira, o = {}) => ({
  ...temel(ad, 'nokta_uzerinde', sira, {
    rol: o.rol ?? 'seftali',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  kilitli: false,
  surukleme: 'serbest',
  parametreler: [
    { anahtar: 'x', deger: x, tur: 'sayi' },
    { anahtar: 'y', deger: y, tur: 'sayi' },
  ],
  bagimliliklar: [{ kaynak: tasiyici, rol: 'uzerinde', sira: 0 }],
})

/** Cember uzerinde, yaricap noktasindan aci kadar ileride. */
export const cemberUstu = (ad, merkez, yaricapNoktasi, aciOfset, sira, o = {}) => ({
  ...temel(ad, 'nokta_uzerinde', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  parametreler: [{ anahtar: 'aci_ofset', deger: aciOfset, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak: merkez, rol: 'merkez', sira: 0 },
    { kaynak: yaricapNoktasi, rol: 'yaricap_noktasi', sira: 1 },
  ],
})

export const cizgi = (ad, tip, a, b, sira, o = {}) => ({
  ...temel(ad, tip, sira, {
    rol: o.rol ?? 'gok',
    etiket: o.etiket ?? null,
    gorunur: o.gorunur ?? true,
  }),
  stil: { rol: o.rol ?? 'gok', kalinlik: o.kalinlik ?? 2, cizgiTipi: o.cizgiTipi ?? 'duz' },
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: b, rol: 'uc2', sira: 1 },
  ],
})

/** Bir dogruya paralel ya da dik, verilen noktadan gecen dogru. */
export const paralelDik = (ad, tip, dogru, noktaAd, sira, o = {}) => ({
  ...temel(ad, tip, sira, { rol: o.rol ?? 'gok' }),
  stil: { rol: o.rol ?? 'gok', kalinlik: o.kalinlik ?? 2, cizgiTipi: o.cizgiTipi ?? 'duz' },
  bagimliliklar: [
    { kaynak: dogru, rol: 'kaynak', sira: 0 },
    { kaynak: noktaAd, rol: 'uzerinde', sira: 1 },
  ],
})

/** Iki noktanin orta noktasi. */
export const ortaNokta = (ad, a, b, sira, o = {}) => ({
  ...temel(ad, 'orta_nokta', sira, {
    rol: o.rol ?? 'lavanta',
    etiket: o.etiket ?? ad,
    katman: 2,
    gorunur: o.gorunur ?? true,
  }),
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: b, rol: 'uc2', sira: 1 },
  ],
})

export const kesisim = (ad, a, b, sira, o = {}) => ({
  ...temel(ad, 'kesisim', sira, { rol: o.rol ?? 'seftali', etiket: o.etiket ?? ad, katman: 2 }),
  parametreler: [{ anahtar: 'kesisim_sirasi', deger: o.sirasi ?? 0, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak: a, rol: 'kesisen_a', sira: 0 },
    { kaynak: b, rol: 'kesisen_b', sira: 1 },
  ],
})

export const cokgen = (ad, koseler, sira, o = {}) => ({
  ...temel(ad, 'cokgen', sira, { rol: o.rol ?? 'nane', etiket: o.etiket ?? null, katman: 0 }),
  stil: { rol: o.rol ?? 'nane', opaklik: o.opaklik ?? 0.4 },
  bagimliliklar: koseler.map((k, i) => ({ kaynak: k, rol: 'kose', sira: i })),
})

export const cember = (ad, merkez, sira, o = {}) => ({
  ...temel(ad, 'cember', sira, { rol: o.rol ?? 'gok', katman: 0 }),
  stil: { rol: o.rol ?? 'gok', kalinlik: o.kalinlik ?? 2, cizgiTipi: o.cizgiTipi ?? 'duz' },
  parametreler: o.yaricap ? [{ anahtar: 'yaricap', deger: o.yaricap, tur: 'sayi' }] : [],
  bagimliliklar: [
    { kaynak: merkez, rol: 'merkez', sira: 0 },
    ...(o.uzerinde ? [{ kaynak: o.uzerinde, rol: 'uzerinde', sira: 1 }] : []),
    // Yaricap iki nokta arasi uzaklikla da verilebilir.
    ...(o.yaricapUc
      ? [
          { kaynak: o.yaricapUc[0], rol: 'uc1', sira: 1 },
          { kaynak: o.yaricapUc[1], rol: 'uc2', sira: 2 },
        ]
      : []),
  ],
})

/** Yay ya da daire dilimi: merkez + iki uc. */
export const yayDilim = (ad, tip, merkez, a, b, sira, o = {}) => ({
  ...temel(ad, tip, sira, { rol: o.rol ?? 'seftali', katman: 0 }),
  stil: { rol: o.rol ?? 'seftali', opaklik: o.opaklik ?? 0.45, kalinlik: o.kalinlik ?? 2 },
  bagimliliklar: [
    { kaynak: merkez, rol: 'merkez', sira: 0 },
    { kaynak: a, rol: 'uc1', sira: 1 },
    { kaynak: b, rol: 'uc2', sira: 2 },
  ],
})

export const uzunluk = (ad, a, b, sira, o = {}) => ({
  ...temel(ad, 'olcum_uzunluk', sira, { rol: o.rol ?? 'seftali', etiket: o.etiket ?? null, katman: 3 }),
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: b, rol: 'uc2', sira: 1 },
  ],
})

/**
 * Aci olcumu.
 * DIKKAT: aci saat yonunun TERSINE olculur. Kollar ters sirada verilirse
 * ic aci yerine donuk aci okunur. Ilk kol, ikincisinden saat yonunde geride.
 */
export const aci = (ad, a, merkez, b, sira, o = {}) => ({
  ...temel(ad, 'olcum_aci', sira, { rol: o.rol ?? 'tereyagi', etiket: o.etiket ?? null, katman: 3 }),
  stil: { rol: o.rol ?? 'tereyagi', opaklik: o.opaklik ?? 0.5 },
  bagimliliklar: [
    { kaynak: a, rol: 'uc1', sira: 0 },
    { kaynak: merkez, rol: 'merkez', sira: 1 },
    { kaynak: b, rol: 'uc2', sira: 2 },
  ],
})

/** Cokgenin ya da dairenin alani / cevresi. */
export const olcumKaynakli = (ad, tip, kaynak, sira, o = {}) => ({
  ...temel(ad, tip, sira, { rol: o.rol ?? 'tereyagi', etiket: o.etiket ?? null, katman: 3 }),
  bagimliliklar: [{ kaynak, rol: 'kaynak', sira: 0 }],
})

/**
 * Bir cokgenin donusmus kopyasi.
 *
 * Sekli bir butun olarak donusturmek yerine koseleri tek tek donusturup
 * uzerine cokgen kuruyoruz: ogrenci hangi kosenin nereye gittigini
 * goruyor ve A -> A' eslesmesini kendi kurabiliyor. Uretilen koseler
 * `${ad}_${eskiKoseAdi}` diye adlandirilir; olcum baglamak icin lazim.
 */
const kopyaCokgen = (uretici) => (ad, koseler, sira, o = {}) => {
  const yeniAdlar = koseler.map((k) => `${ad}_${k}`)
  return [
    ...koseler.map((k, i) =>
      uretici(yeniAdlar[i], k, sira + i, {
        rol: o.rol ?? 'gul',
        etiket: o.koseEtiketleri?.[i] ?? null,
        gorunur: o.koseGorunur ?? false,
      }),
    ),
    cokgen(ad, yeniAdlar, sira + koseler.length, {
      rol: o.rol ?? 'gul',
      opaklik: o.opaklik ?? 0.4,
      etiket: o.etiket ?? null,
    }),
  ]
}

/** Cokgenin (dx, dy) kadar otelenmis kopyasi. */
export const otelenmisCokgen = (ad, koseler, dx, dy, sira, o = {}) =>
  kopyaCokgen((yeni, k, s, ayar) => oteleme(yeni, k, dx, dy, s, ayar))(ad, koseler, sira, o)

/** Cokgenin merkez etrafinda aci kadar dondurulmus kopyasi. */
export const donmusCokgen = (ad, koseler, merkez, aciDerece, sira, o = {}) =>
  kopyaCokgen((yeni, k, s, ayar) => donme(yeni, k, merkez, aciDerece, s, ayar))(ad, koseler, sira, o)

/** Cokgenin merkeze gore oran katinda buyutulmus kopyasi. */
export const homotetikCokgen = (ad, koseler, merkez, oran, sira, o = {}) =>
  kopyaCokgen((yeni, k, s, ayar) => homoteti(yeni, k, merkez, oran, s, ayar))(ad, koseler, sira, o)

/**
 * Duzgun cokgenin koseleri: merkez etrafinda 360/n'lik donmelerle zincir
 * halinde uretilir. `duzgun_cokgen` tipi cokgeni tek nesnede veriyor ama
 * koselerini disari acmiyor; ic aciyi olcmek icin koselerin adi lazim.
 * Donen nesne { adlar, nesneler } - adlar dogrudan cokgen()'e verilir.
 */
export const duzgunKoseler = (onEk, merkez, ilkKose, n, sira, o = {}) => {
  const adlar = [ilkKose]
  const nesneler = []
  for (let i = 1; i < n; i++) {
    const ad = `${onEk}${i}`
    nesneler.push(
      donme(ad, adlar[i - 1], merkez, 360 / n, sira + i - 1, {
        rol: o.rol ?? 'lavanta',
        etiket: o.etiketli === false ? null : ad,
        gorunur: o.gorunur ?? true,
      }),
    )
    adlar.push(ad)
  }
  return { adlar, nesneler }
}

export const adim = (sira, baslik, anlatim, vurgu = []) => ({
  sira,
  baslik,
  anlatim,
  vurgu,
  aksiyon: null,
  beklenen: null,
})

export const ayar = (eksenModu, sinir, o = {}) => ({
  eksenModu,
  sinir,
  izgaraAdimi: o.izgaraAdimi ?? 1,
  birim: o.birim ?? 'birim',
  yapisma: o.yapisma ?? 'izgara',
  oranKilidi: true,
  arkaPlanMedyaId: null,
  olcek: null,
})

/** Sahneleri dogrulayip yazar, sonra ornek ve sorulari isler. */
export async function uret(cagir, { sahneler = [], ornekler = [], sorular = [] }) {
  for (const sahne of sahneler) {
    const d = JSON.parse(await cagir('sahne_dogrula', { sahne }))
    if (!d.gecerli) {
      console.log(`  HATA  ${sahne.slug}: ${d.hatalar.join(' | ')}`)
      continue
    }
    if (d.uyarilar.length) console.log(`  uyari ${sahne.slug}: ${d.uyarilar.join(' | ')}`)
    const s = JSON.parse(await cagir('sahne_yaz', { sahne }))
    console.log(`  sahne ${sahne.slug.padEnd(34)} ${s.nesne} nesne, ${s.adim} adim`)
  }
  for (const o of ornekler) {
    await cagir('gercek_hayat_yaz', o)
    console.log(`  ornek ${(o.sahneSlug ?? o.konuSlug).padEnd(34)} ${o.baslik}`)
  }
  for (const s of sorular) {
    await cagir('soru_yaz', s)
    console.log(`  soru  ${s.tip.padEnd(34)} ${s.govde.slice(0, 42)}...`)
  }
}
