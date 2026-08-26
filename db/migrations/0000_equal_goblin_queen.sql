CREATE TABLE `ders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ad` text NOT NULL,
	`slug` text NOT NULL,
	`kaynak_ders_adi` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ders_slug_unique` ON `ders` (`slug`);--> statement-breakpoint
CREATE TABLE `kademe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`ad` text NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kademe_slug_unique` ON `kademe` (`slug`);--> statement-breakpoint
CREATE TABLE `kazanim` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tema_id` integer NOT NULL,
	`kod` text NOT NULL,
	`metin` text NOT NULL,
	`metin_norm` text DEFAULT '' NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	`kaynak_id` text,
	FOREIGN KEY (`tema_id`) REFERENCES `tema`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_kazanim_tema` ON `kazanim` (`tema_id`);--> statement-breakpoint
CREATE INDEX `ix_kazanim_kod` ON `kazanim` (`kod`);--> statement-breakpoint
CREATE UNIQUE INDEX `ux_kazanim_kaynak` ON `kazanim` (`kaynak_id`);--> statement-breakpoint
CREATE TABLE `kazanim_maddesi` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kazanim_id` integer NOT NULL,
	`harf` text NOT NULL,
	`metin` text NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`kazanim_id`) REFERENCES `kazanim`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_madde_kazanim` ON `kazanim_maddesi` (`kazanim_id`);--> statement-breakpoint
CREATE TABLE `sinif` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kademe_id` integer NOT NULL,
	`seviye` integer NOT NULL,
	`ad` text NOT NULL,
	`slug` text NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`kademe_id`) REFERENCES `kademe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sinif_slug_unique` ON `sinif` (`slug`);--> statement-breakpoint
CREATE INDEX `ix_sinif_kademe` ON `sinif` (`kademe_id`);--> statement-breakpoint
CREATE TABLE `tema` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ders_id` integer NOT NULL,
	`sinif_id` integer NOT NULL,
	`kod` text DEFAULT '' NOT NULL,
	`ad` text NOT NULL,
	`ad_norm` text DEFAULT '' NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	`ders_saati` integer,
	`ozet` text DEFAULT '' NOT NULL,
	`kaynak_unite_id` text,
	`alan_slug` text,
	FOREIGN KEY (`ders_id`) REFERENCES `ders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sinif_id`) REFERENCES `sinif`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_tema_sinif` ON `tema` (`sinif_id`);--> statement-breakpoint
