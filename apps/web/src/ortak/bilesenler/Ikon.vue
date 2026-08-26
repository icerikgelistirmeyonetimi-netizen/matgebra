<script setup lang="ts">
import {
  ChartLine,
  Link2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Dices,
  Eraser,
  FlipHorizontal2,
  Hexagon,
  Info,
  LayoutGrid,
  Library,
  Lock,
  MousePointer2,
  Move,
  PanelLeft,
  Pencil,
  Pentagon,
  Presentation,
  Printer,
  RotateCw,
  Ruler,
  Scaling,
  Search,
  Shapes,
  SlidersHorizontal,
  Spline,
  Grid3x3,
  Tag,
  TrendingUp,
  Type,
  Waypoints,
  X,
} from '@lucide/vue'
import { GEOMETRI_IKONLARI } from './geometri-ikonlari'

/**
 * Ikon.
 *
 * Iki kaynak, tek gorunum:
 *  - Genel arayuz ikonlari Lucide'den gelir (24x24, 2 kalinlik, yuvarlak uc).
 *  - Geometriye ozgu olanlar ayni izgarada uretilir; koordinatlari
 *    hesaplanir, goz karari cizilmez (bkz. scripts/ikon-uret.mjs).
 *
 * Kisit noktalari dolu daire olarak boyanir - dinamik geometride "bu nokta
 * surukleneblir" isaretidir ve arac cubugunda da ayni dili konusur.
 */
const LUCIDE = {
  // gezinme
  siniflar: LayoutGrid,
  geometri: Shapes,
  olasilik: Dices,
  tuval: Grid3x3,
  kutuphane: Library,
  ara: Search,
  geri: ChevronLeft,
  ileri: ChevronRight,
  yukari: ChevronUp,
  asagi: ChevronDown,
  kapat: X,
  panel: PanelLeft,
  bilgi: Info,
  baglanti: Link2,
  sunum: Presentation,
  yazdir: Printer,
  kilit: Lock,
  // arac cubugu
  imlec: MousePointer2,
  cokgen: Pentagon,
  altigen: Hexagon,
  cetvel: Ruler,
  egim: TrendingUp,
  oteleme: Move,
  yansima: FlipHorizontal2,
  donme: RotateCw,
  homoteti: Scaling,
  grafik: ChartLine,
  kaydirici: SlidersHorizontal,
  egri: Spline,
  iz: Waypoints,
  metin: Type,
  etiket: Tag,
  kalem: Pencil,
  sil: Eraser,
} as const

const { ad, boyut = 20 } = defineProps<{ ad: string; boyut?: number }>()

const lucide = () => LUCIDE[ad as keyof typeof LUCIDE]
const sekiller = () => GEOMETRI_IKONLARI[ad] ?? GEOMETRI_IKONLARI.nokta!
</script>

<template>
  <component
    :is="lucide()"
    v-if="lucide()"
    :size="boyut"
    :stroke-width="2"
    class="shrink-0"
    aria-hidden="true"
  />
  <svg
    v-else
    :width="boyut"
    :height="boyut"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0"
  >
    <path
      v-for="(sekil, i) in sekiller()"
      :key="i"
      :d="sekil.d"
      :fill="sekil.dolu ? 'currentColor' : 'none'"
      :stroke="sekil.dolu ? 'none' : 'currentColor'"
    />
  </svg>
</template>
