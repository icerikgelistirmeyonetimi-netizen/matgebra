import Fastify from 'fastify'
import cors from '@fastify/cors'
import * as depo from './depo.js'
import * as yonetim from './yonetim.js'

/**
 * Matgebra API.
 *
 * Tek gorevi veritabanini arayuze acmak. Hicbir egitim icerigi burada
 * gomulu degildir; her yanit veritabanindan gelir.
 */

const PORT = Number(process.env.PORT ?? 5174)

const app = Fastify({
  logger: { transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } } },
})

// PATCH ve DELETE de acik olmali: yonetim paneli kaydi guncellemek icin
// PATCH, cizim silme DELETE kullaniyor. Varsayilan liste yalnizca
// GET/HEAD/POST icerdigi icin tarayici on kontrolde ikisini de reddediyordu.
await app.register(cors, {
  origin: true,
  methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
})

app.get('/saglik', async () => ({ durum: 'ayakta', zaman: new Date().toISOString() }))

/** Kademe -> sinif agaci; sol bagam listesinin ust duzeyi. */
app.get('/mufredat/agac', async () => depo.kademeAgaci())

app.get('/alanlar', async () => depo.alanlar())

app.get<{ Params: { seviye: string }; Querystring: { alan?: string } }>(
  '/siniflar/:seviye/konular',
  async (istek, yanit) => {
    const seviye = Number(istek.params.seviye)
    if (!Number.isFinite(seviye)) return yanit.code(400).send({ hata: 'Geçersiz sınıf seviyesi' })
    return depo.konular(seviye, istek.query.alan)
  },
)

app.get<{ Params: { slug: string } }>('/konular/:slug', async (istek, yanit) => {
  const sonuc = depo.konu(istek.params.slug)
  if (!sonuc) return yanit.code(404).send({ hata: 'Konu bulunamadı' })
  return sonuc
})

app.get<{ Params: { slug: string } }>('/sahneler/:slug', async (istek, yanit) => {
  const sonuc = depo.sahne(istek.params.slug)
  if (!sonuc) return yanit.code(404).send({ hata: 'Sahne bulunamadı' })
  return sonuc
})

app.get<{ Querystring: { sinif?: string } }>('/araclar', async (istek) => {
  const seviye = istek.query.sinif ? Number(istek.query.sinif) : undefined
  return depo.araclar(Number.isFinite(seviye) ? seviye : undefined)
})

app.get('/palet', async () => depo.stiller())

app.get('/moduller', async () => depo.moduller())

app.get<{ Querystring: { q?: string } }>('/ara', async (istek) => depo.ara(istek.query.q ?? ''))

app.get('/kapsama', async () => depo.kapsamaRaporu())

/* --- sorular ve ilerleme ----------------------------------------------- */

app.get<{ Params: { slug: string } }>('/sahneler/:slug/sorular', async (istek) =>
  depo.sahneSorulari(istek.params.slug),
)

app.get('/kavramlar', async () => depo.kavramlar())

app.get('/formuller', async () => depo.formuller())

app.get('/ilerleme', async () => depo.ilerlemeOku())

app.post<{ Body: { konuSlug?: string; dogru?: boolean; puan?: number } }>(
  '/ilerleme',
  async (istek, yanit) => {
    const { konuSlug, dogru, puan } = istek.body ?? {}
    if (!konuSlug || typeof dogru !== 'boolean') {
      return yanit.code(400).send({ hata: 'konuSlug ve dogru zorunlu' })
    }
    return depo.ilerlemeYaz({ konuSlug, dogru, puan: puan ?? 1 })
  },
)

/* --- olasilik deneyleri ------------------------------------------------ */

app.get<{ Querystring: { konu?: string } }>('/deneyler', async (istek) =>
  depo.deneyler(istek.query.konu),
)

app.get<{ Params: { slug: string } }>('/deneyler/:slug', async (istek, yanit) => {
  const sonuc = depo.deney(istek.params.slug)
  if (!sonuc) return yanit.code(404).send({ hata: 'Deney bulunamadı' })
  return sonuc
})

app.get<{ Params: { slug: string } }>('/deneyler/:slug/kosumlar', async (istek) =>
  depo.kosumlar(istek.params.slug),
)

app.post<{
  Params: { slug: string }
  Body: { tohum?: number; denemeSayisi?: number; sonuc?: unknown }
}>('/deneyler/:slug/kosumlar', async (istek, yanit) => {
  const { tohum, denemeSayisi, sonuc } = istek.body ?? {}
  if (typeof tohum !== 'number' || typeof denemeSayisi !== 'number') {
    return yanit.code(400).send({ hata: 'tohum ve denemeSayisi zorunlu' })
  }
  return depo.kosumKaydet({ deneySlug: istek.params.slug, tohum, denemeSayisi, sonuc })
})

/* --- cizimler: tek yerel kullanici, kimlik dogrulama yok --------------- */

app.get('/cizimler', async () => depo.cizimListele())

