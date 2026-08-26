<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type JXG from 'jsxgraph'
import SahneTahtasi from '../sahne/SahneTahtasi.vue'
import AracCubugu from './AracCubugu.vue'
import { api, type Arac, type KonuAyrinti } from '@/ortak/api'
import { rolRengi } from '@/ortak/palet'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Serbest tuval.
 *
 * Bos koordinat düzlemi + arac cubugu. Sahne turlerinden yalnizca biri
 * ('bos_tuval'); gercek hayat sahnesiyle ayni motoru kullanir, tek farki
 * bos baslamasi.
 */
const rota = useRoute()
const kabuk = kabukDeposu()

const tahta = shallowRef<JXG.Board | null>(null)
const araclar = ref<Arac[]>([])
const etkinArac = ref('nokta')
const eksenModu = ref<'yok' | 'izgara' | 'tam'>('tam')
const konu = ref<KonuAyrinti | null>(null)
const gunluk = ref<string[]>([])

/** Yarim kalmis cok adimli aracin bekleyen noktalari. */
let bekleyen: JXG.Point[] = []
let sayac = 0

const seviye = computed(() => konu.value?.seviye ?? 12)

const HAZIR_ARACLAR = new Set(['sec', 'nokta', 'dogru_parcasi', 'sil'])

function harfUret(): string {
  const harfler = 'ABCDEFGHJKLMNPRSTUVYZ'
  const h = harfler[sayac % harfler.length] ?? 'X'
  const tur = Math.floor(sayac / harfler.length)
  sayac += 1
  return tur === 0 ? h : `${h}${tur}`
}

function notDus(metin: string): void {
  gunluk.value = [metin, ...gunluk.value].slice(0, 12)
}

function noktaEkle(x: number, y: number): JXG.Point {
  const renk = rolRengi('lavanta')
  const ad = harfUret()
  const nokta = tahta.value!.create('point', [x, y], {
    name: ad,
    size: 4,
    fillColor: renk.dolgu,
    strokeColor: renk.kenar,
    strokeWidth: 2,
    label: { fontSize: 13, strokeColor: renk.kenar, offset: [6, 8] },
    snapToGrid: eksenModu.value !== 'yok',
    snapSizeX: 1,
    snapSizeY: 1,
  }) as JXG.Point
  return nokta
}

function tahtaHazir(t: JXG.Board): void {
  tahta.value = t
  t.on('down', (olay: Event) => {
    if (!tahta.value) return
    if (etkinArac.value === 'sec') return

    const [x, y] = tahta.value.getUsrCoordsOfMouse(olay as never)

    if (etkinArac.value === 'nokta') {
      const n = noktaEkle(x, y)
      notDus(`Nokta ${n.getName()} (${x.toFixed(1)}, ${y.toFixed(1)})`)
      return
    }

    if (etkinArac.value === 'dogru_parcasi') {
      const n = noktaEkle(x, y)
      bekleyen.push(n)
      if (bekleyen.length === 2) {
        const renk = rolRengi('gok')
        const parca = tahta.value.create('segment', bekleyen, {
          strokeColor: renk.kenar,
          strokeWidth: 2.5,
        })
        const a = bekleyen[0]!
        const b = bekleyen[1]!
        tahta.value.create(
          'text',
          [
            () => (a.X() + b.X()) / 2,
            () => (a.Y() + b.Y()) / 2 + 0.4,
            () => `${(parca as unknown as { L(): number }).L().toFixed(2)}`,
          ],
          { fontSize: 12, strokeColor: rolRengi('seftali').kenar, anchorX: 'middle' },
        )
        notDus(`Doğru parçası ${a.getName()}${b.getName()} eklendi`)
        bekleyen = []
      }
    }
  })
}

function aracSec(anahtar: string): void {
  etkinArac.value = anahtar
  bekleyen = []
}

function temizle(): void {
  const t = tahta.value
  if (!t) return
  const silinecek = Object.values(t.objects).filter(
    (o) => (o as { elType?: string }).elType && !['axis', 'grid', 'ticks'].includes(String((o as { elType?: string }).elType)),
  )
  for (const o of silinecek) {
    try {
      t.removeObject(o as never)
    } catch {
      /* bagimli nesne once silinmis olabilir */
    }
  }
  bekleyen = []
  sayac = 0
  gunluk.value = []
  notDus('Tahta temizlendi')
}

