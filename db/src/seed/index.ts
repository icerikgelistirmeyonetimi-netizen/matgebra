import { eq, sql } from 'drizzle-orm'
import { veritabaniAc } from '../baglanti.js'
import * as s from '../schema/index.js'
import { normalize, slugla } from '../metin.js'
import { KONULAR, konuSlug } from './konular.js'
import { ALANLAR, ARACLAR, MODULLER, STILLER } from './temel.js'
import { GERCEK_HAYAT_ORNEKLERI, SAHNELER } from './sahneler.js'
import { sahneYaz } from './sahneYaz.js'

/**
 * Tohumlama.
 *
 * Bizim urettigimiz taksonomi ve temel veriyi yazar. Yeniden calistirilabilir:
 * konular slug'a gore guncellenir, koprular ve on kosullar bastan kurulur.
 * Sahne, cizim ve ilerleme verisine dokunmaz.
 */

function main(): void {
  const { ham, db } = veritabaniAc()
  console.log('Tohumlama basliyor...\n')

  const kazanimId = new Map<string, number>()
  for (const k of db.select({ id: s.kazanim.id, kod: s.kazanim.kod }).from(s.kazanim).all()) {
    kazanimId.set(k.kod, k.id)
  }

  const sinifId = new Map<number, number>()
  for (const si of db.select({ id: s.sinif.id, seviye: s.sinif.seviye }).from(s.sinif).all()) {
    sinifId.set(si.seviye, si.id)
  }

  const eksikKazanim: string[] = []
  const eksikSinif = new Set<number>()
  const eksikOnKosul: string[] = []

  const tohumla = ham.transaction(() => {
    // --- alanlar
    const alanId = new Map<string, number>()
    for (const a of ALANLAR) {
      db.insert(s.alan)
        .values({ ...a })
        .onConflictDoUpdate({ target: s.alan.slug, set: { ad: a.ad, renkAnahtari: a.renkAnahtari } })
        .run()
      const satir = db.select({ id: s.alan.id }).from(s.alan).where(eq(s.alan.slug, a.slug)).get()
      alanId.set(a.slug, satir!.id)
    }

    // --- stiller
    for (const st of STILLER) {
      db.insert(s.stil)
        .values({ ...st })
        .onConflictDoUpdate({ target: s.stil.ad, set: { rol: st.rol, kalinlik: st.kalinlik, opaklik: st.opaklik } })
        .run()
    }

    // --- araclar
    for (const a of ARACLAR) {
      db.insert(s.arac)
        .values({ ...a, kisayol: 'kisayol' in a ? a.kisayol : null })
        .onConflictDoUpdate({
          target: s.arac.anahtar,
          set: { etiket: a.etiket, grup: a.grup, minSinif: a.minSinif, sira: a.sira },
        })
        .run()
    }

    // --- moduller
    for (const m of MODULLER) {
      db.insert(s.modul)
        .values({ ...m })
        .onConflictDoUpdate({ target: s.modul.slug, set: { ad: m.ad, surum: m.surum, sira: m.sira } })
        .run()
    }

    // --- yerel kullanici (kimlik dogrulama yok; tek kayit)
    const varMi = db.select({ id: s.kullanici.id }).from(s.kullanici).limit(1).get()
    if (!varMi) {
      db.insert(s.kullanici).values({ ad: 'Yerel kullanıcı', rol: 'ogretmen' }).run()
    }

    // --- konular
    const konuId = new Map<string, number>()
    KONULAR.forEach((k, i) => {
      const sId = sinifId.get(k.sinif)
      if (!sId) {
        eksikSinif.add(k.sinif)
        return
      }
      const slug = konuSlug(k.sinif, k.ad, slugla)
      db.insert(s.konu)
        .values({
          alanId: alanId.get(k.alan)!,
          sinifId: sId,
          ad: k.ad,
          adNorm: normalize(k.ad),
          slug,
          ozet: k.ozet,
          sira: i,
          zorluk: k.zorluk ?? 2,
          durum: 'yayin',
        })
        .onConflictDoUpdate({
          target: s.konu.slug,
          set: {
            alanId: alanId.get(k.alan)!,
            sinifId: sId,
            ad: k.ad,
            adNorm: normalize(k.ad),
            ozet: k.ozet,
            sira: i,
            zorluk: k.zorluk ?? 2,
            guncelleme: sql`(datetime('now'))`,
          },
        })
        .run()
      const satir = db.select({ id: s.konu.id }).from(s.konu).where(eq(s.konu.slug, slug)).get()
      konuId.set(slug, satir!.id)
    })

    // --- kazanim koprusu ve on kosullar bastan kurulur
    db.delete(s.konuKazanim).run()
    db.delete(s.onKosul).run()

    for (const k of KONULAR) {
      const slug = konuSlug(k.sinif, k.ad, slugla)
      const kId = konuId.get(slug)
      if (!kId) continue

      for (const kod of k.kazanimlar) {
        const kazId = kazanimId.get(kod)
        if (!kazId) {
          eksikKazanim.push(`${slug} -> ${kod}`)
          continue
        }
        db.insert(s.konuKazanim).values({ konuId: kId, kazanimId: kazId, kapsama: 'tam' }).run()
      }

      for (const gereken of k.onKosul ?? []) {
        const gId = konuId.get(gereken)
        if (!gId) {
          eksikOnKosul.push(`${slug} -> ${gereken}`)
          continue
        }
        db.insert(s.onKosul).values({ konuId: kId, gerekenKonuId: gId, zorunlu: true }).run()
      }
    }

    return konuId
  })

  const konuId = tohumla()

  // --- sahneler (konular yazildiktan sonra: sahne konuya baglidir)
  let sahneSayisi = 0
  let nesneSayisi = 0
  let adimSayisi = 0
  const sahneHatalari: string[] = []

  const sahneleriYaz = ham.transaction(() => {
    for (const sahne of SAHNELER) {
      try {
        const sonuc = sahneYaz(db, sahne)
        sahneSayisi++
        nesneSayisi += sonuc.nesne
        adimSayisi += sonuc.adim
      } catch (e) {
        sahneHatalari.push(`${sahne.slug}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    db.delete(s.gercekHayatOrnegi).run()
    for (const ornek of GERCEK_HAYAT_ORNEKLERI) {
      const konu = db
        .select({ id: s.konu.id })
        .from(s.konu)
        .where(eq(s.konu.slug, ornek.konuSlug))
        .get()
      const sahne = db
        .select({ id: s.sahne.id })
        .from(s.sahne)
        .where(eq(s.sahne.slug, ornek.sahneSlug))
        .get()
      if (!konu || !sahne) {
        sahneHatalari.push(`ornek ${ornek.sahneSlug}: konu ya da sahne bulunamadi`)
        continue
      }
      db.insert(s.gercekHayatOrnegi)
        .values({
          konuId: konu.id,
          sahneId: sahne.id,
          baslik: ornek.baslik,
          hikaye: ornek.hikaye,
          soru: ornek.soru,
          olcekAciklama: ornek.olcekAciklama,
          kaynak: ornek.kaynak,
          yasAraligi: ornek.yasAraligi,
          durum: 'yayin',
        })
        .run()
    }
  })
  sahneleriYaz()

  // --- konu arama dizini
  ham.exec('DELETE FROM konu_fts')
  ham
    .prepare(
      `INSERT INTO konu_fts(rowid, ad, ozet, alan, sinif)
       SELECT k.id, k.ad_norm, k.ozet, a.slug, si.seviye
       FROM konu k JOIN alan a ON a.id = k.alan_id JOIN sinif si ON si.id = k.sinif_id`,
    )
    .run()

  // --- on kosul grafiginde dongu var mi
  const kenarlar = db
    .select({ konu: s.onKosul.konuId, gereken: s.onKosul.gerekenKonuId })
    .from(s.onKosul)
    .all()
  const dongu = donguBul(kenarlar)

  // --- kapsama raporu
  const toplamHedef = db
    .select({ n: sql<number>`count(*)` })
    .from(s.kazanim)
    .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
    .where(sql`${s.tema.alanSlug} is not null`)
    .get()!.n

  const kapsanan = db
    .select({ n: sql<number>`count(distinct ${s.konuKazanim.kazanimId})` })
    .from(s.konuKazanim)
    .get()!.n

  console.log(`alan          : ${ALANLAR.length}`)
  console.log(`stil          : ${STILLER.length}`)
  console.log(`arac          : ${ARACLAR.length}`)
  console.log(`modul         : ${MODULLER.length}`)
  console.log(`konu          : ${konuId.size}`)
  console.log(`on kosul      : ${kenarlar.length}`)
  console.log(`sahne         : ${sahneSayisi}  (${nesneSayisi} nesne, ${adimSayisi} adim)`)
  console.log(`gercek hayat  : ${GERCEK_HAYAT_ORNEKLERI.length}`)
  console.log(`\nkazanim kapsamasi: ${kapsanan}/${toplamHedef}`)

  if (kapsanan < toplamHedef) {
    const acikta = db
      .select({ kod: s.kazanim.kod })
      .from(s.kazanim)
      .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
      .where(
        sql`${s.tema.alanSlug} is not null and ${s.kazanim.id} not in (select kazanim_id from konu_kazanim)`,
      )
      .all()
    console.log(`  kapsanmayan: ${acikta.map((a) => a.kod).join(', ')}`)
  }

  if (eksikSinif.size) console.log(`\nUYARI eksik sinif: ${[...eksikSinif].join(', ')}`)
  if (eksikKazanim.length) console.log(`UYARI bulunamayan kazanim kodu:\n  ${eksikKazanim.join('\n  ')}`)
  if (eksikOnKosul.length) console.log(`UYARI bulunamayan on kosul:\n  ${eksikOnKosul.join('\n  ')}`)
  if (dongu) console.log(`UYARI on kosul grafiginde dongu: ${dongu.join(' -> ')}`)
  if (sahneHatalari.length) {
    console.log('UYARI sahne:')
    for (const h of sahneHatalari) console.log('  ' + h)
  }
  if (!eksikSinif.size && !eksikKazanim.length && !eksikOnKosul.length && !dongu && !sahneHatalari.length) {
    console.log('\nTum baglar dogrulandi.')
  }

  ham.close()
}

/** On kosul grafiginde dongu arar; bulursa dongudeki konu id dizisini dondurur. */
function donguBul(kenarlar: Array<{ konu: number; gereken: number }>): number[] | null {
  const komsu = new Map<number, number[]>()
  for (const k of kenarlar) {
    const liste = komsu.get(k.konu) ?? []
    liste.push(k.gereken)
    komsu.set(k.konu, liste)
  }
  const durum = new Map<number, 'gri' | 'siyah'>()
  let sonuc: number[] | null = null

  const gez = (d: number, yol: number[]): void => {
    if (sonuc) return
    const s = durum.get(d)
    if (s === 'siyah') return
    if (s === 'gri') {
      sonuc = [...yol, d]
      return
    }
    durum.set(d, 'gri')
    for (const k of komsu.get(d) ?? []) gez(k, [...yol, d])
    durum.set(d, 'siyah')
  }
  for (const d of komsu.keys()) gez(d, [])
  return sonuc
}

main()
