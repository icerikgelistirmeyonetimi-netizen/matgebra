/**
 * 12. sinif geometri dilimi - alti konu, sekiz sahne.
 *
 * Kati cisimler iki boyutlu tahtada acinim ve kesit uzerinden anlatiliyor;
 * kagit uzerinde de boyle ogretiliyor. Uc boyutlu goruntu yerine olcuye
 * dayali iliskiler kuruluyor: taban alani, ana dogru, yay uzunlugu.
 *
 * Calistir: npm run icerik-s12 -w @matgebra/mcp
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
  donme,
  izdusum,
  karsi,
  nokta,
  olcumKaynakli,
  oran,
  surgu,
  teget,
  uret,
  uzunluk,
  yayDilim,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-s12')

/* --------------------------------------------------------------- sahneler */

const ELEMANLAR = {
  slug: 'cemberin-elemanlari',
  konuSlug: 's12-cemberin-elemanlari',
  tur: 'kesif',
  baslik: 'Çemberin elemanları',
  ozet:
    'Yarıçap, çap, kiriş, yay, teğet ve kesen aynı çember üzerinde. Hepsini sürükleyip aralarındaki farkı görün.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 9, 11, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'O (merkez)' }),
    nokta('A', 6, 0, 1, { rol: 'nane', etiket: 'A' }),
    cember('cember', 'O', 2, { uzerinde: 'A', rol: 'gok', kalinlik: 3 }),
    karsi('Aters', 'O', 'A', 3, { rol: 'nane', etiket: "A'" }),
    cizgi('cap', 'dogru_parcasi', 'A', 'Aters', 4, { rol: 'nane', kalinlik: 4 }),
    cizgi('yaricap', 'dogru_parcasi', 'O', 'A', 5, { rol: 'gul', kalinlik: 5 }),
    oran('capOrani', 'cap', 'yaricap', 6, { rol: 'gul', etiket: 'çap / yarıçap', dy: 0.9 }),
    surgu('B', 'cember', -4.5, 4, 7, { rol: 'seftali', etiket: 'B' }),
    surgu('C', 'cember', 2, 5.6, 8, { rol: 'seftali', etiket: 'C' }),
    cizgi('kiris', 'dogru_parcasi', 'B', 'C', 9, { rol: 'seftali', kalinlik: 4 }),
    yayDilim('yayBC', 'yay', 'O', 'B', 'C', 10, { rol: 'tereyagi', kalinlik: 5, opaklik: 0 }),
    cizgi('kesen', 'dogru', 'B', 'C', 11, { rol: 'notr', kalinlik: 1, cizgiTipi: 'kesik' }),
    surgu('T', 'cember', 0, -6, 12, { rol: 'lavanta', etiket: 'T (değme noktası)' }),
    teget('tegetDogru', 13, { uzerinde: 'T', rol: 'lavanta', kalinlik: 3 }),
    uzunluk('rOlcu', 'O', 'A', 14, { rol: 'gul', etiket: 'yarıçap' }),
    uzunluk('capOlcu', 'A', 'Aters', 15, { rol: 'nane', etiket: 'çap' }),
    uzunluk('kirisOlcu', 'B', 'C', 16, { rol: 'seftali', etiket: 'kiriş' }),
  ],
  adimlar: [
    adim(1, 'Merkez ve yarıçap', 'Çemberin bütün noktaları merkeze eşit uzaklıkta. Bu uzaklık yarıçaptır.', ['O', 'yaricap', 'rOlcu']),
    adim(2, 'Çap yarıçapın iki katı', 'Merkezden geçen kiriş çaptır. Ekrandaki oran her zaman 2 çıkıyor.', ['cap', 'capOrani']),
    adim(3, 'Kiriş, yay, kesen', 'B ile C’yi birleştiren parça kiriş; çember üzerindeki kısım yay; kirişin uzatılmışı kesendir. B ve C’yi çember üzerinde kaydırın.', ['kiris', 'yayBC', 'kesen']),
    adim(4, 'Teğet bir noktada dokunur', 'Mor doğru çembere yalnız T noktasında değiyor. Kesen iki noktada keser, teğet tek noktada dokunur.', ['tegetDogru', 'T', 'kesen']),
  ],
}

