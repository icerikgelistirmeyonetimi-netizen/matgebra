import JXG from 'jsxgraph'
import { rolRengi } from '@/ortak/palet'

/**
 * Cizim motoru.
 *
 * GeoGebra tarzi arac davranisi: her arac sirayla nesne toplar, gereken
 * sayiya ulasinca sonucu insa eder. Bos yere tiklamak yeni nokta yaratir,
 * var olan bir noktaya tiklamak onu yeniden kullanir, bir cizgi ya da
 * cember uzerine tiklamak o nesne uzerinde kayan nokta (glider) yaratir.
 *
 * Geri alma, olusan ogeleri yok eder; ileri alma tarifi yeniden calistirir.
 * Tarif nesne adlariyla saklandigi icin motor detayina bagimli degildir.
 */

export type Beklenen = 'nokta' | 'cizgi' | 'cember' | 'cokgen' | 'nesne'

/**
 * Arac kuralina gecen secim. Kural zaten gerekli sayida nesne toplandiktan
 * sonra cagrildigi icin ilk uc oge kesin doludur; demet tipi bunu anlatir.
 */
export type Secim = [
  JXG.GeometryElement,
  JXG.GeometryElement,
  JXG.GeometryElement,
  ...JXG.GeometryElement[],
]

export interface Secenekler {
  yaricap: number
  kenarSayisi: number
  aci: number
  oran: number
  enAz: number
  enCok: number
}

export const VARSAYILAN_SECENEK: Secenekler = {
  yaricap: 3,
  kenarSayisi: 6,
  aci: 90,
  oran: 2,
  enAz: -5,
  enCok: 5,
}

/**
 * Metin gerektiren araclarin girdileri.
 *
 * Sayisal seceneklerden ayri tutuldu: denetci paneli ikisini farkli
 * bicimde gosteriyor (biri sayi kutusu, digeri yazi kutusu) ve tarif
 * kaydinda ikisi de saklaniyor ki geri yukleme birebir olsun.
 */
export interface MetinSecenekleri {
  ifade: string
  yazi: string
}

export const VARSAYILAN_METIN: MetinSecenekleri = {
  ifade: 'x^2 - 3',
  yazi: 'not',
}

/** Bir arac cagrisinin yeniden calistirilabilir kaydi. */
interface Islem {
  arac: string
  /** Islem sirasinda yaratilan serbest noktalar - ileri almada geri konur. */
  noktalar: Array<{ ad: string; x: number; y: number }>
  /** Girdi olarak kullanilan, onceden var olan nesnelerin adlari. */
  girdiler: string[]
  /**
   * Bu islemin yarattigi butun ogelerin kimlikleri.
   * Ad yerine kimlik: duzgun cokgen gibi araclar kendi ic ogelerini de
   * yaratiyor (koseler, kenarlar) ve bunlar ada gore izlenemiyor. Islem
   * oncesi/sonrasi farki alinarak hepsi yakalanir; aksi halde geri alma
   * onlari tahtada birakip biriktiriyordu.
   */
  uretilenler: string[]
  secenek: Secenekler
  /** Metin girdili araclarin (fonksiyon, metin, etiket) yazisi. */
  metin?: MetinSecenekleri
  /** Konumla calisan araclarin (kaydirici, metin, fonksiyon) tiklama yeri. */
  konum?: { x: number; y: number }
  /** Serbest kalemin gectigi yol. */
  yol?: Array<[number, number]>
}

interface AracKurali {
  bekle: Beklenen[]
  /** Cokgen gibi degisken sayida nokta toplayan araclar. */
  serbest?: boolean
  /**
   * Nesne degil yer isteyen araclar: tek tiklamayla, tahtaya nokta
   * birakmadan calisirlar. Tiklama yeri `m.konum` uzerinden okunur.
   */
  konumlu?: boolean
  /** Suruklenerek cizilen araclar (serbest kalem). */
  kalem?: boolean
  /**
   * Yeni oge uretmeyen, nesnenin bir ozelligini aciip kapatan araclar.
   * Gecmise girmezler; ayni nesneye yeniden tiklamak geri alir.
   */
  anahtar?: boolean
  /** Denetci panelinde gosterilecek sayisal secenekler. */
  secenekler?: Array<keyof Secenekler>
  /** Denetci panelinde gosterilecek yazi kutulari. */
  metinler?: Array<keyof MetinSecenekleri>
  yap(m: CizimMotoru, secim: Secim): JXG.GeometryElement[]
}

const isaret = (o: JXG.GeometryElement | undefined): string => (o ? o.name || o.id : '')

/**
 * Tur sinamalari elType yerine elementClass uzerinden yapiliyor.
 *
 * elType'a bakmak tureilmis noktalari disarida birakiyordu: orta nokta
 * 'midpoint', kayan nokta 'glider', kesisim 'intersection' dondurur ve
 * hicbiri 'point' degildir. Bu yuzden bir orta noktanin uzerine cember
 * kurulamiyor, bir kesisim noktasindan dogru cizilemiyordu. elementClass
 * hepsini tek bir sinifta topluyor.
 */
const SINIF = JXG as unknown as {
  OBJECT_CLASS_POINT: number
  OBJECT_CLASS_LINE: number
  OBJECT_CLASS_CIRCLE: number
  OBJECT_CLASS_CURVE: number
}
const sinifi = (o: JXG.GeometryElement): number =>
  (o as unknown as { elementClass: number }).elementClass

