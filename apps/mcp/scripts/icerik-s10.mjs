/**
 * 10. sinif geometri dilimi - alti konu, dokuz sahne.
 *
 * "Ucgenin yardimci elemanlari" tek sahneye sigmiyor: kenarortay,
 * aciortay ve orta dikme ayri ayri kuruldu. "Sinus ve kosinus
 * teoremleri" de iki sahne aliyor.
 *
 * Calistir: npm run icerik-s10 -w @matgebra/mcp
 */
import {
  aci,
  aciOrtay,
  adim,
  ayar,
  baglan,
  bilesen,
  cember,
  cizgi,
  cokgen,
  egim,
  homoteti,
  izdusum,
  karsi,
  kesisim,
  nokta,
  olcumKaynakli,
  oran,
  ortaDikme,
  ortaNokta,
  paralelDik,
  surgu,
  ucgenMerkezi,
  uret,
  uzunluk,
  yayDilim,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-s10')

/* --------------------------------------------------------------- sahneler */

const TRIGONOMETRI = {
  slug: 'rampa-trigonometrik-oranlar',
  konuSlug: 's10-dik-ucgende-trigonometrik-oranlar',
  tur: 'gercek_hayat',
  baslik: 'Engelli rampası: sinüs, kosinüs, tanjant',
  ozet:
    'Rampanın ucunu sürükleyin. Açı değişince üç oran da değişiyor; ama aynı açıda rampa ne kadar uzun olursa olsun oranlar aynı kalıyor.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 6, 10, -7], { birim: 'metre' }),
  nesneler: [
    nokta('A', -8, -4, 0, { surukleme: 'yok', rol: 'notr', etiket: 'rampa başı' }),
    nokta('Z', 9, -4, 1, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('zeminDogru', 'dogru', 'A', 'Z', 2, { rol: 'notr', kalinlik: 1, cizgiTipi: 'kesik' }),
    nokta('C', 4, 2, 3, { rol: 'seftali', etiket: 'rampa ucu' }),
    bilesen('B', 'C', 'A', 4, { rol: 'notr', etiket: null }),
    cokgen('ucgen', ['A', 'B', 'C'], 5, { rol: 'nane', opaklik: 0.3 }),
    cizgi('komsu', 'dogru_parcasi', 'A', 'B', 6, { rol: 'gok', kalinlik: 4 }),
    cizgi('karsi', 'dogru_parcasi', 'B', 'C', 7, { rol: 'gul', kalinlik: 4 }),
    cizgi('hipotenus', 'dogru_parcasi', 'A', 'C', 8, { rol: 'seftali', kalinlik: 4 }),
    aci('aciA', 'B', 'A', 'C', 9, { rol: 'tereyagi' }),
    aci('dikB', 'C', 'B', 'A', 10, { rol: 'notr' }),
    uzunluk('uKomsu', 'A', 'B', 11, { rol: 'gok', etiket: 'komşu' }),
    uzunluk('uKarsi', 'B', 'C', 12, { rol: 'gul', etiket: 'karşı' }),
    uzunluk('uHip', 'A', 'C', 13, { rol: 'seftali', etiket: 'hipotenüs' }),
    oran('sinus', 'karsi', 'hipotenus', 14, { rol: 'gul', etiket: 'sin A', dy: 1.4 }),
    oran('kosinus', 'komsu', 'hipotenus', 15, { rol: 'gok', etiket: 'cos A', dy: -0.9 }),
    oran('tanjant', 'karsi', 'komsu', 16, { rol: 'lavanta', etiket: 'tan A', dy: 2.5 }),
  ],
  adimlar: [
    adim(1, 'Üç kenarın üç adı var', 'Açıya göre adlandırılır: karşı kenar açının tam karşısında, komşu kenar açının yanında, hipotenüs dik açının karşısında.', ['komsu', 'karsi', 'hipotenus']),
    adim(2, 'Üç oran', 'sin A = karşı/hipotenüs, cos A = komşu/hipotenüs, tan A = karşı/komşu. Üçü de ekranda canlı hesaplanıyor.', ['sinus', 'kosinus', 'tanjant']),
    adim(3, 'Oran açıya bağlıdır, boya değil', 'Rampa ucunu aynı doğrultuda uzağa taşıyın: kenarlar uzuyor ama üç oran da değişmiyor. Oranları belirleyen tek şey açı.', ['aciA', 'sinus', 'kosinus', 'tanjant']),
    adim(4, 'Rampa eğimi', 'İnşaat yönetmeliğinde rampa eğimi yüzdeyle verilir; bu tam olarak tanjantın yüzde karşılığıdır. %8 eğim, tan A = 0,08 demektir.', ['tanjant']),
  ],
}

const KENARORTAY = {
  slug: 'kenarortay-ve-agirlik-merkezi',
  konuSlug: 's10-ucgenin-yardimci-elemanlari',
  tur: 'kesif',
  baslik: 'Kenarortaylar ve ağırlık merkezi',
  ozet:
    'Her köşeyi karşı kenarın orta noktasına bağlayın. Üç doğru tek noktada kesişir ve bu nokta her kenarortayı 2’ye 1 oranında böler.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 9, 10, -7]),
  nesneler: [
    nokta('A', -7, -4, 0, { rol: 'lavanta' }),
    nokta('B', 7, -4, 1, { rol: 'lavanta' }),
    nokta('C', -1, 6, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.3 }),
    ortaNokta('Ma', 'B', 'C', 4, { rol: 'gok', etiket: 'Ma' }),
    ortaNokta('Mb', 'A', 'C', 5, { rol: 'gok', etiket: 'Mb' }),
    ortaNokta('Mc', 'A', 'B', 6, { rol: 'gok', etiket: 'Mc' }),
    cizgi('ka', 'dogru_parcasi', 'A', 'Ma', 7, { rol: 'gok', kalinlik: 2 }),
    cizgi('kb', 'dogru_parcasi', 'B', 'Mb', 8, { rol: 'gok', kalinlik: 2 }),
    cizgi('kc', 'dogru_parcasi', 'C', 'Mc', 9, { rol: 'gok', kalinlik: 2 }),
    ucgenMerkezi('G', 'agirlik_merkezi', ['A', 'B', 'C'], 10, {
      rol: 'gul',
      etiket: 'G',
    }),
    cizgi('AG', 'dogru_parcasi', 'A', 'G', 11, { rol: 'gul', kalinlik: 4 }),
    cizgi('GMa', 'dogru_parcasi', 'G', 'Ma', 12, { rol: 'seftali', kalinlik: 4 }),
    oran('bolunme', 'AG', 'GMa', 13, { rol: 'gul', etiket: 'AG / GMa', dy: 0.9 }),
  ],
  adimlar: [
    adim(1, 'Kenar orta noktaları', 'Her kenarın orta noktası işaretlendi: Ma, Mb, Mc.', ['Ma', 'Mb', 'Mc']),
    adim(2, 'Üç kenarortay', 'Her köşeyi karşı kenarın orta noktasına bağlayın. Üçü de tek noktada kesişiyor — bu tesadüf değil.', ['ka', 'kb', 'kc']),
    adim(3, 'Ağırlık merkezi', 'Kesişim noktası G, üçgenin ağırlık merkezidir. Üçgeni kartondan kesip bu noktadan iğneyle assanız dengede durur.', ['G']),
    adim(4, 'İkiye bir', 'AG parçasını GMa’ya bölün: 2 çıkıyor. G, her kenarortayı köşeden başlayarak 2’ye 1 oranında böler. Köşeleri sürükleyin, oran değişmiyor.', ['AG', 'GMa', 'bolunme']),
  ],
}

const ACIORTAY = {
  slug: 'aciortay-ve-ic-teget-cember',
  konuSlug: 's10-ucgenin-yardimci-elemanlari',
  tur: 'kesif',
  baslik: 'Açıortaylar ve iç teğet çember',
  ozet:
    'Üç açıortay tek noktada kesişir. O nokta üç kenara da eşit uzaklıkta olduğu için etrafına üçgene içten teğet bir çember çizilebilir.',
  zorluk: 4,
  sira: 2,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 9, 10, -7]),
  nesneler: [
    nokta('A', -7, -4, 0, { rol: 'lavanta' }),
    nokta('B', 7, -4, 1, { rol: 'lavanta' }),
    nokta('C', -1, 6, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.3 }),
    aciOrtay('oA', 'B', 'A', 'C', 4, { rol: 'seftali' }),
    aciOrtay('oB', 'C', 'B', 'A', 5, { rol: 'seftali' }),
    aciOrtay('oC', 'A', 'C', 'B', 6, { rol: 'seftali' }),
    ucgenMerkezi('I', 'ic_merkez', ['A', 'B', 'C'], 7, { rol: 'gul', etiket: 'I' }),
    ucgenMerkezi('icCember', 'ic_teget_cember', ['A', 'B', 'C'], 8, {
      rol: 'gul',
      opaklik: 0.18,
      kalinlik: 2,
    }),
    cizgi('kenarAB', 'dogru', 'A', 'B', 9, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    cizgi('kenarAC', 'dogru', 'A', 'C', 10, { rol: 'notr', kalinlik: 1, cizgiTipi: 'noktali' }),
    izdusum('Dab', 'I', 'kenarAB', 11, { rol: 'gul', etiket: null }),
    izdusum('Dac', 'I', 'kenarAC', 12, { rol: 'gul', etiket: null }),
    uzunluk('rAB', 'I', 'Dab', 13, { rol: 'gul', etiket: 'AB’ye uzaklık' }),
    uzunluk('rAC', 'I', 'Dac', 14, { rol: 'gul', etiket: 'AC’ye uzaklık' }),
  ],
  adimlar: [
    adim(1, 'Üç açıortay', 'Her köşedeki açıyı ikiye bölen doğrular. Üçü de tek noktada buluşuyor.', ['oA', 'oB', 'oC']),
    adim(2, 'İç merkez', 'Kesişim noktası I, üçgenin iç merkezidir.', ['I']),
    adim(3, 'Kenarlara uzaklık eşit', 'I’dan her kenara inen dikmelerin uzunlukları aynı. Açıortay üzerindeki her nokta, açının iki kolundan eşit uzaklıktadır — üç açıortay kesişince üç kenara birden eşit uzaklık çıkıyor.', ['rAB', 'rAC']),
    adim(4, 'İç teğet çember', 'Bu ortak uzaklık yarıçap alınırsa üçgene içten teğet çember elde edilir. Köşeleri sürükleyin: çember hep üç kenara da değiyor.', ['icCember']),
  ],
}

