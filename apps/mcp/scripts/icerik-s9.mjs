/**
 * 9. sinif geometri dilimi - bes konu, alti sahne.
 *
 * Tales, Oklid ve Pisagor tek konu basligi altinda toplandigi icin o
 * konuya iki sahne yaziyoruz: bir Tales, bir Oklid.
 *
 * Calistir: npm run icerik-s9 -w @matgebra/mcp
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
  donmusCokgen,
  homotetikCokgen,
  izdusum,
  karsi,
  kesisim,
  nokta,
  olcumKaynakli,
  ortaNokta,
  paralelDik,
  surgu,
  uret,
  uzunluk,
  yayDilim,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-s9')

/* --------------------------------------------------------------- sahneler */

const DIS_ACI = {
  slug: 'ucgende-dis-aci',
  konuSlug: 's9-ucgende-aci-ve-kenar-ozellikleri',
  tur: 'kesif',
  baslik: 'Dış açı, uzaktaki iki iç açının toplamıdır',
  ozet:
    'Bir kenarı uzatınca oluşan dış açı, kendisine komşu olmayan iki iç açının toplamına eşittir. Köşeleri oynatın: eşitlik hiç bozulmuyor.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 8, 17, -7]),
  nesneler: [
    nokta('A', -7, -3, 0, { rol: 'lavanta' }),
    nokta('B', 4, -3, 1, { rol: 'lavanta' }),
    nokta('C', 0, 4, 2, { rol: 'lavanta' }),
    cokgen('ucgen', ['A', 'B', 'C'], 3, { rol: 'nane', opaklik: 0.35 }),
    // AB kenarini B'nin otesine uzatiyoruz: D, B'ye gore A'nin tam karsisi.
    karsi('D', 'B', 'A', 4, { rol: 'notr', etiket: 'D' }),
    cizgi('uzanti', 'dogru_parcasi', 'B', 'D', 5, { rol: 'notr', cizgiTipi: 'kesik' }),
    aci('icA', 'B', 'A', 'C', 6, { rol: 'seftali' }),
    aci('icC', 'A', 'C', 'B', 7, { rol: 'gok' }),
    aci('icB', 'C', 'B', 'A', 8, { rol: 'notr' }),
    aci('disB', 'D', 'B', 'C', 9, { rol: 'tereyagi' }),
  ],
  adimlar: [
    adim(1, 'Kenarı uzatın', 'AB kenarı B’nin ötesine uzatıldı. B köşesinde iki açı var: içteki ve dıştaki.', ['uzanti', 'icB', 'disB']),
    adim(2, 'İç ve dış komşudur', 'B’deki iç açı ile dış açı bir doğru üzerinde yan yana duruyor; toplamları 180 derece.', ['icB', 'disB']),
    adim(3, 'Uzaktaki ikisini toplayın', 'A ve C köşelerindeki açıları toplayın. Sonuç, sarı dış açıya eşit çıkıyor.', ['icA', 'icC', 'disB']),
    adim(4, 'Neden?', 'Üç iç açı 180, iç açı ile dış açı da 180 eder. İkisinden B’deki iç açıyı atınca geriye eşitlik kalır. Köşeleri sürükleyip deneyin.', ['A', 'B', 'C']),
  ],
}

