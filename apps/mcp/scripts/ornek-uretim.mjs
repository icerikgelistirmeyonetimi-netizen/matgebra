/**
 * MCP uzerinden icerik uretimi ornegi.
 *
 * Sahne dosyaya degil veritabanina yazilir; bu betik o yolu bastan sona
 * kullanir: dogrula -> yaz -> gercek hayat anlatisi -> soru -> kapsama.
 * Faz 9'da icerik doldurma bu bicimde yurutulecek.
 *
 * Calistir: npm run ornek -w @matgebra/mcp
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const istemci = new Client({ name: 'ornek-uretim', version: '1' })
await istemci.connect(
  new StdioClientTransport({
    command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['tsx', 'apps/mcp/src/main.ts'],
    cwd: kok,
  }),
)

const cagir = async (ad, girdi = {}) => {
  const y = await istemci.callTool({ name: ad, arguments: girdi })
  const govde = y.content?.[0]?.text ?? ''
  if (y.isError) throw new Error(`${ad}: ${govde}`)
  return govde
}

const kose = (ad, x, y, sira) => ({
  ad,
  tip: 'nokta',
  etiket: ad,
  sira,
  katman: 2,
  gorunur: true,
  kilitli: false,
  surukleme: 'serbest',
  stil: { rol: 'lavanta' },
  parametreler: [
    { anahtar: 'x', deger: x, tur: 'sayi' },
    { anahtar: 'y', deger: y, tur: 'sayi' },
  ],
  bagimliliklar: [],
})

const SAHNE = {
  slug: 'fayans-doseme-alan',
  konuSlug: 's5-dikdortgenin-alani',
  tur: 'gercek_hayat',
  baslik: 'Fayans döşeme: kaç birim kare?',
  ozet:
    'Bir zemini fayansla döşerken kaç karo gerektiğini bulmak, dikdörtgenin alanını birim karelerle ölçmektir. Köşeleri sürükleyip alanın kenarlarla nasıl değiştiğini izleyin.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: {
    eksenModu: 'izgara',
    sinir: [-1, 9, 11, -1],
    izgaraAdimi: 1,
    birim: 'karo',
    yapisma: 'izgara',
    oranKilidi: true,
    arkaPlanMedyaId: null,
    olcek: null,
  },
  nesneler: [
    kose('A', 1, 1, 0),
    kose('B', 8, 1, 1),
    kose('C', 8, 6, 2),
    kose('D', 1, 6, 3),
    {
      ad: 'zemin',
      tip: 'cokgen',
      etiket: 'zemin',
      sira: 4,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'nane', opaklik: 0.45 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'kose', sira: 0 },
        { kaynak: 'B', rol: 'kose', sira: 1 },
        { kaynak: 'C', rol: 'kose', sira: 2 },
        { kaynak: 'D', rol: 'kose', sira: 3 },
      ],
    },
    {
      ad: 'alan',
      tip: 'olcum_alan',
      etiket: 'alan',
      sira: 5,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'tereyagi' },
      parametreler: [],
      bagimliliklar: [{ kaynak: 'zemin', rol: 'kaynak', sira: 0 }],
    },
    {
      ad: 'uzunKenar',
      tip: 'olcum_uzunluk',
      etiket: 'uzun kenar',
      sira: 6,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'seftali' },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'uc1', sira: 0 },
        { kaynak: 'B', rol: 'uc2', sira: 1 },
      ],
    },
    {
      ad: 'kisaKenar',
      tip: 'olcum_uzunluk',
      etiket: 'kısa kenar',
      sira: 7,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok' },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'B', rol: 'uc1', sira: 0 },
        { kaynak: 'C', rol: 'uc2', sira: 1 },
      ],
    },
  ],
  adimlar: [
    {
      sira: 1,
      baslik: 'Zemini karolarla kaplayın',
      anlatim:
        'Yeşil bölge döşenecek zemin. Izgaradaki her kare bir karoyu gösteriyor. Kaç karo gerektiğini önce sayarak bulun.',
      vurgu: ['zemin'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 2,
      baslik: 'Saymak yerine çarpın',
      anlatim:
        'Uzun kenar ile kısa kenarı çarpın. Sonuç, ortadaki alan ölçümüyle aynı çıkıyor — tek tek saymaya gerek kalmıyor.',
      vurgu: ['uzunKenar', 'kisaKenar', 'alan'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 3,
      baslik: 'Kenarı değiştirin',
      anlatim:
        'B ya da C köşesini sürükleyin. Bir kenar bir birim uzayınca alan kaç karo artıyor? Cevabı diğer kenarda arayın.',
      vurgu: ['B', 'C', 'alan'],
      aksiyon: null,
      beklenen: null,
    },
  ],
}

console.log('1) sahne_dogrula')
console.log('  ', (await cagir('sahne_dogrula', { sahne: SAHNE })).replace(/\s+/g, ' '))

console.log('2) sahne_yaz')
console.log('  ', (await cagir('sahne_yaz', { sahne: SAHNE })).replace(/\s+/g, ' '))

console.log('3) gercek_hayat_yaz')
console.log(
  '  ',
  (
    await cagir('gercek_hayat_yaz', {
      konuSlug: 's5-dikdortgenin-alani',
      sahneSlug: 'fayans-doseme-alan',
      baslik: 'Zemin karolaması',
      hikaye:
        'Bir odayı fayansla döşerken usta önce zemini karolara böler. Karolar birbirinin aynı olduğu için tek tek saymak yerine bir sıradaki karo sayısını sıra sayısıyla çarpmak yeter. Dikdörtgenin alan bağıntısı tam olarak bu işin matematiği.',
      soru: 'Bir kenarı 1 karo uzatırsanız toplam kaç karo eklenir? Neden?',
      olcekAciklama: 'Izgaradaki her kare 1 karoyu, yani yaklaşık 33 cm × 33 cm alanı gösterir.',
      kaynak: 'MEB kazanımı MAT.5.4.2 — birim karelerden yola çıkarak dikdörtgenin alanı',
      yasAraligi: '10-12',
    })
  ).replace(/\s+/g, ' '),
)

console.log('4) soru_yaz')
console.log(
  '  ',
  (
    await cagir('soru_yaz', {
      konuSlug: 's5-dikdortgenin-alani',
      sahneSlug: 'fayans-doseme-alan',
      tip: 'tahtadan_olcum',
      govde: 'Zemini 7 karo uzunluğunda ve 5 karo genişliğinde ayarlayın. Alan kaç karo olur?',
      cevap: { deger: 35, birim: 'karo', tolerans: 0 },
      ipucu: 'Uzun kenar ile kısa kenarı çarpın.',
      cozum: '7 × 5 = 35. Bir sırada 7 karo var, 5 sıra döşeniyor.',
      zorluk: 2,
      puan: 2,
    })
  ).replace(/\s+/g, ' '),
)

console.log('5) kapsama_raporu (5. sinif geometri)')
const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log(
  '  ',
  JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 5)),
  '| sahnesiz konu:',
  rapor.sahnesizKonuSayisi,
)

await istemci.close()
