<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import JXG from 'jsxgraph'
import { palet, rolRengi } from '@/ortak/palet'

/**
 * Sahne tahtasi - motor sarmalayici.
 *
 * JSXGraph yalnizca cekirdek olarak kullanilir: kisit cozumu ve dinamik
 * guncelleme onun isi, gorunen her sey bizim. Disariya JSXGraph terimi
 * sizmaz; bu bilesen tek gecis noktasidir. Motoru degistirmek gerekirse
 * yalnizca bu dosya degisir.
 */

const {
  eksenModu = 'tam',
  sinir = [-10, 10, 10, -10],
  izgaraAdimi = 1,
  oranKilidi = true,
} = defineProps<{
  eksenModu?: 'yok' | 'izgara' | 'tam'
  sinir?: [number, number, number, number]
  izgaraAdimi?: number
  oranKilidi?: boolean
}>()

const yayilan = defineEmits<{ hazir: [tahta: JXG.Board] }>()

const kapsayici = ref<HTMLDivElement | null>(null)
const tahta = shallowRef<JXG.Board | null>(null)
let gozlemci: ResizeObserver | null = null

function tahtayiKur(): void {
  const el = kapsayici.value
  if (!el) return
  yikMi()

  const p = palet()
  const t = JXG.JSXGraph.initBoard(el, {
    boundingbox: sinir,
    keepaspectratio: oranKilidi,
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    showInfobox: false,
    pan: { enabled: true, needTwoFingers: false },
    zoom: { wheel: true, needShift: true, min: 0.2, max: 8 },
  })

  // Izgara: 1-3. sinifta sayisiz kareli zemin, sonrasinda eksenlerle birlikte.
  if (eksenModu !== 'yok') {
    t.create('grid', [], {
      gridX: izgaraAdimi,
      gridY: izgaraAdimi,
      strokeColor: p.izgara,
      strokeWidth: 1,
      strokeOpacity: 1,
    })
  }

  // Eksenler yalnizca 'tam' kipinde; kucuk siniflarda mufredatta yok.
  if (eksenModu === 'tam') {
    const ortak = {
      strokeColor: p.eksen,
      strokeWidth: 1.4,
      highlight: false,
      ticks: {
        strokeColor: p.eksen,
        majorHeight: 8,
        minorTicks: 0,
        drawZero: false,
        label: { fontSize: 11, strokeColor: p.murekkep3, offset: [-4, -12] },
      },
    }
    t.create('axis', [[0, 0], [1, 0]], ortak)
    t.create('axis', [[0, 0], [0, 1]], ortak)
  }

  tahta.value = t
  yayilan('hazir', t)
}

function yikMi(): void {
  if (tahta.value) {
    JXG.JSXGraph.freeBoard(tahta.value)
    tahta.value = null
  }
}

/** Panel katlandiginda sekil bozulmasin diye sinir kutusu yeniden hesaplanir. */
function boyutlandir(): void {
  const el = kapsayici.value
  const t = tahta.value
  if (!el || !t) return
  t.resizeContainer(el.clientWidth, el.clientHeight, true)
}

onMounted(() => {
  tahtayiKur()
  gozlemci = new ResizeObserver(boyutlandir)
  if (kapsayici.value) gozlemci.observe(kapsayici.value)
})

onBeforeUnmount(() => {
  gozlemci?.disconnect()
  yikMi()
})

watch(() => [eksenModu, izgaraAdimi, oranKilidi, sinir.join(',')].join('|'), tahtayiKur)

defineExpose({ tahta, rolRengi })
</script>

<template>
  <div ref="kapsayici" class="h-full w-full bg-yuzey" />
</template>
