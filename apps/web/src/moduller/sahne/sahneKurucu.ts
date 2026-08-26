import type JXG from 'jsxgraph'
import { rolRengi, palet } from '@/ortak/palet'
import type { SahneNesnesi, SahneVerisi } from '@/ortak/api'

/**
 * Sahne kurucu: veritabani nesnelerini tahtaya cevirir.
 *
 * Veri motor bagimsizdir - "K2 noktasi, merkezi O olan ve A'dan gecen
 * cemberin uzerinde, A'dan 60 derece ileride" der. Bu dosya o cumleyi
 * JSXGraph cagrilarina ceviren TEK yerdir. Motoru degistirmek gerekirse
 * yalnizca burasi ve SahneTahtasi.vue degisir; veritabani oldugu gibi kalir.
 */

export type Kurulum = Map<string, JXG.GeometryElement>

const derece = (radyan: number) => (radyan * 180) / Math.PI

/**
 * Gercek dunya olcegi.
 *
 * Arka plan gorselinde bilinen bir uzunluk iki referans noktayla
 * isaretlenir (yaya gecidi seridi, kapi genisligi). Motor oradan
 * "1 tahta birimi = k gercek birim" oranini cikarir; butun uzunluk,
 * alan ve cevre olcumleri bu oranla carpilarak gercek birimde okunur.
 * Olcek yoksa carpan 1, birim de sahnenin kendi birimi olur.
 */
interface OlcekBilgisi {
  carpan: number
  birim: string
}

function olcegiCoz(sahne: SahneVerisi): OlcekBilgisi {
  const o = sahne.ayar.olcek
  if (!o) return { carpan: 1, birim: '' }
  const [ax, ay] = o.referansA
  const [bx, by] = o.referansB
  const tahtaUzunlugu = Math.hypot(bx - ax, by - ay)
  if (!(tahtaUzunlugu > 1e-9)) return { carpan: 1, birim: o.birim }
  return { carpan: o.gercekUzunluk / tahtaUzunlugu, birim: o.birim }
}

/** Olculen sayiyi gercek birime cevirip birim ekiyle yazar. */
const olcuMetni = (deger: number, o: OlcekBilgisi, us = 1): string => {
  const k = o.carpan ** us
  const sayi = (deger * k).toFixed(2)
  if (!o.birim) return sayi
  return `${sayi} ${us === 1 ? o.birim : `${o.birim}²`}`
}

/**
 * JSXGraph'in create() dönüşü birlesik tip: cember, dogru ve cokgen icin
 * Composition da donebiliyor. Haritada tek bir eleman tuttugumuz icin
 * daralttik; ilgilendigimiz her tipte donen deger tekil elemandir.
 */
const tekOge = (x: unknown) => x as JXG.GeometryElement

/** Nesnenin sayisal parametresi; yoksa varsayilan. */
function sayi(nesne: SahneNesnesi, anahtar: string, varsayilan = 0): number {
  const p = nesne.parametreler.find((x) => x.anahtar === anahtar)
  if (!p) return varsayilan
  const d = Number(p.deger)
  return Number.isFinite(d) ? d : varsayilan
}

/** Belirli roldeki bagimliliklarin kaynak adlari, siraya gore. */
function baglilar(nesne: SahneNesnesi, ...roller: string[]): string[] {
  return nesne.bagimliliklar
    .filter((b) => roller.includes(b.rol))
    .sort((a, b) => a.sira - b.sira)
    .map((b) => b.kaynak)
}

const CIZGI_TIPI: Record<string, number[] | undefined> = {
  duz: undefined,
  kesik: [6, 4],
  noktali: [2, 3],
}

/** Ortak gorunum ayarlari: pastel dolgu, koyu kardes kenar. */
function gorunum(nesne: SahneNesnesi) {
  const renk = rolRengi(nesne.stil.rol)
  const kesik = CIZGI_TIPI[nesne.stil.cizgiTipi]
  return {
    strokeColor: renk.kenar,
    fillColor: renk.dolgu,
    strokeWidth: nesne.stil.kalinlik,
    fillOpacity: nesne.stil.opaklik,
    strokeOpacity: 1,
    dash: kesik ? 2 : 0,
    visible: nesne.gorunur,
    highlight: !nesne.kilitli,
    renk,
  }
}

/**
 * Bagimliliklara gore siralar. Sahneler genelde dogru sirada yazilir ama
 * bir nesne kendinden sonra tanimlanmis birine de baglanabilir; kurulum
 * sirasi veriye degil bagimlilik grafigine gore belirlenmeli.
 */
function siralaBagimliliga(nesneler: SahneNesnesi[]): SahneNesnesi[] {
  const harita = new Map(nesneler.map((n) => [n.ad, n]))
  const durum = new Map<string, 'gri' | 'siyah'>()
  const sonuc: SahneNesnesi[] = []

  const gez = (ad: string): void => {
    if (durum.get(ad) === 'siyah' || durum.get(ad) === 'gri') return
    const n = harita.get(ad)
    if (!n) return
    durum.set(ad, 'gri')
    for (const b of n.bagimliliklar) gez(b.kaynak)
    durum.set(ad, 'siyah')
    sonuc.push(n)
  }
  for (const n of nesneler) gez(n.ad)
  return sonuc
}

