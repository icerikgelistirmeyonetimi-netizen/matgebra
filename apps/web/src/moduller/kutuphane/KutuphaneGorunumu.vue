<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'

/**
 * Kutuphane.
 * Kavram sozlugu ve formul kartlari Faz 8'de dolar. Bugun icerik uretiminin
 * kapsama raporunu gosteriyor - projenin ilerleme gostergesi budur.
 */
const kabuk = kabukDeposu()
const satirlar = ref<Array<{ seviye: number; alan: string; konu: number; sahne: number; ornek: number }>>([])

onMounted(async () => {
  kabuk.kirintiYaz([{ ad: 'Kütüphane' }, { ad: 'Kapsama raporu' }])
  satirlar.value = (await api.kapsama()).siniflar
})
</script>

<template>
  <div class="h-full overflow-y-auto px-8 py-7">
    <header class="mb-6">
      <p class="mb-1.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
        İçerik üretimi
      </p>
      <h1 class="font-baslik text-h2 font-bold text-balance">Kapsama Raporu</h1>
      <p class="mt-2 max-w-2xl text-govde text-murekkep-2">
        Hangi sınıfta kaç konu tanımlı, kaçının sahnesi ve gerçek hayat örneği var.
        İçerik doldurma ilerledikçe bu tablo dolar.
      </p>
    </header>

    <div class="max-w-3xl overflow-hidden rounded-kutu border border-kenar bg-yuzey shadow-panel">
      <table class="w-full text-kucuk">
        <thead>
          <tr class="border-b border-kenar bg-yuzey-2 text-left">
            <th class="px-4 py-2.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Sınıf</th>
            <th class="px-4 py-2.5 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Alan</th>
            <th class="px-4 py-2.5 text-right text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Konu</th>
            <th class="px-4 py-2.5 text-right text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Sahne</th>
            <th class="px-4 py-2.5 text-right text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Örnek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in satirlar" :key="i" class="border-b border-kenar last:border-0">
            <td class="px-4 py-2 font-medium">{{ s.seviye === 0 ? 'Hazırlık' : `${s.seviye}. sınıf` }}</td>
            <td class="px-4 py-2">
              <span
                class="rounded px-1.5 py-0.5 font-mono text-mikro"
                :class="s.alan === 'olasilik' ? 'bg-gul text-gul-koyu' : 'bg-gok text-gok-koyu'"
              >{{ s.alan }}</span>
            </td>
            <td class="px-4 py-2 text-right tabular-nums">{{ s.konu }}</td>
            <td class="px-4 py-2 text-right tabular-nums" :class="s.sahne ? 'text-nane-koyu' : 'text-murekkep-3'">{{ s.sahne }}</td>
            <td class="px-4 py-2 text-right tabular-nums" :class="s.ornek ? 'text-nane-koyu' : 'text-murekkep-3'">{{ s.ornek }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
