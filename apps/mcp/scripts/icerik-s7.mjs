/**
 * 7. sinif geometri dilimi - on bir konu.
 *
 * Calistir: npm run icerik-s7 -w @matgebra/mcp
 */
import {
  aci,
  adim,
  ayar,
  baglan,
  bilesen,
  cember,
  cizgi,
  cokgen,
  karsi,
  kesisim,
  nokta,
  olcumKaynakli,
  oteleme,
  paralelDik,
  uret,
  uzunluk,
  yayDilim,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-s7')

/** Bir nesnenin bir dogruya gore ayna goruntusu. */
const yansima = (ad, kaynak, eksen, sira, o = {}) => ({
  ad,
  tip: 'yansima',
  etiket: o.etiket ?? null,
  sira,
  katman: 1,
  gorunur: true,
  kilitli: true,
  surukleme: 'yok',
  stil: { rol: o.rol ?? 'gul', opaklik: o.opaklik ?? 0.4 },
  parametreler: [],
  bagimliliklar: [
    { kaynak, rol: 'kaynak', sira: 0 },
    { kaynak: eksen, rol: 'eksen', sira: 1 },
  ],
})

/* --------------------------------------------------------------- sahneler */

// 1) Yansima donusumu
const GOL = {
  slug: 'gol-yuzeyinde-yansima',
  konuSlug: 's7-yansima-donusumu',
  tur: 'gercek_hayat',
  baslik: 'Göl yüzeyinde yansıma',
  ozet:
    'Durgun su bir ayna gibi davranır: kıyıdaki her nokta, su çizgisine göre karşı tarafta aynı uzaklıkta görünür. Şekli sürükleyip görüntünün nasıl davrandığını izleyin.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 8, 10, -8]),
  nesneler: [
    nokta('E1', -9, 0, 0, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('E2', 9, 0, 1, { surukleme: 'yok', rol: 'gok', etiket: null }),
    cizgi('suCizgisi', 'dogru', 'E1', 'E2', 2, { rol: 'gok', kalinlik: 3 }),
    nokta('A', -4, 2, 3, { rol: 'nane' }),
    nokta('B', 0, 6, 4, { rol: 'nane', etiket: 'tepe' }),
    nokta('C', 4, 2, 5, { rol: 'nane' }),
    cokgen('dag', ['A', 'B', 'C'], 6, { rol: 'nane', opaklik: 0.5, etiket: 'dağ' }),
    yansima('goruntu', 'dag', 'suCizgisi', 7, { rol: 'gul', opaklik: 0.35 }),
    yansima('Byansi', 'B', 'suCizgisi', 8, { rol: 'gul', etiket: "B'" }),
    cizgi('baglanti', 'dogru_parcasi', 'B', 'Byansi', 9, {
      rol: 'notr',
      cizgiTipi: 'kesik',
      kalinlik: 1.5,
    }),
    kesisim('H', 'suCizgisi', 'baglanti', 10, { rol: 'notr', etiket: null }),
    uzunluk('ust', 'B', 'H', 11, { rol: 'nane', etiket: 'yükseklik' }),
    uzunluk('altUz', 'H', 'Byansi', 12, { rol: 'gul', etiket: 'derinlik' }),
  ],
  adimlar: [
    adim(
      1,
      'Su çizgisi bir aynadır',
      'Mavi doğru gölün yüzeyi. Yeşil dağ kıyıda, pembe olan ise sudaki görüntüsü.',
      ['suCizgisi', 'dag', 'goruntu'],
    ),
    adim(
      2,
      'Uzaklıklar eşittir',
      'Tepe noktası ile görüntüsünü birleştiren kesikli çizgi su çizgisine diktir ve iki parçası eşit uzunluktadır.',
      ['baglanti', 'ust', 'altUz'],
    ),
    adim(
      3,
      'Şekil korunur, yön değişir',
      'Dağı sürükleyin. Görüntü aynı büyüklükte kalıyor ama ters dönüyor — yansımada uzunluklar ve açılar korunur, yönelim değişir.',
      ['dag', 'goruntu'],
    ),
  ],
}

// 2) Orta dikme ve aciortay
const KUYU = {
  slug: 'iki-koy-kuyu-orta-dikme',
  konuSlug: 's7-orta-dikme-ve-aciortay-insasi',
  tur: 'gercek_hayat',
  baslik: 'İki köye eşit uzaklıkta kuyu',
  ozet:
    'İki köy bir kuyuyu paylaşacak. Kuyu ikisine de aynı uzaklıkta olmalı. Böyle noktaların hepsi tek bir doğru üzerindedir: orta dikme.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 8, 10, -8]),
  nesneler: [
    nokta('A', -5, -2, 0, { rol: 'gok', etiket: '1. köy' }),
    nokta('B', 4, 1, 1, { rol: 'gok', etiket: '2. köy' }),
    cizgi('yol', 'dogru_parcasi', 'A', 'B', 2, { rol: 'notr', cizgiTipi: 'kesik' }),
    {
      ad: 'M',
      tip: 'orta_nokta',
      etiket: 'orta',
      sira: 3,
      katman: 2,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'notr' },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'uc1', sira: 0 },
        { kaynak: 'B', rol: 'uc2', sira: 1 },
      ],
    },
    cizgi('tasiyici', 'dogru', 'A', 'B', 4, { rol: 'notr', kalinlik: 1 }),
    paralelDik('ortaDikme', 'dikme', 'tasiyici', 'M', 5, { rol: 'seftali', kalinlik: 3 }),
    nokta('K', -1.5, 5, 6, { rol: 'nane', etiket: 'kuyu' }),
    cizgi('kA', 'dogru_parcasi', 'K', 'A', 7, { rol: 'gok', cizgiTipi: 'noktali' }),
    cizgi('kB', 'dogru_parcasi', 'K', 'B', 8, { rol: 'gok', cizgiTipi: 'noktali' }),
    uzunluk('dA', 'K', 'A', 9, { rol: 'gok', etiket: '1. köye' }),
    uzunluk('dB', 'K', 'B', 10, { rol: 'seftali', etiket: '2. köye' }),
  ],
  adimlar: [
    adim(
      1,
      'İki köy, bir kuyu',
      'Kuyu iki köye de aynı uzaklıkta olmalı. İki ölçümü karşılaştırın.',
      ['dA', 'dB'],
    ),
    adim(
      2,
      'Kuyuyu turuncu doğrunun üzerine taşıyın',
      'Turuncu doğru, köyleri birleştiren parçanın orta dikmesidir: orta noktasından geçer ve ona diktir. Kuyuyu bu doğrunun üzerine getirin.',
      ['ortaDikme', 'M'],
    ),
    adim(
      3,
      'Orta dikme eşit uzaklık demektir',
      'Kuyu orta dikme üzerindeyken iki uzaklık eşit çıkıyor. Kuyuyu doğru boyunca kaydırın — eşitlik bozulmuyor.',
      ['K', 'dA', 'dB'],
    ),
  ],
}

