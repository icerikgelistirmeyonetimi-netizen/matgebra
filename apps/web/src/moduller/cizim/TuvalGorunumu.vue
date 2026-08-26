<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type JXG from 'jsxgraph'
import SahneTahtasi from '../sahne/SahneTahtasi.vue'
import AracCubugu from './AracCubugu.vue'
import { CizimMotoru, HAZIR_ARACLAR, SECENEK_ETIKETI, type Secenekler } from './cizimMotoru'
import { api, type Arac, type CizimOzeti, type KonuAyrinti, type SoruVerisi } from '@/ortak/api'
import SoruKarti from '@/moduller/ogrenme/SoruKarti.vue'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Serbest tuval - cizim atolyesi.
 *
 * Bos koordinat düzlemi + tam arac seti. Sahne turlerinden yalnizca biri
 * ('bos_tuval'); gercek hayat sahnesiyle ayni motoru kullanir, tek farki
 * bos baslamasi. Arac davranisi cizimMotoru'nda; bu dosya yalnizca arayuz.
 */
const rota = useRoute()
const kabuk = kabukDeposu()

const motor = shallowRef<CizimMotoru | null>(null)
const araclar = ref<Arac[]>([])
const etkinArac = ref('nokta')
const eksenModu = ref<'yok' | 'izgara' | 'tam'>('tam')
const konu = ref<KonuAyrinti | null>(null)
const gunluk = ref<string[]>([])
const ipucu = ref('')
const geriAlinabilir = ref(false)
const ileriAlinabilir = ref(false)
const aktifSecenekler = ref<Array<keyof Secenekler>>([])
const secenek = ref<Secenekler>({ yaricap: 3, kenarSayisi: 6, aci: 90, oran: 2 })
const ozet = ref<Array<{ tip: string; adet: number }>>([])
const kayitlar = ref<CizimOzeti[]>([])
const kayitAdi = ref('')
const kaydetAcik = ref(false)
const kaydediliyor = ref(false)
/** Adres cubugundaki gorev: insa gorevi tahtada canli denetlenir. */
const gorev = ref<SoruVerisi | null>(null)

/** Tahtadaki nesne sayimi - insa gorevi denetimine gider. */
const tahtaSayimi = computed(() =>
  Object.fromEntries(ozet.value.map((o) => [o.tip, o.adet])),
)

const seviye = computed(() => konu.value?.seviye ?? 12)

const TIP_ADI: Record<string, string> = {
  point: 'nokta',
  glider: 'bağlı nokta',
  segment: 'doğru parçası',
  line: 'doğru',
  circle: 'çember',
  polygon: 'çokgen',
  regularpolygon: 'düzgün çokgen',
  arc: 'yay',
  sector: 'daire dilimi',
  angle: 'açı',
  arrow: 'vektör',
}

function durumuTazele(): void {
  const m = motor.value
  if (!m) return
  ipucu.value = m.ipucu
  geriAlinabilir.value = m.geriAlinabilir
  ileriAlinabilir.value = m.ileriAlinabilir
  aktifSecenekler.value = m.aktifSecenekler
  ozet.value = m.ozet()
}

function tahtaHazir(t: JXG.Board): void {
  const m = new CizimMotoru(t)
  m.yapisma = eksenModu.value !== 'yok'
  m.secenek = { ...secenek.value }
  m.onNot = (metin) => {
    gunluk.value = [metin, ...gunluk.value].slice(0, 14)
  }
  m.onDurum = durumuTazele
  m.aracSec(etkinArac.value)
  motor.value = m
  durumuTazele()
}

function aracSec(anahtar: string): void {
  etkinArac.value = anahtar
  motor.value?.aracSec(anahtar)
}

function seceneginiYaz(anahtar: keyof Secenekler, deger: number): void {
  secenek.value = { ...secenek.value, [anahtar]: deger }
  if (motor.value) motor.value.secenek = { ...secenek.value }
}

function eksenDegistir(mod: 'yok' | 'izgara' | 'tam'): void {
  eksenModu.value = mod
  motor.value = null // tahta yeniden kurulur, motor hazir olayinda baglanir
}

