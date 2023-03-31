import bar from './src/index.vue'

export default {
    install(app) {
        app.component('bar', bar)
    }
}