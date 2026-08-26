import type JXG from 'jsxgraph'
import { palet } from './palet'

/**
 * Disa aktarim.
 *
 * Tahtayi SVG ya da PNG olarak indirir ve sahne baglantisini panoya kopyalar.
 * SVG dogrudan motorun urettigi kokten seri hale getiriliyor - ikinci bir
 * cizim yolu yok, bu yuzden ekranda ne varsa dosyada da o var.
 *
 * PNG icin SVG'yi bir Image uzerinden tuvale ciziyoruz. Harici istek yok:
 * SVG data URI olarak veriliyor, yazi tipleri de sistem yazi tipine
 * dusuyor - PNG'de yaziyi vektorel tutmak yerine cizmek gerekiyor.
 */

/** Tahtanin SVG kokunu bagimsiz, acilabilir bir belge olarak dondurur. */
export function svgMetni(tahta: JXG.Board): string {
  const kok = (tahta.containerObj as HTMLElement).querySelector('svg')
  if (!kok) throw new Error('Tahtanın SVG kökü bulunamadı.')

  const kopya = kok.cloneNode(true) as SVGSVGElement
  const g = kok.clientWidth || Number(kok.getAttribute('width')) || 800
  const y = kok.clientHeight || Number(kok.getAttribute('height')) || 600
  kopya.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  kopya.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  kopya.setAttribute('width', String(g))
  kopya.setAttribute('height', String(y))
  kopya.setAttribute('viewBox', `0 0 ${g} ${y}`)

  // Ekranda zemini kapsayici veriyor; dosyada saydam kalmasin diye
  // en alta bir dolgu dikdortgeni koyuyoruz.
  const p = palet()
  const zemin = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  zemin.setAttribute('x', '0')
  zemin.setAttribute('y', '0')
  zemin.setAttribute('width', String(g))
  zemin.setAttribute('height', String(y))
  zemin.setAttribute('fill', p.yuzey)
  kopya.insertBefore(zemin, kopya.firstChild)

  return new XMLSerializer().serializeToString(kopya)
}

function indir(ad: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = ad
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Tarayici indirmeyi baslatana kadar URL yasamali.
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export function svgIndir(tahta: JXG.Board, ad: string): void {
  indir(`${ad}.svg`, new Blob([svgMetni(tahta)], { type: 'image/svg+xml;charset=utf-8' }))
}

/** PNG: SVG bir Image'a yuklenip tuvale cizilir, sonra blob'a alinir. */
export async function pngIndir(tahta: JXG.Board, ad: string, olcek = 2): Promise<void> {
  const metin = svgMetni(tahta)
  const kok = (tahta.containerObj as HTMLElement).querySelector('svg')
  const g = kok?.clientWidth || 800
  const y = kok?.clientHeight || 600

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(metin)}`
  const resim = new Image()
  resim.width = g
  resim.height = y

  await new Promise<void>((coz, red) => {
    resim.onload = () => coz()
    resim.onerror = () => red(new Error('SVG görüntüye çevrilemedi.'))
    resim.src = url
  })

  const tuval = document.createElement('canvas')
  tuval.width = Math.round(g * olcek)
  tuval.height = Math.round(y * olcek)
  const ctx = tuval.getContext('2d')
  if (!ctx) throw new Error('Tuval bağlamı açılamadı.')
  ctx.scale(olcek, olcek)
  ctx.drawImage(resim, 0, 0, g, y)

  const blob = await new Promise<Blob | null>((coz) => tuval.toBlob(coz, 'image/png'))
  if (!blob) throw new Error('PNG üretilemedi.')
  indir(`${ad}.png`, blob)
}

/**
 * Sahnenin tam adresini panoya kopyalar.
 * Statik kipte yonlendirme hash tabanli oldugu icin adres oldugu gibi
 * paylasilabilir; sunuculu kipte de ayni.
 */
export async function baglantiKopyala(): Promise<string> {
  const adres = window.location.href
  try {
    await navigator.clipboard.writeText(adres)
  } catch {
    // Pano izni yoksa gecici bir alan uzerinden kopyala.
    const alan = document.createElement('textarea')
    alan.value = adres
    alan.setAttribute('readonly', '')
    alan.style.position = 'fixed'
    alan.style.opacity = '0'
    document.body.appendChild(alan)
    alan.select()
    document.execCommand('copy')
    alan.remove()
  }
  return adres
}
