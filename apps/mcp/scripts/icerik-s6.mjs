/**
 * 6. sinif geometri dilimi - dokuz konu.
 *
 * Calistir: npm run icerik-s6 -w @matgebra/mcp
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

const { istemci, cagir } = await baglan('icerik-s6')

/* --------------------------------------------------------------- sahneler */

// 1) Paralel iki dogru ve bir kesen
const YAYA_GECIDI = {
  slug: 'yaya-gecidi-paralel-kesen',
  konuSlug: 's6-paralel-dogrular-ve-kesen',
  tur: 'gercek_hayat',
  baslik: 'Yaya geçidi: paralel yollar ve kesen',
  ozet:
    'Yolun iki kenarı paraleldir; yaya geçidinin çizgileri onları keser. Kesenin eğimini değiştirin: yöndeş açıların hep eşit kaldığını görün.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-10, 8, 10, -8], { yapisma: 'yok', birim: 'derece' }),
  nesneler: [
    nokta('A', -9, 3, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B', 9, 3, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C', -9, -3, 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D', 9, -3, 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cizgi('yolUst', 'dogru', 'A', 'B', 4, { rol: 'notr', kalinlik: 3 }),
    cizgi('yolAlt', 'dogru', 'C', 'D', 5, { rol: 'notr', kalinlik: 3 }),
    nokta('U', -4, 7, 6, { rol: 'seftali', etiket: 'geçit ucu' }),
    nokta('V', 4, -7, 7, { rol: 'seftali', etiket: 'geçit ucu' }),
    cizgi('kesen', 'dogru', 'U', 'V', 8, { rol: 'seftali', kalinlik: 3 }),
    kesisim('K', 'yolUst', 'kesen', 9, { etiket: 'K' }),
    kesisim('L', 'yolAlt', 'kesen', 10, { etiket: 'L' }),
    // Yondes acilar: ikisi de kesenin sag yaninda, yolun altinda kalir.
    // Kol sirasi hesaplanarak secildi: kesen asagi dogru gittigi icin once
    // kesen uzerindeki nokta, sonra yol uzerindeki nokta verilir; boylece
    // saat yonunun tersine tarama dar aciyi gecer, donuk aciyi degil.
    aci('aciUst', 'L', 'K', 'B', 11, { rol: 'tereyagi' }),
    aci('aciAlt', 'V', 'L', 'D', 12, { rol: 'tereyagi' }),
    // Ic ters: iki yolun arasinda, kesenin karsi yaninda. Ustteki sari
    // acinin ic tersidir.
    aci('icTers', 'K', 'L', 'C', 13, { rol: 'nane' }),
  ],
  adimlar: [
    adim(
      1,
      'Yolun kenarları paraleldir',
      'Gri iki doğru yolun kenarları. Aralarındaki uzaklık hiçbir yerde değişmiyor — paralel olmak budur.',
      ['yolUst', 'yolAlt'],
    ),
    adim(
      2,
      'Geçit bir kesendir',
      'Turuncu doğru iki yolu da kesiyor. Kesim noktaları K ve L. Uçlarını sürükleyip eğimi değiştirin.',
      ['kesen', 'K', 'L'],
    ),
    adim(
      3,
      'Yöndeş açılar eşittir',
      'İki sarı açı yöndeştir: kesenin aynı yanında, yolların aynı tarafında. Geçidi nasıl eğerseniz eğin ikisi hep eşit kalır.',
      ['aciUst', 'aciAlt'],
    ),
    adim(
      4,
      'İç ters açı da eşit',
      'Yeşil açı, üstteki sarı açının iç tersidir: iki yolun arasında ama kesenin öbür yanında. Paralellik korunduğu sürece bu eşitlik de bozulmaz.',
      ['icTers', 'aciUst'],
    ),
  ],
}

// 2) Iki paralel + iki kesen -> paralelkenar
const RAY_PARALELKENAR = {
  slug: 'ray-iki-kesen-paralelkenar',
  konuSlug: 's6-iki-kesenle-olusan-sekiller',
  tur: 'kesif',
  baslik: 'İki paralel, iki kesen',
  ozet:
    'İki paralel doğruyu iki kesenle kestiğinizde arada bir dörtgen oluşur. Kesenleri oynatın: hangi durumda paralelkenar, hangi durumda yamuk çıkıyor?',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 7, 10, -7]),
  nesneler: [
    nokta('A', -9, 3, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B', 9, 3, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C', -9, -3, 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D', 9, -3, 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cizgi('p1', 'dogru', 'A', 'B', 4, { rol: 'notr', kalinlik: 2 }),
    cizgi('p2', 'dogru', 'C', 'D', 5, { rol: 'notr', kalinlik: 2 }),
    nokta('U1', -5, 6, 6, { rol: 'gok', etiket: '1. kesen' }),
    nokta('V1', -3, -6, 7, { rol: 'gok', etiket: null }),
    nokta('U2', 3, 6, 8, { rol: 'seftali', etiket: '2. kesen' }),
    nokta('V2', 5, -6, 9, { rol: 'seftali', etiket: null }),
    cizgi('k1', 'dogru', 'U1', 'V1', 10, { rol: 'gok' }),
    cizgi('k2', 'dogru', 'U2', 'V2', 11, { rol: 'seftali' }),
    kesisim('P', 'p1', 'k1', 12, { etiket: 'P' }),
    kesisim('Q', 'p1', 'k2', 13, { etiket: 'Q' }),
    kesisim('R', 'p2', 'k2', 14, { etiket: 'R' }),
    kesisim('S', 'p2', 'k1', 15, { etiket: 'S' }),
    cokgen('dortgen', ['P', 'Q', 'R', 'S'], 16, { rol: 'nane', opaklik: 0.35 }),
    uzunluk('ust', 'P', 'Q', 17, { rol: 'notr', etiket: 'üst' }),
    uzunluk('alt', 'S', 'R', 18, { rol: 'notr', etiket: 'alt' }),
  ],
  adimlar: [
    adim(
      1,
      'Dört kesişim, bir dörtgen',
      'İki paralel ve iki kesen dört noktada buluşur. Bu dört nokta bir dörtgen oluşturur.',
      ['dortgen', 'P', 'Q', 'R', 'S'],
    ),
    adim(
      2,
      'Yamuk her zaman var',
      'Üst ve alt kenarlar paralel doğruların üzerinde olduğu için hep paraleldir. Bu yüzden şekil en azından bir yamuktur.',
      ['ust', 'alt'],
    ),
    adim(
      3,
      'Ne zaman paralelkenar?',
      'Kesenleri birbirine paralel yapmayı deneyin — eğimlerini eşitleyin. O anda karşılıklı kenarların ikisi de paralel olur ve şekil paralelkenara dönüşür.',
      ['k1', 'k2'],
    ),
  ],
}