CREATE INDEX `ix_tema_alan` ON `tema` (`alan_slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `ux_tema_kaynak` ON `tema` (`kaynak_unite_id`);--> statement-breakpoint
CREATE TABLE `tema_bolum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tema_id` integer NOT NULL,
	`tur` text NOT NULL,
	`icerik` text NOT NULL,
	FOREIGN KEY (`tema_id`) REFERENCES `tema`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_tema_bolum_tema` ON `tema_bolum` (`tema_id`);--> statement-breakpoint
CREATE TABLE `alan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`ad` text NOT NULL,
	`renk_anahtari` text DEFAULT 'gok' NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `alan_slug_unique` ON `alan` (`slug`);--> statement-breakpoint
CREATE TABLE `formul` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`ad` text NOT NULL,
	`latex` text NOT NULL,
	`aciklama` text DEFAULT '' NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_formul_konu` ON `formul` (`konu_id`);--> statement-breakpoint
CREATE TABLE `kavram` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alan_id` integer NOT NULL,
	`ad` text NOT NULL,
	`ad_norm` text DEFAULT '' NOT NULL,
	`slug` text NOT NULL,
	`tanim` text DEFAULT '' NOT NULL,
	`latex` text,
	`medya_id` integer,
	FOREIGN KEY (`alan_id`) REFERENCES `alan`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kavram_slug_unique` ON `kavram` (`slug`);--> statement-breakpoint
CREATE INDEX `ix_kavram_alan` ON `kavram` (`alan_id`);--> statement-breakpoint
CREATE TABLE `konu` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alan_id` integer NOT NULL,
	`sinif_id` integer NOT NULL,
	`ad` text NOT NULL,
	`ad_norm` text DEFAULT '' NOT NULL,
	`slug` text NOT NULL,
	`ozet` text DEFAULT '' NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	`zorluk` integer DEFAULT 2 NOT NULL,
	`durum` text DEFAULT 'taslak' NOT NULL,
	`surum` integer DEFAULT 1 NOT NULL,
	`olusturan` integer,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	`guncelleme` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`alan_id`) REFERENCES `alan`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`sinif_id`) REFERENCES `sinif`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `konu_slug_unique` ON `konu` (`slug`);--> statement-breakpoint
CREATE INDEX `ix_konu_sinif_alan` ON `konu` (`sinif_id`,`alan_id`);--> statement-breakpoint
CREATE INDEX `ix_konu_ad_norm` ON `konu` (`ad_norm`);--> statement-breakpoint
CREATE TABLE `konu_kavram` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`kavram_id` integer NOT NULL,
	`rol` text DEFAULT 'kullanilan' NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kavram_id`) REFERENCES `kavram`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_konu_kavram` ON `konu_kavram` (`konu_id`,`kavram_id`);--> statement-breakpoint
CREATE TABLE `konu_kazanim` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`kazanim_id` integer NOT NULL,
	`kapsama` text DEFAULT 'tam' NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kazanim_id`) REFERENCES `kazanim`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_konu_kazanim` ON `konu_kazanim` (`konu_id`,`kazanim_id`);--> statement-breakpoint
CREATE TABLE `on_kosul` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`gereken_konu_id` integer NOT NULL,
	`zorunlu` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`gereken_konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_on_kosul` ON `on_kosul` (`konu_id`,`gereken_konu_id`);--> statement-breakpoint
CREATE TABLE `adim` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sahne_id` integer NOT NULL,
	`sira` integer NOT NULL,
	`baslik` text NOT NULL,
	`anlatim` text NOT NULL,
	`vurgu_json` text DEFAULT '[]' NOT NULL,
	`aksiyon_json` text,
	`beklenen_json` text,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_adim_sahne_sira` ON `adim` (`sahne_id`,`sira`);--> statement-breakpoint
CREATE TABLE `arac` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anahtar` text NOT NULL,
	`etiket` text NOT NULL,
	`grup` text NOT NULL,
	`ikon` text DEFAULT 'nokta' NOT NULL,
	`min_sinif` integer DEFAULT 1 NOT NULL,
	`kisayol` text,
	`sira` integer DEFAULT 0 NOT NULL,
	`aktif` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `arac_anahtar_unique` ON `arac` (`anahtar`);--> statement-breakpoint
CREATE TABLE `gercek_hayat_ornegi` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`sahne_id` integer,
	`baslik` text NOT NULL,
	`hikaye` text NOT NULL,
	`soru` text DEFAULT '' NOT NULL,
	`medya_id` integer,
	`olcek_aciklama` text DEFAULT '' NOT NULL,
	`kaynak` text DEFAULT '' NOT NULL,
	`yas_araligi` text DEFAULT '' NOT NULL,
	`durum` text DEFAULT 'taslak' NOT NULL,
	`surum` integer DEFAULT 1 NOT NULL,
	`olusturan` integer,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	`guncelleme` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ix_ornek_konu` ON `gercek_hayat_ornegi` (`konu_id`);--> statement-breakpoint
CREATE TABLE `nesne` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sahne_id` integer NOT NULL,
	`ad` text NOT NULL,
	`tip` text NOT NULL,
	`etiket` text,
	`sira` integer DEFAULT 0 NOT NULL,
	`katman` integer DEFAULT 0 NOT NULL,
	`gorunur` integer DEFAULT true NOT NULL,
	`kilitli` integer DEFAULT false NOT NULL,
	`surukleme` text DEFAULT 'yok' NOT NULL,
	`stil_id` integer,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`stil_id`) REFERENCES `stil`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_nesne_sahne_ad` ON `nesne` (`sahne_id`,`ad`);--> statement-breakpoint
CREATE INDEX `ix_nesne_sahne` ON `nesne` (`sahne_id`);--> statement-breakpoint
CREATE TABLE `nesne_bagimlilik` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nesne_id` integer NOT NULL,
	`kaynak_nesne_id` integer NOT NULL,
	`rol` text NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`nesne_id`) REFERENCES `nesne`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kaynak_nesne_id`) REFERENCES `nesne`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_bagimlilik_nesne` ON `nesne_bagimlilik` (`nesne_id`);--> statement-breakpoint
