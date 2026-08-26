import { integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/** Her icerik tablosunda tekrar eden yasam dongusu alanlari. */
export const izlemeAlanlari = {
  durum: text('durum').notNull().default('taslak'),
  surum: integer('surum').notNull().default(1),
  olusturan: integer('olusturan'),
  olusturma: text('olusturma')
    .notNull()
    .default(sql`(datetime('now'))`),
  guncelleme: text('guncelleme')
    .notNull()
    .default(sql`(datetime('now'))`),
}

/**
 * Turkce arama icin normalize edilmis kopya kolon.
 * SQLite'in NOCASE karsilastirmasi Turkce i/I ciftinde yanlis sonuc verir;
 * arama daima bu kolon uzerinden yurur.
 */
export const norm = (ad: string) => text(ad).notNull().default('')
