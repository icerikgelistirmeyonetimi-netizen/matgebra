import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import * as sema from './schema/index.js'

const buradan = dirname(fileURLToPath(import.meta.url))

/** Uygulama veritabani dosyasi. Uretilir, surum kontrolune girmez. */
export const VERITABANI_YOLU = resolve(buradan, '..', 'matgebra.db')

/** MEB kaynak veritabani. Salt okunur, hicbir kosulda yazilmaz. */
export const KAYNAK_VERITABANI_YOLU = resolve(buradan, '..', '..', 'veri', 'icerik.db')

export function veritabaniAc(yol: string = VERITABANI_YOLU) {
  const ham = new Database(yol)
  ham.pragma('journal_mode = WAL')
  ham.pragma('foreign_keys = ON')
  ham.pragma('busy_timeout = 5000')
  return { ham, db: drizzle(ham, { schema: sema, casing: 'snake_case' }) }
}

export function kaynakAc() {
  return new Database(KAYNAK_VERITABANI_YOLU, { readonly: true, fileMustExist: true })
}

export type Veritabani = ReturnType<typeof veritabaniAc>['db']
