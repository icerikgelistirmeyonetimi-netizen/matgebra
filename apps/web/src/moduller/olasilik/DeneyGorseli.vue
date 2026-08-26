<script setup lang="ts">
import { computed } from 'vue'
import { rolRengi } from '@/ortak/palet'
import type { DeneyVerisi } from '@/ortak/api'

/**
 * Deney gorseli.
 *
 * Zar, para, cark ve torba koordinat düzlemi gerektirmez; kendi gorsel
 * dillerinde cizilirler. Renkler yine palet tokenlarindan gelir, boylece
 * geometri sahneleriyle ayni aileden gorunurler.
 */
const { deney, sonSonuc } = defineProps<{
  deney: DeneyVerisi
  /** Son denemenin cekimleri; bos ise durgun hali gosterilir. */
  sonSonuc: string[]
}>()

const renk = (anahtar: string) => rolRengi(anahtar)

const sonucRengi = (s: string) =>
  renk(deney.sonuclar.find((c) => c.sonuc === s)?.renkAnahtari ?? 'notr')

/** Cark dilimleri: agirlik orani kadar aci kaplar. */
const dilimler = computed(() => {
  const toplam = deney.sonuclar.reduce((t, s) => t + s.agirlik, 0)
  let aci = -90
  return deney.sonuclar.map((s) => {
    const genislik = (s.agirlik / toplam) * 360
    const bas = aci
    aci += genislik
    const rad = (d: number) => (d * Math.PI) / 180
    const R = 46
    const p1 = [60 + R * Math.cos(rad(bas)), 60 + R * Math.sin(rad(bas))]
    const p2 = [60 + R * Math.cos(rad(aci)), 60 + R * Math.sin(rad(aci))]
    const buyuk = genislik > 180 ? 1 : 0
    const orta = rad(bas + genislik / 2)
    return {
      sonuc: s.sonuc,
      d: `M60 60L${p1[0]!.toFixed(2)} ${p1[1]!.toFixed(2)}A${R} ${R} 0 ${buyuk} 1 ${p2[0]!.toFixed(2)} ${p2[1]!.toFixed(2)}Z`,
      etiketX: 60 + R * 0.62 * Math.cos(orta),
      etiketY: 60 + R * 0.62 * Math.sin(orta),
      renk: renk(s.renkAnahtari),
    }
  })
})

