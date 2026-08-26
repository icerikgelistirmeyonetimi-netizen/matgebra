import type { Sahne } from '@matgebra/core'

/**
 * Ilk sahneler - 5. sinif pilot dilimi.
 *
 * Sahneler @matgebra/core icindeki sahne semasiyla yazilir ve tohumlama
 * sirasinda dogrulanir. Ayni sema MCP `sahne_yaz` aracinin da girdisidir;
 * yani buradaki bicim, ileride icerik uretiminin sozlesmesidir.
 *
 * Nesneler motor dilinde degil geometri dilinde tanimlanir: "K2 noktasi,
 * merkezi O olan ve A'dan gecen cemberin uzerinde, A'dan 60 derece ileride".
 * Motoru degistirsek de bu tanim gecerli kalir.
 */

/** Cember uzerinde, yaricap noktasindan belirli aci kadar ileride nokta. */
const cemberUstuNokta = (ad: string, aciOfset: number, sira: number) => ({
  ad,
  tip: 'nokta_uzerinde' as const,
  etiket: ad,
  sira,
  katman: 1,
  gorunur: true,
  kilitli: true,
  surukleme: 'yok' as const,
  stil: { rol: 'lavanta' as const },
  parametreler: [{ anahtar: 'aci_ofset', deger: aciOfset, tur: 'sayi' as const }],
  bagimliliklar: [
    { kaynak: 'O', rol: 'merkez' as const, sira: 0 },
    { kaynak: 'A', rol: 'yaricap_noktasi' as const, sira: 1 },
  ],
})

