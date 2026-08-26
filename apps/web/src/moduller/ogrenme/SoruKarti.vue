<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { cevapDenetle, cevapSemasi, type DenetimSonucu, type VerilenCevap } from '@matgebra/core'
import { api, type SoruVerisi } from '@/ortak/api'
import { NESNE_TIP_ADI } from '@/moduller/cizim/cizimMotoru'

/**
 * Soru karti.
 *
 * Denetim @matgebra/core icindeki cevapDenetle ile yapilir; arayuz kendi
 * kurali uydurmaz. Ipucu ve cozum kademeli acilir: cozum ancak bir deneme
 * yapildiktan sonra gorunur, yoksa dusunmeden bakmak kolaylasir.
 *
 * Insa gorevlerinde tahtadaki nesne sayimi disaridan verilir; serbest tuval
 * bunu canli gonderir, konu sayfasinda ise tuvale yonlendirilir.
 */
const { soru, konuSlug, tahtaSayimi } = defineProps<{
  soru: SoruVerisi
  konuSlug: string
  /** Serbest tuvalde canli nesne sayimi; yoksa insa gorevi denetlenemez. */
  tahtaSayimi?: Record<string, number>
}>()

const yayilan = defineEmits<{ cozuldu: [dogru: boolean] }>()

const secim = ref(-1)
const mantik = ref<boolean | null>(null)
const sayi = ref('')
const metin = ref('')
const sonuc = ref<DenetimSonucu | null>(null)
const ipucuAcik = ref(false)
const cozumAcik = ref(false)
const denendi = ref(false)

const cevap = computed(() => {
  const ayristirma = cevapSemasi.safeParse(soru.cevap)
  return ayristirma.success ? ayristirma.data : null
})

const denetlenebilir = computed(
  () => soru.tip !== 'insa_gorevi' || tahtaSayimi !== undefined,
)

function verilen(): VerilenCevap | null {
  switch (soru.tip) {
    case 'coktan_secmeli':
      return secim.value < 0 ? null : { tip: 'secim', deger: secim.value }
    case 'dogru_yanlis':
      return mantik.value === null ? null : { tip: 'mantik', deger: mantik.value }
    case 'sayisal':
    case 'tahtadan_olcum': {
      const d = Number(sayi.value.replace(',', '.'))
      return sayi.value.trim() === '' || !Number.isFinite(d) ? null : { tip: 'sayi', deger: d }
    }
    case 'acik_uclu':
      return metin.value.trim() ? { tip: 'metin', deger: metin.value } : null
    case 'insa_gorevi':
      return tahtaSayimi ? { tip: 'tahta', sayim: tahtaSayimi } : null
    default:
      return null
  }
}

async function kontrolEt(): Promise<void> {
  const c = cevap.value
  const v = verilen()
  if (!c || !v) {
    sonuc.value = { dogru: null, aciklama: 'Önce cevabınızı girin.' }
    return
  }
  sonuc.value = cevapDenetle(c, v)
  denendi.value = true
  if (sonuc.value.dogru !== null) {
    yayilan('cozuldu', sonuc.value.dogru)
    if (api.kaydedebilir) {
      try {
        await api.ilerlemeYaz({ konuSlug, dogru: sonuc.value.dogru, puan: soru.puan })
      } catch {
        /* ilerleme kaydi basarisiz olsa da soru cozulmus sayilir */
      }
    }
  }
}

function sifirla(): void {
  secim.value = -1
  mantik.value = null
  sayi.value = ''
  metin.value = ''
  sonuc.value = null
  cozumAcik.value = false
  denendi.value = false
}

const TIP_ETIKETI: Record<string, string> = {
  coktan_secmeli: 'Çoktan seçmeli',
  dogru_yanlis: 'Doğru / yanlış',
  sayisal: 'Sayısal',
  tahtadan_olcum: 'Tahtadan ölçüm',
  insa_gorevi: 'İnşa görevi',
  acik_uclu: 'Açık uçlu',
}

const tipAdi = (t: string) => NESNE_TIP_ADI[t] ?? t

/** Tahtadaki nesneler, Turkce adlariyla. */
const tahtaOzeti = computed(() =>
  Object.entries(tahtaSayimi ?? {})
    .map(([t, n]) => `${n} ${tipAdi(t)}`)
    .join(' · '),
)

const durumRengi = computed(() => {
  if (!sonuc.value) return ''
  if (sonuc.value.dogru === true) return 'border-nane-koyu/40 bg-nane/40'
  if (sonuc.value.dogru === false) return 'border-gul-koyu/40 bg-gul/40'
  return 'border-kenar bg-yuzey-2'
})
</script>

