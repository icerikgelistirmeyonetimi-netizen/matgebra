/**
 * 5. sinif geometri diliminin eksik sahneleri.
 *
 * Uretim MCP uzerinden yapiliyor: dogrula -> yaz -> gercek hayat -> soru.
 * Bu betik Faz 9'un calisma bicimini gosteriyor; kalan siniflar da ayni
 * yoldan doldurulacak.
 *
 * Calistir: npm run icerik-s5 -w @matgebra/mcp
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const istemci = new Client({ name: 'icerik-s5', version: '1' })
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

/* ------------------------------------------------------------ yardimcilar */

const nokta = (ad, x, y, sira, { surukleme = 'serbest', rol = 'lavanta', etiket } = {}) => ({
  ad,
  tip: 'nokta',
  etiket: etiket ?? ad,
  sira,
  katman: 2,
  gorunur: true,
  kilitli: surukleme === 'yok',
  surukleme,
  stil: { rol },
  parametreler: [
    { anahtar: 'x', deger: x, tur: 'sayi' },
    { anahtar: 'y', deger: y, tur: 'sayi' },
  ],
  bagimliliklar: [],
})

/** (apsisKaynak.x, ordinatKaynak.y) — dikdortgen koseleri icin. */
const bilesen = (ad, apsis, ordinat, sira, rol = 'lavanta') => ({
  ad,
  tip: 'nokta_bilesen',
  etiket: ad,
  sira,
  katman: 2,
  gorunur: true,
  kilitli: true,
  surukleme: 'yok',
  stil: { rol },
  parametreler: [],
  bagimliliklar: [
    { kaynak: apsis, rol: 'apsis', sira: 0 },
    { kaynak: ordinat, rol: 'ordinat', sira: 1 },
  ],
})

/** Bir noktanin merkeze gore tam karsisi: 180 derece otesi. */
const karsiNokta = (ad, merkez, kaynak, sira) => ({
  ad,
  tip: 'nokta_uzerinde',
  etiket: null,
  sira,
  katman: 1,
  gorunur: false,
  kilitli: true,
  surukleme: 'yok',
  stil: { rol: 'notr' },
  parametreler: [{ anahtar: 'aci_ofset', deger: 180, tur: 'sayi' }],
  bagimliliklar: [
    { kaynak: merkez, rol: 'merkez', sira: 0 },
    { kaynak: kaynak, rol: 'yaricap_noktasi', sira: 1 },
  ],
})

const cokgen = (ad, koseler, sira, rol = 'nane', opaklik = 0.4, etiket) => ({
  ad,
  tip: 'cokgen',
  etiket,
  sira,
  katman: 0,
  gorunur: true,
  kilitli: true,
  surukleme: 'yok',
  stil: { rol, opaklik },
  parametreler: [],
  bagimliliklar: koseler.map((k, i) => ({ kaynak: k, rol: 'kose', sira: i })),
})

const olcum = (ad, tip, kaynaklar, sira, rol = 'seftali', etiket) => ({
  ad,
  tip,
  etiket,
  sira,
  katman: 3,
  gorunur: true,
  kilitli: true,
  surukleme: 'yok',
  stil: { rol },
  parametreler: [],
  bagimliliklar: kaynaklar,
})

const uc = (a, b) => [
  { kaynak: a, rol: 'uc1', sira: 0 },
  { kaynak: b, rol: 'uc2', sira: 1 },
]

/**
 * Aci kollari.
 *
 * DIKKAT: motor aciyi saat yonunun TERSINE olcer. Kollar yanlis sirada
 * verilirse ic aci yerine ters aci (donuk aci) okunur - 39 derece yerine
 * 321 derece gibi. Kural: ilk kol, ikinciden saat yonunde geride olmali.
 */
const aciKollari = (a, merkez, b) => [
  { kaynak: a, rol: 'uc1', sira: 0 },
  { kaynak: merkez, rol: 'merkez', sira: 1 },
  { kaynak: b, rol: 'uc2', sira: 2 },
]

const adim = (sira, baslik, anlatim, vurgu = []) => ({
  sira,
  baslik,
  anlatim,
  vurgu,
  aksiyon: null,
  beklenen: null,
})

