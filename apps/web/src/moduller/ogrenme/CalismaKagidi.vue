<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SahneTahtasi from '../sahne/SahneTahtasi.vue'
import { sahneyiKur } from '../sahne/sahneKurucu'
import type JXG from 'jsxgraph'
import { api, type KonuAyrinti, type SahneVerisi } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Calisma kagidi - basilabilir cikti.
 *
 * PDF kutuphanesi kullanmiyoruz: sayfayi yazdirma icin duzenleyip
 * tarayicinin kendi "PDF olarak kaydet" secenegine birakiyoruz. Cikti
 * vektorel oluyor (sahneler zaten SVG), cevrimdisi calisiyor ve depoya
 * tek bir bagimlilik bile eklemiyor.
 *
 * Yazdirma duzeni Tailwind'in `print:` varyantiyla kuruluyor - ayri bir
 * stil dosyasi yok, "css yazma" kurali korunuyor.
 */
const { slug } = defineProps<{ slug: string }>()

const kabuk = kabukDeposu()
const konu = ref<KonuAyrinti | null>(null)
const sahneler = ref<SahneVerisi[]>([])
const yukleniyor = ref(true)
const hata = ref<string | null>(null)
/** Kagitta cevap anahtari da olsun mu - ogretmen kopyasi icin. */
const cevaplarla = ref(false)

const ZORLUK = ['', 'çok kolay', 'kolay', 'orta', 'zor', 'çok zor']

/** Tarayicinin kendi yazdirma diyalogu; PDF'i kullanici oradan kaydeder. */
function yazdir(): void {
  window.print()
}

const toplamPuan = computed(() =>
  (konu.value?.sorular ?? []).reduce((t, s) => t + (s.puan || 0), 0),
)

function tahtayaKur(t: JXG.Board, sahne: SahneVerisi): void {
  sahneyiKur(t, sahne)
}

/** Coktan secmeli sikkin harfi. */
const harf = (i: number) => ['A', 'B', 'C', 'D', 'E'][i] ?? String(i + 1)

/** Cevap anahtari metni: soru tipine gore okunur hale getirilir. */
function cevapMetni(soru: { tip: string; cevap: unknown; secenekler: string[] }): string {
  const c = soru.cevap as Record<string, unknown> | null
  if (!c) return '—'
  switch (soru.tip) {
    case 'coktan_secmeli': {
      const i = Number(c.dogru)
      return `${harf(i)}) ${soru.secenekler[i] ?? ''}`
    }
    case 'dogru_yanlis':
      return c.dogru ? 'Doğru' : 'Yanlış'
    case 'sayisal':
      return `${c.deger}${c.birim ? ` ${c.birim}` : ''}`
    case 'acik_uclu':
      return String(c.ornek ?? '—')
    case 'insa_gorevi':
      return 'Tahtada inşa edilir'
    default:
      return '—'
  }
}

