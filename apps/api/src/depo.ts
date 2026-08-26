import { and, asc, eq, inArray, sql } from 'drizzle-orm'
import { sema, veritabaniAc } from '@matgebra/db'
import { normalize } from '@matgebra/db'

/**
 * Depo (repository) katmani.
 *
 * Rotalar SQL bilmez; buradaki fonksiyonlari cagirir. Boylece sorgular tek
 * yerde toplanir ve MCP sunucusu ayni fonksiyonlari yeniden kullanabilir.
 */

const { ham, db } = veritabaniAc()
const s = sema

export function kapat(): void {
  ham.close()
}

/** Kademe -> sinif agaci; her sinifta alan basina konu sayisi. */
export function kademeAgaci() {
  const kademeler = db.select().from(s.kademe).orderBy(asc(s.kademe.sira)).all()
  const siniflar = db
    .select({
      id: s.sinif.id,
      kademeId: s.sinif.kademeId,
      seviye: s.sinif.seviye,
      ad: s.sinif.ad,
      slug: s.sinif.slug,
    })
    .from(s.sinif)
    .orderBy(asc(s.sinif.seviye))
    .all()

  const sayimlar = db
    .select({
      sinifId: s.konu.sinifId,
      alan: s.alan.slug,
      adet: sql<number>`count(*)`,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .groupBy(s.konu.sinifId, s.alan.slug)
    .all()

  return kademeler.map((k) => ({
    ...k,
    siniflar: siniflar
      .filter((si) => si.kademeId === k.id)
      .map((si) => ({
        ...si,
        konuSayisi: Object.fromEntries(
          sayimlar.filter((c) => c.sinifId === si.id).map((c) => [c.alan, c.adet]),
        ) as Record<string, number>,
      })),
  }))
}

export function alanlar() {
  return db.select().from(s.alan).orderBy(asc(s.alan.sira)).all()
}

/** Bir sinifin konulari; alan slug'i ile suzulebilir. */
export function konular(seviye: number, alanSlug?: string) {
  const kosullar = [eq(s.sinif.seviye, seviye)]
  if (alanSlug) kosullar.push(eq(s.alan.slug, alanSlug))

  const satirlar = db
    .select({
      id: s.konu.id,
      ad: s.konu.ad,
      slug: s.konu.slug,
      ozet: s.konu.ozet,
      zorluk: s.konu.zorluk,
      sira: s.konu.sira,
      durum: s.konu.durum,
      alan: s.alan.slug,
      alanAd: s.alan.ad,
      seviye: s.sinif.seviye,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(and(...kosullar))
    .orderBy(asc(s.konu.sira))
    .all()

  if (satirlar.length === 0) return []

  const idler = satirlar.map((k) => k.id)
  const sahneSayimi = db
    .select({ konuId: s.sahne.konuId, adet: sql<number>`count(*)` })
    .from(s.sahne)
    .where(inArray(s.sahne.konuId, idler))
    .groupBy(s.sahne.konuId)
    .all()
  const ornekSayimi = db
    .select({ konuId: s.gercekHayatOrnegi.konuId, adet: sql<number>`count(*)` })
    .from(s.gercekHayatOrnegi)
    .where(inArray(s.gercekHayatOrnegi.konuId, idler))
    .groupBy(s.gercekHayatOrnegi.konuId)
    .all()
  const kazanimSayimi = db
    .select({ konuId: s.konuKazanim.konuId, adet: sql<number>`count(*)` })
    .from(s.konuKazanim)
    .where(inArray(s.konuKazanim.konuId, idler))
    .groupBy(s.konuKazanim.konuId)
    .all()

  const bul = (liste: Array<{ konuId: number; adet: number }>, id: number) =>
    liste.find((x) => x.konuId === id)?.adet ?? 0

  return satirlar.map((k) => ({
    ...k,
    sahneSayisi: bul(sahneSayimi, k.id),
    ornekSayisi: bul(ornekSayimi, k.id),
    kazanimSayisi: bul(kazanimSayimi, k.id),
  }))
}

/** Tek konunun tam ayrintisi: kazanimlar, maddeler, on kosullar, sahneler. */
export function konu(slug: string) {
  const temel = db
    .select({
      id: s.konu.id,
      ad: s.konu.ad,
      slug: s.konu.slug,
      ozet: s.konu.ozet,
      zorluk: s.konu.zorluk,
      durum: s.konu.durum,
      alan: s.alan.slug,
      alanAd: s.alan.ad,
      seviye: s.sinif.seviye,
      sinifAd: s.sinif.ad,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(eq(s.konu.slug, slug))
    .get()

  if (!temel) return null

  const kazanimlar = db
    .select({
      id: s.kazanim.id,
      kod: s.kazanim.kod,
      metin: s.kazanim.metin,
      temaAd: s.tema.ad,
      temaKod: s.tema.kod,
      temaOzet: s.tema.ozet,
      dersSaati: s.tema.dersSaati,
    })
    .from(s.konuKazanim)
    .innerJoin(s.kazanim, eq(s.kazanim.id, s.konuKazanim.kazanimId))
    .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
    .where(eq(s.konuKazanim.konuId, temel.id))
    .orderBy(asc(s.kazanim.kod))
    .all()

  const maddeler = kazanimlar.length
    ? db
        .select()
        .from(s.kazanimMaddesi)
        .where(
          inArray(
            s.kazanimMaddesi.kazanimId,
            kazanimlar.map((k) => k.id),
          ),
        )
        .orderBy(asc(s.kazanimMaddesi.sira))
        .all()
    : []

  const gerekenler = db
    .select({ ad: s.konu.ad, slug: s.konu.slug, seviye: s.sinif.seviye, alan: s.alan.slug })
    .from(s.onKosul)
    .innerJoin(s.konu, eq(s.konu.id, s.onKosul.gerekenKonuId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .where(eq(s.onKosul.konuId, temel.id))
    .all()

  const sonrakiler = db
    .select({ ad: s.konu.ad, slug: s.konu.slug, seviye: s.sinif.seviye, alan: s.alan.slug })
    .from(s.onKosul)
    .innerJoin(s.konu, eq(s.konu.id, s.onKosul.konuId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .where(eq(s.onKosul.gerekenKonuId, temel.id))
    .all()

  const sahneler = db
    .select({
      id: s.sahne.id,
      slug: s.sahne.slug,
      baslik: s.sahne.baslik,
      tur: s.sahne.tur,
      ozet: s.sahne.ozet,
      zorluk: s.sahne.zorluk,
    })
    .from(s.sahne)
    .where(eq(s.sahne.konuId, temel.id))
    .orderBy(asc(s.sahne.sira))
    .all()

  const ornekler = db
    .select()
    .from(s.gercekHayatOrnegi)
    .where(eq(s.gercekHayatOrnegi.konuId, temel.id))
    .all()

  return {
    ...temel,
    kazanimlar: kazanimlar.map((k) => ({
      ...k,
      maddeler: maddeler.filter((m) => m.kazanimId === k.id),
    })),
    onKosullar: gerekenler,
    sonrakiKonular: sonrakiler,
    sahneler,
    ornekler,
  }
}

/** Sinif seviyesine gore suzulmus arac cubugu. */
export function araclar(seviye?: number) {
  const kosullar = [eq(s.arac.aktif, true)]
  if (typeof seviye === 'number') kosullar.push(sql`${s.arac.minSinif} <= ${seviye}`)
  return db
    .select()
    .from(s.arac)
    .where(and(...kosullar))
    .orderBy(asc(s.arac.sira))
    .all()
}

export function stiller() {
  return db.select().from(s.stil).orderBy(asc(s.stil.ad)).all()
}

export function moduller() {
  return db.select().from(s.modul).where(eq(s.modul.aktif, true)).orderBy(asc(s.modul.sira)).all()
}

/**
 * Komut paleti aramasi: konu ve kazanimlarda tam metin.
 * Sorgu normalize edilir; boylece "acilar" da "Açılar" da eslesir.
 */
export function ara(sorgu: string, limit = 20) {
  const q = normalize(sorgu).trim()
  if (q.length < 2) return { konular: [], kazanimlar: [] }
  const kalip = q
    .split(/\s+/)
    .map((p) => `"${p.replace(/"/g, '')}"*`)
    .join(' ')

  const konuVurus = ham
    .prepare(
      `SELECT rowid AS id, rank FROM konu_fts WHERE konu_fts MATCH ? ORDER BY rank LIMIT ?`,
    )
    .all(kalip, limit) as Array<{ id: number }>

  const kazanimVurus = ham
    .prepare(
      `SELECT rowid AS id, rank FROM kazanim_fts WHERE kazanim_fts MATCH ? ORDER BY rank LIMIT ?`,
    )
    .all(kalip, limit) as Array<{ id: number }>

  const konuSonuc = konuVurus.length
    ? db
        .select({
          ad: s.konu.ad,
          slug: s.konu.slug,
          ozet: s.konu.ozet,
          alan: s.alan.slug,
          seviye: s.sinif.seviye,
        })
        .from(s.konu)
        .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
        .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
        .where(
          inArray(
            s.konu.id,
            konuVurus.map((v) => v.id),
          ),
        )
        .all()
    : []

  const kazanimSonuc = kazanimVurus.length
    ? db
        .select({
          kod: s.kazanim.kod,
          metin: s.kazanim.metin,
          temaAd: s.tema.ad,
          seviye: s.sinif.seviye,
          alan: s.tema.alanSlug,
        })
        .from(s.kazanim)
        .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
        .innerJoin(s.sinif, eq(s.sinif.id, s.tema.sinifId))
        .where(
          inArray(
            s.kazanim.id,
            kazanimVurus.map((v) => v.id),
          ),
        )
        .all()
    : []

  return { konular: konuSonuc, kazanimlar: kazanimSonuc }
}

/** Icerik uretiminin ilerleme gostergesi. */
export function kapsamaRaporu() {
  const satirlar = db
    .select({
      seviye: s.sinif.seviye,
      alan: s.alan.slug,
      konu: sql<number>`count(distinct ${s.konu.id})`,
      sahne: sql<number>`count(distinct ${s.sahne.id})`,
      ornek: sql<number>`count(distinct ${s.gercekHayatOrnegi.id})`,
    })
    .from(s.konu)
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .leftJoin(s.sahne, eq(s.sahne.konuId, s.konu.id))
    .leftJoin(s.gercekHayatOrnegi, eq(s.gercekHayatOrnegi.konuId, s.konu.id))
    .groupBy(s.sinif.seviye, s.alan.slug)
    .orderBy(asc(s.sinif.seviye))
    .all()

  const kazanim = db
    .select({
      hedef: sql<number>`count(*)`,
      kapsanan: sql<number>`sum(case when ${s.kazanim.id} in (select kazanim_id from konu_kazanim) then 1 else 0 end)`,
    })
    .from(s.kazanim)
    .innerJoin(s.tema, eq(s.tema.id, s.kazanim.temaId))
    .where(sql`${s.tema.alanSlug} is not null`)
    .get()

  return { siniflar: satirlar, kazanim }
}

/**
 * Tek sahnenin tam hali: ayar + nesneler + bagimlilik + parametre + adimlar.
 *
 * Bagimliliklar disariya nesne kimligiyle degil nesne adiyla verilir; arayuz
 * ve MCP ayni insan okunur dili kullansin diye. Sahne verisi motor bagimsiz
 * kalir: "C noktasi, merkezi O olan cemberin uzerinde".
 */
export function sahne(slug: string) {
  const temel = db
    .select({
      id: s.sahne.id,
      slug: s.sahne.slug,
      baslik: s.sahne.baslik,
      tur: s.sahne.tur,
      ozet: s.sahne.ozet,
      zorluk: s.sahne.zorluk,
      durum: s.sahne.durum,
      surum: s.sahne.surum,
      konuSlug: s.konu.slug,
      konuAd: s.konu.ad,
      alan: s.alan.slug,
      alanAd: s.alan.ad,
      seviye: s.sinif.seviye,
      sinifAd: s.sinif.ad,
    })
    .from(s.sahne)
    .innerJoin(s.konu, eq(s.konu.id, s.sahne.konuId))
    .innerJoin(s.alan, eq(s.alan.id, s.konu.alanId))
    .innerJoin(s.sinif, eq(s.sinif.id, s.konu.sinifId))
    .where(eq(s.sahne.slug, slug))
    .get()

  if (!temel) return null

  const ayarSatiri = db
    .select()
    .from(s.sahneAyar)
    .where(eq(s.sahneAyar.sahneId, temel.id))
    .get()

  const nesneler = db
    .select({
      id: s.nesne.id,
      ad: s.nesne.ad,
      tip: s.nesne.tip,
      etiket: s.nesne.etiket,
      sira: s.nesne.sira,
      katman: s.nesne.katman,
      gorunur: s.nesne.gorunur,
      kilitli: s.nesne.kilitli,
      surukleme: s.nesne.surukleme,
      stilRol: s.stil.rol,
      stilKalinlik: s.stil.kalinlik,
      stilOpaklik: s.stil.opaklik,
      stilCizgiTipi: s.stil.cizgiTipi,
      stilNoktaBoyutu: s.stil.noktaBoyutu,
    })
    .from(s.nesne)
    .leftJoin(s.stil, eq(s.stil.id, s.nesne.stilId))
    .where(eq(s.nesne.sahneId, temel.id))
    .orderBy(asc(s.nesne.sira))
    .all()

  const idler = nesneler.map((n) => n.id)
  const adIle = new Map(nesneler.map((n) => [n.id, n.ad]))

  const parametreler = idler.length
    ? db
        .select()
        .from(s.nesneParametre)
        .where(inArray(s.nesneParametre.nesneId, idler))
        .all()
    : []

  const bagimliliklar = idler.length
    ? db
        .select()
        .from(s.nesneBagimlilik)
        .where(inArray(s.nesneBagimlilik.nesneId, idler))
        .orderBy(asc(s.nesneBagimlilik.sira))
        .all()
    : []

  const adimlar = db
    .select()
    .from(s.adim)
    .where(eq(s.adim.sahneId, temel.id))
    .orderBy(asc(s.adim.sira))
    .all()

  const ornek = db
    .select()
    .from(s.gercekHayatOrnegi)
    .where(eq(s.gercekHayatOrnegi.sahneId, temel.id))
    .get()

  return {
    ...temel,
    ayar: {
      eksenModu: ayarSatiri?.eksenModu ?? 'tam',
      sinir: [
        ayarSatiri?.sinirX1 ?? -10,
        ayarSatiri?.sinirY1 ?? 10,
        ayarSatiri?.sinirX2 ?? 10,
        ayarSatiri?.sinirY2 ?? -10,
      ] as [number, number, number, number],
      izgaraAdimi: ayarSatiri?.izgaraAdimi ?? 1,
      birim: ayarSatiri?.birim ?? '',
      yapisma: ayarSatiri?.yapisma ?? 'izgara',
      oranKilidi: ayarSatiri?.oranKilidi ?? true,
      olcek: ayarSatiri?.olcekJson ? (JSON.parse(ayarSatiri.olcekJson) as unknown) : null,
    },
    nesneler: nesneler.map((n) => ({
      ad: n.ad,
      tip: n.tip,
      etiket: n.etiket,
      sira: n.sira,
      katman: n.katman,
      gorunur: n.gorunur,
      kilitli: n.kilitli,
      surukleme: n.surukleme,
      stil: {
        rol: n.stilRol ?? 'notr',
        kalinlik: n.stilKalinlik ?? 2,
        opaklik: n.stilOpaklik ?? 1,
        cizgiTipi: n.stilCizgiTipi ?? 'duz',
        noktaBoyutu: n.stilNoktaBoyutu ?? 4,
      },
      parametreler: parametreler
        .filter((p) => p.nesneId === n.id)
        .map((p) => ({ anahtar: p.anahtar, deger: p.deger, tur: p.tur })),
      bagimliliklar: bagimliliklar
        .filter((b) => b.nesneId === n.id)
        .map((b) => ({ kaynak: adIle.get(b.kaynakNesneId) ?? '', rol: b.rol, sira: b.sira })),
    })),
    adimlar: adimlar.map((a) => ({
      sira: a.sira,
      baslik: a.baslik,
      anlatim: a.anlatim,
      vurgu: JSON.parse(a.vurguJson) as string[],
    })),
    ornek: ornek
      ? {
          baslik: ornek.baslik,
          hikaye: ornek.hikaye,
          soru: ornek.soru,
          olcekAciklama: ornek.olcekAciklama,
          kaynak: ornek.kaynak,
        }
      : null,
  }
}