const CEVRE_ACI = {
  slug: 'merkez-aci-ve-cevre-aci',
  konuSlug: 's12-cemberde-aci-kiris-ve-teget',
  tur: 'kesif',
  baslik: 'Aynı yayı gören çevre açı, merkez açının yarısıdır',
  ozet:
    'A noktasını yay üzerinde nereye taşırsanız taşıyın çevre açı değişmiyor ve her zaman merkez açının tam yarısı kalıyor.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 9, 9, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'O' }),
    nokta('B', -5.196, -3, 1, { surukleme: 'yok', rol: 'seftali', etiket: 'B' }),
    cember('cember', 'O', 2, { uzerinde: 'B', rol: 'gok', kalinlik: 2, cizgiTipi: 'kesik' }),
    // C icin dar bir yay: siralama bozulmasin diye alt-sag bolgede tutuluyor.
    nokta('D270', 0, -6, 3, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('D30', 5.196, 3, 4, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    yayDilim('CYolu', 'yay', 'O', 'D270', 'D30', 5, { rol: 'notr', kalinlik: 1, opaklik: 0 }),
    surgu('C', 'CYolu', 5.196, -3, 6, { rol: 'seftali', etiket: 'C' }),
    // A'nin yolu: C'den B'ye saat yonunun tersine giden buyuk yay. Iki uc
    // 20'ser derece iceri cekildi; yoksa A tam B ya da C'ye oturdugunda
    // aci tanimsizlasip sacma bir sayi okunuyor.
    donme('AYolBas', 'C', 'O', 20, 7, { rol: 'notr', etiket: null, gorunur: false }),
    donme('AYolSon', 'B', 'O', -20, 8, { rol: 'notr', etiket: null, gorunur: false }),
    yayDilim('AYolu', 'yay', 'O', 'AYolBas', 'AYolSon', 9, {
      rol: 'tereyagi',
      kalinlik: 4,
      opaklik: 0,
    }),
    surgu('A', 'AYolu', 0, 6, 10, { rol: 'gul', etiket: 'A (sürükleyin)' }),
    cizgi('AB', 'dogru_parcasi', 'A', 'B', 11, { rol: 'gul', kalinlik: 2 }),
    cizgi('AC', 'dogru_parcasi', 'A', 'C', 12, { rol: 'gul', kalinlik: 2 }),
    cizgi('OB', 'dogru_parcasi', 'O', 'B', 13, { rol: 'gok', kalinlik: 2 }),
    cizgi('OC', 'dogru_parcasi', 'O', 'C', 14, { rol: 'gok', kalinlik: 2 }),
    cizgi('kirisBC', 'dogru_parcasi', 'B', 'C', 15, { rol: 'seftali', kalinlik: 3 }),
    aci('cevreAci', 'B', 'A', 'C', 16, { rol: 'gul' }),
    aci('merkezAci', 'B', 'O', 'C', 17, { rol: 'gok' }),
  ],
  adimlar: [
    adim(1, 'Bir kiriş, iki açı', 'BC kirişi hem merkezden hem de çember üzerindeki A noktasından görülüyor. Merkezdeki açı merkez açı, A’daki açı çevre açıdır.', ['kirisBC', 'merkezAci', 'cevreAci']),
    adim(2, 'A’yı gezdirin', 'A’yı sarı yay boyunca taşıyın. Şekil tamamen değişiyor ama çevre açı hiç değişmiyor.', ['A', 'cevreAci']),
    adim(3, 'Tam yarısı', 'İki ölçümü karşılaştırın: çevre açı, merkez açının tam yarısı.', ['merkezAci', 'cevreAci']),
    adim(4, 'Kirişi de değiştirin', 'C’yi kaydırıp kirişi büyütün ya da küçültün. İki açı birlikte değişiyor ama yarı oranı bozulmuyor.', ['C', 'merkezAci', 'cevreAci']),
  ],
}

const TEGET = {
  slug: 'teget-kesen-ve-uzaklik',
  konuSlug: 's12-cemberde-aci-kiris-ve-teget',
  tur: 'kesif',
  baslik: 'Teğet: merkeze uzaklığı tam yarıçap kadar',
  ozet:
    'Bir doğrunun çemberle ilişkisini belirleyen tek şey, merkeze olan uzaklığıdır: yarıçaptan küçükse keser, eşitse teğet olur, büyükse hiç dokunmaz.',
  zorluk: 5,
  sira: 2,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 9, 11, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'O' }),
    nokta('R', 6, 0, 1, { rol: 'nane', etiket: 'yarıçap ucu' }),
    cember('cember', 'O', 2, { uzerinde: 'R', rol: 'gok', kalinlik: 3 }),
    uzunluk('rOlcu', 'O', 'R', 3, { rol: 'nane', etiket: 'yarıçap' }),
    // Teget: cember uzerindeki surgude
    surgu('T', 'cember', -3, -5.2, 4, { rol: 'lavanta', etiket: 'T' }),
    teget('tegetDogru', 5, { uzerinde: 'T', rol: 'lavanta', kalinlik: 3 }),
    izdusum('Ayak1', 'O', 'tegetDogru', 6, { rol: 'lavanta', etiket: null }),
    cizgi('dikTeget', 'dogru_parcasi', 'O', 'Ayak1', 7, { rol: 'lavanta', kalinlik: 3 }),
    uzunluk('uzakTeget', 'O', 'Ayak1', 8, { rol: 'lavanta', etiket: 'teğete uzaklık' }),
    // Kesen: iki serbest nokta
    nokta('K1', -9, 4, 9, { rol: 'seftali', etiket: 'kesen ucu' }),
    nokta('K2', 9, 6, 10, { rol: 'seftali', etiket: null }),
    cizgi('kesen', 'dogru', 'K1', 'K2', 11, { rol: 'seftali', kalinlik: 3 }),
    izdusum('Ayak2', 'O', 'kesen', 12, { rol: 'seftali', etiket: null }),
    cizgi('dikKesen', 'dogru_parcasi', 'O', 'Ayak2', 13, { rol: 'seftali', kalinlik: 3 }),
    uzunluk('uzakKesen', 'O', 'Ayak2', 14, { rol: 'seftali', etiket: 'kesene uzaklık' }),
  ],
  adimlar: [
    adim(1, 'Teğet ve değme noktası', 'Mor doğru çembere T noktasında teğet. T’yi çember üzerinde kaydırın: teğet onunla birlikte dönüyor.', ['tegetDogru', 'T']),
    adim(2, 'Teğete uzaklık = yarıçap', 'Merkezden teğete inen dikmenin ayağı tam olarak T noktası. Uzunluğu da tam yarıçap kadar. Bu, teğetin değme noktasında yarıçapa dik olması demektir.', ['dikTeget', 'uzakTeget', 'rOlcu']),
    adim(3, 'Kesende uzaklık daha küçük', 'Turuncu doğru çemberi iki noktada kesiyor. Merkeze uzaklığı yarıçaptan küçük.', ['kesen', 'uzakKesen']),
    adim(4, 'Sınırı bulun', 'Kesen ucunu yukarı taşıyın: uzaklık büyüyor. Tam yarıçapa eşitlendiği anda doğru çembere teğet oluyor; geçince çemberden tamamen ayrılıyor.', ['K1', 'uzakKesen', 'rOlcu']),
  ],
}

