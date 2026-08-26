<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
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

function kisayol(olay: KeyboardEvent): void {
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
    class="flex h-screen w-screen overflow-hidden bg-zemin font-govde text-murekkep antialiased"
  >
    <IkonRay />
    <BaglamListesi v-if="kabuk.listeAcik" />

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <UstCubuk />
      <div class="min-h-0 flex-1 overflow-hidden">
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