/**
 * Sahneyi tahtaya kurar ve ad -> element haritasini dondurur.
 * Harita, adim vurgusu ve nesne agaci icin kullanilir.
 */
export function sahneyiKur(tahta: JXG.Board, sahne: SahneVerisi): Kurulum {
  const el: Kurulum = new Map()
  const p = palet()
  const yapisir = sahne.ayar.yapisma === 'izgara' || sahne.ayar.yapisma === 'tamsayi'
  const adim = sahne.ayar.izgaraAdimi
  const olcek = olcegiCoz(sahne)

  const bul = (ad: string) => el.get(ad)

  tahta.suspendUpdate()

  for (const n of siralaBagimliliga(sahne.nesneler)) {
    const g = gorunum(n)
    const etiketAyari = {
      offset: [8, 10] as [number, number],
      fontSize: 13,
      strokeColor: g.renk.kenar,
      cssStyle: 'font-family: inherit; font-weight: 600',
    }

    try {
      switch (n.tip) {
        case 'nokta': {
          const nokta = tahta.create('point', [sayi(n, 'x'), sayi(n, 'y')], {
            name: n.etiket ?? n.ad,
            withLabel: Boolean(n.etiket),
            size: n.stil.noktaBoyutu,
            fillColor: g.renk.dolgu,
            strokeColor: g.renk.kenar,
            strokeWidth: 2,
            fixed: n.surukleme === 'yok',
            visible: n.gorunur,
            snapToGrid: yapisir && n.surukleme !== 'yok',
            snapSizeX: adim,
            snapSizeY: adim,
            label: etiketAyari,
            layer: 9,
          })
          el.set(n.ad, tekOge(nokta))
          break
        }

        case 'nokta_uzerinde': {
          // Iki farkli kullanim var:
          //   1) 'uzerinde' rolu bir egri gosteriyorsa nokta o egri uzerinde
          //      kayan bir surgudur (glider) - merdiven ayagi gibi.
          //   2) 'merkez' + 'yaricap_noktasi' verilmisse cember uzerinde
          //      aci_ofset kadar ileride turetilmis noktadir.
          const tasiyici = bul(baglilar(n, 'uzerinde')[0] ?? '')
          if (tasiyici) {
            const surgu = tahta.create(
              'glider',
              [sayi(n, 'x'), sayi(n, 'y'), tasiyici as never],
              {
                name: n.etiket ?? n.ad,
                withLabel: Boolean(n.etiket),
                size: n.stil.noktaBoyutu,
                fillColor: g.renk.dolgu,
                strokeColor: g.renk.kenar,
                strokeWidth: 2,
                fixed: n.surukleme === 'yok',
                visible: n.gorunur,
                label: etiketAyari,
                layer: 9,
              },
            )
            el.set(n.ad, tekOge(surgu))
            break
          }

          // Merkez ve yaricap noktasindan turetilir: aci_ofset kadar ileride.
          const merkez = bul(baglilar(n, 'merkez')[0] ?? '') as JXG.Point | undefined
          const yaricap = bul(baglilar(n, 'yaricap_noktasi', 'kaynak')[0] ?? '') as
            | JXG.Point
            | undefined
          if (!merkez || !yaricap) break
          const ofset = (sayi(n, 'aci_ofset') * Math.PI) / 180
          const kutup = () => {
            const dx = yaricap.X() - merkez.X()
            const dy = yaricap.Y() - merkez.Y()
            return { r: Math.hypot(dx, dy), t: Math.atan2(dy, dx) + ofset }
          }
          const nokta = tahta.create(
            'point',
            [
              () => merkez.X() + kutup().r * Math.cos(kutup().t),
              () => merkez.Y() + kutup().r * Math.sin(kutup().t),
            ],
            {
              name: n.etiket ?? n.ad,
              withLabel: Boolean(n.etiket),
              size: n.stil.noktaBoyutu,
              fillColor: g.renk.dolgu,
              strokeColor: g.renk.kenar,
              strokeWidth: 2,
              fixed: true,
              visible: n.gorunur,
              label: etiketAyari,
              layer: 9,
            },
          )
          el.set(n.ad, tekOge(nokta))
          break
        }

        case 'nokta_bilesen': {
          // Apsisi bir kaynaktan, ordinati digerinden alir: (A.x, B.y).
          // Dikdortgeni tek surukleneblir koseyle kurmayi saglar.
          //
          // Kaynaktan hangi eksenin okunacagi secilebilir (apsis_eksen /
          // ordinat_eksen) ve sabit bir kaydirma eklenebilir (dx / dy).
          // Bir olcuyu bir yerde yatay, baska yerde dikey kullanmak
          // gerektiginde bu takas sart oluyor - ornegin ayni prizmanin
          // onden ve ustten gorunumlerinde "boy" olcusu.
          const apsis = bul(baglilar(n, 'apsis')[0] ?? '') as JXG.Point | undefined
          const ordinat = bul(baglilar(n, 'ordinat')[0] ?? '') as JXG.Point | undefined
          if (!apsis || !ordinat) break
          const apsisEksen = n.parametreler.find((p) => p.anahtar === 'apsis_eksen')?.deger
          const ordinatEksen = n.parametreler.find((p) => p.anahtar === 'ordinat_eksen')?.deger
          const dx = sayi(n, 'dx', 0)
          const dy = sayi(n, 'dy', 0)
          const oku = (p: JXG.Point, eksen: unknown) => (eksen === 'y' ? p.Y() : p.X())
          const nokta = tahta.create('point', [
            () => oku(apsis, apsisEksen ?? 'x') + dx,
            () => oku(ordinat, ordinatEksen ?? 'y') + dy,
          ], {
            name: n.etiket ?? n.ad,
            withLabel: Boolean(n.etiket),
            size: n.stil.noktaBoyutu,
            fillColor: g.renk.dolgu,
            strokeColor: g.renk.kenar,
            strokeWidth: 2,
            fixed: true,
            visible: n.gorunur,
            label: etiketAyari,
            layer: 9,
          })
          el.set(n.ad, tekOge(nokta))
          break
        }

        case 'nokta_oteleme': {
          // Kaynagi (dx, dy) kadar tasir. Paralelkenarda karsi kose boyle
          // turetilir: tabani sabit tutup tepe noktasini serbest birakmak.
          const kaynak = bul(baglilar(n, 'kaynak', 'uc1')[0] ?? '') as JXG.Point | undefined
          if (!kaynak) break
          const dx = sayi(n, 'dx', 0)
          const dy = sayi(n, 'dy', 0)
          el.set(
            n.ad,
            tekOge(
              tahta.create('point', [() => kaynak.X() + dx, () => kaynak.Y() + dy], {
                name: n.etiket ?? n.ad,
                withLabel: Boolean(n.etiket),
                size: n.stil.noktaBoyutu,
                fillColor: g.renk.dolgu,
                strokeColor: g.renk.kenar,
                strokeWidth: 2,
                fixed: true,
                visible: n.gorunur,
                label: etiketAyari,
                layer: 9,
              }),
            ),
          )
          break
        }

        case 'nokta_donme':
        case 'nokta_homoteti': {
          // Iki nokta donusumu ayni kaliba oturuyor: kaynagi merkeze gore
          // ya dondururuz (aci) ya da olcekleriz (oran). Sekli bir butun
          // olarak donusturmek yerine koseleri tek tek donusturup uzerine
          // cokgen kurmayi tercih ettik: ogrenci hangi kosenin nereye
          // gittigini goruyor ve kose kose eslestirebiliyor.
          const kaynak = bul(baglilar(n, 'kaynak', 'uc1')[0] ?? '') as JXG.Point | undefined
          const merkez = bul(baglilar(n, 'merkez')[0] ?? '') as JXG.Point | undefined
          if (!kaynak || !merkez) break
          const donuk = n.tip === 'nokta_donme'
          const t = (sayi(n, 'aci', 90) * Math.PI) / 180
          const oran = sayi(n, 'oran', 2)
          const konum = (): [number, number] => {
            const dx = kaynak.X() - merkez.X()
            const dy = kaynak.Y() - merkez.Y()
            return donuk
              ? [dx * Math.cos(t) - dy * Math.sin(t), dx * Math.sin(t) + dy * Math.cos(t)]
              : [dx * oran, dy * oran]
          }
          el.set(
            n.ad,
            tekOge(
              tahta.create(
                'point',
                [() => merkez.X() + konum()[0], () => merkez.Y() + konum()[1]],
                {
                  name: n.etiket ?? n.ad,
                  withLabel: Boolean(n.etiket),
                  size: n.stil.noktaBoyutu,
                  fillColor: g.renk.dolgu,
                  strokeColor: g.renk.kenar,
                  strokeWidth: 2,
                  fixed: true,
                  visible: n.gorunur,
                  label: etiketAyari,
                  layer: 9,
                },
              ),
            ),
          )
          break
        }

        case 'dik_izdusum': {
          // Bir noktanin bir dogru uzerindeki dik izdusumu: yuksekligin
          // ayagi, Oklid bagintisindaki ayak noktasi. Dikme cizip kesisim
          // almak da mumkun ama iki fazla nesne demek.
          const kaynak = bul(baglilar(n, 'kaynak', 'uc1')[0] ?? '')
          const dogru = bul(baglilar(n, 'uzerinde', 'hedef')[0] ?? '')
          if (!kaynak || !dogru) break
          el.set(
            n.ad,
            tekOge(
              tahta.create('orthogonalprojection', [kaynak as never, dogru as never], {
                name: n.etiket ?? n.ad,
                withLabel: Boolean(n.etiket),
                size: n.stil.noktaBoyutu,
                fillColor: g.renk.dolgu,
                strokeColor: g.renk.kenar,
                strokeWidth: 2,
                visible: n.gorunur,
                label: etiketAyari,
                layer: 9,
              }),
            ),
          )
          break
        }

        case 'cember': {
          const merkez = bul(baglilar(n, 'merkez')[0] ?? '')
          if (!merkez) break
          const uzerinde = baglilar(n, 'uzerinde', 'yaricap_noktasi')[0]
          const ikinci = uzerinde ? bul(uzerinde) : undefined
          // Yaricap uc noktalariyla verilmisse cember o uzunlugu alir:
          // pergel acikligini bozmadan baska bir merkeze tasimak demek.
          // JSXGraph cember ebeveyni olarak nokta cifti kabul etmiyor;
          // uzunlugu hesaplayan bir islev veriyoruz. Boylece uc noktalar
          // oynayinca yaricap da canli guncelleniyor.
          const [ucA, ucB] = baglilar(n, 'uc1', 'uc2').map(bul) as [
            JXG.Point | undefined,
            JXG.Point | undefined,
          ]
          const yaricapTanimi =
            ucA && ucB
              ? () => Math.hypot(ucB.X() - ucA.X(), ucB.Y() - ucA.Y())
              : (ikinci ?? sayi(n, 'yaricap', 1))
          const cember = tahta.create(
            'circle',
            [merkez as never, yaricapTanimi as never],
            {
              strokeColor: g.strokeColor,
              strokeWidth: g.strokeWidth,
              dash: g.dash,
              fillOpacity: 0,
              visible: n.gorunur,
              fixed: true,
              highlight: false,
              layer: 4,
            },
          )
          el.set(n.ad, tekOge(cember))
          break
        }

        case 'dogru_parcasi':
        case 'isin':
        case 'vektor':
        case 'dogru': {
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul)
          if (!a || !b) break
          const tur =
            n.tip === 'dogru_parcasi'
              ? 'segment'
              : n.tip === 'vektor'
                ? 'arrow'
                : n.tip === 'isin'
                  ? 'axis'
                  : 'line'
          const cizgi = tahta.create(tur, [a as never, b as never], {
            strokeColor: g.strokeColor,
            strokeWidth: g.strokeWidth,
            dash: g.dash,
            visible: n.gorunur,
            fixed: true,
            highlight: false,
            straightFirst: n.tip === 'dogru',
            straightLast: n.tip !== 'dogru_parcasi' && n.tip !== 'vektor',
            layer: 5,
          })
          el.set(n.ad, tekOge(cizgi))
          break
        }

        case 'cokgen': {
          const koseler = baglilar(n, 'kose').map(bul).filter(Boolean)
          if (koseler.length < 3) break
          const cokgen = tahta.create('polygon', koseler as never[], {
            fillColor: g.fillColor,
            fillOpacity: g.fillOpacity,
            borders: {
              strokeColor: g.renk.kenar,
              strokeWidth: g.strokeWidth,
              highlight: false,
            },
            vertices: { visible: false },
            hasInnerPoints: false,
            visible: n.gorunur,
            highlight: false,
            layer: 3,
          })
          el.set(n.ad, tekOge(cokgen))
          break
        }

        case 'olcum_uzunluk': {
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul) as [
            JXG.Point | undefined,
            JXG.Point | undefined,
          ]
          if (!a || !b) break
          const uzunluk = () => Math.hypot(b.X() - a.X(), b.Y() - a.Y())
          const yazi = tahta.create(
            'text',
            [
              () => (a.X() + b.X()) / 2,
              () => (a.Y() + b.Y()) / 2,
              () => `${n.etiket ? `${n.etiket} = ` : ''}${olcuMetni(uzunluk(), olcek)}`,
            ],
            {
              fontSize: 13,
              strokeColor: g.renk.kenar,
              anchorX: 'middle',
              anchorY: 'middle',
              cssStyle: `font-family: inherit; font-weight: 600; background: ${p.yuzey}; padding: 1px 5px; border-radius: 5px`,
              visible: n.gorunur,
              fixed: true,
              highlight: false,
              layer: 10,
            },
          )
          el.set(n.ad, tekOge(yazi))
          break
        }

        case 'olcum_oran': {
          // Iki dogru parcasinin uzunluk orani. Trigonometrik oranlar
          // bununla canli okunuyor: aci degisince sin, cos, tan da
          // degisiyor ve ogrenci hangi kenarin hangisine bolundugunu
          // ekranda goruyor. Konum, pay parcasinin ortasinin biraz ustu.
          const uzunlugu = (x: JXG.GeometryElement | undefined) => {
            const c = x as (JXG.Line & { point1?: JXG.Point; point2?: JXG.Point }) | undefined
            if (!c?.point1 || !c.point2) return 0
            return Math.hypot(c.point2.X() - c.point1.X(), c.point2.Y() - c.point1.Y())
          }
          const pay = bul(baglilar(n, 'kaynak', 'uc1')[0] ?? '') as JXG.Line | undefined
          const payda = bul(baglilar(n, 'hedef', 'uc2')[0] ?? '') as JXG.Line | undefined
          if (!pay || !payda) break
          const yer = pay as JXG.Line & { point1?: JXG.Point; point2?: JXG.Point }
          const yazi = tahta.create(
            'text',
            [
              () => ((yer.point1?.X() ?? 0) + (yer.point2?.X() ?? 0)) / 2,
              () => ((yer.point1?.Y() ?? 0) + (yer.point2?.Y() ?? 0)) / 2 + sayi(n, 'dy', 0.7),
              () => {
                const b = uzunlugu(payda)
                const deger = b < 1e-9 ? null : uzunlugu(pay) / b
                return `${n.etiket ?? 'oran'} = ${deger === null ? 'tanımsız' : deger.toFixed(3)}`
              },
            ],
            {
              fontSize: 13,
              strokeColor: g.renk.kenar,
              anchorX: 'middle',
              anchorY: 'middle',
              cssStyle: `font-family: inherit; font-weight: 700; background: ${p.yuzey}; padding: 1px 6px; border-radius: 5px`,
              visible: n.gorunur,
              fixed: true,
              highlight: false,
              layer: 10,
            },
          )
          el.set(n.ad, tekOge(yazi))
          break
        }

        case 'olcum_egim': {
          // Iki nokta arasindaki egim: analitik geometride dogrunun
          // kimligi. Dikey dogruda tanimsiz oldugu icin oyle yaziliyor.
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul) as [
            JXG.Point | undefined,
            JXG.Point | undefined,
          ]
          if (!a || !b) break
          const egim = () => {
            const dx = b.X() - a.X()
            return Math.abs(dx) < 1e-9 ? null : (b.Y() - a.Y()) / dx
          }
          const yazi = tahta.create(
            'text',
            [
              () => (a.X() + b.X()) / 2,
              () => (a.Y() + b.Y()) / 2 + 0.6,
              () => {
                const m = egim()
                return `${n.etiket ?? 'eğim'} = ${m === null ? 'tanımsız' : m.toFixed(2)}`
              },
            ],
            {
              fontSize: 13,
              strokeColor: g.renk.kenar,
              anchorX: 'middle',
              anchorY: 'middle',
              cssStyle: `font-family: inherit; font-weight: 600; background: ${p.yuzey}; padding: 1px 5px; border-radius: 5px`,
              visible: n.gorunur,
              fixed: true,
              highlight: false,
              layer: 10,
            },
          )
          el.set(n.ad, tekOge(yazi))
          break
        }

        case 'aci':
        case 'olcum_aci': {
          // Aci saat yonunun TERSINE olculur: uc1'den merkez etrafinda
          // donerek uc2'ye. Kollar ters sirada verilirse ic aci yerine
          // donuk aci okunur (39 yerine 321 gibi). Sahne yazarken kural:
          // ilk kol, ikincisinden saat yonunde geride olmali.
          const uc = baglilar(n, 'uc1', 'uc2').map(bul) as Array<JXG.Point | undefined>
          const merkez = bul(baglilar(n, 'merkez')[0] ?? '') as JXG.Point | undefined
          const [a, b] = uc
          if (!a || !b || !merkez) break
          const yay = tahta.create('angle', [a as never, merkez as never, b as never], {
            radius: 1.4,
            fillColor: g.renk.dolgu,
            fillOpacity: g.fillOpacity,
            strokeColor: g.renk.kenar,
            strokeWidth: 1.5,
            withLabel: false,
            visible: n.gorunur,
            fixed: true,
            highlight: false,
            layer: 6,
          })
          // Etiketi kendimiz yaziyoruz: JSXGraph'in varsayilan bicimi yerine
          // derece ve virgullu ayirici Turkce okunusa uygun olsun diye.
          const olcu = yay as unknown as { Value(): number }
          tahta.create(
            'text',
            [
              () => merkez.X() + 2.1 * Math.cos(orta(a, merkez, b)),
              () => merkez.Y() + 2.1 * Math.sin(orta(a, merkez, b)),
              () => `${derece(olcu.Value()).toFixed(0)}°`,
            ],
            {
              fontSize: 13,
              strokeColor: g.renk.kenar,
              anchorX: 'middle',
              anchorY: 'middle',
              cssStyle: `font-family: inherit; font-weight: 600; background: ${p.yuzey}; padding: 1px 5px; border-radius: 5px`,
              visible: n.gorunur,
              fixed: true,
              highlight: false,
              layer: 10,
            },
          )
          el.set(n.ad, tekOge(yay))
          break
        }

        case 'orta_nokta': {
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul)
          if (!a || !b) break
          el.set(
            n.ad,
            tekOge(
              tahta.create('midpoint', [a as never, b as never], {
                name: n.etiket ?? n.ad,
                withLabel: Boolean(n.etiket),
                size: n.stil.noktaBoyutu,
                fillColor: g.renk.dolgu,
                strokeColor: g.renk.kenar,
                strokeWidth: 2,
                visible: n.gorunur,
                label: etiketAyari,
                layer: 9,
              }),
            ),
          )
          break
        }

        case 'paralel':
        case 'dikme': {
          // Kaynak bir dogru, uzerinde ise gececegi nokta.
          const dogru = bul(baglilar(n, 'kaynak', 'eksen')[0] ?? '')
          const nokta = bul(baglilar(n, 'uzerinde', 'uc1')[0] ?? '')
          if (!dogru || !nokta) break
          const tur = n.tip === 'paralel' ? 'parallel' : 'perpendicular'
          el.set(
            n.ad,
            tekOge(
              tahta.create(tur, [dogru as never, nokta as never], {
                strokeColor: g.strokeColor,
                strokeWidth: g.strokeWidth,
                dash: g.dash,
                visible: n.gorunur,
                fixed: true,
                highlight: false,
                layer: 5,
              }),
            ),
          )
          break
        }

        case 'kesisim': {
          const [a, b] = baglilar(n, 'kesisen_a', 'kesisen_b').map(bul)
          if (!a || !b) break
          // Ucuncu parametre kacinci kesisim noktasi oldugunu soyler; iki
          // cemberin kesisiminde iki nokta vardir.
          const sira = Math.round(sayi(n, 'kesisim_sirasi', 0))
          el.set(
            n.ad,
            tekOge(
              tahta.create('intersection', [a as never, b as never, sira], {
                name: n.etiket ?? n.ad,
                withLabel: Boolean(n.etiket),
                size: n.stil.noktaBoyutu,
                fillColor: g.renk.dolgu,
                strokeColor: g.renk.kenar,
                strokeWidth: 2,
                visible: n.gorunur,
                label: etiketAyari,
                layer: 9,
              }),
            ),
          )
          break
        }

        case 'aci_ortay': {
          const uc = baglilar(n, 'uc1', 'uc2').map(bul)
          const merkez = bul(baglilar(n, 'merkez')[0] ?? '')
          const [a, b] = uc
          if (!a || !b || !merkez) break
          el.set(
            n.ad,
            tekOge(
              tahta.create('bisector', [a as never, merkez as never, b as never], {
                strokeColor: g.strokeColor,
                strokeWidth: g.strokeWidth,
                dash: g.dash,
                visible: n.gorunur,
                fixed: true,
                highlight: false,
                layer: 5,
              }),
            ),
          )
          break
        }

        case 'orta_dikme': {
          // Iki noktanin orta dikmesi: bir kenarin orta noktasindan gecen
          // ve o kenara dik olan dogru. Ucgende cevrel merkezi veren
          // dogrulardan biri.
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul) as [
            JXG.Point | undefined,
            JXG.Point | undefined,
          ]
          if (!a || !b) break
          const orta = tahta.create('midpoint', [a as never, b as never], { visible: false })
          // Kenara dik dogrultu: (-dy, dx). Ikinci nokta da islevle
          // verildigi icin uclar oynayinca dikme canli guncelleniyor.
          const ikinci = tahta.create(
            'point',
            [
              () => orta.X() - (b.Y() - a.Y()),
              () => orta.Y() + (b.X() - a.X()),
            ],
            { visible: false, fixed: true },
          )
          el.set(
            n.ad,
            tekOge(
              tahta.create('line', [orta as never, ikinci as never], {
                strokeColor: g.strokeColor,
                strokeWidth: g.strokeWidth,
                dash: g.dash,
                visible: n.gorunur,
                fixed: true,
                highlight: false,
                layer: 5,
              }),
            ),
          )
          break
        }

        case 'teget': {
          // Iki kullanim: cember uzerindeki bir surgunun tegeti, ya da
          // disaridaki bir noktadan cembere cizilen teget.
          const surgu = bul(baglilar(n, 'uzerinde')[0] ?? '')
          const cember = bul(baglilar(n, 'kaynak', 'merkez')[0] ?? '')
          const dis = bul(baglilar(n, 'hedef')[0] ?? '')
          const ortak = {
            strokeColor: g.strokeColor,
            strokeWidth: g.strokeWidth,
            dash: g.dash,
            visible: n.gorunur,
            fixed: true,
            highlight: false,
            layer: 5,
          }
          if (surgu) {
            el.set(n.ad, tekOge(tahta.create('tangent', [surgu as never], ortak)))
          } else if (cember && dis) {
            el.set(
              n.ad,
              tekOge(
                tahta.create('tangentto', [cember as never, dis as never], {
                  ...ortak,
                  polar: { visible: false },
                  point: { visible: false },
                }),
              ),
            )
          }
          break
        }

        case 'duzgun_cokgen': {
          // Iki komsu koseden ve kenar sayisindan uretilir: kenar sayisi
          // degistikce ic aci toplaminin nasil degistigi burada gorunur.
          const [a, b] = baglilar(n, 'uc1', 'uc2', 'kose').map(bul) as [
            JXG.Point | undefined,
            JXG.Point | undefined,
          ]
          if (!a || !b) break
          const kenar = Math.max(3, Math.round(sayi(n, 'kenar_sayisi', 5)))
          el.set(
            n.ad,
            tekOge(
              tahta.create('regularpolygon', [a as never, b as never, kenar], {
                name: n.etiket ?? '',
                withLabel: Boolean(n.etiket),
                fillColor: g.fillColor,
                fillOpacity: g.fillOpacity,
                highlightFillOpacity: g.fillOpacity,
                borders: { strokeColor: g.strokeColor, strokeWidth: g.strokeWidth },
                // Duzgun cokgeni JSXGraph kendi yardimci koselerini
                // uretecek sekilde kuruyor; onlar sahnede gorunmemeli.
                vertices: { visible: false, fixed: true, withLabel: false },
                visible: n.gorunur,
                layer: 2,
              }),
            ),
          )
          break
        }

        case 'agirlik_merkezi':
        case 'ic_merkez':
        case 'cevrel_merkez':
        case 'ic_teget_cember':
        case 'cevrel_cember': {
          // Ucgenin uc kosesinden turetilen merkezler ve cemberler.
          const [a, b, c] = baglilar(n, 'uc1', 'uc2', 'uc3', 'kose').map(bul) as [
            JXG.Point | undefined,
            JXG.Point | undefined,
            JXG.Point | undefined,
          ]
          if (!a || !b || !c) break
          const noktaAyar = {
            name: n.etiket ?? n.ad,
            withLabel: Boolean(n.etiket),
            size: n.stil.noktaBoyutu,
            fillColor: g.renk.dolgu,
            strokeColor: g.renk.kenar,
            strokeWidth: 2,
            visible: n.gorunur,
            label: etiketAyari,
            layer: 9,
          }
          const cemberAyar = {
            strokeColor: g.strokeColor,
            strokeWidth: g.strokeWidth,
            dash: g.dash,
            fillColor: g.fillColor,
            fillOpacity: g.fillOpacity,
            visible: n.gorunur,
            highlight: false,
            layer: 2,
            center: { visible: false },
            point: { visible: false },
          }
          const uc = [a as never, b as never, c as never] as const
          if (n.tip === 'agirlik_merkezi') {
            // JSXGraph'te hazir agirlik merkezi yok; uc kosenin ortalamasi.
            el.set(
              n.ad,
              tekOge(
                tahta.create(
                  'point',
                  [
                    () => (a.X() + b.X() + c.X()) / 3,
                    () => (a.Y() + b.Y() + c.Y()) / 3,
                  ],
                  { ...noktaAyar, fixed: true },
                ),
              ),
            )
          } else if (n.tip === 'ic_merkez') {
            el.set(n.ad, tekOge(tahta.create('incenter', [...uc], noktaAyar)))
          } else if (n.tip === 'cevrel_merkez') {
            el.set(n.ad, tekOge(tahta.create('circumcenter', [...uc], noktaAyar)))
          } else if (n.tip === 'ic_teget_cember') {
            el.set(n.ad, tekOge(tahta.create('incircle', [...uc], cemberAyar)))
          } else {
            el.set(n.ad, tekOge(tahta.create('circumcircle', [...uc], cemberAyar)))
          }
          break
        }

        case 'yay':
        case 'daire_dilimi': {
          const merkez = bul(baglilar(n, 'merkez')[0] ?? '')
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul)
          if (!merkez || !a || !b) break
          const tur = n.tip === 'yay' ? 'arc' : 'sector'
          el.set(
            n.ad,
            tekOge(
              tahta.create(tur, [merkez as never, a as never, b as never], {
                strokeColor: g.renk.kenar,
                fillColor: g.renk.dolgu,
                fillOpacity: n.tip === 'daire_dilimi' ? g.fillOpacity : 0,
                strokeWidth: g.strokeWidth,
                visible: n.gorunur,
                fixed: true,
                highlight: false,
                layer: 4,
              }),
            ),
          )
          break
        }

        case 'yansima': {
          // Bir nesnenin bir dogruya gore ayna goruntusu. Kaynak nokta ya
          // da cokgen olabilir; eksen rolu ayna dogrusunu tasir.
          const kaynak = bul(baglilar(n, 'kaynak', 'uc1')[0] ?? '')
          const eksen = bul(baglilar(n, 'eksen')[0] ?? '')
          if (!kaynak || !eksen) break
          el.set(
            n.ad,
            tekOge(
              tahta.create('reflection', [kaynak as never, eksen as never], {
                name: n.etiket ?? n.ad,
                withLabel: Boolean(n.etiket),
                size: n.stil.noktaBoyutu,
                fillColor: g.renk.dolgu,
                strokeColor: g.renk.kenar,
                strokeWidth: g.strokeWidth,
                fillOpacity: g.fillOpacity,
                visible: n.gorunur,
                label: etiketAyari,
                layer: 3,
              }),
            ),
          )
          break
        }

        case 'olcum_alan':
        case 'olcum_cevre': {
          // Kaynak bir cokgen; olcum onun uzerinde metin olarak durur.
          const kaynak = bul(baglilar(n, 'kaynak', 'uc1')[0] ?? '') as
            | (JXG.GeometryElement & {
                Area?(): number
                Perimeter?(): number
                vertices?: JXG.Point[]
                center?: JXG.Point
              })
            | undefined
          if (!kaynak) break
          // Cokgende agirlik merkezi, daire diliminde merkez kullanilir.
          const koseler = kaynak.vertices ?? (kaynak.center ? [kaynak.center] : [])
          const merkezX = () =>
            koseler.length ? koseler.slice(0, -1).reduce((t, v) => t + v.X(), 0) / (koseler.length - 1) : 0
          const merkezY = () =>
            koseler.length ? koseler.slice(0, -1).reduce((t, v) => t + v.Y(), 0) / (koseler.length - 1) : 0
          const deger = () =>
            n.tip === 'olcum_alan' ? (kaynak.Area?.() ?? 0) : (kaynak.Perimeter?.() ?? 0)
          // Etiket verilmediyse olcumun ne oldugu yazilir: iki sayi yan yana
          // durunca hangisinin alan hangisinin cevre oldugu anlasilmiyordu.
          const onEk = n.etiket ?? (n.tip === 'olcum_alan' ? 'alan' : 'çevre')
          // Ikisi de agirlik merkezinde duruyordu; cevre biraz asagi alindi.
          const kaydir = n.tip === 'olcum_cevre' ? -0.9 : 0
          const yazi = tahta.create(
            'text',
            [
              merkezX,
              () => merkezY() + kaydir,
              () => `${onEk} = ${olcuMetni(deger(), olcek, n.tip === 'olcum_alan' ? 2 : 1)}`,
            ],
            {
              fontSize: 14,
              strokeColor: g.renk.kenar,
              anchorX: 'middle',
              anchorY: 'middle',
              cssStyle: `font-family: inherit; font-weight: 700; background: ${p.yuzey}; padding: 2px 7px; border-radius: 6px`,
              visible: n.gorunur,
              fixed: true,
              highlight: false,
              layer: 10,
            },
          )
          el.set(n.ad, tekOge(yazi))
          break
        }

        case 'metin': {
          const yazi = tahta.create(
            'text',
            [sayi(n, 'x'), sayi(n, 'y'), n.etiket ?? ''],
            {
              fontSize: 14,
              strokeColor: g.renk.kenar,
              cssStyle: 'font-family: inherit; font-weight: 600',
              visible: n.gorunur,
              fixed: true,
              layer: 10,
            },
          )
          el.set(n.ad, tekOge(yazi))
          break
        }

        default:
          // Desteklenmeyen tip sessizce atlanir; sahne yine de acilir.
          break
      }
    } catch {
      // Tek bir nesnenin kurulamamasi butun sahneyi goturmesin.
    }
  }

  tahta.unsuspendUpdate()

  // Kurulamayan nesne sessizce atlaniyor (desteklenmeyen tip, eksik
  // bagimlilik, motorun reddettigi bir kurulus). Sahne yine aciliyor ama
  // eksik aciliyor - icerik yazarken bunun fark edilmemesi en kotusu.
  if (el.size < sahne.nesneler.length) {
    const eksik = sahne.nesneler.filter((n) => !el.has(n.ad)).map((n) => `${n.ad} (${n.tip})`)
    console.warn(`[sahne:${sahne.slug}] kurulamayan nesne: ${eksik.join(', ')}`)
  }

  return el
}