const ayar = (eksenModu, sinir, birim = 'birim', yapisma = 'izgara') => ({
  eksenModu,
  sinir,
  izgaraAdimi: 1,
  birim,
  yapisma,
  oranKilidi: true,
  arkaPlanMedyaId: null,
  olcek: null,
})

/* ---------------------------------------------------------------- sahneler */

const MAKAS = {
  slug: 'makas-ters-acilar',
  konuSlug: 's5-dogrularin-durumlari-ve-acilar',
  tur: 'gercek_hayat',
  baslik: 'Makasın kolları: ters açılar',
  ozet:
    'Makasın iki kolu kesişen iki doğrudur. Kolları açıp kapatın: karşılıklı açıların hep eşit, komşu açıların toplamının hep 180 derece kaldığını görün.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-9, 7, 9, -7], 'derece', 'yok'),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('A', 7, 2.5, 1, { rol: 'seftali', etiket: 'kol ucu' }),
    nokta('B', 7, -2.5, 2, { rol: 'gok', etiket: 'kol ucu' }),
    {
      ad: 'd1',
      tip: 'dogru',
      etiket: null,
      sira: 3,
      katman: 1,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'seftali', kalinlik: 3 },
      parametreler: [],
      bagimliliklar: uc('O', 'A'),
    },
    {
      ad: 'd2',
      tip: 'dogru',
      etiket: null,
      sira: 4,
      katman: 1,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok', kalinlik: 3 },
      parametreler: [],
      bagimliliklar: uc('O', 'B'),
    },
    // Karsi kol uclari: A ve B'nin O'ya gore tam karsisi (180 derece).
    // Once sabit nokta kullanmistim; kol suruklenince ters aci esitligi
    // bozuluyordu - yani sahne yanlis bir sey ogretiyordu.
    karsiNokta('A2', 'O', 'A', 5),
    karsiNokta('B2', 'O', 'B', 6),
    // B -> A: saat yonunun tersine dar aciyi tarar (kollarin arasi).
    olcum('aciSag', 'olcum_aci', aciKollari('B', 'O', 'A'), 7, 'tereyagi'),
    // Karsi taraftaki ters aci; ayni yonde tarandigi icin ayni degeri verir.
    olcum('aciSol', 'olcum_aci', aciKollari('B2', 'O', 'A2'), 8, 'tereyagi'),
    // Ust taki komsu aci: dar aciyla toplami 180 etmeli.
    olcum('aciUst', 'olcum_aci', aciKollari('A', 'O', 'B2'), 9, 'nane'),
  ],
  adimlar: [
    adim(
      1,
      'Makas iki doğrudur',
      'Makasın kolları O noktasında kesişen iki doğru gibi düşünülebilir. Kesişme dört açı oluşturur.',
      ['d1', 'd2', 'O'],
    ),
    adim(
      2,
      'Karşılıklı açılar eşittir',
      'Sarı işaretli iki açı karşılıklı — ters açı denir. Kol uçlarını sürükleyin: ikisi hep aynı kalıyor.',
      ['aciSag', 'aciSol'],
    ),
    adim(
      3,
      'Komşu açılar bütünlerdir',
      'Yeşil açı ile yanındaki sarı açı komşudur. Toplamları hep 180 derece çıkar; ikisi birlikte doğru açı oluşturur.',
      ['aciSag', 'aciUst'],
    ),
  ],
}

