<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api, type KonuOzeti } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'

/**
 * Olasilik laboratuvari.
 * Deney bilesenleri Faz 7'de gelir; simdilik alanin konu haritasini gosterir
 * ki hangi kazanimlarin hangi sinifta oldugu gorunur olsun.
 */
const kabuk = kabukDeposu()
const konular = ref<KonuOzeti[]>([])

onMounted(async () => {
  kabuk.kirintiYaz([{ ad: 'Olasılık Laboratuvarı' }])
  const hepsi = await Promise.all(
    [4, 5, 6, 7, 8, 9, 10].map((s) => api.konular(s, 'olasilik')),
  )
  konular.value = hepsi.flat()
})
</script>

<template>
  <div class="h-full overflow-y-auto px-8 py-7">
    <header class="mb-6">
      <p class="mb-1.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
        Alan haritası
      </p>
      <h1 class="font-baslik text-h2 font-bold text-balance">Olasılık Laboratuvarı</h1>
      <p class="mt-2 max-w-2xl text-govde text-murekkep-2">
        Olasılık müfredatta 4. sınıfta başlar, 10. sınıfta biter. 11 ve 12. sınıfta ayrı bir
        olasılık teması yoktur; orada konu istatistiksel araştırma sürecinin içindedir.
        Zar, para, çark ve torba deneyleri Faz 7'de bu ekrana gelir.
      </p>
    </header>

    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <RouterLink
        v-for="konu in konular"
        :key="konu.id"
        :to="{ name: 'konu', params: { slug: konu.slug } }"
        class="rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-gul-koyu/30"
      >
        <span class="mb-2 inline-block rounded bg-gul px-1.5 py-0.5 font-mono text-mikro text-gul-koyu">
          {{ konu.seviye }}. sınıf
        </span>
        <h2 class="font-baslik text-orta font-semibold text-balance">{{ konu.ad }}</h2>
        <p class="mt-1 text-kucuk text-murekkep-2">{{ konu.ozet }}</p>
      </RouterLink>
    </div>
  </div>
</template>