// 3) Es kuplerle yapilar ve gorunumler
const GORUNUM = {
  slug: 'kup-yapisi-uc-gorunum',
  konuSlug: 's7-es-kuplerle-yapilar-ve-gorunumler',
  tur: 'kesif',
  baslik: 'Bir yapının üç görünümü',
  ozet:
    'Eş küplerden kurulan bir yapının önden, yandan ve üstten görünümleri farklıdır ama hepsi aynı üç ölçüden çıkar. Ölçüleri değiştirip üç görünümün birlikte nasıl değiştiğini izleyin.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 13, 19, -1], { birim: 'küp' }),
  nesneler: [
    // Iki tutamak: P en ile yuksekligi, Q boyu belirler.
    // en = P.x - 1, yukseklik = P.y - 1, boy = Q.y - 1
    nokta('P', 5, 4, 0, { rol: 'seftali', etiket: 'en / yükseklik' }),
    nokta('Q', 16, 3, 1, { rol: 'gok', etiket: 'boy' }),

    // Onden gorunum: en x yukseklik, sol ust kosede.
    nokta('O1', 1, 7, 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
    oteleme('O2', 'P', 0, 6, 3, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('O3', 'O2', 'O1', 4, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('O4', 'O1', 'O2', 5, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('onden', ['O1', 'O3', 'O2', 'O4'], 6, { rol: 'gok', opaklik: 0.4, etiket: 'önden' }),

    // Yandan gorunum: boy x yukseklik. Boy, Q'nun DIKEY konumundan
    // okunup yatay olcuye cevriliyor - bilesen noktasinin eksen takasi.
    nokta('Y1', 7, 7, 7, { surukleme: 'yok', rol: 'notr', etiket: null }),
    bilesen('Y2', 'Q', 'P', 8, {
      rol: 'notr',
      etiket: null,
      gorunur: false,
      apsisEksen: 'y',
      dx: 6,
      dy: 6,
    }),
    bilesen('Y3', 'Y2', 'Y1', 9, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('Y4', 'Y1', 'Y2', 10, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('yandan', ['Y1', 'Y3', 'Y2', 'Y4'], 11, {
      rol: 'seftali',
      opaklik: 0.4,
      etiket: 'yandan',
    }),

    // Ustten gorunum: en x boy.
    nokta('U1', 1, 1, 12, { surukleme: 'yok', rol: 'notr', etiket: null }),
    bilesen('U2', 'P', 'Q', 13, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('U3', 'U2', 'U1', 14, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('U4', 'U1', 'U2', 15, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('ustten', ['U1', 'U3', 'U2', 'U4'], 16, {
      rol: 'nane',
      opaklik: 0.4,
      etiket: 'üstten',
    }),

    olcumKaynakli('ondenAlan', 'olcum_alan', 'onden', 17, { rol: 'gok' }),
    olcumKaynakli('yandanAlan', 'olcum_alan', 'yandan', 18, { rol: 'seftali' }),
    olcumKaynakli('usttenAlan', 'olcum_alan', 'ustten', 19, { rol: 'nane' }),
  ],
  adimlar: [
    adim(
      1,
      'Üç ölçü, üç görünüm',
      'Bir dikdörtgenler prizmasının en, boy ve yüksekliği vardır. Her görünüm bu üç ölçüden ikisini gösterir.',
      ['onden', 'yandan', 'ustten'],
    ),
    adim(
      2,
      'Ölçüleri değiştirin',
      'Turuncu noktayı sürükleyin: en ve yükseklik değişiyor. Sağdaki mavi noktayı yukarı aşağı oynatın: boy değişiyor. Üç görünüm birlikte güncelleniyor.',
      ['P', 'Q'],
    ),
    adim(
      3,
      'Hangi görünüm hangi ölçüyü gösterir?',
      'Önden görünüm en × yükseklik, yandan görünüm boy × yükseklik, üstten görünüm en × boy kadar küp içerir. Alan ölçümlerini karşılaştırın.',
      ['ondenAlan', 'yandanAlan', 'usttenAlan'],
    ),
  ],
}

// 4) Prizmanin yuzey alani - acinim
const ACINIM = {
  slug: 'kutu-acinimi-yuzey-alani',
  konuSlug: 's7-dikdortgenler-prizmasinin-yuzey-alani',
  tur: 'gercek_hayat',
  baslik: 'Kutuyu açınca: yüzey alanı',
  ozet:
    'Bir karton kutuyu keserek düzleştirdiğinizde altı dikdörtgen çıkar. Kutunun yüzey alanı, bu altı parçanın alanları toplamıdır — yani kesilen kartonun alanı.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-2, 12, 18, -6], { birim: 'cm' }),
  nesneler: [
    nokta('T', 4, 3, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('P', 9, 7, 1, { rol: 'seftali', etiket: 'en / yükseklik' }),
    // Orta yuz: T ile P arasi (en x yukseklik)
    bilesen('P2', 'P', 'T', 2, { rol: 'notr', etiket: null }),
    bilesen('P4', 'T', 'P', 3, { rol: 'notr', etiket: null }),
    cokgen('on', ['T', 'P2', 'P', 'P4'], 4, { rol: 'gok', opaklik: 0.45, etiket: 'ön' }),
    // Arka yuz: on yuzun sagina, ayni olculerde
    oteleme('A1', 'P2', 0, 0, 5, { rol: 'notr', etiket: null, gorunur: false }),
    oteleme('A2', 'P2', 5, 0, 6, { rol: 'notr', etiket: null, gorunur: false }),
    oteleme('A3', 'P', 5, 0, 7, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('yan1', ['P2', 'A2', 'A3', 'P'], 8, { rol: 'seftali', opaklik: 0.45, etiket: 'yan' }),
    // Sol yan
    oteleme('S2', 'T', -5, 0, 9, { rol: 'notr', etiket: null, gorunur: false }),
    oteleme('S3', 'P4', -5, 0, 10, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('yan2', ['S2', 'T', 'P4', 'S3'], 11, {
      rol: 'seftali',
      opaklik: 0.45,
      etiket: 'yan',
    }),
    // Ust
    oteleme('U3', 'P4', 0, 5, 12, { rol: 'notr', etiket: null, gorunur: false }),
    oteleme('U4', 'P', 0, 5, 13, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('ust', ['P4', 'P', 'U4', 'U3'], 14, { rol: 'nane', opaklik: 0.45, etiket: 'üst' }),
    // Alt
    oteleme('L3', 'T', 0, -5, 15, { rol: 'notr', etiket: null, gorunur: false }),
    oteleme('L4', 'P2', 0, -5, 16, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('alt', ['L3', 'L4', 'P2', 'T'], 17, { rol: 'nane', opaklik: 0.45, etiket: 'alt' }),
    uzunluk('en', 'T', 'P2', 18, { rol: 'gok', etiket: 'en' }),
    uzunluk('yuk', 'P2', 'P', 19, { rol: 'seftali', etiket: 'yükseklik' }),
    olcumKaynakli('onAlan', 'olcum_alan', 'on', 20, { rol: 'gok' }),
  ],
  adimlar: [
    adim(
      1,
      'Kutuyu düzleştirin',
      'Bu şekil bir kutunun açınımı: ortadaki ön yüz, iki yan, bir üst ve bir alt. Altıncı yüz (arka) yanlardan birinin devamıdır.',
      ['on', 'yan1', 'yan2', 'ust', 'alt'],
    ),
    adim(
      2,
      'Karşılıklı yüzler eşittir',
      'Ön ile arka, iki yan, alt ile üst — üç çift eş dikdörtgen. Bu yüzden yüzey alanı üç farklı alanın iki katıdır.',
      ['on', 'yan1', 'ust'],
    ),
    adim(
      3,
      'Ölçüleri değiştirin',
      'Turuncu noktayı sürükleyin: en ve yükseklik değişince bütün açınım büyür. Ön yüzün alanını izleyin, kalanları aynı mantıkla hesaplayın.',
      ['P', 'onAlan', 'en', 'yuk'],
    ),
  ],
}

// 5) Prizmanin hacmi
const HACIM = {
  slug: 'birim-kuplerle-hacim',
  konuSlug: 's7-dikdortgenler-prizmasinin-hacmi',
  tur: 'kesif',
  baslik: 'Birim küplerle hacim',
  ozet:
    'Bir kutuyu birim küplerle doldurmak, tabana kaç küp sığdığını bulup kat sayısıyla çarpmaktır. Taban alanı ile yüksekliği ayrı ayrı değiştirip hacmin nasıl büyüdüğünü izleyin.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 10, 15, -1], { birim: 'birim' }),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 6, 4, 1, { rol: 'seftali', etiket: 'taban köşesi' }),
    bilesen('B', 'C', 'A', 2, { rol: 'notr', etiket: null }),
    bilesen('D', 'A', 'C', 3, { rol: 'notr', etiket: null }),
    cokgen('taban', ['A', 'B', 'C', 'D'], 4, { rol: 'nane', opaklik: 0.45, etiket: 'taban' }),
    olcumKaynakli('tabanAlan', 'olcum_alan', 'taban', 5, { rol: 'tereyagi' }),
    // Yukseklik ayri bir dogru parcasiyla gosterilir.
    nokta('H1', 10, 1, 6, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('H2', 10, 6, 7, { rol: 'gok', etiket: 'yükseklik' }),
    cizgi('yukseklikCizgi', 'dogru_parcasi', 'H1', 'H2', 8, { rol: 'gok', kalinlik: 4 }),
    uzunluk('yuk', 'H1', 'H2', 9, { rol: 'gok', etiket: 'kat sayısı' }),
    uzunluk('en', 'A', 'B', 10, { rol: 'seftali', etiket: 'en' }),
    uzunluk('boy', 'B', 'C', 11, { rol: 'notr', etiket: 'boy' }),
  ],
  adimlar: [
    adim(
      1,
      'Önce tabana kaç küp sığar?',
      'Yeşil dikdörtgen kutunun tabanı. Alanı, bir kata sığan birim küp sayısını verir.',
      ['taban', 'tabanAlan'],
    ),
    adim(
      2,
      'Sonra kaç kat?',
      'Mavi çizgi yüksekliği gösteriyor; yani kaç kat küp üst üste dizileceğini. Ucunu sürükleyip değiştirin.',
      ['yukseklikCizgi', 'yuk'],
    ),
    adim(
      3,
      'Hacim = taban alanı × yükseklik',
      'Taban alanını kat sayısıyla çarpın. Taban 15, yükseklik 5 ise hacim 75 birim küptür. En veya boyu iki katına çıkarırsanız hacim de iki katına çıkar.',
      ['tabanAlan', 'yuk'],
    ),
  ],
}

// 6) Prizma problemleri: akvaryum
const AKVARYUM = {
  slug: 'akvaryum-su-hacmi',
  konuSlug: 's7-prizma-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Akvaryuma kaç litre su girer?',
  ozet:
    'Akvaryum bir dikdörtgenler prizmasıdır. Su seviyesini değiştirin: hacim taban alanıyla su yüksekliğinin çarpımı kadar.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 10, 13, -1], { birim: 'dm' }),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 9, 1, 1, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 9, 8, 2, { surukleme: 'yok', rol: 'notr' }),
    nokta('D', 1, 8, 3, { surukleme: 'yok', rol: 'notr' }),
    cokgen('cam', ['A', 'B', 'C', 'D'], 4, { rol: 'notr', opaklik: 0.12, etiket: 'akvaryum' }),
    nokta('S', 9, 5, 5, { rol: 'gok', etiket: 'su seviyesi' }),
    bilesen('S2', 'A', 'S', 6, { rol: 'notr', etiket: null }),
    cokgen('su', ['A', 'B', 'S', 'S2'], 7, { rol: 'gok', opaklik: 0.45, etiket: 'su' }),
    olcumKaynakli('kesitAlan', 'olcum_alan', 'su', 8, { rol: 'tereyagi' }),
    uzunluk('genislik', 'A', 'B', 9, { rol: 'notr', etiket: 'genişlik' }),
    uzunluk('derinlik', 'A', 'S2', 10, { rol: 'gok', etiket: 'su yüksekliği' }),
  ],
  adimlar: [
    adim(
      1,
      'Akvaryumun ön kesiti',
      'Gri dikdörtgen akvaryumun ön yüzü. Mavi bölge içindeki su.',
      ['cam', 'su'],
    ),
    adim(
      2,
      'Su seviyesini değiştirin',
      'Mavi noktayı yukarı aşağı sürükleyin. Kesit alanı su yüksekliğiyle orantılı olarak değişiyor.',
      ['S', 'kesitAlan'],
    ),
    adim(
      3,
      'Üçüncü boyut: derinlik',
      'Bu kesit akvaryumun derinliği boyunca uzanır. Kesit alanını derinlikle çarpın: 1 desimetreküp = 1 litredir, yani hacim doğrudan litre verir.',
      ['kesitAlan'],
    ),
  ],
}

// 7) Dairenin alani
const DAIRE_ALAN = {
  slug: 'dairenin-alani-yaricap',
  konuSlug: 's7-dairenin-alani',
  tur: 'kesif',
  baslik: 'Dairenin alanı yarıçapa nasıl bağlı?',
  ozet:
    'Yarıçapı değiştirin: çevre yarıçapla orantılı büyür ama alan çok daha hızlı büyür. Yarıçap iki katına çıkınca alan dört katına çıkar.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -8]),
  nesneler: [
    nokta('M', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'merkez' }),
    nokta('R', 4, 0, 1, { rol: 'seftali', etiket: 'yarıçap ucu' }),
    cember('daire', 'M', 2, { uzerinde: 'R', rol: 'gok', kalinlik: 3 }),
    cizgi('yaricapCizgi', 'dogru_parcasi', 'M', 'R', 3, { rol: 'seftali', kalinlik: 2 }),
    uzunluk('yaricap', 'M', 'R', 4, { rol: 'seftali', etiket: 'yarıçap' }),
    olcumKaynakli('cevre', 'olcum_cevre', 'daire', 5, { rol: 'lavanta' }),
    // Kareyle karsilastirma: kenari yaricap kadar olan kare.
    bilesen('K2', 'R', 'M', 6, { rol: 'notr', etiket: null, gorunur: false }),
    oteleme('K3', 'R', 0, 0, 7, { rol: 'notr', etiket: null, gorunur: false }),
    adimKare(),
  ],
  adimlar: [
    adim(
      1,
      'Yarıçap her şeyi belirler',
      'Dairenin tek serbest ölçüsü yarıçaptır. Turuncu noktayı sürükleyin.',
      ['R', 'yaricap'],
    ),
    adim(
      2,
      'Çevre yarıçapla orantılı',
      'Yarıçap iki katına çıkarsa çevre de iki katına çıkar. Çevre = 2 × π × yarıçap.',
      ['cevre', 'yaricap'],
    ),
    adim(
      3,
      'Alan yarıçapın karesiyle büyür',
      'Yarıçapı 2’den 4’e çıkarın: çevre iki katına çıkarken alan dört katına çıkar. Alan = π × yarıçap × yarıçap.',
      ['yaricap'],
    ),
  ],
}

// Daire alani sahnesinde kare karsilastirmasi kullanilmadi; sade tutuluyor.
function adimKare() {
  return {
    ad: 'yaricapKaresi',
    tip: 'metin',
    etiket: 'r × r kare, dairenin yaklaşık üçte biri kadar',
    sira: 8,
    katman: 3,
    gorunur: false,
    kilitli: true,
    surukleme: 'yok',
    stil: { rol: 'notr' },
    parametreler: [
      { anahtar: 'x', deger: -8, tur: 'sayi' },
      { anahtar: 'y', deger: -7, tur: 'sayi' },
    ],
    bagimliliklar: [],
  }
}

// 8) Daire diliminin alani
const DILIM = {
  slug: 'daire-dilimi-alan',
  konuSlug: 's7-daire-diliminin-alani',
  tur: 'kesif',
  baslik: 'Daire diliminin alanı',
  ozet:
    'Dilim, dairenin merkez açıyla orantılı bir parçasıdır. Açıyı değiştirip dilim alanının tam dairenin ne kadarı olduğunu izleyin.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-8, 8, 8, -8], { yapisma: 'yok' }),
  nesneler: [
    nokta('M', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'merkez' }),
    nokta('A', 6, 0, 1, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('B', 0, 6, 2, { rol: 'seftali', etiket: 'kesim' }),
    cember('tamDaire', 'M', 3, { uzerinde: 'A', rol: 'notr', kalinlik: 2 }),
    yayDilim('dilim', 'daire_dilimi', 'M', 'A', 'B', 4, { rol: 'gul', opaklik: 0.5 }),
    aci('merkezAci', 'A', 'M', 'B', 5, { rol: 'tereyagi' }),
    olcumKaynakli('dilimAlan', 'olcum_alan', 'dilim', 6, { rol: 'gul' }),
    olcumKaynakli('daireCevre', 'olcum_cevre', 'tamDaire', 7, { rol: 'notr' }),
  ],
  adimlar: [
    adim(
      1,
      'Dilim bir kesirdir',
      'Merkez açı 360 derecenin ne kadarıysa, dilim de dairenin o kadarıdır.',
      ['dilim', 'merkezAci'],
    ),
    adim(
      2,
      'Çeyrek daire',
      'Kesim noktasını açı 90 derece olacak şekilde yerleştirin. Dilim tam dairenin dörtte biridir.',
      ['merkezAci', 'dilimAlan'],
    ),
    adim(
      3,
      'Formül nereden geliyor',
      'Tam dairenin alanı π × r × r. Dilim bunun merkez açı bölü 360 katıdır. 90 derece için dörtte bir, 60 derece için altıda bir.',
      ['dilimAlan'],
    ),
  ],
}

// 9) Eskenar dortgen ve yamugun alani
const UCURTMA = {
  slug: 'ucurtma-eskenar-dortgen',
  konuSlug: 's7-eskenar-dortgen-ve-yamugun-alani',
  tur: 'gercek_hayat',
  baslik: 'Uçurtma: köşegenlerle alan',
  ozet:
    'Uçurtmanın iki çubuğu köşegenlerdir ve birbirine diktir. Böyle bir dörtgenin alanı, köşegenlerin çarpımının yarısıdır.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 9, 9, -9]),
  nesneler: [
    nokta('M', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'kesişim' }),
    nokta('A', 0, 6, 1, { rol: 'gok', etiket: 'üst uç' }),
    karsi('C', 'M', 'A', 2, { rol: 'gok', etiket: null }),
    nokta('B', 4, 0, 3, { rol: 'seftali', etiket: 'yan uç' }),
    karsi('D', 'M', 'B', 4, { rol: 'seftali', etiket: null }),
    cizgi('cubuk1', 'dogru_parcasi', 'A', 'C', 5, { rol: 'gok', kalinlik: 3 }),
    cizgi('cubuk2', 'dogru_parcasi', 'B', 'D', 6, { rol: 'seftali', kalinlik: 3 }),
    cokgen('ucurtma', ['A', 'B', 'C', 'D'], 7, { rol: 'nane', opaklik: 0.4, etiket: 'uçurtma' }),
    uzunluk('k1', 'A', 'C', 8, { rol: 'gok', etiket: '1. köşegen' }),
    uzunluk('k2', 'B', 'D', 9, { rol: 'seftali', etiket: '2. köşegen' }),
    olcumKaynakli('alan', 'olcum_alan', 'ucurtma', 10, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(
      1,
      'İki çubuk, iki köşegen',
      'Uçurtmanın çubukları birbirini dik keser. Uçları birleştirince eşkenar dörtgen çıkar.',
      ['cubuk1', 'cubuk2', 'ucurtma'],
    ),
    adim(
      2,
      'Köşegenleri ölçün',
      'İki köşegenin uzunluğunu çarpın, ikiye bölün. Sonucu alan ölçümüyle karşılaştırın.',
      ['k1', 'k2', 'alan'],
    ),
    adim(
      3,
      'Neden bölü iki?',
      'Köşegenler dörtgeni dört dik üçgene ayırır. Bu dördü, köşegenlerin oluşturduğu dikdörtgenin tam yarısını kaplar.',
      ['alan'],
    ),
  ],
}

// 10) Gunluk hayatta alan problemleri
const HAVUZ = {
  slug: 'bahce-havuzu-kalan-alan',
  konuSlug: 's7-gunluk-hayatta-alan-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Bahçedeki yuvarlak havuz',
  ozet:
    'Dikdörtgen bahçenin ortasında yuvarlak bir havuz var. Çimlenecek alan, bahçe alanından havuz alanının çıkarılmasıyla bulunur.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 11, 15, -1], { birim: 'metre' }),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 12, 9, 1, { rol: 'nane', etiket: 'bahçe köşesi' }),
    bilesen('B', 'C', 'A', 2, { rol: 'notr', etiket: null }),
    bilesen('D', 'A', 'C', 3, { rol: 'notr', etiket: null }),
    cokgen('bahce', ['A', 'B', 'C', 'D'], 4, { rol: 'nane', opaklik: 0.4, etiket: 'bahçe' }),
    nokta('M', 6, 5, 5, { surukleme: 'yok', rol: 'gok', etiket: 'havuz merkezi' }),
    nokta('R', 9, 5, 6, { rol: 'gok', etiket: 'yarıçap' }),
    cember('havuz', 'M', 7, { uzerinde: 'R', rol: 'gok', kalinlik: 3 }),
    uzunluk('yaricap', 'M', 'R', 8, { rol: 'gok', etiket: 'yarıçap' }),
    olcumKaynakli('bahceAlan', 'olcum_alan', 'bahce', 9, { rol: 'tereyagi' }),
    olcumKaynakli('havuzCevre', 'olcum_cevre', 'havuz', 10, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(
      1,
      'İki şekil, iki alan',
      'Yeşil dikdörtgen bahçenin tamamı, mavi çember havuz. Çimlenecek yer aradaki bölge.',
      ['bahce', 'havuz'],
    ),
    adim(
      2,
      'Çıkarma işlemi',
      'Bahçe alanından havuz alanını çıkarın. Havuz alanı π × yarıçap × yarıçap ile bulunur.',
      ['bahceAlan', 'yaricap'],
    ),
    adim(
      3,
      'Havuz kenarına taş döşemek',
      'Havuzun etrafına taş döşenecekse alan değil çevre gerekir. Mor ölçüm çemberin uzunluğunu veriyor.',
      ['havuzCevre'],
    ),
  ],
}

// 11) Ucgende yardimci elemanlar
const YARDIMCI = {
  slug: 'ucgende-yardimci-elemanlar',
  konuSlug: 's7-ucgende-yardimci-elemanlar',
  tur: 'kesif',
  baslik: 'Üçgende kenarortay, açıortay, yükseklik',
  ozet:
    'Üç farklı yardımcı eleman, üç farklı işi yapar: biri kenarı ortalar, biri açıyı ortalar, biri kenara diktir. Köşeleri oynatıp ne zaman çakıştıklarını bulun.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -6]),
  nesneler: [
    nokta('A', -6, -3, 0, { rol: 'lavanta' }),
    nokta('B', 6, -3, 1, { rol: 'lavanta' }),
    nokta('C', 1, 5, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.3 }),
    // Kenarortay: C'den AB'nin orta noktasina
    {
      ad: 'Mab',
      tip: 'orta_nokta',
      etiket: null,
      sira: 4,
      katman: 2,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok' },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'uc1', sira: 0 },
        { kaynak: 'B', rol: 'uc2', sira: 1 },
      ],
    },
    cizgi('kenarortay', 'dogru_parcasi', 'C', 'Mab', 5, { rol: 'gok', kalinlik: 2.5 }),
    // Aciortay: C kosesindeki aciyi ortalar
    {
      ad: 'aciortay',
      tip: 'aci_ortay',
      etiket: null,
      sira: 6,
      katman: 1,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'seftali', kalinlik: 2.5 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'uc1', sira: 0 },
        { kaynak: 'C', rol: 'merkez', sira: 1 },
        { kaynak: 'B', rol: 'uc2', sira: 2 },
      ],
    },
    // Yukseklik: C'den AB'ye dikme
    cizgi('tabanDogru', 'dogru', 'A', 'B', 7, { rol: 'notr', kalinlik: 1 }),
    paralelDik('yukseklik', 'dikme', 'tabanDogru', 'C', 8, {
      rol: 'gul',
      kalinlik: 2.5,
      cizgiTipi: 'kesik',
    }),
    kesisim('H', 'tabanDogru', 'yukseklik', 9, { rol: 'gul', etiket: 'H' }),
    uzunluk('solOrta', 'A', 'Mab', 10, { rol: 'gok', etiket: null }),
    uzunluk('sagOrta', 'Mab', 'B', 11, { rol: 'gok', etiket: null }),
  ],
  adimlar: [
    adim(
      1,
      'Kenarortay kenarı ikiye böler',
      'Mavi doğru parçası C köşesinden AB kenarının orta noktasına gider. İki parça hep eşit.',
      ['kenarortay', 'solOrta', 'sagOrta'],
    ),
    adim(
      2,
      'Açıortay açıyı ikiye böler',
      'Turuncu doğru C köşesindeki açıyı iki eşit parçaya ayırır. Kenarı ortalamak zorunda değildir.',
      ['aciortay'],
    ),
    adim(
      3,
      'Yükseklik kenara diktir',
      'Pembe kesikli çizgi C’den AB’ye dik iner. Ayağı H noktası; üçgen geniş açılıysa H kenarın dışına bile çıkabilir.',
      ['yukseklik', 'H'],
    ),
    adim(
      4,
      'Ne zaman çakışırlar?',
      'C noktasını AB’nin tam ortasının üstüne getirin: üçgen ikizkenar olur ve üç eleman da aynı doğru üzerine düşer. Eşkenar üçgende bu her köşe için geçerlidir.',
      ['kenarortay', 'aciortay', 'yukseklik'],
    ),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's7-yansima-donusumu',
    sahneSlug: 'gol-yuzeyinde-yansima',
    baslik: 'Durgun suda dağ yansıması',
    hikaye:
      'Rüzgârsız bir günde göl yüzeyi ayna gibi davranır. Kıyıdaki her nokta, su çizgisine göre karşı tarafta aynı uzaklıkta görünür; bu yüzden yansıma ters ama aynı büyüklüktedir. Fotoğrafçılar bu simetriyi kadrajın tam ortasına su çizgisini koyarak kullanır.',
    soru: 'Dağın tepesi sudan 6 birim yukarıdaysa görüntüsü kaç birim aşağıdadır?',
    olcekAciklama: 'Izgaradaki 1 birim, manzarada yaklaşık 10 metreye karşılık gelir.',
    kaynak: 'MEB kazanımı MAT.7.3.1 — yansıma dönüşümü altındaki görüntü',
    yasAraligi: '12-14',
  },
  {
    konuSlug: 's7-orta-dikme-ve-aciortay-insasi',
    sahneSlug: 'iki-koy-kuyu-orta-dikme',
    baslik: 'İki köyün ortak kuyusu',
    hikaye:
      'İki köy ortak bir kuyu kazdıracak ve masrafı eşit paylaşacak. Adil olması için kuyunun ikisine de aynı uzaklıkta olması isteniyor. Böyle noktaların hepsi, köyleri birleştiren doğru parçasının orta dikmesi üzerindedir. Su bulunan yer bu doğrunun neresi olursa olsun koşul sağlanır.',
    soru: 'Kuyu orta dikme üzerinde herhangi bir yere kaydırılırsa uzaklıklar değişir mi? Neden?',
    olcekAciklama: 'Izgaradaki 1 birim yaklaşık 500 metredir.',
    kaynak: 'MEB kazanımı MAT.7.3.2 — orta dikme ve açıortay inşası',
    yasAraligi: '12-14',
  },
  {
    konuSlug: 's7-dikdortgenler-prizmasinin-yuzey-alani',
    sahneSlug: 'kutu-acinimi-yuzey-alani',
    baslik: 'Kutu için kaç metrekare karton?',
    hikaye:
      'Ambalaj üreticisi bir kutu için ne kadar karton gerektiğini hesaplarken kutuyu düzleştirir. Ortaya çıkan altı dikdörtgenin toplam alanı, kutunun yüzey alanıdır. Karşılıklı yüzler eş olduğu için hesap üç farklı alanın iki katına iner.',
    soru: 'Eni 5, boyu 3, yüksekliği 4 santimetre olan kutunun yüzey alanı kaç santimetrekaredir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 santimetredir.',
    kaynak: 'MEB kazanımı MAT.7.4.2 — dikdörtgenler prizmasının yüzey alanı',
    yasAraligi: '12-14',
  },
  {
    konuSlug: 's7-prizma-problemleri',
    sahneSlug: 'akvaryum-su-hacmi',
    baslik: 'Akvaryumun su hacmi',
    hikaye:
      'Akvaryum satın alırken kaç litre su alacağı sorulur, çünkü balık sayısı buna göre belirlenir. Hacim desimetreküp cinsinden hesaplanırsa doğrudan litre çıkar: 1 desimetreküp tam olarak 1 litredir. Su seviyesi camın üstüne kadar doldurulmaz, bu yüzden gerçek hacim biraz daha azdır.',
    soru: 'Genişliği 8, derinliği 4, su yüksekliği 4 desimetre olan akvaryumda kaç litre su vardır?',
    olcekAciklama: 'Izgaradaki 1 birim 1 desimetredir; 1 desimetreküp 1 litredir.',
    kaynak: 'MEB kazanımı MAT.7.4.6 — prizma hacmi ve yüzey alanı problemleri',
    yasAraligi: '12-14',
  },
  {
    konuSlug: 's7-eskenar-dortgen-ve-yamugun-alani',
    sahneSlug: 'ucurtma-eskenar-dortgen',
    baslik: 'Uçurtmanın kâğıdı',
    hikaye:
      'Klasik uçurtma iki çubuğun dik kesişmesiyle kurulur; çubuklar köşegenlerdir. Kâğıt keserken alan gerekir ve bu alan köşegenlerin çarpımının yarısıdır. Çubukları uzatıp kısaltmak alanı doğrudan değiştirir — bu yüzden rüzgâra göre uçurtma boyutu ayarlanabilir.',
    soru: 'Köşegenleri 60 ve 80 santimetre olan uçurtma için kaç santimetrekare kâğıt gerekir?',
    olcekAciklama: 'Izgaradaki 1 birim 10 santimetredir.',
    kaynak: 'MEB kazanımı MAT.7.4.9 — eşkenar dörtgen ve yamuğun alanı',
    yasAraligi: '12-14',
  },
  {
    konuSlug: 's7-gunluk-hayatta-alan-problemleri',
    sahneSlug: 'bahce-havuzu-kalan-alan',
    baslik: 'Havuzlu bahçenin çimi',
    hikaye:
      'Peyzaj hesabında iki ayrı ölçü birlikte kullanılır. Çim tohumu için bahçe alanından havuz alanı çıkarılır; havuz kenarına döşenecek taş için ise havuzun çevresi gerekir. İkisini karıştırmak siparişi yanlış verdirir.',
    soru: '11 × 8 metrelik bahçede yarıçapı 3 metre olan havuz varsa kaç metrekare çim gerekir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.7.4.10 — günlük hayatta alan problemleri',
    yasAraligi: '12-14',
  },
]

const SORULAR = [
  {
    konuSlug: 's7-yansima-donusumu',
    sahneSlug: 'gol-yuzeyinde-yansima',
    tip: 'coktan_secmeli',
    govde: 'Yansıma dönüşümünde aşağıdakilerden hangisi değişir?',
    secenekler: [
      'Kenar uzunlukları',
      'Açı ölçüleri',
      'Şeklin yönelimi',
      'Şeklin alanı',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 2 },
    ipucu: 'Sahnede yeşil ile pembe şekli karşılaştırın.',
    cozum:
      'Yansımada uzunluklar, açılar ve alan korunur; yalnızca yönelim ters döner. Bu yüzden görüntü aynı büyüklükte ama ayna gibidir.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's7-orta-dikme-ve-aciortay-insasi',
    sahneSlug: 'iki-koy-kuyu-orta-dikme',
    tip: 'dogru_yanlis',
    govde:
      'Bir doğru parçasının orta dikmesi üzerindeki her nokta, parçanın iki ucuna eşit uzaklıktadır.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Kuyuyu turuncu doğru boyunca kaydırıp ölçümleri izleyin.',
    cozum:
      'Orta dikmenin tanımı budur: orta noktadan geçer ve diktir, bu yüzden üzerindeki her nokta iki uca eşit uzaklıktadır.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's7-dikdortgenler-prizmasinin-yuzey-alani',
    tip: 'sayisal',
    govde:
      'Eni 5, boyu 3, yüksekliği 4 santimetre olan dikdörtgenler prizmasının yüzey alanı kaç santimetrekaredir?',
    cevap: { tip: 'sayisal', deger: 94, tolerans: 0, birim: 'santimetrekare' },
    ipucu: 'Üç farklı yüzün alanını bulup toplamı iki katına çıkarın.',
    cozum: '2 × (5×3 + 5×4 + 3×4) = 2 × (15 + 20 + 12) = 2 × 47 = 94 santimetrekare.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's7-dikdortgenler-prizmasinin-hacmi',
    sahneSlug: 'birim-kuplerle-hacim',
    tip: 'sayisal',
    govde: 'Taban alanı 15 birim kare, yüksekliği 5 birim olan prizmanın hacmi kaçtır?',
    cevap: { tip: 'sayisal', deger: 75, tolerans: 0, birim: 'birim küp' },
    ipucu: 'Bir kata kaç küp sığıyor, kaç kat var?',
    cozum: '15 × 5 = 75 birim küp. Hacim = taban alanı × yükseklik.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's7-prizma-problemleri',
    sahneSlug: 'akvaryum-su-hacmi',
    tip: 'sayisal',
    govde:
      'Genişliği 8, derinliği 4, su yüksekliği 4 desimetre olan akvaryumda kaç litre su vardır?',
    cevap: { tip: 'sayisal', deger: 128, tolerans: 0, birim: 'litre' },
    ipucu: '1 desimetreküp 1 litredir.',
    cozum: '8 × 4 × 4 = 128 desimetreküp, yani 128 litre.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's7-dairenin-alani',
    sahneSlug: 'dairenin-alani-yaricap',
    tip: 'sayisal',
    govde: 'Yarıçapı 5 birim olan dairenin alanı kaç birim karedir? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 75, tolerans: 0.5, birim: 'birim kare' },
    ipucu: 'Alan = π × yarıçap × yarıçap.',
    cozum: '3 × 5 × 5 = 75 birim kare. π ≈ 3,14 alınırsa 78,5 çıkar.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's7-dairenin-alani',
    tip: 'acik_uclu',
    govde:
      'Yarıçap iki katına çıkarsa çevre ve alan nasıl değişir? Sahnede deneyip açıklayın.',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Çevre iki katına çıkar çünkü yarıçapla doğru orantılıdır. Alan ise dört katına çıkar çünkü yarıçapın karesiyle orantılıdır. Yarıçap 2 iken alan 12, yarıçap 4 iken 48 civarında olur.',
      anahtarlar: ['iki katına', 'dört katına', 'kare'],
    },
    ipucu: 'Yarıçapı 2 yapıp ölçün, sonra 4 yapıp tekrar ölçün.',
    cozum:
      'Çevre 2πr olduğu için r ile doğru orantılıdır. Alan πr² olduğu için r’nin karesiyle orantılıdır: r iki katına çıkarsa alan 2² = 4 katına çıkar.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's7-daire-diliminin-alani',
    sahneSlug: 'daire-dilimi-alan',
    tip: 'sayisal',
    govde:
      'Yarıçapı 6 birim olan dairede 90 derecelik dilimin alanı kaç birim karedir? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 27, tolerans: 0.5, birim: 'birim kare' },
    ipucu: '90 derece tam dairenin kaçta kaçıdır?',
    cozum:
      'Tam daire 3 × 6 × 6 = 108. 90 derece dörtte biri olduğu için 108 ÷ 4 = 27 birim kare.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's7-eskenar-dortgen-ve-yamugun-alani',
    sahneSlug: 'ucurtma-eskenar-dortgen',
    tip: 'sayisal',
    govde: 'Köşegenleri 60 ve 80 santimetre olan uçurtmanın alanı kaç santimetrekaredir?',
    cevap: { tip: 'sayisal', deger: 2400, tolerans: 0, birim: 'santimetrekare' },
    ipucu: 'Köşegenlerin çarpımının yarısı.',
    cozum: '(60 × 80) ÷ 2 = 2400 santimetrekare.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's7-gunluk-hayatta-alan-problemleri',
    sahneSlug: 'bahce-havuzu-kalan-alan',
    tip: 'sayisal',
    govde:
      '11 × 8 metrelik bahçenin ortasında yarıçapı 3 metre olan yuvarlak havuz var. Kaç metrekare çim gerekir? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 61, tolerans: 1, birim: 'metrekare' },
    ipucu: 'Bahçe alanından havuz alanını çıkarın.',
    cozum: '11 × 8 = 88 metrekare bahçe. Havuz 3 × 3 × 3 = 27. 88 − 27 = 61 metrekare çim.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's7-ucgende-yardimci-elemanlar',
    sahneSlug: 'ucgende-yardimci-elemanlar',
    tip: 'coktan_secmeli',
    govde: 'Bir üçgende kenarortay, açıortay ve yükseklik ne zaman aynı doğru üzerine düşer?',
    secenekler: [
      'Her üçgende',
      'Sadece dik üçgende',
      'İkizkenar üçgende tepe köşesinden çizilirse',
      'Hiçbir zaman',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 2 },
    ipucu: 'C noktasını AB’nin tam ortasının üstüne getirin.',
    cozum:
      'İkizkenar üçgende tepe köşesinden çizilen kenarortay, açıortay ve yükseklik çakışır. Eşkenar üçgende bu her köşe için geçerlidir.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's7-es-kuplerle-yapilar-ve-gorunumler',
    sahneSlug: 'kup-yapisi-uc-gorunum',
    tip: 'sayisal',
    govde:
      'Eni 4, boyu 3, yüksekliği 2 birim olan bir yapının üstten görünümünde kaç kare görünür?',
    cevap: { tip: 'sayisal', deger: 12, tolerans: 0, birim: 'kare' },
    ipucu: 'Üstten bakınca hangi iki ölçü görünür?',
    cozum: 'Üstten görünüm en × boy kadardır: 4 × 3 = 12 kare.',
    zorluk: 2,
    puan: 2,
  },
]

console.log('7. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [GOL, KUYU, GORUNUM, ACINIM, HACIM, AKVARYUM, DAIRE_ALAN, DILIM, UCURTMA, HAVUZ, YARDIMCI],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n7. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 7)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
