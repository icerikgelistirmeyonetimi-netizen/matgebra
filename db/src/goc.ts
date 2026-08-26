import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { veritabaniAc, VERITABANI_YOLU } from './baglanti.js'

/**
 * Goc calistirici.
 *
 * Once drizzle-kit'in urettigi SQL goclerini uygular, ardindan
 * drizzle'in yonetmedigi sanal tablolari (FTS5 tam metin arama) kurar.
 * Yeniden calistirilabilir: var olan yapiya dokunmaz.
 */

const buradan = dirname(fileURLToPath(import.meta.url))

/**
 * Tam metin arama tablolari.
 *
 * Drizzle sanal tablolari yonetmedigi icin burada kurulur. Turetilmis veri
 * olduklarindan her gocte bastan olusturulur; ice aktarim onlari doldurur.
 *
 * Icerik kopyasi tutulur (contentless degil) - boylece snippet() ve kolon
 * okuma calisir; 300 satirlik mufredat icin maliyet ihmal edilebilir.
 */
function tamMetinAramaKur(ham: import('better-sqlite3').Database): void {
  ham.exec(`
    DROP TABLE IF EXISTS kazanim_fts;
    DROP TABLE IF EXISTS konu_fts;

    CREATE VIRTUAL TABLE kazanim_fts USING fts5(
      kod, metin, tema, sinif UNINDEXED,
      tokenize='unicode61 remove_diacritics 2'
    );

    CREATE VIRTUAL TABLE konu_fts USING fts5(
      ad, ozet, alan UNINDEXED, sinif UNINDEXED,
      tokenize='unicode61 remove_diacritics 2'
    );
  `)
}

function main(): void {
  const { ham, db } = veritabaniAc()
  const klasor = resolve(buradan, '..', 'migrations')

  console.log(`veritabani : ${VERITABANI_YOLU}`)
  console.log(`gocler     : ${klasor}`)

  migrate(db, { migrationsFolder: klasor })
  tamMetinAramaKur(ham)

  const tablolar = ham
    .prepare(
      `SELECT name FROM sqlite_master
       WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'
       ORDER BY name`,
    )
    .all() as Array<{ name: string }>

  console.log(`\n${tablolar.length} tablo hazir:`)
  console.log(tablolar.map((t) => t.name).join(', '))
  ham.close()
}

main()
