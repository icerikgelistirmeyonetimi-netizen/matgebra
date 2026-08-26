import Fastify from 'fastify'
import cors from '@fastify/cors'
import * as depo from './depo.js'

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

await app.register(cors, { origin: true })

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

app.addHook('onClose', async () => depo.kapat())

try {
  await app.listen({ port: PORT, host: '127.0.0.1' })
} catch (hata) {
  app.log.error(hata)
  process.exit(1)
}
