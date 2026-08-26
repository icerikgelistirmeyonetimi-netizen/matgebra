<script setup lang="ts">
import { computed } from 'vue'
import { rolRengi } from '@/ortak/palet'

/**
 * Frekans ve yakinsama grafikleri.
 *
 * Ikisi de elde cizilmis SVG: dis grafik kutuphanesi cekmiyoruz cunku
 * gereken sey iki basit gosterim ve renklerin palet tokenlariyla ayni
 * kalmasi. Sayilar tabular hizalanir.
 */
const { sayimlar, toplam, yakinsamaSeyri, teorik, olayAdi } = defineProps<{
  /** Sonuc -> adet, renk anahtariyla birlikte. */
  sayimlar: Array<{ sonuc: string; adet: number; renkAnahtari: string; beklenen: number | null }>
  toplam: number
  /** Goreli frekansin adim adim seyri. */
  yakinsamaSeyri: Array<{ deneme: number; oran: number }>
  teorik: number | null
  olayAdi: string
}>()

const enBuyuk = computed(() => Math.max(1, ...sayimlar.map((s) => s.adet)))

const yol = computed(() => {
  if (yakinsamaSeyri.length < 2) return ''
  const G = 300
  const Y = 90
  const sonDeneme = yakinsamaSeyri[yakinsamaSeyri.length - 1]!.deneme
  return yakinsamaSeyri
    .map((n, i) => {
      const x = (n.deneme / sonDeneme) * G
      const y = Y - n.oran * Y
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join('')
})

const teorikY = computed(() => (teorik === null ? null : 90 - teorik * 90))
const yuzde = (n: number) => `${(n * 100).toFixed(1)}%`
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-2">
    <!-- frekans -->
    <section>
      <h3 class="mb-3 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
        Sonuç dağılımı
        <span class="ml-1 font-govde tracking-normal normal-case text-murekkep-2">
          {{ toplam }} deneme
        </span>
      </h3>
      <div v-if="!toplam" class="rounded-kutu bg-yuzey-2 px-4 py-6 text-center text-kucuk text-murekkep-3">
        Henüz deneme yapılmadı.
      </div>
      <ul v-else class="space-y-1.5">
        <li v-for="s in sayimlar" :key="s.sonuc" class="flex items-center gap-2.5">
          <span class="w-16 shrink-0 truncate text-kucuk font-medium">{{ s.sonuc }}</span>
          <span class="relative h-6 flex-1 overflow-hidden rounded-md bg-yuzey-2">
            <span
              class="absolute inset-y-0 left-0 rounded-md transition-all duration-300"
              :style="{
                width: `${(s.adet / enBuyuk) * 100}%`,
                background: rolRengi(s.renkAnahtari).dolgu,
                borderRight: `2px solid ${rolRengi(s.renkAnahtari).kenar}`,
              }"
            />
            <span
              v-if="s.beklenen !== null"
              class="absolute inset-y-0 w-px bg-murekkep-3"
              :style="{ left: `${(s.beklenen / enBuyuk) * 100}%` }"
              :title="`Beklenen: ${s.beklenen.toFixed(1)}`"
            />
          </span>
          <span class="w-12 shrink-0 text-right font-mono text-mikro tabular-nums text-murekkep-2">
            {{ s.adet }}
          </span>
          <span class="w-14 shrink-0 text-right font-mono text-mikro tabular-nums text-murekkep-3">
            {{ toplam ? yuzde(s.adet / toplam) : '—' }}
          </span>
        </li>
      </ul>
      <p v-if="toplam" class="mt-2 text-mikro text-murekkep-3">
        İnce dikey çizgi, o sonucun teorik olarak beklenen sayısını gösterir.
      </p>
    </section>

    <!-- yakinsama -->
    <section>
      <h3 class="mb-3 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
        Göreli frekansın seyri
        <span class="ml-1 font-govde tracking-normal normal-case text-murekkep-2">
          {{ olayAdi }}
        </span>
      </h3>
      <div
        v-if="yakinsamaSeyri.length < 2"
        class="rounded-kutu bg-yuzey-2 px-4 py-6 text-center text-kucuk text-murekkep-3"
      >
        En az iki deneme gerekiyor.
      </div>
      <div v-else class="rounded-kutu border border-kenar bg-yuzey p-3">
        <svg viewBox="-6 -6 318 108" class="h-32 w-full" role="img" aria-label="Yakınsama grafiği">
          <line x1="0" y1="90" x2="300" y2="90" stroke="var(--color-kenar)" />
          <line x1="0" y1="0" x2="0" y2="90" stroke="var(--color-kenar)" />
          <line
            v-if="teorikY !== null"
            x1="0"
            :y1="teorikY"
            x2="300"
            :y2="teorikY"
            stroke="var(--color-murekkep-3)"
            stroke-width="1.2"
            stroke-dasharray="5 4"
          />
          <path :d="yol" fill="none" stroke="var(--color-marka)" stroke-width="2" />
          <text
            v-if="teorikY !== null"
            x="298"
            :y="teorikY - 4"
            text-anchor="end"
            font-size="8"
            fill="var(--color-murekkep-3)"
          >
            teorik {{ yuzde(teorik!) }}
          </text>
        </svg>
        <div class="mt-1 flex justify-between font-mono text-mikro text-murekkep-3">
          <span>0</span>
          <span>
            deneysel {{ yuzde(yakinsamaSeyri[yakinsamaSeyri.length - 1]!.oran) }}
          </span>
          <span>{{ yakinsamaSeyri[yakinsamaSeyri.length - 1]!.deneme }}</span>
        </div>
      </div>
      <p v-if="yakinsamaSeyri.length >= 2 && teorik !== null" class="mt-2 text-mikro text-murekkep-3">
        Deneme sayısı arttıkça mor çizgi kesikli teorik değere yaklaşır.
      </p>
    </section>
  </div>
</template>
