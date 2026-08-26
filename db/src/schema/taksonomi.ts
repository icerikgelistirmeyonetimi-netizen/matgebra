import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { izlemeAlanlari, norm } from './ortak.js'
import { sinif } from './mufredat.js'
import { kazanim } from './mufredat.js'

/**
 * Bizim urettigimiz ogretim taksonomisi.
 * MEB kazanimlariyla cok-cok baglidir: bir konu birden cok kazanimi kapsayabilir,
 * bir kazanim birden cok konuya dagilabilir. Mufredat degistiginde icerik kirilmaz.
 */

export const alan = sqliteTable('alan', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  ad: text('ad').notNull(),
  renkAnahtari: text('renk_anahtari').notNull().default('gok'),
  sira: integer('sira').notNull().default(0),
})

export const konu = sqliteTable(
  'konu',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    alanId: integer('alan_id')
      .notNull()
      .references(() => alan.id, { onDelete: 'restrict' }),
    sinifId: integer('sinif_id')
      .notNull()
      .references(() => sinif.id, { onDelete: 'cascade' }),
    ad: text('ad').notNull(),
    adNorm: norm('ad_norm'),
    slug: text('slug').notNull().unique(),
    ozet: text('ozet').notNull().default(''),
    sira: integer('sira').notNull().default(0),
    zorluk: integer('zorluk').notNull().default(2),
    ...izlemeAlanlari,
  },
  (t) => [index('ix_konu_sinif_alan').on(t.sinifId, t.alanId), index('ix_konu_ad_norm').on(t.adNorm)],
)

export const konuKazanim = sqliteTable(
  'konu_kazanim',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    kazanimId: integer('kazanim_id')
      .notNull()
      .references(() => kazanim.id, { onDelete: 'cascade' }),
    /** tam | kismi */
    kapsama: text('kapsama').notNull().default('tam'),
  },
  (t) => [uniqueIndex('ux_konu_kazanim').on(t.konuId, t.kazanimId)],
)

export const onKosul = sqliteTable(
  'on_kosul',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    gerekenKonuId: integer('gereken_konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    zorunlu: integer('zorunlu', { mode: 'boolean' }).notNull().default(true),
  },
  (t) => [uniqueIndex('ux_on_kosul').on(t.konuId, t.gerekenKonuId)],
)

export const kavram = sqliteTable(
  'kavram',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    alanId: integer('alan_id')
      .notNull()
      .references(() => alan.id, { onDelete: 'restrict' }),
    ad: text('ad').notNull(),
    adNorm: norm('ad_norm'),
    slug: text('slug').notNull().unique(),
    tanim: text('tanim').notNull().default(''),
    latex: text('latex'),
    medyaId: integer('medya_id'),
  },
  (t) => [index('ix_kavram_alan').on(t.alanId)],
)

export const konuKavram = sqliteTable(
  'konu_kavram',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    kavramId: integer('kavram_id')
      .notNull()
      .references(() => kavram.id, { onDelete: 'cascade' }),
    /** tanitilan | kullanilan */
    rol: text('rol').notNull().default('kullanilan'),
  },
  (t) => [uniqueIndex('ux_konu_kavram').on(t.konuId, t.kavramId)],
)

export const formul = sqliteTable(
  'formul',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    ad: text('ad').notNull(),
    latex: text('latex').notNull(),
    aciklama: text('aciklama').notNull().default(''),
    sira: integer('sira').notNull().default(0),
  },
  (t) => [index('ix_formul_konu').on(t.konuId)],
)
