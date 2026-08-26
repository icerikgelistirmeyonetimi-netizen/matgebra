# Matgebra

1–12. sınıf **geometri** ve **olasılık** için, MEB Türkiye Yüzyılı Maarif Modeli
kazanımlarına bağlı, veritabanı güdümlü dinamik matematik atölyesi.

Temel ilke: **hiçbir eğitim içeriği koda gömülmez.** Kod yalnızca motor, arayüz ve
taşıma katmanıdır. Konu, sahne, nesne, adım, örnek ve soru — hepsi veritabanı satırıdır.

İş planının tamamı: [docs/00-plan.md](docs/00-plan.md)

## Kurulum

```bash
npm install
npm run db:kur
```

`db:kur` sırayla şunları yapar: şemadan göç üretir, göçleri uygular, MEB müfredatını
`veri/icerik.db` içinden aktarır, konu taksonomisini tohumlar. Yeniden çalıştırılabilir.

## Çalıştırma

```bash
npm run dev
```

API `http://127.0.0.1:5174`, arayüz `http://localhost:5173` adresinde açılır.
Tek tek çalıştırmak için `npm run api` ve `npm run web`.

## Çizim atölyesi

Serbest tuvalde GeoGebra tarzı araç davranışı: her araç sırayla nesne toplar,
gereken sayıya ulaşınca sonucu inşa eder. Boş yere tıklamak yeni nokta yaratır,
var olan bir noktaya tıklamak onu yeniden kullanır, bir çember ya da doğru
üzerine tıklamak o nesne üzerinde **kayan nokta** (glider) yaratır — pergel
davranışı buradan gelir.

31 araç çalışıyor: temel çizim, şekil, inşa (dikme, paralel, orta dikme,
açıortay, kesişim, teğet), ölçüm (uzunluk, açı, alan, çevre, eğim) ve dönüşüm
(öteleme, yansıma, döndürme, benzerlik). Henüz bekleyen 7 araç: fonksiyon
grafiği, kaydırıcı, eğri yeri, iz bırakma, metin, etiket, serbest kalem.

**Kaydetme tarif olarak yapılır.** Tahtanın ham hâli değil, onu üreten adımlar
saklanır: hangi araç hangi girdilerle çalıştı. Kayıt küçük kalır, geri yükleme
aynı adımları yeniden oynatır ve motordan bağımsızdır. Geri/ileri alma da aynı
mekanizmayı kullanır.

## Öğrenme akışı

Altı soru tipi: çoktan seçmeli, doğru/yanlış, sayısal, **tahtadan ölçüm**,
**inşa görevi**, açık uçlu. Son ikisi soruyu metin olmaktan çıkarır:

- *Tahtadan ölçüm* öğrenciyi sahneye gönderir, cevabı ekrandan okutur.
- *İnşa görevi* serbest tuvalde çözülür; sistem tahtadaki nesneleri sayarak
  denetler. Eksik varsa "1 çember, 1 düzgün çokgen" gibi Türkçe söyler.

Denetim `@matgebra/core` içindeki `cevapDenetle` ile yapılır — arayüz kendi
kuralını uydurmaz. İpucu ve çözüm kademeli açılır: çözüm ancak bir deneme
yapıldıktan sonra görünür.

> Denetim istemcide yapılıyor, yani cevaplar tarayıcıya iniyor. Bu bir öğretim
> aracı, sınav değil. Sınav kipi gerekirse denetim sunucuya taşınır ve cevap
> alanları yanıttan çıkarılır.

Kavram sözlüğü konulara iki rolle bağlanır: *tanıtılan* (ilk kez orada
öğretiliyor) ve *kullanılan*. Kütüphane ekranı sözlüğü, formül kartlarını ve
kapsama raporunu bir arada tutar.

## Olasılık laboratuvarı

Deney veritabanından gelir, benzetim tarayıcıda `@matgebra/core` ile koşar.
Zar, para, çark ve torba koordinat düzlemi gerektirmez; kendi görsel dillerinde
çizilirler ama renkleri aynı palet tokenlarından alırlar.

**Tohumlu rastgelelik.** `Math.random` yerine mulberry32 kullanılıyor: aynı
tohum aynı sonuç dizisini üretir. Öğretmen tahtada gördüğünü öğrenciye aynen
tekrarlatabilir, kaydedilen koşum sonradan doğrulanabilir. Tohum ekranda
görünür ve değiştirilebilir.

