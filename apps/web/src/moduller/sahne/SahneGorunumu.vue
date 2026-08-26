<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import type JXG from 'jsxgraph'
import SahneTahtasi from './SahneTahtasi.vue'
import { sahneyiKur, vurgula, type Kurulum } from './sahneKurucu'
import { api, type SahneVerisi } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Sahne gorunumu - motorun okuma yonu.
 *
 * Veritabanindaki sahne koordinat düzlemine kurulur, adimlar tek tek
 * anlatilir ve her adim kendi nesnelerini one cikarir. Gercek hayat
 * sahnelerinde hikaye de burada durur.
 */
const { slug } = defineProps<{ slug: string }>()

const kabuk = kabukDeposu()
const yonlendirici = useRouter()

const sahne = ref<SahneVerisi | null>(null)
const yukleniyor = ref(true)
const hata = ref<string | null>(null)
const adimNo = ref(0)
const kurulum = shallowRef<Kurulum | null>(null)
const tahta = shallowRef<JXG.Board | null>(null)

const SAHNE_TURU: Record<string, string> = {
  kesif: 'Keşif',
  gercek_hayat: 'Gerçek hayat',
  insa: 'İnşa görevi',
  olasilik: 'Olasılık deneyi',
  bos_tuval: 'Serbest tuval',
}

const adim = computed(() => sahne.value?.adimlar[adimNo.value] ?? null)
const adimSayisi = computed(() => sahne.value?.adimlar.length ?? 0)

/** Nesne agaci: bagimliligi olmayanlar kok, digerleri altlarinda. */
const agac = computed(() => {
  const nesneler = sahne.value?.nesneler ?? []
  return nesneler.map((n) => ({
    ad: n.ad,
    tip: n.tip,
    etiket: n.etiket,
    surukleneblir: n.surukleme !== 'yok',
    kaynaklar: n.bagimliliklar.map((b) => b.kaynak),
    vurgulu: adim.value ? adim.value.vurgu.includes(n.ad) : false,
  }))
})

function tahtaHazir(t: JXG.Board): void {
  tahta.value = t
  if (!sahne.value) return
  kurulum.value = sahneyiKur(t, sahne.value)
  uygulaVurgu()
}

function uygulaVurgu(): void {
  if (!kurulum.value) return
  vurgula(kurulum.value, adim.value?.vurgu ?? [])
}

function adimaGit(no: number): void {
  adimNo.value = Math.max(0, Math.min(no, adimSayisi.value - 1))
  uygulaVurgu()
}

function kendinCiz(): void {
  if (!sahne.value) return
  yonlendirici.push({ name: 'tuval', query: { konu: sahne.value.konuSlug } })
}

