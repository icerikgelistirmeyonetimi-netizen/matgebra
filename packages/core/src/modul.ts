import type { SahneTuru } from './sabitler.js'

/**
 * Modul sozlesmesi.
 *
 * Her modul klasoru (apps/web/src/modules/<slug>/modul.ts) tek bir
 * ModulBildirimi disa aktarir. Kabuk bu bildirimleri toplar; yeni modul
 * eklemek icin kabuk kodunu duzenlemek gerekmez.
 *
 * Moduller birbirini dogrudan import edemez — ortak her sey @matgebra/core
 * ya da apps/web/src/shared uzerinden gecer.
 */

export interface RayGirdisi {
  /** Rota adi. */
  ad: string
  /** Ikon rayinda gorunecek etiket. */
  etiket: string
  /** Ikon anahtari (shared/ikonlar icinde tanimli). */
  ikon: string
  /** Ray sirasi; kucuk olan yukarida. */
  sira: number
}

export interface AracGirdisi {
  anahtar: string
  etiket: string
  ikon: string
  grup: 'temel' | 'sekil' | 'insa' | 'olcum' | 'donusum' | 'ileri' | 'not'
  /** Bu aracin gorunmesi icin gereken en dusuk sinif seviyesi. */
  minSinif: number
  kisayol?: string
}

export interface ModulBildirimi {
  slug: string
  ad: string
  surum: string
  /** Ikon rayinda ust duzey giris (yoksa modul yalniz ic rota saglar). */
  ray?: RayGirdisi
  /** Bu modulun ele aldigi sahne turleri. */
  sahneTurleri?: SahneTuru[]
  /** Araç çubuğuna eklenecek araclar. */
  araclar?: AracGirdisi[]
}
