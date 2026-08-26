import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { api, type KademeDugumu } from '../ortak/api'

/**
 * Kabuk durumu.
 *
 * Panellerin acik/kapali olmasi, secili sinif ve alan suzgeci, komut
 * paletinin gorunurlugu. Rota degistiginde bu durum korunur; kullanici
 * paneli kapattiysa kapali kalir.
 */
export const kabukDeposu = defineStore('kabuk', () => {
  const listeAcik = ref(true)
  const denetciAcik = ref(true)
  const paletAcik = ref(false)

  /**
   * Sunum kipi: siniftaki projeksiyon icin.
   * Yan paneller kapanir, yazi buyur, kontrast artar. Token degerlerini
   * degistiriyoruz - ayri bir stil dosyasi yok, tek renk kaynagi korunuyor.
   */
  const sunumKipi = ref(false)
  /** Sunum kipine girmeden onceki panel durumu; cikista geri konur. */
  let oncekiPaneller = { liste: true, denetci: true }

  function sunumuDegistir(): void {
    sunumKipi.value = !sunumKipi.value
    if (sunumKipi.value) {
      oncekiPaneller = { liste: listeAcik.value, denetci: denetciAcik.value }
      listeAcik.value = false
      denetciAcik.value = false
    } else {
      listeAcik.value = oncekiPaneller.liste
      denetciAcik.value = oncekiPaneller.denetci
    }
  }

  const agac = ref<KademeDugumu[]>([])
  const agacYukleniyor = ref(false)
  const hata = ref<string | null>(null)

  /** Baglam listesinde secili alan suzgeci: null = hepsi. */
  const alanSuzgeci = ref<string | null>(null)

  /**
   * Kirinti yolu. Her gorunum acilirken kendi yolunu yazar; kabuk yalnizca
   * gosterir. Boylece ust cubuk rota adlarini tahmin etmek zorunda kalmaz.
   */
  const kirinti = ref<Array<{ ad: string; rota?: RouteLocationRaw }>>([])

  function kirintiYaz(yol: Array<{ ad: string; rota?: RouteLocationRaw }>): void {
    kirinti.value = yol
  }

  async function agaciYukle(): Promise<void> {
    if (agac.value.length || agacYukleniyor.value) return
    agacYukleniyor.value = true
    try {
      agac.value = await api.agac()
      hata.value = null
    } catch (e) {
      hata.value = e instanceof Error ? e.message : String(e)
    } finally {
      agacYukleniyor.value = false
    }
  }

  return {
    listeAcik,
    denetciAcik,
    paletAcik,
    sunumKipi,
    sunumuDegistir,
    agac,
    agacYukleniyor,
    hata,
    alanSuzgeci,
    kirinti,
    kirintiYaz,
    agaciYukle,
  }
})
