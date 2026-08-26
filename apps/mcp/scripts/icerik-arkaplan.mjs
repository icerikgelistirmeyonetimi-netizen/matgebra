/**
 * Gercek hayat sahnelerine arka plan gorseli ve olcek baglar.
 *
 * Gorseller `npm run gorsel -w @matgebra/mcp` ile uretiliyor; bu betik
 * onlari veritabanindaki sahnelere baglar ve olcegi kurar.
 *
 * Olcek nasil okunur: referansA ile referansB arasindaki TAHTA uzakligi,
 * gercekte `gercekUzunluk` kadardir. Motor oradan carpani bulur ve butun
 * uzunluk olcumlerini o birimde yazar; alan olcumlerinde carpanin karesi
 * kullanilir.
 *
 * Calistir: npm run icerik-arkaplan -w @matgebra/mcp
 */
import { baglan } from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-arkaplan')

const BAGLAR = [
  {
    sahneSlug: 'cini-deseni-altigen',
    yol: '/medya/cini-altigen.svg',
    altMetin:
      'Iznik cinisi duzeninde altigen karolar. Her karonun ortasinda uc yapraklli bir lale motifi var; karolar bosluksuz birlesiyor.',
    lisans: 'kendi-uretimimiz',
    kaynak: 'apps/mcp/scripts/gorsel-uret.mjs',
    genislik: 900,
    yukseklik: 900,
    // Bir karonun merkezi ile komsu karonun merkezi arasi 7.5 tahta birimi;
    // gercek cinide bu uzaklik 26 santimetredir.
    olcek: {
      referansA: [0, 0],
      referansB: [7.5, 0],
      gercekUzunluk: 26,
      birim: 'cm',
      aciklama: 'İki komşu karonun merkezi arası 26 santimetredir.',
    },
  },
  {
    sahneSlug: 'yaya-gecidi-paralel-kesen',
    yol: '/medya/yaya-gecidi.svg',
    altMetin:
      'Iki kaldirim arasinda asfalt bir yol. Yola egik duran, birbirine paralel beyaz yaya gecidi seritleri var.',
    lisans: 'kendi-uretimimiz',
    kaynak: 'apps/mcp/scripts/gorsel-uret.mjs',
    genislik: 1000,
    yukseklik: 800,
    // Yolun genisligi (iki kaldirim kenari arasi) 8 tahta birimi = 8 metre.
    olcek: {
      referansA: [0, -4],
      referansB: [0, 4],
      gercekUzunluk: 8,
      birim: 'm',
      aciklama: 'İki kaldırım kenarı arası yol genişliği 8 metredir.',
    },
  },
  {
    sahneSlug: 'merdiven-pisagor',
    yol: '/medya/merdiven-duvari.svg',
    altMetin:
      'Solda tugla bir duvar, altta parke zemin. Duvarda kucuk bir pencere var. Duvar ile zemin dik aci yapiyor.',
    lisans: 'kendi-uretimimiz',
    kaynak: 'apps/mcp/scripts/gorsel-uret.mjs',
    genislik: 700,
    yukseklik: 650,
    // Sahne zaten metre biriminde kurulu: 1 tahta birimi 1 metre.
    olcek: {
      referansA: [1, 0],
      referansB: [1, 1],
      gercekUzunluk: 1,
      birim: 'm',
      aciklama: 'Izgaradaki bir kare 1 metredir; duvardaki pencere 1 metre genişliğindedir.',
    },
  },
]

console.log('ARKA PLAN GORSELLERI VE OLCEK\n')
for (const bag of BAGLAR) {
  const s = JSON.parse(await cagir('medya_yaz', bag))
  console.log(
    `  ${s.sahneSlug.padEnd(28)} medya #${s.medyaId}  ${s.olcekli ? 'ölçekli' : 'ölçeksiz'}`,
  )
}

await istemci.close()
