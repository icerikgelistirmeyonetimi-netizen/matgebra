import type { Deney } from '@matgebra/core'

/**
 * Olasilik deneyleri - 4 ile 10. sinif arasi.
 *
 * Deney bir sahne turudur ama koordinat düzlemi gerektirmez: zar, para,
 * cark ve torba kendi gorsel dilinde calisir. Ortak olan tohumlu rastgelelik
 * ve teorik/deneysel karsilastirmasi.
 *
 * Olasilik mufredatta 4. sinifta baslar, 10'da biter; 11 ve 12'de ayri bir
 * olasilik temasi yoktur.
 */

const sonuc = (s: string, agirlik = 1, renk = 'gok', sira = 0) => ({
  sonuc: s,
  agirlik,
  renkAnahtari: renk,
  sira,
})

const HAVA_DURUMU: Deney = {
  slug: 'hava-durumu-carki',
  konuSlug: 's4-imkansiz-olabilir-kesin',
  tur: 'cark',
  ad: 'Hava durumu çarkı',
  aciklama:
    'Çarkın dilimleri bir günün hava durumu olasılıklarını temsil ediyor. Çevirin ve hangi olayların imkânsız, hangilerinin kesin olduğunu görün.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: [
    sonuc('Güneşli', 3, 'tereyagi', 0),
    sonuc('Bulutlu', 2, 'notr', 1),
    sonuc('Yağmurlu', 1, 'gok', 2),
  ],
  olaylar: [
    { ad: 'Güneşli olur', sonuclar: ['Güneşli'], kosul: null, deger: null },
    { ad: 'Yağmur yağar', sonuclar: ['Yağmurlu'], kosul: null, deger: null },
    { ad: 'Kar yağar (imkânsız)', sonuclar: ['Karlı'], kosul: null, deger: null },
    {
      ad: 'Bir hava durumu çıkar (kesin)',
      sonuclar: ['Güneşli', 'Bulutlu', 'Yağmurlu'],
      kosul: null,
      deger: null,
    },
  ],
}

const ZAR: Deney = {
  slug: 'zar-atma',
  konuSlug: 's5-olasilik-sayi-dogrusu',
  tur: 'zar',
  ad: 'Zar atma',
  aciklama:
    'Altı yüzü eşit bir zar. Her olayın olasılığı 0 ile 1 arasında bir sayıdır: imkânsız olan 0, kesin olan 1.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: [1, 2, 3, 4, 5, 6].map((n, i) => sonuc(String(n), 1, 'gok', i)),
  olaylar: [
    { ad: '1 gelir', sonuclar: ['1'], kosul: null, deger: null },
    { ad: 'Çift sayı gelir', sonuclar: ['2', '4', '6'], kosul: null, deger: null },
    { ad: "4'ten büyük gelir", sonuclar: ['5', '6'], kosul: null, deger: null },
    { ad: '7 gelir (imkânsız)', sonuclar: ['7'], kosul: null, deger: null },
    {
      ad: "1 ile 6 arası gelir (kesin)",
      sonuclar: ['1', '2', '3', '4', '5', '6'],
      kosul: null,
      deger: null,
    },
  ],
}

const TORBA: Deney = {
  slug: 'renkli-torba',
  konuSlug: 's5-az-ve-cok-olasilikli-olaylar',
  tur: 'torba',
  ad: 'Renkli toplar torbası',
  aciklama:
    'Torbada 5 kırmızı, 3 mavi ve 2 sarı top var. Hangi rengi çekmek daha olasıdır? Çektiğiniz topu geri koyuyoruz.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: [sonuc('Kırmızı', 5, 'gul', 0), sonuc('Mavi', 3, 'gok', 1), sonuc('Sarı', 2, 'tereyagi', 2)],
  olaylar: [
    { ad: 'Kırmızı gelir', sonuclar: ['Kırmızı'], kosul: null, deger: null },
    { ad: 'Mavi gelir', sonuclar: ['Mavi'], kosul: null, deger: null },
    { ad: 'Sarı gelir', sonuclar: ['Sarı'], kosul: null, deger: null },
    { ad: 'Kırmızı olmayan gelir', sonuclar: ['Mavi', 'Sarı'], kosul: null, deger: null },
  ],
}

const HILELI_ZAR: Deney = {
  slug: 'hileli-zar',
  konuSlug: 's6-gozleme-dayali-olasilik-tahmini',
  tur: 'zar',
  ad: 'Hileli zar',
  aciklama:
    'Bu zarın yüzleri eşit değil ama size hangisinin ağır bastığı söylenmiyor. Çok sayıda atış yapıp göreli frekansa bakarak tahmin edin.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: [
    sonuc('1', 1, 'gok', 0),
    sonuc('2', 1, 'gok', 1),
    sonuc('3', 1, 'gok', 2),
    sonuc('4', 1, 'gok', 3),
    sonuc('5', 1, 'gok', 4),
    sonuc('6', 4, 'gul', 5),
  ],
  olaylar: [
    { ad: '6 gelir', sonuclar: ['6'], kosul: null, deger: null },
    { ad: '1 gelir', sonuclar: ['1'], kosul: null, deger: null },
    { ad: 'Çift sayı gelir', sonuclar: ['2', '4', '6'], kosul: null, deger: null },
  ],
}

