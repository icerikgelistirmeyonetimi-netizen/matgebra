<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import {
  kos,
  olayGerceklesti,
  sayim,
  sonucUzayi,
  yakinsama,
  type Deneme,
} from '@matgebra/core'
import { api, type DeneyOzeti, type DeneyVerisi } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import DeneyGorseli from './DeneyGorseli.vue'
import OlasilikGrafikleri from './OlasilikGrafikleri.vue'

/**
 * Olasilik laboratuvari.
 *
 * Deney veritabanindan gelir, benzetim tarayicida @matgebra/core ile kosar.
 * Tohum ekranda gorunur ve degistirilebilir: ayni tohum ayni sonucu verir,
 * boylece ogretmen tahtada gordugunu ogrenciye aynen tekrarlatabilir.
 */
const kabuk = kabukDeposu()

const liste = ref<DeneyOzeti[]>([])
const deney = ref<DeneyVerisi | null>(null)
const yukleniyor = ref(true)
const tohum = ref(2026)
const denemeler = ref<Deneme[]>([])
const seciliOlay = ref(0)
const kaydediliyor = ref(false)
const kayitNotu = ref('')

const gruplar = computed(() => {
  const harita = new Map<number, { seviye: number; ad: string; deneyler: DeneyOzeti[] }>()
  for (const d of liste.value) {
    const g = harita.get(d.seviye) ?? { seviye: d.seviye, ad: d.sinifAd, deneyler: [] }
    g.deneyler.push(d)
    harita.set(d.seviye, g)
  }
  return [...harita.values()].sort((a, b) => a.seviye - b.seviye)
})

const olay = computed(() => deney.value?.olaylar[seciliOlay.value] ?? null)

/** Cok cekimli deneyde birlesik etiket, tek cekimde tek sonuc sayilir. */
const birlesik = computed(() => (deney.value?.cekimSayisi ?? 1) > 1)

const sayimlar = computed(() => {
  const d = deney.value
  if (!d) return []
  const s = sayim(denemeler.value, false)
  const toplamAgirlik = d.sonuclar.reduce((t, c) => t + c.agirlik, 0)
  const cekimToplami = denemeler.value.length * d.cekimSayisi
  return d.sonuclar.map((c) => ({
    sonuc: c.sonuc,
    adet: s[c.sonuc] ?? 0,
    renkAnahtari: c.renkAnahtari,
    beklenen: d.iadeVarMi ? (c.agirlik / toplamAgirlik) * cekimToplami : null,
  }))
})

const seyir = computed(() =>
  olay.value ? yakinsama(denemeler.value, olay.value, 80) : [],
)

const olayIstatistigi = computed(() => {
  const d = deney.value
  if (!d) return []
  return d.olaylar.map((o) => {
    const uygun = denemeler.value.filter((x) => olayGerceklesti(o, x)).length
    return {
      ad: o.ad,
      teorik: o.teorik,
      deneysel: denemeler.value.length ? uygun / denemeler.value.length : null,
      uygun,
    }
  })
})

/** Iki cekimli deneylerde butun sonuc uzayi - 6x6 izgarasi gibi. */
const uzay = computed(() => {
  const d = deney.value
  if (!d || d.cekimSayisi !== 2 || d.sonuclar.length > 8) return null
  const hepsi = sonucUzayi({
    slug: d.slug,
    konuSlug: d.konuSlug,
    tur: d.tur as never,
    ad: d.ad,
    aciklama: d.aciklama,
    bagimsizMi: d.bagimsizMi,
    iadeVarMi: d.iadeVarMi,
    cekimSayisi: d.cekimSayisi,
    sonuclar: d.sonuclar,
    olaylar: d.olaylar,
  })
  return { satir: d.sonuclar.map((c) => c.sonuc), hepsi }
})

function coreDeney(d: DeneyVerisi) {
  return {
    slug: d.slug,
    konuSlug: d.konuSlug,
    tur: d.tur as never,
    ad: d.ad,
    aciklama: d.aciklama,
    bagimsizMi: d.bagimsizMi,
    iadeVarMi: d.iadeVarMi,
    cekimSayisi: d.cekimSayisi,
    sonuclar: d.sonuclar,
    olaylar: d.olaylar,
  }
}

function calistir(adet: number): void {
  const d = deney.value
  if (!d) return
  // Tohum her turda ilerler; boylece art arda atislar ayni sonucu tekrarlamaz
  // ama tohum degeri ekranda durdugu icin kosum yine tekrar edilebilir.
  const yeni = kos(coreDeney(d), tohum.value + denemeler.value.length, adet)
  denemeler.value = [...denemeler.value, ...yeni]
  kayitNotu.value = ''
}

function sifirla(): void {
  denemeler.value = []
  kayitNotu.value = ''
}

