<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Ikon from '../ortak/bilesenler/Ikon.vue'
import { kabukDeposu } from './kabukDeposu'

/**
 * Ust cubuk: kirinti yolu + arama.
 * Her zaman gorunur ve her parcasi tiklanabilir - "kayboldum" hissinin
 * ilk panzehiri budur.
 */
const kabuk = kabukDeposu()
</script>

<template>
  <header
    class="flex h-12 shrink-0 items-center gap-3 border-b border-kenar bg-yuzey px-4"
  >
    <nav class="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden" aria-label="Kırıntı yolu">
      <template v-for="(parca, i) in kabuk.kirinti" :key="i">
        <Ikon v-if="i > 0" ad="ileri" :boyut="13" class="text-murekkep-3" />
        <RouterLink
          v-if="parca.rota && i < kabuk.kirinti.length - 1"
          :to="parca.rota"
          class="shrink-0 rounded px-1 text-kucuk text-murekkep-2 transition hover:text-marka-koyu focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        >
          {{ parca.ad }}
        </RouterLink>
        <span
          v-else
          class="truncate px-1 text-kucuk font-semibold text-murekkep"
          :title="parca.ad"
        >
          {{ parca.ad }}
        </span>
      </template>
    </nav>

    <button
      type="button"
      class="flex items-center gap-2 rounded-kutu border border-kenar bg-yuzey-2 py-1.5 pr-2 pl-3 text-kucuk text-murekkep-3 transition hover:border-kenar-koyu hover:text-murekkep-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
      @click="kabuk.paletAcik = true"
    >
      <Ikon ad="ara" :boyut="15" />
      <span class="hidden sm:inline">Konu, kazanım, sahne ara</span>
      <kbd class="rounded border border-kenar bg-yuzey px-1.5 py-0.5 font-mono text-mikro">
        Ctrl K
      </kbd>
    </button>
  </header>
</template>
