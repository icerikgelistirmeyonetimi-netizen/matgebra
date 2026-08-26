import type { SahneVerisi } from '@/ortak/api'

/**
 * "Kendin çiz" karsilastirmasi.
 *
 * Ogrencinin serbest tuvalde cizdigini, devraldigi sahnenin kendisiyle
 * karsilastirir. Karsilastirma TUR TURUNE degil, KATEGORI bazinda yapilir:
 * altigeni pergelle mi yoksa duzgun cokgen araciyla mi kurdugu bizi
 * ilgilendirmiyor - ortada bir cokgen olup olmadigi ilgilendiriyor.
 * Tek dogru yol dayatmak, cizim atolyesinin butun amacini bozardi.
 */

export type Kategori = 'nokta' | 'dogru' | 'cember' | 'cokgen' | 'yay' | 'aci'

export const KATEGORI_ADI: Record<Kategori, string> = {
  nokta: 'nokta',
  dogru: 'doğru / doğru parçası',
  cember: 'çember',
  cokgen: 'çokgen',
  yay: 'yay veya daire dilimi',
  aci: 'açı',
}

/** Sahne nesne tipleri -> kategori. Olcum ve yazi tipleri sayilmaz. */
const SAHNE_KATEGORISI: Record<string, Kategori> = {
  nokta: 'nokta',
  nokta_uzerinde: 'nokta',
  nokta_bilesen: 'nokta',
  nokta_oteleme: 'nokta',
  nokta_donme: 'nokta',
  nokta_homoteti: 'nokta',
  orta_nokta: 'nokta',
  kesisim: 'nokta',
  dik_izdusum: 'nokta',
  agirlik_merkezi: 'nokta',
  ic_merkez: 'nokta',
  cevrel_merkez: 'nokta',
  dogru: 'dogru',
  dogru_parcasi: 'dogru',
  isin: 'dogru',
  vektor: 'dogru',
  dikme: 'dogru',
  paralel: 'dogru',
  orta_dikme: 'dogru',
  aci_ortay: 'dogru',
  teget: 'dogru',
  cember: 'cember',
  cevrel_cember: 'cember',
  ic_teget_cember: 'cember',
  cokgen: 'cokgen',
  duzgun_cokgen: 'cokgen',
  yansima: 'cokgen',
  yay: 'yay',
  daire_dilimi: 'yay',
  aci: 'aci',
  olcum_aci: 'aci',
}

/** Tahtadaki JSXGraph tipleri -> kategori. */
const TAHTA_KATEGORISI: Record<string, Kategori> = {
  point: 'nokta',
  glider: 'nokta',
  midpoint: 'nokta',
  intersection: 'nokta',
  orthogonalprojection: 'nokta',
  incenter: 'nokta',
  circumcenter: 'nokta',
  line: 'dogru',
  segment: 'dogru',
  arrow: 'dogru',
  perpendicular: 'dogru',
  parallel: 'dogru',
  bisector: 'dogru',
  tangent: 'dogru',
  circle: 'cember',
  circumcircle: 'cember',
  incircle: 'cember',
  polygon: 'cokgen',
  regularpolygon: 'cokgen',
  reflection: 'cokgen',
  arc: 'yay',
  sector: 'yay',
  angle: 'aci',
}

export interface KarsilastirmaSatiri {
  kategori: Kategori
  hedef: number
  sende: number
  durum: 'tamam' | 'eksik' | 'fazla'
}

/** Sahnenin gorunur nesnelerinden hedef sayimi cikarir. */
export function sahneHedefi(sahne: SahneVerisi): Map<Kategori, number> {
  const sayim = new Map<Kategori, number>()
  for (const n of sahne.nesneler) {
    // Gorunmez yardimci nesneler hedefe girmez: ogrenci onlari gormedigi
    // icin cizmesi de beklenemez.
    if (!n.gorunur) continue
    const k = SAHNE_KATEGORISI[n.tip]
    if (!k) continue
    sayim.set(k, (sayim.get(k) ?? 0) + 1)
  }
  return sayim
}

/** Tahta sayimini (elType -> adet) kategoriye indirger. */
export function tahtaSayimi(ozet: Array<{ tip: string; adet: number }>): Map<Kategori, number> {
  const sayim = new Map<Kategori, number>()
  for (const o of ozet) {
    const k = TAHTA_KATEGORISI[o.tip]
    if (!k) continue
    sayim.set(k, (sayim.get(k) ?? 0) + o.adet)
  }
  return sayim
}

export function karsilastir(
  sahne: SahneVerisi,
  ozet: Array<{ tip: string; adet: number }>,
): { satirlar: KarsilastirmaSatiri[]; tamam: boolean; ozetMetni: string } {
  const hedef = sahneHedefi(sahne)
  const bende = tahtaSayimi(ozet)
  // Yalnizca hedefte gecen kategoriler listelenir. Ogrencinin fazladan
  // cizdikleri hata degil; ayrica duzgun cokgen aracinin kendi urettigi
  // kenarlar "6 dogru parcasi" diye gorunup kafa karistiriyordu.
  const kategoriler = [...hedef.keys()]

  const satirlar: KarsilastirmaSatiri[] = kategoriler
    .map((kategori) => {
      const h = hedef.get(kategori) ?? 0
      const s = bende.get(kategori) ?? 0
      return {
        kategori,
        hedef: h,
        sende: s,
        durum: s >= h ? (s > h && h > 0 ? 'fazla' : 'tamam') : 'eksik',
      } as KarsilastirmaSatiri
    })
    .sort((a, b) => b.hedef - a.hedef)

  const eksikler = satirlar.filter((x) => x.durum === 'eksik')
  const tamam = eksikler.length === 0 && satirlar.some((x) => x.hedef > 0)

  const ozetMetni = tamam
    ? 'Sahnedeki bütün yapı taşları çiziminizde var.'
    : eksikler.length
      ? `Eksik: ${eksikler.map((x) => `${x.hedef - x.sende} ${KATEGORI_ADI[x.kategori]}`).join(', ')}`
      : 'Çizmeye başlayın.'

  return { satirlar, tamam, ozetMetni }
}
