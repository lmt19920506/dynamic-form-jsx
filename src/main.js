import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.scss'
import tUi from './components'


createApp(App).use(store).use(router).use(ElementPlus).use(tUi).mount('#app')

// import { defineComponent, h, createApp } from "vue";
// import HelloWorld from './components/helloworld.vue'

// const App = defineComponent({
//     render() {
//         return h('div', {id: 'app'}, [
//             h(HelloWorld, {
//                 text: 'haha'
//             }),
//             h('h1', {
//                 class: 'showText'
//             }, '测试')
//         ])
//     }
// })

// createApp(App).mount('#app')
