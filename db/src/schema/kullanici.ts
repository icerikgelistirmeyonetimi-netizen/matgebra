import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { sinif } from './mufredat.js'
import { konu } from './taksonomi.js'
import { sahne } from './sahne.js'

/**
 * Kullanici katmani.
 * Bugun kimlik dogrulama yok - tek yerel kayit kullanilir.
 * Tablolar ileride ogretmen/ogrenci ayrimi ve panel icin hazir.
 */

export const kullanici = sqliteTable('kullanici', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ad: text('ad').notNull(),
  /** ogrenci | ogretmen | yonetici */
  rol: text('rol').notNull().default('ogrenci'),
  sinifId: integer('sinif_id').references(() => sinif.id, { onDelete: 'set null' }),
  olusturma: text('olusturma')
    .notNull()
    .default(sql`(datetime('now'))`),
})

export const cizim = sqliteTable(
  'cizim',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kullaniciId: integer('kullanici_id')
      .notNull()
      .references(() => kullanici.id, { onDelete: 'cascade' }),
    /** Hangi sahnenin uzerine cizildi; bos tuval icin de bir sahne kaydi vardir. */
    sahneId: integer('sahne_id').references(() => sahne.id, { onDelete: 'set null' }),
    ad: text('ad').notNull().default('Adsiz cizim'),
    /** Tahtanin tam serilestirmesi (sahne semasi bicimi). */
    veriJson: text('veri_json').notNull(),
    ekranGoruntusu: text('ekran_goruntusu'),
    olusturma: text('olusturma')
      .notNull()
      .default(sql`(datetime('now'))`),
    guncelleme: text('guncelleme')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [index('ix_cizim_kullanici').on(t.kullaniciId)],
)

export const ilerleme = sqliteTable(
  'ilerleme',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kullaniciId: integer('kullanici_id')
      .notNull()
      .references(() => kullanici.id, { onDelete: 'cascade' }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    /** baslanmadi | devam | tamam */
    durum: text('durum').notNull().default('baslanmadi'),
    puan: integer('puan').notNull().default(0),
    deneme: integer('deneme').notNull().default(0),
    sonErisim: text('son_erisim'),
  },
  (t) => [uniqueIndex('ux_ilerleme').on(t.kullaniciId, t.konuId)],
)