const noktaMi = (o: JXG.GeometryElement): boolean => sinifi(o) === SINIF.OBJECT_CLASS_POINT
const cizgiMi = (o: JXG.GeometryElement): boolean => sinifi(o) === SINIF.OBJECT_CLASS_LINE
const cemberMi = (o: JXG.GeometryElement): boolean => sinifi(o) === SINIF.OBJECT_CLASS_CIRCLE
const egriMi = (o: JXG.GeometryElement): boolean => sinifi(o) === SINIF.OBJECT_CLASS_CURVE

export class CizimMotoru {
  readonly tahta: JXG.Board
  private arac = 'nokta'
  private secim: JXG.GeometryElement[] = []
  private uretilenBuTur: JXG.GeometryElement[] = []
  private noktaBuTur: Array<{ ad: string; x: number; y: number }> = []
  private girdiBuTur: string[] = []
  private gecmis: Islem[] = []
  private ileri: Islem[] = []
  private harfSayaci = 0
  /** Islem basindaki oge kimlikleri; uretilenler bunun farkidir. */
  private baslangicIdleri: Set<string> | null = null
  /**
   * Tahta kurulurken var olan ogeler: izgara, eksenler ve eksenlerin tanim
   * noktalari. Bunlar kullanici cizimi degil; temizleme onlara dokunmamali.
   * elType'a bakmak yetmiyor cunku eksenin tanim noktalari da 'point'.
   */
  private readonly sistemIdleri: Set<string>
  secenek: Secenekler = { ...VARSAYILAN_SECENEK }
  metin: MetinSecenekleri = { ...VARSAYILAN_METIN }
  yapisma = true
  yapismaAdimi = 1
  /** Konumlu araclarin tiklama yeri; `yap` icinden okunur. */
  konum: { x: number; y: number } = { x: 0, y: 0 }
  /** Serbest kalemin o anki yolu. */
  yol: Array<[number, number]> = []
  /** Kaydiricilara sirayla a, b, c ... adi verilir. */
  private kaydiriciSayaci = 0
  private kalemCiziyor = false

  /** Dis dunyaya haber: gunluk satiri, secim durumu, gecmis degisimi. */
  onNot: (metin: string) => void = () => {}
  onDurum: () => void = () => {}

  constructor(tahta: JXG.Board) {
    this.tahta = tahta
    this.sistemIdleri = new Set(Object.keys(tahta.objects))
    tahta.on('down', (olay: Event) => this.tikla(olay))
    // Serbest kalem tek tiklamayla degil surukleyerek calisiyor; digerleri
    // bu iki olayi hic gormuyor.
    tahta.on('move', (olay: Event) => this.kalemSurukle(olay))
    tahta.on('up', () => this.kalemBirak())
  }

  // ------------------------------------------------------------- durum
  get etkinArac(): string {
    return this.arac
  }

  get bekleyenSayisi(): number {
    const kural = KURALLAR[this.arac]
    if (!kural) return 0
    return kural.serbest ? this.secim.length : kural.bekle.length - this.secim.length
  }

  get ipucu(): string {
    const kural = KURALLAR[this.arac]
    if (!kural) return ''
    if (kural.kalem) return 'Basılı tutup sürükleyerek çizin'
    if (kural.konumlu) return 'Tahtada bir yere tıklayın'
    if (kural.serbest) {
      return this.secim.length < 3
        ? `${3 - this.secim.length} nokta daha ekleyin`
        : 'Bitirmek için ilk noktaya tıklayın veya Enter’a basın'
    }
    const sonraki = kural.bekle[this.secim.length]
    if (!sonraki) return ''
    const ad: Record<Beklenen, string> = {
      nokta: 'nokta',
      cizgi: 'doğru ya da doğru parçası',
      cember: 'çember',
      cokgen: 'çokgen',
      nesne: 'nesne',
    }
    return `${ad[sonraki]} seçin (${this.secim.length + 1}/${kural.bekle.length})`
  }

  get geriAlinabilir(): boolean {
    return this.gecmis.length > 0
  }

  get ileriAlinabilir(): boolean {
    return this.ileri.length > 0
  }

  get aktifSecenekler(): Array<keyof Secenekler> {
    return KURALLAR[this.arac]?.secenekler ?? []
  }

  get aktifMetinler(): Array<keyof MetinSecenekleri> {
    return KURALLAR[this.arac]?.metinler ?? []
  }

  aracSec(anahtar: string): void {
    this.arac = anahtar
    this.secimiBirak()
    this.onDurum()
  }

  secimiBirak(): void {
    for (const o of this.secim) this.vurgu(o, false)
    this.secim = []
    this.onDurum()
  }

  // ------------------------------------------------------------- yardim
  /**
   * JSXGraph create sarmalayicisi. Kutuphanenin donus tipi birlesik oldugu
   * icin tek yerde daraltiyoruz; araclar temiz kaliyor.
   */
  olustur(tip: string, girdi: unknown[], ayar: Record<string, unknown> = {}): JXG.GeometryElement {
    return this.tahta.create(tip, girdi, ayar) as JXG.GeometryElement
  }

  /** Kullanicinin cizdigi ogeler; tahta kurulumundan gelenler haric. */
  private tumOgeler(): JXG.GeometryElement[] {
    return Object.entries(this.tahta.objects)
      .filter(([id]) => !this.sistemIdleri.has(id))
      .map(([, o]) => o as JXG.GeometryElement)
  }

  /** Yeni bir arac islemi basliyor: mevcut ogeleri isaretle. */
  private islemBaslat(): void {
    this.baslangicIdleri = new Set(Object.keys(this.tahta.objects))
  }