const FIRILDAK = {
  slug: 'firildak-donme',
  konuSlug: 's9-geometrik-donusumler',
  tur: 'gercek_hayat',
  baslik: 'Fırıldak: bir merkez etrafında dönme',
  ozet:
    'Tek bir kanat, merkez etrafında 90’ar derece döndürülünce fırıldak çıkıyor. Kanadı değiştirin: dört kopya da aynı anda değişiyor.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('tam', [-9, 9, 9, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'dönme merkezi' }),
    nokta('P', 6, 1, 1, { rol: 'nane', etiket: 'kanat ucu' }),
    nokta('Q', 2, 5, 2, { rol: 'nane', etiket: 'kanat sırtı' }),
    cokgen('kanat', ['O', 'P', 'Q'], 3, { rol: 'nane', opaklik: 0.55, etiket: null }),
    ...donmusCokgen('kanat2', ['O', 'P', 'Q'], 'O', 90, 4, { rol: 'gok', opaklik: 0.55 }),
    ...donmusCokgen('kanat3', ['O', 'P', 'Q'], 'O', 180, 8, { rol: 'seftali', opaklik: 0.55 }),
    ...donmusCokgen('kanat4', ['O', 'P', 'Q'], 'O', 270, 12, { rol: 'gul', opaklik: 0.55 }),
    cember('yorunge', 'O', 16, { uzerinde: 'P', rol: 'notr', cizgiTipi: 'kesik', kalinlik: 1 }),
    aci('donmeAcisi', 'P', 'O', 'kanat2_P', 17, { rol: 'tereyagi' }),
    uzunluk('yaricapAsil', 'O', 'P', 18, { rol: 'nane', etiket: 'merkeze uzaklık' }),
    uzunluk('yaricapDonuk', 'O', 'kanat2_P', 19, { rol: 'gok', etiket: 'dönmüş halin uzaklığı' }),
  ],
  adimlar: [
    adim(1, 'Tek kanat', 'Yeşil üçgen tek bir kanat. Diğer üçü onun döndürülmüş kopyası.', ['kanat']),
    adim(2, 'Dönme açısı', 'Sarı açı 90 derece: her kopya bir öncekinden çeyrek tur ileride. Dört kopya tam turu tamamlıyor.', ['donmeAcisi']),
    adim(3, 'Uzaklık değişmez', 'Bir nokta dönerken merkeze uzaklığı sabit kalır; bu yüzden bütün kanat uçları aynı çember üzerinde.', ['yorunge', 'yaricapAsil', 'yaricapDonuk']),
    adim(4, 'Kanadı değiştirin', 'Kanat ucunu ya da sırtını sürükleyin. Dört kopya da anında uyum sağlıyor — dönme şekli bozmaz, sadece yerini değiştirir.', ['P', 'Q']),
  ],
}

const BENZERLIK_KOSUL = {
  slug: 'benzerlik-merkezi-aa',
  konuSlug: 's9-eslik-ve-benzerlik-kosullari',
  tur: 'kesif',
  baslik: 'Benzerlik merkezi: aynı açılar, orantılı kenarlar',
  ozet:
    'M noktasından geçen ışınlar üçgeni iki katına büyütüyor. Açılar aynı kalıyor, bütün kenarlar aynı oranda uzuyor — benzerliğin tanımı bu.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-12, 11, 10, -8]),
  nesneler: [
    nokta('M', -9, -5, 0, { surukleme: 'yok', rol: 'notr', etiket: 'benzerlik merkezi' }),
    nokta('A', -5, -2, 1, { rol: 'nane' }),
    nokta('B', -1, -2, 2, { rol: 'nane' }),
    nokta('C', -3, 2, 3, { rol: 'nane' }),
    cokgen('kucuk', ['A', 'B', 'C'], 4, { rol: 'nane', opaklik: 0.5, etiket: 'ABC' }),
    ...homotetikCokgen('buyuk', ['A', 'B', 'C'], 'M', 2, 5, {
      rol: 'gok',
      opaklik: 0.35,
      etiket: "A'B'C'",
      koseGorunur: true,
      koseEtiketleri: ["A'", "B'", "C'"],
    }),
    cizgi('isinA', 'isin', 'M', 'buyuk_A', 9, { rol: 'notr', cizgiTipi: 'kesik', kalinlik: 1 }),
    cizgi('isinB', 'isin', 'M', 'buyuk_B', 10, { rol: 'notr', cizgiTipi: 'kesik', kalinlik: 1 }),
    cizgi('isinC', 'isin', 'M', 'buyuk_C', 11, { rol: 'notr', cizgiTipi: 'kesik', kalinlik: 1 }),
    aci('aciKucuk', 'B', 'A', 'C', 12, { rol: 'tereyagi' }),
    aci('aciBuyuk', 'buyuk_B', 'buyuk_A', 'buyuk_C', 13, { rol: 'tereyagi' }),
    uzunluk('kenarKucuk', 'A', 'B', 14, { rol: 'nane', etiket: 'AB' }),
    uzunluk('kenarBuyuk', 'buyuk_A', 'buyuk_B', 15, { rol: 'gok', etiket: "A'B'" }),
  ],
  adimlar: [
    adim(1, 'Işınlar merkezden çıkıyor', 'Her köşe, merkezden geçen bir ışın üzerinde. Büyük üçgenin köşeleri merkeze iki kat uzakta.', ['isinA', 'isinB', 'isinC']),
    adim(2, 'Açılar değişmiyor', 'A ile A′ köşelerindeki açılar aynı. Büyütme açıyı bozmaz — benzerlikte açılar eşittir.', ['aciKucuk', 'aciBuyuk']),
    adim(3, 'Kenarlar aynı oranda', 'A′B′ hep AB’nin iki katı. Diğer iki kenar için de aynı oran geçerli; bu ortak sayıya benzerlik oranı denir.', ['kenarKucuk', 'kenarBuyuk']),
    adim(4, 'Şekli değiştirin', 'Küçük üçgenin köşelerini sürükleyin. Şekil ne olursa olsun açı eşitliği ve kenar oranı korunuyor.', ['A', 'B', 'C']),
  ],
}

