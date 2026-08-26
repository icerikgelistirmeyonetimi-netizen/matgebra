/**
 * Olasilik sahneleri - 4. siniftan 10. sinifa, on uc konu.
 *
 * Olasilik deneyleri (zar, para, cark, torba) ayri bir modulde, Laboratuvar
 * gorunumunde kosuluyor. Buradaki sahneler o deneylerin arkasindaki
 * GEOMETRIYI gosteriyor: sayi dogrusu uzerinde bir olasilik nerede durur,
 * bir carkta olasilik neden aci oranidir, kosullu olasilik neden bir
 * dikdortgenin sutununa bakmaktir.
 *
 * Calistir: npm run icerik-olasilik -w @matgebra/mcp
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
  duzgunKoseler,
  metin,
  nokta,
  olcumKaynakli,
  oran,
  surgu,
  uret,
  uzunluk,
  yayDilim,
} from './icerik-ortak.mjs'

const { istemci, cagir } = await baglan('icerik-olasilik')

/**
 * 0 ile 1 arasi olasilik sayi dogrusu.
 * Sol uc x0'da, sag uc x0 + 10'da; boylece 1 birim = 0,1 olasilik.
 */
const sayiDogrusu = (x0, y, sira) => [
  nokta('SD0', x0, y, sira, { surukleme: 'yok', rol: 'notr', etiket: null }),
  nokta('SD1', x0 + 10, y, sira + 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
  cizgi('sayiDogrusu', 'dogru_parcasi', 'SD0', 'SD1', sira + 2, { rol: 'notr', kalinlik: 4 }),
]

/* ---------------------------------------------------------- 4. sinif */

const UC_DURUM = {
  slug: 'imkansiz-olabilir-kesin',
  konuSlug: 's4-imkansiz-olabilir-kesin',
  tur: 'kesif',
  baslik: 'İmkânsız, olabilir, kesin',
  ozet:
    'Bir olayın gerçekleşme şansı bir çizgi üzerinde durur. Sol uçta imkânsız olaylar, sağ uçta kesin olaylar, arada olabilecekler.',
  zorluk: 1,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-2, 5, 12, -5]),
  nesneler: [
    ...sayiDogrusu(0, 0, 0),
    nokta('Imkansiz', 0, 0, 3, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('Ortada', 5, 0, 4, { surukleme: 'yok', rol: 'tereyagi', etiket: null }),
    nokta('Kesin', 10, 0, 5, { surukleme: 'yok', rol: 'nane', etiket: null }),
    metin('t1', 0, -1.2, 'imkânsız', 6, { rol: 'gul' }),
    metin('t2', 5, -1.2, 'eşit şans', 7, { rol: 'tereyagi' }),
    metin('t3', 10, -1.2, 'kesin', 8, { rol: 'nane' }),
    metin('o1', 0, 1.4, 'Zardan 7 gelmesi', 9, { rol: 'gul' }),
    metin('o2', 5, 1.4, 'Paradan tura gelmesi', 10, { rol: 'tereyagi' }),
    metin('o3', 10, 1.4, 'Yarın günün doğması', 11, { rol: 'nane' }),
    surgu('Olay', 'sayiDogrusu', 7, 0, 12, { rol: 'gok', etiket: 'olayınız' }),
    metin('ipucu', 5, -3.2, 'mavi noktayı kaydırın', 13, { rol: 'gok' }),
  ],
  adimlar: [
    adim(1, 'Sol uç: imkânsız', 'Hiçbir zaman olmayacak olaylar en solda durur. Zardan 7 gelemez.', ['Imkansiz', 't1', 'o1']),
    adim(2, 'Sağ uç: kesin', 'Mutlaka olacak olaylar en sağda. Yarın gün doğması kesindir.', ['Kesin', 't3', 'o3']),
    adim(3, 'Orta: eşit şans', 'Para attığınızda tura gelmesi ile gelmemesi aynı şanstadır; tam ortada durur.', ['Ortada', 't2', 'o2']),
    adim(4, 'Kendi olayınızı yerleştirin', 'Mavi noktayı kaydırın. "Sınıftan rastgele seçilen birinin gözlüklü olması" nereye düşer sizce?', ['Olay', 'ipucu']),
  ],
}

