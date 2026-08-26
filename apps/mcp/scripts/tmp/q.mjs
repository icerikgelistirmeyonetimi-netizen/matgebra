import Database from 'better-sqlite3'
const db = new Database('db/matgebra.db', { readonly: true })
const rows = db.prepare(`
  select s.seviye, a.slug as alan, k.slug, k.ad, k.ozet,
         (select count(*) from sahne sh where sh.konu_id = k.id) as sahne
  from konu k
  join sinif s on s.id = k.sinif_id
  join alan a on a.id = k.alan_id
  where s.seviye >= 9
  order by s.seviye, a.slug, k.sira`).all()
for (const r of rows) console.log(`${r.seviye} ${r.alan.padEnd(9)} ${String(r.sahne)}  ${r.slug.padEnd(42)} ${r.ad}`)