const TALES = {
  slug: 'tales-paralel-oran',
  konuSlug: 's9-tales-oklid-ve-pisagor-teoremleri',
  tur: 'kesif',
  baslik: 'Thales: paralel doğrular kolları aynı oranda böler',
  ozet:
    'Bir noktadan çıkan iki kolu paralel doğrularla kesin. İki kolda oluşan parçaların oranı her zaman aynı çıkar.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 10, 10, -10]),
  nesneler: [
    nokta('O', -8, -5, 0, { surukleme: 'yok', rol: 'notr', etiket: 'O' }),
    nokta('R1', 6, 5, 1, { rol: 'nane', etiket: 'üst kol' }),
    nokta('R2', 7, -4, 2, { rol: 'seftali', etiket: 'alt kol' }),
    cizgi('kol1', 'dogru', 'O', 'R1', 3, { rol: 'nane', kalinlik: 2 }),
    cizgi('kol2', 'dogru', 'O', 'R2', 4, { rol: 'seftali', kalinlik: 2 }),
    // Paralellerin ortak dogrultusu: gorunmeyen dusey kilavuz.
    nokta('K1', -2, -9, 5, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    nokta('K2', -2, 9, 6, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('kilavuz', 'dogru', 'K1', 'K2', 7, { rol: 'notr', gorunur: false }),
    surgu('A', 'kol1', -2, -1, 8, { rol: 'lavanta', etiket: 'A' }),
    paralelDik('paralel1', 'paralel', 'kilavuz', 'A', 9, {
      rol: 'lavanta',
      cizgiTipi: 'kesik',
      kalinlik: 2,
    }),
    kesisim('C', 'paralel1', 'kol2', 10, { rol: 'lavanta', etiket: 'C' }),
    surgu('B', 'kol1', 3, 3, 11, { rol: 'gul', etiket: 'B' }),
    paralelDik('paralel2', 'paralel', 'kilavuz', 'B', 12, {
      rol: 'gul',
      cizgiTipi: 'kesik',
      kalinlik: 2,
    }),
    kesisim('D', 'paralel2', 'kol2', 13, { rol: 'gul', etiket: 'D' }),
    uzunluk('OA', 'O', 'A', 14, { rol: 'lavanta', etiket: 'OA' }),
    uzunluk('OB', 'O', 'B', 15, { rol: 'gul', etiket: 'OB' }),
    uzunluk('OC', 'O', 'C', 16, { rol: 'lavanta', etiket: 'OC' }),
    uzunluk('OD', 'O', 'D', 17, { rol: 'gul', etiket: 'OD' }),
  ],
  adimlar: [
    adim(1, 'İki kol, iki paralel', 'O noktasından iki kol çıkıyor. Mor ve pembe doğrular birbirine paralel ve her iki kolu da kesiyor.', ['kol1', 'kol2', 'paralel1', 'paralel2']),
    adim(2, 'Üst koldaki oran', 'OA’yı OB’ye bölün. Çıkan sayıyı aklınızda tutun.', ['OA', 'OB']),
    adim(3, 'Alt koldaki oran', 'Şimdi OC’yi OD’ye bölün. Aynı sayı çıkıyor — paralel doğrular iki kolu da aynı oranda bölmüş.', ['OC', 'OD']),
    adim(4, 'Her şeyi oynatın', 'Kolların yönünü ve paralellerin yerini değiştirin. İki oran birbirine eşit kalmaya devam ediyor: Thales teoremi bu.', ['R1', 'R2', 'A', 'B']),
  ],
}

const OKLID = {
  slug: 'oklid-dik-ucgende-yukseklik',
  konuSlug: 's9-tales-oklid-ve-pisagor-teoremleri',
  tur: 'kesif',
  baslik: 'Öklid: dik üçgende yükseklik',
  ozet:
    'Çapı gören açı diktir; C noktası yarım çember üzerinde gezerken açı hep 90 derece kalır. Dik köşeden inen yükseklik hipotenüsü ikiye böler ve ortaya iki bağıntı çıkar.',
  zorluk: 5,
  sira: 2,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 11, 10, -6]),
  nesneler: [
    nokta('A', -8, -3, 0, { surukleme: 'yok', rol: 'lavanta' }),
    nokta('B', 8, -3, 1, { rol: 'lavanta' }),
    cizgi('hipotenus', 'dogru', 'A', 'B', 2, { rol: 'notr', kalinlik: 2 }),
    ortaNokta('O', 'A', 'B', 3, { rol: 'notr', etiket: null, gorunur: false }),
    // Ust yarim cember: capi goren aci dik oldugu icin C nerede olursa
    // olsun ACB acisi 90 derece kaliyor.
    // Yayin iki ucu 5'er derece iceri cekildi: C tam A ya da B'ye
    // oturursa ucgen coker ve aci tanimsiz okunur.
    donme('YayBas', 'B', 'O', 5, 4, { rol: 'notr', etiket: null, gorunur: false }),
    donme('YaySon', 'A', 'O', -5, 5, { rol: 'notr', etiket: null, gorunur: false }),
    yayDilim('capYayi', 'yay', 'O', 'YayBas', 'YaySon', 6, {
      rol: 'notr',
      kalinlik: 1,
      opaklik: 0,
    }),
    surgu('C', 'capYayi', 0, 5, 7, { rol: 'seftali', etiket: 'C' }),
    cokgen('ucgen', ['A', 'B', 'C'], 8, { rol: 'nane', opaklik: 0.3 }),
    aci('dikAci', 'A', 'C', 'B', 9, { rol: 'tereyagi' }),
    izdusum('H', 'C', 'hipotenus', 10, { rol: 'gok', etiket: 'H' }),
    cizgi('yukseklik', 'dogru_parcasi', 'C', 'H', 11, { rol: 'gok', kalinlik: 3 }),
    uzunluk('p', 'A', 'H', 12, { rol: 'lavanta', etiket: 'AH' }),
    uzunluk('k', 'H', 'B', 13, { rol: 'gul', etiket: 'HB' }),
    uzunluk('h', 'C', 'H', 14, { rol: 'gok', etiket: 'CH' }),
    uzunluk('b', 'A', 'C', 15, { rol: 'seftali', etiket: 'AC' }),
    uzunluk('a', 'C', 'B', 16, { rol: 'tereyagi', etiket: 'CB' }),
  ],
  adimlar: [
    adim(1, 'Açı hep dik', 'C yarım çember üzerinde geziyor. Nereye götürürseniz götürün ACB açısı 90 derece: çapı gören açı diktir.', ['dikAci', 'capYayi', 'C']),
    adim(2, 'Yükseklik hipotenüsü böler', 'Dik köşeden hipotenüse inen dikme, onu AH ve HB parçalarına ayırıyor.', ['yukseklik', 'p', 'k']),
    adim(3, 'Yükseklik bağıntısı', 'CH ile kendisini çarpın; AH ile HB’nin çarpımına eşit çıkıyor. Öklid’in yükseklik bağıntısı budur.', ['h', 'p', 'k']),
    adim(4, 'Dik kenar bağıntısı', 'AC ile kendisini çarpın; AH ile bütün hipotenüsün çarpımına eşit. Aynısı CB ve HB için de geçerli.', ['b', 'p', 'a', 'k']),
  ],
}

