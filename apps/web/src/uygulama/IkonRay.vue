<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import Ikon from '../ortak/bilesenler/Ikon.vue'
import { kabukDeposu } from './kabukDeposu'
import { api } from '../ortak/api'

/**
 * Ikon rayi.
 *
 * Asla degismeyen tek gezinme katmani. Bes ust duzey giris; fazlasi
 * kaybolmaya yol acar. Genislik sabit 64px.
 */
const GIRISLER = [
  { ad: 'siniflar', etiket: 'Sınıflar', ikon: 'siniflar', rota: { name: 'siniflar' } },
  {
    ad: 'geometri',
    etiket: 'Geometri Atölyesi',
    ikon: 'geometri',
    rota: { name: 'siniflar', query: { alan: 'geometri' } },
  },
  { ad: 'olasilik', etiket: 'Olasılık Laboratuvarı', ikon: 'olasilik', rota: { name: 'olasilik' } },
  { ad: 'tuval', etiket: 'Serbest Tuval', ikon: 'tuval', rota: { name: 'tuval' } },
  { ad: 'kutuphane', etiket: 'Kütüphane', ikon: 'kutuphane', rota: { name: 'kutuphane' } },
] as const

const rota = useRoute()
const kabuk = kabukDeposu()

function etkinMi(ad: string): boolean {
  if (ad === 'geometri') return rota.query.alan === 'geometri'
  if (ad === 'siniflar') return ['siniflar', 'konular', 'konu'].includes(String(rota.name)) && rota.query.alan !== 'geometri'
  return rota.name === ad
}
</script>

<template>
  <nav
    class="flex w-[76px] shrink-0 flex-col items-center gap-1.5 border-r border-kenar bg-yuzey py-3"
    aria-label="Ana gezinme"
  >
    <RouterLink
      :to="{ name: 'siniflar' }"
      class="mb-3 flex h-12 w-12 items-center justify-center rounded-kutu bg-marka font-bold text-white shadow-panel transition hover:bg-marka-koyu focus-visible:ring-2 focus-visible:ring-marka focus-visible:ring-offset-2 focus-visible:outline-none"
      title="Matgebra"
    >
      <span class="font-baslik text-orta font-bold">M</span>
    </RouterLink>

    <RouterLink
      v-for="g in GIRISLER"
      :key="g.ad"
      :to="g.rota"
      :title="g.etiket"
      :aria-label="g.etiket"
      class="group relative flex h-12 w-12 items-center justify-center rounded-kutu transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
      :class="
        etkinMi(g.ad)
          ? 'bg-marka-soft text-marka-koyu'
          : 'bg-yuzey-2 text-murekkep-3 hover:bg-yuzey-3 hover:text-murekkep-2'
      "
    >
      <Ikon :ad="g.ikon" :boyut="22" />
      <span
        v-if="etkinMi(g.ad)"
        class="absolute top-1/2 -left-3 h-6 w-1 -translate-y-1/2 rounded-r bg-marka"
      />
    </RouterLink>

    <div class="flex-1" />

    <!--
      Yonetim ust duzey giris DEGIL: ray bes girisle sinirli, altincisi
      "kaybolmama" kuralini bozardi. Arama ve panel gibi bir arac olarak
      altta duruyor ve yalnizca sunuculu kipte gorunuyor - statik yayinda
      yazma zaten kapali.
    -->
    <RouterLink
      v-if="api.kaydedebilir"
      :to="{ name: 'yonetim' }"
      title="Yönetim"
      aria-label="Yönetim paneli"
      class="flex h-12 w-12 items-center justify-center rounded-kutu transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
      :class="
        rota.name === 'yonetim'
          ? 'bg-marka-soft text-marka-koyu'
          : 'bg-yuzey-2 text-murekkep-3 hover:bg-yuzey-3 hover:text-murekkep-2'
      "
    >
      <Ikon ad="yonetim" :boyut="20" />
    </RouterLink>
    <button
      type="button"
      title="Ara (Ctrl+K)"
      aria-label="Ara"
      class="flex h-12 w-12 items-center justify-center rounded-kutu bg-yuzey-2 text-murekkep-3 transition hover:bg-yuzey-3 hover:text-murekkep-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
      @click="kabuk.paletAcik = true"
    >
      <Ikon ad="ara" :boyut="20" />
    </button>
    <button
      type="button"
      :title="kabuk.listeAcik ? 'Listeyi gizle' : 'Listeyi göster'"
      :aria-label="kabuk.listeAcik ? 'Listeyi gizle' : 'Listeyi göster'"
      class="flex h-12 w-12 items-center justify-center rounded-kutu bg-yuzey-2 text-murekkep-3 transition hover:bg-yuzey-3 hover:text-murekkep-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
      @click="kabuk.listeAcik = !kabuk.listeAcik"
    >
      <Ikon ad="panel" :boyut="20" />
    </button>
  </nav>
</template>
