import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { asc, eq } from 'drizzle-orm'
import { normalize } from '@matgebra/core'
import { sema, veritabaniAc } from '@matgebra/db'
import * as depo from './depo.js'

/**
 * Statik yayin ureteci.
 *
 * Sunucusuz yayin icin API yanitlarini derleme aninda dosyaya doker.
 * Sorgular yeniden yazilmaz - ayni depo (repository) fonksiyonlari cagrilir;
 * boylece statik surum ile calisan sunucu ayni veriyi ayni bicimde verir.
 *
 * Cikti apps/web/public/api/ altina yazilir; Vite onu oldugu gibi dist'e
 * kopyalar. Veri yine veritabanindan gelir, elle yazilmaz.
 */

const buradan = dirname(fileURLToPath(import.meta.url))
const HEDEF = resolve(buradan, '..', '..', 'web', 'public', 'api')

let dosyaSayisi = 0
let toplamBayt = 0

function yaz(yol: string, veri: unknown): void {
  const tam = join(HEDEF, yol)
  mkdirSync(dirname(tam), { recursive: true })
  const govde = JSON.stringify(veri)
  writeFileSync(tam, govde, 'utf-8')
  dosyaSayisi++
  toplamBayt += Buffer.byteLength(govde)
}

function main(): void {
  const { ham, db } = veritabaniAc()
  const s = sema

  console.log(`Statik API uretiliyor -> ${HEDEF}\n`)

  yaz('mufredat/agac.json', depo.kademeAgaci())
  yaz('alanlar.json', depo.alanlar())
  yaz('palet.json', depo.stiller())
  yaz('moduller.json', depo.moduller())
  yaz('kapsama.json', depo.kapsamaRaporu())
  // Statik surumde kaydetme yok; liste bos gecer ki arayuz hata vermesin.
  yaz('cizimler.json', [])

  const siniflar = db
    .select({ seviye: s.sinif.seviye })
    .from(s.sinif)
    .orderBy(asc(s.sinif.seviye))
    .all()
  for (const { seviye } of siniflar) {
    yaz(`siniflar/${seviye}/konular.json`, depo.konular(seviye))
    yaz(`araclar/${seviye}.json`, depo.araclar(seviye))
  }

  const konular = db.select({ slug: s.konu.slug }).from(s.konu).all()
  for (const { slug } of konular) {
    yaz(`konular/${slug}.json`, depo.konu(slug))
  }

  yaz('deneyler.json', depo.deneyler())
  const deneyler = db.select({ slug: s.deney.slug }).from(s.deney).all()
  for (const { slug } of deneyler) {
    yaz(`deneyler/${slug}.json`, depo.deney(slug))
  }

  const sahneler = db.select({ slug: s.sahne.slug }).from(s.sahne).all()
  for (const { slug } of sahneler) {
    yaz(`sahneler/${slug}.json`, depo.sahne(slug))
  }

  // Arama dizini: FTS5 sunucuda kalir; statik surumde arama tarayicida ayni
  // normalize kurallariyla yurur. 97 konu + 295 kazanim icin fazlasiyla yeterli.
  const konuDizini = db
    .select({
      ad: s.konu.ad,
      slug: s.konu.slug,
      ozet: s.konu.ozet,
      alan: s.alan.slug,
      seviye: s.sinif.seviye,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .all()

  const kazanimDizini = db
    .select({
      kod: s.kazanim.kod,
      metin: s.kazanim.metin,
      temaAd: s.tema.ad,
      alan: s.tema.alanSlug,
      seviye: s.sinif.seviye,
    })
    .from(s.kazanim)
    .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.tema.sinifId))
    .all()

  yaz('ara-dizin.json', {
    konular: konuDizini.map((k) => ({ ...k, norm: normalize(`${k.ad} ${k.ozet}`) })),
    kazanimlar: kazanimDizini.map((k) => ({
      ...k,
      norm: normalize(`${k.kod} ${k.metin} ${k.temaAd}`),
    })),
  })

  ham.close()
  console.log(`${dosyaSayisi} dosya, ${(toplamBayt / 1024).toFixed(0)} KB`)
}

main()
