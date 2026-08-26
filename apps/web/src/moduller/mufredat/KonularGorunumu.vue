<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { api, type KonuOzeti } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

const { seviye } = defineProps<{ seviye: string }>()

const kabuk = kabukDeposu()
const konular = ref<KonuOzeti[]>([])
const yukleniyor = ref(true)

const sv = computed(() => Number(seviye))
const sinifAdi = computed(() => (sv.value === 0 ? 'Hazırlık Sınıfı' : `${sv.value}. Sınıf`))

const gruplar = computed(() => {
  const suz = kabuk.alanSuzgeci
  const liste = suz ? konular.value.filter((k) => k.alan === suz) : konular.value
  const harita = new Map<string, { ad: string; alan: string; konular: KonuOzeti[] }>()
  for (const k of liste) {
    const g = harita.get(k.alan) ?? { ad: k.alanAd, alan: k.alan, konular: [] }
    g.konular.push(k)
    harita.set(k.alan, g)
  }
  return [...harita.values()]
})

const ALAN_STILI: Record<string, { rozet: string; nokta: string }> = {
  geometri: { rozet: 'bg-gok text-gok-koyu', nokta: 'bg-gok-koyu' },
  olasilik: { rozet: 'bg-gul text-gul-koyu', nokta: 'bg-gul-koyu' },
}

watch(
  sv,
  async (deger) => {
    yukleniyor.value = true
    kabuk.kirintiYaz([{ ad: 'Sınıflar', rota: { name: 'siniflar' } }, { ad: sinifAdi.value }])
    try {
      konular.value = await api.konular(deger)
    } finally {
      yukleniyor.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="px-8 py-7">
      <header class="mb-7">
        <p class="mb-1.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
          Müfredat
        </p>
        <h1 class="font-baslik text-h2 font-bold text-balance">{{ sinifAdi }}</h1>
      </header>

      <p v-if="yukleniyor" class="text-govde text-murekkep-3">Yükleniyor…</p>
      <p v-else-if="!gruplar.length" class="text-govde text-murekkep-3">
        Bu sınıf için bu alanda konu tanımlı değil.
      </p>

      <section v-for="grup in gruplar" :key="grup.alan" class="mb-9">
        <div class="mb-3 flex items-center gap-3">
          <h2 class="font-baslik text-h3 font-semibold">{{ grup.ad }}</h2>
          <span
            class="rounded-full px-2 py-0.5 font-mono text-mikro"
            :class="ALAN_STILI[grup.alan]?.rozet"
          >
            {{ grup.konular.length }} konu
          </span>
          <span class="h-px flex-1 bg-kenar" />
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <RouterLink
            v-for="konu in grup.konular"
            :key="konu.id"
            :to="{ name: 'konu', params: { slug: konu.slug } }"
            class="group flex flex-col rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-marka/40 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          >
            <div class="mb-2 flex items-start gap-2">
              <span
                class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                :class="ALAN_STILI[konu.alan]?.nokta"
              />
              <h3 class="flex-1 font-baslik text-orta font-semibold text-balance text-murekkep">
                {{ konu.ad }}
              </h3>
              <Ikon
                ad="ileri"
                :boyut="15"
                class="mt-0.5 shrink-0 text-murekkep-3 transition group-hover:translate-x-0.5 group-hover:text-marka"
              />
            </div>
            <p class="mb-3 flex-1 text-kucuk text-murekkep-2">
              {{ konu.ozet }}
            </p>
            <div class="flex items-center gap-2 border-t border-kenar pt-2.5">
              <span class="font-mono text-mikro text-murekkep-3">
                {{ konu.kazanimSayisi }} kazanım
              </span>
              <span
                class="rounded px-1.5 py-0.5 font-mono text-mikro"
                :class="konu.sahneSayisi ? 'bg-nane text-nane-koyu' : 'bg-yuzey-2 text-murekkep-3'"
              >
                {{ konu.sahneSayisi }} sahne
              </span>
              <span class="flex-1" />
              <span class="flex gap-0.5" :title="`Zorluk ${konu.zorluk}/5`">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="h-1 w-1.5 rounded-full"
                  :class="n <= konu.zorluk ? 'bg-marka' : 'bg-yuzey-3'"
                />
              </span>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
