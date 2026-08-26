/**
 * Hazirlik, 1. ve 2. sinif geometri - dokuz sahne.
 *
 * Bu yaslarda mufredatta koordinat duzlemi yok: eksen modu ya 'yok' ya da
 * sade 'izgara'. Adim metinleri kisa ve somut tutuldu; her sahnede tek bir
 * fikir var.
 *
 * Calistir: npm run icerik-ilk1 -w @matgebra/mcp
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
  metin,
  nokta,
  olcumKaynakli,
  otelenmisCokgen,
  uret,
  uzunluk,
  yansima,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-ilk1')

/* --------------------------------------------------------------- sahneler */

const DIKDORTGEN = {
  slug: 'kare-ve-dikdortgen-insa',
  konuSlug: 's0-insa-ve-ozel-dortgenler',
  tur: 'kesif',
  baslik: 'Kare ne zaman kare olur?',
  ozet:
    'Turuncu köşeyi sürükleyin. Dört köşesi de dik kalıyor; en ile boy eşit olduğunda dikdörtgen kareye dönüşüyor.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-8, 7, 8, -7]),
  nesneler: [
    nokta('K1', -5, -4, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('K3', 2, 2, 1, { rol: 'seftali', etiket: 'sürükle' }),
    bilesen('K2', 'K3', 'K1', 2, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('K4', 'K1', 'K3', 3, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('dortgen', ['K1', 'K2', 'K3', 'K4'], 4, { rol: 'nane', opaklik: 0.5 }),
    uzunluk('en', 'K1', 'K2', 5, { rol: 'gok', etiket: 'en' }),
    uzunluk('boy', 'K2', 'K3', 6, { rol: 'gul', etiket: 'boy' }),
    aci('dikKose', 'K3', 'K2', 'K1', 7, { rol: 'tereyagi' }),
    olcumKaynakli('cevre', 'olcum_cevre', 'dortgen', 8, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'Dört köşe de dik', 'Sarı işaret bir köşenin diklik ölçüsü: 90 derece. Sürüklerken hiç değişmiyor.', ['dikKose']),
    adim(2, 'En ve boy', 'İki ölçüm var: en ve boy. Turuncu köşeyi hareket ettirince ikisi de değişiyor.', ['en', 'boy']),
    adim(3, 'Eşitleyin', 'En ile boyu aynı sayıya getirin. İşte o an şekil kare olur. Kare, en ile boyu eşit olan dikdörtgendir.', ['en', 'boy']),
    adim(4, 'Çevre', 'Çevre, dört kenarın toplamıdır. Şekli büyütüp küçültüp çevrenin nasıl değiştiğine bakın.', ['cevre']),
  ],
}

const FRAKTAL = {
  slug: 'ucgenlerden-buyuk-ucgen',
  konuSlug: 's0-fraktallar-ve-kaplamalar',
  tur: 'kesif',
  baslik: 'Üç küçük üçgenden bir büyük üçgen',
  ozet:
    'Aynı üçgenden üç tane yan yana koyun: ortada boş bir üçgen kalarak daha büyük bir üçgen oluşuyor. Küçüğü değiştirin, hepsi birlikte değişsin.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-9, 7, 9, -7]),
  nesneler: [
    nokta('A', -6, -5, 0, { rol: 'nane', etiket: null }),
    nokta('B', -2, -5, 1, { rol: 'nane', etiket: null }),
    nokta('C', -4, -1, 2, { rol: 'nane', etiket: 'sürükle' }),
    cokgen('kucuk', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.6 }),
    ...otelenmisCokgen('sag', ['A', 'B', 'C'], 4, 0, 4, { rol: 'gok', opaklik: 0.6 }),
    ...otelenmisCokgen('ust', ['A', 'B', 'C'], 2, 4, 8, { rol: 'seftali', opaklik: 0.6 }),
    metin('yazi', -1, -6.2, 'Üç parça, ortada bir boşluk', 12, { rol: 'notr' }),
  ],
  adimlar: [
    adim(1, 'Bir üçgen', 'Yeşil üçgen bizim parçamız. Köşesini sürükleyip biçimini değiştirebilirsiniz.', ['kucuk']),
    adim(2, 'Yanına bir tane daha', 'Mavi üçgen, yeşilin tıpatıp aynısı; sadece yana kaydırılmış.', ['sag']),
    adim(3, 'Üstüne bir tane daha', 'Turuncu üçgen de aynısı. Üçü birlikte daha büyük bir üçgen oluşturuyor.', ['ust']),
    adim(4, 'Ortadaki boşluk', 'Ortada baş aşağı duran boş bir üçgen kaldı. Büyük şekil, küçük şeklin büyütülmüş hâli: buna fraktal denir.', ['kucuk', 'sag', 'ust']),
  ],
}

const YONERGE = {
  slug: 'yonergeyle-yol-bulma',
  konuSlug: 's1-yon-konum-ve-yonergeler',
  tur: 'gercek_hayat',
  baslik: 'Yönergeyi takip et, hazineyi bul',
  ozet:
    'Dört yönerge, dört ok. Her ok bir adımı gösteriyor: sağa, yukarı, sağa, yukarı. Sonunda hazineye varıyoruz.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-8, 6, 8, -6]),
  nesneler: [
    nokta('P0', -6, -4, 0, { surukleme: 'yok', rol: 'nane', etiket: 'başla' }),
    nokta('P1', -2, -4, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('P2', -2, 1, 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('P3', 3, 1, 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('P4', 3, 4, 4, { surukleme: 'yok', rol: 'gul', etiket: 'hazine' }),
    cizgi('ok1', 'vektor', 'P0', 'P1', 5, { rol: 'gok', kalinlik: 4 }),
    cizgi('ok2', 'vektor', 'P1', 'P2', 6, { rol: 'seftali', kalinlik: 4 }),
    cizgi('ok3', 'vektor', 'P2', 'P3', 7, { rol: 'gok', kalinlik: 4 }),
    cizgi('ok4', 'vektor', 'P3', 'P4', 8, { rol: 'seftali', kalinlik: 4 }),
    metin('y1', -4.6, -4.8, '4 adım sağa', 9, { rol: 'gok' }),
    metin('y2', -1.6, -1.6, '5 adım yukarı', 10, { rol: 'seftali' }),
    metin('y3', 0.2, 0.3, '5 adım sağa', 11, { rol: 'gok' }),
    metin('y4', 3.3, 2.4, '3 adım yukarı', 12, { rol: 'seftali' }),
  ],
  adimlar: [
    adim(1, 'Başlangıç', 'Yeşil nokta başlangıç yeri. Hazine pembe noktada.', ['P0', 'P4']),
    adim(2, 'Birinci yönerge', 'Dört adım sağa. Mavi ok bunu gösteriyor. Kutucukları sayarak takip edin.', ['ok1', 'y1']),
    adim(3, 'Yukarı ve sağa', 'Sonra beş adım yukarı, beş adım sağa. Her seferinde yön değişiyor.', ['ok2', 'ok3']),
    adim(4, 'Vardık', 'Son üç adım yukarı ve hazine bulundu. Yönergeler aynı sırayla uygulanmalı; sıra değişirse başka yere varılır.', ['ok4', 'P4']),
  ],
}

const ESLIK1 = {
  slug: 'hangisi-es',
  konuSlug: 's1-nesnelerin-esligi',
  tur: 'kesif',
  baslik: 'Hangi ikisi eş?',
  ozet:
    'Üç şekil var. İkisi tıpatıp aynı, biri daha büyük. Üst üste getirilebilenler eştir.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-11, 8, 11, -8]),
  nesneler: [
    // Taban sabit, yalniz tepe surukleniyor: 3. seklin tabani her zaman
    // daha uzun kaliyor, yani "es degil" ornegi hicbir surukleyiste bozulmuyor.
    nokta('A', -8, -4, 0, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('B', -5, -4, 1, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('C', -6.5, 0, 2, { rol: 'nane', etiket: 'sürükle' }),
    cokgen('birinci', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.6, etiket: '1' }),
    ...otelenmisCokgen('ikinci', ['A', 'B', 'C'], 7, 0, 4, {
      rol: 'gok',
      opaklik: 0.6,
      etiket: '2',
    }),
    // Ucuncu sekil bilerek bagimsiz: 1 ve 2 birlikte degisirken 3 sabit
    // kaliyor, boylece "es olmayan" ornek her surukleyiste elde duruyor.
    nokta('A3', 4, -4, 8, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('B3', 9, -4, 9, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('C3', 6.5, 2.7, 10, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    cokgen('ucuncu', ['A3', 'B3', 'C3'], 11, { rol: 'seftali', opaklik: 0.6, etiket: '3' }),
    uzunluk('u1', 'A', 'B', 12, { rol: 'nane', etiket: '1. şekil' }),
    uzunluk('u2', 'ikinci_A', 'ikinci_B', 13, { rol: 'gok', etiket: '2. şekil' }),
    uzunluk('u3', 'A3', 'B3', 14, { rol: 'seftali', etiket: '3. şekil' }),
  ],
  adimlar: [
    adim(1, 'Üç şekil', 'Üçü de üçgen ama hepsi aynı değil.', ['birinci', 'ikinci', 'ucuncu']),
    adim(2, 'Kenarları ölçün', 'Alt kenarların uzunlukları ekranda. 1 ile 2 aynı sayıyı gösteriyor.', ['u1', 'u2', 'u3']),
    adim(3, 'Üçüncüsü farklı', '3. şeklin alt kenarı daha uzun. Bu yüzden diğer ikisiyle üst üste getirilemez, yani eş değildir.', ['u3']),
    adim(4, 'Eşlik ne demek', 'Üst üste konduğunda tam çakışan şekillere eş denir. 1 ile 2 eştir. Yeşil şeklin tepesini sürükleyin: ikisi birlikte değişiyor, eşlik bozulmuyor.', ['birinci', 'ikinci']),
  ],
}

const SEKILLER = {
  slug: 'sekilleri-taniyalim',
  konuSlug: 's2-geometrik-cisimler-ve-sekiller',
  tur: 'kesif',
  baslik: 'Üçgen, kare, dikdörtgen, daire',
  ozet: 'Dört temel şekil yan yana. Kenarlarını ve köşelerini sayın.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-12, 7, 12, -7]),
  nesneler: [
    nokta('U1', -10, -3, 0, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('U2', -6, -3, 1, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('U3', -8, 1, 2, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    cokgen('ucgen', ['U1', 'U2', 'U3'], 3, { rol: 'seftali', opaklik: 0.6 }),
    metin('ucgenAd', -8, -4.4, 'üçgen — 3 kenar', 4, { rol: 'seftali' }),
    nokta('K1', -4, -3, 5, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('K2', 0, -3, 6, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('K3', 0, 1, 7, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('K4', -4, 1, 8, { surukleme: 'yok', rol: 'nane', etiket: null }),
    cokgen('kare', ['K1', 'K2', 'K3', 'K4'], 9, { rol: 'nane', opaklik: 0.6 }),
    metin('kareAd', -2, -4.4, 'kare — 4 eşit kenar', 10, { rol: 'nane' }),
    nokta('D1', 2, -3, 11, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('D2', 7, -3, 12, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('D3', 7, 0, 13, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('D4', 2, 0, 14, { surukleme: 'yok', rol: 'gok', etiket: null }),
    cokgen('dikdortgen', ['D1', 'D2', 'D3', 'D4'], 15, { rol: 'gok', opaklik: 0.6 }),
    metin('dikAd', 4.5, -4.4, 'dikdörtgen — 4 kenar', 16, { rol: 'gok' }),
    nokta('Dm', 10, -1, 17, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('Dr', 12, -1, 18, { surukleme: 'yok', rol: 'gul', etiket: null, gorunur: false }),
    cember('daire', 'Dm', 19, { uzerinde: 'Dr', rol: 'gul', kalinlik: 4 }),
    metin('daireAd', 10, -4.4, 'daire — kenarı yok', 20, { rol: 'gul' }),
  ],
  adimlar: [
    adim(1, 'Üçgen', 'Üç kenarı ve üç köşesi var. Parmağınızla kenarları sayın.', ['ucgen', 'ucgenAd']),
    adim(2, 'Kare ve dikdörtgen', 'İkisinin de dört kenarı, dört köşesi var. Karenin dört kenarı eşit; dikdörtgende karşılıklı kenarlar eşit.', ['kare', 'dikdortgen']),
    adim(3, 'Daire', 'Dairenin köşesi yok, kenarı yok. Tek bir yuvarlak çizgiden oluşuyor.', ['daire', 'daireAd']),
    adim(4, 'Karşılaştırın', 'Köşesi olanlar ve olmayan. Kenar sayısı arttıkça şekil değişiyor.', ['ucgen', 'kare', 'dikdortgen', 'daire']),
  ],
}

const MODEL_EV = {
  slug: 'sekillerden-ev',
  konuSlug: 's2-cisim-ve-sekillerle-modelleme',
  tur: 'gercek_hayat',
  baslik: 'Şekillerden bir ev yapalım',
  ozet:
    'Bir kare gövde, bir üçgen çatı, bir dikdörtgen kapı, bir daire pencere. Çatının tepesini sürükleyip evi değiştirin.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-9, 9, 9, -7]),
  nesneler: [
    nokta('G1', -5, -5, 0, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('G2', 5, -5, 1, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('G3', 5, 2, 2, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('G4', -5, 2, 3, { surukleme: 'yok', rol: 'nane', etiket: null }),
    cokgen('govde', ['G1', 'G2', 'G3', 'G4'], 4, { rol: 'nane', opaklik: 0.55 }),
    nokta('T', 0, 7, 5, { rol: 'seftali', etiket: 'çatı ucu' }),
    cokgen('cati', ['G4', 'G3', 'T'], 6, { rol: 'seftali', opaklik: 0.6 }),
    nokta('Kp1', -2, -5, 7, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('Kp2', 0, -5, 8, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('Kp3', 0, -1, 9, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('Kp4', -2, -1, 10, { surukleme: 'yok', rol: 'gul', etiket: null }),
    cokgen('kapi', ['Kp1', 'Kp2', 'Kp3', 'Kp4'], 11, { rol: 'gul', opaklik: 0.7 }),
    nokta('Pm', 3, -1, 12, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('Pr', 4.2, -1, 13, { surukleme: 'yok', rol: 'gok', etiket: null, gorunur: false }),
    cember('pencere', 'Pm', 14, { uzerinde: 'Pr', rol: 'gok', kalinlik: 4 }),
    metin('liste', 0, -6.3, 'kare + üçgen + dikdörtgen + daire', 15, { rol: 'notr' }),
  ],
  adimlar: [
    adim(1, 'Gövde: kare', 'Evin gövdesi bir kare. Dört kenarı eşit.', ['govde']),
    adim(2, 'Çatı: üçgen', 'Çatı üçgen. Tepe noktasını sürükleyip çatıyı sivriltin ya da yatırın.', ['cati', 'T']),
    adim(3, 'Kapı ve pencere', 'Kapı bir dikdörtgen, pencere bir daire.', ['kapi', 'pencere']),
    adim(4, 'Hepsi bir arada', 'Dört farklı şekilden tek bir model çıktı. Etrafınızdaki eşyaların hangi şekillerden oluştuğuna bakın.', ['liste']),
  ],
}

const ROTA = {
  slug: 'okula-giden-rota',
  konuSlug: 's2-yon-bulma-ve-rota',
  tur: 'gercek_hayat',
  baslik: 'Evden okula giden yol',
  ozet:
    'Evden okula iki farklı yol var. Kareleri sayarak hangisinin daha kısa olduğunu bulun.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -8]),
  nesneler: [
    nokta('Ev', -7, -5, 0, { surukleme: 'yok', rol: 'nane', etiket: 'ev' }),
    nokta('Okul', 6, 4, 1, { surukleme: 'yok', rol: 'gul', etiket: 'okul' }),
    nokta('Park', -7, 4, 2, { surukleme: 'yok', rol: 'seftali', etiket: 'park' }),
    nokta('Firin', 6, -5, 3, { surukleme: 'yok', rol: 'gok', etiket: 'fırın' }),
    cizgi('yolA1', 'vektor', 'Ev', 'Park', 4, { rol: 'seftali', kalinlik: 4 }),
    cizgi('yolA2', 'vektor', 'Park', 'Okul', 5, { rol: 'seftali', kalinlik: 4 }),
    cizgi('yolB1', 'vektor', 'Ev', 'Firin', 6, { rol: 'gok', kalinlik: 4 }),
    cizgi('yolB2', 'vektor', 'Firin', 'Okul', 7, { rol: 'gok', kalinlik: 4 }),
    uzunluk('a1', 'Ev', 'Park', 8, { rol: 'seftali', etiket: 'ev→park' }),
    uzunluk('a2', 'Park', 'Okul', 9, { rol: 'seftali', etiket: 'park→okul' }),
    uzunluk('b1', 'Ev', 'Firin', 10, { rol: 'gok', etiket: 'ev→fırın' }),
    uzunluk('b2', 'Firin', 'Okul', 11, { rol: 'gok', etiket: 'fırın→okul' }),
  ],
  adimlar: [
    adim(1, 'İki yol', 'Turuncu yol parktan, mavi yol fırından geçiyor. İkisi de okula varıyor.', ['yolA1', 'yolA2', 'yolB1', 'yolB2']),
    adim(2, 'Turuncu yolu sayın', 'Önce yukarı, sonra sağa. İki parçanın uzunluğunu toplayın.', ['a1', 'a2']),
    adim(3, 'Mavi yolu sayın', 'Önce sağa, sonra yukarı. Bu iki parçayı da toplayın.', ['b1', 'b2']),
    adim(4, 'Şaşırtıcı sonuç', 'İki toplam da aynı çıkıyor. Sadece sağa ve yukarı gidiliyorsa hangi sırayla gidildiği toplam yolu değiştirmez.', ['a1', 'a2', 'b1', 'b2']),
  ],
}

const SIMETRI2 = {
  slug: 'aynadaki-sekil',
  konuSlug: 's2-simetriyi-tanima',
  tur: 'kesif',
  baslik: 'Aynadaki şekil',
  ozet:
    'Mavi çizgi bir ayna. Soldaki şekli oynatın; sağdaki ayna görüntüsü onu birebir taklit ediyor.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-10, 8, 10, -8]),
  nesneler: [
    nokta('E1', 0, -7, 0, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('E2', 0, 7, 1, { surukleme: 'yok', rol: 'gok', etiket: null }),
    cizgi('ayna', 'dogru', 'E1', 'E2', 2, { rol: 'gok', kalinlik: 3 }),
    nokta('A', -8, -4, 3, { rol: 'nane', etiket: null }),
    nokta('B', -3, -4, 4, { rol: 'nane', etiket: null }),
    nokta('C', -7, 2, 5, { rol: 'nane', etiket: 'sürükle' }),
    cokgen('sekil', ['A', 'B', 'C'], 6, { rol: 'nane', opaklik: 0.6 }),
    yansima('goruntu', 'sekil', 'ayna', 7, { rol: 'gul', opaklik: 0.6 }),
    metin('yaziAyna', 0, 7.4, 'ayna', 8, { rol: 'gok' }),
  ],
  adimlar: [
    adim(1, 'Ayna çizgisi', 'Ortadaki mavi çizgi ayna. Şekiller ona göre karşılıklı duruyor.', ['ayna']),
    adim(2, 'İki şekil aynı büyüklükte', 'Pembe şekil, yeşilin ayna görüntüsü. Büyüklükleri tıpatıp aynı.', ['sekil', 'goruntu']),
    adim(3, 'Ama ters', 'Yeşilin sivri ucu sola bakıyorsa pembeninki sağa bakıyor. Ayna sağ ile solu değiştirir.', ['goruntu']),
    adim(4, 'Aynaya yaklaşın', 'Yeşil şekli aynaya yaklaştırın: görüntüsü de yaklaşıyor. Aynanın üstüne getirin: ikisi çakışıyor.', ['A', 'B', 'C']),
  ],
}

const SIVI = {
  slug: 'surahi-kac-bardak',
  konuSlug: 's2-sivi-olcme',
  tur: 'gercek_hayat',
  baslik: 'Sürahi kaç bardak su alır?',
  ozet:
    'Sürahiyi bardak boyunda dilimlere ayırdık. Dilimleri sayınca sürahinin kaç bardak aldığını buluyoruz.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 9, -8]),
  nesneler: [
    nokta('S1', -6, -6, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('S2', -2, -6, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('S3', -2, 6, 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('S4', -6, 6, 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('surahi', ['S1', 'S2', 'S3', 'S4'], 4, { rol: 'gok', opaklik: 0.45 }),
    nokta('C1', -6, -3, 5, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('C2', -2, -3, 6, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('C3', -6, 0, 7, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('C4', -2, 0, 8, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('C5', -6, 3, 9, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('C6', -2, 3, 10, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('cizgi1', 'dogru_parcasi', 'C1', 'C2', 11, { rol: 'notr', kalinlik: 2, cizgiTipi: 'kesik' }),
    cizgi('cizgi2', 'dogru_parcasi', 'C3', 'C4', 12, { rol: 'notr', kalinlik: 2, cizgiTipi: 'kesik' }),
    cizgi('cizgi3', 'dogru_parcasi', 'C5', 'C6', 13, { rol: 'notr', kalinlik: 2, cizgiTipi: 'kesik' }),
    metin('surahiAd', -4, -7, 'sürahi', 14, { rol: 'gok' }),
    nokta('B1', 3, -6, 15, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B2', 7, -6, 16, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B3', 7, -3, 17, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B4', 3, -3, 18, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('bardak', ['B1', 'B2', 'B3', 'B4'], 19, { rol: 'seftali', opaklik: 0.6 }),
    metin('bardakAd', 5, -7, '1 bardak', 20, { rol: 'seftali' }),
    metin('sonuc', 5, 2, 'sürahi = 4 bardak', 21, { rol: 'gul' }),
  ],
  adimlar: [
    adim(1, 'Bir bardak', 'Sağdaki turuncu dikdörtgen bir bardağı gösteriyor.', ['bardak', 'bardakAd']),
    adim(2, 'Sürahiyi dilimleyin', 'Mavi sürahi, bardak boyunda dilimlere ayrıldı. Kesikli çizgiler dilimleri gösteriyor.', ['surahi', 'cizgi1', 'cizgi2', 'cizgi3']),
    adim(3, 'Dilimleri sayın', 'Alttan üste doğru sayın: bir, iki, üç, dört.', ['surahi']),
    adim(4, 'Sonuç', 'Sürahi 4 bardak su alıyor. Ölçmek, birimi kaç kez tekrarladığımızı saymaktır.', ['sonuc']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's1-yon-konum-ve-yonergeler',
    sahneSlug: 'yonergeyle-yol-bulma',
    baslik: 'Tarif vermek',
    hikaye:
      'Birine yol tarif ederken "düz git, sonra sağa dön" deriz. Yönerge sırayla uygulanır; sıra bozulursa başka yere varılır. Robot süpürgeler ve oyun karakterleri de aynı mantıkla hareket eder: her adım bir yön ve bir miktar içerir.',
    soru: 'Başlangıçtan hazineye ulaşmak için toplam kaç adım atılıyor?',
    olcekAciklama: 'Izgaradaki 1 kutucuk 1 adımdır.',
    kaynak: 'MEB kazanımı MAT.1.3 — yön, konum ve yönergeler',
    yasAraligi: '6-8',
  },
  {
    konuSlug: 's2-yon-bulma-ve-rota',
    sahneSlug: 'okula-giden-rota',
    baslik: 'Şehirdeki sokaklar',
    hikaye:
      'Şehir sokakları çoğu yerde birbirine dik uzanır. Bu yüzden bir yerden başka bir yere giderken sadece sağa ve yukarı doğru ilerlenirse hangi sokaktan gidildiği toplam mesafeyi değiştirmez. Kurye ve kargo şirketleri rota planlarken bu özelliği kullanır: mesafe aynıysa trafiği az olan yol seçilir.',
    soru: 'Evden okula giden iki yolun uzunluğu neden aynı çıkıyor?',
    olcekAciklama: 'Izgaradaki 1 kutucuk 100 metredir.',
    kaynak: 'MEB kazanımı MAT.2.3 — yön bulma ve rota',
    yasAraligi: '7-9',
  },
  {
    konuSlug: 's2-sivi-olcme',
    sahneSlug: 'surahi-kac-bardak',
    baslik: 'Mutfakta ölçmek',
    hikaye:
      'Yemek tariflerinde "2 su bardağı un" yazar. Bardak burada bir ölçü birimidir. Standart olmadığı için herkesin bardağı biraz farklıdır; bu yüzden büyük mutfaklarda litre ve mililitre gibi standart birimler kullanılır. Ölçmenin özü aynıdır: birimi kaç kez tekrarladığımızı saymak.',
    soru: 'Sürahi 4 bardak alıyorsa iki sürahi kaç bardak eder?',
    olcekAciklama: 'Her dilim 1 bardaktır.',
    kaynak: 'MEB kazanımı MAT.2.4 — sıvı ölçme',
    yasAraligi: '7-9',
  },
]

const SORULAR = [
  {
    konuSlug: 's0-insa-ve-ozel-dortgenler',
    sahneSlug: 'kare-ve-dikdortgen-insa',
    tip: 'coktan_secmeli',
    govde: 'Bir dikdörtgen ne zaman kare olur?',
    secenekler: [
      'Köşeleri dik olduğunda',
      'En ile boyu eşit olduğunda',
      'Büyük olduğunda',
      'Kenarları renkli olduğunda',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Sahnede en ile boyu eşitlemeye çalışın.',
    cozum: 'Her dikdörtgenin köşeleri diktir. Kare, ayrıca en ile boyu da eşit olan dikdörtgendir.',
    zorluk: 1,
    puan: 2,
  },
  {
    konuSlug: 's0-fraktallar-ve-kaplamalar',
    sahneSlug: 'ucgenlerden-buyuk-ucgen',
    tip: 'sayisal',
    govde: 'Sahnede kaç tane dolu üçgen var?',
    cevap: { tip: 'sayisal', deger: 3, tolerans: 0 },
    ipucu: 'Renklere bakın: yeşil, mavi, turuncu.',
    cozum: 'Üç dolu üçgen var. Ortadaki boşluk da bir üçgen ama boyanmamış.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's1-yon-konum-ve-yonergeler',
    sahneSlug: 'yonergeyle-yol-bulma',
    tip: 'sayisal',
    govde: 'Başlangıçtan hazineye kadar toplam kaç adım atılıyor?',
    cevap: { tip: 'sayisal', deger: 17, tolerans: 0, birim: 'adım' },
    ipucu: 'Dört yönergedeki sayıları toplayın.',
    cozum: '4 + 5 + 5 + 3 = 17 adım.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's1-nesnelerin-esligi',
    sahneSlug: 'hangisi-es',
    tip: 'coktan_secmeli',
    govde: 'İki şeklin eş olması ne demektir?',
    secenekler: [
      'Renkleri aynıdır',
      'Üst üste konduğunda tam çakışırlar',
      'Yan yana dururlar',
      'Biri diğerinden büyüktür',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: '3. şekil neden eş değil?',
    cozum:
      'Eş şekiller üst üste konduğunda tam çakışır: bütün kenarları ve açıları aynıdır. Renk önemli değildir.',
    zorluk: 1,
    puan: 2,
  },
  {
    konuSlug: 's2-geometrik-cisimler-ve-sekiller',
    sahneSlug: 'sekilleri-taniyalim',
    tip: 'sayisal',
    govde: 'Karenin kaç köşesi vardır?',
    cevap: { tip: 'sayisal', deger: 4, tolerans: 0 },
    ipucu: 'Şeklin sivri uçlarını sayın.',
    cozum: 'Karenin 4 köşesi ve 4 kenarı vardır.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's2-geometrik-cisimler-ve-sekiller',
    tip: 'dogru_yanlis',
    govde: 'Dairenin köşesi yoktur.',
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Dairede sivri uç var mı?',
    cozum: 'Daire tek bir yuvarlak çizgiden oluşur; köşesi ve kenarı yoktur.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's2-cisim-ve-sekillerle-modelleme',
    sahneSlug: 'sekillerden-ev',
    tip: 'coktan_secmeli',
    govde: 'Evin çatısı hangi şekildir?',
    secenekler: ['Kare', 'Üçgen', 'Daire', 'Dikdörtgen'],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Üç kenarı olan şekil hangisi?',
    cozum: 'Çatı üçgendir: üç kenarı ve üç köşesi vardır.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's2-yon-bulma-ve-rota',
    sahneSlug: 'okula-giden-rota',
    tip: 'acik_uclu',
    govde: 'Evden okula giden iki yolun uzunluğu neden aynı çıkıyor?',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'İki yolda da aynı kadar sağa ve aynı kadar yukarı gidiliyor; sadece sırası farklı. Toplam adım sayısı değişmiyor.',
      anahtarlar: ['sağa', 'yukarı', 'aynı', 'sıra'],
    },
    ipucu: 'Her yolda kaç adım sağa, kaç adım yukarı gidiliyor?',
    cozum:
      'Her iki yolda da 13 adım sağa ve 9 adım yukarı gidiliyor. Sıra değişse de toplam aynı kalır.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's2-simetriyi-tanima',
    sahneSlug: 'aynadaki-sekil',
    tip: 'dogru_yanlis',
    govde: 'Ayna görüntüsü, asıl şekilden daha küçüktür.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'İki şeklin büyüklüğünü karşılaştırın.',
    cozum: 'Ayna görüntüsü aynı büyüklüktedir; yalnızca sağ ile sol yer değiştirir.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's2-sivi-olcme',
    sahneSlug: 'surahi-kac-bardak',
    tip: 'sayisal',
    govde: 'Bir sürahi 4 bardak alıyorsa iki sürahi kaç bardak eder?',
    cevap: { tip: 'sayisal', deger: 8, tolerans: 0, birim: 'bardak' },
    ipucu: 'Dört ve dört.',
    cozum: '4 + 4 = 8 bardak.',
    zorluk: 1,
    puan: 1,
  },
]

console.log('HAZIRLIK, 1. VE 2. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [DIKDORTGEN, FRAKTAL, YONERGE, ESLIK1, SEKILLER, MODEL_EV, ROTA, SIMETRI2, SIVI],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\nsahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