// 3) Kosegenlerle dortgen insasi
const KOSEGEN = {
  slug: 'kosegenlerle-dortgen',
  konuSlug: 's6-kosegenlerle-dortgen-insasi',
  tur: 'kesif',
  baslik: 'Köşegenlerden dörtgen kurmak',
  ozet:
    'Birbirini ortalayan iki doğru parçasını köşegen kabul edin. Uçları birleştirince hangi dörtgen çıkıyor? Uçları oynatıp kuralı bulun.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 7, 9, -7]),
  nesneler: [
    nokta('M', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'orta' }),
    nokta('A', -5, 3, 1, { rol: 'gok' }),
    karsi('C', 'M', 'A', 2, { rol: 'gok' }),
    nokta('B', 4, 2, 3, { rol: 'seftali' }),
    karsi('D', 'M', 'B', 4, { rol: 'seftali' }),
    cizgi('kose1', 'dogru_parcasi', 'A', 'C', 5, { rol: 'gok', cizgiTipi: 'kesik' }),
    cizgi('kose2', 'dogru_parcasi', 'B', 'D', 6, { rol: 'seftali', cizgiTipi: 'kesik' }),
    cokgen('dortgen', ['A', 'B', 'C', 'D'], 7, { rol: 'nane', opaklik: 0.35 }),
    uzunluk('k1', 'A', 'C', 8, { rol: 'gok', etiket: '1. köşegen' }),
    uzunluk('k2', 'B', 'D', 9, { rol: 'seftali', etiket: '2. köşegen' }),
  ],
  adimlar: [
    adim(
      1,
      'İki köşegen, ortak orta nokta',
      'A ile C, B ile D birbirinin karşısında; ikisinin de orta noktası M. Yani köşegenler birbirini ortalıyor.',
      ['kose1', 'kose2', 'M'],
    ),
    adim(
      2,
      'Uçları birleştirin',
      'Dört uç noktayı sırayla birleştirince dörtgen çıkıyor. A ve B noktalarını sürükleyin — şekil değişse de bir özellik değişmiyor.',
      ['dortgen'],
    ),
    adim(
      3,
      'Hep paralelkenar',
      'Köşegenler birbirini ortalıyorsa şekil daima paralelkenardır. Köşegenleri eşit uzunlukta yaparsanız dikdörtgen, ayrıca dik yaparsanız kare elde edersiniz.',
      ['k1', 'k2'],
    ),
  ],
}

