/**
 * Palet koprusu.
 *
 * Sahne motoru (JSXGraph) SVG'yi kendisi urettigi icin Tailwind ile
 * bicimlendirilemez. Renkleri koda gomup ikinci bir kaynak yaratmak yerine,
 * tek CSS dosyasindaki @theme tokenlarini calisma aninda okuyup motora
 * veriyoruz. Boylece renk icin tek kaynak korunur: stil.css.
 *
 * Pastel kurali: dolgu pastel ton, kenar ve etiket koyu kardes ton.
 */

export type PaletRolu = 'nane' | 'lavanta' | 'seftali' | 'gok' | 'gul' | 'tereyagi' | 'notr'

export interface RolRengi {
  dolgu: string
  kenar: string
}

export interface Palet {
  roller: Record<PaletRolu, RolRengi>
  zemin: string
  yuzey: string
  izgara: string
  eksen: string
  murekkep: string
  murekkep2: string
  murekkep3: string
  marka: string
  vurgu: string
}

function oku(ad: string, yedek: string): string {
  if (typeof window === 'undefined') return yedek
  const deger = getComputedStyle(document.documentElement).getPropertyValue(ad).trim()
  return deger || yedek
}

const ROLLER: PaletRolu[] = ['nane', 'lavanta', 'seftali', 'gok', 'gul', 'tereyagi', 'notr']

let onbellek: Palet | null = null

/** Tokenlari okur ve onbelleğe alir. Tema degisirse `paletiTazele` cagirilir. */
export function palet(): Palet {
  if (onbellek) return onbellek
  const roller = Object.fromEntries(
    ROLLER.map((rol) => [
      rol,
      { dolgu: oku(`--color-${rol}`, '#cce3f5'), kenar: oku(`--color-${rol}-koyu`, '#1f6193') },
    ]),
  ) as Record<PaletRolu, RolRengi>

  onbellek = {
    roller,
    zemin: oku('--color-zemin', '#f6f7fc'),
    yuzey: oku('--color-yuzey', '#ffffff'),
    izgara: oku('--color-yuzey-3', '#e6eaf5'),
    eksen: oku('--color-murekkep-3', '#8b94ab'),
    murekkep: oku('--color-murekkep', '#1e2333'),
    murekkep2: oku('--color-murekkep-2', '#565f78'),
    murekkep3: oku('--color-murekkep-3', '#8b94ab'),
    marka: oku('--color-marka', '#6c5cc4'),
    vurgu: oku('--color-tereyagi-koyu', '#856713'),
  }
  return onbellek
}

export function paletiTazele(): void {
  onbellek = null
}

/** Bir rolun dolgu/kenar cifti; bilinmeyen rol icin notr doner. */
export function rolRengi(rol: string): RolRengi {
  const p = palet()
  return p.roller[rol as PaletRolu] ?? p.roller.notr
}
