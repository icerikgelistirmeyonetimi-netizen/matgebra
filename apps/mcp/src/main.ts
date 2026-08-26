import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import {
  ALANLAR,
  DENEY_TURLERI,
  NESNE_TIPLERI,
  SAHNE_TURLERI,
  SORU_TIPLERI,
  bagimlilikGrafiginiDogrula,
  deneySemasi,
  sahneSemasi,
  teorikOlasilik,
} from '@matgebra/core'
import { deneyYaz, sahneYaz } from '@matgebra/db'
import * as veri from './veri.js'

/**
 * Matgebra MCP sunucusu.
 *
 * Icerik uretiminin arayuzu. Amac tek cumlede: egitim icerigi dosyaya degil
 * veritabanina yazilsin. Bu sunucu ile konu, sahne, gercek hayat ornegi ve
 * soru dogrudan matgebra.db'ye islenir; uygulama ile ayni veriyi paylasir.
 *
 * Yazma yolu tohumlamayla ortaktir (sahneYaz), dogrulama @matgebra/core
 * icindeki sema ile yapilir. Boylece elle tohumlama ile arac uzerinden
 * uretim ayrisamaz.
 */

const sunucu = new McpServer({ name: 'matgebra', version: '0.1.0' })

const metin = (veri: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(veri, null, 2) }],
})

const hataMetni = (e: unknown) => ({
  isError: true,
  content: [
    { type: 'text' as const, text: e instanceof Error ? e.message : String(e) },
  ],
})

/* ------------------------------------------------------------------ okuma */