// 4) Dortgenlerde aci problemleri
const CATI = {
  slug: 'cati-yamuk-acilari',
  konuSlug: 's6-dortgenlerde-aci-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Çatı kesiti: yamuğun açıları',
  ozet:
    'Bir evin çatı kesiti yamuktur. Tepe noktasını oynatıp açıların nasıl değiştiğini, toplamlarının nasıl sabit kaldığını izleyin.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -4]),
  nesneler: [
    nokta('A', -6, 0, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 6, 0, 1, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 3, 5, 2, { rol: 'seftali', etiket: 'çatı ucu' }),
    nokta('D', -3, 5, 3, { rol: 'seftali', etiket: 'çatı ucu' }),
    cokgen('cati', ['A', 'B', 'C', 'D'], 4, { rol: 'gok', opaklik: 0.35, etiket: 'çatı kesiti' }),
    // Ic acilar: (sonraki, kose, onceki) sirasinda saat yonunun tersine.
    aci('aciA', 'B', 'A', 'D', 5, { rol: 'tereyagi' }),
    aci('aciB', 'C', 'B', 'A', 6, { rol: 'tereyagi' }),
    aci('aciC', 'D', 'C', 'B', 7, { rol: 'seftali' }),
    aci('aciD', 'A', 'D', 'C', 8, { rol: 'seftali' }),
  ],
  adimlar: [
    adim(
      1,
      'Çatı kesiti bir yamuk',
      'Alt kenar tavan, üst kenar mahya. İkisi paralel olduğu için şekil yamuktur.',
      ['cati'],
    ),
    adim(
      2,
      'Dört açıyı toplayın',
      'Çatı uçlarını sürükleyin. Her açı değişiyor ama dördünün toplamı hep 360 derece.',
      ['aciA', 'aciB', 'aciC', 'aciD'],
    ),
    adim(
      3,
      'Aynı kenardaki açılar',
      'Sol yan kenarın iki ucundaki açıları (A ve D) toplayın: paralel kenarlar arasında kaldıkları için toplamları 180 derece çıkar.',
      ['aciA', 'aciD'],
    ),
  ],
}

// 5) Uzunluk ve alan birimleri
const KARO_BIRIM = {
  slug: 'kenar-iki-kat-alan-dort-kat',
  konuSlug: 's6-uzunluk-ve-alan-birimleri',
  tur: 'kesif',
  baslik: 'Kenar iki katına çıkarsa alan kaç katına çıkar?',
  ozet:
    'Uzunluk birimi ile alan birimi aynı hızda büyümez. Kareyi büyütüp kenar ile alanın nasıl ayrı davrandığını görün — 1 metre 100 santimetre ama 1 metrekare 10.000 santimetrekaredir.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 11, 13, -1], { birim: 'metre' }),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 4, 4, 1, { rol: 'seftali', etiket: 'köşe' }),
    bilesen('B', 'C', 'A', 2),
    bilesen('D', 'A', 'C', 3),
    cokgen('kare', ['A', 'B', 'C', 'D'], 4, { rol: 'nane', opaklik: 0.4 }),
    uzunluk('kenar', 'A', 'B', 5, { rol: 'seftali', etiket: 'kenar' }),
    olcumKaynakli('alan', 'olcum_alan', 'kare', 6, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(
      1,
      'Kenarı 3 birim yapın',
      'Köşeyi sürükleyip kenarı 3 birim yapın. Alan 9 birim kare çıkıyor.',
      ['kenar', 'alan'],
    ),
    adim(
      2,
      'Şimdi kenarı iki katına çıkarın',
      'Kenarı 6 birim yapın. Alan 18 olmuyor — 36 oluyor. Kenar iki katına çıkınca alan dört katına çıkıyor.',
      ['kenar', 'alan'],
    ),
    adim(
      3,
      'Birimler de böyle',
      '1 metre 100 santimetredir ama 1 metrekare 100 × 100 = 10.000 santimetrekaredir. Uzunluk birimi 100 kat büyürken alan birimi 10.000 kat büyür.',
      ['alan'],
    ),
  ],
}