const FISKIYE = {
  slug: 'fiskiye-kesisen-cemberler',
  konuSlug: 's5-kesisen-cemberler-ve-ucgen-insasi',
  tur: 'gercek_hayat',
  baslik: 'İki fıskiye: kesişen çemberler',
  ozet:
    'Bahçedeki iki fıskiye aynı uzaklığa su atıyor. Suladıkları daireler kesişiyor. Kesişim noktasını fıskiyelere birleştirince ne tür bir üçgen çıkıyor?',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 11, -8]),
  nesneler: [
    nokta('M', -2, 0, 0, { surukleme: 'yok', rol: 'gok', etiket: '1. fıskiye' }),
    nokta('N', 2, 0, 1, { surukleme: 'yok', rol: 'gok', etiket: '2. fıskiye' }),
    nokta('R', 2.5, 0, 2, { rol: 'seftali', etiket: 'menzil' }),
    {
      ad: 'c1',
      tip: 'cember',
      etiket: null,
      sira: 3,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok', cizgiTipi: 'kesik', kalinlik: 1.5 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'M', rol: 'merkez', sira: 0 },
        { kaynak: 'R', rol: 'uzerinde', sira: 1 },
      ],
    },
    // Ikinci cember, birincinin yaricapini aynen alir: yaricap M ile R
    // arasindaki uzaklikla tanimlanir. Pergel acikligini bozmadan igneyi
    // ikinci fiskiyeye tasimak gibi.
    {
      ad: 'c2',
      tip: 'cember',
      etiket: null,
      sira: 4,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'nane', cizgiTipi: 'kesik', kalinlik: 1.5 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'N', rol: 'merkez', sira: 0 },
        { kaynak: 'M', rol: 'uc1', sira: 1 },
        { kaynak: 'R', rol: 'uc2', sira: 2 },
      ],
    },
    olcum('mn', 'olcum_uzunluk', uc('M', 'N'), 5, 'notr', 'fıskiye arası'),
    olcum('menzil', 'olcum_uzunluk', uc('M', 'R'), 6, 'seftali', 'menzil'),
  ],
  adimlar: [
    adim(
      1,
      'Her fıskiye bir daire sular',
      'Fıskiyeler M ve N noktalarında. Attıkları su, merkezleri onlar olan iki daireyi kaplıyor.',
      ['M', 'N', 'c1', 'c2'],
    ),
    adim(
      2,
      'Menzili değiştirin',
      'Menzil noktasını sürükleyin. İki fıskiyenin menzili birlikte değişiyor — ikisi de aynı model.',
      ['R', 'menzil'],
    ),
    adim(
      3,
      'Ne zaman kesişirler?',
      'Menzil, fıskiye arası uzaklığın yarısından küçükse daireler ayrı kalır. İki ölçümü karşılaştırın: kesişmenin koşulunu bulun.',
      ['mn', 'menzil'],
    ),
    adim(
      4,
      'Kesişim noktasından üçgen',
      'Menzil tam olarak fıskiye arası uzaklığa eşitken, kesişim noktasını iki fıskiyeye birleştirin: üç kenarı da eşit bir üçgen çıkar. Bunu serbest tuvalde deneyin.',
      [],
    ),
  ],
}

const BAHCE_CITI = {
  slug: 'bahce-citi-cevre',
  konuSlug: 's5-dikdortgenin-cevresi',
  tur: 'gercek_hayat',
  baslik: 'Bahçe çiti: aynı çit, farklı bahçe',
  ozet:
    'Elinizde belli uzunlukta çit var. Bahçeyi uzun ve dar mı, yoksa kareye yakın mı yapmalı? Köşeyi sürükleyip çevre ile alanın nasıl ayrı davrandığını görün.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 11, 15, -1], 'metre'),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 10, 6, 1, { rol: 'seftali', etiket: 'karşı köşe' }),
    bilesen('B', 'C', 'A', 2),
    bilesen('D', 'A', 'C', 3),
    cokgen('bahce', ['A', 'B', 'C', 'D'], 4, 'nane', 0.4, 'bahçe'),
    olcum('uzunKenar', 'olcum_uzunluk', uc('A', 'B'), 5, 'seftali', 'en'),
    olcum('kisaKenar', 'olcum_uzunluk', uc('B', 'C'), 6, 'gok', 'boy'),
    olcum('cevre', 'olcum_cevre', [{ kaynak: 'bahce', rol: 'kaynak', sira: 0 }], 7, 'lavanta'),
    olcum('alan', 'olcum_alan', [{ kaynak: 'bahce', rol: 'kaynak', sira: 0 }], 8, 'tereyagi'),
  ],
  adimlar: [
    adim(
      1,
      'Çit çevreyi ölçer',
      'Bahçenin etrafına çekilen çit, dikdörtgenin çevresi kadardır: iki en, iki boy.',
      ['cevre', 'bahce'],
    ),
    adim(
      2,
      'Köşeyi sürükleyin',
      'Karşı köşeyi hareket ettirin. En ve boy değişince hem çevre hem alan değişiyor — ama aynı oranda değil.',
      ['C', 'uzunKenar', 'kisaKenar'],
    ),
    adim(
      3,
      'Aynı çevre, farklı alan',
      'Çevreyi 24 metrede tutmayı deneyin: en 9 boy 3, sonra en 6 boy 6. Çevre aynı kalırken alan değişiyor. Kareye yaklaştıkça alan büyüyor.',
      ['cevre', 'alan'],
    ),
  ],
}

