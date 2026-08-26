<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { api, type KonuAyrinti } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Konu ayrinti ekrani.
 *
 * "Gercek hayat ornegi" dugmesi burada yasar: basildiginda konunun
 * gercek_hayat turundeki sahnesi acilir. Sahne henuz uretilmediyse dugme
 * ne oldugunu durustce soyler, sessizce kaybolmaz.
 */
const { slug } = defineProps<{ slug: string }>()

const kabuk = kabukDeposu()
const yonlendirici = useRouter()
const konu = ref<KonuAyrinti | null>(null)
const yukleniyor = ref(true)
const acikKazanim = ref<number | null>(null)

const gercekHayatSahnesi = computed(() =>
  konu.value?.sahneler.find((s) => s.tur === 'gercek_hayat'),
)
const digerSahneler = computed(() =>
  konu.value?.sahneler.filter((s) => s.tur !== 'gercek_hayat') ?? [],
)

const SAHNE_ETIKETI: Record<string, string> = {
  kesif: 'Keşif',
  gercek_hayat: 'Gerçek hayat',
  insa: 'İnşa görevi',
  olasilik: 'Olasılık deneyi',
  bos_tuval: 'Serbest tuval',
}

function gercekHayataGit(): void {
  const sahne = gercekHayatSahnesi.value
  if (sahne) yonlendirici.push({ name: 'sahne', params: { slug: sahne.slug } })
}

function tuvaleGit(): void {
  yonlendirici.push({ name: 'tuval', query: { konu: slug } })
}

