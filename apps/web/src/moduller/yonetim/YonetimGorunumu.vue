<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  api,
  type KullaniciKaydi,
  type Revizyon,
  type YonetimOzeti,
  type YonetimSatiri,
} from '@/ortak/api'
import { kabukDeposu } from '@/uygulama/kabukDeposu'
import Ikon from '@/ortak/bilesenler/Ikon.vue'

/**
 * Yonetim paneli.
 *
 * Uc bolum: icerik listesi (durum akisiyla), secili kaydin duzenleyicisi ve
 * revizyon gecmisi. Panel semayi degistirmedi - `revizyon` tablosu ve
 * `durum/surum` alanlari Faz 2'den beri bekliyordu.
 *
 * Geometri buradan duzenlenmiyor: sahne nesneleri MCP araclariyla
 * dogrulanarak yaziliyor, panelden elle bozulmasi kolay olurdu. Panel
 * metin, zorluk, sira ve yasam dongusune bakiyor.
 */
const kabuk = kabukDeposu()

const ozet = ref<YonetimOzeti[]>([])
const tablo = ref('sahne')
const durumSuzgeci = ref('hepsi')
const arama = ref('')
const satirlar = ref<YonetimSatiri[]>([])
const secili = ref<Set<number>>(new Set())
const acikKayit = ref<{ duzenlenebilir: string[]; kayit: Record<string, unknown> } | null>(null)
const acikId = ref<number | null>(null)
const revizyonlar = ref<Revizyon[]>([])
const kullanicilar = ref<KullaniciKaydi[]>([])
const sekme = ref<'icerik' | 'kullanicilar'>('icerik')
const bildirim = ref('')
const yukleniyor = ref(false)
const taslak = ref<Record<string, unknown>>({})

const DURUMLAR = ['taslak', 'inceleme', 'yayin', 'arsiv'] as const
const DURUM_ADI: Record<string, string> = {
  taslak: 'Taslak',
  inceleme: 'İncelemede',
  yayin: 'Yayında',
  arsiv: 'Arşiv',
}
const DURUM_RENGI: Record<string, string> = {
  taslak: 'bg-notr text-notr-koyu',
  inceleme: 'bg-tereyagi text-tereyagi-koyu',
  yayin: 'bg-nane text-nane-koyu',
  arsiv: 'bg-gul text-gul-koyu',
}
const ROLLER = ['ogrenci', 'ogretmen', 'yonetici']
const ROL_ADI: Record<string, string> = {
  ogrenci: 'Öğrenci',
  ogretmen: 'Öğretmen',
  yonetici: 'Yönetici',
}

const seciliTablo = computed(() => ozet.value.find((o) => o.tablo === tablo.value))
const uzunAlan = (alan: string) => ['ozet', 'hikaye', 'cozum', 'aciklama', 'tanim'].includes(alan)
const sayisalAlan = (alan: string) => ['zorluk', 'sira', 'puan'].includes(alan)

function bildir(metin: string): void {
  bildirim.value = metin
  setTimeout(() => (bildirim.value = ''), 3000)
}

async function ozetiYukle(): Promise<void> {
  ozet.value = await api.yonetimOzet()
}

async function listeyiYukle(): Promise<void> {
  yukleniyor.value = true
  try {
    satirlar.value = await api.yonetimListe(tablo.value, durumSuzgeci.value, arama.value)
    secili.value = new Set()
  } catch (e) {
    bildir(e instanceof Error ? e.message : String(e))
  } finally {
    yukleniyor.value = false
  }
}

async function kaydiAc(id: number): Promise<void> {
  acikId.value = id
  const y = await api.yonetimKayit(tablo.value, id)
  acikKayit.value = { duzenlenebilir: y.duzenlenebilir, kayit: y.kayit }
  taslak.value = Object.fromEntries(y.duzenlenebilir.map((a) => [a, y.kayit[a]]))
  revizyonlar.value = await api.yonetimRevizyonlar(tablo.value, id)
}

