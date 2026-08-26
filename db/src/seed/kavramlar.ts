/**
 * Kavram sozlugu ve formul kartlari.
 *
 * Kavramlar konuya baglanir; "tanitilan" rolu o kavramin ilk kez o konuda
 * ogretildigini soyler, "kullanilan" ise onceden bilinip orada kullanildigini.
 * Kutuphane ekrani ve konu sayfasi bu bagi okur.
 */

export interface KavramTohumu {
  alan: 'geometri' | 'olasilik'
  ad: string
  tanim: string
  latex?: string
  /** Bu kavramı tanıtan konular. */
  tanitilan?: string[]
  /** Bu kavramı kullanan konular. */
  kullanilan?: string[]
}

export const KAVRAMLAR: KavramTohumu[] = [
  {
    alan: 'geometri',
    ad: 'Nokta',
    tanim:
      'Yeri olan ama boyutu olmayan geometrik öge. Büyük harfle adlandırılır: A, B, O gibi.',
    tanitilan: ['s5-temel-geometrik-cizimler'],
  },
  {
    alan: 'geometri',
    ad: 'Doğru parçası',
    tanim: 'İki nokta arasındaki en kısa yol. İki ucu vardır, uzunluğu ölçülebilir.',
    tanitilan: ['s5-temel-geometrik-cizimler'],
    kullanilan: ['s5-cokgenler', 's5-dikdortgenin-cevresi'],
  },
  {
    alan: 'geometri',
    ad: 'Işın',
    tanim: 'Bir uç noktadan başlayıp bir yönde sınırsız uzayan doğru parçası.',
    tanitilan: ['s5-temel-geometrik-cizimler'],
    kullanilan: ['s5-acilari-olcme'],
  },
  {
    alan: 'geometri',
    ad: 'Açı',
    tanim:
      'Aynı uç noktadan çıkan iki ışının oluşturduğu açıklık. Derece ile ölçülür; tam tur 360 derecedir.',
    tanitilan: ['s5-acilari-olcme'],
    kullanilan: ['s5-dogrularin-durumlari-ve-acilar', 's6-paralel-dogrular-ve-kesen'],
  },
  {
    alan: 'geometri',
    ad: 'Çember',
    tanim:
      'Bir merkeze eşit uzaklıktaki noktaların oluşturduğu kapalı eğri. Bu eşit uzaklığa yarıçap denir.',
    tanitilan: ['s5-temel-geometrik-cizimler'],
    kullanilan: ['s6-cemberin-uzunlugu-ve-pi', 's5-kesisen-cemberler-ve-ucgen-insasi'],
  },
  {
    alan: 'geometri',
    ad: 'Yarıçap',
    tanim: 'Çemberin merkezini üzerindeki herhangi bir noktaya birleştiren doğru parçası.',
    latex: 'r',
    tanitilan: ['s5-temel-geometrik-cizimler'],
    kullanilan: ['s6-cemberin-uzunlugu-ve-pi', 's7-dairenin-alani'],
  },
  {
    alan: 'geometri',
    ad: 'Çokgen',
    tanim:
      'Ardışık doğru parçalarının oluşturduğu kapalı şekil. Kenar sayısına göre üçgen, dörtgen, beşgen diye adlandırılır.',
    tanitilan: ['s5-cokgenler'],
    kullanilan: ['s11-icbukey-ve-disbukey-cokgenler'],
  },
  {
    alan: 'geometri',
    ad: 'Alan',
    tanim: 'Bir şeklin kapladığı yüzeyin ölçüsü. Birim karelerle sayılarak bulunur.',
    tanitilan: ['s5-dikdortgenin-alani'],
    kullanilan: ['s6-paralelkenar-ve-ucgenin-alani', 's7-dairenin-alani'],
  },
  {
    alan: 'geometri',
    ad: 'Çevre',
    tanim: 'Kapalı bir şeklin kenar uzunluklarının toplamı.',
    tanitilan: ['s5-dikdortgenin-cevresi'],
    kullanilan: ['s6-cemberin-uzunlugu-ve-pi'],
  },
  {
    alan: 'geometri',
    ad: 'Dikme',
    tanim: 'Bir doğruya 90 derecelik açıyla çizilen doğru.',
    tanitilan: ['s5-temel-geometrik-cizimler'],
    kullanilan: ['s7-orta-dikme-ve-aciortay-insasi'],
  },
  {
    alan: 'geometri',
    ad: 'Simetri doğrusu',
    tanim:
      'Bir şekli, iki parçası üst üste çakışacak biçimde ikiye ayıran doğru. Katlama çizgisi gibi düşünülebilir.',
    tanitilan: ['s3-simetri-dogrulari'],
    kullanilan: ['s4-dogruya-gore-simetri', 's7-yansima-donusumu'],
  },
  {
    alan: 'olasilik',
    ad: 'Olasılık',
    tanim:
      'Bir olayın gerçekleşme ihtimalinin sayısal ölçüsü. 0 ile 1 arasında bir değer alır; imkânsız 0, kesin 1’dir.',
    latex: 'P(A)',
    tanitilan: ['s5-olasilik-sayi-dogrusu'],
    kullanilan: ['s7-bir-olayin-tumleyeni', 's10-kosullu-olasilik'],
  },
  {
    alan: 'olasilik',
    ad: 'Sonuç uzayı',
    tanim: 'Bir deneyin verebileceği bütün sonuçların kümesi. Zar atmada altı elemanlıdır.',
    tanitilan: ['s5-olasilik-sayi-dogrusu'],
    kullanilan: ['s8-olasilik-yaklasimlari'],
  },
  {
    alan: 'olasilik',
    ad: 'Tümleyen olay',
    tanim:
      'Bir olayın gerçekleşmemesi durumu. Bir olay ile tümleyeninin olasılıkları toplamı her zaman 1’dir.',
    latex: "P(A) + P(A') = 1",
    tanitilan: ['s7-bir-olayin-tumleyeni'],
  },
  {
    alan: 'olasilik',
    ad: 'Ayrık olaylar',
    tanim: 'Aynı anda gerçekleşemeyen olaylar. Zar atmada "çift gelir" ile "tek gelir" ayrıktır.',
    tanitilan: ['s7-ayrik-olaylar'],
  },
  {
    alan: 'olasilik',
    ad: 'Göreli frekans',
    tanim:
      'Bir olayın gerçekleşme sayısının toplam deneme sayısına oranı. Deneme sayısı arttıkça teorik olasılığa yaklaşır.',
    tanitilan: ['s6-gozleme-dayali-olasilik-tahmini'],
    kullanilan: ['s9-gozleme-dayali-olasilik'],
  },
]

