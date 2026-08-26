<script setup lang="ts">
import { computed } from 'vue'
import type { Arac } from '@/ortak/api'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Arac cubugu.
 *
 * Araclar veritabanindan gelir ve `min_sinif` alanina gore suzulur:
 * 2. sinif ogrencisi teget aracini gormez. Suzme kurali kodda degil veride
 * oldugu icin yonetim paneli geldiginde degistirilebilir.
 */
const { araclar, etkin, hazir } = defineProps<{
  araclar: Arac[]
  etkin: string
  /** Faz 4 tamamlanana kadar yalniz bu araclar tiklanabilir. */
  hazir: Set<string>
}>()

defineEmits<{ sec: [anahtar: string] }>()

const GRUP_ADI: Record<string, string> = {
  temel: 'Temel',
  sekil: 'Şekil',
  insa: 'İnşa',
  olcum: 'Ölçüm',
  donusum: 'Dönüşüm',
  ileri: 'İleri',
  not: 'Not',
}

const gruplar = computed(() => {
  const harita = new Map<string, Arac[]>()
  for (const a of araclar) {
    const liste = harita.get(a.grup) ?? []
    liste.push(a)
    harita.set(a.grup, liste)
  }
  return [...harita.entries()]
})
</script>

<template>
  <div class="flex w-[72px] shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-kenar bg-yuzey py-2.5">
    <template v-for="[grup, liste] in gruplar" :key="grup">
      <p
        class="px-1 pt-2 pb-1 text-center text-nano tracking-[0.05em] text-murekkep-3 font-semibold uppercase"
      >
        {{ GRUP_ADI[grup] ?? grup }}
      </p>
      <button
        v-for="arac in liste"
        :key="arac.id"
        type="button"
        :title="`${arac.etiket}${arac.kisayol ? ` (${arac.kisayol})` : ''}${hazir.has(arac.anahtar) ? '' : ' — Faz 4'}`"
        :aria-label="arac.etiket"
        :disabled="!hazir.has(arac.anahtar)"
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-kutu transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
        :class="
          etkin === arac.anahtar
            ? 'bg-marka text-white shadow-panel'
            : hazir.has(arac.anahtar)
              ? 'bg-yuzey-2 text-murekkep-2 hover:bg-yuzey-3 hover:text-murekkep'
              : 'cursor-not-allowed bg-yuzey-2/50 text-murekkep-3 opacity-45'
        "
        @click="$emit('sec', arac.anahtar)"
      >
        <Ikon :ad="arac.ikon" :boyut="21" />
      </button>
    </template>
  </div>
</template>
