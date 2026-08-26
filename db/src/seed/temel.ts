/**
 * Temel tohum verisi: alanlar, pastel stiller, arac cubugu, moduller.
 *
 * Renkler burada onalti tabanli deger olarak degil, palet rolu olarak durur.
 * Gercek renk degerleri arayuzdeki tek CSS dosyasindaki @theme bloğunda
 * tanimlidir; motor onlari palet.ts uzerinden okur. Boylece renk icin tek
 * bir kaynak kalir.
 */

export const ALANLAR = [
  { slug: 'geometri', ad: 'Geometri', renkAnahtari: 'gok', sira: 1 },
  { slug: 'olasilik', ad: 'Olasılık', renkAnahtari: 'gul', sira: 2 },
] as const

/**
 * Pastel stil kumesi.
 *
 * Kural: dolgu pastel, kenar koyu. Pastel tonlar dolgu olarak guzel ama
 * cizgi ve yazi olarak okunmaz; her rolun koyu kardesi kenarda kullanilir.
 */
export const STILLER = [
  { ad: 'nokta', rol: 'lavanta', kalinlik: 2, noktaBoyutu: 5, cizgiTipi: 'duz', opaklik: 1 },
  { ad: 'nokta-bagli', rol: 'lavanta', kalinlik: 2, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 0.9 },
  { ad: 'nokta-sabit', rol: 'notr', kalinlik: 2, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 1 },
  { ad: 'dogru', rol: 'gok', kalinlik: 2, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 1 },
  { ad: 'dogru-yardimci', rol: 'gok', kalinlik: 1.5, noktaBoyutu: 4, cizgiTipi: 'kesik', opaklik: 0.75 },
  { ad: 'cokgen', rol: 'nane', kalinlik: 2, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 0.45 },
  { ad: 'cember', rol: 'nane', kalinlik: 2, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 1 },
  { ad: 'aci', rol: 'seftali', kalinlik: 1.5, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 0.7 },
  { ad: 'olcum', rol: 'seftali', kalinlik: 1.5, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 1 },
  { ad: 'vurgu', rol: 'tereyagi', kalinlik: 3, noktaBoyutu: 6, cizgiTipi: 'duz', opaklik: 1 },
  { ad: 'olasilik', rol: 'gul', kalinlik: 2, noktaBoyutu: 4, cizgiTipi: 'duz', opaklik: 0.6 },
  { ad: 'silik', rol: 'notr', kalinlik: 1, noktaBoyutu: 3, cizgiTipi: 'noktali', opaklik: 0.5 },
] as const

/**
 * Arac cubugu.
 *
 * minSinif alani araclari sinif seviyesine gore suzer: 2. sinif ogrencisi
 * teget aracini gormez. Suzme kurali koda degil veriye gomulur ki
 * yonetim paneli geldiginde degistirilebilsin.
 */
