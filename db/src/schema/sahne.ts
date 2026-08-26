import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { izlemeAlanlari } from './ortak.js'
import { konu } from './taksonomi.js'

/**
 * Sahne cekirdegi.
 * nesne + nesne_bagimlilik + nesne_parametre ucLusu motor bagimsizdir:
 * "C noktasi, A ve B'den gecen dogrunun uzerinde" bicimindedir.
 * Motoru degistirsek de bu veri gecerli kalir.
 */

export const stil = sqliteTable('stil', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ad: text('ad').notNull().unique(),
  /** Palet rolu: nane | lavanta | seftali | gok | gul | tereyagi | notr */
  rol: text('rol').notNull().default('gok'),
  dolgu: text('dolgu'),
  kenar: text('kenar'),
  kalinlik: real('kalinlik').notNull().default(2),
  opaklik: real('opaklik').notNull().default(1),
  cizgiTipi: text('cizgi_tipi').notNull().default('duz'),
  noktaBoyutu: real('nokta_boyutu').notNull().default(4),
})

export const sahne = sqliteTable(
  'sahne',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    /** kesif | gercek_hayat | insa | olasilik | bos_tuval */
    tur: text('tur').notNull(),
    baslik: text('baslik').notNull(),
    slug: text('slug').notNull().unique(),
    ozet: text('ozet').notNull().default(''),
    zorluk: integer('zorluk').notNull().default(2),
    sira: integer('sira').notNull().default(0),
    ...izlemeAlanlari,
  },
  (t) => [index('ix_sahne_konu').on(t.konuId), index('ix_sahne_tur').on(t.tur)],
)

export const sahneAyar = sqliteTable('sahne_ayar', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sahneId: integer('sahne_id')
    .notNull()
    .unique()
    .references(() => sahne.id, { onDelete: 'cascade' }),
  /** yok | izgara | tam - 1-3. sinifta eksen gosterilmez. */
  eksenModu: text('eksen_modu').notNull().default('tam'),
  sinirX1: real('sinir_x1').notNull().default(-10),
  sinirY1: real('sinir_y1').notNull().default(10),
  sinirX2: real('sinir_x2').notNull().default(10),
  sinirY2: real('sinir_y2').notNull().default(-10),
  izgaraAdimi: real('izgara_adimi').notNull().default(1),
  birim: text('birim').notNull().default(''),
  yapisma: text('yapisma').notNull().default('izgara'),
  oranKilidi: integer('oran_kilidi', { mode: 'boolean' }).notNull().default(true),
  arkaPlanMedyaId: integer('arka_plan_medya_id'),
  /** Gercek dunya olcegi: iki referans nokta + gercek uzunluk. */
  olcekJson: text('olcek_json'),
})

export const nesne = sqliteTable(
  'nesne',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sahneId: integer('sahne_id')
      .notNull()
      .references(() => sahne.id, { onDelete: 'cascade' }),
    /** Sahne icinde benzersiz insan okunur ad: A, d1, cember_c. */
    ad: text('ad').notNull(),
    tip: text('tip').notNull(),
    etiket: text('etiket'),
    sira: integer('sira').notNull().default(0),
    katman: integer('katman').notNull().default(0),
    gorunur: integer('gorunur', { mode: 'boolean' }).notNull().default(true),
    kilitli: integer('kilitli', { mode: 'boolean' }).notNull().default(false),
    /** yok | serbest | x | y | uzerinde */
    surukleme: text('surukleme').notNull().default('yok'),
    stilId: integer('stil_id').references(() => stil.id, { onDelete: 'set null' }),
  },
  (t) => [
    uniqueIndex('ux_nesne_sahne_ad').on(t.sahneId, t.ad),
    index('ix_nesne_sahne').on(t.sahneId),
  ],
)