const PARA: Deney = {
  slug: 'para-atma',
  konuSlug: 's7-bir-olayin-tumleyeni',
  tur: 'para',
  ad: 'Para atma',
  aciklama:
    'Yazı gelmesi ile tura gelmesi birbirinin tümleyenidir: ikisinin olasılığı toplamı her zaman 1 eder.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: [sonuc('Yazı', 1, 'lavanta', 0), sonuc('Tura', 1, 'seftali', 1)],
  olaylar: [
    { ad: 'Yazı gelir', sonuclar: ['Yazı'], kosul: null, deger: null },
    { ad: 'Tura gelir (tümleyen)', sonuclar: ['Tura'], kosul: null, deger: null },
  ],
}

const CARK: Deney = {
  slug: 'sekiz-dilimli-cark',
  konuSlug: 's7-esit-olasilikli-olaylar',
  tur: 'cark',
  ad: 'Sekiz eşit dilimli çark',
  aciklama:
    'Dilimlerin hepsi aynı büyüklükte olduğu için her sonucun olasılığı eşittir. Eşit olasılıklı olmanın koşulu budur.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: Array.from({ length: 8 }, (_, i) =>
    sonuc(String(i + 1), 1, ['nane', 'gok', 'lavanta', 'seftali'][i % 4] ?? 'gok', i),
  ),
  olaylar: [
    { ad: '1 gelir', sonuclar: ['1'], kosul: null, deger: null },
    { ad: 'Tek sayı gelir', sonuclar: ['1', '3', '5', '7'], kosul: null, deger: null },
    { ad: "6'dan büyük gelir", sonuclar: ['7', '8'], kosul: null, deger: null },
  ],
}

const AYRIK: Deney = {
  slug: 'zar-ayrik-olaylar',
  konuSlug: 's7-ayrik-olaylar',
  tur: 'zar',
  ad: 'Ayrık olan ve olmayan olaylar',
  aciklama:
    'İki olay aynı anda gerçekleşemiyorsa ayrıktır. "Çift gelir" ile "tek gelir" ayrıktır; "çift gelir" ile "4’ten büyük gelir" değildir — 6 ikisine de dahil.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 1,
  sonuclar: [1, 2, 3, 4, 5, 6].map((n, i) => sonuc(String(n), 1, 'gok', i)),
  olaylar: [
    { ad: 'Çift gelir', sonuclar: ['2', '4', '6'], kosul: null, deger: null },
    { ad: 'Tek gelir', sonuclar: ['1', '3', '5'], kosul: null, deger: null },
    { ad: "4'ten büyük gelir", sonuclar: ['5', '6'], kosul: null, deger: null },
  ],
}

const IKI_ZAR: Deney = {
  slug: 'iki-zar-toplam',
  konuSlug: 's8-olasilik-yaklasimlari',
  tur: 'zar',
  ad: 'İki zarın toplamı',
  aciklama:
    'İki zar atıyoruz. Sonuç uzayı 36 elemanlı; toplamların olasılığı eşit değil. Teorik değeri sayarak, deneysel değeri atarak buluyoruz.',
  bagimsizMi: true,
  iadeVarMi: true,
  cekimSayisi: 2,
  sonuclar: [1, 2, 3, 4, 5, 6].map((n, i) => sonuc(String(n), 1, 'gok', i)),
  olaylar: [
    { ad: 'Toplam 7', sonuclar: [], kosul: 'toplam', deger: 7 },
    { ad: 'Toplam 2', sonuclar: [], kosul: 'toplam', deger: 2 },
    { ad: 'Toplam en az 10', sonuclar: [], kosul: 'toplam_en_az', deger: 10 },
    { ad: 'İki zar aynı gelir', sonuclar: [], kosul: 'hepsi_ayni', deger: null },
  ],
}

const IADESIZ: Deney = {
  slug: 'iadesiz-torba',
  konuSlug: 's10-bagimli-ve-bagimsiz-olaylar',
  tur: 'torba',
  ad: 'İadesiz çekiliş',
  aciklama:
    'Torbadan iki top çekiyoruz ama ilkini geri koymuyoruz. İkinci çekimin olasılığı birinciye bağlı — olaylar bağımsız değil.',
  bagimsizMi: false,
  iadeVarMi: false,
  cekimSayisi: 2,
  sonuclar: [
    sonuc('Kırmızı-1', 1, 'gul', 0),
    sonuc('Kırmızı-2', 1, 'gul', 1),
    sonuc('Kırmızı-3', 1, 'gul', 2),
    sonuc('Mavi-1', 1, 'gok', 3),
    sonuc('Mavi-2', 1, 'gok', 4),
  ],
  olaylar: [
    {
      ad: 'İkisi de kırmızı',
      sonuclar: ['Kırmızı-1', 'Kırmızı-2', 'Kırmızı-3'],
      kosul: 'hepsi',
      deger: null,
    },
    {
      ad: 'En az biri mavi',
      sonuclar: ['Mavi-1', 'Mavi-2'],
      kosul: 'en_az_bir',
      deger: null,
    },
  ],
}

export const DENEYLER: Deney[] = [
  HAVA_DURUMU,
  ZAR,
  TORBA,
  HILELI_ZAR,
  PARA,
  CARK,
  AYRIK,
  IKI_ZAR,
  IADESIZ,
]