export interface FormulTohumu {
  konuSlug: string
  ad: string
  latex: string
  aciklama: string
}

export const FORMULLER: FormulTohumu[] = [
  {
    konuSlug: 's5-dikdortgenin-cevresi',
    ad: 'Dikdörtgenin çevresi',
    latex: 'Ç = 2 \\cdot (a + b)',
    aciklama: 'a ve b komşu iki kenarın uzunluğudur; her biri iki kez sayılır.',
  },
  {
    konuSlug: 's5-dikdortgenin-alani',
    ad: 'Dikdörtgenin alanı',
    latex: 'A = a \\cdot b',
    aciklama: 'Bir sıradaki birim kare sayısı ile sıra sayısının çarpımıdır.',
  },
  {
    konuSlug: 's6-paralelkenar-ve-ucgenin-alani',
    ad: 'Üçgenin alanı',
    latex: 'A = \\frac{a \\cdot h_a}{2}',
    aciklama: 'Taban ile o tabana ait yüksekliğin çarpımının yarısı.',
  },
  {
    konuSlug: 's6-paralelkenar-ve-ucgenin-alani',
    ad: 'Paralelkenarın alanı',
    latex: 'A = a \\cdot h_a',
    aciklama: 'Dikdörtgene dönüştürülebildiği için taban çarpı yükseklik.',
  },
  {
    konuSlug: 's6-cemberin-uzunlugu-ve-pi',
    ad: 'Çemberin uzunluğu',
    latex: 'Ç = 2 \\pi r',
    aciklama: 'Çevrenin çapa oranı her çemberde aynıdır ve bu orana pi denir.',
  },
  {
    konuSlug: 's7-dairenin-alani',
    ad: 'Dairenin alanı',
    latex: 'A = \\pi r^2',
    aciklama: 'Daire ince dilimlere ayrılıp paralelkenara dönüştürülerek bulunur.',
  },
  {
    konuSlug: 's8-pisagor-bagintisi',
    ad: 'Pisagor bağıntısı',
    latex: 'a^2 + b^2 = c^2',
    aciklama: 'Dik üçgende dik kenarların kareleri toplamı hipotenüsün karesine eşittir.',
  },
  {
    konuSlug: 's5-olasilik-sayi-dogrusu',
    ad: 'Eşit olasılıklı durumda olasılık',
    latex: 'P(A) = \\frac{\\text{istenen sonuç sayısı}}{\\text{tüm sonuç sayısı}}',
    aciklama: 'Yalnızca bütün sonuçların olasılığı eşitse kullanılabilir.',
  },
  {
    konuSlug: 's7-bir-olayin-tumleyeni',
    ad: 'Tümleyen olay',
    latex: "P(A') = 1 - P(A)",
    aciklama: 'Bir olay ile tümleyeni birlikte bütün sonuç uzayını kapsar.',
  },
]