const ODA = {
  slug: 'oda-hali-ve-supurgelik',
  konuSlug: 's5-cevre-ve-alan-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Odanın halısı ve süpürgeliği',
  ozet:
    'Aynı oda için iki farklı ölçü gerekir: halı alan ister, süpürgelik çevre. Karıştırmamak için ikisini yan yana izleyin.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 10, 14, -1], 'metre'),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 9, 6, 1, { rol: 'seftali', etiket: 'oda köşesi' }),
    bilesen('B', 'C', 'A', 2),
    bilesen('D', 'A', 'C', 3),
    cokgen('oda', ['A', 'B', 'C', 'D'], 4, 'gok', 0.35, 'oda'),
    olcum('alan', 'olcum_alan', [{ kaynak: 'oda', rol: 'kaynak', sira: 0 }], 5, 'tereyagi'),
    olcum('cevre', 'olcum_cevre', [{ kaynak: 'oda', rol: 'kaynak', sira: 0 }], 6, 'lavanta'),
    olcum('en', 'olcum_uzunluk', uc('A', 'B'), 7, 'seftali', 'en'),
    olcum('boy', 'olcum_uzunluk', uc('B', 'C'), 8, 'nane', 'boy'),
  ],
  adimlar: [
    adim(
      1,
      'Halı alanı kaplar',
      'Halı zemini örter; kaç metrekare gerektiğini alan söyler. Sarı ölçüm bunu gösteriyor.',
      ['alan', 'oda'],
    ),
    adim(
      2,
      'Süpürgelik duvarı çevreler',
      'Süpürgelik duvar diplerine gider; kaç metre gerektiğini çevre söyler. Mor ölçüm bunu gösteriyor.',
      ['cevre'],
    ),
    adim(
      3,
      'İkisi birlikte değişir ama farklı',
      'Köşeyi sürükleyin. Odayı iki katına çıkarınca çevre iki katına çıkmıyor, alan dört katına çıkmıyor. Aralarındaki fark burada görünür.',
      ['C', 'alan', 'cevre'],
    ),
  ],
}

/* ------------------------------------------------------------------ akis */

const SAHNELER = [MAKAS, FISKIYE, BAHCE_CITI, ODA]