  /** Islem sirasinda tahtaya eklenen her sey. */
  private islemUretilenleri(): string[] {
    const bas = this.baslangicIdleri ?? new Set<string>()
    return Object.keys(this.tahta.objects).filter(
      (id) => !bas.has(id) && !this.sistemIdleri.has(id),
    )
  }

  private vurgu(oge: JXG.GeometryElement, acik: boolean): void {
    try {
      oge.setAttribute({ strokeWidth: acik ? 4 : (oge.visProp.strokewidth as number) })
    } catch {
      /* bazi ogeler kalinlik tasimaz */
    }
  }

  /** "B" -> 1, "A2" -> 42 gibi; kayitli adlarla catismayi onler. */
  private harfSirasi(ad: string): number {
    const harfler = 'ABCDEFGHJKLMNPRSTUVYZ'
    const i = harfler.indexOf(ad[0] ?? '')
    if (i < 0) return 0
    const tur = Number(ad.slice(1)) || 0
    return tur * harfler.length + i
  }

  private yeniAd(): string {
    const harfler = 'ABCDEFGHJKLMNPRSTUVYZ'
    const tur = Math.floor(this.harfSayaci / harfler.length)
    const h = harfler[this.harfSayaci % harfler.length] ?? 'X'
    this.harfSayaci += 1
    return tur === 0 ? h : `${h}${tur}`
  }

  /** Serbest nokta. Islem kaydina yazilir ki ileri almada geri konabilsin. */
  noktaYarat(x: number, y: number, ad?: string): JXG.Point {
    const renk = rolRengi('lavanta')
    const isim = ad ?? this.yeniAd()
    if (ad) this.harfSayaci = Math.max(this.harfSayaci, this.harfSirasi(ad) + 1)
    const p = this.olustur('point', [x, y], {
      name: isim,
      size: 4,
      fillColor: renk.dolgu,
      strokeColor: renk.kenar,
      strokeWidth: 2,
      snapToGrid: this.yapisma,
      snapSizeX: this.yapismaAdimi,
      snapSizeY: this.yapismaAdimi,
      label: { fontSize: 13, strokeColor: renk.kenar, offset: [7, 9] },
    }) as unknown as JXG.Point
    this.noktaBuTur.push({ ad: isim, x: p.X(), y: p.Y() })
    this.uretilenBuTur.push(p)
    return p
  }

  /** Turetilmis oge: gecmise girer ama serbest nokta degildir. */
  kaydet<T extends JXG.GeometryElement>(oge: T, rol = 'gok'): T {
    const renk = rolRengi(rol)
    try {
      oge.setAttribute({ strokeColor: renk.kenar, fillColor: renk.dolgu })
    } catch {
      /* metin ogeleri dolgu tasimaz */
    }
    this.uretilenBuTur.push(oge)
    return oge
  }

  /** Kaydiricilara sirayla a, b, c ... adi verilir; ifadelerde kullanilir. */
  kaydiriciAdi(): string {
    const harfler = 'abcdefghkmnpqrstuvwz'
    const i = this.kaydiriciSayaci++
    const h = harfler[i % harfler.length] ?? 'a'
    const tur = Math.floor(i / harfler.length)
    return tur === 0 ? h : `${h}${tur}`
  }

  /** Nesnenin ekrandaki merkezi - etiket yerlestirmek icin. */
  nesneMerkezi(o: JXG.GeometryElement): () => { x: number; y: number } {
    const her = o as unknown as {
      X?(): number
      Y?(): number
      point1?: JXG.Point
      point2?: JXG.Point
      center?: JXG.Point
      vertices?: JXG.Point[]
    }
    if (typeof her.X === 'function' && typeof her.Y === 'function') {
      return () => ({ x: her.X!(), y: her.Y!() })
    }
    if (her.point1 && her.point2) {
      return () => ({
        x: (her.point1!.X() + her.point2!.X()) / 2,
        y: (her.point1!.Y() + her.point2!.Y()) / 2,
      })
    }
    if (her.vertices?.length) {
      const k = her.vertices.slice(0, -1)
      return () => ({
        x: k.reduce((t, v) => t + v.X(), 0) / k.length,
        y: k.reduce((t, v) => t + v.Y(), 0) / k.length,
      })
    }
    if (her.center) return () => ({ x: her.center!.X(), y: her.center!.Y() })
    return () => ({ x: 0, y: 0 })
  }

  /** Olcum etiketi - iki nesneye bagli, degeri canli hesaplanan metin. */
  olcumYaz(
    x: () => number,
    y: () => number,
    deger: () => string,
    rol = 'seftali',
  ): JXG.GeometryElement {
    const renk = rolRengi(rol)
    const yazi = this.olustur('text', [x, y, deger], {
      fontSize: 13,
      strokeColor: renk.kenar,
      anchorX: 'middle',
      anchorY: 'middle',
      cssStyle: 'font-family: inherit; font-weight: 600',
      fixed: true,
      highlight: false,
    })
    this.uretilenBuTur.push(yazi)
    return yazi
  }

