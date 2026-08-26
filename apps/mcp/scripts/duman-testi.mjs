/**
 * MCP sunucusu duman testi.
 *
 * Sunucuyu gercekten stdio uzerinden konusturur: araclari listeler, okuma
 * araclarini calistirir, salt okunur korumasini dener ve sahne gidis-donusunu
 * dogrular. Yazma araclari veritabanini degistirdigi icin burada cagrilmaz.
 *
 * Calistir: npm run duman -w @matgebra/mcp
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

const istemci = new Client({ name: 'duman-testi', version: '1' })
await istemci.connect(
  new StdioClientTransport({
    command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['tsx', 'apps/mcp/src/main.ts'],
    cwd: kok,
  }),
)

const cagir = async (ad, girdi = {}) => {
  const y = await istemci.callTool({ name: ad, arguments: girdi })
  return { hata: Boolean(y.isError), govde: y.content?.[0]?.text ?? '' }
}

const { tools } = await istemci.listTools()
console.log(`ARAC SAYISI: ${tools.length}`)
console.log(tools.map((t) => `  ${t.name.padEnd(20)} ${t.title ?? ''}`).join('\n'))

console.log('\n--- kazanim_ara: 5. sinif, "cember" ---')
console.log((await cagir('kazanim_ara', { sinif: 5, metin: 'cember' })).govde.slice(0, 380))

console.log('\n--- kapsama_raporu ---')
const rapor = JSON.parse((await cagir('kapsama_raporu')).govde)
console.log('kazanim kapsamasi:', rapor.kazanimKapsamasi, '| sahnesiz konu:', rapor.sahnesizKonuSayisi)

console.log('\n--- sql_sorgu: yazma reddedilmeli ---')
console.log(await cagir('sql_sorgu', { sorgu: 'DELETE FROM konu' }))

console.log('\n--- sql_sorgu: okuma ---')
console.log(
  (await cagir('sql_sorgu', {
    sorgu: 'select tip, count(*) n from nesne group by tip order by n desc limit 4',
  })).govde.replace(/\s+/g, ' ').slice(0, 220),
)

console.log('\n--- sahne_getir -> sahne_dogrula (gidis donus) ---')
const sahne = JSON.parse((await cagir('sahne_getir', { slug: 'cini-deseni-altigen' })).govde)
console.log((await cagir('sahne_dogrula', { sahne })).govde.replace(/\s+/g, ' '))

console.log('\n--- bozuk sahne yakalanmali ---')
const bozuk = structuredClone(sahne)
bozuk.nesneler[3].bagimliliklar[0].kaynak = 'YOK'
bozuk.adimlar[0].vurgu = ['hayalet']
bozuk.nesneler[1].parametreler[0].deger = 999
console.log((await cagir('sahne_dogrula', { sahne: bozuk })).govde.replace(/\s+/g, ' '))

await istemci.close()
