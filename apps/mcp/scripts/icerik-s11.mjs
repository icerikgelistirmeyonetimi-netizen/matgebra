/**
 * 11. sinif geometri dilimi - dort konu, bes sahne.
 *
 * Calistir: npm run icerik-s11 -w @matgebra/mcp
 */
import {
  aci,
  adim,
  ayar,
  baglan,
  cizgi,
  cokgen,
  duzgunKoseler,
  kesisim,
  nokta,
  olcumKaynakli,
  oran,
  ortaNokta,
  paralelDik,
  surgu,
  uret,
  uzunluk,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-s11')

/* --------------------------------------------------------------- sahneler */

const PARALELKENAR = {
  slug: 'paralelkenar-kosegenleri',
  konuSlug: 's11-dortgenlerin-ozellikleri',
  tur: 'kesif',
  baslik: 'Paralelkenarda köşegenler birbirini ortalar',
  ozet:
    'Dördüncü köşe çizilmiyor, türetiliyor: iki paralel doğrunun kesişimi. Bu yüzden şekil nasıl değişirse değişsin paralelkenar olmaktan çıkmıyor.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 8, 11, -7]),
  nesneler: [
    nokta('A', -6, -4, 0, { rol: 'lavanta' }),
    nokta('B', 4, -4, 1, { rol: 'lavanta' }),
    nokta('D', -2, 3, 2, { rol: 'lavanta' }),
    cizgi('AB', 'dogru', 'A', 'B', 3, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    cizgi('AD', 'dogru', 'A', 'D', 4, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    paralelDik('pB', 'paralel', 'AD', 'B', 5, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    paralelDik('pD', 'paralel', 'AB', 'D', 6, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    kesisim('C', 'pB', 'pD', 7, { rol: 'lavanta', etiket: 'C' }),
    cokgen('dortgen', ['A', 'B', 'C', 'D'], 8, { rol: 'nane', opaklik: 0.4 }),
    cizgi('kosegenAC', 'dogru_parcasi', 'A', 'C', 9, { rol: 'gul', kalinlik: 3 }),
    cizgi('kosegenBD', 'dogru_parcasi', 'B', 'D', 10, { rol: 'gok', kalinlik: 3 }),
    kesisim('K', 'kosegenAC', 'kosegenBD', 11, { rol: 'seftali', etiket: 'K' }),
    cizgi('AK', 'dogru_parcasi', 'A', 'K', 12, { rol: 'gul', kalinlik: 5 }),
    cizgi('KC', 'dogru_parcasi', 'K', 'C', 13, { rol: 'seftali', kalinlik: 5 }),
    oran('kosegenOrani', 'AK', 'KC', 14, { rol: 'gul', etiket: 'AK / KC', dy: 0.9 }),
    uzunluk('kenarAB', 'A', 'B', 15, { rol: 'nane', etiket: 'AB' }),
    uzunluk('kenarDC', 'D', 'C', 16, { rol: 'nane', etiket: 'DC' }),
    uzunluk('kenarAD', 'A', 'D', 17, { rol: 'gok', etiket: 'AD' }),
    uzunluk('kenarBC', 'B', 'C', 18, { rol: 'gok', etiket: 'BC' }),
  ],
  adimlar: [
    adim(1, 'Dördüncü köşe türetiliyor', 'A, B ve D serbest. C ise B’den AD’ye, D’den AB’ye çizilen paralellerin kesişimi. Bu yüzden karşılıklı kenarlar her zaman paralel.', ['pB', 'pD', 'C']),
    adim(2, 'Karşılıklı kenarlar eşit', 'AB ile DC, AD ile BC ölçümlerini karşılaştırın. Köşeleri sürükleseniz de eşitlik bozulmuyor.', ['kenarAB', 'kenarDC', 'kenarAD', 'kenarBC']),
    adim(3, 'Köşegenleri çizin', 'AC ve BD köşegenleri K noktasında kesişiyor.', ['kosegenAC', 'kosegenBD', 'K']),
    adim(4, 'K tam ortada', 'AK’yı KC’ye bölün: 1 çıkıyor. Köşegenler birbirini ortalıyor. Bu, paralelkenarı tanımanın en pratik yoludur.', ['AK', 'KC', 'kosegenOrani']),
  ],
}

const YAMUK = {
  slug: 'yamuk-orta-taban',
  konuSlug: 's11-dortgenlerin-ozellikleri',
  tur: 'kesif',
  baslik: 'Yamukta orta taban, iki tabanın ortalamasıdır',
  ozet:
    'Yan kenarların orta noktalarını birleştirin. Çıkan parça her zaman iki tabana paralel ve uzunluğu onların ortalaması kadar.',
  zorluk: 4,
  sira: 2,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 9, 11, -8]),
  nesneler: [
    nokta('Z1', -10, -5, 0, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('Z2', 10, -5, 1, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('altDogru', 'dogru', 'Z1', 'Z2', 2, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    nokta('Ykontrol', 9, 4, 3, { rol: 'gok', etiket: 'üst taban yüksekliği' }),
    paralelDik('ustDogru', 'paralel', 'altDogru', 'Ykontrol', 4, {
      rol: 'notr',
      kalinlik: 1,
      cizgiTipi: 'noktali',
    }),
    surgu('A', 'altDogru', -7, -5, 5, { rol: 'lavanta', etiket: 'A' }),
    surgu('B', 'altDogru', 6, -5, 6, { rol: 'lavanta', etiket: 'B' }),
    surgu('C', 'ustDogru', 3, 4, 7, { rol: 'lavanta', etiket: 'C' }),
    surgu('D', 'ustDogru', -3, 4, 8, { rol: 'lavanta', etiket: 'D' }),
    cokgen('yamuk', ['A', 'B', 'C', 'D'], 9, { rol: 'nane', opaklik: 0.4 }),
    ortaNokta('E', 'A', 'D', 10, { rol: 'gul', etiket: 'E' }),
    ortaNokta('F', 'B', 'C', 11, { rol: 'gul', etiket: 'F' }),
    cizgi('ortaTaban', 'dogru_parcasi', 'E', 'F', 12, { rol: 'gul', kalinlik: 4 }),
    uzunluk('altTaban', 'A', 'B', 13, { rol: 'lavanta', etiket: 'AB' }),
    uzunluk('ustTaban', 'D', 'C', 14, { rol: 'lavanta', etiket: 'DC' }),
    uzunluk('orta', 'E', 'F', 15, { rol: 'gul', etiket: 'EF' }),
    olcumKaynakli('alan', 'olcum_alan', 'yamuk', 16, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(1, 'İki paralel taban', 'AB ve DC aynı doğrultuda; aralarındaki uzaklık yamuğun yüksekliği.', ['altTaban', 'ustTaban']),
    adim(2, 'Yan kenarların ortaları', 'E, AD’nin ortası; F, BC’nin ortası. İkisini birleştirin.', ['E', 'F', 'ortaTaban']),
    adim(3, 'Ortalama çıkıyor', 'AB ile DC’yi toplayıp ikiye bölün: tam olarak EF çıkıyor. Uçları sürükleyip deneyin.', ['altTaban', 'ustTaban', 'orta']),
    adim(4, 'Alan da oradan', 'Yamuğun alanı, orta taban çarpı yüksekliktir. Çünkü orta taban zaten iki tabanın ortalaması.', ['alan', 'orta']),
  ],
}

const BUKEYLIK = {
  slug: 'icbukey-disbukey-cokgen',
  konuSlug: 's11-icbukey-ve-disbukey-cokgenler',
  tur: 'kesif',
  baslik: 'İçbükey mi dışbükey mi?',
  ozet:
    'D köşesini içeri doğru itin: o köşedeki iç açı 180 dereceyi geçiyor ve çokgen içbükeye dönüşüyor. Ölçüm bu geçişi tam olarak gösteriyor.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 9, 10, -7]),
  nesneler: [
    nokta('A', -7, -4, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 5, -5, 1, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 8, 2, 2, { surukleme: 'yok', rol: 'notr' }),
    nokta('D', 0, 7, 3, { rol: 'seftali', etiket: 'D (sürükleyin)' }),
    nokta('E', -6, 3, 4, { surukleme: 'yok', rol: 'notr' }),
    cokgen('besgen', ['A', 'B', 'C', 'D', 'E'], 5, { rol: 'nane', opaklik: 0.4 }),
    // D'nin iki komsusunu birlestiren kosegen: D bu dogrunun hangi
    // tarafinda kaliyor, bukeyligi belirleyen sey tam olarak bu.
    cizgi('kosegen', 'dogru_parcasi', 'C', 'E', 6, { rol: 'gok', kalinlik: 3, cizgiTipi: 'kesik' }),
    aci('aciD', 'E', 'D', 'C', 7, { rol: 'tereyagi' }),
    olcumKaynakli('alan', 'olcum_alan', 'besgen', 8, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'Dışbükey hâl', 'Başlangıçta D, mavi köşegenin dışında. Beşgenin bütün iç açıları 180 dereceden küçük.', ['besgen', 'aciD']),
    adim(2, 'Köşegen ne söylüyor', 'Mavi kesikli çizgi, D’nin iki komşusunu birleştiriyor. D bu çizginin dış tarafında olduğu sürece çokgen dışbükeydir.', ['kosegen']),
    adim(3, 'İçeri itin', 'D’yi köşegenin öbür tarafına, şeklin içine doğru taşıyın. Açı ölçümü 180’i geçiyor: bu bir girinti, yani içbükeylik.', ['D', 'aciD']),
    adim(4, 'Tanım', 'Dışbükey çokgende hiçbir iç açı 180 dereceyi geçmez ve her köşegen tamamen şeklin içinde kalır. Bir tek açı bile 180’i geçerse çokgen içbükeydir.', ['aciD', 'kosegen']),
  ],
}

const besgenKose = duzgunKoseler('P', 'Obes', 'P0', 5, 12, { rol: 'gok', etiketli: false })
const altigenKose = duzgunKoseler('H', 'Oalti', 'H0', 6, 2, { rol: 'nane', etiketli: false })

const DUZGUN_COKGEN = {
  slug: 'duzgun-cokgende-ic-aci',
  konuSlug: 's11-disbukey-cokgenlerin-ozellikleri',
  tur: 'kesif',
  baslik: 'İç açılar toplamı: çokgeni üçgenlere bölmek',
  ozet:
    'Bir köşeden bütün köşegenleri çizin: altıgen dört üçgene ayrılıyor. Demek ki iç açılar toplamı 4 × 180 = 720 derece.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-12, 8, 13, -8]),
  nesneler: [
    nokta('Oalti', -5, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('H0', -1, 0, 1, { rol: 'nane', etiket: 'H0 (sürükleyin)' }),
    ...altigenKose.nesneler,
    cokgen('altigen', altigenKose.adlar, 8, { rol: 'nane', opaklik: 0.35, etiket: 'altıgen' }),
    cizgi('k1', 'dogru_parcasi', 'H0', 'H2', 9, { rol: 'gul', kalinlik: 2 }),
    cizgi('k2', 'dogru_parcasi', 'H0', 'H3', 10, { rol: 'gul', kalinlik: 2 }),
    cizgi('k3', 'dogru_parcasi', 'H0', 'H4', 11, { rol: 'gul', kalinlik: 2 }),
    nokta('Obes', 6, 0, 12, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('P0', 10, 0, 13, { rol: 'gok', etiket: 'P0' }),
    ...besgenKose.nesneler,
    cokgen('besgen', besgenKose.adlar, 18, { rol: 'gok', opaklik: 0.35, etiket: 'beşgen' }),
    aci('altiIcAci', 'H2', 'H1', 'H0', 19, { rol: 'tereyagi' }),
    aci('besIcAci', 'P2', 'P1', 'P0', 20, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(1, 'Bir köşeden köşegenler', 'Altıgende H0 köşesinden çizilebilen bütün köşegenler çizildi: üç tane. Şekil dört üçgene ayrıldı.', ['k1', 'k2', 'k3']),
    adim(2, 'Her üçgen 180 derece', 'Dört üçgenin açıları toplandığında altıgenin bütün iç açıları elde edilir: 4 × 180 = 720 derece.', ['altigen']),
    adim(3, 'Genel kural', 'n kenarlı çokgen n − 2 üçgene ayrılır; iç açılar toplamı (n − 2) × 180 derecedir. Beşgende 3 × 180 = 540.', ['besgen']),
    adim(4, 'Düzgünse eşit paylaşılır', 'Düzgün çokgende bütün iç açılar eşittir. Altıgende 720 ÷ 6 = 120, beşgende 540 ÷ 5 = 108 derece. Ekrandaki ölçümler bunu doğruluyor.', ['altiIcAci', 'besIcAci']),
  ],
}

const ucgenKose = duzgunKoseler('U', 'Oucgen', 'U0', 3, 2, { rol: 'seftali', etiketli: false })
const kareKose = duzgunKoseler('K', 'Okare', 'K0', 4, 6, { rol: 'gok', etiketli: false })
const bes2Kose = duzgunKoseler('B', 'Obes2', 'B0', 5, 11, { rol: 'gul', etiketli: false })
const alti2Kose = duzgunKoseler('A', 'Oalti2', 'A0', 6, 17, { rol: 'tereyagi', etiketli: false })

const DOSEME = {
  slug: 'karo-doseme-ic-aci',
  konuSlug: 's11-cokgen-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Hangi karo boşluksuz döşenir?',
  ozet:
    'Bir köşede buluşan karoların açıları tam 360 dereceyi doldurmalı. Dört düzgün çokgenin iç açısını ölçün ve 360’ı tam bölüp bölmediğine bakın.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-12, 6, 15, -8]),
  nesneler: [
    nokta('Oucgen', -9, -1, 0, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('U0', -6.5, -1, 1, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    ...ucgenKose.nesneler,
    cokgen('ucgen', ucgenKose.adlar, 4, { rol: 'seftali', opaklik: 0.45, etiket: 'üçgen' }),
    nokta('Okare', -2, -1, 5, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('K0', 0.5, -1, 6, { surukleme: 'yok', rol: 'gok', etiket: null }),
    ...kareKose.nesneler,
    cokgen('kare', kareKose.adlar, 9, { rol: 'gok', opaklik: 0.45, etiket: 'kare' }),
    nokta('Obes2', 5, -1, 10, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('B0', 7.5, -1, 11, { surukleme: 'yok', rol: 'gul', etiket: null }),
    ...bes2Kose.nesneler,
    cokgen('besgen', bes2Kose.adlar, 15, { rol: 'gul', opaklik: 0.45, etiket: 'beşgen' }),
    nokta('Oalti2', 11, -1, 16, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('A0', 13.5, -1, 17, { surukleme: 'yok', rol: 'tereyagi', etiket: null }),
    ...alti2Kose.nesneler,
    cokgen('altigen', alti2Kose.adlar, 22, { rol: 'tereyagi', opaklik: 0.45, etiket: 'altıgen' }),
    aci('aciUcgen', 'U2', 'U1', 'U0', 23, { rol: 'seftali' }),
    aci('aciKare', 'K2', 'K1', 'K0', 24, { rol: 'gok' }),
    aci('aciBesgen', 'B2', 'B1', 'B0', 25, { rol: 'gul' }),
    aci('aciAltigen', 'A2', 'A1', 'A0', 26, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(1, 'Dört düzgün çokgen', 'Üçgen, kare, beşgen ve altıgen. Hepsi düzgün: kenarları ve açıları kendi içinde eşit.', ['ucgen', 'kare', 'besgen', 'altigen']),
    adim(2, 'İç açıları okuyun', 'Sırasıyla 60, 90, 108 ve 120 derece. Bunlar ölçülmüş değerler, ezber değil.', ['aciUcgen', 'aciKare', 'aciBesgen', 'aciAltigen']),
    adim(3, '360’ı bölüyor mu?', '360 ÷ 60 = 6, 360 ÷ 90 = 4, 360 ÷ 120 = 3. Üçü de tam sayı: bu karolar bir köşede boşluksuz buluşabilir.', ['aciUcgen', 'aciKare', 'aciAltigen']),
    adim(4, 'Beşgen neden olmaz?', '360 ÷ 108 ≈ 3,33. Üç beşgen 324 derece yapar, 36 derece boşluk kalır; dördüncüsü ise sığmaz. Bu yüzden hiçbir yerde düzgün beşgen fayans göremezsiniz.', ['aciBesgen']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's11-dortgenlerin-ozellikleri',
    sahneSlug: 'paralelkenar-kosegenleri',
    baslik: 'Katlanır masa ve makas mekanizması',
    hikaye:
      'Katlanır masaların, vinç makaslarının ve akordeon kapıların iskeleti paralelkenardır. Kollar birbirine köşegenlerin kesiştiği noktadan bağlanır; o nokta her iki kolu da tam ortadan böldüğü için mekanizma her açıda dengede kalır. Şekil açılıp kapanırken kenar uzunlukları değişmez, sadece açılar değişir — bu yüzden paralelkenar üçgenin aksine "hareketli" bir şekildir.',
    soru: 'Bir paralelkenarın köşegenlerinden biri 18 birim. Kesişim noktası bu köşegeni hangi uzunluklara böler?',
    olcekAciklama: 'Izgaradaki 1 birim 10 santimetredir.',
    kaynak: 'MEB kazanımı MAT.11.3.1 — dörtgenlerin özellikleri',
    yasAraligi: '16-18',
  },
  {
    konuSlug: 's11-cokgen-problemleri',
    sahneSlug: 'karo-doseme-ic-aci',
    baslik: 'Arı peteği neden altıgen',
    hikaye:
      'Arılar peteklerini altıgen örer. Üçgen, kare ve altıgen boşluksuz döşenebilen tek düzgün çokgenlerdir; bunların içinde aynı alanı en az mum harcayarak çevreleyen altıgendir. Selçuklu ve Osmanlı çini desenlerinde de aynı üç şekil tekrar tekrar karşımıza çıkar — desenci de arı da aynı geometrik kısıta uyuyor.',
    soru: 'Bir köşede yalnız düzgün altıgen kullanılırsa kaç tane altıgen buluşur?',
    olcekAciklama: 'Izgaradaki 1 birim, petekte yaklaşık 2 milimetredir.',
    kaynak: 'MEB kazanımı MAT.11.3.4 — çokgen problemleri',
    yasAraligi: '16-18',
  },
]

const SORULAR = [
  {
    konuSlug: 's11-dortgenlerin-ozellikleri',
    sahneSlug: 'paralelkenar-kosegenleri',
    tip: 'sayisal',
    govde:
      'Bir paralelkenarın köşegenlerinden biri 18 birim. Köşegenlerin kesişim noktası bu köşegeni kaç birimlik iki parçaya böler?',
    cevap: { tip: 'sayisal', deger: 9, tolerans: 0, birim: 'birim' },
    ipucu: 'Köşegenler birbirini ortalar.',
    cozum: 'Ortalama demek eşit iki parça demek: 18 ÷ 2 = 9 birim.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's11-dortgenlerin-ozellikleri',
    tip: 'coktan_secmeli',
    govde: 'Aşağıdakilerden hangisi her paralelkenarda doğrudur?',
    secenekler: [
      'Köşegenler eşit uzunluktadır',
      'Köşegenler birbirini ortalar',
      'Köşegenler birbirine diktir',
      'Bütün açılar 90 derecedir',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Diğer üçü özel paralelkenarlarda geçerli.',
    cozum:
      'Köşegenlerin birbirini ortalaması her paralelkenarda geçerlidir. Köşegenlerin eşit olması dikdörtgenin, dik kesişmesi eşkenar dörtgenin özelliğidir.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's11-dortgenlerin-ozellikleri',
    sahneSlug: 'yamuk-orta-taban',
    tip: 'sayisal',
    govde: 'Tabanları 14 ve 8 birim olan bir yamuğun orta tabanı kaç birimdir?',
    cevap: { tip: 'sayisal', deger: 11, tolerans: 0, birim: 'birim' },
    ipucu: 'Orta taban iki tabanın ortalamasıdır.',
    cozum: '(14 + 8) ÷ 2 = 11 birim.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's11-dortgenlerin-ozellikleri',
    tip: 'sayisal',
    govde:
      'Tabanları 14 ve 8 birim, yüksekliği 6 birim olan yamuğun alanı kaç birim karedir?',
    cevap: { tip: 'sayisal', deger: 66, tolerans: 0, birim: 'birim kare' },
    ipucu: 'Alan = orta taban × yükseklik.',
    cozum: 'Orta taban 11 birim. Alan 11 × 6 = 66 birim karedir.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's11-icbukey-ve-disbukey-cokgenler',
    sahneSlug: 'icbukey-disbukey-cokgen',
    tip: 'dogru_yanlis',
    govde: 'Bir çokgenin içbükey olması için en az bir iç açısının 180 dereceden büyük olması gerekir.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Sahnede D’yi içeri ittiğinizde ölçüm ne oluyor?',
    cozum:
      'İçbükeylik tam olarak budur: bir girinti oluşması, yani bir iç açının 180 dereceyi geçmesi. Bütün iç açılar 180’den küçükse çokgen dışbükeydir.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's11-icbukey-ve-disbukey-cokgenler',
    tip: 'coktan_secmeli',
    govde: 'Dışbükey bir çokgende köşegenler için hangisi doğrudur?',
    secenekler: [
      'Hepsi çokgenin içinde kalır',
      'En az biri dışarı çıkar',
      'Hiçbiri kenarları kesmez ama dışarı çıkabilir',
      'Köşegen sayısı kenar sayısına eşittir',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 0 },
    ipucu: 'Sahnedeki mavi kesikli çizgiyi izleyin.',
    cozum:
      'Dışbükey çokgende iki köşeyi birleştiren her doğru parçası tamamen şeklin içindedir. İçbükeyde ise en az bir köşegen dışarı taşar.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's11-disbukey-cokgenlerin-ozellikleri',
    sahneSlug: 'duzgun-cokgende-ic-aci',
    tip: 'sayisal',
    govde: 'Sekizgenin iç açılarının toplamı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 1080, tolerans: 0, birim: 'derece' },
    ipucu: '(n − 2) × 180.',
    cozum: '(8 − 2) × 180 = 6 × 180 = 1080 derece.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's11-disbukey-cokgenlerin-ozellikleri',
    tip: 'sayisal',
    govde: 'Düzgün bir onikigenin (12 kenarlı) bir iç açısı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 150, tolerans: 0, birim: 'derece' },
    ipucu: 'Önce toplamı bulun, sonra kenar sayısına bölün.',
    cozum: 'Toplam (12 − 2) × 180 = 1800. Bir açı 1800 ÷ 12 = 150 derecedir.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's11-disbukey-cokgenlerin-ozellikleri',
    tip: 'sayisal',
    govde: 'Bir dışbükey çokgenin dış açılarının toplamı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 360, tolerans: 0, birim: 'derece' },
    ipucu: 'Kenar sayısından bağımsızdır.',
    cozum:
      'Her köşede iç ve dış açı 180 eder; n köşe için 180n. İç açılar toplamı (n − 2) × 180 olduğuna göre dış açılar toplamı 180n − 180n + 360 = 360 derecedir. Kenar sayısı değişse de sonuç değişmez.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's11-cokgen-problemleri',
    sahneSlug: 'karo-doseme-ic-aci',
    tip: 'sayisal',
    govde: 'Bir köşede yalnız düzgün altıgen kullanılırsa kaç altıgen buluşur?',
    cevap: { tip: 'sayisal', deger: 3, tolerans: 0 },
    ipucu: 'Altıgenin iç açısı 120 derece; köşede 360 dolmalı.',
    cozum: '360 ÷ 120 = 3 altıgen.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's11-cokgen-problemleri',
    tip: 'acik_uclu',
    govde:
      'Düzgün beşgenlerle bir yüzey neden boşluksuz döşenemez? Sahnedeki ölçümü kullanarak açıklayın.',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Düzgün beşgenin iç açısı 108 derece. Bir köşede toplam 360 derece olması gerekiyor ama 360 ÷ 108 = 3,33 çıkıyor. Üç beşgen 324 derece yapıyor, 36 derecelik boşluk kalıyor; dördüncüsü ise sığmıyor.',
      anahtarlar: ['108', '360', 'tam bölmüyor', 'boşluk'],
    },
    ipucu: '360’ı iç açıya bölün ve sonucun tam sayı olup olmadığına bakın.',
    cozum:
      'Bir düzgün çokgenle döşeme yapılabilmesi için 360’ın iç açıya tam bölünmesi gerekir. Bu yalnız 60 (üçgen), 90 (kare) ve 120 (altıgen) için olur. 108 tam bölmediği için beşgen tek başına döşenemez.',
    zorluk: 5,
    puan: 4,
  },
]

console.log('11. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [PARALELKENAR, YAMUK, BUKEYLIK, DUZGUN_COKGEN, DOSEME],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n11. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 11)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
