<script setup lang="ts">
import { onMounted } from 'vue'
import { kabukDeposu } from '@/uygulama/kabukDeposu'

/**
 * Sahne gorunumu.
 * Veritabanindan sahne okuyup tahtaya kurma isi Faz 3'te tamamlanir.
 * Simdilik durustce ne bekledigini soyler.
 */
const { slug } = defineProps<{ slug: string }>()
const kabuk = kabukDeposu()

onMounted(() => kabuk.kirintiYaz([{ ad: 'Sahne' }, { ad: slug }]))
</script>

<template>
  <div class="flex h-full items-center justify-center p-8">
    <div class="max-w-md rounded-kutu border border-kenar bg-yuzey p-6 text-center shadow-panel">
      <p class="mb-1 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Faz 3</p>
      <h1 class="mb-2 font-baslik text-h3 font-semibold">Sahne motoru okuma yönü</h1>
      <p class="text-govde text-murekkep-2">
        Veritabanindaki <span class="font-mono text-kucuk">{{ slug }}</span> sahnesi burada
        koordinat düzlemine kurulacak: nesneler, bagimliliklar ve adim adim anlatim.
        Motorun kendisi calisiyor - Serbest Tuval'de deneyebilirsiniz.
      </p>
    </div>
  </div>
</template>
