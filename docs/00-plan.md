# Matgebra — ön araştırma ve iş planı

Planın tam ve güncel hâli yayımlanmış sayfada durur:

**https://claude.ai/code/artifact/ab5c16fd-63d2-419d-b348-608ad602945d**

Orada bulunanlar: keşif bulguları, geometri motoru karşılaştırması, sürüm taraması,
katman mimarisi, 28 tablolu ilişkisel şema, MCP araç seti, arayüz kabuğu düzeni,
pastel palet, araç seti, gerçek hayat akışı, olasılık laboratuvarı, 12 sınıf için
gerçek hayat örnek bankası, faz faz yol haritası ve risk tablosu.

Bu dosya, plan değiştikçe alınan kararların kısa kaydını tutar.

## Durum

**26–27 Ağustos 2026 · on iki fazın tamamı bitti.** 97 konunun 97'si kapsandı:
103 sahne, 1553 sahne nesnesi, 381 anlatım adımı, 45 gerçek hayat örneği,
145 soru, 9 olasılık deneyi. Çizim atölyesinde 38 aracın hepsi çalışıyor;
gerçek hayat sahnelerinde arka plan görseli ve ölçek kalibrasyonu var; panel,
çalışma kâğıdı ve sunum kipi yayında.

Boş bir veritabanından tam içeriğe iki komut:

```bash
npm run db:kur && npm run icerik
```

## Alınan kararlar

| Tarih | Karar | Gerekçe |
| --- | --- | --- |
| 2026-08-26 | Geometri motoru: **JSXGraph çekirdek** | Dinamik kısıt çözümü hazır, MIT/LGPL, arayüz tamamen bizim. GeoGebra Apps API her ticari kullanım için ayrı sözleşme istiyor ve arayüzü kontrol edilemiyor. |
| 2026-08-26 | Dil: **TypeScript** | Şema, sahne verisi ve MCP araçları aynı tip tanımlarını paylaşır; üzerine ekleme yaparken kırılmalar derleme anında yakalanır. |
| 2026-08-26 | Veritabanı: **SQLite + Drizzle** | Tek dosya, sunucusuz, yerel. Şema TypeScript'te olduğu için PostgreSQL'e taşıma lehçe değiştirmekten ibaret. |
| 2026-08-26 | Kapsam sırası: **önce 5. sınıf, baştan sona** | Şablonlar tek sınıfta olgunlaşır, kalan 11 sınıf hızlanır. |

## Plandan sapmalar

| Tarih | Sapma | Sebep |
| --- | --- | --- |
| 2026-08-26 | `veri/` klasörünün MEB müfredatını hazır içerdiği keşfedildi | Müfredat ağacı elle yazılmayacak, içe aktarılıyor. Faz 2 planlanandan küçük. |
| 2026-08-26 | Faz 1 içinde sahne motoru sarmalayıcısı da yazıldı | Projenin en riskli teknik varsayımı (JSXGraph + Vue + Tailwind token köprüsü) erken doğrulandı. |
| 2026-08-27 | Gerçek hayat sahnelerinde **fotoğraf yerine kendi ürettiğimiz SVG** | `medya.lisans` zorunlu; konuya tam oturan serbest lisanslı fotoğraf bulmak güvenilir değil. Şema hazır olduğu için ileride lisanslı fotoğraf eklemek yalnızca `medya` satırını değiştirmeyi gerektirir. |
| 2026-08-27 | Yönetim paneli **geometriyi düzenlemiyor** | Sahne nesneleri MCP araçlarıyla doğrulanarak yazılıyor; panelden elle bozulması kolay olurdu. Panel metin, zorluk, sıra ve yaşam döngüsüne bakıyor. |
| 2026-08-27 | `kavram` ve `formül` panele **alınmadı** | O iki tabloda yaşam döngüsü alanları yok; eklemek göç gerektirirdi ve Faz 11'in bitti kriteri "göç gerekmeden" diyor. |
| 2026-08-27 | Liste sanallaştırması **eklenmedi** | Ölçüldü: arama sunucuda grup başına 20 ile sınırlı, en uzun liste 14 konu. Gerekmeyen makine eklemek yerine sınırlar ölçülüp yazıldı. |

## Doğrulanmış müfredat gerçekleri

- Matematik dersinde **114** geometri ve olasılık kazanımı var: 101 geometri, 13 olasılık.
- Bunlar **34 temaya** yayılmış, toplam **461 alt madde** içeriyor.
- Olasılık 4. sınıfta başlıyor, 10. sınıfta bitiyor. **11 ve 12. sınıfta ayrı olasılık teması yok** —
  konu orada *İstatistiksel Araştırma Süreci* içine gömülü.
- **1–4. sınıfta koordinat düzlemi müfredatta geçmiyor.** Koordinat sistemi 8. sınıfta giriyor.
  Sahne motoru bu yüzden üç eksen kipi destekliyor: `yok` (kroki), `izgara`, `tam`.
- Kaynak metinler PDF'ten çıkarıldığı için satır sonu tirelemelerinin yerinde `U+0002` ve
  yumuşak tire bırakmış; içe aktarımda temizleniyor.
- Hazırlık sınıfı kazanım kodları `MAT.H.4.1` biçiminde — sınıf alanı harf.