const ORTA_DIKME = {
  slug: 'orta-dikme-ve-cevrel-cember',
  konuSlug: 's10-ucgenin-yardimci-elemanlari',
  tur: 'kesif',
  baslik: 'Orta dikmeler ve çevrel çember',
  ozet:
    'Üç kenarın orta dikmesi tek noktada kesişir. O nokta üç köşeye de eşit uzaklıkta olduğu için üçgenin köşelerinden geçen çemberin merkezidir.',
  zorluk: 4,
  sira: 3,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 10, 11, -8]),
  nesneler: [
    nokta('A', -7, -4, 0, { rol: 'lavanta' }),
    nokta('B', 7, -4, 1, { rol: 'lavanta' }),
    nokta('C', -1, 6, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.3 }),
    ortaDikme('dAB', 'A', 'B', 4, { rol: 'gok' }),
    ortaDikme('dBC', 'B', 'C', 5, { rol: 'gok' }),
    ortaDikme('dAC', 'A', 'C', 6, { rol: 'gok' }),
    ucgenMerkezi('O', 'cevrel_merkez', ['A', 'B', 'C'], 7, { rol: 'gul', etiket: 'O' }),
    ucgenMerkezi('cevrelCember', 'cevrel_cember', ['A', 'B', 'C'], 8, {
      rol: 'gul',
      opaklik: 0.08,
      kalinlik: 2,
    }),
    uzunluk('RA', 'O', 'A', 9, { rol: 'gul', etiket: 'OA' }),
    uzunluk('RB', 'O', 'B', 10, { rol: 'gul', etiket: 'OB' }),
    uzunluk('RC', 'O', 'C', 11, { rol: 'gul', etiket: 'OC' }),
  ],
  adimlar: [
    adim(1, 'Orta dikme nedir', 'Bir kenarın orta noktasından geçen ve o kenara dik olan doğru. Üzerindeki her nokta kenarın iki ucuna eşit uzaklıktadır.', ['dAB']),
    adim(2, 'Üçü tek noktada', 'Üç kenarın orta dikmesini de çizin: tek noktada kesişiyorlar.', ['dAB', 'dBC', 'dAC']),
    adim(3, 'Üç köşeye eşit uzaklık', 'OA, OB ve OC ölçümleri birbirine eşit. Bu yüzden O merkezli, bu uzaklık yarıçaplı çember üç köşeden birden geçer.', ['RA', 'RB', 'RC']),
    adim(4, 'Geniş açıda dışarı çıkar', 'C’yi tabana yaklaştırıp üçgeni genişletin: O üçgenin dışına çıkıyor ama çember yine üç köşeden geçiyor.', ['C', 'O', 'cevrelCember']),
  ],
}

