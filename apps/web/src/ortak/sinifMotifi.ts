/**
 * Sinif motifleri.
 *
 * Her sinif duzeyi, o duzeyde ogretilen geometrik fikri temsil eden bir
 * ikonla anilir. Sirali bir gorsel anlatim olusturur: yonden sekle,
 * sekilden olcuye, olcuden donusume, donusumden cisme.
 *
 * Motif adlari kartlarda ipucu (title) olarak gosterilir; boylece ikon
 * dekorasyon degil bilgi tasir.
 */

const MOTIFLER: Record<number, string> = {
  0: 'Fraktal ve kaplama',
  1: 'Yön, konum ve yönerge',
  2: 'Temel geometrik şekiller',
  3: 'Simetri doğrusu',
  4: 'Açı ölçme',
  5: 'Çokgen inşası',
  6: 'Çember, yarıçap ve pi',
  7: 'Daire dilimi',
  8: 'Pisagor bağıntısı',
  9: 'Eşlik ve benzerlik',
  10: 'Analitik düzlem ve trigonometri',
  11: 'Çokgen ve köşegenleri',
  12: 'Geometrik cisimler',
}

/** Sinif seviyesinin ikon anahtari. */
export function sinifIkonu(seviye: number): string {
  return seviye === 0 ? 'sinif-hz' : `sinif-${seviye}`
}

/** Motifin ne anlattigi - ipucu metni olarak kullanilir. */
export function sinifMotifAdi(seviye: number): string {
  return MOTIFLER[seviye] ?? 'Geometri'
}
