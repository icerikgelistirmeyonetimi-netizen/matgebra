<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'

/**
 * Kutuphane.
 *
 * Uc sekme: kavram sozlugu, formul kartlari ve icerik uretiminin kapsama
 * raporu. Kapsama raporu projenin ilerleme gostergesidir - hangi konunun
 * sahnesi eksik buradan okunur.
 */
type Sekme = 'kavram' | 'formul' | 'kapsama'

const kabuk = kabukDeposu()
const sekme = ref<Sekme>('kavram')

const kavramlar = ref<Awaited<ReturnType<typeof api.kavramlar>>>([])
const formuller = ref<Awaited<ReturnType<typeof api.formuller>>>([])
const kapsama = ref<
  Array<{ seviye: number; alan: string; konu: number; sahne: number; ornek: number }>
>([])
const ilerleme = ref<Awaited<ReturnType<typeof api.ilerleme>>>([])

const SEKMELER: Array<{ deger: Sekme; etiket: string }> = [
  { deger: 'kavram', etiket: 'Kavramlar' },
  { deger: 'formul', etiket: 'Formüller' },
  { deger: 'kapsama', etiket: 'Kapsama' },
]

const kavramAlanlari = computed(() => {
  const harita = new Map<string, { alan: string; ad: string; liste: typeof kavramlar.value }>()
  for (const k of kavramlar.value) {
    const g = harita.get(k.alan) ?? { alan: k.alan, ad: k.alanAd, liste: [] }
    g.liste.push(k)
    harita.set(k.alan, g)
  }
  return [...harita.values()]
})

const toplamPuan = computed(() => ilerleme.value.reduce((t, i) => t + i.puan, 0))

onMounted(async () => {
  kabuk.kirintiYaz([{ ad: 'Kütüphane' }])
  const [kv, fm, kp] = await Promise.all([api.kavramlar(), api.formuller(), api.kapsama()])
  kavramlar.value = kv
  formuller.value = fm
  kapsama.value = kp.siniflar
  ilerleme.value = await api.ilerleme().catch(() => [])
})
</script>

<template>
  <div class="h-full overflow-y-auto px-8 py-7">
    <header class="mb-5">
      <p class="mb-1.5 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
        Başvuru
      </p>
      <h1 class="font-baslik text-h2 font-bold text-balance">Kütüphane</h1>
      <p class="mt-2 max-w-2xl text-govde text-murekkep-2">
        Kavram sözlüğü, formül kartları ve içerik üretiminin nerede olduğunu gösteren kapsama
        raporu.
        <span v-if="toplamPuan" class="font-medium text-murekkep">
          Bu cihazda toplanan puan: {{ toplamPuan }}.
        </span>
      </p>
    </header>

    <div class="mb-6 flex w-fit rounded-md bg-yuzey-2 p-0.5">
      <button
        v-for="s in SEKMELER"
        :key="s.deger"
        type="button"
        class="rounded px-3.5 py-1.5 text-kucuk font-medium transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        :class="
          sekme === s.deger
            ? 'bg-yuzey text-marka-koyu shadow-panel'
            : 'text-murekkep-3 hover:text-murekkep-2'
        "
        @click="sekme = s.deger"
      >
        {{ s.etiket }}
      </button>
    </div>

    <!-- kavramlar -->
    <section v-if="sekme === 'kavram'">
      <div v-for="grup in kavramAlanlari" :key="grup.alan" class="mb-8">
        <h2 class="mb-3 font-baslik text-h3 font-semibold">{{ grup.ad }}</h2>
        <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <article
            v-for="k in grup.liste"
            :key="k.slug"
            class="rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel"
          >
            <p class="mb-1.5 flex items-baseline gap-2">
              <span class="font-baslik text-orta font-semibold">{{ k.ad }}</span>
              <span v-if="k.latex" class="font-mono text-mikro text-marka-koyu">{{ k.latex }}</span>
            </p>
            <p class="mb-2.5 text-kucuk text-murekkep-2">{{ k.tanim }}</p>
            <div class="flex flex-wrap gap-1.5">
              <RouterLink
                v-for="konu in k.konular"
                :key="konu.slug"
                :to="{ name: 'konu', params: { slug: konu.slug } }"
                class="rounded px-1.5 py-0.5 text-mikro transition"
                :class="
                  konu.rol === 'tanitilan'
                    ? 'bg-nane text-nane-koyu'
                    : 'bg-yuzey-2 text-murekkep-3 hover:bg-yuzey-3'
                "
                :title="konu.rol === 'tanitilan' ? 'Burada tanıtılıyor' : 'Burada kullanılıyor'"
              >
                {{ konu.seviye }}. {{ konu.ad }}
              </RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- formuller -->
    <section v-else-if="sekme === 'formul'">
      <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <article
          v-for="f in formuller"
          :key="f.ad"
          class="rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel"
        >
          <p class="mb-2 flex items-center gap-2">
            <span
              class="rounded px-1.5 py-0.5 text-mikro font-semibold"
              :class="f.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'"
            >
              {{ f.seviye }}. sınıf
            </span>
            <span class="font-baslik text-orta font-semibold">{{ f.ad }}</span>
          </p>
          <p class="mb-2 rounded bg-yuzey-2 px-3 py-2 font-mono text-kucuk text-marka-koyu">
            {{ f.latex }}
          </p>
          <p class="mb-2 text-mikro text-murekkep-2">{{ f.aciklama }}</p>
          <RouterLink
            :to="{ name: 'konu', params: { slug: f.konuSlug } }"
            class="text-mikro text-murekkep-3 hover:text-marka-koyu"
          >
            {{ f.konuAd }}
          </RouterLink>
        </article>
      </div>
    </section>

    <!-- kapsama -->
    <section v-else>
      <div class="max-w-3xl overflow-hidden rounded-kutu border border-kenar bg-yuzey shadow-panel">
        <table class="w-full text-kucuk">
          <thead>
            <tr class="border-b border-kenar bg-yuzey-2 text-left">
              <th class="px-4 py-2.5 text-mikro font-semibold text-murekkep-3 uppercase">Sınıf</th>
              <th class="px-4 py-2.5 text-mikro font-semibold text-murekkep-3 uppercase">Alan</th>
              <th class="px-4 py-2.5 text-right text-mikro font-semibold text-murekkep-3 uppercase">
                Konu
              </th>
              <th class="px-4 py-2.5 text-right text-mikro font-semibold text-murekkep-3 uppercase">
                Sahne
              </th>
              <th class="px-4 py-2.5 text-right text-mikro font-semibold text-murekkep-3 uppercase">
                Örnek
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in kapsama" :key="i" class="border-b border-kenar last:border-0">
              <td class="px-4 py-2 font-medium">
                {{ s.seviye === 0 ? 'Hazırlık' : `${s.seviye}. sınıf` }}
              </td>
              <td class="px-4 py-2">
                <span
                  class="rounded px-1.5 py-0.5 text-mikro"
                  :class="s.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'"
                >
                  {{ s.alan }}
                </span>
              </td>
              <td class="px-4 py-2 text-right tabular-nums">{{ s.konu }}</td>
              <td
                class="px-4 py-2 text-right tabular-nums"
                :class="s.sahne ? 'text-nane-koyu' : 'text-murekkep-3'"
              >
                {{ s.sahne }}
              </td>
              <td
                class="px-4 py-2 text-right tabular-nums"
                :class="s.ornek ? 'text-nane-koyu' : 'text-murekkep-3'"
              >
                {{ s.ornek }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