async function kaydet(): Promise<void> {
  if (!acikId.value || !acikKayit.value) return
  // Yalnizca gercekten degisen alanlari gonderiyoruz: revizyon gecmisi
  // "hicbir sey degismedi" satirlariyla dolmasin.
  const degisen = Object.fromEntries(
    Object.entries(taslak.value).filter(
      ([a, d]) => String(d ?? '') !== String(acikKayit.value?.kayit[a] ?? ''),
    ),
  )
  if (!Object.keys(degisen).length) {
    bildir('Değişiklik yok.')
    return
  }
  try {
    await api.yonetimGuncelle(tablo.value, acikId.value, degisen)
    bildir(`Kaydedildi: ${Object.keys(degisen).join(', ')}`)
    await Promise.all([listeyiYukle(), ozetiYukle(), kaydiAc(acikId.value)])
  } catch (e) {
    bildir(e instanceof Error ? e.message : String(e))
  }
}

async function topluDurum(durum: string): Promise<void> {
  if (!secili.value.size) return
  try {
    const s = await api.yonetimDurum(tablo.value, [...secili.value], durum)
    bildir(`${s.degisen} kayıt ${DURUM_ADI[durum]} yapıldı.`)
    await Promise.all([listeyiYukle(), ozetiYukle()])
  } catch (e) {
    bildir(e instanceof Error ? e.message : String(e))
  }
}

async function geriAl(revizyonId: number): Promise<void> {
  try {
    await api.yonetimGeriAl(revizyonId)
    bildir('Revizyon geri alındı.')
    if (acikId.value) await kaydiAc(acikId.value)
    await Promise.all([listeyiYukle(), ozetiYukle()])
  } catch (e) {
    bildir(e instanceof Error ? e.message : String(e))
  }
}

async function rolYaz(k: KullaniciKaydi, rol: string): Promise<void> {
  try {
    await api.yonetimRol(k.id, rol)
    k.rol = rol
    bildir(`${k.ad}: ${ROL_ADI[rol]}`)
  } catch (e) {
    bildir(e instanceof Error ? e.message : String(e))
  }
}

