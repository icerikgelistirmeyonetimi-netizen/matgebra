<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api, type AramaSonucu } from '../ortak/api'
import { kabukDeposu } from './kabukDeposu'
import Ikon from '../ortak/bilesenler/Ikon.vue'

/**
 * Komut paleti.
 *
 * Icerik derinlestikce gezinmenin cokmemesinin asil sigortasi. Konu ve
 * kazanim tam metin aramasi; Turkce normalizasyon sunucu tarafinda oldugu
 * icin "acilar" yazinca "Açılar" bulunur.
 */
const kabuk = kabukDeposu()
const yonlendirici = useRouter()

const sorgu = ref('')
const sonuc = ref<AramaSonucu>({ konular: [], kazanimlar: [] })
const secili = ref(0)
const kutu = ref<HTMLInputElement | null>(null)
let zamanlayici: ReturnType<typeof setTimeout> | undefined

const satirlar = computed(() => [
  ...sonuc.value.konular.map((k) => ({ tur: 'konu' as const, ...k })),
  ...sonuc.value.kazanimlar.map((k) => ({ tur: 'kazanim' as const, ...k })),
])

watch(
  () => kabuk.paletAcik,
  async (acik) => {
    if (acik) {
      await nextTick()
      kutu.value?.focus()
    } else {
      sorgu.value = ''
      sonuc.value = { konular: [], kazanimlar: [] }
      secili.value = 0
    }
  },
)

watch(sorgu, (q) => {
  clearTimeout(zamanlayici)
  if (q.trim().length < 2) {
    sonuc.value = { konular: [], kazanimlar: [] }
    return
  }
  zamanlayici = setTimeout(async () => {
    sonuc.value = await api.ara(q)
    secili.value = 0
  }, 140)
})

function git(i: number): void {
  const satir = satirlar.value[i]
  if (!satir) return
  if (satir.tur === 'konu') {
    yonlendirici.push({ name: 'konu', params: { slug: satir.slug } })
  } else {
    yonlendirici.push({ name: 'konular', params: { seviye: satir.seviye } })
  }
  kabuk.paletAcik = false
}

function klavye(olay: KeyboardEvent): void {
  if (olay.key === 'ArrowDown') {
    olay.preventDefault()
    secili.value = Math.min(secili.value + 1, satirlar.value.length - 1)
  } else if (olay.key === 'ArrowUp') {
    olay.preventDefault()
    secili.value = Math.max(secili.value - 1, 0)
  } else if (olay.key === 'Enter') {
    olay.preventDefault()
    git(secili.value)
  } else if (olay.key === 'Escape') {
    kabuk.paletAcik = false
  }
}
</script>

<template>
  <div
    v-if="kabuk.paletAcik"
    class="fixed inset-0 z-50 flex items-start justify-center bg-murekkep/25 px-4 pt-[12vh]"
    role="dialog"
    aria-modal="true"
    aria-label="Ara"
    @click.self="kabuk.paletAcik = false"
  >
    <div class="w-full max-w-2xl overflow-hidden rounded-xl border border-kenar bg-yuzey shadow-yuzen">
      <div class="flex items-center gap-3 border-b border-kenar px-4">
        <Ikon ad="ara" :boyut="18" class="text-murekkep-3" />
        <input
          ref="kutu"
          v-model="sorgu"
          type="text"
          placeholder="Konu, kazanım kodu veya kavram ara…"
          class="h-13 flex-1 bg-transparent py-4 text-orta text-murekkep placeholder:text-murekkep-3 focus:outline-none"
          @keydown="klavye"
        />
        <kbd class="rounded border border-kenar bg-yuzey-2 px-1.5 py-0.5 font-mono text-mikro text-murekkep-3">
          Esc
        </kbd>
      </div>

      <div class="max-h-[52vh] overflow-y-auto p-2">
        <p
          v-if="sorgu.trim().length < 2"
          class="px-3 py-6 text-center text-kucuk text-murekkep-3"
        >
          Aramak için en az iki harf yazın.
        </p>
        <p
          v-else-if="!satirlar.length"
          class="px-3 py-6 text-center text-kucuk text-murekkep-3"
        >
          Sonuç yok.
        </p>

        <button
          v-for="(satir, i) in satirlar"
          :key="`${satir.tur}-${i}`"
          type="button"
          class="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition"
          :class="i === secili ? 'bg-marka-soft' : 'hover:bg-yuzey-2'"
          @click="git(i)"
          @mouseenter="secili = i"
        >
          <span
            class="mt-0.5 rounded px-1.5 py-0.5 font-mono text-mikro tracking-wide"
            :class="
              satir.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'
            "
          >
            {{ satir.seviye === 0 ? 'HZ' : satir.seviye }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate font-baslik text-govde font-semibold text-murekkep">
              {{ satir.tur === 'konu' ? satir.ad : satir.kod }}
            </span>
            <span class="mt-0.5 block truncate text-kucuk text-murekkep-3">
              {{ satir.tur === 'konu' ? satir.ozet : satir.metin }}
            </span>
          </span>
          <span class="mt-1 shrink-0 text-mikro text-murekkep-3 font-semibold uppercase">
            {{ satir.tur }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