const ORNEKLER = [
  {
    konuSlug: 's5-dogrularin-durumlari-ve-acilar',
    sahneSlug: 'makas-ters-acilar',
    baslik: 'Makas, kavşak ve X şeklindeki her şey',
    hikaye:
      'İki doğrunun kesiştiği her yerde aynı desen çıkar: makasın kolları, kavşakta buluşan iki yol, katlanan bir kapı. Karşılıklı açılar eşittir, komşu açılar bütünlerdir. Bu yüzden bir kavşakta karşıdan gelen aracın gördüğü açı, sizin gördüğünüzle aynıdır.',
    soru: 'Makası biraz daha açtığınızda hangi açılar büyür, hangileri küçülür? Toplam neden değişmez?',
    olcekAciklama: 'Tahtadaki açılar gerçek derece değerleridir.',
    kaynak: 'MEB kazanımı MAT.5.3.4 — doğruların durumuna bağlı açılar',
    yasAraligi: '10-12',
  },
  {
    konuSlug: 's5-kesisen-cemberler-ve-ucgen-insasi',
    sahneSlug: 'fiskiye-kesisen-cemberler',
    baslik: 'Bahçe sulamasında kesişen daireler',
    hikaye:
      'Peyzaj planlamasında fıskiyeler, suladıkları daireler birbirini örtecek şekilde yerleştirilir; yoksa arada kuru bölge kalır. İki eşit menzilli fıskiyenin kesişim noktası, ikisine de aynı uzaklıktadır. Merkezleri bu noktaya birleştirince eşkenar üçgen çıkar — pergelle eşkenar üçgen çizmenin yöntemi tam olarak budur.',
    soru: 'Fıskiyeler arası uzaklık menzile eşitken oluşan üçgenin kenarları neden birbirine eşit?',
    olcekAciklama: 'Izgaradaki 1 birim yaklaşık 1 metreye karşılık gelir.',
    kaynak: 'MEB kazanımı MAT.5.3.7 — kesişen çember çiftiyle üçgen inşası',
    yasAraligi: '10-12',
  },
  {
    konuSlug: 's5-dikdortgenin-cevresi',
    sahneSlug: 'bahce-citi-cevre',
    baslik: 'Elde belli uzunlukta çit varken',
    hikaye:
      'Bir bahçıvanın 24 metre çiti var. Bunu 9×3 metrelik uzun bir bahçeye de, 6×6 metrelik kare bir bahçeye de çevirebilir. Çit aynı, ekilebilir alan farklı: 27 metrekare ile 36 metrekare. Aynı çevreyle en büyük alanı kare verir.',
    soru: 'Çevresi 20 metre olan kaç farklı dikdörtgen bahçe kurulabilir? Hangisi en geniştir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.5.4.1 — çevre verildiğinde kenar uzunlukları',
    yasAraligi: '10-12',
  },
  {
    konuSlug: 's5-cevre-ve-alan-problemleri',
    sahneSlug: 'oda-hali-ve-supurgelik',
    baslik: 'Halı metrekare, süpürgelik metre',
    hikaye:
      'Bir odayı döşerken iki ayrı hesap yapılır. Halı yerin tamamını kaplar, bu yüzden metrekare ile ölçülür ve alan gerekir. Süpürgelik duvar diplerine çakılır, metre ile ölçülür ve çevre gerekir. Kapı boşluğu süpürgelikten düşülür ama halıdan düşülmez — hesabın hangi ölçüye ait olduğunu bilmek bu yüzden önemlidir.',
    soru: 'Eni 5, boyu 4 metre olan oda için kaç metrekare halı, kaç metre süpürgelik gerekir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.5.4.4 — çevre ve alan problemleri',
    yasAraligi: '10-12',
  },
]

