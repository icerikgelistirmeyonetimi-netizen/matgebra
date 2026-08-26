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

**38 aracın hepsi çalışıyor:** temel çizim, şekil, inşa (dikme, paralel, orta
dikme, açıortay, kesişim, teğet), ölçüm (uzunluk, açı, alan, çevre, eğim),
dönüşüm (öteleme, yansıma, döndürme, benzerlik), ileri (fonksiyon grafiği,
kaydırıcı, eğri yeri, iz) ve not (metin, etiket, serbest kalem).

Üç etkileşim biçimi var: nesne toplayanlar (çoğu araç), **konumlu** olanlar
(fonksiyon, kaydırıcı, metin — tek tıklamayla tıklanan yerde çalışır, tahtaya
nokta bırakmaz) ve **sürüklenen** olan (serbest kalem).

Fonksiyon ifadesi JSXGraph'in kendi ayrıştırıcısı JessieCode ile derlenir —
`eval` yok. Kaydırıcılara sırayla `a`, `b`, `c` adı verildiği için ifadede
geçebilirler: `a*x^2` yazıp kaydırıcıyı çekince parabol canlı değişir.

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

## Gerçek hayat sahneleri

Gerçek hayat sahnesi üç katmandan oluşur: **arka plan görseli**, üzerine oturan
**soyutlama** (geometrik nesneler) ve **adım adım anlatım**.

**Fotoğraf kullanmıyoruz.** Telif takibi zorunlu (`medya.lisans` boş bırakılamaz)
ve konuya tam oturan serbest lisanslı fotoğraf bulmak güvenilir değil. Görseller
`apps/mcp/scripts/gorsel-uret.mjs` ile kendimiz üretiliyor: lisans
`kendi-uretimimiz`, kaynağı da o betik. Şema hazır olduğu için ileride lisanslı
bir fotoğraf eklenmek istenirse yalnızca `medya` satırı değişir.

```bash
npm run gorsel -w @matgebra/mcp   # SVG arka planları üretir
```

**Ölçek kalibrasyonu.** Görseldeki bilinen bir uzunluk iki referans noktayla
işaretlenir; motor oradan "1 tahta birimi = k gerçek birim" oranını çıkarır.
Sahnedeki bütün uzunluk ölçümleri o birimde okunur, alan ölçümleri oranın
karesiyle. Çini sahnesinde iki karo merkezi arası 26 santimetredir; altıgenin
kenarı ekranda **20,80 cm** diye görünür, birimsiz bir sayı olarak değil.

**Devralma.** Sahne başlığındaki *Kendin çiz* düğmesi serbest tuvali açar ama
boş açmaz: tuval sahnenin sınır kutusunu, eksen kipini ve arka plan görselini
devralır. Öğrenci aynı resmin üzerine kendi çizimini kurar; denetçi panelinde
sahnenin yapı taşlarıyla karşılaştırmalı geri bildirim canlı güncellenir.

Karşılaştırma **kategori** bazındadır: altıgeni pergelle mi yoksa düzgün çokgen
aracıyla mı kurduğu sorulmaz, ortada bir çokgen olup olmadığı sorulur. Tek doğru
yol dayatmak çizim atölyesinin amacını bozardı.

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
16 araçlı bir MCP sunucusu. `.mcp.json` deponun kökünde olduğu için Claude Code
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
| `medya_yaz` | Arka plan görseli + ölçek kalibrasyonu (lisans zorunlu) |
| `deney_yaz` / `deney_listele` | Olasılık deneyi ve olayları |
| `kavram_yaz` / `formul_yaz` | Kavram sözlüğü ve formül kartları |

Yazma mantığı tohumlamayla ortaktır (`@matgebra/db` → `sahneYaz`), doğrulama
`@matgebra/core` içindeki şema ile yapılır; elle tohumlama ile araç üzerinden
üretim ayrışamaz.

```bash
npm run duman -w @matgebra/mcp   # protokol üzerinden duman testi
npm run ornek -w @matgebra/mcp   # uçtan uca içerik üretimi örneği
```

## İçerik üretimi nasıl yürüyor

`apps/mcp/scripts/icerik-*.mjs` her sınıf diliminin nasıl doldurulduğunu
gösteriyor: doğrula → sahne yaz → gerçek hayat anlatısı → sorular → kapsama
raporu. Yazma araçları **tekrar çalıştırılabilir** — aynı slug ya da aynı soru
gövdesiyle çağrılırsa var olan kayıt değişir, yenisi eklenmez.