Her olayın teorik olasılığı yazma anında hesaplanıp saklanır; arayüz onu
deneysel değerle yan yana gösterir. Bileşik deneylerde (iki zar) bütün sonuç
uzayı sayılarak bulunur — 6×6 ızgarası ekranda da görünür. Koşul biçimleri:
`toplam`, `toplam_en_az`, `hepsi_ayni`, `en_az_bir`, `hepsi`.

Olasılık müfredatta 4. sınıfta başlar, 10. sınıfta biter; 11 ve 12'de ayrı bir
olasılık teması yoktur.

## İçerik üretimi (MCP)

Eğitim içeriği dosyaya değil veritabanına yazılır. `apps/mcp` bunun arayüzüdür:
11 araçlı bir MCP sunucusu. `.mcp.json` deponun kökünde olduğu için Claude Code
projeyi açtığında sunucuyu kendiliğinden görür.

| Araç | İş |
| --- | --- |
| `sema_getir` | Tablolar, kolonlar, nesne tipleri, palet rolleri |
| `kazanim_ara` | MEB kazanımlarında Türkçe normalize arama |
| `konu_listele` | Taksonomi + sahne/örnek/soru sayıları |
| `sahne_getir` | Sahneyi yazım biçiminde döndürür (doğrudan `sahne_yaz`'a verilebilir) |
| `kapsama_raporu` | Hangi konunun sahnesi yok |
| `sql_sorgu` | Salt okunur SQL; yazma ifadeleri reddedilir |
| `konu_yaz` | Konu + kazanım köprüsü + ön koşullar |
| `sahne_dogrula` | Şema, bağımlılık döngüsü, ekran dışı nokta, hayalet vurgu |
| `sahne_yaz` | Sahneyi tek işlemde yazar |
| `gercek_hayat_yaz` | Sahneye bağlı gerçek hayat anlatısı |
| `soru_yaz` | Konuya ya da sahneye bağlı soru |

Yazma mantığı tohumlamayla ortaktır (`@matgebra/db` → `sahneYaz`), doğrulama
`@matgebra/core` içindeki şema ile yapılır; elle tohumlama ile araç üzerinden
üretim ayrışamaz.

```bash
npm run duman -w @matgebra/mcp   # protokol üzerinden duman testi
npm run ornek -w @matgebra/mcp   # uçtan uca içerik üretimi örneği
```

## İçerik üretimi nasıl yürüyor

`apps/mcp/scripts/icerik-s5.mjs` bir sınıf diliminin nasıl doldurulduğunu
gösteriyor: doğrula → sahne yaz → gerçek hayat anlatısı → sorular → kapsama
raporu. Yazma araçları **tekrar çalıştırılabilir** — aynı slug ya da aynı soru
gövdesiyle çağrılırsa var olan kayıt değişir, yenisi eklenmez.

5. sınıf geometrisi bu yolla tamamlandı: 8 konunun 8'inin de sahnesi,
gerçek hayat örneği ve soruları var.

### Sahne yazarken bilinmesi gerekenler

- **Açı yönü.** Motor açıyı saat yönünün *tersine* ölçer. Kollar ters sırada
  verilirse iç açı yerine dönük açı okunur (39 yerine 321). Kural: ilk kol,
  ikincisinden saat yönünde geride olmalı.
- **Değişmezleri sahte kurmayın.** Bir sahne "ters açılar hep eşittir" diyorsa,
  karşı ışınlar gerçekten türetilmiş olmalı. Sabit noktayla taklit edilirse
  öğrenci sürüklediğinde sahne yalan söyler.
- **Dikdörtgen** `nokta_bilesen` ile kurulur: tek sürüklenebilir köşe yeter,
  diğer ikisi bileşen alarak türetilir.
- **Eşit yarıçap** için çemberin yarıçapı iki nokta arası uzaklıkla verilebilir
  (`uc1` + `uc2` rolleri) — pergel açıklığını başka merkeze taşımak gibi.

## Statik yayın

```bash
npm run statik
```

Veritabanından API yanıtlarını `apps/web/public/api/` altına JSON olarak döker,
ardından arayüzü derler. Çıktı (`apps/web/dist`) sunucu istemez: GitHub Pages
gibi statik barındırmada çalışır. Sorgular yeniden yazılmaz — statik üretici de
aynı depo (repository) fonksiyonlarını çağırır, dolayısıyla iki kip birebir aynı
veriyi verir. Arama sunucuda FTS5, statik kipte tarayıcıda aynı normalize
kurallarıyla yürür.

Statik kipte yönlendirme hash tabanlıdır (`#/konu/...`); GitHub Pages tek sayfa
uygulaması için geri dönüş sunmadığından derin bağlantılar aksi hâlde 404 verir.

`.github/workflows/static.yml` her `main` itmesinde bunu çalıştırıp yayınlar.

## Dosya yapısı

| Yol | İçerik |
| --- | --- |
| `veri/` | **Dokunulmaz.** MEB kaynak verisi; salt okunur. |
| `db/schema/` | Drizzle şema dosyaları — tek gerçek kaynak |
| `db/migrations/` | Üretilen SQL göçleri |
| `db/src/import/` | ETL: `icerik.db` + `unite/*.json` → `matgebra.db` |
| `db/src/seed/` | Konu taksonomisi, ön koşul grafiği, palet, araç seti |
| `apps/api/` | Fastify REST — `src/depo.ts` tüm sorguları toplar |
| `apps/web/` | Vue 3 + Vite + Tailwind v4 |
| `apps/web/src/moduller/` | Bağımsız modüller: müfredat, sahne, çizim, olasılık, kütüphane |
| `apps/web/src/stil.css` | **Projedeki tek CSS dosyası** — yalnızca `@theme` tokenları |
| `packages/core/` | Motor bağımsız alan tipleri ve sahne şeması (Zod) |

## Kurallar

**CSS yazılmaz.** `apps/web/src/stil.css` yalnızca tasarım tokenı tanımlar; hiçbir
bileşen kuralı içermez. Görünüm tamamen Tailwind utility sınıflarıyla kurulur.
Sahne motoru SVG'yi kendi ürettiği için Tailwind ile biçimlendirilemez; renkleri
`src/ortak/palet.ts` üzerinden aynı tokenlardan okur. Renk için tek kaynak korunur.

**İçerik veritabanından gelir.** Hiçbir bileşen kendi içinde eğitim verisi taşımaz.
Yeni içerik eklemenin yolu tohumlama ya da (Faz 5'ten sonra) MCP araçlarıdır.

**Modüller birbirini import etmez.** Ortak her şey `@matgebra/core` ya da
`apps/web/src/ortak` üzerinden geçer.

**Türkçe arama `ad_norm` üzerinden yürür.** SQLite'ın `NOCASE` karşılaştırması
Türkçe noktalı/noktasız i çiftinde yanlış sonuç verir; her aranabilir metnin
normalize edilmiş bir kopyası tutulur ve FTS5 dizini onu kullanır.

**Sahne verisi motor bağımsızdır.** `nesne` + `nesne_bagimlilik` + `nesne_parametre`
üçlüsü geometrinin dilinde konuşur: "B noktası, merkezi O olan ve A'dan geçen
çemberin üzerinde, A'dan 60 derece ileride". Bunu JSXGraph çağrılarına çeviren tek
yer `apps/web/src/moduller/sahne/sahneKurucu.ts`. Motor değişirse yalnızca o dosya
ve `SahneTahtasi.vue` değişir; veritabanı olduğu gibi kalır.

**Küçük sınıflarda koordinat düzlemi yoktur.** 1–3. sınıfta eksen ve sayı
gösterilmez (`eksen_modu = 'yok'`), 3–5'te sayısız ızgara, 6'dan itibaren tam
koordinat düzlemi. Müfredatta koordinat sistemi 8. sınıfta geçer.

## Durum

| Faz | Konu | Durum |
| --- | --- | --- |
| 01 | İskelet ve kabuk | tamam |
| 02 | Veri katmanı ve MEB içe aktarımı | tamam |
| 03 | Sahne motoru — okuma yönü | tamam |
| 04 | Çizim atölyesi | 31 araç, geri/ileri alma, kaydetme çalışıyor; 7 araç bekliyor |
| 05 | MCP içerik hattı | tamam |
| 06 | Gerçek hayat modülü | ilk iki sahne yayında, arka plan görseli ve ölçek bekliyor |
| 07 | Olasılık laboratuvarı | 9 deney, tohumlu benzetim, teorik/deneysel karşılaştırma |
| 08 | Öğrenme akışı | 6 soru tipi, ipucu/çözüm, ilerleme, kavram ve formül |
| 09 | İçerik üretimi | 5. sınıf geometri tamam (8/8 konu); 89 konu bekliyor |
| 10 | Cila ve dışa aktarım | bekliyor |
| 11 | Yönetim paneli | şema hazır |

## Veri kaynağı

MEB Türkiye Yüzyılı Maarif Modeli öğretim programları. `veri/` klasöründe
9.593 kazanım ve 1.612 tema bulunur; bunlardan matematik dersinin
**114 geometri ve olasılık kazanımı** (461 alt madde) projenin hedef kapsamıdır.