const MAKET = {
  slug: 'maket-olcegi',
  konuSlug: 's9-eslik-ve-benzerlik-problemleri',
  tur: 'gercek_hayat',
  baslik: 'Maket ölçeği: uzunluk yarıya inince alan dörtte bire iner',
  ozet:
    'Bir bina planının yarı ölçekli maketi. Kenarlar yarıya iniyor ama alan dörtte bire — ölçekli çalışmada en çok atlanan nokta bu.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-9, 11, 17, -8], { birim: 'metre' }),
  nesneler: [
    nokta('M', 14, 8, 0, { surukleme: 'yok', rol: 'notr', etiket: 'küçültme merkezi' }),
    nokta('T1', -6, -2, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('T3', 2, 4, 2, { rol: 'nane', etiket: 'plan köşesi' }),
    bilesen('T2', 'T3', 'T1', 3, { rol: 'notr', etiket: null, gorunur: false }),
    bilesen('T4', 'T1', 'T3', 4, { rol: 'notr', etiket: null, gorunur: false }),
    cokgen('plan', ['T1', 'T2', 'T3', 'T4'], 5, { rol: 'nane', opaklik: 0.45, etiket: 'plan' }),
    ...homotetikCokgen('maket', ['T1', 'T2', 'T3', 'T4'], 'M', 0.5, 6, {
      rol: 'gok',
      opaklik: 0.5,
      etiket: 'maket',
    }),
    cizgi('isin1', 'dogru_parcasi', 'M', 'T1', 11, {
      rol: 'notr',
      cizgiTipi: 'kesik',
      kalinlik: 1,
    }),
    cizgi('isin3', 'dogru_parcasi', 'M', 'T3', 12, {
      rol: 'notr',
      cizgiTipi: 'kesik',
      kalinlik: 1,
    }),
    uzunluk('planKenar', 'T1', 'T2', 13, { rol: 'nane', etiket: 'plan kenarı' }),
    uzunluk('maketKenar', 'maket_T1', 'maket_T2', 14, { rol: 'gok', etiket: 'maket kenarı' }),
    olcumKaynakli('planAlan', 'olcum_alan', 'plan', 15, { rol: 'lavanta', etiket: 'plan alanı' }),
    olcumKaynakli('maketAlan', 'olcum_alan', 'maket', 16, { rol: 'gul', etiket: 'maket alanı' }),
  ],
  adimlar: [
    adim(1, 'Plan ve maketi', 'Yeşil dikdörtgen binanın planı, mavi olan yarı ölçekli maketi. Kesikli çizgiler küçültme merkezini gösteriyor.', ['plan', 'maket', 'isin1', 'isin3']),
    adim(2, 'Kenarlar yarıya indi', 'Maket kenarını plan kenarına bölün: 0,5 çıkıyor. Ölçek budur.', ['planKenar', 'maketKenar']),
    adim(3, 'Alan dörtte bire indi', 'Şimdi alanları bölün: 0,25 çıkıyor. Uzunluk oranı yarım ise alan oranı yarımın karesidir.', ['planAlan', 'maketAlan']),
    adim(4, 'Planı değiştirin', 'Plan köşesini sürükleyin. Kenar oranı hep 0,5, alan oranı hep 0,25 kalıyor — şekilden bağımsız bir kural.', ['T3']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's9-geometrik-donusumler',
    sahneSlug: 'firildak-donme',
    baslik: 'Gül pencere ve fırıldak',
    hikaye:
      'Katedrallerin gül pencereleri, camilerin kubbe göbekleri ve çocuk fırıldakları aynı fikirle çizilir: tek bir motif, merkez etrafında eşit açılarla döndürülür. Tasarımcı yalnızca bir dilimi çizer, gerisini dönme üretir. Sekiz kollu bir motifte dönme açısı 360 bölü 8, yani 45 derecedir.',
    soru: 'Altı kollu bir gül pencerede motif kaç derecelik dönmelerle tekrar eder?',
    olcekAciklama: 'Izgaradaki 1 birim, pencerede yaklaşık 20 santimetredir.',
    kaynak: 'MEB kazanımı MAT.9.4.2 — geometrik dönüşümler',
    yasAraligi: '14-16',
  },
  {
    konuSlug: 's9-tales-oklid-ve-pisagor-teoremleri',
    sahneSlug: 'tales-paralel-oran',
    baslik: 'Arsayı paralel yollarla bölmek',
    hikaye:
      'Bir arsa iki yol arasında kalıyor ve paralel sokaklarla parsellere ayrılıyor. Sokaklar paralel olduğu için her parselin iki yol üzerindeki cepheleri aynı oranda bölünür. Kadastro ölçümlerinde bir cephe ölçülüp diğeri orandan hesaplanabilir; Thales teoreminin en eski kullanım alanlarından biri budur.',
    soru: 'Üst kolda OA = 4, OB = 10 birim ölçüldü. Alt kolda OC = 6 ise OD kaç birimdir?',
    olcekAciklama: 'Izgaradaki 1 birim 10 metredir.',
    kaynak: 'MEB kazanımı MAT.9.4.4 — Tales teoremi',
    yasAraligi: '14-16',
  },
  {
    konuSlug: 's9-eslik-ve-benzerlik-problemleri',
    sahneSlug: 'maket-olcegi',
    baslik: 'Maket, halı ve boya hesabı',
    hikaye:
      'Mimarlık bürolarında 1/50 ölçekli maketler yapılır. Maketteki 2 santimetrelik bir duvar gerçekte 1 metredir. Ama zemin için gereken malzeme 50 kat değil 2500 kat fazladır: uzunluk ölçekle, alan ölçeğin karesiyle büyür. Boya, halı ve fayans hesabında bu farkı atlamak ciddi maliyet hatasına yol açar.',
    soru: '1/50 ölçekli maketin taban alanı 40 santimetrekare ise binanın taban alanı kaç metrekaredir?',
    olcekAciklama: 'Izgaradaki 1 birim 1 metredir.',
    kaynak: 'MEB kazanımı MAT.9.4.5 — eşlik ve benzerlik problemleri',
    yasAraligi: '14-16',
  },
]

const SORULAR = [
  {
    konuSlug: 's9-ucgende-aci-ve-kenar-ozellikleri',
    sahneSlug: 'ucgende-dis-aci',
    tip: 'sayisal',
    govde:
      'Bir üçgende iki iç açı 40 ve 65 derece. Üçüncü köşedeki dış açı kaç derecedir?',
    cevap: { tip: 'sayisal', deger: 105, tolerans: 0, birim: 'derece' },
    ipucu: 'Dış açı, kendisine komşu olmayan iki iç açının toplamıdır.',
    cozum:
      '40 + 65 = 105 derece. İstersen uzun yoldan da gidebilirsin: üçüncü iç açı 180 − 105 = 75, dış açı 180 − 75 = 105.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's9-ucgende-aci-ve-kenar-ozellikleri',
    tip: 'dogru_yanlis',
    govde: 'Bir üçgenin dış açısı, ona komşu olan iç açıdan her zaman büyüktür.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'İkisinin toplamı 180. İç açı 90’dan büyükse ne olur?',
    cozum:
      'İç açı ile dış açının toplamı 180’dir. Geniş açılı bir köşede iç açı 90’dan büyük, dış açı 90’dan küçüktür. Doğru olan ifade şudur: dış açı, uzaktaki iki iç açının her birinden büyüktür.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's9-geometrik-donusumler',
    sahneSlug: 'firildak-donme',
    tip: 'sayisal',
    govde: 'Altı kollu bir gül pencerede motif kaç derecelik dönmelerle tekrar eder?',
    cevap: { tip: 'sayisal', deger: 60, tolerans: 0, birim: 'derece' },
    ipucu: 'Tam tur 360 derece, altı eşit paya bölünüyor.',
    cozum: '360 ÷ 6 = 60 derece.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's9-geometrik-donusumler',
    tip: 'coktan_secmeli',
    govde: 'Dönme dönüşümünde aşağıdakilerden hangisi değişir?',
    secenekler: [
      'Kenar uzunlukları',
      'Açı ölçüleri',
      'Şeklin alanı',
      'Şeklin duruş yönü',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 3 },
    ipucu: 'Fırıldağın kanatları aynı büyüklükte mi, aynı yöne mi bakıyor?',
    cozum:
      'Dönme uzunlukları, açıları ve alanı korur; yalnızca şeklin yönelimi (hangi yöne baktığı) değişir. Bu yüzden dönme bir eşlik dönüşümüdür.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's9-eslik-ve-benzerlik-kosullari',
    sahneSlug: 'benzerlik-merkezi-aa',
    tip: 'coktan_secmeli',
    govde: 'İki üçgenin benzer olduğunu göstermek için aşağıdakilerden hangisi yeterlidir?',
    secenekler: [
      'İki açısının eşit olması',
      'Bir kenarının eşit olması',
      'Çevrelerinin eşit olması',
      'Birinin alanının diğerinin iki katı olması',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 0 },
    ipucu: 'Üçgende iki açı bilinirse üçüncüsü de bilinir.',
    cozum:
      'İki açısı eşit olan üçgenlerin üçüncü açıları da eşittir; bu durumda kenarlar orantılı olmak zorundadır. Buna açı-açı (AA) benzerlik koşulu denir.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's9-eslik-ve-benzerlik-kosullari',
    tip: 'sayisal',
    govde:
      'Benzerlik oranı 3 olan iki üçgenden küçüğünün bir kenarı 5 birim. Büyüğünün karşılık gelen kenarı kaç birimdir?',
    cevap: { tip: 'sayisal', deger: 15, tolerans: 0, birim: 'birim' },
    ipucu: 'Her kenar aynı sayıyla çarpılır.',
    cozum: '5 × 3 = 15 birim.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's9-tales-oklid-ve-pisagor-teoremleri',
    sahneSlug: 'tales-paralel-oran',
    tip: 'sayisal',
    govde:
      'Thales kurulumunda OA = 4, OB = 10 ve OC = 6 birim. OD kaç birimdir?',
    cevap: { tip: 'sayisal', deger: 15, tolerans: 0, birim: 'birim' },
    ipucu: 'OA/OB = OC/OD.',
    cozum: '4/10 = 6/OD → 4 × OD = 60 → OD = 15 birim.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's9-tales-oklid-ve-pisagor-teoremleri',
    sahneSlug: 'oklid-dik-ucgende-yukseklik',
    tip: 'sayisal',
    govde:
      'Dik üçgende hipotenüse inen yükseklik, hipotenüsü 4 ve 9 birimlik iki parçaya bölüyor. Yükseklik kaç birimdir?',
    cevap: { tip: 'sayisal', deger: 6, tolerans: 0, birim: 'birim' },
    ipucu: 'Yükseklik bağıntısı: h × h = p × k.',
    cozum: 'h² = 4 × 9 = 36 → h = 6 birim.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's9-tales-oklid-ve-pisagor-teoremleri',
    tip: 'acik_uclu',
    govde:
      'Yarım çember üzerindeki her C noktası için ACB açısının neden 90 derece olduğunu açıklayın.',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Merkez O, AB’nin orta noktası olduğu için OA = OB = OC yarıçaptır. OAC ve OBC üçgenleri ikizkenardır, taban açıları eşittir. Bu iki eşit açı çiftinin toplamı üçgenin açı toplamı 180’in yarısını verir, yani C’deki açı 90 derecedir.',
      anahtarlar: ['yarıçap', 'ikizkenar', '180', '90'],
    },
    ipucu: 'OA, OB ve OC uzunlukları arasında ne var?',
    cozum:
      'Üçü de yarıçap olduğu için eşittir. Oluşan iki ikizkenar üçgenin taban açılarına x ve y dersek, ABC üçgeninde 2x + 2y = 180 olur, buradan x + y = 90. C köşesindeki açı tam olarak x + y’dir.',
    zorluk: 5,
    puan: 4,
  },
  {
    konuSlug: 's9-eslik-ve-benzerlik-problemleri',
    sahneSlug: 'maket-olcegi',
    tip: 'sayisal',
    govde:
      '1/50 ölçekli bir maketin taban alanı 40 santimetrekare. Binanın taban alanı kaç metrekaredir?',
    cevap: { tip: 'sayisal', deger: 100, tolerans: 0, birim: 'metrekare' },
    ipucu: 'Alan oranı, uzunluk oranının karesidir. Sonra santimetrekareyi metrekareye çevirin.',
    cozum:
      'Alan ölçeği 50² = 2500. Gerçek alan 40 × 2500 = 100.000 santimetrekare. 1 metrekare 10.000 santimetrekare olduğuna göre 100.000 ÷ 10.000 = 100 metrekare.',
    zorluk: 5,
    puan: 4,
  },
  {
    konuSlug: 's9-eslik-ve-benzerlik-problemleri',
    tip: 'dogru_yanlis',
    govde:
      'Bir şeklin bütün kenarları iki katına çıkarılırsa çevresi de alanı da iki katına çıkar.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'Sahnedeki iki alan ölçümünü karşılaştırın.',
    cozum:
      'Çevre iki katına çıkar ama alan dört katına çıkar. Uzunluk oranı k iken çevre oranı k, alan oranı k² olur.',
    zorluk: 3,
    puan: 2,
  },
]

console.log('9. SINIF GEOMETRI\n')
await uret(cagir, {
  sahneler: [DIS_ACI, FIRILDAK, BENZERLIK_KOSUL, TALES, OKLID, MAKET],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\n9. sinif:', JSON.stringify(rapor.siniflar.filter((x) => x.seviye === 9)))
console.log('sahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
