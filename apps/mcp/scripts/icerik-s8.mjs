/**
 * 8. sinif geometri dilimi - on iki konu.
 *
 * Calistir: npm run icerik-s8 -w @matgebra/mcp
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
  kesisim,
  nokta,
  olcumKaynakli,
  otelenmisCokgen,
  paralelDik,
  surgu,
  uret,
  uzunluk,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-s8')

/* --------------------------------------------------------------- sahneler */

const ACI_KENAR = {
  slug: 'ucgende-aci-kenar-iliskisi',
  konuSlug: 's8-ucgende-aci-kenar-iliskisi',
  tur: 'kesif',
  baslik: 'Büyük açının karşısında büyük kenar',
  ozet:
    'Üçgenin köşelerini oynatın: en büyük açının karşısındaki kenarın her zaman en uzun kenar olduğunu görün.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -6]),
  nesneler: [
    nokta('A', -6, -3, 0, { rol: 'lavanta' }),
    nokta('B', 6, -3, 1, { rol: 'lavanta' }),
    nokta('C', 0, 5, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.35 }),
    aci('aciA', 'B', 'A', 'C', 4, { rol: 'tereyagi' }),
    aci('aciB', 'C', 'B', 'A', 5, { rol: 'seftali' }),
    aci('aciC', 'A', 'C', 'B', 6, { rol: 'gok' }),
    uzunluk('a', 'B', 'C', 7, { rol: 'tereyagi', etiket: 'A karşısı' }),
    uzunluk('b', 'A', 'C', 8, { rol: 'seftali', etiket: 'B karşısı' }),
    uzunluk('c', 'A', 'B', 9, { rol: 'gok', etiket: 'C karşısı' }),
  ],
  adimlar: [
    adim(1, 'Her açının bir karşı kenarı var', 'Renkler eşleşiyor: sarı açının karşısındaki kenar da sarı.', ['aciA', 'a']),
    adim(2, 'En büyüğü bulun', 'Üç açıyı karşılaştırın, sonra üç kenarı. En büyük açı ile en uzun kenarın rengi aynı çıkıyor.', ['aciA', 'aciB', 'aciC']),
    adim(3, 'Köşeleri oynatın', 'C noktasını sağa sola taşıyın. Sıralama değişse de eşleşme bozulmuyor: büyük açı, büyük kenar.', ['C', 'a', 'b', 'c']),
  ],
}

const ESITSIZLIK = {
  slug: 'ucgen-esitsizligi-cubuklar',
  konuSlug: 's8-ucgen-esitsizligi',
  tur: 'gercek_hayat',
  baslik: 'Üç çubukla üçgen kurulabilir mi?',
  ozet:
    'Elinizde üç çubuk var. Her üçlü üçgen oluşturmaz: iki kısa çubuğun toplamı uzun olandan büyük olmalı. Uçları oynatıp sınırı bulun.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 7, 10, -7]),
  nesneler: [
    nokta('A', -6, -2, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 6, -2, 1, { rol: 'gok', etiket: 'uzun çubuk ucu' }),
    nokta('C', -1, 4, 2, { rol: 'seftali', etiket: 'birleşme' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.35 }),
    uzunluk('c', 'A', 'B', 4, { rol: 'gok', etiket: 'AB' }),
    uzunluk('b', 'A', 'C', 5, { rol: 'seftali', etiket: 'AC' }),
    uzunluk('a', 'C', 'B', 6, { rol: 'tereyagi', etiket: 'BC' }),
  ],
  adimlar: [
    adim(1, 'Üç çubuk, bir üçgen', 'Üç kenar üç çubuğu temsil ediyor. Uzunlukları ölçümlerden okuyun.', ['ucgen', 'a', 'b', 'c']),
    adim(2, 'En uzunu bulun, diğer ikisini toplayın', 'Üç ölçümden en büyüğünü seçin. Kalan ikisinin toplamı ondan her zaman büyük çıkıyor — üçgen varsa bu koşul sağlanmak zorunda.', ['a', 'b', 'c']),
    adim(3, 'Sınıra yaklaşın', 'Birleşme noktasını AB doğrusuna doğru indirin: toplam uzuna yaklaşıyor ve üçgen yassılaşıyor. Tam çakıştığında üçgen yok olur.', ['C']),
  ],
}

const ESLIK = {
  slug: 'ucgenlerde-eslik-kkk',
  konuSlug: 's8-ucgenlerde-eslik',
  tur: 'kesif',
  baslik: 'Eş üçgenler: üç kenar yeter mi?',
  ozet:
    'Sağdaki üçgen, soldakinin ötelenmiş kopyasıdır: üç kenarı da aynı. Soldakini oynatın, sağdaki birebir takip ediyor — üç kenar üçgeni tek biçimde belirler.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 8, 11, -7]),
  nesneler: [
    nokta('A', -9, -3, 0, { rol: 'lavanta' }),
    nokta('B', -3, -3, 1, { rol: 'lavanta' }),
    nokta('C', -6, 3, 2, { rol: 'lavanta' }),
    cokgen('sol', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.4, etiket: 'ABC' }),
    ...otelenmisCokgen('sag', ['A', 'B', 'C'], 11, 0, 4, {
      rol: 'gok',
      opaklik: 0.4,
      etiket: "A'B'C'",
      koseGorunur: true,
      koseEtiketleri: ["A'", "B'", "C'"],
    }),
    uzunluk('solAB', 'A', 'B', 10, { rol: 'nane', etiket: 'AB' }),
    uzunluk('sagAB', 'sag_A', 'sag_B', 11, { rol: 'gok', etiket: "A'B'" }),
  ],
  adimlar: [
    adim(1, 'İki üçgen, aynı ölçüler', 'Sağdaki üçgen soldakinin kopyası: aynı kenarlar, aynı açılar, sadece yeri farklı.', ['sol', 'sag']),
    adim(2, 'Kenarları karşılaştırın', 'AB ile A′B′ hep aynı. Soldaki köşeleri sürükleyin, eşitlik bozulmuyor.', ['solAB', 'sagAB']),
    adim(3, 'Üç kenar yeterlidir', 'Üç kenar uzunluğu verildiğinde üçgen tek biçimde belirlenir; başka bir üçgen çizilemez. Buna kenar-kenar-kenar eşliği denir.', ['sol', 'sag']),
  ],
}