/** Zar yuzundeki nokta duzeni. */
const ZAR_NOKTALARI: Record<string, Array<[number, number]>> = {
  '1': [[0.5, 0.5]],
  '2': [
    [0.28, 0.28],
    [0.72, 0.72],
  ],
  '3': [
    [0.28, 0.28],
    [0.5, 0.5],
    [0.72, 0.72],
  ],
  '4': [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  '5': [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.5, 0.5],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  '6': [
    [0.28, 0.25],
    [0.72, 0.25],
    [0.28, 0.5],
    [0.72, 0.5],
    [0.28, 0.75],
    [0.72, 0.75],
  ],
}

/** Torbadaki toplar: agirlik kadar top gosterilir. */
const toplar = computed(() =>
  deney.sonuclar.flatMap((s) =>
    Array.from({ length: Math.min(Math.round(s.agirlik), 12) }, () => ({
      sonuc: s.sonuc,
      renk: renk(s.renkAnahtari),
    })),
  ),
)

const cekilenler = computed(() => sonSonuc)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- zar -->
    <div v-if="deney.tur === 'zar'" class="flex gap-3">
      <template v-for="(c, i) in cekilenler.length ? cekilenler : ['?']" :key="i">
        <svg viewBox="0 0 60 60" class="h-20 w-20" role="img" :aria-label="`Zar: ${c}`">
          <rect
            x="3"
            y="3"
            width="54"
            height="54"
            rx="10"
            :fill="sonucRengi(c).dolgu"
            :stroke="sonucRengi(c).kenar"
            stroke-width="2"
          />
          <circle
            v-for="(n, j) in ZAR_NOKTALARI[c] ?? []"
            :key="j"
            :cx="3 + n[0] * 54"
            :cy="3 + n[1] * 54"
            r="5"
            :fill="sonucRengi(c).kenar"
          />
          <text
            v-if="!ZAR_NOKTALARI[c]"
            x="30"
            y="30"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="24"
            font-weight="700"
            :fill="sonucRengi(c).kenar"
          >
            {{ c }}
          </text>
        </svg>
      </template>
    </div>

    <!-- para -->
    <div v-else-if="deney.tur === 'para'" class="flex gap-3">
      <svg
        v-for="(c, i) in cekilenler.length ? cekilenler : ['?']"
        :key="i"
        viewBox="0 0 60 60"
        class="h-20 w-20"
        role="img"
        :aria-label="`Para: ${c}`"
      >
        <circle
          cx="30"
          cy="30"
          r="26"
          :fill="sonucRengi(c).dolgu"
          :stroke="sonucRengi(c).kenar"
          stroke-width="2.5"
        />
        <text
          x="30"
          y="31"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="14"
          font-weight="700"
          :fill="sonucRengi(c).kenar"
        >
          {{ c }}
        </text>
      </svg>
    </div>

    <!-- cark -->
    <div v-else-if="deney.tur === 'cark'" class="relative">
      <svg viewBox="0 0 120 120" class="h-44 w-44" role="img" aria-label="Çark">
        <path
          v-for="d in dilimler"
          :key="d.sonuc"
          :d="d.d"
          :fill="d.renk.dolgu"
          :stroke="d.renk.kenar"
          stroke-width="1.5"
          :opacity="cekilenler.includes(d.sonuc) || !cekilenler.length ? 1 : 0.4"
        />
        <text
          v-for="d in dilimler"
          :key="`${d.sonuc}-e`"
          :x="d.etiketX"
          :y="d.etiketY"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="8"
          font-weight="700"
          :fill="d.renk.kenar"
        >
          {{ d.sonuc }}
        </text>
        <circle cx="60" cy="60" r="5" fill="var(--color-yuzey)" stroke="var(--color-murekkep-3)" />
        <!-- gosterge -->
        <path d="M60 6L55 18h10z" fill="var(--color-murekkep)" />
      </svg>
    </div>

    <!-- torba -->
    <div v-else-if="deney.tur === 'torba'" class="flex flex-col items-center gap-3">
      <div class="flex max-w-56 flex-wrap justify-center gap-1.5">
        <span
          v-for="(t, i) in toplar"
          :key="i"
          class="h-6 w-6 rounded-full border-2"
          :style="{ background: t.renk.dolgu, borderColor: t.renk.kenar }"
          :title="t.sonuc"
        />
      </div>
      <div v-if="cekilenler.length" class="flex items-center gap-2">
        <span class="text-mikro text-murekkep-3">çekilen</span>
        <span
          v-for="(c, i) in cekilenler"
          :key="i"
          class="rounded-full border-2 px-2.5 py-1 text-kucuk font-semibold"
          :style="{
            background: sonucRengi(c).dolgu,
            borderColor: sonucRengi(c).kenar,
            color: sonucRengi(c).kenar,
          }"
        >
          {{ c }}
        </span>
      </div>
    </div>

    <!-- diger -->
    <div v-else class="flex gap-2">
      <span
        v-for="(c, i) in cekilenler.length ? cekilenler : ['?']"
        :key="i"
        class="rounded-kutu border-2 px-4 py-3 font-baslik text-h3 font-bold"
        :style="{
          background: sonucRengi(c).dolgu,
          borderColor: sonucRengi(c).kenar,
          color: sonucRengi(c).kenar,
        }"
      >
        {{ c }}
      </span>
    </div>

    <p v-if="cekilenler.length" class="text-kucuk text-murekkep-2">
      Son sonuç: <span class="font-semibold">{{ cekilenler.join(' · ') }}</span>
    </p>
  </div>
</template>
