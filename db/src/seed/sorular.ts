import type { SoruTanimi } from '@matgebra/core'

/**
 * Alistirma sorulari - 5. sinif pilot dilimi ve olasilik.
 *
 * Sahneye bagli sorular (tahtadan_olcum, insa_gorevi) ogrencinin tahtada bir
 * sey yapmasini ister; cevap ekrandan okunur ya da cizimden denetlenir.
 * Boylece soru, sahneden kopuk bir metin olmaktan cikar.
 */

export interface SoruTohumu extends SoruTanimi {
  konuSlug: string
  sahneSlug?: string
}

export const SORULAR: SoruTohumu[] = [
  // ------------------------------------------- 5. sinif: temel cizimler
  {
    konuSlug: 's5-temel-geometrik-cizimler',
    tip: 'coktan_secmeli',
    govde: 'Pergelle çizilen bir çemberin üzerindeki noktalar için hangisi doğrudur?',
    secenekler: [
      'Merkeze uzaklıkları birbirinden farklıdır.',
      'Merkeze uzaklıkları hep aynıdır.',
      'Merkeze uzaklıkları sıfırdır.',
      'Merkezden geçerler.',
    ],
    cevap: { tip: 'coktan_secmeli', dogru: 1 },
    ipucu: 'Pergelin açıklığı çizim boyunca değişmez.',
    cozum:
      'Pergelin açıklığı yarıçaptır ve çizim boyunca sabit kalır; bu yüzden çember üzerindeki her noktanın merkeze uzaklığı eşittir.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's5-temel-geometrik-cizimler',
    sahneSlug: 'cini-deseni-altigen',
    tip: 'tahtadan_olcum',
    govde:
      'Sahnede A noktasını yarıçap 5 birim olacak şekilde taşıyın. Altıgenin bir kenarı kaç birim olur?',
    secenekler: [],
    cevap: { tip: 'tahtadan_olcum', deger: 5, tolerans: 0.15, birim: 'birim' },
    ipucu: 'Kenar ve yarıçap ölçümlerini yan yana okuyun.',
    cozum:
      'Düzgün altıgende kenar uzunluğu yarıçapa eşittir; çember üzerinde pergel açıklığı kadar altı adım attığımız için böyle olur.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-temel-geometrik-cizimler',
    tip: 'insa_gorevi',
    govde:
      'Serbest tuvalde bir çember çizin ve o çemberin üzerine oturan düzgün bir altıgen kurun.',
    secenekler: [],
    cevap: { tip: 'insa_gorevi', beklenen: { circle: 1, regularpolygon: 1 } },
    ipucu: 'Önce "Çember (merkez + nokta)", sonra "Düzgün çokgen" aracını kullanın.',
    cozum:
      'Çemberi kurduktan sonra düzgün çokgen aracıyla çember üzerindeki iki komşu noktayı seçmek yeterlidir; kenar sayısını 6 bırakın.',
    zorluk: 3,
    puan: 3,
  },
  {
    konuSlug: 's5-temel-geometrik-cizimler',
    tip: 'dogru_yanlis',
    govde: 'Bir doğru parçasının iki ucu vardır, doğrunun ise ucu yoktur.',
    secenekler: [],
    cevap: { tip: 'dogru_yanlis', dogru: true },
    ipucu: 'Işını da düşünün: onun bir ucu var, diğer yönde sınırsız.',
    cozum:
      'Doğru parçası iki uç noktayla sınırlıdır. Doğru iki yönde de sınırsızdır. Işın ise bir uçtan başlar, diğer yönde sınırsız uzar.',
    zorluk: 1,
    puan: 1,
  },

  // ------------------------------------------------ 5. sinif: aci olcme
  {
    konuSlug: 's5-acilari-olcme',
    sahneSlug: 'duvar-saati-aci',
    tip: 'tahtadan_olcum',
    govde:
      'Yelkovanı 12’de bırakıp akrebi 3’e taşıyın. Kollar arasındaki açı kaç derecedir?',
    secenekler: [],
    cevap: { tip: 'tahtadan_olcum', deger: 90, tolerans: 3, birim: 'derece' },
    ipucu: 'Kadranın dörtte biri kadar bir açıklık oluşuyor.',
    cozum:
      'Tam tur 360 derecedir. Saat 12’den 3’e giderken kadranın dörtte biri kat edilir: 360 / 4 = 90 derece, yani dik açı.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's5-acilari-olcme',
    tip: 'coktan_secmeli',
    govde: 'Saat tam 6’yı gösterirken akreple yelkovan arasındaki açı kaç derecedir?',
    secenekler: ['90', '120', '180', '360'],
    cevap: { tip: 'coktan_secmeli', dogru: 2 },
    ipucu: 'İki kol aynı doğru üzerinde, ama zıt yönlerde.',
    cozum: 'Kollar zıt yönlere baktığında doğru açı oluşur: 180 derece.',
    zorluk: 2,
    puan: 1,
  },
  {
    konuSlug: 's5-acilari-olcme',
    tip: 'sayisal',
    govde: 'Dik açı kaç derecedir?',
    secenekler: [],
    cevap: { tip: 'sayisal', deger: 90, tolerans: 0, birim: 'derece' },
    ipucu: 'Bir defterin köşesi dik açıdır.',
    cozum: 'Dik açı 90 derecedir; dar açı ondan küçük, geniş açı ondan büyüktür.',
    zorluk: 1,
    puan: 1,
  },

  // -------------------------------------------------- 5. sinif: cokgenler
  {
    konuSlug: 's5-cokgenler',
    sahneSlug: 'cokgen-kesfi-dortgen',
    tip: 'sayisal',
    govde:
      'Sahnedeki dörtgenin köşelerini istediğiniz gibi oynatın. Dört iç açının toplamı kaç derece çıkıyor?',
    secenekler: [],
    cevap: { tip: 'sayisal', deger: 360, tolerans: 2, birim: 'derece' },
    ipucu: 'Dört ölçümü toplayın; köşeleri taşıdığınızda toplam değişiyor mu?',
    cozum:
      'Her dörtgen iki üçgene bölünebilir. Bir üçgenin iç açıları 180 derece olduğuna göre dörtgende 2 × 180 = 360 derece olur. Köşeler nereye taşınırsa taşınsın bu değişmez.',
    zorluk: 3,
    puan: 2,
  },
  {
    konuSlug: 's5-cokgenler',
    tip: 'coktan_secmeli',
    govde: 'Aşağıdakilerden hangisi çokgen değildir?',
    secenekler: ['Üçgen', 'Beşgen', 'Çember', 'Kare'],
    cevap: { tip: 'coktan_secmeli', dogru: 2 },
    ipucu: 'Çokgenin kenarları doğru parçalarından oluşur.',
    cozum:
      'Çokgen, ardışık doğru parçalarının oluşturduğu kapalı şekildir. Çemberin kenarı doğru parçası değildir, bu yüzden çokgen sayılmaz.',
    zorluk: 1,
    puan: 1,
  },

  // ---------------------------------------- 5. sinif: dikdortgenin alani
  {
    konuSlug: 's5-dikdortgenin-alani',
    tip: 'sayisal',
    govde: 'Kenar uzunlukları 8 birim ve 5 birim olan bir dikdörtgenin alanı kaç birim karedir?',
    secenekler: [],
    cevap: { tip: 'sayisal', deger: 40, tolerans: 0, birim: 'birim kare' },
    ipucu: 'Bir sırada kaç birim kare var, kaç sıra var?',
    cozum: '8 × 5 = 40. Bir sırada 8 birim kare vardır ve 5 sıra döşenir.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's5-dikdortgenin-alani',
    sahneSlug: 'fayans-doseme-alan',
    tip: 'acik_uclu',
    govde:
      'Zeminin uzun kenarını 1 karo uzatırsanız toplam karo sayısı nasıl değişir? Sahnede deneyip açıklayın.',
    secenekler: [],
    cevap: {
      tip: 'acik_uclu',
      ornek:
        'Uzun kenarı 1 karo uzatınca, kısa kenar kadar yeni karo eklenir. Kısa kenar 5 ise alan 5 karo artar. Çünkü eklenen şey tam bir sıradır.',
      anahtarlar: ['kısa kenar', 'sıra', 'artar'],
    },
    ipucu: 'Eklenen bölge nasıl bir şekil oluyor?',
    cozum:
      'Bir kenarı 1 birim uzatmak, diğer kenar uzunluğu kadar birim kareden oluşan yeni bir sıra ekler. Yani artış diğer kenarın uzunluğuna eşittir.',
    zorluk: 3,
    puan: 3,
  },

  // ------------------------------------------------------- olasilik
  {
    konuSlug: 's5-olasilik-sayi-dogrusu',
    tip: 'sayisal',
    govde: 'Bir zar atıldığında 7 gelme olasılığı kaçtır?',
    secenekler: [],
    cevap: { tip: 'sayisal', deger: 0, tolerans: 0 },
    ipucu: 'Zarın yüzlerinde 7 var mı?',
    cozum:
      'Zarın yüzlerinde 7 bulunmadığı için bu olay imkânsızdır ve olasılığı 0’dır. İmkânsız olayların olasılığı her zaman 0’dır.',
    zorluk: 1,
    puan: 1,
  },
  {
    konuSlug: 's5-olasilik-sayi-dogrusu',
    tip: 'coktan_secmeli',
    govde: 'Bir olayın olasılığı hangi aralıkta olabilir?',
    secenekler: ['0 ile 1 arasında', '0 ile 100 arasında', '1 ile 6 arasında', 'Herhangi bir sayı'],
    cevap: { tip: 'coktan_secmeli', dogru: 0 },
    ipucu: 'İmkânsız olay ile kesin olayın değerlerini düşünün.',
    cozum:
      'İmkânsız olayın olasılığı 0, kesin olayın olasılığı 1’dir. Diğer bütün olaylar bu ikisinin arasında bir değer alır.',
    zorluk: 2,
    puan: 1,
  },
  {
    konuSlug: 's7-bir-olayin-tumleyeni',
    tip: 'sayisal',
    govde:
      'Bir olayın olasılığı 0,35 ise tümleyeninin olasılığı kaçtır?',
    secenekler: [],
    cevap: { tip: 'sayisal', deger: 0.65, tolerans: 0.001 },
    ipucu: 'Bir olay ile tümleyeni birlikte bütün sonuçları kapsar.',
    cozum: 'Bir olay ile tümleyeninin olasılıkları toplamı 1’dir: 1 − 0,35 = 0,65.',
    zorluk: 2,
    puan: 2,
  },
  {
    konuSlug: 's8-olasilik-yaklasimlari',
    tip: 'sayisal',
    govde:
      'İki zar atıldığında toplamın 7 gelmesi kaç farklı şekilde olur? (Sonuç uzayı 36 elemanlıdır.)',
    secenekler: [],
    cevap: { tip: 'sayisal', deger: 6, tolerans: 0 },
    ipucu: 'Laboratuvardaki 6×6 ızgarasında yeşil hücreleri sayın.',
    cozum:
      '1+6, 2+5, 3+4, 4+3, 5+2, 6+1 olmak üzere 6 şekilde. Olasılık 6/36 = 1/6 ≈ 0,167 çıkar.',
    zorluk: 3,
    puan: 2,
  },
]