sunucu.registerTool(
  'sema_getir',
  {
    title: 'Şemayı getir',
    description:
      'Veritabanı şemasını verir: tablolar, kolonlar ve satır sayıları. Sahne ya da konu yazmadan önce yapıyı görmek için.',
    inputSchema: {},
  },
  async () => {
    try {
      return metin({
        tablolar: veri.semaOzeti(),
        nesneTipleri: NESNE_TIPLERI,
        sahneTurleri: SAHNE_TURLERI,
        deneyTurleri: DENEY_TURLERI,
        alanlar: ALANLAR,
        paletRolleri: veri.palet(),
      })
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'kazanim_ara',
  {
    title: 'Kazanım ara',
    description:
      'MEB Türkiye Yüzyılı Maarif Modeli kazanımlarında arar. Metin Türkçe normalize edilir: "acilar" yazınca "Açılar" bulunur. Her kazanım alt maddeleriyle ve onu kapsayan konularla döner.',
    inputSchema: {
      sinif: z.number().int().min(0).max(12).optional().describe('Sınıf seviyesi; hazırlık = 0'),
      alan: z.enum(ALANLAR).optional(),
      metin: z.string().optional().describe('Kazanım metninde ya da kodunda aranacak ifade'),
      limit: z.number().int().min(1).max(200).optional(),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.kazanimAra(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'konu_listele',
  {
    title: 'Konuları listele',
    description:
      'Öğretim taksonomisini listeler. Her konunun kapsadığı kazanımlar ile sahne, örnek ve soru sayıları görünür — neyin eksik olduğu buradan okunur.',
    inputSchema: {
      sinif: z.number().int().min(0).max(12).optional(),
      alan: z.enum(ALANLAR).optional(),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.konuListele(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'sahne_getir',
  {
    title: 'Sahneyi getir',
    description:
      'Sahneyi yazım biçiminde döndürür. Çıktı doğrudan sahne_yaz aracına geri verilebilir; var olan bir sahneyi örnek alarak yenisini kurmak için en kısa yol.',
    inputSchema: { slug: z.string().describe('Sahne slug değeri') },
  },
  async ({ slug }) => {
    try {
      const sahne = veri.sahneGetir(slug)
      return sahne ? metin(sahne) : hataMetni(new Error(`Sahne bulunamadı: ${slug}`))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'kapsama_raporu',
  {
    title: 'Kapsama raporu',
    description:
      'İçerik üretiminin ilerleme göstergesi: kaç kazanım kapsandı, hangi sınıfta kaç sahne ve gerçek hayat örneği var, hangi konuların hiç sahnesi yok.',
    inputSchema: {},
  },
  async () => {
    try {
      return metin(veri.kapsamaRaporu())
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'sql_sorgu',
  {
    title: 'SQL sorgusu (salt okunur)',
    description:
      'Veritabanında salt okunur SQL çalıştırır. Yalnızca SELECT ve WITH kabul edilir; yazma ifadeleri reddedilir. Rapor ve çapraz kontrol için.',
    inputSchema: {
      sorgu: z.string().describe('SELECT ya da WITH ile başlayan sorgu'),
      limit: z.number().int().min(1).max(1000).optional(),
    },
  },
  async ({ sorgu, limit }) => {
    try {
      return metin(veri.sqlSorgu(sorgu, limit))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

/* ------------------------------------------------------------------ yazma */

sunucu.registerTool(
  'konu_yaz',
  {
    title: 'Konu ekle veya güncelle',
    description:
      'Öğretim konusu yazar ve MEB kazanımlarıyla köprüsünü, ön koşullarını kurar. Aynı slug ile yeniden çağrılırsa günceller. Bulunamayan kazanım kodları ve ön koşullar yanıtta bildirilir; sessizce yutulmaz.',
    inputSchema: {
      sinif: z.number().int().min(0).max(12),
      alan: z.enum(ALANLAR),
      ad: z.string().min(2).max(120),
      ozet: z.string().min(10).describe('Konunun ne öğrettiğini anlatan bir iki cümle'),
      kazanimlar: z.array(z.string()).describe('MEB kazanım kodları, örn. MAT.5.3.1'),
      onKosul: z.array(z.string()).optional().describe('Önce öğrenilmesi gereken konu slugları'),
      zorluk: z.number().int().min(1).max(5).optional(),
      slug: z.string().optional().describe('Verilmezse addan üretilir: s5-acilari-olcme'),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.konuYaz(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'sahne_dogrula',
  {
    title: 'Sahneyi doğrula',
    description:
      'Sahneyi yazmadan denetler: şema uygunluğu, bağımlılık grafiğinde döngü ve tanımsız kaynak, konunun varlığı, noktaların sınır kutusu içinde kalması. Yazmadan önce buradan geçirin.',
    inputSchema: { sahne: sahneSemasi },
  },
  async ({ sahne }) => {
    try {
      const hatalar = bagimlilikGrafiginiDogrula(sahne.nesneler)
      const uyarilar: string[] = []

      if (!veri.konuVarMi(sahne.konuSlug)) {
        hatalar.push(`Konu bulunamadı: ${sahne.konuSlug}`)
      }

      const [solX, ustY, sagX, altY] = sahne.ayar.sinir
      for (const n of sahne.nesneler) {
        const x = n.parametreler.find((p) => p.anahtar === 'x')?.deger
        const y = n.parametreler.find((p) => p.anahtar === 'y')?.deger
        if (typeof x === 'number' && (x < solX || x > sagX)) {
          uyarilar.push(`${n.ad} ekran dışında: x=${x} (sınır ${solX}..${sagX})`)
        }
        if (typeof y === 'number' && (y < altY || y > ustY)) {
          uyarilar.push(`${n.ad} ekran dışında: y=${y} (sınır ${altY}..${ustY})`)
        }
      }

      const adimlar = sahne.adimlar.map((a) => a.sira)
      if (new Set(adimlar).size !== adimlar.length) hatalar.push('Adım sıraları yinelenmiş.')

      const adlar = new Set(sahne.nesneler.map((n) => n.ad))
      for (const a of sahne.adimlar) {
        for (const v of a.vurgu) {
          if (!adlar.has(v)) uyarilar.push(`Adım ${a.sira}: vurgulanan nesne yok — ${v}`)
        }
      }

      return metin({ gecerli: hatalar.length === 0, hatalar, uyarilar })
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'sahne_yaz',
  {
    title: 'Sahne yaz',
    description:
      'Sahneyi tek işlemde veritabanına yazar: ayar, nesneler, bağımlılıklar, parametreler ve adımlar. Aynı slug ile yeniden çağrılırsa içerik baştan kurulur ve sürüm artar. Nesneler motor değil geometri dilinde tanımlanır: "B noktası, merkezi O olan ve A\'dan geçen çemberin üzerinde".',
    inputSchema: { sahne: sahneSemasi },
  },
  async ({ sahne }) => {
    try {
      const sonuc = veri.ham.transaction(() => sahneYaz(veri.db, sahne))()
      return metin({ ...sonuc, slug: sahne.slug })
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'gercek_hayat_yaz',
  {
    title: 'Gerçek hayat örneği yaz',
    description:
      'Konuya (ve varsa sahneye) bağlı gerçek hayat anlatısı ekler. Konu ekranındaki "Gerçek hayat örneği" düğmesi bu kaydı ve bağlı sahneyi kullanır.',
    inputSchema: {
      konuSlug: z.string(),
      sahneSlug: z.string().optional(),
      baslik: z.string().min(3).max(160),
      hikaye: z.string().min(20),
      soru: z.string().optional(),
      olcekAciklama: z.string().optional().describe('Tahtadaki 1 birim gerçekte neye karşılık gelir'),
      kaynak: z.string().optional(),
      yasAraligi: z.string().optional(),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.gercekHayatYaz(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'soru_yaz',
  {
    title: 'Soru yaz',
    description: 'Konuya ya da sahneye bağlı soru ekler. Sahneye bağlı sorular ölçümleri tahtadan okuyabilir.',
    inputSchema: {
      konuSlug: z.string(),
      sahneSlug: z.string().optional(),
      tip: z.enum(SORU_TIPLERI),
      govde: z.string().min(5),
      cevap: z.unknown().describe('Tipe göre değişen cevap nesnesi'),
      secenekler: z.unknown().optional(),
      ipucu: z.string().optional(),
      cozum: z.string().optional(),
      zorluk: z.number().int().min(1).max(5).optional(),
      puan: z.number().int().min(1).max(20).optional(),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.soruYaz(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'deney_yaz',
  {
    title: 'Olasılık deneyi yaz',
    description:
      'Deneyi, sonuç uzayını ve olayları tek işlemde yazar. Her olayın teorik olasılığı yazma anında hesaplanıp saklanır; arayüz onu deneysel değerle yan yana gösterir. Ağırlıklar hileli zar gibi eşit olmayan durumları anlatır. cekimSayisi 2 verilirse iki zar atışı gibi bileşik deney olur; olay koşulları: toplam, toplam_en_az, hepsi_ayni, en_az_bir, hepsi.',
    inputSchema: { deney: deneySemasi },
  },
  async ({ deney }) => {
    try {
      const sonuc = veri.ham.transaction(() => deneyYaz(veri.db, deney))()
      return metin({
        ...sonuc,
        slug: deney.slug,
        teorikOlasiliklar: deney.olaylar.map((o) => ({
          olay: o.ad,
          olasilik: teorikOlasilik(deney, o),
        })),
      })
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'deney_listele',
  {
    title: 'Deneyleri listele',
    description: 'Yazılmış olasılık deneylerini sınıf ve konuyla birlikte listeler.',
    inputSchema: { sinif: z.number().int().min(0).max(12).optional() },
  },
  async ({ sinif }) => {
    try {
      return metin(veri.deneyListele(sinif))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'kavram_yaz',
  {
    title: 'Kavram yaz',
    description:
      'Kavram sözlüğüne giriş ekler ve konulara bağlar. "tanitilan" o kavramın ilk kez orada öğretildiğini, "kullanilan" önceden bilinip orada kullanıldığını söyler. Kütüphane ekranı ve konu sayfası bu bağı okur.',
    inputSchema: {
      alan: z.enum(ALANLAR),
      ad: z.string().min(2).max(80),
      tanim: z.string().min(10),
      latex: z.string().optional(),
      tanitilan: z.array(z.string()).optional().describe('Kavramı tanıtan konu slugları'),
      kullanilan: z.array(z.string()).optional().describe('Kavramı kullanan konu slugları'),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.kavramYaz(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'medya_yaz',
  {
    title: 'Arka plan görseli ve ölçek',
    description:
      'Bir sahneye arka plan görseli bağlar ve isteğe bağlı olarak gerçek dünya ölçeğini kurar. Görsel dosyası apps/web/public/medya altında durur; burada kaydedilen kayıttır. LİSANS ZORUNLU — telif takibi olmadan görsel eklenemez. Ölçek verilirse iki referans nokta arasındaki gerçek uzunluktan "1 tahta birimi = k birim" oranı çıkarılır ve sahnedeki bütün uzunluk, alan ve çevre ölçümleri o birimde okunur.',
    inputSchema: {
      sahneSlug: z.string().min(2),
      yol: z.string().min(2).describe('Web kökünden yol: /medya/cini-altigen.svg'),
      altMetin: z.string().min(4).describe('Ekran okuyucu için görselin anlatımı'),
      lisans: z.string().min(2).describe('kendi-uretimimiz | CC0 | CC-BY-4.0 ...'),
      kaynak: z.string().optional(),
      genislik: z.number().int().positive().optional(),
      yukseklik: z.number().int().positive().optional(),
      olcek: z
        .object({
          referansA: z.tuple([z.number(), z.number()]),
          referansB: z.tuple([z.number(), z.number()]),
          gercekUzunluk: z.number().positive(),
          birim: z.string().min(1).max(16),
          aciklama: z.string().max(280).optional(),
        })
        .optional(),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.medyaYaz(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

sunucu.registerTool(
  'formul_yaz',
  {
    title: 'Formül kartı yaz',
    description: 'Konuya formül kartı ekler. LaTeX olarak yazılır, konu sayfasında gösterilir.',
    inputSchema: {
      konuSlug: z.string(),
      ad: z.string().min(2).max(80),
      latex: z.string().min(1),
      aciklama: z.string().optional().describe('Formülün neden böyle olduğunu anlatan bir cümle'),
    },
  },
  async (girdi) => {
    try {
      return metin(veri.formulYaz(girdi))
    } catch (e) {
      return hataMetni(e)
    }
  },
)

const tasima = new StdioServerTransport()
await sunucu.connect(tasima)
