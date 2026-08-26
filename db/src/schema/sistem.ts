import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { sahne } from './sahne.js'
import { kullanici } from './kullanici.js'

/**
 * Sistem tablolari.
 * revizyon tablosu yonetim panelinin geri alma altyapisidir;
 * bugun yazilmaz ama semada bulunur ki sonradan goc gerekmesin.
 */

export const medya = sqliteTable('medya', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  /** gorsel | svg | video | ses */
  tur: text('tur').notNull().default('gorsel'),
  yol: text('yol').notNull(),
  altMetin: text('alt_metin').notNull().default(''),
  /** Telif takibi zorunlu: serbest lisans ya da kendi urettigimiz varlik. */
  lisans: text('lisans').notNull(),
  kaynak: text('kaynak').notNull().default(''),
  genislik: integer('genislik'),
  yukseklik: integer('yukseklik'),
})

export const etiket = sqliteTable('etiket', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ad: text('ad').notNull(),
  slug: text('slug').notNull().unique(),
})

export const sahneEtiket = sqliteTable(
  'sahne_etiket',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sahneId: integer('sahne_id')
      .notNull()
      .references(() => sahne.id, { onDelete: 'cascade' }),
    etiketId: integer('etiket_id')
      .notNull()
      .references(() => etiket.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('ux_sahne_etiket').on(t.sahneId, t.etiketId)],
)

/** Modul kayit defteri - kabuk hangi modullerin acik oldugunu buradan okur. */
export const modul = sqliteTable('modul', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  ad: text('ad').notNull(),
  surum: text('surum').notNull().default('0.1.0'),
  aktif: integer('aktif', { mode: 'boolean' }).notNull().default(true),
  sira: integer('sira').notNull().default(0),
  ayarJson: text('ayar_json').notNull().default('{}'),
})

export const revizyon = sqliteTable(
  'revizyon',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tablo: text('tablo').notNull(),
    kayitId: integer('kayit_id').notNull(),
    /** ekle | guncelle | arsivle */
    islem: text('islem').notNull(),
    oncekiJson: text('onceki_json'),
    sonrakiJson: text('sonraki_json'),
    kullaniciId: integer('kullanici_id').references(() => kullanici.id, { onDelete: 'set null' }),
    zaman: text('zaman')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [index('ix_revizyon_kayit').on(t.tablo, t.kayitId)],
)
