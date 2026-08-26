<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import IkonRay from './IkonRay.vue'
import BaglamListesi from './BaglamListesi.vue'
import UstCubuk from './UstCubuk.vue'
import KomutPaleti from './KomutPaleti.vue'
import { kabukDeposu } from './kabukDeposu'

/**
 * Uygulama kabugu.
 *
 * Tam ekran ve sabit: `h-screen w-screen overflow-hidden`. Sayfanin kendisi
 * asla kaymaz; yalnizca paneller kendi icinde kayar. Boylece calisma alani
 * her zaman kalan genisligin tamamini kaplar.
 */
const kabuk = kabukDeposu()

/**
 * Sunum kipi token ezmesi.
 *
 * Ayri bir stil dosyasi yazmiyoruz: @theme'deki olcek ve renk tokenlarini
 * kokte gecici olarak degistiriyoruz. Butun bilesenler zaten bu tokenlari
 * okudugu icin yazi buyuyor, kontrast artiyor ve tek renk kaynagi bozulmuyor.
 */
const sunumTokenlari = computed<Record<string, string> | undefined>(() =>
  kabuk.sunumKipi
    ? {
        '--text-nano': '0.8rem',
        '--text-mikro': '0.9rem',
        '--text-kucuk': '1.05rem',
        '--text-govde': '1.2rem',
        '--text-orta': '1.35rem',
        '--text-h3': '1.6rem',
        '--text-h2': '2rem',
        '--text-h1': '2.6rem',
        // Projeksiyonda pastel tonlar soluyor: murekkep ve kenar koyulasiyor.
        '--color-murekkep': '#0d1119',
        '--color-murekkep-2': '#2f3648',
        '--color-murekkep-3': '#5a6478',
        '--color-kenar': '#b9c1d4',
      }
    : undefined,
)

function kisayol(olay: KeyboardEvent): void {
  // F9: sunum kipi. Projeksiyonda fare aramadan girilip cikilabilsin.
  if (olay.key === 'F9') {
    olay.preventDefault()
    kabuk.sunumuDegistir()
    return
  }
  if ((olay.ctrlKey || olay.metaKey) && olay.key.toLowerCase() === 'k') {
    olay.preventDefault()
    kabuk.paletAcik = !kabuk.paletAcik
  }
  if ((olay.ctrlKey || olay.metaKey) && olay.key === '\\') {
    olay.preventDefault()
    kabuk.listeAcik = !kabuk.listeAcik
  }
}

onMounted(() => {
  window.addEventListener('keydown', kisayol)
  kabuk.agaciYukle()
})
onUnmounted(() => window.removeEventListener('keydown', kisayol))
</script>

<template>
  <div
    class="flex h-screen w-screen overflow-hidden bg-zemin font-govde text-murekkep antialiased print:block print:h-auto print:w-auto print:overflow-visible"
    :style="sunumTokenlari"
    :data-sunum="kabuk.sunumKipi ? '1' : undefined"
  >
    <a
      href="#calisma-alani"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-kutu focus:bg-marka focus:px-3 focus:py-2 focus:text-kucuk focus:text-white"
    >
      İçeriğe geç
    </a>
    <IkonRay v-if="!kabuk.sunumKipi" class="print:hidden" />
    <BaglamListesi v-if="kabuk.listeAcik" class="print:hidden" />

    <main id="calisma-alani" class="flex min-w-0 flex-1 flex-col overflow-hidden print:block print:overflow-visible">
      <UstCubuk class="print:hidden" />
      <div class="min-h-0 flex-1 overflow-hidden print:block print:overflow-visible">
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </div>
    </main>

    <KomutPaleti />

    <p
      v-if="kabuk.hata"
      class="fixed right-4 bottom-4 z-40 max-w-sm rounded-kutu border border-gul bg-gul px-4 py-3 text-kucuk text-gul-koyu shadow-panel"
    >
      Sunucuya ulaşılamadı. <span class="font-mono text-kucuk">npm run api</span> çalışıyor mu?
    </p>
  </div>
</template>