export const ARACLAR = [
  // temel
  { anahtar: 'sec', etiket: 'Seç ve taşı', grup: 'temel', ikon: 'imlec', minSinif: 1, kisayol: 'V', sira: 1 },
  { anahtar: 'nokta', etiket: 'Nokta', grup: 'temel', ikon: 'nokta', minSinif: 1, kisayol: 'N', sira: 2 },
  { anahtar: 'nokta_uzerinde', etiket: 'Nesne üzerinde nokta', grup: 'temel', ikon: 'nokta-uzeri', minSinif: 3, kisayol: 'U', sira: 3 },
  { anahtar: 'dogru_parcasi', etiket: 'Doğru parçası', grup: 'temel', ikon: 'parca', minSinif: 1, kisayol: 'D', sira: 4 },
  { anahtar: 'isin', etiket: 'Işın', grup: 'temel', ikon: 'isin', minSinif: 4, kisayol: 'I', sira: 5 },
  { anahtar: 'dogru', etiket: 'Doğru', grup: 'temel', ikon: 'dogru', minSinif: 4, kisayol: 'G', sira: 6 },
  // sekil
  { anahtar: 'cokgen', etiket: 'Çokgen', grup: 'sekil', ikon: 'cokgen', minSinif: 2, kisayol: 'P', sira: 10 },
  { anahtar: 'duzgun_cokgen', etiket: 'Düzgün çokgen', grup: 'sekil', ikon: 'altigen', minSinif: 5, sira: 11 },
  { anahtar: 'cember_merkez_nokta', etiket: 'Çember (merkez + nokta)', grup: 'sekil', ikon: 'cember-merkez-nokta', minSinif: 2, kisayol: 'C', sira: 12 },
  { anahtar: 'cember_yaricap', etiket: 'Çember (merkez + yarıçap)', grup: 'sekil', ikon: 'cember-yaricap', minSinif: 5, sira: 13 },
  { anahtar: 'cember_uc_nokta', etiket: 'Çember (üç nokta)', grup: 'sekil', ikon: 'cember-uc-nokta', minSinif: 7, sira: 14 },
  { anahtar: 'yay', etiket: 'Yay', grup: 'sekil', ikon: 'yay', minSinif: 6, sira: 15 },
  { anahtar: 'daire_dilimi', etiket: 'Daire dilimi', grup: 'sekil', ikon: 'daire-dilimi', minSinif: 7, sira: 16 },
  // insa
  { anahtar: 'orta_nokta', etiket: 'Orta nokta', grup: 'insa', ikon: 'orta-nokta', minSinif: 5, sira: 20 },
  { anahtar: 'dikme', etiket: 'Dikme', grup: 'insa', ikon: 'dikme', minSinif: 5, sira: 21 },
  { anahtar: 'paralel', etiket: 'Paralel', grup: 'insa', ikon: 'paralel', minSinif: 6, sira: 22 },
  { anahtar: 'orta_dikme', etiket: 'Orta dikme', grup: 'insa', ikon: 'orta-dikme', minSinif: 7, sira: 23 },
  { anahtar: 'aci_ortay', etiket: 'Açıortay', grup: 'insa', ikon: 'aci-ortay', minSinif: 7, sira: 24 },
  { anahtar: 'kesisim', etiket: 'Kesişim', grup: 'insa', ikon: 'kesisim', minSinif: 5, sira: 25 },
  { anahtar: 'teget', etiket: 'Teğet', grup: 'insa', ikon: 'teget', minSinif: 12, sira: 26 },
  // olcum
  { anahtar: 'olcum_uzunluk', etiket: 'Uzunluk', grup: 'olcum', ikon: 'cetvel', minSinif: 3, sira: 30 },
  { anahtar: 'olcum_aci', etiket: 'Açı', grup: 'olcum', ikon: 'iletki', minSinif: 4, sira: 31 },
  { anahtar: 'olcum_alan', etiket: 'Alan', grup: 'olcum', ikon: 'olcum-alan', minSinif: 4, sira: 32 },
  { anahtar: 'olcum_cevre', etiket: 'Çevre', grup: 'olcum', ikon: 'olcum-cevre', minSinif: 3, sira: 33 },
  { anahtar: 'olcum_egim', etiket: 'Eğim', grup: 'olcum', ikon: 'egim', minSinif: 10, sira: 34 },
  // donusum
  { anahtar: 'oteleme', etiket: 'Öteleme', grup: 'donusum', ikon: 'oteleme', minSinif: 8, sira: 40 },
  { anahtar: 'yansima', etiket: 'Yansıma', grup: 'donusum', ikon: 'yansima', minSinif: 4, sira: 41 },
  { anahtar: 'dondurme', etiket: 'Döndürme', grup: 'donusum', ikon: 'donme', minSinif: 9, sira: 42 },
  { anahtar: 'homoteti', etiket: 'Benzerlik (homoteti)', grup: 'donusum', ikon: 'homoteti', minSinif: 9, sira: 43 },
  // ileri
  { anahtar: 'vektor', etiket: 'Vektör', grup: 'ileri', ikon: 'vektor', minSinif: 9, sira: 50 },
  { anahtar: 'fonksiyon', etiket: 'Fonksiyon grafiği', grup: 'ileri', ikon: 'grafik', minSinif: 9, sira: 51 },
  { anahtar: 'kaydirici', etiket: 'Kaydırıcı', grup: 'ileri', ikon: 'kaydirici', minSinif: 6, sira: 52 },
  { anahtar: 'egri_yeri', etiket: 'Eğri yeri', grup: 'ileri', ikon: 'egri', minSinif: 11, sira: 53 },
  { anahtar: 'iz', etiket: 'İz bırak', grup: 'ileri', ikon: 'iz', minSinif: 8, sira: 54 },
  // not
  { anahtar: 'metin', etiket: 'Metin', grup: 'not', ikon: 'metin', minSinif: 1, kisayol: 'T', sira: 60 },
  { anahtar: 'etiket', etiket: 'Etiket', grup: 'not', ikon: 'etiket', minSinif: 1, sira: 61 },
  { anahtar: 'kalem', etiket: 'Serbest kalem', grup: 'not', ikon: 'kalem', minSinif: 1, kisayol: 'K', sira: 62 },
  { anahtar: 'sil', etiket: 'Sil', grup: 'not', ikon: 'sil', minSinif: 1, sira: 63 },
] as const

export const MODULLER = [
  { slug: 'mufredat', ad: 'Müfredat Gezgini', surum: '0.1.0', sira: 1 },
  { slug: 'geometri', ad: 'Geometri Atölyesi', surum: '0.1.0', sira: 2 },
  { slug: 'olasilik', ad: 'Olasılık Laboratuvarı', surum: '0.1.0', sira: 3 },
  { slug: 'sahne', ad: 'Sahne Motoru', surum: '0.1.0', sira: 4 },
  { slug: 'cizim', ad: 'Çizim Atölyesi', surum: '0.1.0', sira: 5 },
  { slug: 'gercek-hayat', ad: 'Gerçek Hayat', surum: '0.1.0', sira: 6 },
  { slug: 'kutuphane', ad: 'Kütüphane', surum: '0.1.0', sira: 7 },
] as const
