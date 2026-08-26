<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api, type KonuOzeti } from '../ortak/api'
import { kabukDeposu } from './kabukDeposu'
import Ikon from '../ortak/bilesenler/Ikon.vue'

/**
 * Baglam listesi.
 *
 * Nerede oldugunuza gore degisen ikinci sutun: sinif agaci ustte,
 * secili sinifin konulari altta. Yeni sayfa acmadan derinlige inilir.
 */
const rota = useRoute()
const kabuk = kabukDeposu()

const konular = ref<KonuOzeti[]>([])
const yukleniyor = ref(false)

const seviye = computed<number | null>(() => {
  if (rota.name === 'konular') return Number(rota.params.seviye)
  if (rota.name === 'konu') return acikSeviye.value
  return null
})

/** Konu sayfasindayken hangi sinifin listelenecegini hatirlar. */
const acikSeviye = ref<number | null>(null)

/**
 * Alan suzgeci tek yerde tutulur: kabuk deposunda.
 * Rota sorgusunda alan geldiyse (ikon rayindaki Geometri girisi gibi)
 * depoya yansitilir, sonra hep depodan okunur.
 */
const alanSuzgeci = computed(() => kabuk.alanSuzgeci)

watch(
  () => rota.query.alan,
  (deger) => {
    if (typeof deger === 'string') kabuk.alanSuzgeci = deger
  },
  { immediate: true },
)

async function konulariYukle(sv: number | null): Promise<void> {
  if (sv === null) {
    konular.value = []
    return
  }
  yukleniyor.value = true
  try {
    konular.value = await api.konular(sv)
  } finally {
    yukleniyor.value = false
  }
}

const gorunenKonular = computed(() =>
  alanSuzgeci.value ? konular.value.filter((k) => k.alan === alanSuzgeci.value) : konular.value,
)

const ALAN_RENGI: Record<string, string> = {
  geometri: 'bg-gok text-gok-koyu',
  olasilik: 'bg-gul text-gul-koyu',
}

onMounted(() => {
  kabuk.agaciYukle()
  if (rota.name === 'konular') acikSeviye.value = Number(rota.params.seviye)
})

watch(
  () => rota.fullPath,
  async () => {
    if (rota.name === 'konular') acikSeviye.value = Number(rota.params.seviye)
    if (rota.name === 'konu' && acikSeviye.value === null) {
      const ayrinti = await api.konu(String(rota.params.slug))
      acikSeviye.value = ayrinti.seviye
    }
  },
  { immediate: true },
)

watch(seviye, (sv) => konulariYukle(sv), { immediate: true })
</script>

<template>
  <aside class="flex w-72 shrink-0 flex-col border-r border-kenar bg-yuzey">
    <!-- sinif agaci -->
    <div class="shrink-0 overflow-y-auto border-b border-kenar px-3 py-3" style="max-height: 42%">
      <p class="px-2 pb-2 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
        Sınıflar
      </p>
      <div v-for="kademe in kabuk.agac" :key="kademe.id" class="mb-2">
        <p class="px-2 pb-1 text-mikro font-semibold tracking-[0.04em] text-murekkep-3 uppercase">
          {{ kademe.ad }}
        </p>
        <div class="grid grid-cols-4 gap-1">
          <RouterLink
            v-for="sinif in kademe.siniflar"
            :key="sinif.id"
            :to="{ name: 'konular', params: { seviye: sinif.seviye }, query: rota.query }"
            :title="`${sinif.ad} — ${Object.values(sinif.konuSayisi).reduce((a, b) => a + b, 0)} konu`"
            class="flex h-9 items-center justify-center rounded-md font-baslik text-govde font-semibold tabular-nums transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            :class="
              acikSeviye === sinif.seviye
                ? 'bg-marka text-white'
                : 'bg-yuzey-2 text-murekkep-2 hover:bg-yuzey-3'
            "
          >
            {{ sinif.seviye === 0 ? 'Hz' : sinif.seviye }}
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- konu listesi -->
    <div class="min-h-0 flex-1 overflow-y-auto px-3 py-3">
      <p class="flex items-center gap-2 px-2 pb-2 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
        Konular
        <span v-if="gorunenKonular.length" class="font-govde tabular-nums tracking-normal normal-case">
          {{ gorunenKonular.length }}
        </span>
      </p>

      <p v-if="seviye === null" class="px-2 text-kucuk text-murekkep-3">
        Yukarıdan bir sınıf seçin.
      </p>
      <p v-else-if="yukleniyor" class="px-2 text-kucuk text-murekkep-3">Yükleniyor…</p>
      <p v-else-if="!gorunenKonular.length" class="px-2 text-kucuk text-murekkep-3">
        Bu seçimde konu yok.
      </p>

      <RouterLink
        v-for="konu in gorunenKonular"
        :key="konu.id"
        :to="{ name: 'konu', params: { slug: konu.slug }, query: rota.query }"
        class="group mb-0.5 block rounded-md px-2 py-2 transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        :class="
          rota.params.slug === konu.slug ? 'bg-marka-soft' : 'hover:bg-yuzey-2'
        "
      >
        <span class="flex items-start gap-2">
          <span
            class="mt-1 h-2 w-2 shrink-0 rounded-full"
            :class="konu.alan === 'geometri' ? 'bg-gok-koyu' : 'bg-gul-koyu'"
          />
          <span class="min-w-0 flex-1">
            <span
              class="block truncate text-govde font-medium"
              :class="rota.params.slug === konu.slug ? 'text-marka-koyu' : 'text-murekkep'"
            >
              {{ konu.ad }}
            </span>
            <span class="mt-0.5 flex items-center gap-2 font-mono text-mikro text-murekkep-3">
              <span>{{ konu.kazanimSayisi }} kazanım</span>
              <span v-if="konu.sahneSayisi" class="flex items-center gap-1 text-nane-koyu">
                <Ikon ad="tuval" :boyut="11" />{{ konu.sahneSayisi }}
              </span>
            </span>
          </span>
        </span>
      </RouterLink>
    </div>

    <!-- alan suzgeci -->
    <div class="shrink-0 border-t border-kenar p-2">
      <div class="flex gap-1">
        <button
          v-for="s in [
            { deger: null, etiket: 'Tümü' },
            { deger: 'geometri', etiket: 'Geometri' },
            { deger: 'olasilik', etiket: 'Olasılık' },
          ]"
          :key="String(s.deger)"
          type="button"
          class="flex-1 rounded-md px-2 py-1.5 text-kucuk font-medium transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          :class="
            alanSuzgeci === s.deger
              ? (s.deger ? ALAN_RENGI[s.deger] : 'bg-yuzey-3 text-murekkep')
              : 'text-murekkep-3 hover:bg-yuzey-2'
          "
          @click="kabuk.alanSuzgeci = s.deger"
        >
          {{ s.etiket }}
        </button>
      </div>
    </div>
  </aside>
</template>