CREATE TABLE `nesne_parametre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nesne_id` integer NOT NULL,
	`anahtar` text NOT NULL,
	`deger` text NOT NULL,
	`tur` text DEFAULT 'sayi' NOT NULL,
	FOREIGN KEY (`nesne_id`) REFERENCES `nesne`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_parametre` ON `nesne_parametre` (`nesne_id`,`anahtar`);--> statement-breakpoint
CREATE TABLE `sahne` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`tur` text NOT NULL,
	`baslik` text NOT NULL,
	`slug` text NOT NULL,
	`ozet` text DEFAULT '' NOT NULL,
	`zorluk` integer DEFAULT 2 NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	`durum` text DEFAULT 'taslak' NOT NULL,
	`surum` integer DEFAULT 1 NOT NULL,
	`olusturan` integer,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	`guncelleme` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sahne_slug_unique` ON `sahne` (`slug`);--> statement-breakpoint
CREATE INDEX `ix_sahne_konu` ON `sahne` (`konu_id`);--> statement-breakpoint
CREATE INDEX `ix_sahne_tur` ON `sahne` (`tur`);--> statement-breakpoint
CREATE TABLE `sahne_ayar` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sahne_id` integer NOT NULL,
	`eksen_modu` text DEFAULT 'tam' NOT NULL,
	`sinir_x1` real DEFAULT -10 NOT NULL,
	`sinir_y1` real DEFAULT 10 NOT NULL,
	`sinir_x2` real DEFAULT 10 NOT NULL,
	`sinir_y2` real DEFAULT -10 NOT NULL,
	`izgara_adimi` real DEFAULT 1 NOT NULL,
	`birim` text DEFAULT '' NOT NULL,
	`yapisma` text DEFAULT 'izgara' NOT NULL,
	`oran_kilidi` integer DEFAULT true NOT NULL,
	`arka_plan_medya_id` integer,
	`olcek_json` text,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sahne_ayar_sahne_id_unique` ON `sahne_ayar` (`sahne_id`);--> statement-breakpoint
CREATE TABLE `soru` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`sahne_id` integer,
	`tip` text NOT NULL,
	`govde` text NOT NULL,
	`latex` text,
	`secenek_json` text,
	`cevap_json` text DEFAULT '{}' NOT NULL,
	`ipucu` text DEFAULT '' NOT NULL,
	`cozum` text DEFAULT '' NOT NULL,
	`zorluk` integer DEFAULT 2 NOT NULL,
	`puan` integer DEFAULT 1 NOT NULL,
	`durum` text DEFAULT 'taslak' NOT NULL,
	`surum` integer DEFAULT 1 NOT NULL,
	`olusturan` integer,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	`guncelleme` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ix_soru_konu` ON `soru` (`konu_id`);--> statement-breakpoint
CREATE INDEX `ix_soru_sahne` ON `soru` (`sahne_id`);--> statement-breakpoint
CREATE TABLE `stil` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ad` text NOT NULL,
	`rol` text DEFAULT 'gok' NOT NULL,
	`dolgu` text,
	`kenar` text,
	`kalinlik` real DEFAULT 2 NOT NULL,
	`opaklik` real DEFAULT 1 NOT NULL,
	`cizgi_tipi` text DEFAULT 'duz' NOT NULL,
	`nokta_boyutu` real DEFAULT 4 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stil_ad_unique` ON `stil` (`ad`);--> statement-breakpoint
CREATE TABLE `varyant` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`soru_id` integer NOT NULL,
	`tohum` integer NOT NULL,
	`parametre_json` text DEFAULT '{}' NOT NULL,
	FOREIGN KEY (`soru_id`) REFERENCES `soru`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_varyant` ON `varyant` (`soru_id`,`tohum`);--> statement-breakpoint
CREATE TABLE `deney` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`konu_id` integer NOT NULL,
	`tur` text NOT NULL,
	`ad` text NOT NULL,
	`slug` text NOT NULL,
	`aciklama` text DEFAULT '' NOT NULL,
	`bagimsiz_mi` integer DEFAULT true NOT NULL,
	`iade_var_mi` integer DEFAULT true NOT NULL,
	`durum` text DEFAULT 'taslak' NOT NULL,
	`surum` integer DEFAULT 1 NOT NULL,
	`olusturan` integer,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	`guncelleme` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `deney_slug_unique` ON `deney` (`slug`);--> statement-breakpoint