app.get<{ Params: { id: string } }>('/cizimler/:id', async (istek, yanit) => {
  const sonuc = depo.cizimGetir(Number(istek.params.id))
  if (!sonuc) return yanit.code(404).send({ hata: 'Çizim bulunamadı' })
  return sonuc
})

app.post<{ Body: { ad?: string; sahneSlug?: string; veri?: unknown } }>(
  '/cizimler',
  async (istek, yanit) => {
    const { ad, sahneSlug, veri } = istek.body ?? {}
    if (!ad || veri === undefined) {
      return yanit.code(400).send({ hata: 'ad ve veri zorunlu' })
    }
    return depo.cizimKaydet({ ad, sahneSlug, veri })
  },
)

app.delete<{ Params: { id: string } }>('/cizimler/:id', async (istek) =>
  depo.cizimSil(Number(istek.params.id)),
)

/* ---------------------------------------------------------------- yonetim
   Panelin yazma ucu. Okuma ucundan (depo) ayri tutuldu: buradaki her istek
   revizyon birakiyor ve yalnizca izin listesindeki kolonlara dokunabiliyor.
--------------------------------------------------------------------------- */

/** Yonetim uclarinda hatayi 400 ile ve Turkce dondururuz. */
const yonetimSar = async <T>(yanit: { code(n: number): { send(x: unknown): unknown } }, is: () => T) => {
  try {
    return is()
  } catch (e) {
    return yanit.code(400).send({ hata: e instanceof Error ? e.message : String(e) })
  }
}

app.get('/yonetim/ozet', async () => yonetim.durumOzeti())

app.get<{ Params: { tablo: string }; Querystring: { durum?: string; arama?: string } }>(
  '/yonetim/icerik/:tablo',
  async (istek, yanit) =>
    yonetimSar(yanit, () => {
      if (!yonetim.tabloGecerli(istek.params.tablo)) throw new Error('Yönetilmeyen tablo')
      return yonetim.icerikListesi({
        tablo: istek.params.tablo,
        durum: istek.query.durum,
        arama: istek.query.arama,
      })
    }),
)

app.get<{ Params: { tablo: string; id: string } }>(
  '/yonetim/icerik/:tablo/:id',
  async (istek, yanit) =>
    yonetimSar(yanit, () => {
      if (!yonetim.tabloGecerli(istek.params.tablo)) throw new Error('Yönetilmeyen tablo')
      return yonetim.kayitAyrinti(istek.params.tablo, Number(istek.params.id))
    }),
)

app.patch<{ Params: { tablo: string; id: string }; Body: Record<string, unknown> }>(
  '/yonetim/icerik/:tablo/:id',
  async (istek, yanit) =>
    yonetimSar(yanit, () => {
      if (!yonetim.tabloGecerli(istek.params.tablo)) throw new Error('Yönetilmeyen tablo')
      return yonetim.kayitGuncelle({
        tablo: istek.params.tablo,
        id: Number(istek.params.id),
        degisiklikler: istek.body ?? {},
      })
    }),
)

app.post<{ Params: { tablo: string }; Body: { idler?: number[]; durum?: string } }>(
  '/yonetim/durum/:tablo',
  async (istek, yanit) =>
    yonetimSar(yanit, () => {
      if (!yonetim.tabloGecerli(istek.params.tablo)) throw new Error('Yönetilmeyen tablo')
      return yonetim.topluDurum({
        tablo: istek.params.tablo,
        idler: istek.body?.idler ?? [],
        durum: istek.body?.durum ?? '',
      })
    }),
)

app.get<{ Querystring: { tablo?: string; kayitId?: string } }>(
  '/yonetim/revizyonlar',
  async (istek) =>
    yonetim.revizyonlar({
      tablo: istek.query.tablo,
      kayitId: istek.query.kayitId ? Number(istek.query.kayitId) : undefined,
    }),
)

app.post<{ Params: { id: string } }>('/yonetim/revizyonlar/:id/geri-al', async (istek, yanit) =>
  yonetimSar(yanit, () => yonetim.revizyonaDon({ revizyonId: Number(istek.params.id) })),
)

app.get('/yonetim/kullanicilar', async () => yonetim.kullanicilar())

app.patch<{ Params: { id: string }; Body: { rol?: string } }>(
  '/yonetim/kullanicilar/:id',
  async (istek, yanit) =>
    yonetimSar(yanit, () =>
      yonetim.rolYaz({ id: Number(istek.params.id), rol: istek.body?.rol ?? '' }),
    ),
)

app.get<{ Params: { slug: string } }>('/yonetim/disa-aktar/:slug', async (istek, yanit) =>
  yonetimSar(yanit, () => yonetim.konuDisaAktar(istek.params.slug)),
)

app.addHook('onClose', async () => depo.kapat())

try {
  await app.listen({ port: PORT, host: '127.0.0.1' })
} catch (hata) {
  app.log.error(hata)
  process.exit(1)
}