const SORULAR = [
  {
    konuSlug: 's5-dogrularin-durumlari-ve-acilar',
    sahneSlug: 'makas-ters-acilar',
    tip: 'coktan_secmeli',
    govde: 'Kesişen iki doğrunun oluşturduğu ters açılar için hangisi doğrudur?',
    secenekler: [
      'Toplamları 180 derecedir.',
      'Her zaman birbirine eşittir.',
      'Her zaman 90 derecedir.',
      'Toplamları 360 derecedir.',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Sahnede kolları oynatıp iki sarı ölçümü karşılaştırın.',
    cozum:
      'Ters açılar karşılıklıdır ve her zaman eşittir. Toplamı 180 olan açılar komşu (bütünler) açılardır.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-dogrularin-durumlari-ve-acilar',
    tip: 'sayisal',
    govde: 'Kesişen iki doğruda bir açı 65 derece ise komşusu kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 115, tolerans: 0, birim: 'derece' },
    ipucu: 'Komşu açılar birlikte doğru açı oluşturur.',
    cozum: '180 − 65 = 115. Komşu açılar bütünlerdir.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-dikdortgenin-cevresi',
    sahneSlug: 'bahce-citi-cevre',
    tip: 'tahtadan_olcum',
    govde:
      'Sahnede bahçeyi eni 6, boyu 6 metre olacak şekilde ayarlayın. Çevre kaç metre olur?',
    cevap: { tip: 'tahtadan_olcum', deger: 24, tolerans: 0.5, birim: 'metre' },
    ipucu: 'Çevre = 2 × (en + boy).',
    cozum: '2 × (6 + 6) = 24 metre. Kare de bir dikdörtgendir, aynı bağıntı geçerlidir.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-dikdortgenin-cevresi',
    tip: 'acik_uclu',
    govde:
      'Çevresi 20 metre olan iki farklı dikdörtgen bahçe düşünün. Hangisinin alanı daha büyük, neden?',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Örneğin 8×2 bahçenin alanı 16, 5×5 bahçenin alanı 25 metrekaredir. Çevre ikisinde de 20 metre ama kenarlar birbirine yaklaştıkça alan büyür; en büyük alanı kare verir.',
      anahtarlar: ['kare', 'alan', 'çevre'],
    },
    ipucu: 'Birkaç en–boy ikilisi deneyin ve alanları karşılaştırın.',
    cozum:
      'Çevre sabitken en ile boyun toplamı sabittir. Toplamı sabit iki sayının çarpımı, sayılar birbirine eşitken en büyüktür. Bu yüzden kare en geniş alanı verir.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's5-cevre-ve-alan-problemleri',
    sahneSlug: 'oda-hali-ve-supurgelik',
    tip: 'sayisal',
    govde: 'Eni 5, boyu 4 metre olan bir oda için kaç metrekare halı gerekir?',
    cevap: { tip: 'sayisal', deger: 20, tolerans: 0, birim: 'metrekare' },
    ipucu: 'Halı zemini kaplar; hangi ölçü gerekiyor?',
    cozum: 'Halı alan ister: 5 × 4 = 20 metrekare.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-cevre-ve-alan-problemleri',
    tip: 'sayisal',
    govde: 'Aynı oda (5 metre × 4 metre) için kaç metre süpürgelik gerekir?',
    cevap: { tip: 'sayisal', deger: 18, tolerans: 0, birim: 'metre' },
    ipucu: 'Süpürgelik duvar diplerine gider; hangi ölçü gerekiyor?',
    cozum: 'Süpürgelik çevre ister: 2 × (5 + 4) = 18 metre.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-kesisen-cemberler-ve-ucgen-insasi',
    tip: 'dogru_yanlis',
    govde:
      'Eşit yarıçaplı iki çemberin merkezleri arası uzaklık yarıçapa eşitse, kesişim noktası ile merkezler eşkenar üçgen oluşturur.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Kesişim noktasının her iki merkeze uzaklığı nedir?',
    cozum:
      'Kesişim noktası her iki çemberin üzerindedir, yani iki merkeze de yarıçap kadar uzaktır. Merkezler arası uzaklık da yarıçapa eşitse üç kenar da eşit olur.',
    zorluk: 3,
    puan: 2,
  },
]

/* --------------------------------------------------------------- calistir */

console.log('5. SINIF GEOMETRI - EKSIK SAHNELER\n')

for (const sahne of SAHNELER) {
  const dogrulama = JSON.parse(await cagir('sahne_dogrula', { sahne }))
  if (!dogrulama.gecerli) {
    console.log(`  HATA ${sahne.slug}: ${dogrulama.hatalar.join(' | ')}`)
    continue
  }
  if (dogrulama.uyarilar.length) {
    console.log(`  uyari ${sahne.slug}: ${dogrulama.uyarilar.join(' | ')}`)
  }
  const sonuc = JSON.parse(await cagir('sahne_yaz', { sahne }))
  console.log(`  sahne  ${sahne.slug.padEnd(32)} ${sonuc.nesne} nesne, ${sonuc.adim} adim`)
}

for (const o of ORNEKLER) {
  await cagir('gercek_hayat_yaz', o)
  console.log(`  ornek  ${o.sahneSlug.padEnd(32)} ${o.baslik}`)
}

for (const s of SORULAR) {
  await cagir('soru_yaz', {
    konuSlug: s.konuSlug,
    sahneSlug: s.sahneSlug,
    tip: s.tip,
    govde: s.govde,
    secenekler: s.secenekler,
    cevap: s.cevap,
    ipucu: s.ipucu,
    cozum: s.cozum,
    zorluk: s.zorluk,
    puan: s.puan,
  })
  console.log(`  soru   ${s.tip.padEnd(32)} ${s.govde.slice(0, 46)}...`)
}

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n5. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 5)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