```bash
npm run icerik      # bütün sınıf dilimlerini sırayla üretir
```

Bu tek komut, boş bir veritabanını (`npm run db:kur` sonrası) baştan sona
doldurur. İçerik dosyalarda değil veritabanında yaşar ama **üretilebilirliği**
depoda durur: `db:kur && icerik` her zaman aynı sonucu verir.

**Bütün müfredat kapsandı.** 97 konunun 97'sinin sahnesi var:

| Sınıf | Konu | Sahne | Sınıf | Konu | Sahne |
| --- | --- | --- | --- | --- | --- |
| Hazırlık | 2 | 2 | 7 | 14 | 14 |
| 1 | 2 | 2 | 8 | 13 | 13 |
| 2 | 5 | 5 | 9 | 7 | 8 |
| 3 | 6 | 6 | 10 | 8 | 11 |
| 4 | 10 | 10 | 11 | 4 | 5 |
| 5 | 10 | 10 | 12 | 6 | 7 |
| 6 | 10 | 10 | **Toplam** | **97** | **103** |

Toplamda 103 sahne, 1553 sahne nesnesi, 381 anlatım adımı, 45 gerçek hayat
örneği, 145 soru, 9 olasılık deneyi. Ortak sahne kalıpları `icerik-ortak.mjs`
içinde toplandı; her sınıf dilimi onları kullanıyor.

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
- **Ölçü takası.** `nokta_bilesen` kaynaktan hangi ekseni okuyacağını seçebilir
  (`apsis_eksen` / `ordinat_eksen`) ve sabit kaydırma alabilir (`dx` / `dy`).
  Aynı ölçüyü bir görünümde yatay, diğerinde dikey kullanmak gerektiğinde şart —
  prizmanın önden ve üstten görünümlerinde "boy" böyle paylaşılıyor.
- **Kaymalı ama kaçmayan nokta.** Merdiven ayağı zeminden, silindirin alt tabanı
  ekseninden çıkmamalı. `nokta_uzerinde`ye `uzerinde` rolüyle bir eğri verilirse
  nokta o eğri üzerinde kayan bir sürgü olur (`surgu()` yardımcısı). Serbest
  nokta kullanılırsa sahne ilk sürüklemede yalan söylemeye başlar.
- **Yarım çemberde sürgü.** Çapı gören açının hep 90 kalması için sürgü tam
  çembere değil `yay`a bağlanmalı; tam çemberde nokta alt yarıya geçince açı
  dönük okunur.
- **Sürgünün ucu tehlikelidir.** Bir sürgü taşıyıcısının ucuna oturabilir; orada
  üçgen çöker ve açı tanımsızlaşır (ekranda 150 gibi anlamsız bir sayı belirir).
  Taşıyıcıyı kısaltın: doğru parçasının ucunu içeri çekin ya da yayın uçlarını
  `donme` ile birkaç derece kısın.
- **Dönüşümler köşe köşe kurulur.** `otelenmisCokgen` / `donmusCokgen` /
  `homotetikCokgen` şekli bir bütün olarak değil, her köşeyi ayrı dönüştürüp
  üzerine çokgen kurarak üretir. Öğrenci A → A′ eşleşmesini görebilsin diye;
  üretilen köşeler `${ad}_${eskiAd}` diye adlandırılır, ölçüm bağlamak için lazım.

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
| 04 | Çizim atölyesi | **tamam** — 38 aracın hepsi, geri/ileri alma, tarif olarak kaydetme |
| 05 | MCP içerik hattı | tamam |
| 06 | Gerçek hayat modülü | **tamam** — arka plan görseli, ölçek kalibrasyonu, devralma ve karşılaştırma |
| 07 | Olasılık laboratuvarı | 9 deney, tohumlu benzetim, teorik/deneysel karşılaştırma |
| 08 | Öğrenme akışı | 6 soru tipi, ipucu/çözüm, ilerleme, kavram ve formül |
| 09 | İçerik üretimi | **tamam** — 97 konunun 97'si kapsandı, 103 sahne |
| 10 | Cila ve dışa aktarım | bekliyor |
| 11 | Yönetim paneli | şema hazır |

## Veri kaynağı

MEB Türkiye Yüzyılı Maarif Modeli öğretim programları. `veri/` klasöründe
9.593 kazanım ve 1.612 tema bulunur; bunlardan matematik dersinin
**114 geometri ve olasılık kazanımı** (461 alt madde) projenin hedef kapsamıdır.
