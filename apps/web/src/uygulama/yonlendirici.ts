import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
    path: '/kutuphane',
    name: 'kutuphane',
    component: () => import('../moduller/kutuphane/KutuphaneGorunumu.vue'),
    meta: { baslik: 'Kütüphane', modul: 'kutuphane' },
  },
]

export const yonlendirici = createRouter({
  history: createWebHistory(),
  routes: rotalar,
  scrollBehavior: () => ({ top: 0 }),
})