CREATE INDEX `ix_deney_konu` ON `deney` (`konu_id`);--> statement-breakpoint
CREATE TABLE `deney_kosum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deney_id` integer NOT NULL,
	`sahne_id` integer,
	`tohum` integer NOT NULL,
	`deneme_sayisi` integer NOT NULL,
	`sonuc_json` text DEFAULT '{}' NOT NULL,
	`zaman` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`deney_id`) REFERENCES `deney`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ix_kosum_deney` ON `deney_kosum` (`deney_id`);--> statement-breakpoint
CREATE TABLE `deney_sonuc` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deney_id` integer NOT NULL,
	`sonuc` text NOT NULL,
	`agirlik` real DEFAULT 1 NOT NULL,
	`renk_anahtari` text DEFAULT 'gok' NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`deney_id`) REFERENCES `deney`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_deney_sonuc` ON `deney_sonuc` (`deney_id`,`sonuc`);--> statement-breakpoint
CREATE TABLE `olay` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deney_id` integer NOT NULL,
	`ad` text NOT NULL,
	`kosul_json` text DEFAULT '{}' NOT NULL,
	`beklenen_olasilik` real,
	FOREIGN KEY (`deney_id`) REFERENCES `deney`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ix_olay_deney` ON `olay` (`deney_id`);--> statement-breakpoint
CREATE TABLE `cizim` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kullanici_id` integer NOT NULL,
	`sahne_id` integer,
	`ad` text DEFAULT 'Adsiz cizim' NOT NULL,
	`veri_json` text NOT NULL,
	`ekran_goruntusu` text,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	`guncelleme` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`kullanici_id`) REFERENCES `kullanici`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ix_cizim_kullanici` ON `cizim` (`kullanici_id`);--> statement-breakpoint
CREATE TABLE `ilerleme` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kullanici_id` integer NOT NULL,
	`konu_id` integer NOT NULL,
	`durum` text DEFAULT 'baslanmadi' NOT NULL,
	`puan` integer DEFAULT 0 NOT NULL,
	`deneme` integer DEFAULT 0 NOT NULL,
	`son_erisim` text,
	FOREIGN KEY (`kullanici_id`) REFERENCES `kullanici`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`konu_id`) REFERENCES `konu`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_ilerleme` ON `ilerleme` (`kullanici_id`,`konu_id`);--> statement-breakpoint
CREATE TABLE `kullanici` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ad` text NOT NULL,
	`rol` text DEFAULT 'ogrenci' NOT NULL,
	`sinif_id` integer,
	`olusturma` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`sinif_id`) REFERENCES `sinif`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `etiket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ad` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `etiket_slug_unique` ON `etiket` (`slug`);--> statement-breakpoint
CREATE TABLE `medya` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tur` text DEFAULT 'gorsel' NOT NULL,
	`yol` text NOT NULL,
	`alt_metin` text DEFAULT '' NOT NULL,
	`lisans` text NOT NULL,
	`kaynak` text DEFAULT '' NOT NULL,
	`genislik` integer,
	`yukseklik` integer
);
--> statement-breakpoint
CREATE TABLE `modul` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`ad` text NOT NULL,
	`surum` text DEFAULT '0.1.0' NOT NULL,
	`aktif` integer DEFAULT true NOT NULL,
	`sira` integer DEFAULT 0 NOT NULL,
	`ayar_json` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `modul_slug_unique` ON `modul` (`slug`);--> statement-breakpoint
CREATE TABLE `revizyon` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tablo` text NOT NULL,
	`kayit_id` integer NOT NULL,
	`islem` text NOT NULL,
	`onceki_json` text,
	`sonraki_json` text,
	`kullanici_id` integer,
	`zaman` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`kullanici_id`) REFERENCES `kullanici`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ix_revizyon_kayit` ON `revizyon` (`tablo`,`kayit_id`);--> statement-breakpoint
CREATE TABLE `sahne_etiket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sahne_id` integer NOT NULL,
	`etiket_id` integer NOT NULL,
	FOREIGN KEY (`sahne_id`) REFERENCES `sahne`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`etiket_id`) REFERENCES `etiket`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ux_sahne_etiket` ON `sahne_etiket` (`sahne_id`,`etiket_id`);