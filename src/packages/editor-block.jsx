import {defineComponent, computed, inject, ref, onMounted} from 'vue'

export default defineComponent({
    props: {
        block: {
            type: Object
        }
    },
    setup(props) {
        console.log('props-editor-block---', props.block)
        const blockStyle = computed(() => ({
            top: props.block.top + 'px',
            left: props.block.left + 'px'
        }))
        const config = inject('config')
        const blockRef = ref(null)
        // console.log('test')

        onMounted(() => {
            const {offsetWidth, offsetHeight} = blockRef.value  // 获取从左侧拖过来盒子的宽高
            console.log('offsetwidth---', offsetWidth)
            console.log('offsetHeight---', offsetHeight)
            if (props.block.alignCenter) {  // 说明是拖拽松手的时候才渲染的，其他的默认渲染到页面上的内容不需要居中
                props.block.left = props.block.left - offsetWidth/2
                props.block.top = props.block.top - offsetHeight/2
                props.block.alignCenter = false  // 让渲染后的结果才能居中
            }
        })

        console.log('inject-config---', config)
        const component = config.componentMap[props.block.key]
        const renderComponent = component.render()
        return () => {
            return <div class="block" style={blockStyle.value} ref={blockRef}>
                {renderComponent}
            </div>
        }
    }
})