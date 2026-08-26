import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { izlemeAlanlari } from './ortak.js'
import { konu } from './taksonomi.js'
import { sahne } from './sahne.js'

/**
 * Olasilik laboratuvari.
 * Deney bir sahne turudur; kosumlar tohumla tekrar edilebilir olsun diye
 * kaydedilir - ayni tohum ayni sonucu verir, ders tekrar edilebilir.
 */

export const deney = sqliteTable(
  'deney',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    /** zar | para | cark | torba | kart | ozel */
    tur: text('tur').notNull(),
    ad: text('ad').notNull(),
    slug: text('slug').notNull().unique(),
    aciklama: text('aciklama').notNull().default(''),
    /** Ardisik denemeler birbirinden bagimsiz mi. */
    bagimsizMi: integer('bagimsiz_mi', { mode: 'boolean' }).notNull().default(true),
    /** Torba deneylerinde cekilen geri konuyor mu. */
    iadeVarMi: integer('iade_var_mi', { mode: 'boolean' }).notNull().default(true),
    ...izlemeAlanlari,
  },
  (t) => [index('ix_deney_konu').on(t.konuId)],
)

export const deneySonuc = sqliteTable(
  'deney_sonuc',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deneyId: integer('deney_id')
      .notNull()
      .references(() => deney.id, { onDelete: 'cascade' }),
    /** Sonuc uzayinin bir elemani: "1", "yazi", "kirmizi". */
    sonuc: text('sonuc').notNull(),
    /** Adil deneyde hepsi 1; hileli zarda farklilasir. */
    agirlik: real('agirlik').notNull().default(1),
    renkAnahtari: text('renk_anahtari').notNull().default('gok'),
    sira: integer('sira').notNull().default(0),
  },
  (t) => [uniqueIndex('ux_deney_sonuc').on(t.deneyId, t.sonuc)],
)

export const olay = sqliteTable(
  'olay',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deneyId: integer('deney_id')
      .notNull()
      .references(() => deney.id, { onDelete: 'cascade' }),
    ad: text('ad').notNull(),
    /** Hangi sonuclarin bu olaya dahil oldugu (JSON kosul nesnesi). */
    kosulJson: text('kosul_json').notNull().default('{}'),
    /** Teorik olasilik - deneysel sonucla karsilastirilir. */
    beklenenOlasilik: real('beklenen_olasilik'),
  },
  (t) => [index('ix_olay_deney').on(t.deneyId)],
)

export const deneyKosum = sqliteTable(
  'deney_kosum',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deneyId: integer('deney_id')
      .notNull()
      .references(() => deney.id, { onDelete: 'cascade' }),
    sahneId: integer('sahne_id').references(() => sahne.id, { onDelete: 'set null' }),
    /** Ayni tohum ayni sonuc dizisini uretir. */
    tohum: integer('tohum').notNull(),
    denemeSayisi: integer('deneme_sayisi').notNull(),
    /** Sonuc sayimlari: { "1": 17, "2": 14, ... } */
    sonucJson: text('sonuc_json').notNull().default('{}'),
    zaman: text('zaman').notNull().default(''),
  },
  (t) => [index('ix_kosum_deney').on(t.deneyId)],
)