function klavye(olay: KeyboardEvent): void {
  const hedef = olay.target as HTMLElement | null
  if (hedef && ['INPUT', 'TEXTAREA'].includes(hedef.tagName)) return
  const m = motor.value
  if (!m) return

  if ((olay.ctrlKey || olay.metaKey) && olay.key.toLowerCase() === 'z') {
    olay.preventDefault()
    if (olay.shiftKey) m.ileriAl()
    else m.geriAl()
    return
  }
  if (olay.key === 'Enter') {
    olay.preventDefault()
    m.elleBitir()
    return
  }
  if (olay.key === 'Escape') {
    m.secimiBirak()
    return
  }
  if (olay.ctrlKey || olay.metaKey || olay.altKey) return
  const kisayol = araclar.value.find(
    (a) => a.kisayol && a.kisayol.toLowerCase() === olay.key.toLowerCase(),
  )
  if (kisayol) {
    olay.preventDefault()
    aracSec(kisayol.anahtar)
  }
}

async function kayitlariYukle(): Promise<void> {
  if (!api.kaydedebilir) return
  try {
    kayitlar.value = await api.cizimler()
  } catch {
    kayitlar.value = []
  }
}

async function kaydet(): Promise<void> {
  const m = motor.value
  if (!m || !kayitAdi.value.trim()) return
  kaydediliyor.value = true
  try {
    await api.cizimKaydet({
      ad: kayitAdi.value.trim(),
      veri: m.tarif(),
    })
    gunluk.value = [`Kaydedildi: ${kayitAdi.value.trim()}`, ...gunluk.value].slice(0, 14)
    kayitAdi.value = ''
    kaydetAcik.value = false
    await kayitlariYukle()
  } catch (e) {
    gunluk.value = [
      `Kaydedilemedi: ${e instanceof Error ? e.message : String(e)}`,
      ...gunluk.value,
    ].slice(0, 14)
  } finally {
    kaydediliyor.value = false
  }
}

async function ac(id: number): Promise<void> {
  const m = motor.value
  if (!m || !id) return
  try {
    const kayit = await api.cizim(id)
    m.tarifiUygula(kayit.veri as Parameters<typeof m.tarifiUygula>[0])
  } catch (e) {
    gunluk.value = [
      `Açılamadı: ${e instanceof Error ? e.message : String(e)}`,
      ...gunluk.value,
    ].slice(0, 14)
  }
}

onMounted(async () => {
  window.addEventListener('keydown', klavye)
  void kayitlariYukle()
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

  const gorevId = Number(rota.query.gorev)
  if (Number.isFinite(gorevId) && konu.value) {
    gorev.value = konu.value.sorular.find((x) => x.id === gorevId) ?? null
  }
})

onUnmounted(() => window.removeEventListener('keydown', klavye))
</script>