// 6) Paralelkenar ve ucgenin alani
const PARALELKENAR_ALAN = {
  slug: 'paralelkenar-ucgen-alan',
  konuSlug: 's6-paralelkenar-ve-ucgenin-alani',
  tur: 'kesif',
  baslik: 'Paralelkenarı dikdörtgene çevirmek',
  ozet:
    'Paralelkenarın tepe kenarını yana kaydırın: şekil eğrilir ama alan değişmez. Taban ve yükseklik aynı kaldığı sürece alan da aynı kalır.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 11, -3]),
  nesneler: [
    nokta('A', -5, 0, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 2, 0, 1, { surukleme: 'yok', rol: 'notr' }),
    nokta('D', -3, 4, 2, { rol: 'seftali', etiket: 'tepe' }),
    // C, D'nin taban vektoru kadar otelenmisi: AB = 7 birim.
    oteleme('C', 'D', 7, 0, 3, { rol: 'seftali' }),
    cokgen('pkenar', ['A', 'B', 'C', 'D'], 4, { rol: 'nane', opaklik: 0.4 }),
    cokgen('ucgen', ['A', 'B', 'D'], 5, { rol: 'gul', opaklik: 0.4 }),
    // Yukseklik: D'nin taban uzerine dikmesi.
    cizgi('taban', 'dogru', 'A', 'B', 6, { rol: 'notr', kalinlik: 1.5 }),
    paralelDik('yukseklikDogru', 'dikme', 'taban', 'D', 7, {
      rol: 'gok',
      cizgiTipi: 'kesik',
      kalinlik: 1.5,
    }),
    kesisim('H', 'taban', 'yukseklikDogru', 8, { rol: 'gok', etiket: 'H' }),
    uzunluk('tabanUz', 'A', 'B', 9, { rol: 'notr', etiket: 'taban' }),
    uzunluk('yukseklik', 'D', 'H', 10, { rol: 'gok', etiket: 'yükseklik' }),
    olcumKaynakli('pAlan', 'olcum_alan', 'pkenar', 11, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(
      1,
      'Taban ve yükseklik',
      'Alt kenar taban, kesikli mavi çizgi yüksekliktir. Yükseklik tabana diktir, kenara değil.',
      ['tabanUz', 'yukseklik'],
    ),
    adim(
      2,
      'Tepeyi yana kaydırın',
      'Tepe noktasını yatay olarak kaydırın: paralelkenar eğrilir ama alan hiç değişmez. Taban da yükseklik de aynı kaldığı için.',
      ['D', 'pAlan'],
    ),
    adim(
      3,
      'Üçgen yarısı kadar',
      'Pembe üçgen aynı tabana ve aynı yüksekliğe sahip. Alanı paralelkenarın tam yarısıdır — bu yüzden üçgende bölü iki vardır.',
      ['ucgen', 'pAlan'],
    ),
  ],
}

// 7) Alan problemleri: L seklinde oda
const L_ODA = {
  slug: 'l-oda-bilesik-alan',
  konuSlug: 's6-alan-problemleri',
  tur: 'gercek_hayat',
  baslik: 'L şeklinde salon: bileşik alan',
  ozet:
    'Her oda dikdörtgen değildir. L şeklindeki bir salonun alanını bulmak için onu iki dikdörtgene ayırmak yeter.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-1, 10, 13, -1], { birim: 'metre' }),
  nesneler: [
    nokta('A', 1, 1, 0, { surukleme: 'yok', rol: 'notr' }),
    nokta('B', 10, 1, 1, { surukleme: 'yok', rol: 'notr' }),
    nokta('C', 10, 4, 2, { rol: 'seftali', etiket: 'girinti' }),
    bilesen('D', 'E', 'C', 3),
    nokta('E', 5, 8, 4, { rol: 'seftali', etiket: 'üst köşe' }),
    bilesen('F', 'A', 'E', 5),
    cokgen('salon', ['A', 'B', 'C', 'D', 'E', 'F'], 6, {
      rol: 'nane',
      opaklik: 0.4,
      etiket: 'salon',
    }),
    olcumKaynakli('alan', 'olcum_alan', 'salon', 7, { rol: 'tereyagi' }),
    olcumKaynakli('cevre', 'olcum_cevre', 'salon', 8, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(
      1,
      'L şeklinde bir salon',
      'Bu oda tek bir dikdörtgen değil. Yine de alanı bulunabilir.',
      ['salon'],
    ),
    adim(
      2,
      'İki dikdörtgene ayırın',
      'Girinti köşesinden yatay bir çizgi geçirdiğinizi düşünün: alt geniş dikdörtgen ile üst dar dikdörtgen. İkisinin alanını toplayın, ölçümle karşılaştırın.',
      ['alan'],
    ),
    adim(
      3,
      'Çevre ayrı hesaplanır',
      'Alan parçalara ayrılıp toplanabilir ama çevre için bütün dış kenarları dolaşmak gerekir. Köşeleri sürükleyip ikisinin farklı davrandığını görün.',
      ['cevre', 'alan'],
    ),
  ],
}

// 8) Cemberin uzunlugu ve pi
const BISIKLET = {
  slug: 'bisiklet-tekerlegi-pi',
  konuSlug: 's6-cemberin-uzunlugu-ve-pi',
  tur: 'gercek_hayat',
  baslik: 'Bisiklet tekerleği: çevre ile çapın oranı',
  ozet:
    'Tekerlek bir tam tur döndüğünde aldığı yol, çemberin uzunluğudur. Tekerleği büyütüp küçültün: çevrenin çapa oranı hiç değişmiyor.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -8]),
  nesneler: [
    nokta('M', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'göbek' }),
    nokta('A', 5, 0, 1, { rol: 'seftali', etiket: 'jant' }),
    karsi('B', 'M', 'A', 2, { rol: 'seftali', etiket: null }),
    cember('teker', 'M', 3, { uzerinde: 'A', rol: 'gok', kalinlik: 3 }),
    cizgi('cap', 'dogru_parcasi', 'A', 'B', 4, { rol: 'seftali', kalinlik: 2 }),
    uzunluk('capUz', 'A', 'B', 5, { rol: 'seftali', etiket: 'çap' }),
    uzunluk('yaricapUz', 'M', 'A', 6, { rol: 'notr', etiket: 'yarıçap' }),
    olcumKaynakli('cevre', 'olcum_cevre', 'teker', 7, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(
      1,
      'Bir tam tur, bir çevre',
      'Tekerlek bir tam tur döndüğünde yerde bıraktığı iz, çemberin uzunluğu kadardır.',
      ['teker', 'cevre'],
    ),
    adim(
      2,
      'Tekerleği büyütün',
      'Jant noktasını sürükleyin. Hem çap hem çevre büyüyor — ama aynı oranda.',
      ['A', 'capUz', 'cevre'],
    ),
    adim(
      3,
      'Çevreyi çapa bölün',
      'Hangi boyutta olursa olsun çevreyi çapa bölün: sonuç hep 3,14 civarında çıkıyor. Bu sabit sayıya pi denir.',
      ['cevre', 'capUz'],
    ),
  ],
}

// 9) Merkez aci ve yay
const PIZZA = {
  slug: 'pizza-merkez-aci-yay',
  konuSlug: 's6-merkez-aci-ve-yay',
  tur: 'gercek_hayat',
  baslik: 'Pizza dilimi: merkez açı ve yay',
  ozet:
    'Dilimin genişliği merkez açıyla, kenardaki kabuk uzunluğu yayla ölçülür. Dilimi büyütüp küçültün: ikisi hep birlikte değişiyor.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-8, 8, 8, -8], { yapisma: 'yok', birim: 'derece' }),
  nesneler: [
    nokta('M', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'merkez' }),
    nokta('A', 6, 0, 1, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('B', 3, 5.2, 2, { rol: 'seftali', etiket: 'kesim' }),
    cember('pizza', 'M', 3, { uzerinde: 'A', rol: 'notr', kalinlik: 2 }),
    // Kesim noktasi cemberin uzerinde kalsin diye yaricap A'dan aliniyor.
    yayDilim('dilim', 'daire_dilimi', 'M', 'A', 'B', 4, { rol: 'gul', opaklik: 0.5 }),
    yayDilim('kabuk', 'yay', 'M', 'A', 'B', 5, { rol: 'seftali', kalinlik: 4 }),
    aci('merkezAci', 'A', 'M', 'B', 6, { rol: 'tereyagi' }),
    uzunluk('yaricapUz', 'M', 'A', 7, { rol: 'notr', etiket: 'yarıçap' }),
  ],
  adimlar: [
    adim(
      1,
      'Dilim bir merkez açıdır',
      'Pizzanın merkezinden çıkan iki kesim çizgisi arasındaki açıya merkez açı denir.',
      ['dilim', 'merkezAci'],
    ),
    adim(
      2,
      'Kabuk yaydır',
      'Dilimin dış kenarındaki kabuk, çemberin bir parçasıdır: yay. Kesim noktasını sürükleyip açıyla birlikte nasıl uzayıp kısaldığını görün.',
      ['kabuk', 'merkezAci'],
    ),
    adim(
      3,
      'Orantılı büyürler',
      'Merkez açı iki katına çıkarsa yay da iki katına çıkar. 360 derece tam çemberdir; 90 derecelik dilim çemberin dörtte biridir.',
      ['merkezAci', 'kabuk'],
    ),
  ],
}

/* --------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's6-paralel-dogrular-ve-kesen',
    sahneSlug: 'yaya-gecidi-paralel-kesen',
    baslik: 'Yol çizgileri ve yaya geçidi',
    hikaye:
      'Şehir planlamasında yol kenarları paralel çizilir, yaya geçitleri onları keser. Geçit yola dik olmak zorunda değildir; eğik geçitlerde bile yöndeş açılar eşit kalır. Bu yüzden geçidin bir ucundaki açıyı ölçmek, diğer ucunu da bilmek demektir — yol işaretlemesi yapan ekip tek ölçümle çalışabilir.',
    soru: 'Geçidi daha eğik yaparsanız hangi açılar büyür? Eşit kalan çiftler hangileridir?',
    olcekAciklama: 'Tahtadaki açılar gerçek derece değerleridir.',
    kaynak: 'MEB kazanımı MAT.6.3.1 — paralel doğru ve kesenle oluşan açılar',
    yasAraligi: '11-13',
  },
  {
    konuSlug: 's6-dortgenlerde-aci-problemleri',
    sahneSlug: 'cati-yamuk-acilari',
    baslik: 'Çatı eğimi ve yamuk açıları',
    hikaye:
      'Çatı kesiti bir yamuktur: tavan ile mahya paraleldir, yan kenarlar eğiktir. Kar yükü fazla olan bölgelerde çatı dikleştirilir, yani yan kenardaki açı büyütülür. Bu değişiklik karşı taraftaki açıyı da zorunlu olarak etkiler; dört açının toplamı hep 360 derecede kalır.',
    soru: 'Çatının bir yanını dikleştirirseniz diğer yandaki açıya ne olur?',
    olcekAciklama: 'Izgaradaki 1 birim yaklaşık 1 metredir.',
    kaynak: 'MEB kazanımı MAT.6.3.4 — dörtgenlerde açı problemleri',
    yasAraligi: '11-13',
  },
  {
    konuSlug: 's6-alan-problemleri',
    sahneSlug: 'l-oda-bilesik-alan',
    baslik: 'L şeklindeki salonun laminatı',
    hikaye:
      'Ev planlarında salonlar sık sık L biçimindedir. Laminat siparişi verirken alan gerekir ve bu alan tek bir çarpımla bulunmaz: oda iki dikdörtgene ayrılır, alanlar toplanır. Süpürgelik için ise çevre lazımdır ve girintili köşeler yüzünden çevre, aynı alandaki dikdörtgen odadan daha uzun çıkar.',
    soru: 'Salonu iki dikdörtgene nasıl ayırırsınız? Her birinin alanı kaç metrekare?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.6.4.3 — alanla modellenen gerçek yaşam durumları',
    yasAraligi: '11-13',
  },
  {
    konuSlug: 's6-cemberin-uzunlugu-ve-pi',
    sahneSlug: 'bisiklet-tekerlegi-pi',
    baslik: 'Tekerlek turu ve alınan yol',
    hikaye:
      'Bisiklet bilgisayarı hız ölçerken tekerleğin kaç tur attığını sayar ve her turu çevre uzunluğuyla çarpar. Bu yüzden kurulumda tekerlek çapını girmeniz istenir: yanlış çap girilirse cihaz yanlış mesafe gösterir. 28 inçlik bir tekerlek bir turda yaklaşık 2,2 metre yol alır.',
    soru: 'Çapı 60 santimetre olan tekerlek bir turda kaç santimetre yol alır?',
    olcekAciklama: 'Izgaradaki 1 birim 10 santimetreye karşılık gelir.',
    kaynak: 'MEB kazanımı MAT.6.4.4 — çember uzunluğu ile çap arasındaki ilişki',
    yasAraligi: '11-13',
  },
  {
    konuSlug: 's6-merkez-aci-ve-yay',
    sahneSlug: 'pizza-merkez-aci-yay',
    baslik: 'Pizzayı eşit bölmek',
    hikaye:
      'Bir pizzayı altı kişiye eşit paylaştırmak, 360 dereceyi altıya bölmek demektir: her dilim 60 derecelik merkez açı alır. Kabuk uzunlukları da eşit olur, çünkü yay uzunluğu merkez açıyla orantılıdır. Sekiz kişiye bölünürse açı 45 dereceye, kabuk da aynı oranda kısalır.',
    soru: 'Pizzayı beş eşit dilime bölmek için her dilimin merkez açısı kaç derece olmalı?',
    olcekAciklama: 'Çember bir pizzayı temsil eder; açı değerleri gerçektir.',
    kaynak: 'MEB kazanımı MAT.6.4.6 — merkez açı ile yay uzunluğu ilişkisi',
    yasAraligi: '11-13',
  },
]

const SORULAR = [
  {
    konuSlug: 's6-paralel-dogrular-ve-kesen',
    sahneSlug: 'yaya-gecidi-paralel-kesen',
    tip: 'coktan_secmeli',
    govde: 'İki paralel doğru bir kesenle kesildiğinde yöndeş açılar için ne söylenebilir?',
    secenekler: [
      'Toplamları 180 derecedir.',
      'Her zaman eşittir.',
      'Her zaman 90 derecedir.',
      'Kesenin eğimine göre değişir.',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Sahnede keseni eğip iki sarı ölçümü izleyin.',
    cozum:
      'Paralellik korunduğu sürece yöndeş açılar eşittir. Toplamı 180 olanlar, kesenin aynı yanındaki iç açılardır.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's6-paralel-dogrular-ve-kesen',
    tip: 'sayisal',
    govde:
      'İki paralel doğru bir kesenle kesiliyor. Yöndeş açılardan biri 118 derece ise diğeri kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 118, tolerans: 0, birim: 'derece' },
    ipucu: 'Yöndeş açılar arasındaki ilişki nedir?',
    cozum: 'Yöndeş açılar eşittir, dolayısıyla diğeri de 118 derecedir.',
    zorluk: 2,
    puan: 1,
  },
  {
    konuSlug: 's6-kosegenlerle-dortgen-insasi',
    sahneSlug: 'kosegenlerle-dortgen',
    tip: 'dogru_yanlis',
    govde: 'Köşegenleri birbirini ortalayan her dörtgen paralelkenardır.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Sahnede uçları sürükleyip şeklin ne zaman bozulduğuna bakın.',
    cozum:
      'Köşegenler birbirini ortalıyorsa karşılıklı kenarlar hem eşit hem paralel olur; bu paralelkenarın tanımıdır. Köşegenler ayrıca eşit uzunluktaysa dikdörtgen, birbirine dikse eşkenar dörtgen çıkar.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's6-dortgenlerde-aci-problemleri',
    sahneSlug: 'cati-yamuk-acilari',
    tip: 'sayisal',
    govde:
      'Bir yamukta üç açı 70, 110 ve 65 derece ise dördüncü açı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 115, tolerans: 0, birim: 'derece' },
    ipucu: 'Dörtgenin iç açıları toplamı kaç derecedir?',
    cozum: '360 − (70 + 110 + 65) = 360 − 245 = 115 derece.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's6-uzunluk-ve-alan-birimleri',
    sahneSlug: 'kenar-iki-kat-alan-dort-kat',
    tip: 'sayisal',
    govde: '1 metrekare kaç santimetrekaredir?',
    cevap: { tip: 'sayisal', deger: 10000, tolerans: 0, birim: 'santimetrekare' },
    ipucu: '1 metre 100 santimetredir; kenarların ikisi de öyle.',
    cozum: '100 cm × 100 cm = 10.000 santimetrekare. Uzunlukta 100 kat, alanda 10.000 kat.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's6-paralelkenar-ve-ucgenin-alani',
    sahneSlug: 'paralelkenar-ucgen-alan',
    tip: 'sayisal',
    govde: 'Tabanı 7, yüksekliği 4 birim olan bir paralelkenarın alanı kaç birim karedir?',
    cevap: { tip: 'sayisal', deger: 28, tolerans: 0, birim: 'birim kare' },
    ipucu: 'Paralelkenar dikdörtgene dönüştürülebilir.',
    cozum: '7 × 4 = 28. Yükseklik kenar değil, tabana dik uzaklıktır.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's6-paralelkenar-ve-ucgenin-alani',
    tip: 'acik_uclu',
    govde:
      'Paralelkenarın tepe kenarını yana kaydırınca alan neden değişmiyor? Sahnede deneyip açıklayın.',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Kaydırma sırasında taban da yükseklik de değişmiyor. Alan yalnızca bu ikisine bağlı olduğu için sabit kalıyor. Şeklin eğik olması alanı etkilemiyor; kesilip taşınan parça diğer tarafı tamamlıyor.',
      anahtarlar: ['taban', 'yükseklik', 'değişmiyor'],
    },
    ipucu: 'Hangi iki ölçü sabit kalıyor?',
    cozum:
      'Paralelkenardan bir üçgen kesip diğer tarafa eklerseniz dikdörtgen elde edersiniz. Taban ve yükseklik aynı olduğu için alan da aynıdır.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's6-cemberin-uzunlugu-ve-pi',
    sahneSlug: 'bisiklet-tekerlegi-pi',
    tip: 'sayisal',
    govde:
      'Çapı 60 santimetre olan bir tekerlek bir turda kaç santimetre yol alır? (π yerine 3 alın.)',
    cevap: { tip: 'sayisal', deger: 180, tolerans: 1, birim: 'santimetre' },
    ipucu: 'Çember uzunluğu = π × çap.',
    cozum: '3 × 60 = 180 santimetre. Gerçek değerde π ≈ 3,14 alınırsa 188,4 santimetre çıkar.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's6-merkez-aci-ve-yay',
    sahneSlug: 'pizza-merkez-aci-yay',
    tip: 'sayisal',
    govde: 'Bir pizzayı beş eşit dilime bölerseniz her dilimin merkez açısı kaç derece olur?',
    cevap: { tip: 'sayisal', deger: 72, tolerans: 0, birim: 'derece' },
    ipucu: 'Tam çember kaç derecedir?',
    cozum: '360 ÷ 5 = 72 derece. Yay uzunlukları da eşit olur.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's6-alan-problemleri',
    sahneSlug: 'l-oda-bilesik-alan',
    tip: 'insa_gorevi',
    govde:
      'Serbest tuvalde L şeklinde bir salon çizin: altı köşeli bir çokgen kurun ve alanını ölçün.',
    cevap: { tip: 'insa_gorevi', beklenen: { polygon: 1 } },
    ipucu: 'Çokgen aracıyla altı nokta koyup Enter’a basın, sonra Alan aracını kullanın.',
    cozum:
      'Altı köşeli çokgen L biçimini verir. Alan aracı bileşik şeklin alanını doğrudan hesaplar; siz de iki dikdörtgene ayırıp toplayarak doğrulayabilirsiniz.',
    zorluk: 3,
    puan: 3,
  },
]

console.log('6. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [
    YAYA_GECIDI,
    RAY_PARALELKENAR,
    KOSEGEN,
    CATI,
    KARO_BIRIM,
    PARALELKENAR_ALAN,
    L_ODA,
    BISIKLET,
    PIZZA,
  ],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n6. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 6)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