const DILIM = {
  slug: 'pizza-dilimi-yay-ve-alan',
  konuSlug: 's12-cember-ve-daire-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Pizza dilimi: merkez açı, yay ve alan',
  ozet:
    'Dilimin açısını ve pizzanın yarıçapını değiştirin. Dilimin alanı da yayın uzunluğu da açıyla doğru orantılı büyüyor.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 10, 11, -10], { birim: 'cm' }),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'merkez' }),
    nokta('R', 8, 0, 1, { rol: 'nane', etiket: 'yarıçap ucu' }),
    cember('pizza', 'O', 2, { uzerinde: 'R', rol: 'nane', kalinlik: 3 }),
    surgu('A', 'pizza', 8, 0, 3, { rol: 'seftali', etiket: 'A' }),
    surgu('B', 'pizza', 4, 6.9, 4, { rol: 'seftali', etiket: 'B' }),
    yayDilim('dilim', 'daire_dilimi', 'O', 'A', 'B', 5, {
      rol: 'seftali',
      opaklik: 0.5,
      kalinlik: 3,
    }),
    aci('merkezAci', 'A', 'O', 'B', 6, { rol: 'tereyagi' }),
    uzunluk('yaricap', 'O', 'R', 7, { rol: 'nane', etiket: 'yarıçap' }),
    olcumKaynakli('pizzaAlan', 'olcum_alan', 'pizza', 8, { rol: 'nane', etiket: 'bütün pizza' }),
    olcumKaynakli('dilimAlan', 'olcum_alan', 'dilim', 9, { rol: 'gul', etiket: 'dilim' }),
    olcumKaynakli('pizzaCevre', 'olcum_cevre', 'pizza', 10, { rol: 'gok', etiket: 'çevre' }),
  ],
  adimlar: [
    adim(1, 'Dilimi açın', 'A ve B noktalarını çember üzerinde kaydırıp dilimin merkez açısını değiştirin.', ['A', 'B', 'merkezAci']),
    adim(2, 'Alan açıyla orantılı', 'Dilimin alanını bütün pizzanın alanına bölün: çıkan oran, merkez açının 360’a oranıyla aynı. Açıyı iki katına çıkarın, alan da iki katına çıksın.', ['dilimAlan', 'pizzaAlan', 'merkezAci']),
    adim(3, 'Yay da öyle', 'Dilimin yay uzunluğu, çemberin çevresinin aynı oranı kadardır: çevre çarpı açı bölü 360.', ['pizzaCevre', 'merkezAci']),
    adim(4, 'Yarıçapı büyütün', 'Yarıçap iki katına çıkınca çevre iki katına, alan dört katına çıkıyor. Bu yüzden çapı iki kat pizza dört kişilik olur.', ['R', 'pizzaCevre', 'pizzaAlan']),
  ],
}

