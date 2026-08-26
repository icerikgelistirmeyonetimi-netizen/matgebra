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
          const apsis = bul(baglilar(n, 'apsis')[0] ?? '') as JXG.Point | undefined
          const ordinat = bul(baglilar(n, 'ordinat')[0] ?? '') as JXG.Point | undefined
          if (!apsis || !ordinat) break
          const nokta = tahta.create('point', [() => apsis.X(), () => ordinat.Y()], {
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
        case 'dogru': {
          const [a, b] = baglilar(n, 'uc1', 'uc2').map(bul)
          if (!a || !b) break
          const tur =
            n.tip === 'dogru_parcasi' ? 'segment' : n.tip === 'isin' ? 'axis' : 'line'
          const cizgi = tahta.create(tur, [a as never, b as never], {
            strokeColor: g.strokeColor,
            strokeWidth: g.strokeWidth,
            dash: g.dash,
            visible: n.gorunur,
            fixed: true,
            highlight: false,
            straightFirst: n.tip === 'dogru',
            straightLast: n.tip !== 'dogru_parcasi',
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
              () => `${n.etiket ? `${n.etiket} = ` : ''}${uzunluk().toFixed(2)}`,
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
            [merkezX, () => merkezY() + kaydir, () => `${onEk} = ${deger().toFixed(2)}`],
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
