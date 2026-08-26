import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { norm } from './ortak.js'

/**
 * MEB Turkiye Yuzyili Maarif Modeli mufredati.
 * Bu tablolar veri/icerik.db ve veri/unite/*.json dosyalarindan
 * tek yonlu olarak ice aktarilir; elle duzenlenmez.
 */

export const kademe = sqliteTable('kademe', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  ad: text('ad').notNull(),
  sira: integer('sira').notNull().default(0),
})

export const sinif = sqliteTable(
  'sinif',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kademeId: integer('kademe_id')
      .notNull()
      .references(() => kademe.id, { onDelete: 'cascade' }),
    /** 1..12; hazirlik sinifi 0 ile temsil edilir. */
    seviye: integer('seviye').notNull(),
    ad: text('ad').notNull(),
    slug: text('slug').notNull().unique(),
    sira: integer('sira').notNull().default(0),
  },
  (t) => [index('ix_sinif_kademe').on(t.kademeId)],
)

export const ders = sqliteTable('ders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ad: text('ad').notNull(),
  slug: text('slug').notNull().unique(),
  /** icerik.db icindeki ders_adi degeri — ice aktarim izi. */
  kaynakDersAdi: text('kaynak_ders_adi').notNull().default(''),
})

export const tema = sqliteTable(
  'tema',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    dersId: integer('ders_id')
      .notNull()
      .references(() => ders.id, { onDelete: 'cascade' }),
    sinifId: integer('sinif_id')
      .notNull()
      .references(() => sinif.id, { onDelete: 'cascade' }),
    /** "3.TEMA" gibi kaynak kodu. */
    kod: text('kod').notNull().default(''),
    ad: text('ad').notNull(),
    adNorm: norm('ad_norm'),
    sira: integer('sira').notNull().default(0),
    dersSaati: integer('ders_saati'),
    ozet: text('ozet').notNull().default(''),
    /** icerik.db unite_bilgileri.id */
    kaynakUniteId: text('kaynak_unite_id'),
    /** Temanin hangi calisma alanina dustugu (geometri/olasilik) — siniflandirma adiminda dolar. */
    alanSlug: text('alan_slug'),
  },
  (t) => [
    index('ix_tema_sinif').on(t.sinifId),
    index('ix_tema_alan').on(t.alanSlug),
    uniqueIndex('ux_tema_kaynak').on(t.kaynakUniteId),
  ],
)

export const temaBolum = sqliteTable(
  'tema_bolum',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    temaId: integer('tema_id')
      .notNull()
      .references(() => tema.id, { onDelete: 'cascade' }),
    /** ogrenme_kaniti | temel_kabul | on_degerlendirme | zenginlestirme | destekleme */
    tur: text('tur').notNull(),
    icerik: text('icerik').notNull(),
  },
  (t) => [index('ix_tema_bolum_tema').on(t.temaId)],
)

export const kazanim = sqliteTable(
  'kazanim',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    temaId: integer('tema_id')
      .notNull()
      .references(() => tema.id, { onDelete: 'cascade' }),
    /** MAT.5.3.1 gibi. */
    kod: text('kod').notNull(),
    metin: text('metin').notNull(),
    metinNorm: norm('metin_norm'),
    sira: integer('sira').notNull().default(0),
    /** icerik.db icerik_kayitlari.id */
    kaynakId: text('kaynak_id'),
  },
  (t) => [
    index('ix_kazanim_tema').on(t.temaId),
    index('ix_kazanim_kod').on(t.kod),
    uniqueIndex('ux_kazanim_kaynak').on(t.kaynakId),
  ],
)

export const kazanimMaddesi = sqliteTable(
  'kazanim_maddesi',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    kazanimId: integer('kazanim_id')
      .notNull()
      .references(() => kazanim.id, { onDelete: 'cascade' }),
    /** a, b, c ... */
    harf: text('harf').notNull(),
    metin: text('metin').notNull(),
    sira: integer('sira').notNull().default(0),
  },
  (t) => [index('ix_madde_kazanim').on(t.kazanimId)],
)