const BENZERLIK = {
  slug: 'benzerlik-golge-boyu',
  konuSlug: 's8-ucgenlerde-benzerlik',
  tur: 'gercek_hayat',
  baslik: 'Gölge boyuyla ağacın yüksekliği',
  ozet:
    'Aynı anda güneş herkese aynı açıyla vurur. Bir çubuk ile ağacın gölgeleri benzer üçgenler oluşturur; oranı kurup ağacın boyunu bulabilirsiniz.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 11, 17, -2], { birim: 'metre' }),
  nesneler: [
    nokta('O', 1, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('Z', 15, 0, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cizgi('zemin', 'dogru', 'O', 'Z', 2, { rol: 'notr', kalinlik: 2 }),
    // Kucuk ucgen: cubuk. Ucu dikey bir kilavuz uzerinde kayiyor ki
    // cubuk her zaman zemine dik kalsin.
    nokta('C1', 4, 0, 3, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('Cust', 4, 6, 4, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('cubukEkseni', 'dogru', 'C1', 'Cust', 5, { rol: 'notr', gorunur: false }),
    surgu('C2', 'cubukEkseni', 4, 2, 6, { rol: 'seftali', etiket: 'çubuk' }),
    cizgi('cubuk', 'dogru_parcasi', 'C1', 'C2', 7, { rol: 'seftali', kalinlik: 3 }),
    // Isik dogrultusu: C2'den O'ya
    cizgi('isin', 'dogru', 'O', 'C2', 8, { rol: 'tereyagi', cizgiTipi: 'kesik' }),
    // Buyuk ucgen: agac. Dibi zemin uzerinde kayiyor.
    surgu('A1', 'zemin', 12, 0, 9, { rol: 'nane', etiket: 'ağaç' }),
    paralelDik('agacDogru', 'dikme', 'zemin', 'A1', 10, { rol: 'nane', kalinlik: 1 }),
    kesisim('A2', 'agacDogru', 'isin', 11, { rol: 'nane', etiket: 'tepe' }),
    cizgi('agac', 'dogru_parcasi', 'A1', 'A2', 12, { rol: 'nane', kalinlik: 4 }),
    uzunluk('golgeKucuk', 'O', 'C1', 13, { rol: 'seftali', etiket: 'çubuk gölgesi' }),
    uzunluk('boyKucuk', 'C1', 'C2', 14, { rol: 'seftali', etiket: 'çubuk boyu' }),
    uzunluk('golgeBuyuk', 'O', 'A1', 15, { rol: 'nane', etiket: 'ağaç gölgesi' }),
    uzunluk('boyBuyuk', 'A1', 'A2', 16, { rol: 'nane', etiket: 'ağaç boyu' }),
  ],
  adimlar: [
    adim(1, 'İki dik üçgen', 'Çubuk ve gölgesi bir dik üçgen, ağaç ve gölgesi başka bir dik üçgen oluşturuyor. Güneş ışını ikisinin de hipotenüsü.', ['cubuk', 'agac', 'isin']),
    adim(2, 'Açılar aynı', 'Işık açısı ikisinde de aynı, zemin açısı ikisinde de 90 derece. İki açısı eşit olan üçgenler benzerdir.', ['isin']),
    adim(3, 'Oranı kurun', 'Çubuk boyu bölü çubuk gölgesi, ağaç boyu bölü ağaç gölgesine eşittir. Ağacı sürükleyip oranın korunduğunu görün.', ['boyKucuk', 'golgeKucuk', 'boyBuyuk', 'golgeBuyuk']),
  ],
}

const PISAGOR = {
  slug: 'merdiven-pisagor',
  konuSlug: 's8-pisagor-bagintisi',
  tur: 'gercek_hayat',
  baslik: 'Duvara dayalı merdiven',
  ozet:
    'Merdiven, duvar ve zemin bir dik üçgen oluşturur. Merdivenin ayağını duvardan uzaklaştırın: üç kenar arasındaki bağıntının nasıl korunduğunu izleyin.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 11, 13, -2], { birim: 'metre' }),
  nesneler: [
    nokta('K', 1, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'köşe' }),
    nokta('Z', 12, 0, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D', 1, 10, 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cizgi('zemin', 'dogru', 'K', 'Z', 3, { rol: 'notr', kalinlik: 3 }),
    cizgi('duvar', 'dogru', 'K', 'D', 4, { rol: 'notr', kalinlik: 3 }),
    // Ayak zeminde, uc duvarda kayiyor: dik ucgen hicbir surukleyisde bozulmuyor.
    surgu('A', 'zemin', 5, 0, 5, { rol: 'seftali', etiket: 'merdiven ayağı' }),
    surgu('T', 'duvar', 1, 7, 6, { rol: 'gok', etiket: 'merdiven ucu' }),
    cizgi('merdiven', 'dogru_parcasi', 'A', 'T', 7, { rol: 'gul', kalinlik: 4 }),
    cokgen('ucgen', ['K', 'A', 'T'], 8, { rol: 'nane', opaklik: 0.3 }),
    uzunluk('taban', 'K', 'A', 9, { rol: 'seftali', etiket: 'duvara uzaklık' }),
    uzunluk('yukseklik', 'K', 'T', 10, { rol: 'gok', etiket: 'ulaşılan yükseklik' }),
    uzunluk('boy', 'A', 'T', 11, { rol: 'gul', etiket: 'merdiven boyu' }),
    aci('dikAci', 'A', 'K', 'T', 12, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(1, 'Dik üçgen', 'Duvar ile zemin arasındaki açı 90 derece. Merdiven hipotenüs.', ['dikAci', 'ucgen']),
    adim(2, 'Kareleri toplayın', 'Duvara uzaklığın karesi ile yüksekliğin karesini toplayın; merdiven boyunun karesine eşit çıkar.', ['taban', 'yukseklik', 'boy']),
    adim(3, 'Ayağı uzaklaştırın', 'Merdiven ayağını duvardan uzaklaştırın. Boy sabit tutulursa ulaşılan yükseklik azalır — güvenli açı bu yüzden önemlidir.', ['A', 'T']),
  ],
}

const UCGEN_PROBLEM = {
  slug: 'cati-makasi-ucgen-problem',
  konuSlug: 's8-ucgen-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Çatı makası: üçgenin bütün ölçüleri',
  ozet:
    'Çatı makası bir ikizkenar üçgendir. Açıları, kenarları ve yüksekliği birlikte değişir. Tepe noktasını oynatıp aralarındaki bağı izleyin.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 9, 9, -4]),
  nesneler: [
    nokta('A', -6, 0, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 6, 0, 1, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 0, 5, 2, { rol: 'seftali', etiket: 'mahya' }),
    cokgen('makas', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.35 }),
    cizgi('tabanDogru', 'dogru', 'A', 'B', 4, { rol: 'notr', kalinlik: 1 }),
    paralelDik('dikme', 'dikme', 'tabanDogru', 'C', 5, { rol: 'gok', cizgiTipi: 'kesik' }),
    kesisim('H', 'tabanDogru', 'dikme', 6, { rol: 'gok', etiket: 'H' }),
    uzunluk('sol', 'A', 'C', 7, { rol: 'seftali', etiket: 'sol eğim' }),
    uzunluk('sag', 'C', 'B', 8, { rol: 'seftali', etiket: 'sağ eğim' }),
    uzunluk('yukseklik', 'C', 'H', 9, { rol: 'gok', etiket: 'yükseklik' }),
    aci('aciA', 'B', 'A', 'C', 10, { rol: 'tereyagi' }),
    aci('aciB', 'C', 'B', 'A', 11, { rol: 'tereyagi' }),
    olcumKaynakli('alan', 'olcum_alan', 'makas', 12, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'İkizkenar makas', 'Mahya tabanın tam ortasındayken iki eğim eşit olur; taban açıları da eşittir.', ['sol', 'sag', 'aciA', 'aciB']),
    adim(2, 'Yükseklik ve alan', 'Yükseklik tabana diktir. Alan, taban ile yüksekliğin çarpımının yarısıdır.', ['yukseklik', 'alan']),
    adim(3, 'Mahyayı kaydırın', 'Mahyayı yana kaydırın: eğimler farklılaşır, taban açıları da. Ama yükseklik aynı kalırsa alan değişmez.', ['C', 'alan']),
  ],
}

const ACINIM8 = {
  slug: 'silindir-koni-acinim',
  konuSlug: 's8-cisimlerin-yuzey-acinimlari',
  tur: 'kesif',
  baslik: 'Silindiri açınca ne çıkar?',
  ozet:
    'Bir konserve kutusunun etiketini kesip düzleştirin: dikdörtgen çıkar. Dikdörtgenin bir kenarı silindirin yüksekliği, diğeri taban çemberinin uzunluğudur.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-8, 12, 18, -8]),
  nesneler: [
    nokta('M', -4, 4, 0, { surukleme: 'yok', rol: 'notr', etiket: 'taban merkezi' }),
    nokta('R', -1, 4, 1, { rol: 'seftali', etiket: 'yarıçap' }),
    cember('taban', 'M', 2, { uzerinde: 'R', rol: 'gok', kalinlik: 3 }),
    uzunluk('yaricap', 'M', 'R', 3, { rol: 'seftali', etiket: 'yarıçap' }),
    olcumKaynakli('tabanCevre', 'olcum_cevre', 'taban', 4, { rol: 'lavanta' }),
    // Acinim dikdortgeni: eni taban cevresi kadar degil, temsili.
    nokta('P1', 3, -6, 5, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('P3', 15, 2, 6, { rol: 'nane', etiket: 'etiket köşesi' }),
    bilesen('P2', 'P3', 'P1', 7, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('P4', 'P1', 'P3', 8, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('etiket', ['P1', 'P2', 'P3', 'P4'], 9, { rol: 'nane', opaklik: 0.4, etiket: 'yan yüz' }),
    uzunluk('etiketEn', 'P1', 'P2', 10, { rol: 'lavanta', etiket: 'taban çevresi' }),
    uzunluk('etiketBoy', 'P2', 'P3', 11, { rol: 'nane', etiket: 'yükseklik' }),
    olcumKaynakli('etiketAlan', 'olcum_alan', 'etiket', 12, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(1, 'Kutunun etiketi', 'Yeşil dikdörtgen, konserve kutusunun etrafını saran etiket. Kesilip düzleştirilmiş hali.', ['etiket']),
    adim(2, 'En, taban çevresine eşit', 'Etiketin eni tam olarak taban çemberinin uzunluğu kadar olmalı; yoksa kutunun etrafını saramaz. Yarıçapı değiştirip mor ölçümü izleyin.', ['tabanCevre', 'etiketEn']),
    adim(3, 'Yan yüz alanı', 'Yan yüzün alanı = taban çevresi × yükseklik. Silindirin tüm yüzey alanı için buna iki taban dairesini de eklemek gerekir.', ['etiketAlan']),
  ],
}

const SILINDIR_ALAN = {
  slug: 'konserve-silindir-yuzey',
  konuSlug: 's8-silindirin-yuzey-alani',
  tur: 'gercek_hayat',
  baslik: 'Konserve kutusu için kaç teneke?',
  ozet:
    'Bir silindirin yüzeyi üç parçadan oluşur: iki daire ve bir dikdörtgen. Yarıçap ile yüksekliği değiştirip hangisinin alanı ne kadar etkilediğini görün.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 9, 13, -9]),
  nesneler: [
    // Silindirin ekseni: alt taban merkezi bunun uzerinde kayar,
    // boylece iki taban her zaman ust uste kalir.
    nokta('M', -4, 4, 0, { surukleme: 'yok', rol: 'notr', etiket: 'üst taban' }),
    nokta('Ealt', -4, -8, 1, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('silindirEkseni', 'dogru', 'M', 'Ealt', 2, {
      rol: 'notr',
      kalinlik: 1,
      cizgiTipi: 'kesik',
    }),
    nokta('R', -1, 4, 3, { rol: 'seftali', etiket: 'yarıçap' }),
    cember('ust', 'M', 4, { uzerinde: 'R', rol: 'gok', kalinlik: 2 }),
    surgu('M2', 'silindirEkseni', -4, -4, 5, { rol: 'nane', etiket: 'alt taban' }),
    cember('alt', 'M2', 6, { yaricapUc: ['M', 'R'], rol: 'gok', kalinlik: 2 }),
    uzunluk('yaricap', 'M', 'R', 7, { rol: 'seftali', etiket: 'yarıçap' }),
    uzunluk('yukseklik', 'M', 'M2', 8, { rol: 'nane', etiket: 'yükseklik' }),
    olcumKaynakli('ustCevre', 'olcum_cevre', 'ust', 9, { rol: 'lavanta' }),
    // Acilmis yan yuz: yuksekligi silindirin yuksekligini birebir takip eder.
    nokta('X0', 4, 0, 10, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    bilesen('E1', 'X0', 'M2', 11, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('E2', 'X0', 'M2', 12, { rol: 'notr', etiket: null, gorunur: false, dx: 8 }),
    bilesen('E3', 'X0', 'M', 13, { rol: 'notr', etiket: null, gorunur: false, dx: 8 }),
    bilesen('E4', 'X0', 'M', 14, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('yanYuz', ['E1', 'E2', 'E3', 'E4'], 15, {
      rol: 'nane',
      opaklik: 0.4,
      etiket: 'yan yüz',
    }),
    uzunluk('yanBoy', 'E2', 'E3', 16, { rol: 'nane', etiket: 'yükseklik' }),
  ],
  adimlar: [
    adim(1, 'Üç parça', 'İki daire (alt ve üst kapak) ile bir dikdörtgen (yan yüz). Toplam yüzey alanı bu üçünün toplamı.', ['ust', 'alt', 'yanYuz']),
    adim(2, 'Yüksekliği değiştirin', 'Alt tabanı eksen boyunca kaydırın: yan yüzün boyu birebir aynı değişiyor, kapaklar ise hiç değişmiyor.', ['M2', 'yukseklik', 'yanBoy']),
    adim(3, 'Yarıçapı değiştirin', 'Yarıçap büyüyünce hem kapaklar hem yan yüzün eni büyür — kapaklar karesiyle, yan yüz doğru orantılı. Bu yüzden yarıçap daha etkilidir.', ['R', 'yaricap', 'ustCevre']),
    adim(4, 'Formül', 'Yüzey alanı = 2 × π × r × r + 2 × π × r × h. İlk terim iki kapak, ikinci terim yan yüzdür.', ['yaricap', 'yukseklik']),
  ],
}

const SILINDIR_HACIM = {
  slug: 'silindir-hacim-su-bardagi',
  konuSlug: 's8-silindirin-hacmi',
  tur: 'gercek_hayat',
  baslik: 'Su bardağı kaç mililitre alır?',
  ozet:
    'Silindirin hacmi, taban dairesinin alanı ile yüksekliğin çarpımıdır. Yarıçapı iki katına çıkarmak hacmi dört katına çıkarır; yüksekliği iki katına çıkarmak sadece iki katına.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 9, 11, -9], { birim: 'cm' }),
  nesneler: [
    nokta('M', -3, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'taban' }),
    nokta('R', 0, 0, 1, { rol: 'seftali', etiket: 'yarıçap' }),
    cember('taban', 'M', 2, { uzerinde: 'R', rol: 'gok', kalinlik: 3 }),
    uzunluk('yaricap', 'M', 'R', 3, { rol: 'seftali', etiket: 'yarıçap' }),
    olcumKaynakli('tabanCevre', 'olcum_cevre', 'taban', 4, { rol: 'lavanta' }),
    nokta('H1', 7, -6, 5, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('Hust', 7, 8, 6, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('yukseklikEkseni', 'dogru', 'H1', 'Hust', 7, { rol: 'notr', gorunur: false }),
    surgu('H2', 'yukseklikEkseni', 7, 3, 8, { rol: 'nane', etiket: 'yükseklik' }),
    cizgi('yukseklikCizgi', 'dogru_parcasi', 'H1', 'H2', 9, { rol: 'nane', kalinlik: 4 }),
    uzunluk('yukseklik', 'H1', 'H2', 10, { rol: 'nane', etiket: 'yükseklik' }),
  ],
  adimlar: [
    adim(1, 'Önce taban', 'Taban bir dairedir; alanı π × r × r. Yarıçapı sürükleyip değiştirin.', ['taban', 'yaricap']),
    adim(2, 'Sonra yükseklik', 'Taban alanını yükseklikle çarpın. Yeşil çizgi yüksekliği gösteriyor.', ['yukseklikCizgi', 'yukseklik']),
    adim(3, 'Hangisi daha etkili?', 'Yarıçapı iki katına çıkarın: hacim dört katına çıkar. Yüksekliği iki katına çıkarın: hacim sadece iki katına. Çünkü yarıçap karesiyle giriyor.', ['yaricap', 'yukseklik']),
  ],
}

const OTELEME_SAHNE = {
  slug: 'kilim-deseni-oteleme',
  konuSlug: 's8-oteleme-donusumu',
  tur: 'gercek_hayat',
  baslik: 'Kilim deseni: öteleme',
  ozet:
    'Kilim desenleri aynı motifin belirli bir vektörle tekrar tekrar ötelenmesiyle oluşur. Motifi değiştirin: bütün kopyalar birlikte değişiyor.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 7, 12, -7]),
  nesneler: [
    nokta('A', -8, -2, 0, { rol: 'nane' }),
    nokta('B', -5, -2, 1, { rol: 'nane' }),
    nokta('C', -6.5, 2, 2, { rol: 'nane', etiket: 'motif tepesi' }),
    cokgen('motif', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.5, etiket: 'motif' }),
    ...otelenmisCokgen('kopya1', ['A', 'B', 'C'], 5, 0, 4, { rol: 'gok', opaklik: 0.45 }),
    ...otelenmisCokgen('kopya2', ['A', 'B', 'C'], 10, 0, 8, { rol: 'seftali', opaklik: 0.45 }),
    ...otelenmisCokgen('kopya3', ['A', 'B', 'C'], 15, 0, 12, { rol: 'gul', opaklik: 0.45 }),
    uzunluk('adimUz', 'A', 'kopya1_A', 16, { rol: 'lavanta', etiket: 'öteleme adımı' }),
  ],
  adimlar: [
    adim(1, 'Bir motif, üç kopya', 'Yeşil motif aslıdır; diğer üçü aynı vektörle ötelenmiş kopyalarıdır.', ['motif', 'kopya1', 'kopya2', 'kopya3']),
    adim(2, 'Öteleme şekli değiştirmez', 'Motifin köşelerini sürükleyin: kopyalar birebir aynı değişiyor. Öteleme uzunlukları ve açıları korur.', ['A', 'B', 'C']),
    adim(3, 'Adım hep aynı', 'Her kopya bir öncekinden aynı uzaklıkta. Kilimin düzenli görünmesinin sebebi bu sabit adımdır.', ['adimUz']),
  ],
}

const KOORDINAT_OTELEME = {
  slug: 'koordinatta-oteleme',
  konuSlug: 's8-koordinat-sisteminde-oteleme',
  tur: 'kesif',
  baslik: 'Koordinatlarda öteleme',
  ozet:
    'Bir şekli sağa 6, yukarı 3 birim öteleyin: her köşenin apsisi 6, ordinatı 3 artar. Köşeleri oynatıp kuralın bozulmadığını görün.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('tam', [-10, 8, 10, -6]),
  nesneler: [
    nokta('A', -7, -3, 0, { rol: 'nane' }),
    nokta('B', -3, -3, 1, { rol: 'nane' }),
    nokta('C', -5, 0, 2, { rol: 'nane' }),
    cokgen('sekil', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.45, etiket: 'ABC' }),
    ...otelenmisCokgen('goruntu', ['A', 'B', 'C'], 6, 3, 4, {
      rol: 'gul',
      opaklik: 0.45,
      etiket: "A'B'C'",
      koseGorunur: true,
      koseEtiketleri: ["A'", "B'", "C'"],
    }),
    cizgi('okA', 'dogru_parcasi', 'A', 'goruntu_A', 8, {
      rol: 'lavanta',
      cizgiTipi: 'kesik',
      kalinlik: 1.5,
    }),
    cizgi('okC', 'dogru_parcasi', 'C', 'goruntu_C', 9, {
      rol: 'lavanta',
      cizgiTipi: 'kesik',
      kalinlik: 1.5,
    }),
    uzunluk('okUz', 'A', 'goruntu_A', 10, { rol: 'lavanta', etiket: 'öteleme' }),
  ],
  adimlar: [
    adim(1, 'Şekil ve görüntüsü', 'Yeşil şekil sağa 6, yukarı 3 birim ötelendi; pembe olan görüntüsü.', ['sekil', 'goruntu']),
    adim(2, 'Her köşe aynı yönde gitti', 'Kesikli çizgiler öteleme vektörünü gösteriyor. Hepsi aynı uzunlukta ve aynı yönde.', ['okA', 'okC', 'okUz']),
    adim(3, 'Koordinatlara bakın', 'A(−7, −3) noktası A′(−1, 0) oldu: apsis 6 arttı, ordinat 3 arttı. Köşeleri sürükleyin, kural değişmiyor.', ['A', 'goruntu_A']),
  ],
}

const DONUSUM_PROBLEM = {
  slug: 'donusum-oteleme-yansima',
  konuSlug: 's8-donusum-problemleri',
  tur: 'kesif',
  baslik: 'Önce ötele, sonra yansıt',
  ozet:
    'İki dönüşümü art arda uygulayınca sonuç, sıraya bağlıdır. Şekli oynatıp iki ara adımı ve son görüntüyü birlikte izleyin.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('tam', [-11, 8, 11, -8]),
  nesneler: [
    nokta('E1', -10, 0, 0, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('E2', 10, 0, 1, { surukleme: 'yok', rol: 'gok', etiket: null }),
    cizgi('eksen', 'dogru', 'E1', 'E2', 2, { rol: 'gok', kalinlik: 2 }),
    nokta('A', -8, 2, 3, { rol: 'nane' }),
    nokta('B', -5, 2, 4, { rol: 'nane' }),
    nokta('C', -6.5, 6, 5, { rol: 'nane', etiket: 'tepe' }),
    cokgen('sekil', ['A', 'B', 'C'], 6, { rol: 'nane', opaklik: 0.5, etiket: 'ABC' }),
    ...otelenmisCokgen('otelenmis', ['A', 'B', 'C'], 9, 0, 7, {
      rol: 'seftali',
      opaklik: 0.4,
      etiket: 'ötelenmiş',
    }),
    {
      ad: 'yansiyan',
      tip: 'yansima',
      etiket: 'son görüntü',
      sira: 11,
      katman: 1,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gul', opaklik: 0.4 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'otelenmis', rol: 'kaynak', sira: 0 },
        { kaynak: 'eksen', rol: 'eksen', sira: 1 },
      ],
    },
  ],
  adimlar: [
    adim(1, 'Başlangıç şekli', 'Yeşil üçgen ilk konumda. Mavi doğru yansıma ekseni.', ['sekil', 'eksen']),
    adim(2, 'Önce öteleme', 'Turuncu şekil, yeşilin sağa 9 birim ötelenmişi. Boyut ve yön korunuyor.', ['otelenmis']),
    adim(3, 'Sonra yansıma', 'Pembe şekil, turuncunun eksene göre yansıması. İki dönüşümün bileşkesi bu.', ['yansiyan']),
    adim(4, 'Sıra önemli mi?', 'Önce yansıtıp sonra ötelemek farklı bir sonuç verirdi. Şekli sürükleyip bileşkenin nasıl davrandığını inceleyin.', ['sekil', 'yansiyan']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's8-ucgen-esitsizligi',
    sahneSlug: 'ucgen-esitsizligi-cubuklar',
    baslik: 'Çadır direği seçerken',
    hikaye:
      'Üç direkle üçgen bir çadır iskeleti kurulacaksa her üçlü işe yaramaz. İki kısa direğin toplamı uzun olandan büyük değilse direkler birleşemez. Marangozlar ve kamp malzemesi üreticileri bu koşulu kural olarak bilir: 3, 4 ve 8 metrelik direklerle üçgen kurulamaz.',
    soru: '5 ve 7 metrelik iki direğiniz varsa üçüncü direk hangi aralıkta olabilir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.8.3.2 — üçgen eşitsizliği',
    yasAraligi: '13-15',
  },
  {
    konuSlug: 's8-ucgenlerde-benzerlik',
    sahneSlug: 'benzerlik-golge-boyu',
    baslik: 'Gölgeyle ağaç boyu ölçmek',
    hikaye:
      'Thales’in piramitlerin yüksekliğini gölgeyle ölçtüğü anlatılır. Yöntem basittir: bilinen boyda bir çubuk dikilir, aynı anda iki gölge ölçülür. Güneş ışınları paralel geldiği için iki üçgen benzerdir ve oran kurulabilir. Ormancılar bugün de hızlı tahmin için bu yöntemi kullanır.',
    soru: '1 metrelik çubuğun gölgesi 2 metre, ağacın gölgesi 14 metre ise ağaç kaç metredir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.8.3.4 — üçgenlerde benzerlik',
    yasAraligi: '13-15',
  },
  {
    konuSlug: 's8-pisagor-bagintisi',
    sahneSlug: 'merdiven-pisagor',
    baslik: 'Merdiveni ne kadar açmalı',
    hikaye:
      'İtfaiye ve inşaat kurallarında merdivenin duvara uzaklığı, boyunun yaklaşık dörtte biri olmalıdır. Bu oran hem kaymayı önler hem yeterli yüksekliğe ulaştırır. Hesap doğrudan Pisagor bağıntısıyla yapılır: 4 metrelik merdiven duvardan 1 metre uzaktayken yaklaşık 3,87 metre yüksekliğe erişir.',
    soru: '5 metrelik merdiven duvardan 3 metre uzaktaysa kaç metre yüksekliğe ulaşır?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.8.3.5 — Pisagor bağıntısı',
    yasAraligi: '13-15',
  },
  {
    konuSlug: 's8-silindirin-yuzey-alani',
    sahneSlug: 'konserve-silindir-yuzey',
    baslik: 'Konserve kutusunun tenekesi',
    hikaye:
      'Konserve üreticisi aynı hacimde kutuyu en az teneke ile yapmak ister. Yarıçap ile yükseklik arasındaki oran değiştikçe yüzey alanı değişir; en az malzeme, yüksekliğin çapa eşit olduğu kutuda harcanır. Rafta gördüğünüz kutuların oranı bu yüzden birbirine benzer.',
    soru: 'Yarıçapı 3, yüksekliği 10 santimetre olan kutunun yan yüz alanı kaç santimetrekaredir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 santimetredir.',
    kaynak: 'MEB kazanımı MAT.8.4.2 — dik dairesel silindirin yüzey alanı',
    yasAraligi: '13-15',
  },
  {
    konuSlug: 's8-silindirin-hacmi',
    sahneSlug: 'silindir-hacim-su-bardagi',
    baslik: 'Bardak ve sürahi',
    hikaye:
      'İki bardaktan biri diğerinin iki katı yükseklikte, öbürü iki katı çapta olsun. Yüksek olan iki kat, geniş olan dört kat su alır. Çünkü hacim yarıçapın karesiyle, yüksekliğin ise doğrudan kendisiyle orantılıdır. Sürahi tasarımlarında bu yüzden genişlik yükseklikten daha etkilidir.',
    soru: 'Yarıçapı 4, yüksekliği 10 santimetre olan bardak kaç mililitre alır? (π yerine 3 alın.)',
    olcekAciklama: '1 santimetreküp 1 mililitredir.',
    kaynak: 'MEB kazanımı MAT.8.4.3 — dik dairesel silindirin hacmi',
    yasAraligi: '13-15',
  },
  {
    konuSlug: 's8-oteleme-donusumu',
    sahneSlug: 'kilim-deseni-oteleme',
    baslik: 'Anadolu kiliminde tekrar',
    hikaye:
      'Anadolu kilimlerinde motifler rastgele dizilmez: bir motif belirli bir adımla tekrar tekrar ötelenir. Dokuyucu tek bir motifi ezberler, gerisini sayarak tekrarlar. Aynı mantık duvar kâğıdı ve fayans desenlerinde de geçerlidir; matematikte buna öteleme simetrisi denir.',
    soru: 'Motif her seferinde 5 birim sağa ötelenirse dördüncü kopya başlangıçtan kaç birim uzakta olur?',
    olcekAciklama: 'Izgaradaki 1 birim, kilimde yaklaşık 5 santimetredir.',
    kaynak: 'MEB kazanımı MAT.8.5.1 — öteleme dönüşümü',
    yasAraligi: '13-15',
  },
]

const SORULAR = [
  {
    konuSlug: 's8-ucgende-aci-kenar-iliskisi',
    sahneSlug: 'ucgende-aci-kenar-iliskisi',
    tip: 'coktan_secmeli',
    govde: 'Bir üçgende en uzun kenar hangisidir?',
    secenekler: [
      'En küçük açının karşısındaki',
      'En büyük açının karşısındaki',
      'Her zaman tabandaki',
      'Açılarla ilgisi yoktur',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Sahnede renkleri eşleştirin.',
    cozum: 'Büyük açının karşısında büyük kenar bulunur; sıralama her üçgende korunur.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's8-ucgen-esitsizligi',
    tip: 'acik_uclu',
    govde: '5 ve 7 metrelik iki direğiniz var. Üçüncü direk hangi aralıkta olabilir?',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Üçüncü direk 7 − 5 = 2 metreden büyük, 7 + 5 = 12 metreden küçük olmalı. Yani 2 ile 12 metre arasında.',
      anahtarlar: ['2', '12', 'arasında'],
    },
    ipucu: 'İki kenarın toplamı ve farkı sınırları verir.',
    cozum:
      'Üçgen eşitsizliğine göre üçüncü kenar, diğer ikisinin farkından büyük ve toplamından küçük olmalıdır: 2 < x < 12.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's8-ucgenlerde-eslik',
    tip: 'dogru_yanlis',
    govde: 'Üç kenar uzunluğu verilen bir üçgen tek biçimde çizilebilir.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Üç çubuğu birleştirmenin kaç farklı yolu var?',
    cozum:
      'Kenar-kenar-kenar eşliği: üç kenar verildiğinde üçgen tek biçimde belirlenir. Bu yüzden üçgen sağlam bir yapıdır ve inşaatta kullanılır.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's8-ucgenlerde-benzerlik',
    sahneSlug: 'benzerlik-golge-boyu',
    tip: 'sayisal',
    govde:
      '1 metrelik çubuğun gölgesi 2 metre, aynı anda ağacın gölgesi 14 metre. Ağaç kaç metredir?',
    cevap: { tip: 'sayisal', deger: 7, tolerans: 0, birim: 'metre' },
    ipucu: 'Boy bölü gölge oranı ikisinde de aynı.',
    cozum: '1/2 = x/14 → x = 7 metre.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's8-pisagor-bagintisi',
    sahneSlug: 'merdiven-pisagor',
    tip: 'sayisal',
    govde: '5 metrelik merdiven duvardan 3 metre uzaktaysa kaç metre yüksekliğe ulaşır?',
    cevap: { tip: 'sayisal', deger: 4, tolerans: 0, birim: 'metre' },
    ipucu: 'Merdiven hipotenüs.',
    cozum: '3² + h² = 5² → 9 + h² = 25 → h² = 16 → h = 4 metre.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's8-ucgen-problemleri',
    sahneSlug: 'cati-makasi-ucgen-problem',
    tip: 'sayisal',
    govde: 'Tabanı 12, yüksekliği 5 birim olan üçgenin alanı kaç birim karedir?',
    cevap: { tip: 'sayisal', deger: 30, tolerans: 0, birim: 'birim kare' },
    ipucu: 'Taban çarpı yükseklik bölü iki.',
    cozum: '(12 × 5) ÷ 2 = 30 birim kare.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's8-cisimlerin-yuzey-acinimlari',
    sahneSlug: 'silindir-koni-acinim',
    tip: 'coktan_secmeli',
    govde: 'Bir silindirin yan yüzü açıldığında hangi şekil çıkar?',
    secenekler: ['Üçgen', 'Daire', 'Dikdörtgen', 'Yamuk'],
    cevap: { tip: 'coktan_secmeli', dogru: 2 },
    ipucu: 'Konserve kutusunun etiketini düşünün.',
    cozum:
      'Yan yüz dikdörtgendir. Bir kenarı silindirin yüksekliği, diğeri taban çemberinin uzunluğudur.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's8-silindirin-yuzey-alani',
    tip: 'sayisal',
    govde:
      'Yarıçapı 3, yüksekliği 10 santimetre olan silindirin yan yüz alanı kaçtır? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 180, tolerans: 1, birim: 'santimetrekare' },
    ipucu: 'Yan yüz = taban çevresi × yükseklik.',
    cozum: 'Taban çevresi 2 × 3 × 3 = 18. Yan yüz 18 × 10 = 180 santimetrekare.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's8-silindirin-hacmi',
    sahneSlug: 'silindir-hacim-su-bardagi',
    tip: 'sayisal',
    govde: 'Yarıçapı 4, yüksekliği 10 santimetre olan bardak kaç mililitre alır? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 480, tolerans: 5, birim: 'mililitre' },
    ipucu: 'Taban alanı × yükseklik. 1 santimetreküp = 1 mililitre.',
    cozum: 'Taban alanı 3 × 4 × 4 = 48. Hacim 48 × 10 = 480 santimetreküp = 480 mililitre.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's8-oteleme-donusumu',
    tip: 'dogru_yanlis',
    govde: 'Öteleme dönüşümünde şeklin açıları ve kenar uzunlukları değişmez.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Kilim motifinin kopyaları aslından farklı görünüyor mu?',
    cozum:
      'Öteleme şekli olduğu gibi kaydırır; uzunluklar, açılar ve yönelim korunur. Yalnızca konum değişir.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's8-koordinat-sisteminde-oteleme',
    sahneSlug: 'koordinatta-oteleme',
    tip: 'sayisal',
    govde:
      'A(−7, −3) noktası sağa 6, yukarı 3 birim ötelenirse görüntüsünün apsisi kaç olur?',
    cevap: { tip: 'sayisal', deger: -1, tolerans: 0 },
    ipucu: 'Apsis x koordinatıdır; sağa öteleme onu artırır.',
    cozum: '−7 + 6 = −1. Ordinat ise −3 + 3 = 0 olur.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's8-donusum-problemleri',
    sahneSlug: 'donusum-oteleme-yansima',
    tip: 'insa_gorevi',
    govde:
      'Serbest tuvalde bir üçgen çizin, bir doğru çizin ve üçgenin o doğruya göre yansımasını alın.',
    cevap: { tip: 'insa_gorevi', beklenen: { polygon: 1, line: 1, reflection: 1 } },
    ipucu: 'Çokgen, sonra Doğru, sonra Yansıma aracını kullanın.',
    cozum:
      'Yansıma aracı önce yansıtılacak nesneyi, sonra ekseni ister. Sonuç aynı büyüklükte ama ters yönelimli bir üçgendir.',
    zorluk: 4,
    puan: 3,
  },
]

console.log('8. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [
    ACI_KENAR,
    ESITSIZLIK,
    ESLIK,
    BENZERLIK,
    PISAGOR,
    UCGEN_PROBLEM,
    ACINIM8,
    SILINDIR_ALAN,
    SILINDIR_HACIM,
    OTELEME_SAHNE,
    KOORDINAT_OTELEME,
    DONUSUM_PROBLEM,
  ],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n8. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 8)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
