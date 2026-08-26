import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Kabuk from './uygulama/Kabuk.vue'
import { yonlendirici } from './uygulama/yonlendirici'
import './stil.css'

createApp(Kabuk).use(createPinia()).use(yonlendirici).mount('#uygulama')