const ANKET = {
  slug: 'sinif-anketi-cetele',
  konuSlug: 's4-veriye-dayali-arastirma',
  tur: 'gercek_hayat',
  baslik: 'Sınıf anketi: en sevilen meyve',
  ozet:
    'Yirmi kişilik sınıfta anket yapıldı. Sonuçlar sütun grafiğine döküldü; sütunların yüksekliği kaç kişinin o meyveyi seçtiğini gösteriyor.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-2, 11, 14, -4]),
  nesneler: [
    nokta('E1', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('E2', 13, 0, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cizgi('taban', 'dogru_parcasi', 'E1', 'E2', 2, { rol: 'notr', kalinlik: 3 }),
    nokta('A1', 1, 0, 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('A2', 3, 0, 4, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('A3', 3, 8, 5, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('A4', 1, 8, 6, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('elma', ['A1', 'A2', 'A3', 'A4'], 7, { rol: 'gul', opaklik: 0.7 }),
    metin('elmaAd', 2, -1.2, 'elma 8', 8, { rol: 'gul' }),
    nokta('B1', 4, 0, 9, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B2', 6, 0, 10, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B3', 6, 5, 11, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B4', 4, 5, 12, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('muz', ['B1', 'B2', 'B3', 'B4'], 13, { rol: 'tereyagi', opaklik: 0.7 }),
    metin('muzAd', 5, -1.2, 'muz 5', 14, { rol: 'tereyagi' }),
    nokta('C1', 7, 0, 15, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C2', 9, 0, 16, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C3', 9, 4, 17, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C4', 7, 4, 18, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('cilek', ['C1', 'C2', 'C3', 'C4'], 19, { rol: 'seftali', opaklik: 0.7 }),
    metin('cilekAd', 8, -1.2, 'çilek 4', 20, { rol: 'seftali' }),
    nokta('D1', 10, 0, 21, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D2', 12, 0, 22, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D3', 12, 3, 23, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D4', 10, 3, 24, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('kiraz', ['D1', 'D2', 'D3', 'D4'], 25, { rol: 'nane', opaklik: 0.7 }),
    metin('kirazAd', 11, -1.2, 'kiraz 3', 26, { rol: 'nane' }),
    metin('toplam', 6.5, 10, 'toplam 8 + 5 + 4 + 3 = 20 kişi', 27, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'Sütunları okuyun', 'Her sütun bir meyveyi gösteriyor. Yüksekliği kaç kişinin onu seçtiğini söylüyor.', ['elma', 'muz', 'cilek', 'kiraz']),
    adim(2, 'En çok ve en az', 'En uzun sütun elma: 8 kişi. En kısa sütun kiraz: 3 kişi.', ['elmaAd', 'kirazAd']),
    adim(3, 'Toplam kontrolü', 'Bütün sütunları toplayın: 20 çıkmalı, çünkü sınıf 20 kişilik.', ['toplam']),
    adim(4, 'Olasılığa bağlantı', 'Rastgele seçilen birinin elmayı sevme şansı 20’de 8’dir. Veri toplamak, olasılığı tahmin etmenin ilk adımıdır.', ['elma', 'toplam']),
  ],
}

/* ---------------------------------------------------------- 5. sinif */

const SAYI_DOGRUSU = {
  slug: 'olasilik-sayi-dogrusu',
  konuSlug: 's5-olasilik-sayi-dogrusu',
  tur: 'kesif',
  baslik: 'Olasılığı sayıyla söylemek',
  ozet:
    'Olasılık 0 ile 1 arasında bir sayıdır. Sayı doğrusunu dörde bölüp kesirli değerleri yerleştirin.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-2, 5, 12, -5]),
  nesneler: [
    ...sayiDogrusu(0, 0, 0),
    nokta('P0', 0, 0, 3, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('P25', 2.5, 0, 4, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('P50', 5, 0, 5, { surukleme: 'yok', rol: 'tereyagi', etiket: null }),
    nokta('P75', 7.5, 0, 6, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('P100', 10, 0, 7, { surukleme: 'yok', rol: 'nane', etiket: null }),
    metin('e0', 0, -1.2, '0', 8, { rol: 'gul' }),
    metin('e25', 2.5, -1.2, '1/4', 9, { rol: 'seftali' }),
    metin('e50', 5, -1.2, '1/2', 10, { rol: 'tereyagi' }),
    metin('e75', 7.5, -1.2, '3/4', 11, { rol: 'gok' }),
    metin('e100', 10, -1.2, '1', 12, { rol: 'nane' }),
    metin('u25', 2.5, 1.4, '4 toptan 1’i kırmızı', 13, { rol: 'seftali' }),
    metin('u50', 5, 2.6, 'para: tura', 14, { rol: 'tereyagi' }),
    metin('u75', 7.5, 1.4, '4 toptan 3’ü kırmızı', 15, { rol: 'gok' }),
    surgu('Tahmin', 'sayiDogrusu', 3.3, 0, 16, { rol: 'lavanta', etiket: 'tahmininiz' }),
  ],
  adimlar: [
    adim(1, 'İki uç', '0 imkânsız, 1 kesin demek. Bütün olasılıklar bu ikisinin arasındadır.', ['e0', 'e100']),
    adim(2, 'Yarısı', 'Tam orta nokta 1/2. Para atışında tura gelme olasılığı budur.', ['e50', 'u50']),
    adim(3, 'Çeyrekler', '1/4 ve 3/4 noktaları. Dört toptan biri kırmızıysa kırmızı çekme olasılığı 1/4’tür.', ['e25', 'e75', 'u25', 'u75']),
    adim(4, 'Siz tahmin edin', 'Mor noktayı kaydırıp bir olayın olasılığını tahmin edin. Sayı 0’a yakınsa zor, 1’e yakınsa kolay demektir.', ['Tahmin']),
  ],
}

const AZ_COK = {
  slug: 'carkta-az-ve-cok-olasilik',
  konuSlug: 's5-az-ve-cok-olasilikli-olaylar',
  tur: 'gercek_hayat',
  baslik: 'Çarkta hangi renge daha çok gelir?',
  ozet:
    'Çarkın dilimleri farklı büyüklükte. Bir rengin gelme şansı, o rengin dilim açısıyla doğru orantılıdır.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-10, 9, 10, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D0', 6, 0, 1, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    donme('D180', 'D0', 'O', 180, 2, { rol: 'notr', etiket: null, gorunur: false }),
    donme('D300', 'D0', 'O', 300, 3, { rol: 'notr', etiket: null, gorunur: false }),
    yayDilim('kirmizi', 'daire_dilimi', 'O', 'D0', 'D180', 4, { rol: 'gul', opaklik: 0.65 }),
    yayDilim('mavi', 'daire_dilimi', 'O', 'D180', 'D300', 5, { rol: 'gok', opaklik: 0.65 }),
    yayDilim('sari', 'daire_dilimi', 'O', 'D300', 'D0', 6, { rol: 'tereyagi', opaklik: 0.75 }),
    aci('aciKirmizi', 'D0', 'O', 'D180', 7, { rol: 'gul' }),
    aci('aciMavi', 'D180', 'O', 'D300', 8, { rol: 'gok' }),
    aci('aciSari', 'D300', 'O', 'D0', 9, { rol: 'tereyagi' }),
    metin('bilgi', 0, -7.8, 'olasılık = dilim açısı ÷ 360', 10, { rol: 'notr' }),
    metin('k', 0, 7.6, 'kırmızı 180° → 1/2   mavi 120° → 1/3   sarı 60° → 1/6', 11, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'Üç dilim', 'Çark üç renge bölünmüş ama dilimler eşit değil.', ['kirmizi', 'mavi', 'sari']),
    adim(2, 'Açıları okuyun', 'Kırmızı 180, mavi 120, sarı 60 derece. Toplamları 360 ediyor.', ['aciKirmizi', 'aciMavi', 'aciSari']),
    adim(3, 'En çok olasılıklı', 'En geniş dilim kırmızı, bu yüzden ok en çok kırmızıda durur. Olasılığı 180/360 = 1/2.', ['kirmizi', 'k']),
    adim(4, 'En az olasılıklı', 'En dar dilim sarı: 60/360 = 1/6. Sarıya gelme şansı kırmızının üçte biri kadar.', ['sari', 'bilgi']),
  ],
}

/* ---------------------------------------------------------- 6. sinif */

const HEDEF = {
  slug: 'hedef-tahtasi-alan-olasilik',
  konuSlug: 's6-gozleme-dayali-olasilik-tahmini',
  tur: 'gercek_hayat',
  baslik: 'Hedef tahtası: olasılık bir alan oranıdır',
  ozet:
    'Rastgele atılan bir dart, alanla orantılı olarak dağılır. İç dairenin yarıçapını değiştirip tam ortayı vurma olasılığının nasıl değiştiğini görün.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 9, 10, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'merkez' }),
    nokta('Rdis', 7, 0, 1, { surukleme: 'yok', rol: 'gok', etiket: null }),
    cember('disCember', 'O', 2, { uzerinde: 'Rdis', rol: 'gok', kalinlik: 3 }),
    nokta('Rkenar', 7, 0, 3, { surukleme: 'yok', rol: 'notr', etiket: null, gorunur: false }),
    cizgi('yaricapRay', 'dogru_parcasi', 'O', 'Rkenar', 4, {
      rol: 'notr',
      kalinlik: 1,
      cizgiTipi: 'noktali',
    }),
    surgu('Ric', 'yaricapRay', 3, 0, 5, { rol: 'gul', etiket: 'iç yarıçap' }),
    cember('icCember', 'O', 6, { uzerinde: 'Ric', rol: 'gul', kalinlik: 3 }),
    uzunluk('icOlcu', 'O', 'Ric', 7, { rol: 'gul', etiket: 'iç yarıçap' }),
    uzunluk('disOlcu', 'O', 'Rdis', 8, { rol: 'gok', etiket: 'dış yarıçap' }),
    olcumKaynakli('icAlan', 'olcum_alan', 'icCember', 9, { rol: 'gul', etiket: 'iç alan' }),
    olcumKaynakli('disAlan', 'olcum_alan', 'disCember', 10, { rol: 'gok', etiket: 'toplam alan' }),
    metin('bilgi', 0, -8, 'olasılık = iç alan ÷ toplam alan', 11, { rol: 'notr' }),
  ],
  adimlar: [
    adim(1, 'İki bölge', 'Pembe iç daire ve mavi dış çember. Dart tahtaya rastgele düşüyor.', ['icCember', 'disCember']),
    adim(2, 'Alanları karşılaştırın', 'İç alanı toplam alana bölün. Çıkan sayı, tam ortayı vurma olasılığıdır.', ['icAlan', 'disAlan']),
    adim(3, 'Yarıçapı yarıya indirin', 'İç yarıçapı dış yarıçapın yarısı yapın. Olasılık yarım değil, dörtte bir çıkıyor — çünkü alan yarıçapın karesiyle değişir.', ['Ric', 'icOlcu', 'disOlcu']),
    adim(4, 'Gözlemle karşılaştırın', 'Laboratuvarda çok sayıda atış yaparsanız isabet oranı bu alan oranına yaklaşır. Teorik olasılık ile gözlem böyle buluşur.', ['bilgi']),
  ],
}

/* ---------------------------------------------------------- 7. sinif */

const TUMLEYEN = {
  slug: 'tumleyen-cark',
  konuSlug: 's7-bir-olayin-tumleyeni',
  tur: 'kesif',
  baslik: 'Bir olay ve tümleyeni',
  ozet:
    'Dilimi büyütüp küçültün. Olayın açısı ile tümleyeninin açısı her zaman 360 derece eder; olasılıkları da 1 eder.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-10, 9, 10, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B', 6, 0, 1, { surukleme: 'yok', rol: 'notr', etiket: 'başlangıç' }),
    cember('cember', 'O', 2, { uzerinde: 'B', rol: 'notr', kalinlik: 2, cizgiTipi: 'kesik' }),
    surgu('S', 'cember', -1.9, 5.7, 3, { rol: 'seftali', etiket: 'sürükle' }),
    yayDilim('olay', 'daire_dilimi', 'O', 'B', 'S', 4, { rol: 'gul', opaklik: 0.65 }),
    yayDilim('tumleyen', 'daire_dilimi', 'O', 'S', 'B', 5, { rol: 'gok', opaklik: 0.5 }),
    aci('aciOlay', 'B', 'O', 'S', 6, { rol: 'gul' }),
    aci('aciTumleyen', 'S', 'O', 'B', 7, { rol: 'gok' }),
    metin('bilgi', 0, -8, 'P(A) + P(A′) = 1', 8, { rol: 'lavanta' }),
    metin('ad1', -5, 7.4, 'olay A', 9, { rol: 'gul' }),
    metin('ad2', 5, 7.4, 'tümleyeni A′', 10, { rol: 'gok' }),
  ],
  adimlar: [
    adim(1, 'İki dilim', 'Pembe dilim A olayı, mavi dilim onun tümleyeni. İkisi çemberin tamamını kaplıyor.', ['olay', 'tumleyen']),
    adim(2, 'Açıları toplayın', 'İki açı ölçümünü toplayın: her zaman 360 çıkıyor. Turuncu noktayı sürükleyip deneyin.', ['aciOlay', 'aciTumleyen']),
    adim(3, 'Olasılığa çevirin', 'Her açıyı 360’a bölün. İki olasılığın toplamı 1 eder.', ['bilgi']),
    adim(4, 'Kısayol', 'Bir olayın olasılığını bulmak zorsa tümleyenini hesaplayıp 1’den çıkarmak çoğu zaman daha kolaydır.', ['olay', 'tumleyen']),
  ],
}

const altiKose = duzgunKoseler('Z', 'O', 'Z0', 6, 2, { rol: 'notr', etiketli: false, gorunur: false })

const ESIT_OLASILIK = {
  slug: 'esit-dilimli-cark',
  konuSlug: 's7-esit-olasilikli-olaylar',
  tur: 'kesif',
  baslik: 'Eşit dilimler, eşit şans',
  ozet:
    'Altı eşit dilime bölünmüş çark, bir zarın tam karşılığıdır. Her dilim 60 derece, her sonucun olasılığı 1/6.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-10, 9, 10, -9]),
  nesneler: [
    nokta('O', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('Z0', 6, 0, 1, { rol: 'notr', etiket: null, gorunur: false }),
    ...altiKose.nesneler,
    yayDilim('d1', 'daire_dilimi', 'O', 'Z0', 'Z1', 8, { rol: 'gul', opaklik: 0.6 }),
    yayDilim('d2', 'daire_dilimi', 'O', 'Z1', 'Z2', 9, { rol: 'gok', opaklik: 0.6 }),
    yayDilim('d3', 'daire_dilimi', 'O', 'Z2', 'Z3', 10, { rol: 'nane', opaklik: 0.6 }),
    yayDilim('d4', 'daire_dilimi', 'O', 'Z3', 'Z4', 11, { rol: 'seftali', opaklik: 0.6 }),
    yayDilim('d5', 'daire_dilimi', 'O', 'Z4', 'Z5', 12, { rol: 'tereyagi', opaklik: 0.7 }),
    yayDilim('d6', 'daire_dilimi', 'O', 'Z5', 'Z0', 13, { rol: 'lavanta', opaklik: 0.6 }),
    aci('aciBir', 'Z0', 'O', 'Z1', 14, { rol: 'gul' }),
    metin('bilgi', 0, -8, 'her dilim 60° → her sonucun olasılığı 1/6', 15, { rol: 'notr' }),
  ],
  adimlar: [
    adim(1, 'Altı eşit dilim', 'Çark altı eşit parçaya bölündü. Hiçbiri diğerinden geniş değil.', ['d1', 'd2', 'd3', 'd4', 'd5', 'd6']),
    adim(2, 'Bir dilimin açısı', 'Bir dilimin açısı 60 derece: 360 ÷ 6.', ['aciBir']),
    adim(3, 'Eşit olasılık', 'Dilimler eşit olduğu için her sonucun olasılığı aynı: 1/6. Zar atmakla aynı şey.', ['bilgi']),
    adim(4, 'Neden önemli?', 'Olasılığı "istenen ÷ toplam" diye hesaplamak ancak sonuçlar eşit olasılıklıysa doğrudur. Dilimler farklı olsaydı bu kestirme yanlış olurdu.', ['d1', 'd5']),
  ],
}

const AYRIK = {
  slug: 'ayrik-ve-ortak-olaylar',
  konuSlug: 's7-ayrik-olaylar',
  tur: 'kesif',
  baslik: 'Ayrık olaylar ve kesişen olaylar',
  ozet:
    'İki olay aynı anda gerçekleşemiyorsa ayrıktır; şemada çemberleri hiç kesişmez. Kesişiyorlarsa ortak sonuçları var demektir.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-13, 8, 13, -8]),
  nesneler: [
    nokta('M1', -8.5, 1, 0, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('R1', -6, 1, 1, { surukleme: 'yok', rol: 'gul', etiket: null, gorunur: false }),
    cember('c1', 'M1', 2, { uzerinde: 'R1', rol: 'gul', kalinlik: 3 }),
    nokta('M2', -3.5, 1, 3, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('R2', -1, 1, 4, { surukleme: 'yok', rol: 'gok', etiket: null, gorunur: false }),
    cember('c2', 'M2', 5, { uzerinde: 'R2', rol: 'gok', kalinlik: 3 }),
    metin('a1', -8.5, 1, 'tek sayı', 6, { rol: 'gul' }),
    metin('a2', -3.5, 1, 'çift sayı', 7, { rol: 'gok' }),
    metin('ayrikAd', -6, -3.5, 'AYRIK: ortak sonuç yok', 8, { rol: 'notr' }),
    nokta('M3', 4.5, 1, 9, { surukleme: 'yok', rol: 'seftali', etiket: null }),
    nokta('R3', 7, 1, 10, { surukleme: 'yok', rol: 'seftali', etiket: null, gorunur: false }),
    cember('c3', 'M3', 11, { uzerinde: 'R3', rol: 'seftali', kalinlik: 3 }),
    nokta('M4', 7.5, 1, 12, { surukleme: 'yok', rol: 'nane', etiket: null }),
    nokta('R4', 10, 1, 13, { surukleme: 'yok', rol: 'nane', etiket: null, gorunur: false }),
    cember('c4', 'M4', 14, { uzerinde: 'R4', rol: 'nane', kalinlik: 3 }),
    metin('a3', 3.2, 1, 'tek sayı', 15, { rol: 'seftali' }),
    metin('a4', 8.8, 1, "3'ün katı", 16, { rol: 'nane' }),
    metin('ortakAd', 6, -3.5, 'KESİŞEN: 3 ikisinde de var', 17, { rol: 'notr' }),
    metin('kesisim', 6, 4.4, 'ortak: 3', 18, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'Soldaki şema', 'Zar atışında "tek sayı" ve "çift sayı" olayları. Bir sayı hem tek hem çift olamaz.', ['c1', 'c2', 'a1', 'a2']),
    adim(2, 'Ayrık demek', 'Çemberler hiç kesişmiyor: ortak sonuç yok. Böyle olaylara ayrık olaylar denir.', ['ayrikAd']),
    adim(3, 'Sağdaki şema', 'Şimdi "tek sayı" ile "3’ün katı" olaylarına bakın. 3 sayısı ikisine de uyuyor.', ['c3', 'c4', 'kesisim']),
    adim(4, 'Toplama kuralı', 'Ayrık olaylarda P(A veya B) = P(A) + P(B). Kesişen olaylarda ortak kısım iki kez sayılacağı için bir kez çıkarılır.', ['ayrikAd', 'ortakAd']),
  ],
}

/* ---------------------------------------------------------- 8-9. sinif */

const TEORIK_DENEYSEL = {
  slug: 'teorik-ve-deneysel-olasilik',
  konuSlug: 's8-olasilik-yaklasimlari',
  tur: 'kesif',
  baslik: 'Teorik olasılık ile deneysel olasılık',
  ozet:
    'Teorik olasılık hesapla bulunur ve sabittir. Deneysel olasılık gözlemden gelir ve her denemede biraz oynar; deneme sayısı arttıkça teorik değere yaklaşır.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-2, 6, 12, -6]),
  nesneler: [
    ...sayiDogrusu(0, 0, 0),
    metin('e0', 0, -1.3, '0', 3, { rol: 'notr' }),
    metin('e1', 10, -1.3, '1', 4, { rol: 'notr' }),
    nokta('Teorik', 5, 0, 5, { surukleme: 'yok', rol: 'gul', etiket: null }),
    metin('teorikAd', 5, 1.6, 'teorik: 1/2', 6, { rol: 'gul' }),
    nokta('Ust', 5, 4, 7, { surukleme: 'yok', rol: 'gul', etiket: null, gorunur: false }),
    cizgi('teorikCizgi', 'dogru_parcasi', 'Teorik', 'Ust', 8, {
      rol: 'gul',
      kalinlik: 2,
      cizgiTipi: 'kesik',
    }),
    surgu('Deney10', 'sayiDogrusu', 7, 0, 9, { rol: 'seftali', etiket: '10 atış' }),
    surgu('Deney100', 'sayiDogrusu', 5.8, 0, 10, { rol: 'gok', etiket: '100 atış' }),
    surgu('Deney1000', 'sayiDogrusu', 5.1, 0, 11, { rol: 'nane', etiket: '1000 atış' }),
    uzunluk('sapma10', 'Teorik', 'Deney10', 12, { rol: 'seftali', etiket: 'sapma' }),
    metin('bilgi', 5, -4.4, 'deneme arttıkça sapma küçülür', 13, { rol: 'notr' }),
  ],
  adimlar: [
    adim(1, 'Teorik değer sabit', 'Para atışında tura olasılığı hesapla 1/2 çıkar. Pembe kesikli çizgi bu değeri gösteriyor.', ['Teorik', 'teorikCizgi']),
    adim(2, 'Az denemede sapma büyük', '10 atışta 7 tura gelebilir; deneysel olasılık 0,7 olur. Teorikten epey uzak.', ['Deney10', 'sapma10']),
    adim(3, 'Deneme artınca yaklaşır', '100 atışta 0,58, 1000 atışta 0,51 gibi değerler çıkar. Nokta teorik çizgiye yaklaşıyor.', ['Deney100', 'Deney1000']),
    adim(4, 'Laboratuvarda deneyin', 'Olasılık laboratuvarında para deneyini çalıştırıp atış sayısını artırın; yakınsama grafiği tam olarak bunu gösteriyor.', ['bilgi']),
  ],
}

const FREKANS = {
  slug: 'gozlem-frekans-cubuklari',
  konuSlug: 's9-gozleme-dayali-olasilik',
  tur: 'kesif',
  baslik: 'Altmış zar atışının sonucu',
  ozet:
    'Altı yüzün her biri ortalama 10 kez beklenir. Gerçek sonuçlar bu çizginin biraz altında ve üstünde salınır; sapma rastlantıdır, hile değil.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-2, 16, 15, -4]),
  nesneler: [
    nokta('E1', 0, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('E2', 14, 0, 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cizgi('taban', 'dogru_parcasi', 'E1', 'E2', 2, { rol: 'notr', kalinlik: 3 }),
    nokta('B1', 1, 0, 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B2', 2.8, 0, 4, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B3', 2.8, 9, 5, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('B4', 1, 9, 6, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('c1', ['B1', 'B2', 'B3', 'B4'], 7, { rol: 'gok', opaklik: 0.7 }),
    nokta('C1', 3.2, 0, 8, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C2', 5, 0, 9, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C3', 5, 11, 10, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('C4', 3.2, 11, 11, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('c2', ['C1', 'C2', 'C3', 'C4'], 12, { rol: 'gok', opaklik: 0.7 }),
    nokta('D1', 5.4, 0, 13, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D2', 7.2, 0, 14, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D3', 7.2, 8, 15, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('D4', 5.4, 8, 16, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('c3', ['D1', 'D2', 'D3', 'D4'], 17, { rol: 'gok', opaklik: 0.7 }),
    nokta('F1', 7.6, 0, 18, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('F2', 9.4, 0, 19, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('F3', 9.4, 12, 20, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('F4', 7.6, 12, 21, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('c4', ['F1', 'F2', 'F3', 'F4'], 22, { rol: 'gok', opaklik: 0.7 }),
    nokta('G1', 9.8, 0, 23, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('G2', 11.6, 0, 24, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('G3', 11.6, 10, 25, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('G4', 9.8, 10, 26, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('c5', ['G1', 'G2', 'G3', 'G4'], 27, { rol: 'gok', opaklik: 0.7 }),
    nokta('H1', 12, 0, 28, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('H2', 13.8, 0, 29, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('H3', 13.8, 10, 30, { surukleme: 'yok', rol: 'notr', etiket: null }),
    nokta('H4', 12, 10, 31, { surukleme: 'yok', rol: 'notr', etiket: null }),
    cokgen('c6', ['H1', 'H2', 'H3', 'H4'], 32, { rol: 'gok', opaklik: 0.7 }),
    nokta('T1', 0, 10, 33, { surukleme: 'yok', rol: 'gul', etiket: null, gorunur: false }),
    nokta('T2', 14, 10, 34, { surukleme: 'yok', rol: 'gul', etiket: null, gorunur: false }),
    cizgi('beklenen', 'dogru_parcasi', 'T1', 'T2', 35, {
      rol: 'gul',
      kalinlik: 3,
      cizgiTipi: 'kesik',
    }),
    metin('beklenenAd', 7, 13.4, 'beklenen: her yüz 10 kez', 36, { rol: 'gul' }),
    metin('etiketler', 7, -1.6, '1     2     3     4     5     6', 37, { rol: 'notr' }),
    metin('toplam', 7, 15, '9 + 11 + 8 + 12 + 10 + 10 = 60 atış', 38, { rol: 'lavanta' }),
  ],
  adimlar: [
    adim(1, 'Altmış atış', 'Bir zar 60 kez atıldı. Her sütun bir yüzün kaç kez geldiğini gösteriyor.', ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']),
    adim(2, 'Beklenen çizgi', 'Altı yüz eşit olasılıklı olduğu için her yüzün ortalama 60 ÷ 6 = 10 kez gelmesi beklenir.', ['beklenen', 'beklenenAd']),
    adim(3, 'Sapmalar normal', 'Hiçbir sütun tam 10’da durmuyor. 8 ile 12 arasındaki bu oynama rastlantıdır; zarın hileli olduğu anlamına gelmez.', ['c3', 'c4']),
    adim(4, 'Daha çok atarsak', 'Atış sayısı 600’e çıkarsa sütunlar 100’e çok daha yakın olur. Gözleme dayalı olasılık, deneme arttıkça teorik değere yakınsar.', ['toplam']),
  ],
}

const AGAC = {
  slug: 'sayma-agaci',
  konuSlug: 's9-olasilikta-tumevarim',
  tur: 'kesif',
  baslik: 'Ağaç şeması: sonuçları saymak',
  ozet:
    'İki para arka arkaya atılıyor. Her dal bir seçimi gösteriyor; uçtaki yaprak sayısı bütün olası sonuçların sayısıdır.',
  zorluk: 4,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('yok', [-9, 8, 11, -8]),
  nesneler: [
    nokta('Kok', -7, 0, 0, { surukleme: 'yok', rol: 'notr', etiket: 'başla' }),
    nokta('A1', -1, 4, 1, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('A2', -1, -4, 2, { surukleme: 'yok', rol: 'gul', etiket: null }),
    cizgi('d1', 'dogru_parcasi', 'Kok', 'A1', 3, { rol: 'gok', kalinlik: 3 }),
    cizgi('d2', 'dogru_parcasi', 'Kok', 'A2', 4, { rol: 'gul', kalinlik: 3 }),
    metin('m1', -4, 2.8, 'yazı', 5, { rol: 'gok' }),
    metin('m2', -4, -2.8, 'tura', 6, { rol: 'gul' }),
    nokta('B1', 5, 6, 7, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('B2', 5, 2, 8, { surukleme: 'yok', rol: 'gok', etiket: null }),
    nokta('B3', 5, -2, 9, { surukleme: 'yok', rol: 'gul', etiket: null }),
    nokta('B4', 5, -6, 10, { surukleme: 'yok', rol: 'gul', etiket: null }),
    cizgi('d3', 'dogru_parcasi', 'A1', 'B1', 11, { rol: 'gok', kalinlik: 2 }),
    cizgi('d4', 'dogru_parcasi', 'A1', 'B2', 12, { rol: 'gok', kalinlik: 2 }),
    cizgi('d5', 'dogru_parcasi', 'A2', 'B3', 13, { rol: 'gul', kalinlik: 2 }),
    cizgi('d6', 'dogru_parcasi', 'A2', 'B4', 14, { rol: 'gul', kalinlik: 2 }),
    metin('s1', 7.4, 6, 'YY', 15, { rol: 'gok' }),
    metin('s2', 7.4, 2, 'YT', 16, { rol: 'gok' }),
    metin('s3', 7.4, -2, 'TY', 17, { rol: 'gul' }),
    metin('s4', 7.4, -6, 'TT', 18, { rol: 'gul' }),
    metin('sonuc', 1, 7.4, '2 × 2 = 4 olası sonuç', 19, { rol: 'lavanta' }),
    metin('birOlasilik', 1, -7.4, 'her sonucun olasılığı 1/4', 20, { rol: 'notr' }),
  ],
  adimlar: [
    adim(1, 'İlk atış', 'Başlangıçtan iki dal çıkıyor: yazı ya da tura.', ['d1', 'd2', 'm1', 'm2']),
    adim(2, 'İkinci atış', 'Her daldan yine iki dal çıkıyor. İlk atış ne gelirse gelsin ikincide yine iki seçenek var.', ['d3', 'd4', 'd5', 'd6']),
    adim(3, 'Yaprakları sayın', 'Uçta dört sonuç var: YY, YT, TY, TT. Bu 2 × 2 = 4 demektir.', ['s1', 's2', 's3', 's4', 'sonuc']),
    adim(4, 'Genel kural', 'Üç para atsaydık 2 × 2 × 2 = 8 sonuç olurdu. Her yeni adım, seçenek sayısıyla çarpar. Sonuçlar eşit olasılıklı olduğu için her biri 1/4.', ['birOlasilik']),
  ],
}

/* ---------------------------------------------------------- 10. sinif */

/** Iki olayin dort bolgeye ayrilmis dikdortgen modeli. */
const dortBolge = (sira) => [
  nokta('SL', -8, -6, sira, { surukleme: 'yok', rol: 'notr', etiket: null }),
  nokta('SR', 4, -6, sira + 1, { surukleme: 'yok', rol: 'notr', etiket: null }),
  nokta('UR', 4, 4, sira + 2, { surukleme: 'yok', rol: 'notr', etiket: null }),
  nokta('UL', -8, 4, sira + 3, { surukleme: 'yok', rol: 'notr', etiket: null }),
  cizgi('altKenar', 'dogru_parcasi', 'SL', 'SR', sira + 4, { rol: 'notr', kalinlik: 2 }),
  cizgi('solKenar', 'dogru_parcasi', 'SL', 'UL', sira + 5, { rol: 'notr', kalinlik: 2 }),
  cizgi('sagKenar', 'dogru_parcasi', 'SR', 'UR', sira + 6, { rol: 'notr', kalinlik: 2 }),
  // Dusey ayirici: B olayi solda, tumleyeni sagda.
  surgu('V', 'altKenar', -3, -6, sira + 7, { rol: 'lavanta', etiket: 'B sınırı' }),
  bilesen('Vust', 'V', 'UL', sira + 8, { rol: 'notr', etiket: null, gorunur: false }),
  cizgi('duseyAyirici', 'dogru_parcasi', 'V', 'Vust', sira + 9, { rol: 'lavanta', kalinlik: 3 }),
  // Her sutunda ayri bir yatay ayirici: A olayinin o sutundaki payi.
  surgu('H1', 'solKenar', -8, 0, sira + 10, { rol: 'seftali', etiket: 'A | B' }),
  bilesen('H1sag', 'V', 'H1', sira + 11, { rol: 'notr', etiket: null, gorunur: false }),
  cizgi('solAyirici', 'dogru_parcasi', 'H1', 'H1sag', sira + 12, { rol: 'seftali', kalinlik: 3 }),
  surgu('H2', 'sagKenar', 4, -2, sira + 13, { rol: 'gok', etiket: "A | B′" }),
  bilesen('H2sol', 'V', 'H2', sira + 14, { rol: 'notr', etiket: null, gorunur: false }),
  cizgi('sagAyirici', 'dogru_parcasi', 'H2sol', 'H2', sira + 15, { rol: 'gok', kalinlik: 3 }),
  cokgen('AveB', ['H1', 'H1sag', 'Vust', 'UL'], sira + 16, { rol: 'seftali', opaklik: 0.55 }),
  cokgen('BdegilA', ['SL', 'V', 'H1sag', 'H1'], sira + 17, { rol: 'notr', opaklik: 0.3 }),
  cokgen('AveBtumleyen', ['H2sol', 'H2', 'UR', 'Vust'], sira + 18, { rol: 'gok', opaklik: 0.5 }),
  cokgen('ikisiDeDegil', ['V', 'SR', 'H2', 'H2sol'], sira + 19, { rol: 'notr', opaklik: 0.15 }),
  olcumKaynakli('alanAB', 'olcum_alan', 'AveB', sira + 20, { rol: 'seftali', etiket: 'A ∩ B' }),
  olcumKaynakli('alanB', 'olcum_alan', 'BdegilA', sira + 21, { rol: 'notr', etiket: 'B, A değil' }),
  olcumKaynakli('alanABt', 'olcum_alan', 'AveBtumleyen', sira + 22, { rol: 'gok', etiket: "A ∩ B′" }),
  olcumKaynakli('alanNe', 'olcum_alan', 'ikisiDeDegil', sira + 23, {
    rol: 'notr',
    etiket: 'ikisi de değil',
  }),
]

const KOSULLU = {
  slug: 'kosullu-olasilik-alan-modeli',
  konuSlug: 's10-kosullu-olasilik',
  tur: 'kesif',
  baslik: 'Koşullu olasılık: sadece bir sütuna bakmak',
  ozet:
    'Bütün örneklem uzayı bir dikdörtgen. B olayı sol sütun. P(A|B) sorusu "sol sütunun ne kadarı turuncu?" demektir — sağ sütun artık hiç sayılmaz.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 7, 12, -8]),
  nesneler: [
    ...dortBolge(0),
    metin('etiketB', -5.5, 5.2, 'B olayı', 24, { rol: 'lavanta' }),
    metin('etiketBt', 1, 5.2, "B değil (B′)", 25, { rol: 'notr' }),
    metin('formul', 2, -7.4, 'P(A|B) = (A ∩ B) ÷ B', 26, { rol: 'seftali' }),
  ],
  adimlar: [
    adim(1, 'Örneklem uzayı bir dikdörtgen', 'Bütün olası sonuçlar bu dikdörtgenin içinde. Dikey mor çizgi B olayını ayırıyor: solda B, sağda B değil.', ['duseyAyirici', 'etiketB', 'etiketBt']),
    adim(2, 'A olayı her sütunda ayrı', 'Turuncu ve mavi çizgiler A olayının o sütundaki payını gösteriyor. Turuncu bölge A ile B’nin kesişimi.', ['AveB', 'AveBtumleyen']),
    adim(3, 'Koşullu olasılık', 'P(A|B) için sağ sütunu tamamen unutun. Turuncu alanı, sol sütunun tamamına bölün.', ['alanAB', 'alanB', 'formul']),
    adim(4, 'B sınırını kaydırın', 'Mor çizgiyi sağa sola taşıyın: B büyüyor ya da küçülüyor. Turuncu çizgi aynı yükseklikte kaldığı sürece P(A|B) değişmiyor — çünkü hem pay hem payda aynı oranda değişiyor.', ['V', 'alanAB', 'alanB']),
  ],
}

const BAGIMSIZ = {
  slug: 'bagimli-ve-bagimsiz-olaylar',
  konuSlug: 's10-bagimli-ve-bagimsiz-olaylar',
  tur: 'kesif',
  baslik: 'Bağımsızlık: iki sütunun aynı oranda bölünmesi',
  ozet:
    'A olayı B’den bağımsızsa, B’nin gerçekleşip gerçekleşmemesi A’nın oranını değiştirmez. Ekranda bu, iki yatay çizginin aynı hizaya gelmesi demektir.',
  zorluk: 5,
  sira: 1,
  durum: 'yayin',
  ayar: ayar('izgara', [-10, 7, 12, -8]),
  nesneler: [
    ...dortBolge(0),
    metin('etiketB', -5.5, 5.2, 'B olayı', 24, { rol: 'lavanta' }),
    metin('etiketBt', 1, 5.2, "B değil (B′)", 25, { rol: 'notr' }),
    metin('kural', 2, -7.4, 'aynı hizada ⇒ bağımsız', 26, { rol: 'nane' }),
  ],
  adimlar: [
    adim(1, 'İki sütun, iki oran', 'Turuncu çizgi sol sütunu, mavi çizgi sağ sütunu bölüyor. Her biri kendi sütununda A olayının payını veriyor.', ['solAyirici', 'sagAyirici']),
    adim(2, 'Şu an bağımlı', 'İki çizgi farklı yükseklikte. Demek ki B gerçekleştiğinde A’nın oranı, gerçekleşmediğindekinden farklı: olaylar birbirini etkiliyor.', ['H1', 'H2']),
    adim(3, 'Aynı hizaya getirin', 'Turuncu ve mavi çizgiyi aynı yüksekliğe taşıyın. Artık B’yi bilmek A hakkında hiçbir şey söylemiyor: olaylar bağımsız.', ['H1', 'H2', 'kural']),
    adim(4, 'Çarpma kuralı', 'Bağımsızlıkta P(A ∩ B) = P(A) × P(B) olur. Çizgiler aynı hizadayken turuncu alanın toplam alana oranını hesaplayıp kontrol edin.', ['alanAB', 'alanABt']),
  ],
}

/* ---------------------------------------------------------------- icerik */

const ORNEKLER = [
  {
    konuSlug: 's5-az-ve-cok-olasilikli-olaylar',
    sahneSlug: 'carkta-az-ve-cok-olasilik',
    baslik: 'Piyango çarkı ve ödül dağılımı',
    hikaye:
      'Fuar çarklarında büyük ödülün dilimi hep dardır. Ödülün gelme şansı dilimin açısıyla orantılı olduğu için, 10 derecelik bir dilim 36 çevirmede ortalama bir kez gelir. Çarkı tasarlayan kişi dilim açılarını seçerek olasılıkları doğrudan belirler.',
    soru: 'Bir çarkta büyük ödül dilimi 30 derece ise ödülün gelme olasılığı kaçtır?',
    olcekAciklama: 'Çarkın tamamı 360 derecedir.',
    kaynak: 'MEB kazanımı MAT.5.5 — olasılık',
    yasAraligi: '10-12',
  },
  {
    konuSlug: 's6-gozleme-dayali-olasilik-tahmini',
    sahneSlug: 'hedef-tahtasi-alan-olasilik',
    baslik: 'Dart tahtasında alan hilesi',
    hikaye:
      'Dart tahtasının merkezindeki küçük daire, tahtanın yarıçapının onda biri kadardır; alanı ise yüzde biri. Bu yüzden tam ortayı vurmak, gözle göründüğünden çok daha zordur. Aynı yanılgı fuar oyunlarında da kullanılır: hedef biraz küçültülünce kazanma şansı kareyle azalır.',
    soru: 'Yarıçapı 1 birim olan iç daire, yarıçapı 3 birim olan tahtanın kaçta kaçını kaplar?',
    olcekAciklama: 'Izgaradaki 1 birim, gerçek tahtada yaklaşık 3 santimetredir.',
    kaynak: 'MEB kazanımı MAT.6.5 — olasılık tahmini',
    yasAraligi: '11-13',
  },
  {
    konuSlug: 's10-bagimli-ve-bagimsiz-olaylar',
    sahneSlug: 'bagimli-ve-bagimsiz-olaylar',
    baslik: 'İlaç işe yarıyor mu?',
    hikaye:
      'Bir ilacın etkili olup olmadığı tam olarak bu soruyla sınanır: ilacı alanlarda iyileşme oranı, almayanlardakinden farklı mı? Oranlar aynıysa ilaç ile iyileşme bağımsızdır, yani ilacın etkisi yoktur. Klinik araştırmalar bu iki oranı karşılaştırmak üzere kurulur; ekrandaki iki yatay çizgi tam olarak o iki oranı temsil ediyor.',
    soru: 'İki sütundaki oran aynı çıkarsa ilaç hakkında ne söylenir?',
    olcekAciklama: 'Dikdörtgenin tamamı bütün hastaları temsil eder.',
    kaynak: 'MEB kazanımı MAT.10.5 — bağımlı ve bağımsız olaylar',
    yasAraligi: '15-17',
  },
]

const SORULAR = [
  {
    konuSlug: 's4-imkansiz-olabilir-kesin',
    sahneSlug: 'imkansiz-olabilir-kesin',
    tip: 'coktan_secmeli',
    govde: 'Bir zar atıldığında 7 gelmesi nasıl bir olaydır?',
    secenekler: ['Kesin', 'İmkânsız', 'Olabilir', 'Çok olasılıklı'],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Zarın yüzlerinde hangi sayılar var?',
    cozum: 'Zarda 1’den 6’ya kadar sayılar vardır; 7 hiç yoktur. Bu yüzden imkânsız bir olaydır.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's4-veriye-dayali-arastirma',
    sahneSlug: 'sinif-anketi-cetele',
    tip: 'sayisal',
    govde: 'Grafikte elma 8, muz 5, çilek 4, kiraz 3 kişi. Ankete kaç kişi katılmıştır?',
    cevap: { tip: 'sayisal', deger: 20, tolerans: 0, birim: 'kişi' },
    ipucu: 'Bütün sütunları toplayın.',
    cozum: '8 + 5 + 4 + 3 = 20 kişi.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-olasilik-sayi-dogrusu',
    sahneSlug: 'olasilik-sayi-dogrusu',
    tip: 'coktan_secmeli',
    govde: 'Bir olasılık değeri aşağıdakilerden hangisi olamaz?',
    secenekler: ['0', '1/2', '1', '3/2'],
    cevap: { tip: 'coktan_secmeli', dogru: 3 },
    ipucu: 'Sayı doğrusu nerede başlayıp nerede bitiyor?',
    cozum: 'Olasılık 0 ile 1 arasındadır. 3/2 = 1,5 olduğu için olasılık olamaz.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-az-ve-cok-olasilikli-olaylar',
    sahneSlug: 'carkta-az-ve-cok-olasilik',
    tip: 'sayisal',
    govde: 'Bir çarkta büyük ödül dilimi 30 derece. Ödülün gelme olasılığı kaçta kaçtır? Paydayı yazın.',
    cevap: { tip: 'sayisal', deger: 12, tolerans: 0 },
    ipucu: '360’ı 30’a bölün.',
    cozum: '30/360 = 1/12. Yani payda 12’dir.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's6-gozleme-dayali-olasilik-tahmini',
    sahneSlug: 'hedef-tahtasi-alan-olasilik',
    tip: 'sayisal',
    govde:
      'Yarıçapı 1 birim olan iç daire, yarıçapı 3 birim olan tahtanın kaçta biridir? Paydayı yazın.',
    cevap: { tip: 'sayisal', deger: 9, tolerans: 0 },
    ipucu: 'Alanlar yarıçapın karesiyle orantılıdır.',
    cozum: 'Alan oranı (1/3)² = 1/9. İç daire tahtanın dokuzda biridir.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's7-bir-olayin-tumleyeni',
    sahneSlug: 'tumleyen-cark',
    tip: 'sayisal',
    govde: 'Bir olayın olasılığı 0,3 ise tümleyeninin olasılığı kaçtır?',
    cevap: { tip: 'sayisal', deger: 0.7, tolerans: 0.001 },
    ipucu: 'İkisinin toplamı 1.',
    cozum: '1 − 0,3 = 0,7.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's7-esit-olasilikli-olaylar',
    sahneSlug: 'esit-dilimli-cark',
    tip: 'dogru_yanlis',
    govde:
      '"İstenen sonuç sayısı bölü toplam sonuç sayısı" formülü her durumda doğru olasılığı verir.',
    cevap: { tip: 'dogru_yanlis', dogru: false },
    ipucu: 'Dilimleri eşit olmayan bir çark düşünün.',
    cozum:
      'Bu formül ancak bütün sonuçlar eşit olasılıklıysa geçerlidir. Dilimleri farklı bir çarkta sonuçları saymak yanlış cevap verir; açı oranına bakmak gerekir.',
    zorluk: 4,
    puan: 3,
  },
  {
    konuSlug: 's7-ayrik-olaylar',
    sahneSlug: 'ayrik-ve-ortak-olaylar',
    tip: 'coktan_secmeli',
    govde: 'Bir zar atışında hangi iki olay ayrıktır?',
    secenekler: [
      'Tek sayı gelmesi ve 3 gelmesi',
      'Çift sayı gelmesi ve 3’ten büyük gelmesi',
      'Tek sayı gelmesi ve çift sayı gelmesi',
      '2 gelmesi ve çift sayı gelmesi',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 2 },
    ipucu: 'Aynı anda gerçekleşemeyen olayları arayın.',
    cozum:
      'Bir sayı aynı anda hem tek hem çift olamaz; bu iki olayın ortak sonucu yoktur, yani ayrıktır. Diğer seçeneklerin hepsinde ortak sonuç vardır.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's8-olasilik-yaklasimlari',
    sahneSlug: 'teorik-ve-deneysel-olasilik',
    tip: 'acik_uclu',
    govde:
      'Bir parayı 10 kez atıp 7 tura elde ettiniz. Bu, paranın hileli olduğunu gösterir mi?',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Göstermez. Az sayıda denemede deneysel olasılık teorik değerden epey sapabilir. Karar vermek için atış sayısını çok artırmak gerekir; deneme arttıkça oran 0,5’e yaklaşır.',
      anahtarlar: ['az', 'sapma', 'artır', '0,5'],
    },
    ipucu: 'Sahnede 10, 100 ve 1000 atışın noktalarını karşılaştırın.',
    cozum:
      '10 atışta 7 tura hiç şaşırtıcı değildir. Deneysel olasılık ancak çok sayıda denemede teorik değere yakınsar; 10 deneme bir yargıya varmak için yetersizdir.',
    zorluk: 4,
    puan: 4,
  },
  {
    konuSlug: 's9-gozleme-dayali-olasilik',
    sahneSlug: 'gozlem-frekans-cubuklari',
    tip: 'sayisal',
    govde: 'Bir zar 300 kez atılırsa her yüzün kaç kez gelmesi beklenir?',
    cevap: { tip: 'sayisal', deger: 50, tolerans: 0, birim: 'kez' },
    ipucu: '300’ü yüz sayısına bölün.',
    cozum: '300 ÷ 6 = 50 kez. Gerçek sonuçlar bu değerin etrafında salınır.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's9-olasilikta-tumevarim',
    sahneSlug: 'sayma-agaci',
    tip: 'sayisal',
    govde: 'Üç para arka arkaya atılırsa kaç farklı sonuç oluşur?',
    cevap: { tip: 'sayisal', deger: 8, tolerans: 0 },
    ipucu: 'Her atış seçenek sayısıyla çarpar.',
    cozum: '2 × 2 × 2 = 8 farklı sonuç.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's10-kosullu-olasilik',
    sahneSlug: 'kosullu-olasilik-alan-modeli',
    tip: 'acik_uclu',
    govde:
      'P(A|B) hesaplanırken B′ sütunu neden hiç hesaba katılmaz?',
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Çünkü B’nin gerçekleştiğini zaten biliyoruz. Örneklem uzayı artık bütün dikdörtgen değil, sadece B sütunu. B′ sütunundaki sonuçlar mümkün olmaktan çıktığı için paydaya girmez.',
      anahtarlar: ['biliyoruz', 'örneklem', 'sütun', 'payda'],
    },
    ipucu: 'Koşul, hangi sonuçların hâlâ mümkün olduğunu değiştirir.',
    cozum:
      'Koşullu olasılıkta örneklem uzayı daralır: B gerçekleştiğine göre yalnız B içindeki sonuçlar mümkündür. Bu yüzden payda B’nin tamamı, pay ise A ile B’nin kesişimidir.',
    zorluk: 5,
    puan: 4,
  },
  {
    konuSlug: 's10-bagimli-ve-bagimsiz-olaylar',
    sahneSlug: 'bagimli-ve-bagimsiz-olaylar',
    tip: 'coktan_secmeli',
    govde: 'A ve B olayları bağımsızsa aşağıdakilerden hangisi doğrudur?',
    secenekler: [
      'P(A ∩ B) = P(A) + P(B)',
      'P(A ∩ B) = P(A) × P(B)',
      'P(A ∩ B) = 0',
      'P(A|B) = 0',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Bağımsızlıkta P(A|B) = P(A) olur.',
    cozum:
      'Bağımsızlıkta P(A|B) = P(A) olduğundan P(A ∩ B) = P(A|B) × P(B) = P(A) × P(B) çıkar. Kesişimin sıfır olması ayrıklıktır, bağımsızlık değildir.',
    zorluk: 4,
    puan: 3,
  },
]

console.log('OLASILIK SAHNELERI\n')
await uret(cagir, {
  sahneler: [
    UC_DURUM,
    ANKET,
    SAYI_DOGRUSU,
    AZ_COK,
    HEDEF,
    TUMLEYEN,
    ESIT_OLASILIK,
    AYRIK,
    TEORIK_DENEYSEL,
    FREKANS,
    AGAC,
    KOSULLU,
    BAGIMSIZ,
  ],
  ornekler: ORNEKLER,
  sorular: SORULAR,
})

const rapor = JSON.parse(await cagir('kapsama_raporu'))
console.log('\nsahnesiz konu:', rapor.sahnesizKonuSayisi)

await istemci.close()