/** Konunun tamamini JSON olarak indirir - yedek ve tasima icin. */
async function disaAktar(): Promise<void> {
  const satir = satirlar.value.find((r) => r.id === acikId.value)
  const slug = satir?.slug
  if (!slug) {
    bildir('Dışa aktarım için konu seçin.')
    return
  }
  try {
    const veri = await api.yonetimDisaAktar(slug)
    const blob = new Blob([JSON.stringify(veri, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    bildir(`${slug}.json indirildi`)
  } catch (e) {
    bildir(e instanceof Error ? e.message : String(e))
  }
}

function secimiDegistir(id: number): void {
  const yeni = new Set(secili.value)
  if (yeni.has(id)) yeni.delete(id)
  else yeni.add(id)
  secili.value = yeni
}

function hepsiniSec(): void {
  secili.value =
    secili.value.size === satirlar.value.length
      ? new Set()
      : new Set(satirlar.value.map((r) => r.id))
}

watch([tablo, durumSuzgeci], () => {
  acikKayit.value = null
  acikId.value = null
  void listeyiYukle()
})

let aramaZaman: ReturnType<typeof setTimeout> | null = null
watch(arama, () => {
  if (aramaZaman) clearTimeout(aramaZaman)
  aramaZaman = setTimeout(() => void listeyiYukle(), 250)
})

onMounted(async () => {
  kabuk.kirintiYaz([{ ad: 'Yönetim' }])
  if (!api.kaydedebilir) return
  await Promise.all([ozetiYukle(), listeyiYukle()])
  kullanicilar.value = await api.yonetimKullanicilar().catch(() => [])
})
</script>

<template>
  <div v-if="!api.kaydedebilir" class="flex h-full items-center justify-center p-8">
    <div class="max-w-md rounded-kutu border border-tereyagi bg-tereyagi px-5 py-4 text-tereyagi-koyu">
      <p class="mb-1 font-baslik text-orta font-semibold">Panel statik sürümde kapalı</p>
      <p class="text-kucuk">
        Yönetim yazma işlemi gerektirir. Uygulamayı <span class="font-mono">npm run dev</span> ile
        sunucuyla çalıştırın.
      </p>
    </div>
  </div>

  <div v-else class="flex h-full min-h-0 flex-col">
    <!-- ust serit: sekmeler ve ozet -->
    <div class="flex h-11 shrink-0 items-center gap-2 border-b border-kenar bg-yuzey px-4">
      <div class="flex rounded-md bg-yuzey-2 p-0.5">
        <button
          v-for="s in (['icerik', 'kullanicilar'] as const)"
          :key="s"
          type="button"
          class="rounded px-2.5 py-1 text-kucuk transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          :class="sekme === s ? 'bg-yuzey font-medium text-murekkep shadow-panel' : 'text-murekkep-3'"
          @click="sekme = s"
        >
          {{ s === 'icerik' ? 'İçerik' : 'Kullanıcılar' }}
        </button>
      </div>
      <span class="flex-1" />
      <p v-if="bildirim" role="status" class="text-kucuk text-marka-koyu">{{ bildirim }}</p>
    </div>

    <!-- icerik sekmesi -->
    <div v-if="sekme === 'icerik'" class="flex min-h-0 flex-1">
      <!-- tablo secimi + durum ozeti -->
      <aside class="flex w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r border-kenar bg-yuzey p-3">
        <p class="mb-1 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
          İçerik türü
        </p>
        <button
          v-for="o in ozet"
          :key="o.tablo"
          type="button"
          class="rounded-kutu px-2.5 py-2 text-left transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          :class="tablo === o.tablo ? 'bg-marka-soft' : 'hover:bg-yuzey-2'"
          @click="tablo = o.tablo"
        >
          <span class="flex items-baseline gap-2">
            <span class="flex-1 text-kucuk font-medium">{{ o.ad }}</span>
            <span class="font-mono text-mikro text-murekkep-3">{{ o.toplam }}</span>
          </span>
          <span class="mt-1 flex gap-1">
            <span
              v-for="d in DURUMLAR"
              :key="d"
              v-show="o.durumlar[d]"
              class="rounded px-1 py-0.5 text-nano"
              :class="DURUM_RENGI[d]"
            >
              {{ o.durumlar[d] }}
            </span>
          </span>
        </button>
      </aside>

      <!-- liste -->
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex shrink-0 flex-wrap items-center gap-2 border-b border-kenar bg-yuzey px-3 py-2">
          <select
            v-model="durumSuzgeci"
            aria-label="Durum süzgeci"
            class="rounded-md border border-kenar bg-yuzey px-2 py-1 text-kucuk focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          >
            <option value="hepsi">Hepsi</option>
            <option v-for="d in DURUMLAR" :key="d" :value="d">{{ DURUM_ADI[d] }}</option>
          </select>
          <input
            v-model="arama"
            type="search"
            placeholder="Başlıkta ara"
            aria-label="Başlıkta ara"
            class="w-48 rounded-md border border-kenar bg-yuzey px-2 py-1 text-kucuk focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
          />
          <span class="flex-1" />
          <template v-if="secili.size">
            <span class="text-kucuk text-murekkep-2">{{ secili.size }} seçili →</span>
            <button
              v-for="d in DURUMLAR"
              :key="d"
              type="button"
              class="rounded-md px-2 py-1 text-mikro font-medium transition focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
              :class="DURUM_RENGI[d]"
              @click="topluDurum(d)"
            >
              {{ DURUM_ADI[d] }}
            </button>
          </template>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto">
          <p v-if="yukleniyor" class="p-4 text-kucuk text-murekkep-3">Yükleniyor…</p>
          <p v-else-if="!satirlar.length" class="p-4 text-kucuk text-murekkep-3">Kayıt yok.</p>
          <table v-else class="w-full border-collapse text-kucuk">
            <thead class="sticky top-0 bg-yuzey-2">
              <tr class="text-left text-mikro text-murekkep-3">
                <th class="w-9 px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label="Hepsini seç"
                    :checked="secili.size > 0 && secili.size === satirlar.length"
                    class="h-3.5 w-3.5 rounded border-kenar accent-marka"
                    @change="hepsiniSec"
                  />
                </th>
                <th class="px-2 py-2 font-semibold">Başlık</th>
                <th class="w-24 px-2 py-2 font-semibold">Durum</th>
                <th class="w-14 px-2 py-2 text-right font-semibold">Sürüm</th>
                <th class="w-36 px-2 py-2 font-semibold">Güncelleme</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="satir in satirlar"
                :key="satir.id"
                class="cursor-pointer border-t border-kenar transition hover:bg-yuzey-2"
                :class="acikId === satir.id ? 'bg-marka-soft' : ''"
                @click="kaydiAc(satir.id)"
              >
                <td class="px-3 py-1.5" @click.stop>
                  <input
                    type="checkbox"
                    :aria-label="`${satir.baslik} seç`"
                    :checked="secili.has(satir.id)"
                    class="h-3.5 w-3.5 rounded border-kenar accent-marka"
                    @change="secimiDegistir(satir.id)"
                  />
                </td>
                <td class="max-w-0 truncate px-2 py-1.5" :title="satir.baslik">
                  {{ satir.baslik }}
                </td>
                <td class="px-2 py-1.5">
                  <span class="rounded px-1.5 py-0.5 text-mikro" :class="DURUM_RENGI[satir.durum]">
                    {{ DURUM_ADI[satir.durum] ?? satir.durum }}
                  </span>
                </td>
                <td class="px-2 py-1.5 text-right font-mono text-mikro tabular-nums">
                  {{ satir.surum }}
                </td>
                <td class="px-2 py-1.5 font-mono text-mikro text-murekkep-3">
                  {{ satir.guncelleme }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- duzenleyici + revizyon -->
      <aside
        v-if="acikKayit"
        class="flex w-96 shrink-0 flex-col overflow-y-auto border-l border-kenar bg-yuzey"
      >
        <div class="flex h-11 shrink-0 items-center justify-between border-b border-kenar px-3">
          <span class="text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
            Kayıt #{{ acikId }}
          </span>
          <button
            type="button"
            aria-label="Düzenleyiciyi kapat"
            class="rounded p-1 text-murekkep-3 transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            @click="acikKayit = null"
          >
            <Ikon ad="kapat" :boyut="15" />
          </button>
        </div>

        <div class="flex flex-col gap-3 p-3.5">
          <label
            v-for="alan in acikKayit.duzenlenebilir"
            :key="alan"
            class="flex flex-col gap-1 text-mikro text-murekkep-3"
          >
            {{ alan }}
            <select
              v-if="alan === 'durum'"
              v-model="taslak[alan] as string"
              class="rounded-md border border-kenar bg-yuzey px-2 py-1.5 text-kucuk text-murekkep focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            >
              <option v-for="d in DURUMLAR" :key="d" :value="d">{{ DURUM_ADI[d] }}</option>
            </select>
            <textarea
              v-else-if="uzunAlan(alan)"
              v-model="taslak[alan] as string"
              rows="4"
              class="rounded-md border border-kenar bg-yuzey px-2 py-1.5 text-kucuk text-murekkep focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            />
            <input
              v-else
              v-model="taslak[alan] as string"
              :type="sayisalAlan(alan) ? 'number' : 'text'"
              class="rounded-md border border-kenar bg-yuzey px-2 py-1.5 text-kucuk text-murekkep tabular-nums focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
            />
          </label>

          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-kutu bg-marka px-3 py-1.5 text-kucuk font-medium text-white transition hover:bg-marka-koyu focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
              @click="kaydet"
            >
              Kaydet
            </button>
            <button
              v-if="tablo === 'konu'"
              type="button"
              title="Konunun tamamını JSON olarak indir"
              class="rounded-kutu border border-kenar px-3 py-1.5 text-kucuk transition hover:bg-yuzey-2 focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
              @click="disaAktar"
            >
              Dışa aktar
            </button>
          </div>
        </div>

        <section class="border-t border-kenar p-3.5">
          <p class="mb-2 text-mikro tracking-[0.05em] font-semibold text-murekkep-3 uppercase">
            Revizyon geçmişi
          </p>
          <p v-if="!revizyonlar.length" class="text-kucuk text-murekkep-3">
            Bu kayıt hiç değiştirilmedi.
          </p>
          <ol v-else class="flex flex-col gap-2.5">
            <li
              v-for="r in revizyonlar"
              :key="r.id"
              class="rounded-kutu border border-kenar bg-yuzey-2 px-2.5 py-2"
            >
              <div class="mb-1 flex items-center gap-2">
                <span class="font-mono text-mikro text-murekkep-3">{{ r.zaman }}</span>
                <span class="rounded bg-yuzey px-1.5 py-0.5 text-nano text-murekkep-2">
                  {{ r.islem }}
                </span>
                <span class="flex-1" />
                <button
                  v-if="r.geriAlinabilir"
                  type="button"
                  class="rounded px-1.5 py-0.5 text-nano text-marka-koyu transition hover:bg-marka-soft focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                  @click="geriAl(r.id)"
                >
                  geri al
                </button>
              </div>
              <ul class="flex flex-col gap-0.5">
                <li v-for="f in r.fark" :key="f.alan" class="text-nano">
                  <span class="font-mono text-murekkep-3">{{ f.alan }}</span>
                  <span class="mx-1 text-gul-koyu line-through">{{ f.onceki || '—' }}</span>
                  <span class="text-nane-koyu">{{ f.sonraki || '—' }}</span>
                </li>
              </ul>
            </li>
          </ol>
        </section>
      </aside>
    </div>

    <!-- kullanicilar sekmesi -->
    <div v-else class="min-h-0 flex-1 overflow-y-auto p-4">
      <table class="w-full max-w-2xl border-collapse text-kucuk">
        <thead>
          <tr class="border-b border-kenar text-left text-mikro text-murekkep-3">
            <th class="py-2 font-semibold">Ad</th>
            <th class="w-40 py-2 font-semibold">Rol</th>
            <th class="w-40 py-2 font-semibold">Kayıt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in kullanicilar" :key="k.id" class="border-b border-kenar">
            <td class="py-2">{{ k.ad }}</td>
            <td class="py-2">
              <select
                :value="k.rol"
                :aria-label="`${k.ad} rolü`"
                class="rounded-md border border-kenar bg-yuzey px-2 py-1 text-kucuk focus-visible:ring-2 focus-visible:ring-marka focus-visible:outline-none"
                @change="rolYaz(k, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="r in ROLLER" :key="r" :value="r">{{ ROL_ADI[r] }}</option>
              </select>
            </td>
            <td class="py-2 font-mono text-mikro text-murekkep-3">{{ k.olusturma }}</td>
          </tr>
        </tbody>
      </table>
      <p class="mt-3 max-w-2xl text-mikro text-murekkep-3">
        Kimlik doğrulama henüz yok: uygulama tek yerel kullanıcıyla çalışıyor. Roller şemada ve
        panelde hazır; oturum katmanı eklendiğinde yetki denetimi buraya bağlanır.
      </p>
    </div>
  </div>
</template>