async function deneySec(slug: string): Promise<void> {
  yukleniyor.value = true
  try {
    deney.value = await api.deney(slug)
    denemeler.value = []
    seciliOlay.value = 0
    kayitNotu.value = ''
    kabuk.kirintiYaz([
      { ad: 'Olasılık Laboratuvarı' },
      { ad: deney.value.sinifAd },
      { ad: deney.value.ad },
    ])
  } finally {
    yukleniyor.value = false
  }
}

async function kosumuKaydet(): Promise<void> {
  const d = deney.value
  if (!d || !denemeler.value.length) return
  kaydediliyor.value = true
  try {
    await api.kosumKaydet(d.slug, {
      tohum: tohum.value,
      denemeSayisi: denemeler.value.length,
      sonuc: sayim(denemeler.value, birlesik.value),
    })
    kayitNotu.value = `${denemeler.value.length} denemelik koşum kaydedildi.`
  } catch (e) {
    kayitNotu.value = e instanceof Error ? e.message : String(e)
  } finally {
    kaydediliyor.value = false
  }
}

const yuzde = (n: number | null) => (n === null ? '—' : `${(n * 100).toFixed(1)}%`)

onMounted(async () => {
  kabuk.kirintiYaz([{ ad: 'Olasılık Laboratuvarı' }])
  liste.value = await api.deneyler()
  yukleniyor.value = false
  if (liste.value.length) await deneySec(liste.value[0]!.slug)
})

watch(
  () => deney.value?.olaylar.length,
  () => {
    seciliOlay.value = 0
  },
)
</script>