onMounted(async () => {
  const konuSlug = rota.query.konu as string | undefined
  if (konuSlug) {
    konu.value = await api.konu(konuSlug)
    eksenModu.value = konu.value.seviye <= 3 ? 'yok' : konu.value.seviye <= 5 ? 'izgara' : 'tam'
    kabuk.kirintiYaz([
      { ad: 'Sınıflar', rota: { name: 'siniflar' } },
      { ad: konu.value.sinifAd, rota: { name: 'konular', params: { seviye: konu.value.seviye } } },
      { ad: konu.value.ad, rota: { name: 'konu', params: { slug: konu.value.slug } } },
      { ad: 'Serbest tuval' },
    ])
  } else {
    kabuk.kirintiYaz([{ ad: 'Serbest Tuval' }])
  }
  araclar.value = await api.araclar(seviye.value)
})
</script>

<template>
  <div class="flex h-full min-h-0">
    <AracCubugu
      :araclar="araclar"
      :etkin="etkinArac"
      :hazir="HAZIR_ARACLAR"
      @sec="aracSec"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- tahta ust seridi -->
      <div class="flex h-11 shrink-0 items-center gap-2 border-b border-kenar bg-yuzey px-3">
        <div class="flex rounded-md bg-yuzey-2 p-0.5">
          <button
            v-for="m in [
              { deger: 'yok', etiket: 'Kroki' },
              { deger: 'izgara', etiket: 'Izgara' },
              { deger: 'tam', etiket: 'Koordinat' },
            ]"
            :key="m.deger"
            type="button"
            class="rounded px-2.5 py-1 text-kucuk font-medium transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            :class="
              eksenModu === m.deger ? 'bg-yuzey text-marka-koyu shadow-panel' : 'text-murekkep-3 hover:text-murekkep-2'
            "
            @click="eksenModu = m.deger as 'yok' | 'izgara' | 'tam'"
          >
            {{ m.etiket }}
          </button>
        </div>

        <span class="h-5 w-px bg-kenar" />

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-kucuk text-murekkep-2 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          @click="temizle"
        >
          <Ikon ad="sil" :boyut="14" />
          Temizle
        </button>

        <span class="flex-1" />

        <span v-if="konu" class="font-mono text-mikro text-murekkep-3">
          {{ konu.sinifAd }} · {{ konu.ad }}
        </span>
      </div>

      <!-- tahta -->
      <div class="min-h-0 flex-1">
        <SahneTahtasi
          :eksen-modu="eksenModu"
          :sinir="eksenModu === 'tam' ? [-12, 9, 12, -9] : [-1, 17, 23, -1]"
          @hazir="tahtaHazir"
        />
      </div>
    </div>

    <!-- denetci -->
    <aside
      v-if="kabuk.denetciAcik"
      class="flex w-72 shrink-0 flex-col border-l border-kenar bg-yuzey"
    >
      <div class="flex h-11 shrink-0 items-center justify-between border-b border-kenar px-3">
        <span class="text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">Denetçi</span>
        <button
          type="button"
          class="rounded p-1 text-murekkep-3 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          aria-label="Denetçiyi kapat"
          @click="kabuk.denetciAcik = false"
        >
          <Ikon ad="kapat" :boyut="15" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3.5">
        <p class="mb-2 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
          Etkin araç
        </p>
        <p class="mb-4 rounded-md bg-marka-soft px-2.5 py-1.5 font-baslik text-govde font-semibold text-marka-koyu">
          {{ araclar.find((a) => a.anahtar === etkinArac)?.etiket ?? etkinArac }}
        </p>

        <p class="mb-2 text-mikro tracking-[0.05em] text-murekkep-3 font-semibold uppercase">
          Çizim günlüğü
        </p>
        <p v-if="!gunluk.length" class="text-kucuk text-murekkep-3">
          Tahtaya tıklayarak nokta ekleyin. Noktaları sürükleyince bağlı ölçümler
          kendiliğinden güncellenir.
        </p>
        <ol class="space-y-1">
          <li
            v-for="(satir, i) in gunluk"
            :key="i"
            class="rounded bg-yuzey-2 px-2 py-1 font-mono text-kucuk text-murekkep-2"
          >
            {{ satir }}
          </li>
        </ol>
      </div>

      <div class="shrink-0 border-t border-kenar p-3">
        <p class="text-kucuk text-murekkep-3">
          Araç setinin tamamı ve kaydetme
          <span class="font-medium text-murekkep-2">Faz 4</span>'te devreye giriyor.
        </p>
      </div>
    </aside>

    <button
      v-else
      type="button"
      class="absolute right-4 bottom-4 rounded-kutu border border-kenar bg-yuzey px-3 py-2 text-kucuk shadow-panel"
      @click="kabuk.denetciAcik = true"
    >
      Denetçiyi aç
    </button>
  </div>
</template>