  // ------------------------------------------------------------- tiklama
  private tikla(olay: Event): void {
    const kural = KURALLAR[this.arac]
    if (!kural) return

    // Ust uste duran nesnelerde once nokta secilir, en son cokgen.
    // Bir cemberin uzerindeki noktaya tiklandiginda cember degil nokta
    // secilmeli; cokgen genis alan kapladigi icin her zaman en arkada.
    const oncelik = (o: JXG.GeometryElement) =>
      noktaMi(o) ? 0 : o.elType.endsWith('polygon') ? 2 : 1
    const altinda = (
      this.tahta.getAllObjectsUnderMouse(olay as never) as JXG.GeometryElement[]
    )
      .filter((o) => !['grid', 'axis', 'ticks'].includes(o.elType))
      .sort((a, b) => oncelik(a) - oncelik(b))

    if (this.arac === 'sil') {
      const hedef = altinda[0]
      if (hedef) {
        this.tahta.removeObject(hedef)
        this.onNot(`${isaret(hedef)} silindi`)
        this.onDurum()
      }
      return
    }
    if (this.arac === 'sec') return

    if (this.secim.length === 0 && this.uretilenBuTur.length === 0) this.islemBaslat()

    const [x, y] = this.tahta.getUsrCoordsOfMouse(olay as never)

    // Serbest kalem: tiklama yolu baslatir, surukleme devam ettirir.
    if (kural.kalem) {
      this.kalemCiziyor = true
      this.yol = [[x, y]]
      return
    }

    // Konumlu arac: nesne toplamaz, tek tiklamayla tiklanan yerde calisir.
    if (kural.konumlu) {
      this.konum = { x, y }
      this.bitir()
      return
    }
    const beklenen = kural.serbest ? 'nokta' : kural.bekle[this.secim.length]
    if (!beklenen) return

    const secilen = this.nesneAl(beklenen, altinda, x, y)
    if (!secilen) return

    // Cokgen: ilk noktaya donunce kapanir.
    if (kural.serbest && this.secim.length >= 3 && secilen === this.secim[0]) {
      this.bitir()
      return
    }

    this.secim.push(secilen)
    this.vurgu(secilen, true)

    if (!kural.serbest && this.secim.length === kural.bekle.length) this.bitir()
    else this.onDurum()
  }

  /**
   * Beklenen turde nesne secer.
   * Nokta bekleniyorsa: var olan noktayi kullan, egri uzerindeyse kayan nokta
   * yarat, bos alanda yeni serbest nokta ac.
   */
  private nesneAl(
    beklenen: Beklenen,
    altinda: JXG.GeometryElement[],
    x: number,
    y: number,
  ): JXG.GeometryElement | null {
    if (beklenen === 'nokta') {
      const mevcut = altinda.find(noktaMi)
      if (mevcut) {
        this.girdiBuTur.push(isaret(mevcut))
        return mevcut
      }
      const egri = altinda.find(
        (o) => cizgiMi(o) || cemberMi(o) || egriMi(o) || o.elType === 'polygon',
      )
      if (egri && egri.elType !== 'polygon') {
        const kayan = this.olustur('glider', [x, y, egri], {
          name: this.yeniAd(),
          size: 4,
          fillColor: rolRengi('seftali').dolgu,
          strokeColor: rolRengi('seftali').kenar,
          strokeWidth: 2,
          label: { fontSize: 13, offset: [7, 9] },
        })
        this.uretilenBuTur.push(kayan)
        this.girdiBuTur.push(isaret(egri))
        return kayan
      }
      return this.noktaYarat(x, y)
    }

    const sinama: Record<Exclude<Beklenen, 'nokta'>, (o: JXG.GeometryElement) => boolean> = {
      cizgi: cizgiMi,
      cember: cemberMi,
      cokgen: (o) => o.elType === 'polygon' || o.elType === 'regularpolygon',
      nesne: (o) =>
        noktaMi(o) || cizgiMi(o) || cemberMi(o) || egriMi(o) || o.elType.endsWith('polygon'),
    }
    const bulunan = altinda.find(sinama[beklenen])
    if (bulunan) this.girdiBuTur.push(isaret(bulunan))
    return bulunan ?? null
  }

  /** Toplanan secimle araci uygular ve islemi gecmise yazar. */
  private bitir(): void {
    const kural = KURALLAR[this.arac]
    if (!kural) return
    try {
      const sonuc = kural.yap(this, this.secim as Secim)
      for (const o of sonuc) if (!this.uretilenBuTur.includes(o)) this.uretilenBuTur.push(o)
      this.onNot(`${ARAC_ADI[this.arac] ?? this.arac} uygulandı`)
    } catch (e) {
      this.onNot(`Uygulanamadı: ${e instanceof Error ? e.message : String(e)}`)
    }

    const uretilen = this.islemUretilenleri()
    if (uretilen.length) {
      this.gecmis.push({
        arac: this.arac,
        noktalar: this.noktaBuTur,
        girdiler: this.girdiBuTur,
        uretilenler: uretilen,
        secenek: { ...this.secenek },
        metin: { ...this.metin },
        konum: { ...this.konum },
        yol: this.yol.length ? this.yol.map((p) => [...p] as [number, number]) : undefined,
      })
      this.ileri = []
    }

    this.uretilenBuTur = []
    this.noktaBuTur = []
    this.girdiBuTur = []
    this.yol = []
    this.secimiBirak()
    this.tahta.update()
  }

  // -------------------------------------------------------- serbest kalem
  private kalemSurukle(olay: Event): void {
    if (!this.kalemCiziyor) return
    const [x, y] = this.tahta.getUsrCoordsOfMouse(olay as never)
    const son = this.yol[this.yol.length - 1]
    // Cok yakin noktalari atiyoruz: yol yuzlerce noktayla sismesin.
    if (son && Math.hypot(x - son[0], y - son[1]) < 0.06) return
    this.yol.push([x, y])
  }