watch(
  () => slug,
  async (deger) => {
    yukleniyor.value = true
    acikKazanim.value = null
    try {
      konu.value = await api.konu(deger)
      kabuk.kirintiYaz([
        { ad: 'Sınıflar', rota: { name: 'siniflar' } },
        { ad: konu.value.sinifAd, rota: { name: 'konular', params: { seviye: konu.value.seviye } } },
        { ad: konu.value.alanAd },
        { ad: konu.value.ad },
      ])
    } finally {
      yukleniyor.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full overflow-y-auto">
    <p v-if="yukleniyor" class="px-8 py-7 text-govde text-murekkep-3">Yükleniyor…</p>

    <div v-else-if="konu" class="grid grid-cols-1 gap-6 px-8 py-7 2xl:grid-cols-[minmax(0,1fr)_380px]">
      <!-- ana sutun -->
      <div class="min-w-0">
        <header class="mb-6">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span
              class="rounded px-2 py-0.5 font-mono text-mikro tracking-wide"
              :class="konu.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'"
            >
              {{ konu.alanAd }}
            </span>
            <span class="font-mono text-mikro text-murekkep-3">{{ konu.sinifAd }}</span>
            <span class="flex gap-0.5" :title="`Zorluk ${konu.zorluk}/5`">
              <span
                v-for="n in 5"
                :key="n"
                class="h-1.5 w-1.5 rounded-full"
                :class="n <= konu.zorluk ? 'bg-marka' : 'bg-yuzey-3'"
              />
            </span>
          </div>
          <h1 class="font-baslik text-h2 font-bold text-balance text-murekkep">
            {{ konu.ad }}
          </h1>
          <p class="mt-2 max-w-3xl text-govde text-murekkep-2">
            {{ konu.ozet }}
          </p>
        </header>

        <!-- eylemler -->
        <div class="mb-7 flex flex-wrap gap-2.5">
          <button
            type="button"
            class="flex items-center gap-2.5 rounded-kutu border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            :class="
              gercekHayatSahnesi
                ? 'border-nane-koyu/25 bg-nane text-nane-koyu hover:brightness-97'
                : 'cursor-not-allowed border-kenar bg-yuzey-2 text-murekkep-3'
            "
            :disabled="!gercekHayatSahnesi"
            @click="gercekHayataGit"
          >
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-kutu bg-yuzey/70">
              <Ikon ad="geometri" :boyut="21" />
            </span>
            <span>
              <span class="block text-govde font-semibold">Gerçek hayat örneği</span>
              <span class="block text-kucuk opacity-80">
                {{
                  gercekHayatSahnesi
                    ? gercekHayatSahnesi.baslik
                    : 'Bu konu için henüz sahne üretilmedi'
                }}
              </span>
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2.5 rounded-kutu border border-kenar bg-yuzey px-4 py-3 text-left shadow-panel transition hover:border-marka/40 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            @click="tuvaleGit"
          >
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-kutu bg-marka-soft text-marka-koyu">
              <Ikon ad="tuval" :boyut="21" />
            </span>
            <span>
              <span class="block text-govde font-semibold text-murekkep">Boş koordinat düzlemi</span>
              <span class="block text-kucuk text-murekkep-3">Bu konu için serbest çizim</span>
            </span>
          </button>
        </div>

        <!-- sahneler -->
        <section v-if="digerSahneler.length" class="mb-8">
          <h2 class="mb-3 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
            Sahneler
          </h2>
          <div class="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            <RouterLink
              v-for="sahne in digerSahneler"
              :key="sahne.id"
              :to="{ name: 'sahne', params: { slug: sahne.slug } }"
              class="rounded-kutu border border-kenar bg-yuzey p-3.5 shadow-panel transition hover:border-marka/40"
            >
              <span class="mb-1 block font-mono text-mikro text-murekkep-3">
                {{ SAHNE_ETIKETI[sahne.tur] ?? sahne.tur }}
              </span>
              <span class="block text-govde font-semibold">{{ sahne.baslik }}</span>
              <span class="mt-1 block text-kucuk text-murekkep-2">{{ sahne.ozet }}</span>
            </RouterLink>
          </div>
        </section>

        <!-- kazanimlar -->
        <section>
          <h2 class="mb-3 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
            Müfredat kazanımları
          </h2>
          <div class="overflow-hidden rounded-kutu border border-kenar bg-yuzey shadow-panel">
            <article
              v-for="(kazanim, i) in konu.kazanimlar"
              :key="kazanim.id"
              :class="i > 0 ? 'border-t border-kenar' : ''"
            >
              <button
                type="button"
                class="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none focus-visible:-outline-offset-2"
                @click="acikKazanim = acikKazanim === kazanim.id ? null : kazanim.id"
              >
                <span
                  class="mt-0.5 shrink-0 rounded bg-lavanta px-1.5 py-0.5 font-mono text-mikro text-lavanta-koyu"
                >
                  {{ kazanim.kod }}
                </span>
                <span class="flex-1 text-govde font-medium">{{ kazanim.metin }}</span>
                <Ikon
                  :ad="acikKazanim === kazanim.id ? 'yukari' : 'asagi'"
                  :boyut="15"
                  class="mt-1 shrink-0 text-murekkep-3"
                />
              </button>

              <div v-if="acikKazanim === kazanim.id" class="border-t border-kenar bg-yuzey-2 px-4 py-3.5">
                <p class="mb-2.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
                  {{ kazanim.temaKod }} · {{ kazanim.temaAd }}
                  <span v-if="kazanim.dersSaati"> · {{ kazanim.dersSaati }} ders saati</span>
                </p>
                <ol class="mb-3 space-y-1.5">
                  <li
                    v-for="madde in kazanim.maddeler"
                    :key="madde.id"
                    class="flex gap-2.5 text-kucuk text-murekkep-2"
                  >
                    <span class="shrink-0 font-mono text-kucuk text-marka">{{ madde.harf }})</span>
                    <span>{{ madde.metin }}</span>
                  </li>
                </ol>
                <p v-if="kazanim.temaOzet" class="text-kucuk text-murekkep-3">
                  {{ kazanim.temaOzet }}
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- yan sutun: on kosul haritasi -->
      <aside class="min-w-0 space-y-4">
        <div class="rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel">
          <h2 class="mb-3 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
            Önce bunlar
          </h2>
          <p v-if="!konu.onKosullar.length" class="text-kucuk text-murekkep-3">
            Bu konu için ön koşul yok — buradan başlanabilir.
          </p>
          <RouterLink
            v-for="k in konu.onKosullar"
            :key="k.slug"
            :to="{ name: 'konu', params: { slug: k.slug } }"
            class="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-yuzey-2"
          >
            <span
              class="shrink-0 rounded px-1.5 py-0.5 font-mono text-mikro"
              :class="k.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'"
            >
              {{ k.seviye === 0 ? 'Hz' : k.seviye }}
            </span>
            <span class="min-w-0 flex-1 truncate text-kucuk">{{ k.ad }}</span>
            <Ikon ad="ileri" :boyut="13" class="text-murekkep-3" />
          </RouterLink>
        </div>

        <div class="rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel">
          <h2 class="mb-3 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
            Bu konudan sonra
          </h2>
          <p v-if="!konu.sonrakiKonular.length" class="text-kucuk text-murekkep-3">
            Bu konu bir zincirin sonunda.
          </p>
          <RouterLink
            v-for="k in konu.sonrakiKonular"
            :key="k.slug"
            :to="{ name: 'konu', params: { slug: k.slug } }"
            class="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-yuzey-2"
          >
            <span
              class="shrink-0 rounded px-1.5 py-0.5 font-mono text-mikro"
              :class="k.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'"
            >
              {{ k.seviye === 0 ? 'Hz' : k.seviye }}
            </span>
            <span class="min-w-0 flex-1 truncate text-kucuk">{{ k.ad }}</span>
            <Ikon ad="ileri" :boyut="13" class="text-murekkep-3" />
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>