const PRIZMA = {
  slug: 'prizma-hacmi-taban-alani',
  konuSlug: 's12-dik-prizma-ve-silindir',
  tur: 'kesif',
  baslik: 'Hacim: taban alanı çarpı yükseklik',
  ozet:
    'Prizmanın da silindirin de hacmi aynı kuralla bulunur, çünkü ikisinde de kesit yukarı çıkarken değişmiyor. Tabanı ve yüksekliği ayrı ayrı değiştirip etkilerini karşılaştırın.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-12, 9, 12, -9], { birim: 'cm' }),
  nesneler: [
    // Cokgen tabanli prizma
    nokta('T1', -10, -5, 0, { rol: 'nane', etiket: null }),
    nokta('T2', -3, -5, 1, { rol: 'nane', etiket: null }),
    nokta('T3', -3, 1, 2, { rol: 'nane', etiket: 'taban köşesi' }),
    nokta('T4', -8, 3, 3, { rol: 'nane', etiket: null }),
    cokgen('taban', ['T1', 'T2', 'T3', 'T4'], 4, {
      rol: 'nane',
      opaklik: 0.5,
      etiket: 'prizma tabanı',
    }),
    olcumKaynakli('tabanAlan', 'olcum_alan', 'taban', 5, { rol: 'nane' }),
    // Silindir tabani
    nokta('M', 5, -1, 6, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('Mr', 9, -1, 7, { rol: 'gok', etiket: 'silindir yarıçapı' }),
    cember('daire', 'M', 8, { uzerinde: 'Mr', rol: 'gok', kalinlik: 3 }),
    olcumKaynakli('daireAlan', 'olcum_alan', 'daire', 9, { rol: 'gok' }),
    // Ortak yukseklik
    nokta('Y1', 11, -8, 10, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('Yust', 11, 9, 11, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('yEkseni', 'dogru', 'Y1', 'Yust', 12, { rol: 'notr', gorunur: false }),
    surgu('Y2', 'yEkseni', 11, 3, 13, { rol: 'gul', etiket: 'yükseklik' }),
    cizgi('yukseklik', 'dogru_parcasi', 'Y1', 'Y2', 14, { rol: 'gul', kalinlik: 5 }),
    uzunluk('yukOlcu', 'Y1', 'Y2', 15, { rol: 'gul', etiket: 'yükseklik' }),
  ],
  adimlar: [
    adim(1, 'İki farklı taban', 'Solda dörtgen bir prizma tabanı, sağda silindirin daire tabanı. Şekilleri farklı ama kural aynı.', ['taban', 'daire']),
    adim(2, 'Taban alanı', 'Her iki tabanın alanı ekranda. Köşeleri ve yarıçapı sürükleyip değiştirin.', ['tabanAlan', 'daireAlan']),
    adim(3, 'Yükseklikle çarpın', 'Hacim = taban alanı × yükseklik. Pembe çubuk yüksekliği temsil ediyor; yukarı çekince hacim doğru orantılı büyür.', ['yukseklik', 'yukOlcu']),
    adim(4, 'Neden aynı kural?', 'Dik prizmada da silindirde de kesit yukarı çıkarken hiç değişmez. Aynı kesit üst üste yığılınca hacim, kesit alanı çarpı yükseklik olur.', ['taban', 'daire', 'yukOlcu']),
  ],
}

const KONI = {
  slug: 'koni-acinimi',
  konuSlug: 's12-piramit-koni-ve-kure',
  tur: 'kesif',
  baslik: 'Koniyi açınca: bir daire ve bir dilim',
  ozet:
    'Külahı keserek düzleştirin: taban dairesi ve bir daire dilimi çıkar. Dilimin yayı tam olarak taban çemberinin uzunluğu kadar olmalı, yoksa külah kapanmaz.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-13, 10, 13, -10], { birim: 'cm' }),
  nesneler: [
    // Taban dairesi
    nokta('M', -8, 3, 0, { surukleme: 'yok', rol: 'notr', etiket: 'taban merkezi' }),
    nokta('Mr', -5, 3, 1, { rol: 'gok', etiket: 'r' }),
    cember('taban', 'M', 2, { uzerinde: 'Mr', rol: 'gok', kalinlik: 3 }),
    uzunluk('rOlcu', 'M', 'Mr', 3, { rol: 'gok', etiket: 'taban yarıçapı r' }),
    olcumKaynakli('tabanCevre', 'olcum_cevre', 'taban', 4, { rol: 'gok' }),
    // Yan yuz: daire dilimi. Yaricapi ana dogru (l).
    nokta('S', 4, -2, 5, { surukleme: 'yok', rol: 'notr', etiket: 'külah ucu' }),
    nokta('L', 12, -2, 6, { rol: 'seftali', etiket: 'l (ana doğru)' }),
    cember('yanCember', 'S', 7, {
      uzerinde: 'L',
      rol: 'notr',
      kalinlik: 1,
      cizgiTipi: 'noktali',
    }),
    surgu('P1', 'yanCember', 12, -2, 8, { rol: 'seftali', etiket: null }),
    surgu('P2', 'yanCember', 6, 5.5, 9, { rol: 'seftali', etiket: null }),
    yayDilim('yanYuz', 'daire_dilimi', 'S', 'P1', 'P2', 10, {
      rol: 'seftali',
      opaklik: 0.5,
      kalinlik: 3,
    }),
    aci('dilimAcisi', 'P1', 'S', 'P2', 11, { rol: 'tereyagi' }),
    uzunluk('lOlcu', 'S', 'L', 12, { rol: 'seftali', etiket: 'ana doğru l' }),
    olcumKaynakli('yanAlan', 'olcum_alan', 'yanYuz', 13, { rol: 'gul', etiket: 'yan yüz alanı' }),
  ],
  adimlar: [
    adim(1, 'İki parça', 'Koninin yüzeyi iki parçadan oluşur: mavi taban dairesi ve turuncu daire dilimi (yan yüz).', ['taban', 'yanYuz']),
    adim(2, 'Ana doğru dilimin yarıçapıdır', 'Külahın tepesinden taban kenarına olan uzaklık — ana doğru l — açıldığında dilimin yarıçapı olur.', ['lOlcu', 'yanYuz']),
    adim(3, 'Yay, taban çevresine eşit olmalı', 'Dilim kıvrılıp külah olacaksa yayının uzunluğu tam olarak taban çemberinin uzunluğuna eşit olmalı. Mavi ölçüm o hedefi gösteriyor.', ['tabanCevre', 'dilimAcisi']),
    adim(4, 'Gerekli açı', 'Yay uzunluğu l × açı × π / 180’dir. Bunu 2πr’ye eşitleyince açı = 360 × r / l çıkar. r ve l ölçümlerini kullanıp doğru açıyı hesaplayın ve dilimi oraya getirin.', ['rOlcu', 'lOlcu', 'dilimAcisi']),
  ],
}

const DEPO = {
  slug: 'su-deposu-yuzey-hacim',
  konuSlug: 's12-yuzey-alani-ve-hacim-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Su deposu: hacim mi yüzey mi büyüyor?',
  ozet:
    'Deponun boyutlarını değiştirin. Bütün kenarlar iki katına çıkarsa yüzey dört, hacim sekiz katına çıkar — büyük depoların ısıyı daha iyi tutmasının sebebi bu.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-12, 9, 12, -9], { birim: 'metre' }),
  nesneler: [
    nokta('T1', -10, -6, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('T3', -2, 0, 1, { rol: 'nane', etiket: 'taban köşesi' }),
    bilesen('T2', 'T3', 'T1', 2, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('T4', 'T1', 'T3', 3, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('taban', ['T1', 'T2', 'T3', 'T4'], 4, {
      rol: 'nane',
      opaklik: 0.45,
      etiket: 'depo tabanı',
    }),
    uzunluk('en', 'T1', 'T2', 5, { rol: 'nane', etiket: 'en' }),
    uzunluk('boy', 'T2', 'T3', 6, { rol: 'nane', etiket: 'boy' }),
    olcumKaynakli('tabanAlan', 'olcum_alan', 'taban', 7, { rol: 'nane' }),
    olcumKaynakli('tabanCevre', 'olcum_cevre', 'taban', 8, { rol: 'lavanta' }),
    nokta('Y1', 6, -6, 9, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('Yust', 6, 9, 10, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('yEkseni', 'dogru', 'Y1', 'Yust', 11, { rol: 'notr', gorunur: false }),
    surgu('Y2', 'yEkseni', 6, 0, 12, { rol: 'gul', etiket: 'derinlik' }),
    cizgi('derinlikCizgi', 'dogru_parcasi', 'Y1', 'Y2', 13, { rol: 'gul', kalinlik: 5 }),
    uzunluk('derinlik', 'Y1', 'Y2', 14, { rol: 'gul', etiket: 'derinlik' }),
  ],
  adimlar: [
    adim(1, 'Üç ölçü', 'En, boy ve derinlik. Taban köşesini sürükleyip ilk ikisini, pembe çubuğu çekip üçüncüyü değiştirin.', ['en', 'boy', 'derinlik']),
    adim(2, 'Hacim', 'Hacim = taban alanı × derinlik. Metreküp cinsinden çıkan sayıyı 1000 ile çarpınca litre olur.', ['tabanAlan', 'derinlik']),
    adim(3, 'Yüzey alanı', 'Yüzey alanı = 2 × taban alanı + taban çevresi × derinlik. Mor ölçüm taban çevresini veriyor.', ['tabanAlan', 'tabanCevre', 'derinlik']),
    adim(4, 'Kare-küp kuralı', 'Bütün ölçüleri iki katına çıkarın: yüzey dört, hacim sekiz katına çıkar. Bu yüzden büyük depolar hacimlerine göre daha az yüzeye sahiptir ve suyu daha uzun süre sıcak tutar.', ['tabanAlan', 'derinlik']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's12-cemberde-aci-kiris-ve-teget',
    sahneSlug: 'teget-kesen-ve-uzaklik',
    baslik: 'Kayış, kasnak ve tren rayı',
    hikaye:
      'Bir V kayışı kasnağa teğet olarak girer ve çıkar; temas noktasında kayış, kasnağın yarıçapına diktir. Aynı ilke demiryolu virajlarında da kullanılır: düz ray yayla birleşirken teğet olmalı, yoksa tekerlek ani bir yön değişimine zorlanır ve vagon sarsılır. Bu yüzden modern raylarda düz kısımla yay arasına yumuşak bir geçiş eğrisi konur.',
    soru: 'Yarıçapı 25 santimetre olan kasnağa teğet bir doğrunun merkeze uzaklığı kaç santimetredir?',
    olcekAciklama: 'Izgaradaki 1 birim 5 santimetredir.',
    kaynak: 'MEB kazanımı MAT.12.3.2 — çemberde teğet',
    yasAraligi: '17-19',
  },
  {
    konuSlug: 's12-cember-ve-daire-problemleri',
    sahneSlug: 'pizza-dilimi-yay-ve-alan',
    baslik: 'Çapı iki kat pizza dört kişiliktir',
    hikaye:
      'Otuz santimetrelik pizza on beş santimetreliğin iki katı değil, dört katı büyüklüktedir; çünkü alan yarıçapın karesiyle artar. Aynı hesap dairesel sulama sistemlerinde de geçerli: pivot kolunun boyu iki katına çıkınca sulanan alan dört katına çıkar. Fiyat karşılaştırırken çapa değil çapın karesine bakmak gerekir.',
    soru: 'Yarıçapı 20 santimetre olan pizzanın 90 derecelik diliminin alanı kaç santimetrekaredir? (π yerine 3 alın.)',
    olcekAciklama: 'Izgaradaki 1 birim 2 santimetredir.',
    kaynak: 'MEB kazanımı MAT.12.3.3 — daire diliminin alanı',
    yasAraligi: '17-19',
  },
  {
    konuSlug: 's12-yuzey-alani-ve-hacim-problemleri',
    sahneSlug: 'su-deposu-yuzey-hacim',
    baslik: 'Neden büyük çaydanlık geç soğur',
    hikaye:
      'Bir cismin bütün ölçüleri k katına çıkarsa yüzeyi k², hacmi k³ katına çıkar. Isı yüzeyden kaybolduğu, hacimde depolandığı için büyük kaplar hacimlerine oranla daha az yüzeye sahiptir ve geç soğur. Aynı kural fillerin kulağının neden büyük, küçük kuşların neden sürekli yemek yediğinin de açıklamasıdır.',
    soru: 'En, boy ve derinliği 2 katına çıkarılan bir deponun hacmi kaç katına çıkar?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir; 1 metreküp 1000 litredir.',
    kaynak: 'MEB kazanımı MAT.12.4.3 — yüzey alanı ve hacim problemleri',
    yasAraligi: '17-19',
  },
]

const SORULAR = [
  {
    konuSlug: 's12-cemberin-elemanlari',
    sahneSlug: 'cemberin-elemanlari',
    tip: 'coktan_secmeli',
    govde: 'Çemberin en uzun kirişi hangisidir?',
    secenekler: ['Yarıçap', 'Çap', 'Teğet', 'Yay'],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Merkezden geçen kiriş hangisi?',
    cozum:
      'Çap, merkezden geçen kiriştir ve en uzun kiriştir. Yarıçap kiriş değildir (bir ucu merkezdedir), teğet çemberi kesmez, yay ise doğru parçası değildir.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's12-cemberin-elemanlari',
    tip: 'dogru_yanlis',
    govde: 'Bir çemberin çapı, yarıçapının her zaman iki katıdır.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Sahnedeki oran ölçümü ne gösteriyor?',
    cozum: 'Çap merkezden geçtiği için iki yarıçaptan oluşur; oran her zaman tam 2’dir.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's12-cemberde-aci-kiris-ve-teget',
    sahneSlug: 'merkez-aci-ve-cevre-aci',
    tip: 'sayisal',
    govde: 'Bir yayı gören merkez açı 110 derece ise aynı yayı gören çevre açı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 55, tolerans: 0, birim: 'derece' },
    ipucu: 'Çevre açı, merkez açının yarısıdır.',
    cozum: '110 ÷ 2 = 55 derece.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's12-cemberde-aci-kiris-ve-teget',
    sahneSlug: 'merkez-aci-ve-cevre-aci',
    tip: 'dogru_yanlis',
    govde:
      'Aynı yayı gören iki farklı çevre açının ölçüleri farklı olabilir.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'Sahnede A’yı yay boyunca gezdirin.',
    cozum:
      'Aynı yayı gören bütün çevre açılar eşittir; hepsi merkez açının yarısına eşittir. A noktası yay üzerinde nereye giderse gitsin ölçüm değişmez.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's12-cemberde-aci-kiris-ve-teget',
    sahneSlug: 'teget-kesen-ve-uzaklik',
    tip: 'sayisal',
    govde: 'Yarıçapı 25 santimetre olan çembere teğet bir doğrunun merkeze uzaklığı kaç santimetredir?',
    cevap: { tip: 'sayisal', deger: 25, tolerans: 0, birim: 'santimetre' },
    ipucu: 'Teğet, değme noktasında yarıçapa diktir.',
    cozum:
      'Merkezden teğete inen dikmenin ayağı değme noktasıdır; uzunluğu da yarıçaptır: 25 santimetre.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's12-cember-ve-daire-problemleri',
    sahneSlug: 'pizza-dilimi-yay-ve-alan',
    tip: 'sayisal',
    govde:
      'Yarıçapı 20 santimetre olan dairenin 90 derecelik diliminin alanı kaç santimetrekaredir? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 300, tolerans: 1, birim: 'santimetrekare' },
    ipucu: 'Önce bütün dairenin alanı, sonra 90/360 kadarı.',
    cozum: 'Bütün alan 3 × 20 × 20 = 1200. Dilim 1200 × (90 ÷ 360) = 300 santimetrekare.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's12-cember-ve-daire-problemleri',
    tip: 'sayisal',
    govde:
      'Yarıçapı 12 santimetre olan dairede 60 derecelik yayın uzunluğu kaç santimetredir? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 12, tolerans: 0.5, birim: 'santimetre' },
    ipucu: 'Çevrenin 60/360’ı.',
    cozum: 'Çevre 2 × 3 × 12 = 72. Yay 72 × (60 ÷ 360) = 12 santimetre.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's12-dik-prizma-ve-silindir',
    sahneSlug: 'prizma-hacmi-taban-alani',
    tip: 'sayisal',
    govde:
      'Taban alanı 24 santimetrekare, yüksekliği 9 santimetre olan dik prizmanın hacmi kaç santimetreküptür?',
    cevap: { tip: 'sayisal', deger: 216, tolerans: 0, birim: 'santimetreküp' },
    ipucu: 'Taban alanı × yükseklik.',
    cozum: '24 × 9 = 216 santimetreküp.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's12-dik-prizma-ve-silindir',
    tip: 'coktan_secmeli',
    govde: 'Dik prizma ile silindirin hacim formülünün aynı olmasının sebebi nedir?',
    secenekler: [
      'İkisinin de tabanı dairedir',
      'İkisinde de kesit yükseklik boyunca değişmez',
      'İkisinin de yüzey alanı eşittir',
      'İkisi de düzgün çokgendir',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Cismi yatay dilimlere ayırıp düşünün.',
    cozum:
      'Her iki cisimde de yatay kesit yukarı çıkarken hiç değişmez. Aynı kesit üst üste yığıldığı için hacim, kesit alanı çarpı yükseklik olur.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's12-piramit-koni-ve-kure',
    sahneSlug: 'koni-acinimi',
    tip: 'sayisal',
    govde:
      'Taban yarıçapı 5, ana doğrusu 15 santimetre olan koninin açınımındaki dilimin merkez açısı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 120, tolerans: 0, birim: 'derece' },
    ipucu: 'Açı = 360 × r / l.',
    cozum: '360 × 5 ÷ 15 = 120 derece.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's12-piramit-koni-ve-kure',
    tip: 'sayisal',
    govde:
      'Taban yarıçapı 6, yüksekliği 10 santimetre olan koninin hacmi kaç santimetreküptür? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 360, tolerans: 2, birim: 'santimetreküp' },
    ipucu: 'Koni hacmi, aynı taban ve yükseklikteki silindirin üçte biridir.',
    cozum:
      'Silindir hacmi 3 × 6 × 6 × 10 = 1080. Koni onun üçte biri: 1080 ÷ 3 = 360 santimetreküp.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's12-yuzey-alani-ve-hacim-problemleri',
    sahneSlug: 'su-deposu-yuzey-hacim',
    tip: 'sayisal',
    govde: 'Bütün ölçüleri 2 katına çıkarılan bir deponun hacmi kaç katına çıkar?',
    cevap: { tip: 'sayisal', deger: 8, tolerans: 0 },
    ipucu: 'Üç ölçü de çarpılıyor.',
    cozum: '2 × 2 × 2 = 8 katına çıkar. Yüzey alanı ise 2 × 2 = 4 katına çıkar.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's12-yuzey-alani-ve-hacim-problemleri',
    tip: 'acik_uclu',
    govde:
      'Aynı biçimde ama farklı büyüklükte iki su deposundan büyük olanı neden daha geç soğur? Yüzey ve hacim değişimini kullanarak açıklayın.',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Ölçüler k katına çıkınca yüzey k² katına, hacim k³ katına çıkıyor. Isı yüzeyden kaybolduğu, hacimde depolandığı için büyük depoda hacim başına düşen yüzey azalıyor. Bu yüzden aynı sürede oransal olarak daha az ısı kaybediyor.',
      anahtarlar: ['yüzey', 'hacim', 'kare', 'küp', 'oran'],
    },
    ipucu: 'Yüzey/hacim oranının k arttıkça ne olduğuna bakın.',
    cozum:
      'Yüzey/hacim oranı k² / k³ = 1/k ile değişir; yani cisim büyüdükçe bu oran küçülür. Isı kaybı yüzeyle orantılı, depolanan ısı hacimle orantılı olduğundan büyük cisim daha yavaş soğur.',
    zorluk: 5,
    puan: 4,
  },
]

console.log('12. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [ELEMANLAR, CEVRE_ACI, TEGET, DILIM, PRIZMA, KONI, DEPO],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n12. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 12)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