  private kalemBirak(): void {
    if (!this.kalemCiziyor) return
    this.kalemCiziyor = false
    if (this.yol.length < 2) {
      this.yol = []
      return
    }
    this.bitir()
  }

  /** Cokgeni el ile kapat (Enter). */
  elleBitir(): void {
    const kural = KURALLAR[this.arac]
    if (kural?.serbest && this.secim.length >= 3) this.bitir()
  }

  // -------------------------------------------------------- geri / ileri
  geriAl(): void {
    const islem = this.gecmis.pop()
    if (!islem) return
    for (const id of [...islem.uretilenler].reverse()) {
      const oge = this.tahta.objects[id] as JXG.GeometryElement | undefined
      if (oge) {
        try {
          this.tahta.removeObject(oge)
        } catch {
          /* bagimli oge zaten silinmis olabilir */
        }
      }
    }
    this.ileri.push(islem)
    this.tahta.update()
    this.onNot(`Geri alındı: ${ARAC_ADI[islem.arac] ?? islem.arac}`)
    this.onDurum()
  }

  ileriAl(): void {
    const islem = this.ileri.pop()
    if (!islem) return
    const sonuc = this.islemiUygula(islem)
    if (sonuc) {
      this.gecmis.push(sonuc)
      this.onNot(`İleri alındı: ${ARAC_ADI[islem.arac] ?? islem.arac}`)
    } else {
      this.gecmis.push(islem)
      this.onNot('İleri alınamadı: girdi nesneleri artık yok.')
    }
    this.tahta.update()
    this.onDurum()
  }

  /**
   * Kayitli bir islemi yeniden calistirir.
   * Hem ileri alma hem kaydedilmis cizimi geri yukleme bu yoldan gecer;
   * tarif nesne adlariyla saklandigi icin iki durum ayni sekilde islenir.
   */
  private islemiUygula(islem: Islem): Islem | null {
    const kural = KURALLAR[islem.arac]
    if (!kural) return null

    const oncekiSecenek = this.secenek
    const oncekiMetin = this.metin
    const oncekiKonum = this.konum
    const oncekiYol = this.yol
    this.secenek = islem.secenek
    if (islem.metin) this.metin = islem.metin
    if (islem.konum) this.konum = islem.konum
    this.yol = islem.yol ?? []
    this.islemBaslat()
    this.uretilenBuTur = []
    this.noktaBuTur = []
    this.girdiBuTur = []

    // Once serbest noktalar geri konur, sonra arac ayni girdilerle calisir.
    const secim: JXG.GeometryElement[] = []
    for (const n of islem.noktalar) secim.push(this.noktaYarat(n.x, n.y, n.ad))
    for (const ad of islem.girdiler) {
      const oge = this.tahta.elementsByName[ad] as JXG.GeometryElement | undefined
      if (oge) secim.push(oge)
    }

    const eksik = !kural.serbest && !kural.konumlu && !kural.kalem &&
      secim.length !== kural.bekle.length
    let sonuc: Islem | null = null
    if (!eksik) {
      try {
        kural.yap(this, secim as Secim)
        sonuc = { ...islem, uretilenler: this.islemUretilenleri() }
      } catch {
        sonuc = null
      }
    }

    this.secenek = oncekiSecenek
    this.metin = oncekiMetin
    this.konum = oncekiKonum
    this.yol = oncekiYol
    this.uretilenBuTur = []
    this.noktaBuTur = []
    this.girdiBuTur = []
    return sonuc
  }

  /**
   * Cizimin tarifi.
   *
   * Tahtayi geri cozmek yerine islem gecmisini sakliyoruz: her adim hangi
   * aracin hangi girdilerle calistigini soyluyor. Kayit kucuk, tam ve
   * motordan bagimsiz; geri yukleme ayni adimlari yeniden oynatiyor.
   */
  tarif(): { surum: number; islemler: Islem[] } {
    return { surum: 1, islemler: this.gecmis.map((i) => ({ ...i })) }
  }

  /** Kayitli tarifi tahtaya kurar. */
  tarifiUygula(kayit: { surum: number; islemler: Islem[] }): { uygulanan: number; atlanan: number } {
    this.temizle()
    let uygulanan = 0
    let atlanan = 0
    // Ad catismasi olmasin diye sayac, tarifteki en yuksek harfin otesine alinir.
    this.harfSayaci = 0
    for (const islem of kayit.islemler) {
      const sonuc = this.islemiUygula(islem)
      if (sonuc) {
        this.gecmis.push(sonuc)
        uygulanan++
      } else {
        atlanan++
      }
    }
    this.ileri = []
    this.tahta.update()
    this.onNot(
      atlanan
        ? `Çizim yüklendi: ${uygulanan} adım, ${atlanan} adım atlandı`
        : `Çizim yüklendi: ${uygulanan} adım`,
    )
    this.onDurum()
    return { uygulanan, atlanan }
  }

  temizle(): void {
    for (const o of this.tumOgeler()) {
      try {
        this.tahta.removeObject(o)
      } catch {
        /* bagimli oge once silinmis olabilir */
      }
    }
    this.gecmis = []
    this.ileri = []
    this.harfSayaci = 0
    // Kaydirici sayaci da sifirlanmali: yoksa geri yuklenen cizimde
    // kaydirici 'a' yerine 'b' adini aliyor ve ona dayanan fonksiyon
    // ifadesi ("a*x^2") artik bos bir degiskene bakiyordu.
    this.kaydiriciSayaci = 0
    this.secim = []
    this.tahta.update()
    this.onDurum()
  }