<template>
  <div class="flex h-full min-h-0">
    <!-- deney listesi -->
    <aside class="w-64 shrink-0 overflow-y-auto border-r border-kenar bg-yuzey p-3">
      <p class="mb-2 px-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
        Deneyler
      </p>
      <div v-for="g in gruplar" :key="g.seviye" class="mb-3">
        <p class="px-2 pb-1 text-mikro font-semibold text-murekkep-3">{{ g.ad }}</p>
        <button
          v-for="d in g.deneyler"
          :key="d.slug"
          type="button"
          class="mb-0.5 block w-full rounded-md px-2 py-2 text-left transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          :class="deney?.slug === d.slug ? 'bg-gul' : 'hover:bg-yuzey-2'"
          @click="deneySec(d.slug)"
        >
          <span
            class="block text-kucuk font-medium"
            :class="deney?.slug === d.slug ? 'text-gul-koyu' : 'text-murekkep'"
          >
            {{ d.ad }}
          </span>
          <span class="mt-0.5 block font-mono text-mikro text-murekkep-3">
            {{ d.tur }}{{ d.cekimSayisi > 1 ? ` · ${d.cekimSayisi} çekim` : '' }}
          </span>
        </button>
      </div>
    </aside>

    <!-- calisma alani -->
    <div class="min-w-0 flex-1 overflow-y-auto">
      <p v-if="yukleniyor && !deney" class="px-8 py-7 text-kucuk text-murekkep-3">Yükleniyor…</p>

      <div v-else-if="deney" class="px-8 py-7">
        <header class="mb-6">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="rounded bg-gul px-2 py-0.5 text-mikro font-semibold text-gul-koyu">
              Olasılık
            </span>
            <RouterLink
              :to="{ name: 'konu', params: { slug: deney.konuSlug } }"
              class="font-mono text-mikro text-murekkep-3 hover:text-marka-koyu"
            >
              {{ deney.sinifAd }} · {{ deney.konuAd }}
            </RouterLink>
          </div>
          <h1 class="font-baslik text-h2 font-bold text-balance">{{ deney.ad }}</h1>
          <p class="mt-2 max-w-3xl text-govde text-murekkep-2">{{ deney.aciklama }}</p>
        </header>

        <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <!-- gorsel + kontroller -->
          <div>
            <div class="rounded-kutu border border-kenar bg-yuzey p-5 shadow-panel">
              <DeneyGorseli
                :deney="deney"
                :son-sonuc="denemeler.length ? denemeler[denemeler.length - 1]!.cekimler : []"
              />
            </div>

            <div class="mt-3 rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel">
              <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
                Koşum
              </p>
              <div class="mb-3 grid grid-cols-4 gap-1.5">
                <button
                  v-for="n in [1, 10, 100, 1000]"
                  :key="n"
                  type="button"
                  class="rounded-md bg-gul px-2 py-2 text-kucuk font-semibold text-gul-koyu transition hover:brightness-97 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                  @click="calistir(n)"
                >
                  +{{ n }}
                </button>
              </div>
              <div class="mb-3 flex items-center gap-2">
                <label class="flex flex-1 items-center gap-2 text-kucuk text-murekkep-2">
                  Tohum
                  <input
                    v-model.number="tohum"
                    type="number"
                    class="w-20 rounded-md border border-kenar bg-yuzey px-2 py-1 text-kucuk tabular-nums focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                    @change="sifirla"
                  />
                </label>
                <button
                  type="button"
                  class="rounded-md px-2.5 py-1.5 text-kucuk text-murekkep-2 transition hover:bg-yuzey-2"
                  @click="sifirla"
                >
                  Sıfırla
                </button>
              </div>
              <p class="mb-3 font-mono text-mikro text-murekkep-3">
                {{ denemeler.length }} deneme yapıldı
              </p>
              <button
                v-if="api.kaydedebilir"
                type="button"
                :disabled="!denemeler.length || kaydediliyor"
                class="w-full rounded-md border border-kenar px-3 py-2 text-kucuk font-medium text-murekkep-2 transition disabled:opacity-40 enabled:hover:bg-yuzey-2"
                @click="kosumuKaydet"
              >
                Koşumu kaydet
              </button>
              <p v-if="kayitNotu" class="mt-2 text-mikro text-murekkep-3">{{ kayitNotu }}</p>
              <p class="mt-3 text-mikro text-murekkep-3">
                Aynı tohum aynı sonuç dizisini üretir; koşumu birebir tekrarlayabilirsiniz.
              </p>
            </div>
          </div>

          <!-- grafikler + olaylar -->
          <div class="min-w-0">
            <OlasilikGrafikleri
              :sayimlar="sayimlar"
              :toplam="denemeler.length * (deney.cekimSayisi ?? 1)"
              :yakinsama-seyri="seyir"
              :teorik="olay?.teorik ?? null"
              :olay-adi="olay?.ad ?? ''"
            />

            <!-- olaylar -->
            <section class="mt-6">
              <h3 class="mb-3 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
                Olaylar
              </h3>
              <div class="overflow-hidden rounded-kutu border border-kenar bg-yuzey shadow-panel">
                <table class="w-full text-kucuk">
                  <thead>
                    <tr class="border-b border-kenar bg-yuzey-2 text-left">
                      <th class="px-4 py-2 text-mikro font-semibold text-murekkep-3 uppercase">Olay</th>
                      <th class="px-4 py-2 text-right text-mikro font-semibold text-murekkep-3 uppercase">Teorik</th>
                      <th class="px-4 py-2 text-right text-mikro font-semibold text-murekkep-3 uppercase">Deneysel</th>
                      <th class="px-4 py-2 text-right text-mikro font-semibold text-murekkep-3 uppercase">Gerçekleşen</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(o, i) in olayIstatistigi"
                      :key="o.ad"
                      class="cursor-pointer border-b border-kenar transition last:border-0"
                      :class="i === seciliOlay ? 'bg-marka-soft' : 'hover:bg-yuzey-2'"
                      @click="seciliOlay = i"
                    >
                      <td class="px-4 py-2 font-medium">{{ o.ad }}</td>
                      <td class="px-4 py-2 text-right font-mono tabular-nums">{{ yuzde(o.teorik) }}</td>
                      <td class="px-4 py-2 text-right font-mono tabular-nums">{{ yuzde(o.deneysel) }}</td>
                      <td class="px-4 py-2 text-right font-mono tabular-nums text-murekkep-3">
                        {{ o.uygun }} / {{ denemeler.length }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mt-2 text-mikro text-murekkep-3">
                Bir satıra tıklayın: yakınsama grafiği o olayı izler.
              </p>
            </section>

            <!-- sonuc uzayi -->
            <section v-if="uzay" class="mt-6">
              <h3 class="mb-3 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
                Sonuç uzayı
                <span class="ml-1 font-govde tracking-normal normal-case text-murekkep-2">
                  {{ uzay.hepsi.length }} eleman
                </span>
              </h3>
              <div class="overflow-x-auto rounded-kutu border border-kenar bg-yuzey p-3 shadow-panel">
                <table class="border-separate border-spacing-1 font-mono text-mikro">
                  <tbody>
                    <tr v-for="a in uzay.satir" :key="a">
                      <td
                        v-for="b in uzay.satir"
                        :key="`${a}-${b}`"
                        class="rounded px-2 py-1 text-center tabular-nums"
                        :class="
                          olay && olayGerceklesti(olay, { cekimler: [a, b], etiket: `${a}+${b}` })
                            ? 'bg-nane text-nane-koyu font-semibold'
                            : 'bg-yuzey-2 text-murekkep-3'
                        "
                      >
                        {{ a }},{{ b }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mt-2 text-mikro text-murekkep-3">
                Yeşil hücreler seçili olaya dahil olan sonuçlar — teorik olasılık bunların oranıdır.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