watch(
  () => slug,
  async (deger) => {
    yukleniyor.value = true
    hata.value = null
    adimNo.value = 0
    kurulum.value = null
    try {
      const veri = await api.sahne(deger)
      sahne.value = veri
      kabuk.kirintiYaz([
        { ad: 'Sınıflar', rota: { name: 'siniflar' } },
        { ad: veri.sinifAd, rota: { name: 'konular', params: { seviye: veri.seviye } } },
        { ad: veri.konuAd, rota: { name: 'konu', params: { slug: veri.konuSlug } } },
        { ad: veri.baslik },
      ])
    } catch (e) {
      hata.value = e instanceof Error ? e.message : String(e)
      sahne.value = null
    } finally {
      yukleniyor.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex h-full min-h-0">
    <div v-if="yukleniyor" class="flex flex-1 items-center justify-center text-kucuk text-murekkep-3">
      Sahne yükleniyor…
    </div>

    <div v-else-if="hata" class="flex flex-1 items-center justify-center p-8">
      <div class="max-w-md rounded-kutu border border-gul bg-gul px-5 py-4 text-gul-koyu">
        <p class="mb-1 font-baslik text-orta font-semibold">Sahne açılamadı</p>
        <p class="text-kucuk">{{ hata }}</p>
      </div>
    </div>

    <template v-else-if="sahne">
      <!-- tahta -->
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex h-11 shrink-0 items-center gap-3 border-b border-kenar bg-yuzey px-4">
          <span
            class="rounded px-2 py-0.5 text-mikro font-semibold"
            :class="sahne.tur === 'gercek_hayat' ? 'bg-nane text-nane-koyu' : 'bg-gok text-gok-koyu'"
          >
            {{ SAHNE_TURU[sahne.tur] ?? sahne.tur }}
          </span>
          <span class="truncate font-baslik text-govde font-semibold">{{ sahne.baslik }}</span>
          <span class="flex-1" />
          <span class="text-mikro text-murekkep-3">
            {{ sahne.ayar.eksenModu === 'yok' ? 'Kroki' : sahne.ayar.eksenModu === 'izgara' ? 'Izgara' : 'Koordinat düzlemi' }}
          </span>
          <button
            type="button"
            class="rounded-kutu bg-marka px-3 py-1.5 text-kucuk font-medium text-white transition hover:bg-marka-koyu focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            @click="kendinCiz"
          >
            Kendin çiz
          </button>
        </div>

        <div class="min-h-0 flex-1">
          <SahneTahtasi
            :eksen-modu="sahne.ayar.eksenModu"
            :sinir="sahne.ayar.sinir"
            :izgara-adimi="sahne.ayar.izgaraAdimi"
            :oran-kilidi="sahne.ayar.oranKilidi"
            @hazir="tahtaHazir"
          />
        </div>
      </div>

      <!-- denetci -->
      <aside
        v-if="kabuk.denetciAcik"
        class="flex w-80 shrink-0 flex-col border-l border-kenar bg-yuzey"
      >
        <div class="flex h-11 shrink-0 items-center justify-between border-b border-kenar px-3">
          <span class="text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
            Anlatım
          </span>
          <button
            type="button"
            class="rounded p-1 text-murekkep-3 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            aria-label="Paneli kapat"
            @click="kabuk.denetciAcik = false"
          >
            <Ikon ad="kapat" :boyut="15" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto">
          <!-- gercek hayat hikayesi -->
          <section v-if="sahne.ornek" class="border-b border-kenar bg-nane/25 px-4 py-3.5">
            <p class="mb-1.5 text-mikro tracking-[0.05em] font-semibold text-nane-koyu uppercase">
              Gerçek hayat
            </p>
            <h2 class="mb-1.5 font-baslik text-orta font-semibold">{{ sahne.ornek.baslik }}</h2>
            <p class="mb-2 text-kucuk text-murekkep-2">{{ sahne.ornek.hikaye }}</p>
            <p v-if="sahne.ornek.soru" class="rounded-md bg-yuzey px-3 py-2 text-kucuk font-medium">
              {{ sahne.ornek.soru }}
            </p>
            <p v-if="sahne.ornek.olcekAciklama" class="mt-2 text-mikro text-murekkep-3">
              {{ sahne.ornek.olcekAciklama }}
            </p>
          </section>

          <!-- adim adim -->
          <section v-if="adim" class="border-b border-kenar px-4 py-3.5">
            <div class="mb-2 flex items-center gap-2">
              <span class="font-mono text-mikro text-murekkep-3">
                Adım {{ adimNo + 1 }} / {{ adimSayisi }}
              </span>
              <span class="flex-1" />
              <button
                type="button"
                :disabled="adimNo === 0"
                class="rounded px-2 py-1 text-mikro font-medium transition disabled:opacity-35 enabled:hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                @click="adimaGit(adimNo - 1)"
              >
                Geri
              </button>
              <button
                type="button"
                :disabled="adimNo >= adimSayisi - 1"
                class="rounded bg-marka-soft px-2.5 py-1 text-mikro font-semibold text-marka-koyu transition disabled:opacity-35 enabled:hover:brightness-97 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                @click="adimaGit(adimNo + 1)"
              >
                İleri
              </button>
            </div>

            <div class="mb-3 flex gap-1">
              <button
                v-for="(a, i) in sahne.adimlar"
                :key="a.sira"
                type="button"
                :title="a.baslik"
                :aria-label="`Adım ${i + 1}: ${a.baslik}`"
                class="h-1.5 flex-1 rounded-full transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                :class="i <= adimNo ? 'bg-marka' : 'bg-yuzey-3'"
                @click="adimaGit(i)"
              />
            </div>

            <h3 class="mb-1.5 font-baslik text-orta font-semibold">{{ adim.baslik }}</h3>
            <p class="text-kucuk text-murekkep-2">{{ adim.anlatim }}</p>
          </section>

          <!-- nesne agaci -->
          <section class="px-4 py-3.5">
            <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
              Nesneler
            </p>
            <ul class="space-y-0.5">
              <li
                v-for="n in agac"
                :key="n.ad"
                class="flex items-baseline gap-2 rounded px-2 py-1 font-mono text-mikro transition"
                :class="n.vurgulu ? 'bg-tereyagi text-tereyagi-koyu' : 'text-murekkep-2'"
              >
                <span class="w-14 shrink-0 font-semibold">{{ n.ad }}</span>
                <span class="w-28 shrink-0 text-murekkep-3">{{ n.tip }}</span>
                <span v-if="n.surukleneblir" class="text-nane-koyu">sürüklenebilir</span>
                <span v-else-if="n.kaynaklar.length" class="truncate text-murekkep-3">
                  ← {{ n.kaynaklar.join(', ') }}
                </span>
              </li>
            </ul>
            <p class="mt-3 text-mikro text-murekkep-3">
              Oklu satırlar bağımlı nesnelerdir: kaynağını sürüklediğinizde kendiliğinden
              güncellenirler.
            </p>
          </section>
        </div>

        <div class="shrink-0 border-t border-kenar px-4 py-2.5">
          <p class="text-mikro text-murekkep-3">
            {{ sahne.alanAd }} · {{ sahne.sinifAd }} ·
            <span class="font-mono">v{{ sahne.surum }}</span>
          </p>
        </div>
      </aside>

      <button
        v-else
        type="button"
        class="absolute right-4 bottom-4 rounded-kutu border border-kenar bg-yuzey px-3 py-2 text-kucuk shadow-panel"
        @click="kabuk.denetciAcik = true"
      >
        Anlatımı aç
      </button>
    </template>
  </div>
</template>