const CINI_DESENI: Sahne = {
  slug: 'cini-deseni-altigen',
  konuSlug: 's5-temel-geometrik-cizimler',
  tur: 'gercek_hayat',
  baslik: 'Çini deseni: pergelle altıgen',
  ozet:
    'Türk çini sanatındaki altıgen desenler pergel ve cetvelle kurulur. Aynı inşayı koordinat düzleminde yapıyoruz: çemberin yarıçapını pergel açıklığı olarak alıp çember üzerinde altı nokta işaretliyoruz.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: {
    eksenModu: 'izgara',
    sinir: [-9, 9, 9, -9],
    izgaraAdimi: 1,
    birim: 'birim',
    yapisma: 'izgara',
    oranKilidi: true,
    arkaPlanMedyaId: null,
    olcek: null,
  },
  nesneler: [
    {
      ad: 'O',
      tip: 'nokta',
      etiket: 'O',
      sira: 0,
      katman: 2,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'notr' },
      parametreler: [
        { anahtar: 'x', deger: 0, tur: 'sayi' },
        { anahtar: 'y', deger: 0, tur: 'sayi' },
      ],
      bagimliliklar: [],
    },
    {
      ad: 'A',
      tip: 'nokta',
      etiket: 'A',
      sira: 1,
      katman: 2,
      gorunur: true,
      kilitli: false,
      surukleme: 'serbest',
      stil: { rol: 'seftali' },
      parametreler: [
        { anahtar: 'x', deger: 6, tur: 'sayi' },
        { anahtar: 'y', deger: 0, tur: 'sayi' },
      ],
      bagimliliklar: [],
    },
    {
      ad: 'c',
      tip: 'cember',
      etiket: 'pergel çemberi',
      sira: 2,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok', cizgiTipi: 'kesik', kalinlik: 1.5 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'O', rol: 'merkez', sira: 0 },
        { kaynak: 'A', rol: 'uzerinde', sira: 1 },
      ],
    },
    cemberUstuNokta('B', 60, 3),
    cemberUstuNokta('C', 120, 4),
    cemberUstuNokta('D', 180, 5),
    cemberUstuNokta('E', 240, 6),
    cemberUstuNokta('F', 300, 7),
    {
      ad: 'p',
      tip: 'cokgen',
      etiket: 'ABCDEF',
      sira: 8,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'nane', opaklik: 0.4 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'kose', sira: 0 },
        { kaynak: 'B', rol: 'kose', sira: 1 },
        { kaynak: 'C', rol: 'kose', sira: 2 },
        { kaynak: 'D', rol: 'kose', sira: 3 },
        { kaynak: 'E', rol: 'kose', sira: 4 },
        { kaynak: 'F', rol: 'kose', sira: 5 },
      ],
    },
    {
      ad: 'kenar',
      tip: 'olcum_uzunluk',
      etiket: 'kenar',
      sira: 9,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'seftali' },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'uc1', sira: 0 },
        { kaynak: 'B', rol: 'uc2', sira: 1 },
      ],
    },
    {
      ad: 'yaricap',
      tip: 'olcum_uzunluk',
      etiket: 'yarıçap',
      sira: 10,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok' },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'O', rol: 'uc1', sira: 0 },
        { kaynak: 'A', rol: 'uc2', sira: 1 },
      ],
    },
  ],
  adimlar: [
    {
      sira: 1,
      baslik: 'Çininin arkasındaki çember',
      anlatim:
        'Bir çini karosundaki altıgen desen rastgele çizilmez: usta önce pergelle bir çember çizer. Buradaki kesikli çember o pergel çemberi. Merkezi O noktası.',
      vurgu: ['O', 'c'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 2,
      baslik: 'Pergel açıklığı yarıçaptır',
      anlatim:
        'A noktasını sürükleyin. Çemberin yarıçapı A ile birlikte değişiyor — pergeli açıp kapatmak gibi.',
      vurgu: ['A', 'yaricap'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 3,
      baslik: 'Çember üzerinde altı nokta',
      anlatim:
        'Pergel açıklığını bozmadan çember üzerinde altı kez işaretlerseniz tam altıgen elde edersiniz. B, C, D, E ve F noktaları A’dan 60 derecelik adımlarla ilerliyor.',
      vurgu: ['B', 'C', 'D', 'E', 'F'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 4,
      baslik: 'Kenar ile yarıçap eşittir',
      anlatim:
        'Kenar ve yarıçap ölçümlerini karşılaştırın. A’yı nereye taşırsanız taşıyın ikisi hep aynı kalıyor. Düzgün altıgenin çiniye bu kadar uygun olmasının sebebi bu.',
      vurgu: ['kenar', 'yaricap'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 5,
      baslik: 'Şimdi siz deneyin',
      anlatim:
        'Kendin çiz’e geçip aynı deseni kendi pergelinizle kurun: bir çember, üzerinde altı nokta, sonra çokgen.',
      vurgu: [],
      aksiyon: null,
      beklenen: null,
    },
  ],
}

const SAAT_ACISI: Sahne = {
  slug: 'duvar-saati-aci',
  konuSlug: 's5-acilari-olcme',
  tur: 'gercek_hayat',
  baslik: 'Duvar saatinin kolları arasındaki açı',
  ozet:
    'Akrep ile yelkovan arasındaki açı, günde yüzlerce kez karşımıza çıkan bir açı ölçme problemidir. Kolları sürükleyip açının nasıl değiştiğini izleyin.',
  zorluk: 2,
  sira: 1,
  durum: 'yayin',
  ayar: {
    eksenModu: 'yok',
    sinir: [-8, 8, 8, -8],
    izgaraAdimi: 1,
    birim: 'derece',
    yapisma: 'yok',
    oranKilidi: true,
    arkaPlanMedyaId: null,
    olcek: null,
  },
  nesneler: [
    {
      ad: 'M',
      tip: 'nokta',
      etiket: 'M',
      sira: 0,
      katman: 2,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'notr' },
      parametreler: [
        { anahtar: 'x', deger: 0, tur: 'sayi' },
        { anahtar: 'y', deger: 0, tur: 'sayi' },
      ],
      bagimliliklar: [],
    },
    {
      ad: 'kadran',
      tip: 'cember',
      etiket: 'kadran',
      sira: 1,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'notr', kalinlik: 2 },
      parametreler: [{ anahtar: 'yaricap', deger: 6.5, tur: 'sayi' }],
      bagimliliklar: [{ kaynak: 'M', rol: 'merkez', sira: 0 }],
    },
    {
      ad: 'Y',
      tip: 'nokta',
      etiket: 'yelkovan',
      sira: 2,
      katman: 2,
      gorunur: true,
      kilitli: false,
      surukleme: 'serbest',
      stil: { rol: 'gok' },
      parametreler: [
        { anahtar: 'x', deger: 0, tur: 'sayi' },
        { anahtar: 'y', deger: 5.5, tur: 'sayi' },
      ],
      bagimliliklar: [],
    },
    {
      ad: 'A',
      tip: 'nokta',
      etiket: 'akrep',
      sira: 3,
      katman: 2,
      gorunur: true,
      kilitli: false,
      surukleme: 'serbest',
      stil: { rol: 'seftali' },
      parametreler: [
        { anahtar: 'x', deger: 3.6, tur: 'sayi' },
        { anahtar: 'y', deger: 0, tur: 'sayi' },
      ],
      bagimliliklar: [],
    },
    {
      ad: 'kolY',
      tip: 'dogru_parcasi',
      sira: 4,
      katman: 1,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'gok', kalinlik: 3 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'M', rol: 'uc1', sira: 0 },
        { kaynak: 'Y', rol: 'uc2', sira: 1 },
      ],
    },
    {
      ad: 'kolA',
      tip: 'dogru_parcasi',
      sira: 5,
      katman: 1,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'seftali', kalinlik: 4 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'M', rol: 'uc1', sira: 0 },
        { kaynak: 'A', rol: 'uc2', sira: 1 },
      ],
    },
    {
      ad: 'olculenAci',
      tip: 'olcum_aci',
      etiket: 'açı',
      sira: 6,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'tereyagi', opaklik: 0.55 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'uc1', sira: 0 },
        { kaynak: 'M', rol: 'merkez', sira: 1 },
        { kaynak: 'Y', rol: 'uc2', sira: 2 },
      ],
    },
  ],
  adimlar: [
    {
      sira: 1,
      baslik: 'Saat de bir açı ölçer',
      anlatim:
        'Akrep ve yelkovan merkezden çıkan iki ışındır. Aralarında kalan açıklık, ölçebileceğimiz bir açıdır.',
      vurgu: ['kolA', 'kolY'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 2,
      baslik: 'Saat 3’te açı kaç derece?',
      anlatim:
        'Yelkovanı 12’de bırakıp akrebi 3’e taşıyın. Sarı yayın yanındaki ölçüm 90 dereceyi gösterecek — dik açı.',
      vurgu: ['A', 'olculenAci'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 3,
      baslik: 'Saat 6’da ne oluyor?',
      anlatim:
        'Akrebi 6’ya indirin. İki kol aynı doğru üzerinde: 180 derece, yani doğru açı.',
      vurgu: ['A', 'olculenAci'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 4,
      baslik: 'Dar mı, geniş mi?',
      anlatim:
        'Kolları serbestçe oynatın. 90 dereceden küçük açılar dar, büyük olanlar geniştir. Hangi saatlerde dar açı oluşuyor?',
      vurgu: ['olculenAci'],
      aksiyon: null,
      beklenen: null,
    },
  ],
}

const COKGEN_KESFI: Sahne = {
  slug: 'cokgen-kesfi-dortgen',
  konuSlug: 's5-cokgenler',
  tur: 'kesif',
  baslik: 'Dörtgenin köşelerini oynatın',
  ozet:
    'Dört noktayı ardışık doğru parçalarıyla birleştirince kapalı bir şekil oluşur. Köşeleri sürükleyip hangi özelliklerin değiştiğini, hangilerinin değişmediğini izleyin.',
  zorluk: 3,
  sira: 1,
  durum: 'yayin',
  ayar: {
    eksenModu: 'izgara',
    sinir: [-9, 8, 9, -8],
    izgaraAdimi: 1,
    birim: 'birim',
    yapisma: 'izgara',
    oranKilidi: true,
    arkaPlanMedyaId: null,
    olcek: null,
  },
  nesneler: [
    ...(
      [
        ['A', -5, -4],
        ['B', 5, -4],
        ['C', 4, 4],
        ['D', -4, 3],
      ] as const
    ).map(([ad, x, y], i) => ({
      ad,
      tip: 'nokta' as const,
      etiket: ad,
      sira: i,
      katman: 2,
      gorunur: true,
      kilitli: false,
      surukleme: 'serbest' as const,
      stil: { rol: 'lavanta' as const },
      parametreler: [
        { anahtar: 'x', deger: x, tur: 'sayi' as const },
        { anahtar: 'y', deger: y, tur: 'sayi' as const },
      ],
      bagimliliklar: [],
    })),
    {
      ad: 'dortgen',
      tip: 'cokgen',
      etiket: 'ABCD',
      sira: 4,
      katman: 0,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok',
      stil: { rol: 'nane', opaklik: 0.4 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: 'A', rol: 'kose', sira: 0 },
        { kaynak: 'B', rol: 'kose', sira: 1 },
        { kaynak: 'C', rol: 'kose', sira: 2 },
        { kaynak: 'D', rol: 'kose', sira: 3 },
      ],
    },
    ...(
      [
        // JSXGraph aciyi saat yonunun tersine olcer. Cokgen saat yonunun
        // tersine siralandigi icin kollar (sonraki, kose, onceki) sirasinda
        // verilir; aksi halde ic aci yerine dis aci okunur.
        ['aciA', 'B', 'A', 'D'],
        ['aciB', 'C', 'B', 'A'],
        ['aciC', 'D', 'C', 'B'],
        ['aciD', 'A', 'D', 'C'],
      ] as const
    ).map(([ad, u1, m, u2], i) => ({
      ad,
      tip: 'olcum_aci' as const,
      sira: 5 + i,
      katman: 3,
      gorunur: true,
      kilitli: true,
      surukleme: 'yok' as const,
      stil: { rol: 'seftali' as const, opaklik: 0.5 },
      parametreler: [],
      bagimliliklar: [
        { kaynak: u1, rol: 'uc1' as const, sira: 0 },
        { kaynak: m, rol: 'merkez' as const, sira: 1 },
        { kaynak: u2, rol: 'uc2' as const, sira: 2 },
      ],
    })),
  ],
  adimlar: [
    {
      sira: 1,
      baslik: 'Dört nokta, dört kenar',
      anlatim:
        'A, B, C ve D noktaları ardışık doğru parçalarıyla birleşince kapalı bir dörtgen oluşuyor. Çokgen tanımı tam olarak budur.',
      vurgu: ['dortgen'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 2,
      baslik: 'Köşeleri oynatın',
      anlatim:
        'Herhangi bir köşeyi sürükleyin. Kenar uzunlukları ve açılar değişiyor ama şekil hâlâ bir dörtgen — dört kenarı ve dört köşesi var.',
      vurgu: ['A', 'B', 'C', 'D'],
      aksiyon: null,
      beklenen: null,
    },
    {
      sira: 3,
      baslik: 'Değişmeyen ne?',
      anlatim:
        'Dört açı ölçüsünü toplayın. Köşeleri nereye taşırsanız taşıyın toplam hep 360 derece çıkıyor. Bu, dörtgenin değişmezidir.',
      vurgu: ['aciA', 'aciB', 'aciC', 'aciD'],
      aksiyon: null,
      beklenen: null,
    },
  ],
}

export const SAHNELER: Sahne[] = [CINI_DESENI, SAAT_ACISI, COKGEN_KESFI]

/** Sahnelerle eslesen gercek hayat anlatilari. */
export const GERCEK_HAYAT_ORNEKLERI = [
  {
    sahneSlug: 'cini-deseni-altigen',
    konuSlug: 's5-temel-geometrik-cizimler',
    baslik: 'İznik çinisinde altıgen desen',
    hikaye:
      'Osmanlı çini ustaları desenlerini pergel ve cetvelden başka araç kullanmadan kurardı. Bir karodaki altıgen yıldız, tek bir çemberin üzerine pergel açıklığı hiç bozulmadan altı kez basılarak elde edilir. Aynı yöntem cami kubbelerindeki geometrik süslemelerde de karşımıza çıkar.',
    soru: 'Pergel açıklığını değiştirmeden çember üzerinde kaç işaret koyabilirsiniz? Neden tam altı?',
    olcekAciklama: 'Tahtadaki 1 birim, gerçek karoda yaklaşık 2 cm’e karşılık gelir.',
    kaynak: 'MEB tema metni: çini, kilim ve halı desenlerinde geometrik şekiller',
    yasAraligi: '10-12',
  },
  {
    sahneSlug: 'duvar-saati-aci',
    konuSlug: 's5-acilari-olcme',
    baslik: 'Duvar saatinde açı ölçme',
    hikaye:
      'Sınıftaki duvar saati gün boyu açı üretir. Yelkovan bir saatte tam bir tur, yani 360 derece döner; akrep aynı sürede yalnızca 30 derece ilerler. İki kol arasındaki açıklık bu yüzden sürekli değişir.',
    soru: 'Saat tam 3’i gösterirken kollar arasındaki açı kaç derecedir? Peki saat 4’te?',
    olcekAciklama: 'Kadran çemberi gerçek bir duvar saatinin kadranını temsil eder.',
    kaynak: 'MEB kazanımı MAT.5.3.3 — açıları ölçmek için araç ve teknolojiden yararlanma',
    yasAraligi: '10-12',
  },
] as const
