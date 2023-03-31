import bar from './echarts/bar'

const components = [
    bar
]

export default {
    install(app) {
        components.map(item => {
            app.use(item)
        })
    }
}