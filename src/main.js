import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.scss'
import tUi from './components'


createApp(App).use(store).use(router).use(ElementPlus).use(tUi).mount('#app')