  /** Tahtadaki kullanici nesnelerinin sayimi - denetci paneli icin. */
  ozet(): Array<{ tip: string; adet: number }> {
    const sayim = new Map<string, number>()
    for (const o of this.tumOgeler()) {
      // Yazi ve eksen isaretleri cizim degil; sayimda gorunmemeli.
      if (['text', 'label', 'ticks'].includes(o.elType)) continue
      sayim.set(o.elType, (sayim.get(o.elType) ?? 0) + 1)
    }
    return [...sayim.entries()].map(([tip, adet]) => ({ tip, adet }))
  }
}

const ARAC_ADI: Record<string, string> = {
  nokta: 'Nokta',
  nokta_uzerinde: 'Nesne üzerinde nokta',
  dogru_parcasi: 'Doğru parçası',
  isin: 'Işın',
  dogru: 'Doğru',
  cokgen: 'Çokgen',
  duzgun_cokgen: 'Düzgün çokgen',
  cember_merkez_nokta: 'Çember',
  cember_yaricap: 'Çember (yarıçap)',
  cember_uc_nokta: 'Çember (üç nokta)',
  yay: 'Yay',
  daire_dilimi: 'Daire dilimi',
  orta_nokta: 'Orta nokta',
  dikme: 'Dikme',
  paralel: 'Paralel',
  orta_dikme: 'Orta dikme',
  aci_ortay: 'Açıortay',
  kesisim: 'Kesişim',
  teget: 'Teğet',
  olcum_uzunluk: 'Uzunluk',
  olcum_aci: 'Açı',
  olcum_alan: 'Alan',
  olcum_cevre: 'Çevre',
  olcum_egim: 'Eğim',
  oteleme: 'Öteleme',
  yansima: 'Yansıma',
  dondurme: 'Döndürme',
  homoteti: 'Benzerlik',
  vektor: 'Vektör',
  fonksiyon: 'Fonksiyon grafiği',
  kaydirici: 'Kaydırıcı',
  egri_yeri: 'Eğri yeri',
  iz: 'İz',
  metin: 'Metin',
  etiket: 'Etiket',
  kalem: 'Serbest kalem',
}

const derece = (r: number) => (r * 180) / Math.PI
const P = (o: JXG.GeometryElement) => o as unknown as JXG.Point
const L = (o: JXG.GeometryElement) => o as unknown as JXG.Line
const C = (o: JXG.GeometryElement) => o as unknown as JXG.Circle

/**
 * Arac kurallari.
 * `bekle` neyin hangi sirayla secilecegini, `yap` sonucu nasil kuracagini
 * soyler. Sinif seviyesine gore suzme veritabaninda (arac.min_sinif).
 */
