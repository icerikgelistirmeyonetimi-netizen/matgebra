import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'

/**
 * Rotalar.
 *
 * Uc tik kurali: sinif -> konu -> sahne. Daha derin bir kirilim yeni sayfa
 * acmaz, liste icinde acilir. Her rota kendi modulunden tembel yuklenir.
 */
const rotalar: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'siniflar',
    component: () => import('../moduller/mufredat/SiniflarGorunumu.vue'),
    meta: { baslik: 'Sınıflar', modul: 'mufredat' },
  },
  {
    path: '/sinif/:seviye',
    name: 'konular',
    component: () => import('../moduller/mufredat/KonularGorunumu.vue'),
    props: true,
    meta: { modul: 'mufredat' },
  },
  {
    path: '/konu/:slug',
    name: 'konu',
    component: () => import('../moduller/mufredat/KonuGorunumu.vue'),
    props: true,
    meta: { modul: 'mufredat' },
  },
  {
    path: '/sahne/:slug',
    name: 'sahne',
    component: () => import('../moduller/sahne/SahneGorunumu.vue'),
    props: true,
    meta: { modul: 'sahne', genis: true },
  },
  {
    path: '/calisma-kagidi/:slug',
    name: 'calisma-kagidi',
    component: () => import('../moduller/ogrenme/CalismaKagidi.vue'),
    props: true,
    meta: { modul: 'ogrenme', genis: true },
  },
  {
    path: '/tuval',
    name: 'tuval',
    component: () => import('../moduller/cizim/TuvalGorunumu.vue'),
    meta: { baslik: 'Serbest Tuval', modul: 'cizim', genis: true },
  },
  {
    path: '/olasilik',
    name: 'olasilik',
    component: () => import('../moduller/olasilik/LaboratuvarGorunumu.vue'),
    meta: { baslik: 'Olasılık Laboratuvarı', modul: 'olasilik' },
  },
  {
    path: '/yonetim',
    name: 'yonetim',
    component: () => import('../moduller/yonetim/YonetimGorunumu.vue'),
    meta: { baslik: 'Yönetim', modul: 'yonetim', genis: true },
  },
  {
    path: '/kutuphane',
    name: 'kutuphane',
    component: () => import('../moduller/kutuphane/KutuphaneGorunumu.vue'),
    meta: { baslik: 'Kütüphane', modul: 'kutuphane' },
  },
]

/**
 * Statik yayinda hash gecmisi kullanilir: GitHub Pages tek sayfa uygulamasi
 * icin geri donus (fallback) sunmadigindan /konu/abc gibi derin baglantilar
 * 404 verir. Sunuculu kipte temiz adresler korunur.
 */
const gecmis =
  import.meta.env.VITE_STATIK === '1'
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory()

export const yonlendirici = createRouter({
  history: gecmis,
  routes: rotalar,
  scrollBehavior: () => ({ top: 0 }),
})