const ALAN_DEGISIMI = {
  slug: 'sabit-alan-tepe-kaydirma',
  konuSlug: 's10-ucgenin-alani-ve-degisimi',
  tur: 'kesif',
  baslik: 'Tabanı ve yüksekliği aynı olan üçgenlerin alanı aynıdır',
  ozet:
    'Tepe noktasını tabana paralel bir doğru üzerinde kaydırın: üçgen tanınmayacak kadar değişiyor ama alan hiç değişmiyor.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 9, 11, -8]),
  nesneler: [
    nokta('Z1', -10, -4, 0, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('Z2', 10, -4, 1, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('tabanDogru', 'dogru', 'Z1', 'Z2', 2, { rol: 'notr', kalinlik: 1 }),
    surgu('A', 'tabanDogru', -7, -4, 3, { rol: 'lavanta', etiket: 'A' }),
    surgu('B', 'tabanDogru', 5, -4, 4, { rol: 'lavanta', etiket: 'B' }),
    nokta('Hctrl', 8, 3, 5, { rol: 'gok', etiket: 'yükseklik ayarı' }),
    paralelDik('ustDogru', 'paralel', 'tabanDogru', 'Hctrl', 6, {
      rol: 'gok',
      kalinlik: 1,
      cizgiTipi: 'kesik',
    }),
    surgu('C', 'ustDogru', -3, 3, 7, { rol: 'seftali', etiket: 'tepe' }),
    cokgen('ucgen', ['A', 'B', 'C'], 8, { rol: 'nane', opaklik: 0.4 }),
    izdusum('H', 'C', 'tabanDogru', 9, { rol: 'gok', etiket: null }),
    cizgi('yukseklik', 'dogru_parcasi', 'C', 'H', 10, { rol: 'gok', kalinlik: 3, cizgiTipi: 'kesik' }),
    uzunluk('taban', 'A', 'B', 11, { rol: 'lavanta', etiket: 'taban' }),
    uzunluk('yuk', 'C', 'H', 12, { rol: 'gok', etiket: 'yükseklik' }),
    olcumKaynakli('alan', 'olcum_alan', 'ucgen', 13, { rol: 'gul' }),
  ],
  adimlar: [
    adim(1, 'Taban ve yükseklik', 'Alan formülü taban çarpı yükseklik bölü ikidir. İkisi de ekranda ölçülüyor.', ['taban', 'yuk', 'alan']),
    adim(2, 'Tepeyi kaydırın', 'Tepe noktasını mavi doğru üzerinde sağa sola kaydırın. Üçgen dar açılıdan geniş açılıya dönüyor ama alan sabit kalıyor.', ['C', 'alan']),
    adim(3, 'Neden sabit?', 'Tepe paralel doğru üzerinde kaldıkça tabana uzaklığı — yani yükseklik — değişmiyor. Taban da aynı. Çarpım da aynı.', ['ustDogru', 'yuk']),
    adim(4, 'Şimdi yüksekliği değiştirin', 'Mavi doğruyu yukarı taşıyın: yükseklik iki katına çıkınca alan da iki katına çıkıyor. Alan yükseklikle doğru orantılıdır.', ['Hctrl', 'yuk', 'alan']),
  ],
}

const KOSINUS = {
  slug: 'kosinus-teoremi-mentese',
  konuSlug: 's10-sinus-ve-kosinus-teoremleri',
  tur: 'gercek_hayat',
  baslik: 'Menteşe: iki kol sabit, açı değişince üçüncü kenar',
  ozet:
    'İki kolun uzunluğu sabit; aradaki açıyı açıp kapatın. Karşı kenar açıyla birlikte değişiyor — kosinüs teoremi tam olarak bu değişimi verir.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 8, 11, -6]),
  nesneler: [
    nokta('O', -2, -3, 0, { surukleme: 'yok', rol: 'notr', etiket: 'menteşe' }),
    nokta('A', 6, -3, 1, { surukleme: 'yok', rol: 'gok', etiket: 'sabit kol ucu' }),
    // Ikinci kolun uzunlugu 6: yayin yaricapini belirleyen gizli noktalar.
    nokta('Bref', 4, -3, 2, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    karsi('Bters', 'O', 'Bref', 3, { rol: 'notr', etiket: null, gorunur: false }),
    // Ust yarim yay: aci hep 0 ile 180 arasinda kaliyor, donuk aci okunmuyor.
    yayDilim('kolYayi', 'yay', 'O', 'Bref', 'Bters', 4, {
      rol: 'notr',
      kalinlik: 1,
      opaklik: 0,
    }),
    surgu('B', 'kolYayi', 1, 2.5, 5, { rol: 'seftali', etiket: 'hareketli kol ucu' }),
    cokgen('ucgen', ['O', 'A', 'B'], 6, { rol: 'nane', opaklik: 0.3 }),
    cizgi('kolSabit', 'dogru_parcasi', 'O', 'A', 7, { rol: 'gok', kalinlik: 4 }),
    cizgi('kolHareketli', 'dogru_parcasi', 'O', 'B', 8, { rol: 'seftali', kalinlik: 4 }),
    cizgi('karsiKenar', 'dogru_parcasi', 'A', 'B', 9, { rol: 'gul', kalinlik: 4 }),
    aci('aciO', 'A', 'O', 'B', 10, { rol: 'tereyagi' }),
    uzunluk('b', 'O', 'A', 11, { rol: 'gok', etiket: 'b' }),
    uzunluk('c', 'O', 'B', 12, { rol: 'seftali', etiket: 'c' }),
    uzunluk('a', 'A', 'B', 13, { rol: 'gul', etiket: 'a' }),
  ],
  adimlar: [
    adim(1, 'İki kol sabit', 'b = 8 ve c = 6 birim. Hareketli kolu yay üzerinde gezdirin: uzunluğu değişmiyor, sadece açı değişiyor.', ['b', 'c']),
    adim(2, 'Açı büyüyünce karşı kenar büyür', 'Açıyı açın: a uzuyor. Kapatın: a kısalıyor. Açı ile karşı kenar birlikte hareket ediyor.', ['aciO', 'a']),
    adim(3, 'Dik açıda Pisagor', 'Açıyı 90 dereceye getirin: a² tam olarak b² + c² çıkıyor, yani 64 + 36 = 100 ve a = 10.', ['aciO', 'a']),
    adim(4, 'Kosinüs teoremi', 'Genel kural a² = b² + c² − 2·b·c·cos A’dır. Açı 90 iken cos A sıfır olduğu için son terim yok olur ve Pisagor’a dönüşür. Açı 90’dan küçükken son terim a’yı kısaltır, büyükken uzatır.', ['aciO', 'a', 'b', 'c']),
  ],
}

const SINUS = {
  slug: 'sinus-teoremi-cevrel-cember',
  konuSlug: 's10-sinus-ve-kosinus-teoremleri',
  tur: 'kesif',
  baslik: 'Sinüs teoremi ve çevrel çember',
  ozet:
    'Üçgenin üç açısını ve üç kenarını birlikte okuyun. Her kenarın karşı açısının sinüsüne oranı aynıdır ve bu ortak değer çevrel çemberin çapına eşittir.',
  zorluk: 5,
  sira: 2,
  durum: 'yayin',
  ayar: ayar('izgara', [-11, 10, 11, -8]),
  nesneler: [
    nokta('A', -6, -4, 0, { rol: 'lavanta' }),
    nokta('B', 6, -4, 1, { rol: 'lavanta' }),
    nokta('C', 1, 5, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.3 }),
    ucgenMerkezi('cevrelCember', 'cevrel_cember', ['A', 'B', 'C'], 4, {
      rol: 'gok',
      opaklik: 0.07,
      kalinlik: 2,
      cizgiTipi: 'kesik',
    }),
    ucgenMerkezi('O', 'cevrel_merkez', ['A', 'B', 'C'], 5, { rol: 'gok', etiket: 'O' }),
    aci('aciA', 'B', 'A', 'C', 6, { rol: 'seftali' }),
    aci('aciB', 'C', 'B', 'A', 7, { rol: 'gul' }),
    aci('aciC', 'A', 'C', 'B', 8, { rol: 'tereyagi' }),
    uzunluk('a', 'B', 'C', 9, { rol: 'seftali', etiket: 'a (A karşısı)' }),
    uzunluk('b', 'A', 'C', 10, { rol: 'gul', etiket: 'b (B karşısı)' }),
    uzunluk('c', 'A', 'B', 11, { rol: 'tereyagi', etiket: 'c (C karşısı)' }),
    uzunluk('R', 'O', 'A', 12, { rol: 'gok', etiket: 'R (yarıçap)' }),
  ],
  adimlar: [
    adim(1, 'Her kenarın bir karşı açısı var', 'Renkler eşleşiyor: a kenarı A açısının karşısında, b kenarı B’nin, c kenarı C’nin.', ['a', 'aciA', 'b', 'aciB', 'c', 'aciC']),
    adim(2, 'Bölümleri hesaplayın', 'a’yı sin A’ya, b’yi sin B’ye, c’yi sin C’ye bölün. Üç bölüm de aynı sayıyı veriyor.', ['a', 'b', 'c']),
    adim(3, 'Ortak değer 2R', 'Bu ortak sayı, çevrel çemberin çapıdır. Ekrandaki yarıçapı iki ile çarpıp karşılaştırın.', ['R', 'cevrelCember']),
    adim(4, 'Köşeleri sürükleyin', 'Üçgeni istediğiniz gibi değiştirin. Kenarlar ve açılar birlikte değişiyor ama üç oran hep birbirine ve 2R’ye eşit kalıyor.', ['A', 'B', 'C', 'cevrelCember']),
  ],
}

const UZAKLIK = {
  slug: 'koordinatta-uzaklik-ve-bolme',
  konuSlug: 's10-koordinat-sisteminde-uzaklik-ve-bolme',
  tur: 'kesif',
  baslik: 'İki nokta arası uzaklık ve doğru parçasını bölme',
  ozet:
    'İki nokta arasındaki uzaklık aslında bir Pisagor hesabıdır: yatay fark bir dik kenar, dikey fark diğeri. Aynı doğru parçasını istediğiniz oranda bölmek de aynı mantıkla yürür.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('tam', [-10, 8, 10, -8]),
  nesneler: [
    nokta('A', -6, -3, 0, { rol: 'nane' }),
    nokta('B', 4, 3, 1, { rol: 'nane' }),
    bilesen('K', 'B', 'A', 2, { rol: 'notr', etiket: null }),
    cizgi('yatay', 'dogru_parcasi', 'A', 'K', 3, { rol: 'gok', kalinlik: 3 }),
    cizgi('dusey', 'dogru_parcasi', 'K', 'B', 4, { rol: 'seftali', kalinlik: 3 }),
    cizgi('AB', 'dogru_parcasi', 'A', 'B', 5, { rol: 'gul', kalinlik: 4 }),
    aci('dikK', 'B', 'K', 'A', 6, { rol: 'tereyagi' }),
    uzunluk('dx', 'A', 'K', 7, { rol: 'gok', etiket: 'x farkı' }),
    uzunluk('dy', 'K', 'B', 8, { rol: 'seftali', etiket: 'y farkı' }),
    uzunluk('uzaklik', 'A', 'B', 9, { rol: 'gul', etiket: '|AB|' }),
    ortaNokta('M', 'A', 'B', 10, { rol: 'lavanta', etiket: 'orta nokta' }),
    // A'dan basayarak AB'nin ucte biri: AP / PB = 1 / 2.
    homoteti('P', 'B', 'A', 1 / 3, 11, { rol: 'tereyagi', etiket: 'P' }),
    cizgi('AP', 'dogru_parcasi', 'A', 'P', 12, { rol: 'tereyagi', kalinlik: 5 }),
    cizgi('PB', 'dogru_parcasi', 'P', 'B', 13, { rol: 'notr', kalinlik: 5 }),
    oran('bolme', 'AP', 'PB', 14, { rol: 'tereyagi', etiket: 'AP / PB', dy: -1.1 }),
  ],
  adimlar: [
    adim(1, 'Gizli dik üçgen', 'A ve B arasına bir dik üçgen kuruldu: yatay kenar x farkı, dikey kenar y farkı kadar.', ['yatay', 'dusey', 'dikK']),
    adim(2, 'Uzaklık formülü', 'Hipotenüs |AB|. Pisagor’dan: x farkının karesi artı y farkının karesi, uzaklığın karesine eşit.', ['dx', 'dy', 'uzaklik']),
    adim(3, 'Orta nokta', 'Orta noktanın koordinatları, uçların koordinatlarının ortalamasıdır. A’yı sürükleyip kontrol edin.', ['M']),
    adim(4, 'Belirli oranda bölme', 'P noktası AB’yi 1’e 2 oranında bölüyor: AP her zaman PB’nin yarısı. Ekrandaki oran 0,5 olarak sabit kalıyor.', ['AP', 'PB', 'bolme']),
  ],
}

const ANALITIK_DOGRU = {
  slug: 'analitik-dogru-egim-kesim',
  konuSlug: 's10-analitik-duzlemde-dogru',
  tur: 'kesif',
  baslik: 'Doğrunun eğimi ve eksen kesişimleri',
  ozet:
    'Eğim, doğrunun kimliğidir: bir birim sağa gidince kaç birim yukarı çıkıldığını söyler. Noktaları oynatıp eğimin işaretiyle doğrunun yönü arasındaki bağı görün.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('tam', [-10, 8, 10, -8]),
  nesneler: [
    nokta('Y1', 0, -8, 0, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('Y2', 0, 8, 1, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('yEkseni', 'dogru', 'Y1', 'Y2', 2, { rol: 'notr', gorunur: false }),
    nokta('X1', -10, 0, 3, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('X2', 10, 0, 4, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('xEkseni', 'dogru', 'X1', 'X2', 5, { rol: 'notr', gorunur: false }),
    nokta('A', -4, -2, 6, { rol: 'nane' }),
    nokta('B', 3, 3, 7, { rol: 'nane' }),
    cizgi('dogru', 'dogru', 'A', 'B', 8, { rol: 'gul', kalinlik: 3 }),
    bilesen('K', 'B', 'A', 9, { rol: 'notr', etiket: null }),
    cizgi('yatay', 'dogru_parcasi', 'A', 'K', 10, { rol: 'gok', kalinlik: 3 }),
    cizgi('dusey', 'dogru_parcasi', 'K', 'B', 11, { rol: 'seftali', kalinlik: 3 }),
    kesisim('N', 'dogru', 'yEkseni', 12, { rol: 'lavanta', etiket: 'y kesişimi' }),
    kesisim('T', 'dogru', 'xEkseni', 13, { rol: 'tereyagi', etiket: 'x kesişimi' }),
    uzunluk('dx', 'A', 'K', 14, { rol: 'gok', etiket: 'yatay adım' }),
    uzunluk('dy', 'K', 'B', 15, { rol: 'seftali', etiket: 'dikey adım' }),
    egim('m', 'A', 'B', 16, { rol: 'gul', etiket: 'eğim' }),
  ],
  adimlar: [
    adim(1, 'Eğim üçgeni', 'A’dan B’ye giderken önce yatay, sonra dikey hareket edilir. Eğim, dikey adımın yatay adıma bölümüdür.', ['yatay', 'dusey', 'dx', 'dy', 'm']),
    adim(2, 'İşaret yönü verir', 'B’yi A’nın altına indirin: eğim negatife dönüyor ve doğru sağa doğru alçalıyor. Yatay doğruda eğim sıfır, dikey doğruda tanımsızdır.', ['B', 'm']),
    adim(3, 'y kesişimi', 'Doğrunun y eksenini kestiği nokta, y = mx + n denklemindeki n sayısıdır.', ['N']),
    adim(4, 'x kesişimi', 'x eksenini kestiği nokta ise denklemin kökü: y = 0 yazıldığında çıkan x değeri.', ['T']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's10-dik-ucgende-trigonometrik-oranlar',
    sahneSlug: 'rampa-trigonometrik-oranlar',
    baslik: 'Rampa eğimi neden %8’i geçemez',
    hikaye:
      'Erişilebilirlik yönetmeliği tekerlekli sandalye rampalarında eğimi %8 ile sınırlar. Yüzde eğim, yükselmenin yatay mesafeye oranıdır — yani tam olarak tanjant. %8 eğim, yaklaşık 4,6 derecelik bir açı demektir. 60 santimetre yükselmek için en az 7,5 metre yatay mesafe gerekir; bu yüzden alçak girişlerde bile rampalar uzun olur.',
    soru: '75 santimetre yükselecek bir rampa %6 eğimle yapılacaksa yatay uzunluğu kaç metre olmalıdır?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.10.3.1 — dik üçgende trigonometrik oranlar',
    yasAraligi: '15-17',
  },
  {
    konuSlug: 's10-ucgenin-alani-ve-degisimi',
    sahneSlug: 'sabit-alan-tepe-kaydirma',
    baslik: 'Tarla bölüşümünde eşit pay',
    hikaye:
      'Bir üçgen tarlayı iki kardeş arasında eşit bölmek için tepe noktasından karşı kenarın orta noktasına bir çizgi çekmek yeterlidir. İki parçanın tabanları eşit, yükseklikleri ortaktır; dolayısıyla alanları da eşittir. Kadastro uygulamalarında sınır çizgisi taşınırken de aynı ilke kullanılır: paralel kaydırma alanı bozmaz.',
    soru: 'Tabanı 30, yüksekliği 18 metre olan üçgen tarla kenarortayla bölünürse her parçanın alanı kaç metrekare olur?',
    olcekAciklama: 'Izgaradaki 1 birim 5 metredir.',
    kaynak: 'MEB kazanımı MAT.10.3.4 — üçgenin alanı',
    yasAraligi: '15-17',
  },
  {
    konuSlug: 's10-sinus-ve-kosinus-teoremleri',
    sahneSlug: 'kosinus-teoremi-mentese',
    baslik: 'İki yol arasındaki kestirme',
    hikaye:
      'Bir kavşaktan iki yol ayrılıyor: biri 8 kilometre, diğeri 6 kilometre sonra iki köye varıyor. Köyler arasına doğrudan yol yapılacaksa uzunluğu kavşaktaki açıya bağlıdır. Açı 60 derece ise mesafe 2·8·6·cos60 = 48 kadar kısalır ve yaklaşık 7,2 kilometre çıkar. Harita üzerinden mesafe kestirmenin en pratik yolu budur.',
    soru: 'Kollar 8 ve 6 kilometre, aradaki açı 90 derece ise köyler arası uzaklık kaç kilometredir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 kilometredir.',
    kaynak: 'MEB kazanımı MAT.10.3.5 — kosinüs teoremi',
    yasAraligi: '15-17',
  },
  {
    konuSlug: 's10-analitik-duzlemde-dogru',
    sahneSlug: 'analitik-dogru-egim-kesim',
    baslik: 'Yol tabelasındaki yüzde',
    hikaye:
      'Dağ yollarındaki "%12 eğim" tabelası, yatay 100 metrede 12 metre yükselindiğini söyler. Bu doğrudan doğruya doğrunun eğimidir. Demiryollarında eğim %4’ü geçmez çünkü çelik tekerlek çelik rayda tutunamaz; karayolunda ise %12’ye kadar çıkılabilir. Aynı sayı, analitik geometride doğrunun denklemindeki m katsayısıdır.',
    soru: '%12 eğimli bir yolda 1,5 kilometre yatay ilerleyen bir araç kaç metre yükselir?',
    olcekAciklama: 'Izgaradaki 1 birim 100 metredir.',
    kaynak: 'MEB kazanımı MAT.10.4.2 — analitik düzlemde doğru',
    yasAraligi: '15-17',
  },
]

const SORULAR = [
  {
    konuSlug: 's10-dik-ucgende-trigonometrik-oranlar',
    sahneSlug: 'rampa-trigonometrik-oranlar',
    tip: 'sayisal',
    govde:
      'Dik üçgende bir dar açının karşı kenarı 3, hipotenüsü 5 birim. Bu açının sinüsü kaçtır?',
    cevap: { tip: 'sayisal', deger: 0.6, tolerans: 0.001 },
    ipucu: 'sin = karşı / hipotenüs.',
    cozum: '3 ÷ 5 = 0,6.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's10-dik-ucgende-trigonometrik-oranlar',
    tip: 'dogru_yanlis',
    govde:
      'Bir dik üçgenin bütün kenarları iki katına çıkarılırsa dar açıların sinüsü de iki katına çıkar.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'Sahnede rampayı uzatınca oranlar değişiyor mu?',
    cozum:
      'Pay da payda da iki katına çıkar, oran değişmez. Trigonometrik oranları belirleyen tek şey açıdır; büyüklük değil.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-dik-ucgende-trigonometrik-oranlar',
    tip: 'sayisal',
    govde:
      '75 santimetre yükselecek bir rampa %6 eğimle yapılacak. Yatay uzunluğu kaç metre olmalıdır?',
    cevap: { tip: 'sayisal', deger: 12.5, tolerans: 0.1, birim: 'metre' },
    ipucu: '%6 eğim, tanjantın 0,06 olması demek.',
    cozum: '0,75 ÷ 0,06 = 12,5 metre.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's10-ucgenin-yardimci-elemanlari',
    sahneSlug: 'kenarortay-ve-agirlik-merkezi',
    tip: 'sayisal',
    govde:
      'Bir kenarortayın uzunluğu 12 birim. Ağırlık merkezinin köşeye olan uzaklığı kaç birimdir?',
    cevap: { tip: 'sayisal', deger: 8, tolerans: 0, birim: 'birim' },
    ipucu: 'Ağırlık merkezi kenarortayı 2’ye 1 böler; köşeye yakın parça büyük olandır.',
    cozum: 'Kenarortay 3 eşit paya bölünür: 12 ÷ 3 = 4. Köşe tarafındaki parça 2 pay, yani 8 birimdir.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-ucgenin-yardimci-elemanlari',
    sahneSlug: 'aciortay-ve-ic-teget-cember',
    tip: 'coktan_secmeli',
    govde: 'Üçgenin iç teğet çemberinin merkezi hangi doğruların kesişimidir?',
    secenekler: ['Kenarortaylar', 'Açıortaylar', 'Orta dikmeler', 'Yükseklikler'],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Çemberin merkezi üç kenara eşit uzaklıkta olmalı.',
    cozum:
      'Açıortay üzerindeki noktalar açının iki koluna eşit uzaklıktadır. Üç açıortayın kesiştiği nokta üç kenara birden eşit uzaklıktadır; iç teğet çemberin merkezi budur.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's10-ucgenin-yardimci-elemanlari',
    sahneSlug: 'orta-dikme-ve-cevrel-cember',
    tip: 'dogru_yanlis',
    govde: 'Çevrel çemberin merkezi her zaman üçgenin içindedir.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'Üçgeni geniş açılı yapıp merkeze bakın.',
    cozum:
      'Dar açılı üçgende içte, dik üçgende hipotenüsün orta noktasında, geniş açılı üçgende ise dışarıdadır. Sahnede C’yi tabana yaklaştırıp deneyebilirsiniz.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's10-ucgenin-alani-ve-degisimi',
    sahneSlug: 'sabit-alan-tepe-kaydirma',
    tip: 'sayisal',
    govde:
      'Tabanı 30, yüksekliği 18 metre olan üçgen tarla kenarortayla ikiye bölünüyor. Her parçanın alanı kaç metrekaredir?',
    cevap: { tip: 'sayisal', deger: 135, tolerans: 0, birim: 'metrekare' },
    ipucu: 'Önce bütünün alanını bulun, sonra ikiye bölün.',
    cozum: 'Bütün alan (30 × 18) ÷ 2 = 270. Kenarortay eşit böldüğü için her parça 135 metrekare.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-ucgenin-alani-ve-degisimi',
    tip: 'dogru_yanlis',
    govde:
      'Tabanı ortak olan ve tepe noktaları aynı paralel doğru üzerinde bulunan iki üçgenin alanları eşittir.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Paralel doğru üzerinde gezerken tabana uzaklık değişir mi?',
    cozum:
      'Paralel doğru üzerindeki her noktanın tabana uzaklığı aynıdır. Taban da ortak olduğu için taban × yükseklik ÷ 2 değişmez.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's10-sinus-ve-kosinus-teoremleri',
    sahneSlug: 'kosinus-teoremi-mentese',
    tip: 'sayisal',
    govde:
      'Bir üçgende iki kenar 8 ve 6 birim, aralarındaki açı 90 derece. Üçüncü kenar kaç birimdir?',
    cevap: { tip: 'sayisal', deger: 10, tolerans: 0, birim: 'birim' },
    ipucu: 'Açı 90 iken kosinüs sıfırdır; kosinüs teoremi Pisagor’a dönüşür.',
    cozum: 'a² = 64 + 36 − 2·8·6·cos90 = 100 − 0 = 100 → a = 10 birim.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-sinus-ve-kosinus-teoremleri',
    sahneSlug: 'sinus-teoremi-cevrel-cember',
    tip: 'acik_uclu',
    govde:
      'Sahnede üçgeni değiştirdiğinizde a/sin A, b/sin B ve c/sin C oranlarına ne oluyor? Bu ortak değerin çevrel çemberle ilişkisi nedir?',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Üçgen nasıl değişirse değişsin üç oran birbirine eşit kalıyor. Ortak değer, çevrel çemberin çapına yani 2R’ye eşit. Yarıçap büyüdükçe oran da büyüyor.',
      anahtarlar: ['eşit', '2R', 'çap', 'çevrel'],
    },
    ipucu: 'Ekrandaki R ölçümünü iki ile çarpıp oranlarla karşılaştırın.',
    cozum:
      'Sinüs teoremi a/sin A = b/sin B = c/sin C = 2R der. Ortak oran, üçgenin çevrel çemberinin çapıdır; bu yüzden aynı çember üzerindeki bütün üçgenlerde aynı sayı çıkar.',
    zorluk: 5,
    puan: 4,
  },
  {
    konuSlug: 's10-koordinat-sisteminde-uzaklik-ve-bolme',
    sahneSlug: 'koordinatta-uzaklik-ve-bolme',
    tip: 'sayisal',
    govde: 'A(−6, −3) ve B(4, 3) noktaları arasındaki uzaklığın karesi kaçtır?',
    cevap: { tip: 'sayisal', deger: 136, tolerans: 0 },
    ipucu: 'x farkı 10, y farkı 6.',
    cozum: '10² + 6² = 100 + 36 = 136. Uzaklığın kendisi √136 ≈ 11,66 birimdir.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-koordinat-sisteminde-uzaklik-ve-bolme',
    tip: 'sayisal',
    govde:
      'A(−6, 2) ve B(6, 8) noktalarını birleştiren doğru parçasının orta noktasının ordinatı kaçtır?',
    cevap: { tip: 'sayisal', deger: 5, tolerans: 0 },
    ipucu: 'Ordinat, y koordinatıdır; ortalamasını alın.',
    cozum: '(2 + 8) ÷ 2 = 5. Apsis ise (−6 + 6) ÷ 2 = 0 olur.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's10-analitik-duzlemde-dogru',
    sahneSlug: 'analitik-dogru-egim-kesim',
    tip: 'sayisal',
    govde: 'A(−4, −2) ve B(3, 3) noktalarından geçen doğrunun eğimi kaçtır? Ondalık olarak yazın.',
    cevap: { tip: 'sayisal', deger: 0.714, tolerans: 0.01 },
    ipucu: 'Dikey adımı yatay adıma bölün.',
    cozum: '(3 − (−2)) ÷ (3 − (−4)) = 5 ÷ 7 ≈ 0,714.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-analitik-duzlemde-dogru',
    tip: 'coktan_secmeli',
    govde: 'Eğimi negatif olan bir doğru için aşağıdakilerden hangisi doğrudur?',
    secenekler: [
      'Soldan sağa yükselir',
      'Soldan sağa alçalır',
      'Yataydır',
      'Y eksenine paraleldir',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Sahnede B’yi A’nın altına indirin.',
    cozum:
      'Eğim negatifse x arttıkça y azalır; doğru soldan sağa alçalır. Eğim sıfırsa yatay, tanımsızsa dikeydir.',
    zorluk: 2,
    puan: 2,
  },
]

console.log('10. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [
    TRIGONOMETRI,
    KENARORTAY,
    ACIORTAY,
    ORTA_DIKME,
    ALAN_DEGISIMI,
    KOSINUS,
    SINUS,
    UZAKLIK,
    ANALITIK_DOGRU,
  ],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n10. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 10)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