/** Aci yayinin orta dogrultusu - olcum etiketini oraya koyuyoruz. */
function orta(a: JXG.Point, merkez: JXG.Point, b: JXG.Point): number {
  const t1 = Math.atan2(a.Y() - merkez.Y(), a.X() - merkez.X())
  const t2 = Math.atan2(b.Y() - merkez.Y(), b.X() - merkez.X())
  let fark = t2 - t1
  while (fark <= -Math.PI) fark += 2 * Math.PI
  while (fark > Math.PI) fark -= 2 * Math.PI
  return t1 + fark / 2
}

/**
 * Adim vurgusu: secili nesneler one cikar, digerleri soluklasir.
 * Vurgu listesi bossa her sey normale doner.
 */
export function vurgula(kurulum: Kurulum, adlar: string[]): void {
  const vurgulu = new Set(adlar)
  for (const [ad, oge] of kurulum) {
    const secili = vurgulu.size === 0 || vurgulu.has(ad)
    try {
      oge.setAttribute({
        strokeOpacity: secili ? 1 : 0.28,
        fillOpacity: secili
          ? ((oge.visProp as { fillopacity?: number }).fillopacity ?? 1)
          : 0.12,
      })
    } catch {
      /* bazi ogeler bu ozellikleri tasimaz */
    }
  }
  const ilk = kurulum.values().next().value
  ilk?.board.update()
}