const KURALLAR: Record<string, AracKurali> = {
  nokta: { bekle: ['nokta'], yap: () => [] },
  nokta_uzerinde: { bekle: ['nokta'], yap: () => [] },

  dogru_parcasi: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => [m.kaydet(m.olustur('segment', [a, b]))],
  },
  isin: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => [
      m.kaydet(
        m.olustur('line', [a, b], {
          straightFirst: false,
          straightLast: true,
        }),
      ),
    ],
  },
  dogru: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => [m.kaydet(m.olustur('line', [a, b]))],
  },
  vektor: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => [m.kaydet(m.olustur('arrow', [a, b]))],
  },

  cokgen: {
    bekle: [],
    serbest: true,
    yap: (m, secim) => [
      m.kaydet(
        m.olustur('polygon', secim, {
          fillOpacity: 0.4,
          borders: { strokeColor: rolRengi('nane').kenar, strokeWidth: 2 },
        }),
        'nane',
      ),
    ],
  },
  duzgun_cokgen: {
    bekle: ['nokta', 'nokta'],
    secenekler: ['kenarSayisi'],
    yap: (m, [a, b]) => [
      m.kaydet(
        m.olustur('regularpolygon', [a, b, m.secenek.kenarSayisi], {
          fillOpacity: 0.4,
        }),
        'nane',
      ),
    ],
  },

  cember_merkez_nokta: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [o, a]) => [
      m.kaydet(m.olustur('circle', [o, a], { fillOpacity: 0 })),
    ],
  },
  cember_yaricap: {
    bekle: ['nokta'],
    secenekler: ['yaricap'],
    yap: (m, [o]) => [
      m.kaydet(m.olustur('circle', [o, m.secenek.yaricap], { fillOpacity: 0 })),
    ],
  },
  cember_uc_nokta: {
    bekle: ['nokta', 'nokta', 'nokta'],
    yap: (m, [a, b, c]) => [
      m.kaydet(
        m.olustur('circumcircle', [a, b, c], { fillOpacity: 0 }),
      ),
    ],
  },
  yay: {
    bekle: ['nokta', 'nokta', 'nokta'],
    yap: (m, [o, a, b]) => [
      m.kaydet(m.olustur('arc', [o, a, b])),
    ],
  },
  daire_dilimi: {
    bekle: ['nokta', 'nokta', 'nokta'],
    yap: (m, [o, a, b]) => [
      m.kaydet(
        m.olustur('sector', [o, a, b], { fillOpacity: 0.4 }),
        'nane',
      ),
    ],
  },

  orta_nokta: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => [
      m.kaydet(m.olustur('midpoint', [a, b]), 'lavanta'),
    ],
  },
  dikme: {
    bekle: ['cizgi', 'nokta'],
    yap: (m, [d, p]) => [m.kaydet(m.olustur('perpendicular', [d, p]))],
  },
  paralel: {
    bekle: ['cizgi', 'nokta'],
    yap: (m, [d, p]) => [m.kaydet(m.olustur('parallel', [d, p]))],
  },
  orta_dikme: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => {
      const orta = m.kaydet(m.olustur('midpoint', [a, b]), 'lavanta')
      const parca = m.kaydet(
        m.olustur('segment', [a, b], { visible: false }),
      )
      return [orta, parca, m.kaydet(m.olustur('perpendicular', [parca, orta]))]
    },
  },
  aci_ortay: {
    bekle: ['nokta', 'nokta', 'nokta'],
    yap: (m, [a, o, b]) => [
      m.kaydet(m.olustur('bisector', [a, o, b])),
    ],
  },
  kesisim: {
    bekle: ['nesne', 'nesne'],
    yap: (m, [a, b]) => [
      m.kaydet(m.olustur('intersection', [a, b, 0]), 'lavanta'),
    ],
  },
  teget: {
    bekle: ['nokta'],
    yap: (m, [p]) => [m.kaydet(m.olustur('tangent', [p]))],
  },

  olcum_uzunluk: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [a, b]) => {
      const p1 = P(a)
      const p2 = P(b)
      return [
        m.olcumYaz(
          () => (p1.X() + p2.X()) / 2,
          () => (p1.Y() + p2.Y()) / 2 + 0.35,
          () => Math.hypot(p2.X() - p1.X(), p2.Y() - p1.Y()).toFixed(2),
        ),
      ]
    },
  },
  olcum_aci: {
    bekle: ['nokta', 'nokta', 'nokta'],
    yap: (m, [a, o, b]) => {
      const yay = m.kaydet(
        m.olustur('angle', [a, o, b], {
          radius: 1.3,
          fillOpacity: 0.5,
          withLabel: false,
        }),
        'seftali',
      ) as unknown as { Value(): number }
      const merkez = P(o)
      return [
        m.olcumYaz(
          () => merkez.X() + 2,
          () => merkez.Y() + 1,
          () => `${derece(yay.Value()).toFixed(0)}°`,
        ),
      ]
    },
  },
  olcum_alan: {
    bekle: ['cokgen'],
    yap: (m, [c]) => {
      const cokgen = c as unknown as { Area(): number; vertices: JXG.Point[] }
      const kose = cokgen.vertices.slice(0, -1)
      const ort = (f: (p: JXG.Point) => number) => () =>
        kose.reduce((t, v) => t + f(v), 0) / kose.length
      return [
        m.olcumYaz(
          ort((p) => p.X()),
          ort((p) => p.Y()),
          () => `alan ${cokgen.Area().toFixed(2)}`,
          'tereyagi',
        ),
      ]
    },
  },
  olcum_cevre: {
    bekle: ['cokgen'],
    yap: (m, [c]) => {
      const cokgen = c as unknown as { Perimeter(): number; vertices: JXG.Point[] }
      const kose = cokgen.vertices.slice(0, -1)
      const ort = (f: (p: JXG.Point) => number) => () =>
        kose.reduce((t, v) => t + f(v), 0) / kose.length
      return [
        m.olcumYaz(
          ort((p) => p.X()),
          () => ort((p) => p.Y())() - 0.8,
          () => `çevre ${cokgen.Perimeter().toFixed(2)}`,
          'gok',
        ),
      ]
    },
  },
  olcum_egim: {
    bekle: ['cizgi'],
    yap: (m, [d]) => {
      const dogru = L(d)
      return [
        m.olcumYaz(
          () => dogru.point1.X() + 0.6,
          () => dogru.point1.Y() + 0.6,
          () => `eğim ${(dogru as unknown as { getSlope(): number }).getSlope().toFixed(2)}`,
          'gok',
        ),
      ]
    },
  },

  oteleme: {
    bekle: ['nesne', 'nokta', 'nokta'],
    yap: (m, [nesne, a, b]) => {
      const p1 = P(a)
      const p2 = P(b)
      const d = m.olustur('transform', [() => p2.X() - p1.X(), () => p2.Y() - p1.Y()], {
        type: 'translate',
      })
      return [m.kaydet(m.olustur('point', [nesne, d]) as never, 'nane')]
    },
  },
  yansima: {
    bekle: ['nesne', 'cizgi'],
    yap: (m, [nesne, eksen]) => [
      m.kaydet(m.olustur('reflection', [nesne, eksen]) as never, 'nane'),
    ],
  },
  dondurme: {
    bekle: ['nesne', 'nokta'],
    secenekler: ['aci'],
    yap: (m, [nesne, merkez]) => {
      const d = m.olustur('transform', [(m.secenek.aci * Math.PI) / 180, merkez], {
        type: 'rotate',
      })
      return [m.kaydet(m.olustur('point', [nesne, d]) as never, 'nane')]
    },
  },
  // --------------------------------------------------------------- ileri
  fonksiyon: {
    bekle: [],
    konumlu: true,
    metinler: ['ifade'],
    yap: (m) => {
      // Ifade JessieCode ile derleniyor: JSXGraph'in kendi ayristiricisi.
      // eval kullanmiyoruz; kaydirici adlari (a, b, c) da ifadede gecerli
      // oldugu icin "a*x^2" gibi canli parametreli grafikler kurulabiliyor.
      const f = m.tahta.jc.snippet(m.metin.ifade, true, 'x', true)
      const g = m.kaydet(m.olustur('functiongraph', [f], { strokeWidth: 2.5 }), 'gul')
      return [
        g,
        m.olcumYaz(
          () => m.konum.x,
          () => m.konum.y,
          () => `y = ${m.metin.ifade}`,
          'gul',
        ),
      ]
    },
  },
  kaydirici: {
    bekle: [],
    konumlu: true,
    secenekler: ['enAz', 'enCok'],
    yap: (m) => {
      const ad = m.kaydiriciAdi()
      const { x, y } = m.konum
      return [
        m.kaydet(
          m.olustur(
            'slider',
            [
              [x, y],
              [x + 4, y],
              [m.secenek.enAz, (m.secenek.enAz + m.secenek.enCok) / 2, m.secenek.enCok],
            ],
            { name: ad, snapWidth: 0.1, withLabel: true },
          ),
          'lavanta',
        ),
      ]
    },
  },
  egri_yeri: {
    bekle: ['nokta', 'nokta'],
    yap: (m, [kayan, bagli]) => [
      m.kaydet(m.olustur('tracecurve', [kayan, bagli], { strokeWidth: 2 }), 'seftali'),
    ],
  },
  iz: {
    bekle: ['nesne'],
    anahtar: true,
    yap: (m, [nesne]) => {
      const acik = !nesne.visProp.trace
      nesne.setAttribute({ trace: acik })
      if (!acik) (nesne as unknown as { clearTrace?(): void }).clearTrace?.()
      m.onNot(`${isaret(nesne)}: iz ${acik ? 'açıldı' : 'kapandı'}`)
      return []
    },
  },

  // ----------------------------------------------------------------- not
  metin: {
    bekle: [],
    konumlu: true,
    metinler: ['yazi'],
    yap: (m) => {
      const yazi = m.metin.yazi
      return [m.olcumYaz(() => m.konum.x, () => m.konum.y, () => yazi, 'notr')]
    },
  },
  etiket: {
    bekle: ['nesne'],
    metinler: ['yazi'],
    yap: (m, [nesne]) => {
      // Nesnenin adini degistirmiyoruz: ad kimliktir ve tarif kaydinda
      // girdiler ada gore aranir. Bunun yerine nesneyi izleyen ayri bir
      // yazi kuruluyor - silinebilir, geri alinabilir, kimligi bozmaz.
      const yazi = m.metin.yazi
      const yer = m.nesneMerkezi(nesne)
      return [m.olcumYaz(() => yer().x, () => yer().y + 0.5, () => yazi, 'lavanta')]
    },
  },
  kalem: {
    bekle: [],
    kalem: true,
    yap: (m) => {
      const yol = m.yol.map((p) => [...p] as [number, number])
      return [
        m.kaydet(
          m.olustur(
            'curve',
            [yol.map((p) => p[0]), yol.map((p) => p[1])],
            { strokeWidth: 3, highlight: false },
          ),
          'gul',
        ),
      ]
    },
  },

  homoteti: {
    bekle: ['nesne', 'nokta'],
    secenekler: ['oran'],
    yap: (m, [nesne, merkez]) => {
      const c = P(merkez)
      const d = m.olustur(
        'transform',
        [
          () => c.X() * (1 - m.secenek.oran),
          () => c.Y() * (1 - m.secenek.oran),
          m.secenek.oran,
          m.secenek.oran,
        ],
        { type: 'generic' },
      )
      void d
      return [
        m.kaydet(
          m.olustur('point', [
            () => c.X() + (P(nesne).X() - c.X()) * m.secenek.oran,
            () => c.Y() + (P(nesne).Y() - c.Y()) * m.secenek.oran,
          ]) as never,
          'nane',
        ),
      ]
    },
  },
}