<template>
  <article class="rounded-kutu border border-kenar bg-yuzey p-4 shadow-panel">
    <header class="mb-3 flex flex-wrap items-center gap-2">
      <span class="rounded bg-lavanta px-2 py-0.5 text-mikro font-semibold text-lavanta-koyu">
        {{ TIP_ETIKETI[soru.tip] ?? soru.tip }}
      </span>
      <span class="flex gap-0.5" :title="`Zorluk ${soru.zorluk}/5`">
        <span
          v-for="n in 5"
          :key="n"
          class="h-1.5 w-1.5 rounded-full"
          :class="n <= soru.zorluk ? 'bg-marka' : 'bg-yuzey-3'"
        />
      </span>
      <span class="font-mono text-mikro text-murekkep-3">{{ soru.puan }} puan</span>
      <span class="flex-1" />
      <RouterLink
        v-if="soru.sahneSlug"
        :to="{ name: 'sahne', params: { slug: soru.sahneSlug } }"
        class="rounded-md bg-nane px-2.5 py-1 text-mikro font-semibold text-nane-koyu transition hover:brightness-97"
      >
        Sahneyi aç
      </RouterLink>
    </header>

    <p class="mb-3 text-govde text-murekkep">{{ soru.govde }}</p>

    <!-- coktan secmeli -->
    <div v-if="soru.tip === 'coktan_secmeli'" class="mb-3 space-y-1.5">
      <label
        v-for="(sec, i) in soru.secenekler"
        :key="i"
        class="flex cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-2 transition"
        :class="secim === i ? 'bg-marka-soft' : 'hover:bg-yuzey-2'"
      >
        <input v-model="secim" type="radio" :value="i" class="mt-1 accent-[var(--color-marka)]" />
        <span class="text-kucuk">{{ sec }}</span>
      </label>
    </div>

    <!-- dogru / yanlis -->
    <div v-else-if="soru.tip === 'dogru_yanlis'" class="mb-3 flex gap-2">
      <button
        v-for="s in [
          { deger: true, etiket: 'Doğru' },
          { deger: false, etiket: 'Yanlış' },
        ]"
        :key="String(s.deger)"
        type="button"
        class="rounded-md px-4 py-2 text-kucuk font-medium transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        :class="mantik === s.deger ? 'bg-marka text-white' : 'bg-yuzey-2 text-murekkep-2 hover:bg-yuzey-3'"
        @click="mantik = s.deger"
      >
        {{ s.etiket }}
      </button>
    </div>

    <!-- sayisal / tahtadan olcum -->
    <div v-else-if="soru.tip === 'sayisal' || soru.tip === 'tahtadan_olcum'" class="mb-3">
      <input
        v-model="sayi"
        type="text"
        inputmode="decimal"
        placeholder="Cevabınız"
        :aria-label="soru.tip === 'tahtadan_olcum' ? 'Tahtadan okuduğunuz değer' : 'Sayısal cevabınız'"
        class="w-40 rounded-md border border-kenar bg-yuzey px-3 py-2 text-kucuk tabular-nums focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        @keydown.enter="kontrolEt"
      />
    </div>

    <!-- acik uclu -->
    <div v-else-if="soru.tip === 'acik_uclu'" class="mb-3">
      <textarea
        v-model="metin"
        rows="3"
        placeholder="Cevabınızı yazın"
        class="w-full rounded-md border border-kenar bg-yuzey px-3 py-2 text-kucuk focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
      />
    </div>

    <!-- insa gorevi -->
    <div v-else-if="soru.tip === 'insa_gorevi'" class="mb-3">
      <p v-if="!denetlenebilir" class="rounded-md bg-yuzey-2 px-3 py-2 text-kucuk text-murekkep-2">
        Bu görev serbest tuvalde çözülür. Çizimi yaptıktan sonra oradaki görev kartından
        kontrol edebilirsiniz.
      </p>
      <p v-else class="rounded-md bg-yuzey-2 px-3 py-2 text-mikro text-murekkep-2">
        Tahtada: {{ tahtaOzeti || 'henüz nesne yok' }}
      </p>
    </div>

    <!-- eylemler -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-if="soru.tip !== 'insa_gorevi' || denetlenebilir"
        type="button"
        class="rounded-md bg-marka px-3.5 py-2 text-kucuk font-medium text-white transition hover:bg-marka-koyu focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        @click="kontrolEt"
      >
        Kontrol et
      </button>
      <RouterLink
        v-else
        :to="{ name: 'tuval', query: { konu: konuSlug, gorev: soru.id } }"
        class="rounded-md bg-marka px-3.5 py-2 text-kucuk font-medium text-white transition hover:bg-marka-koyu"
      >
        Serbest tuvalde çöz
      </RouterLink>

      <button
        v-if="soru.ipucu"
        type="button"
        class="rounded-md px-3 py-2 text-kucuk text-murekkep-2 transition hover:bg-yuzey-2"
        @click="ipucuAcik = !ipucuAcik"
      >
        {{ ipucuAcik ? 'İpucunu gizle' : 'İpucu' }}
      </button>
      <button
        v-if="soru.cozum && denendi"
        type="button"
        class="rounded-md px-3 py-2 text-kucuk text-murekkep-2 transition hover:bg-yuzey-2"
        @click="cozumAcik = !cozumAcik"
      >
        {{ cozumAcik ? 'Çözümü gizle' : 'Çözüm' }}
      </button>
      <button
        v-if="denendi"
        type="button"
        class="rounded-md px-3 py-2 text-kucuk text-murekkep-3 transition hover:bg-yuzey-2"
        @click="sifirla"
      >
        Yeniden dene
      </button>
    </div>

    <p v-if="ipucuAcik" class="mt-3 rounded-md bg-tereyagi px-3 py-2 text-kucuk text-tereyagi-koyu">
      {{ soru.ipucu }}
    </p>

    <p v-if="sonuc" class="mt-3 rounded-md border px-3 py-2 text-kucuk" :class="durumRengi">
      {{ sonuc.aciklama }}
      <span v-if="sonuc.eksikler?.length">
        Eksik:
        {{ sonuc.eksikler.map((e) => `${e.adet} ${tipAdi(e.tip)}`).join(', ') }}.
      </span>
    </p>

    <div v-if="cozumAcik" class="mt-3 rounded-md border border-kenar bg-yuzey-2 px-3 py-2.5">
      <p class="mb-1 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">Çözüm</p>
      <p class="text-kucuk text-murekkep-2">{{ soru.cozum }}</p>
      <p
        v-if="cevap?.tip === 'acik_uclu'"
        class="mt-2 border-t border-kenar pt-2 text-kucuk text-murekkep-2"
      >
        <span class="font-semibold">Örnek cevap:</span> {{ cevap.ornek }}
      </p>
    </div>
  </article>
</template>