export const nesneParametre = sqliteTable(
  'nesne_parametre',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nesneId: integer('nesne_id')
      .notNull()
      .references(() => nesne.id, { onDelete: 'cascade' }),
    anahtar: text('anahtar').notNull(),
    deger: text('deger').notNull(),
    /** sayi | metin | mantik | ifade */
    tur: text('tur').notNull().default('sayi'),
  },
  (t) => [uniqueIndex('ux_parametre').on(t.nesneId, t.anahtar)],
)

export const nesneBagimlilik = sqliteTable(
  'nesne_bagimlilik',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nesneId: integer('nesne_id')
      .notNull()
      .references(() => nesne.id, { onDelete: 'cascade' }),
    kaynakNesneId: integer('kaynak_nesne_id')
      .notNull()
      .references(() => nesne.id, { onDelete: 'cascade' }),
    rol: text('rol').notNull(),
    sira: integer('sira').notNull().default(0),
  },
  (t) => [index('ix_bagimlilik_nesne').on(t.nesneId)],
)

export const adim = sqliteTable(
  'adim',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sahneId: integer('sahne_id')
      .notNull()
      .references(() => sahne.id, { onDelete: 'cascade' }),
    sira: integer('sira').notNull(),
    baslik: text('baslik').notNull(),
    anlatim: text('anlatim').notNull(),
    /** Bu adimda vurgulanacak nesne adlari (JSON dizi). */
    vurguJson: text('vurgu_json').notNull().default('[]'),
    aksiyonJson: text('aksiyon_json'),
    beklenenJson: text('beklenen_json'),
  },
  (t) => [uniqueIndex('ux_adim_sahne_sira').on(t.sahneId, t.sira)],
)

export const gercekHayatOrnegi = sqliteTable(
  'gercek_hayat_ornegi',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    sahneId: integer('sahne_id').references(() => sahne.id, { onDelete: 'set null' }),
    baslik: text('baslik').notNull(),
    hikaye: text('hikaye').notNull(),
    soru: text('soru').notNull().default(''),
    medyaId: integer('medya_id'),
    olcekAciklama: text('olcek_aciklama').notNull().default(''),
    kaynak: text('kaynak').notNull().default(''),
    yasAraligi: text('yas_araligi').notNull().default(''),
    ...izlemeAlanlari,
  },
  (t) => [index('ix_ornek_konu').on(t.konuId)],
)

export const soru = sqliteTable(
  'soru',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    konuId: integer('konu_id')
      .notNull()
      .references(() => konu.id, { onDelete: 'cascade' }),
    sahneId: integer('sahne_id').references(() => sahne.id, { onDelete: 'set null' }),
    tip: text('tip').notNull(),
    govde: text('govde').notNull(),
    latex: text('latex'),
    secenekJson: text('secenek_json'),
    cevapJson: text('cevap_json').notNull().default('{}'),
    ipucu: text('ipucu').notNull().default(''),
    cozum: text('cozum').notNull().default(''),
    zorluk: integer('zorluk').notNull().default(2),
    puan: integer('puan').notNull().default(1),
    ...izlemeAlanlari,
  },
  (t) => [index('ix_soru_konu').on(t.konuId), index('ix_soru_sahne').on(t.sahneId)],
)

export const varyant = sqliteTable(
  'varyant',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    soruId: integer('soru_id')
      .notNull()
      .references(() => soru.id, { onDelete: 'cascade' }),
    tohum: integer('tohum').notNull(),
    parametreJson: text('parametre_json').notNull().default('{}'),
  },
  (t) => [uniqueIndex('ux_varyant').on(t.soruId, t.tohum)],
)

/** Arac cubugu kayit defteri. Araclar sinif seviyesine gore suzulur. */
export const arac = sqliteTable('arac', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  anahtar: text('anahtar').notNull().unique(),
  etiket: text('etiket').notNull(),
  grup: text('grup').notNull(),
  ikon: text('ikon').notNull().default('nokta'),
  minSinif: integer('min_sinif').notNull().default(1),
  kisayol: text('kisayol'),
  sira: integer('sira').notNull().default(0),
  aktif: integer('aktif', { mode: 'boolean' }).notNull().default(true),
})