watch(
  () => slug,
  async (deger) => {
    yukleniyor.value = true
    hata.value = null
    sahneler.value = []
    try {
      const k = await api.konu(deger)
      konu.value = k
      // Sahneler tek tek yukleniyor: kagida en fazla ucu giriyor,
      // fazlasi hem sayfayi hem baski suresini sisiriyor.
      const secilen = k.sahneler.slice(0, 3)
      sahneler.value = await Promise.all(secilen.map((s) => api.sahne(s.slug)))
      kabuk.kirintiYaz([
        { ad: 'Sınıflar', rota: { name: 'siniflar' } },
        { ad: k.sinifAd, rota: { name: 'konular', params: { seviye: k.seviye } } },
        { ad: k.ad, rota: { name: 'konu', params: { slug: k.slug } } },
        { ad: 'Çalışma kâğıdı' },
      ])
    } catch (e) {
      hata.value = e instanceof Error ? e.message : String(e)
    } finally {
      yukleniyor.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full overflow-y-auto bg-zemin print:h-auto print:overflow-visible print:bg-white">
    <div v-if="yukleniyor" class="p-8 text-kucuk text-murekkep-3">Çalışma kâğıdı hazırlanıyor…</div>

    <div v-else-if="hata" class="p-8">
      <div class="max-w-md rounded-kutu border border-gul bg-gul px-5 py-4 text-gul-koyu">
        <p class="mb-1 font-baslik text-orta font-semibold">Kâğıt hazırlanamadı</p>
        <p class="text-kucuk">{{ hata }}</p>
      </div>
    </div>

    <template v-else-if="konu">
      <!-- ekran ustundeki denetim seridi: yazdirmada gizlenir -->
      <div
        class="sticky top-0 z-10 flex items-center gap-3 border-b border-kenar bg-yuzey px-6 py-2.5 print:hidden"
      >
        <span class="text-kucuk text-murekkep-2">
          {{ konu.sinifAd }} · {{ konu.ad }} · {{ konu.sorular.length }} soru
        </span>
        <span class="flex-1" />
        <label class="flex items-center gap-2 text-kucuk text-murekkep-2">
          <input
            v-model="cevaplarla"
            type="checkbox"
            class="h-4 w-4 rounded border-kenar accent-marka focus-visible:ring-2 focus-visible:ring-marka"
          />
          Cevap anahtarı
        </label>
        <button
          type="button"
          class="flex items-center gap-2 rounded-kutu bg-marka px-3 py-1.5 text-kucuk font-medium text-white transition hover:bg-marka-koyu focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          @click="yazdir"
        >
          <Ikon ad="yazdir" :boyut="15" />
          Yazdır / PDF
        </button>
      </div>

      <!-- kagidin kendisi -->
      <article
        class="mx-auto my-6 w-[210mm] max-w-full bg-yuzey px-[16mm] py-[14mm] shadow-panel print:my-0 print:w-auto print:px-0 print:py-0 print:shadow-none"
      >
        <header class="mb-6 border-b border-kenar pb-4">
          <p class="mb-1 text-mikro tracking-[0.06em] text-murekkep-3 uppercase">
            Matgebra · {{ konu.sinifAd }} · {{ konu.alanAd }}
          </p>
          <h1 class="mb-2 font-baslik text-h2 font-semibold">{{ konu.ad }}</h1>
          <p v-if="konu.ozet" class="mb-3 text-kucuk text-murekkep-2">{{ konu.ozet }}</p>
          <div class="flex flex-wrap gap-x-8 gap-y-1 text-kucuk text-murekkep-2">
            <span>Ad Soyad: <span class="inline-block w-48 border-b border-kenar-koyu" /></span>
            <span>Sınıf / No: <span class="inline-block w-28 border-b border-kenar-koyu" /></span>
            <span>Toplam puan: <strong>{{ toplamPuan }}</strong></span>
          </div>
        </header>

        <!-- kazanimlar -->
        <section v-if="konu.kazanimlar.length" class="mb-6">
          <h2 class="mb-2 font-baslik text-orta font-semibold">Kazanımlar</h2>
          <ul class="flex flex-col gap-1">
            <li
              v-for="k in konu.kazanimlar"
              :key="k.id"
              class="flex gap-2 text-kucuk text-murekkep-2"
            >
              <span class="shrink-0 font-mono text-mikro text-murekkep-3">{{ k.kod }}</span>
              <span>{{ k.metin }}</span>
            </li>
          </ul>
        </section>

        <!-- sahneler -->
        <section v-if="sahneler.length" class="mb-6 break-inside-avoid">
          <h2 class="mb-2 font-baslik text-orta font-semibold">Şekiller</h2>
          <div class="flex flex-col gap-5">
            <figure
              v-for="s in sahneler"
              :key="s.slug"
              class="break-inside-avoid rounded-kutu border border-kenar p-3"
            >
              <figcaption class="mb-2 text-kucuk font-semibold">{{ s.baslik }}</figcaption>
              <div class="h-[72mm] w-full">
                <SahneTahtasi
                  :eksen-modu="s.ayar.eksenModu"
                  :sinir="s.ayar.sinir"
                  :izgara-adimi="s.ayar.izgaraAdimi"
                  :oran-kilidi="s.ayar.oranKilidi"
                  :arka-plan="s.arkaPlan"
                  @hazir="(t) => tahtayaKur(t, s)"
                />
              </div>
              <p class="mt-1.5 text-mikro text-murekkep-2">{{ s.ozet }}</p>
            </figure>
          </div>
        </section>

        <!-- sorular -->
        <section v-if="konu.sorular.length">
          <h2 class="mb-3 font-baslik text-orta font-semibold">Sorular</h2>
          <ol class="flex flex-col gap-5">
            <li
              v-for="(soru, i) in konu.sorular"
              :key="soru.id"
              class="break-inside-avoid border-b border-dotted border-kenar pb-4 last:border-0"
            >
              <div class="mb-1.5 flex items-baseline gap-2">
                <span class="font-baslik text-govde font-semibold">{{ i + 1 }}.</span>
                <span class="flex-1 text-govde">{{ soru.govde }}</span>
                <span class="shrink-0 font-mono text-mikro text-murekkep-3">
                  {{ soru.puan }}p · {{ ZORLUK[soru.zorluk] ?? '' }}
                </span>
              </div>

              <ul v-if="soru.secenekler.length" class="mt-2 ml-6 flex flex-col gap-1">
                <li
                  v-for="(secenek, j) in soru.secenekler"
                  :key="j"
                  class="flex gap-2 text-kucuk text-murekkep-2"
                >
                  <span class="font-mono">{{ harf(j) }})</span>
                  <span>{{ secenek }}</span>
                </li>
              </ul>

              <div
                v-else-if="soru.tip !== 'insa_gorevi'"
                class="mt-2 ml-6 border-b border-kenar-koyu"
                :class="soru.tip === 'acik_uclu' ? 'h-16' : 'h-6'"
              />

              <p
                v-if="cevaplarla"
                class="mt-2 ml-6 rounded bg-nane/40 px-2 py-1 text-kucuk text-nane-koyu"
              >
                <strong>Cevap:</strong> {{ cevapMetni(soru) }}
              </p>
            </li>
          </ol>
        </section>

        <footer class="mt-8 border-t border-kenar pt-3 text-mikro text-murekkep-3">
          Matgebra · MEB Türkiye Yüzyılı Maarif Modeli kazanımlarına bağlıdır.
        </footer>
      </article>
    </template>
  </div>
</template>
