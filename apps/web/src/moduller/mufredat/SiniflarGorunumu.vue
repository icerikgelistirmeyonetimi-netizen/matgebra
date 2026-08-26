<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'

/**
 * Giris ekrani: butun kademeler tek bakista.
 * Tam genislik kullanilir; icerik ortada dar bir kutuya sikismaz.
 */
const kabuk = kabukDeposu()
const kapsama = ref<Record<string, { konu: number; sahne: number; ornek: number }>>({})

const KADEME_RENGI: Record<string, string> = {
  ilkokul: 'bg-nane text-nane-koyu',
  ortaokul: 'bg-gok text-gok-koyu',
  lise: 'bg-lavanta text-lavanta-koyu',
}

const toplam = computed(() => {
  let konu = 0
  let sahne = 0
  for (const d of Object.values(kapsama.value)) {
    konu += d.konu
    sahne += d.sahne
  }
  return { konu, sahne }
})

onMounted(async () => {
  kabuk.kirintiYaz([{ ad: 'Sınıflar' }])
  await kabuk.agaciYukle()
  const rapor = await api.kapsama()
  const birikim: Record<string, { konu: number; sahne: number; ornek: number }> = {}
  for (const s of rapor.siniflar) {
    const anahtar = String(s.seviye)
    const mevcut = birikim[anahtar] ?? { konu: 0, sahne: 0, ornek: 0 }
    birikim[anahtar] = {
      konu: mevcut.konu + s.konu,
      sahne: mevcut.sahne + s.sahne,
      ornek: mevcut.ornek + s.ornek,
    }
  }
  kapsama.value = birikim
})
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="px-8 py-7">
      <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="mb-1.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
            Türkiye Yüzyılı Maarif Modeli
          </p>
          <h1 class="font-baslik text-h1 font-bold text-balance text-murekkep">
            Geometri ve Olasılık Atölyesi
          </h1>
          <p class="mt-2 max-w-2xl text-govde text-murekkep-2">
            Bir sınıf seçin, konuya inin, koordinat düzleminde çizin. Her konunun kazanımları
            müfredattan gelir; gerçek hayat örnekleri ve sahneler adım adım eklenir.
          </p>
        </div>
        <div class="flex gap-2">
          <div class="rounded-kutu border border-kenar bg-yuzey px-4 py-2.5 shadow-panel">
            <p class="text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Konu</p>
            <p class="font-baslik text-h3 font-bold tabular-nums text-murekkep">{{ toplam.konu }}</p>
          </div>
          <div class="rounded-kutu border border-kenar bg-yuzey px-4 py-2.5 shadow-panel">
            <p class="text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Sahne</p>
            <p class="font-baslik text-h3 font-bold tabular-nums text-murekkep">{{ toplam.sahne }}</p>
          </div>
        </div>
      </header>

      <section v-for="kademe in kabuk.agac" :key="kademe.id" class="mb-9">
        <div class="mb-3 flex items-center gap-3">
          <h2 class="font-baslik text-h3 font-semibold text-murekkep">{{ kademe.ad }}</h2>
          <span
            class="rounded-full px-2.5 py-0.5 text-mikro font-semibold"
            :class="KADEME_RENGI[kademe.slug]"
          >
            {{ kademe.siniflar.length }} sınıf
          </span>
          <span class="h-px flex-1 bg-kenar" />
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <RouterLink
            v-for="sinif in kademe.siniflar"
            :key="sinif.id"
            :to="{ name: 'konular', params: { seviye: sinif.seviye } }"
            class="group rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-marka/40 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          >
            <div class="mb-3 flex items-start justify-between">
              <span
                class="flex h-11 w-11 items-center justify-center rounded-kutu font-baslik text-orta font-bold"
                :class="KADEME_RENGI[kademe.slug]"
              >
                {{ sinif.seviye === 0 ? 'Hz' : sinif.seviye }}
              </span>
            </div>
            <p class="font-baslik text-orta font-semibold text-murekkep">{{ sinif.ad }}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <span
                v-if="sinif.konuSayisi.geometri"
                class="rounded-md px-2 py-0.5 text-mikro font-medium bg-gok text-gok-koyu"
              >
                {{ sinif.konuSayisi.geometri }} geometri
              </span>
              <span
                v-if="sinif.konuSayisi.olasilik"
                class="rounded-md px-2 py-0.5 text-mikro font-medium bg-gul text-gul-koyu"
              >
                {{ sinif.konuSayisi.olasilik }} olasılık
              </span>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