<template>
  <div class="flex h-full min-h-0">
    <AracCubugu :araclar="araclar" :etkin="etkinArac" :hazir="HAZIR_ARACLAR" @sec="aracSec" />

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
              eksenModu === m.deger
                ? 'bg-yuzey text-marka-koyu shadow-panel'
                : 'text-murekkep-3 hover:text-murekkep-2'
            "
            @click="eksenDegistir(m.deger as 'yok' | 'izgara' | 'tam')"
          >
            {{ m.etiket }}
          </button>
        </div>

        <span class="h-5 w-px bg-kenar" />

        <button
          type="button"
          title="Geri al (Ctrl+Z)"
          :disabled="!geriAlinabilir"
          class="rounded-md px-2.5 py-1.5 text-kucuk text-murekkep-2 transition disabled:opacity-35 enabled:hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          @click="motor?.geriAl()"
        >
          Geri al
        </button>
        <button
          type="button"
          title="İleri al (Ctrl+Shift+Z)"
          :disabled="!ileriAlinabilir"
          class="rounded-md px-2.5 py-1.5 text-kucuk text-murekkep-2 transition disabled:opacity-35 enabled:hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          @click="motor?.ileriAl()"
        >
          İleri al
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-kucuk text-murekkep-2 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          @click="motor?.temizle()"
        >
          <Ikon ad="sil" :boyut="14" />
          Temizle
        </button>

        <!-- araca ozel sayisal secenekler -->
        <template v-if="aktifSecenekler.length">
          <span class="h-5 w-px bg-kenar" />
          <label
            v-for="a in aktifSecenekler"
            :key="a"
            class="flex items-center gap-1.5 text-kucuk text-murekkep-2"
          >
            {{ SECENEK_ETIKETI[a] }}
            <input
              type="number"
              :value="secenek[a]"
              :min="a === 'kenarSayisi' ? 3 : undefined"
              :max="a === 'kenarSayisi' ? 24 : undefined"
              :step="a === 'oran' ? 0.5 : 1"
              class="w-16 rounded-md border border-kenar bg-yuzey px-2 py-1 text-kucuk tabular-nums focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
              @input="seceneginiYaz(a, Number(($event.target as HTMLInputElement).value))"
            />
          </label>
        </template>

        <!-- kaydet / ac -->
        <template v-if="api.kaydedebilir">
          <span class="h-5 w-px bg-kenar" />
          <div v-if="kaydetAcik" class="flex items-center gap-1.5">
            <input
              v-model="kayitAdi"
              type="text"
              placeholder="Çizim adı"
              class="w-36 rounded-md border border-kenar bg-yuzey px-2 py-1 text-kucuk focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
              @keydown.enter="kaydet"
              @keydown.esc="kaydetAcik = false"
            />
            <button
              type="button"
              :disabled="!kayitAdi.trim() || kaydediliyor"
              class="rounded-md bg-marka px-2.5 py-1.5 text-kucuk font-medium text-white transition disabled:opacity-40 enabled:hover:bg-marka-koyu"
              @click="kaydet"
            >
              Kaydet
            </button>
          </div>
          <button
            v-else
            type="button"
            class="rounded-md px-2.5 py-1.5 text-kucuk text-murekkep-2 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            @click="kaydetAcik = true"
          >
            Kaydet
          </button>

          <select
            v-if="kayitlar.length"
            class="rounded-md border border-kenar bg-yuzey px-2 py-1.5 text-kucuk text-murekkep-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            @change="ac(Number(($event.target as HTMLSelectElement).value))"
          >
            <option value="">Kayıtlı çizimler</option>
            <option v-for="k in kayitlar" :key="k.id" :value="k.id">{{ k.ad }}</option>
          </select>
        </template>

        <span class="flex-1" />

        <span v-if="ipucu" class="rounded-md bg-marka-soft px-2.5 py-1 text-kucuk text-marka-koyu">
          {{ ipucu }}
        </span>
        <span v-if="konu" class="font-mono text-mikro text-murekkep-3">
          {{ konu.sinifAd }} · {{ konu.ad }}
        </span>
      </div>

      <!-- tahta -->
      <div class="min-h-0 flex-1">
        <SahneTahtasi
          :key="eksenModu"
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
        <span class="text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
          Denetçi
        </span>
        <button
          type="button"
          class="rounded p-1 text-murekkep-3 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          aria-label="Denetçiyi kapat"
          @click="kabuk.denetciAcik = false"
        >
          <Ikon ad="kapat" :boyut="15" />
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-3.5">
        <!-- insa gorevi: tahtadaki cizim canli denetlenir -->
        <section v-if="gorev" class="mb-4">
          <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
            Görev
          </p>
          <SoruKarti :soru="gorev" :konu-slug="konu?.slug ?? ''" :tahta-sayimi="tahtaSayimi" />
        </section>

        <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
          Etkin araç
        </p>
        <p
          class="mb-4 rounded-md bg-marka-soft px-2.5 py-1.5 font-baslik text-govde font-semibold text-marka-koyu"
        >
          {{ araclar.find((a) => a.anahtar === etkinArac)?.etiket ?? etkinArac }}
        </p>

        <template v-if="ozet.length">
          <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
            Tahtadaki nesneler
          </p>
          <ul class="mb-4 space-y-0.5">
            <li
              v-for="o in ozet"
              :key="o.tip"
              class="flex justify-between rounded px-2 py-1 font-mono text-mikro text-murekkep-2"
            >
              <span>{{ TIP_ADI[o.tip] ?? o.tip }}</span>
              <span class="tabular-nums">{{ o.adet }}</span>
            </li>
          </ul>
        </template>

        <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
          Çizim günlüğü
        </p>
        <p v-if="!gunluk.length" class="text-kucuk text-murekkep-3">
          Bir araç seçip tahtaya tıklayın. Var olan bir noktaya tıklarsanız o nokta yeniden
          kullanılır; bir çember ya da doğru üzerine tıklarsanız üzerinde kayan nokta oluşur.
        </p>
        <ol class="space-y-1">
          <li
            v-for="(satir, i) in gunluk"
            :key="i"
            class="rounded bg-yuzey-2 px-2 py-1 font-mono text-mikro text-murekkep-2"
          >
            {{ satir }}
          </li>
        </ol>
      </div>

      <div class="shrink-0 border-t border-kenar p-3">
        <p class="text-mikro text-murekkep-3">
          <kbd class="rounded border border-kenar bg-yuzey-2 px-1 font-mono">Enter</kbd> çokgeni
          kapatır ·
          <kbd class="rounded border border-kenar bg-yuzey-2 px-1 font-mono">Esc</kbd> seçimi
          bırakır ·
          <kbd class="rounded border border-kenar bg-yuzey-2 px-1 font-mono">Ctrl+Z</kbd> geri alır
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