export const aracVarMi = (anahtar: string): boolean => anahtar in KURALLAR || anahtar === 'sec' || anahtar === 'sil'

/** Arayuzun hangi araclari etkin gosterecegini bilmesi icin. */
export const HAZIR_ARACLAR = new Set([...Object.keys(KURALLAR), 'sec', 'sil'])

/** Motor tip adlarinin Turkce karsiliklari - arayuzde gosterim icin. */
export const NESNE_TIP_ADI: Record<string, string> = {
  point: 'nokta',
  glider: 'bağlı nokta',
  midpoint: 'orta nokta',
  intersection: 'kesişim',
  segment: 'doğru parçası',
  line: 'doğru',
  arrow: 'vektör',
  circle: 'çember',
  circumcircle: 'çember',
  polygon: 'çokgen',
  regularpolygon: 'düzgün çokgen',
  arc: 'yay',
  sector: 'daire dilimi',
  angle: 'açı',
  perpendicular: 'dikme',
  parallel: 'paralel',
  bisector: 'açıortay',
  tangent: 'teğet',
  reflection: 'yansıma',
  curve: 'eğri',
  tracecurve: 'eğri yeri',
  slider: 'kaydırıcı',
  incircle: 'iç teğet çember',
  orthogonalprojection: 'dik izdüşüm',
}

/** Sayisal secenek etiketleri. */
export const SECENEK_ETIKETI: Record<keyof Secenekler, string> = {
  yaricap: 'Yarıçap',
  kenarSayisi: 'Kenar sayısı',
  aci: 'Açı (derece)',
  oran: 'Oran',
  enAz: 'En az',
  enCok: 'En çok',
}

/** Yazi kutusu etiketleri ve ipuclari. */
export const METIN_ETIKETI: Record<keyof MetinSecenekleri, { ad: string; ipucu: string }> = {
  ifade: { ad: 'y =', ipucu: 'x^2 - 3, sin(x), a*x + 2' },
  yazi: { ad: 'Yazı', ipucu: 'tahtaya yazılacak metin' },
}

export { JXG }
