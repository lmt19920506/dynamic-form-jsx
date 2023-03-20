import { defineComponent, computed, inject, ref } from "vue";
import './editor.scss'
import editorBlock from "./editor-block";
import { useLeftMenuDrag } from './useLeftMenuDragger'
import { useFocus } from './useFocus.js'
export default defineComponent({
    components: {
        editorBlock
    },
    props: {
        modelValue: {
            type: Object
        }
    },
    emits: ['update:modelValue'],  // 要触发的事件
    setup(props, ctx) {
        console.log('props---', props.modelValue)
        const data = computed({
            get() {
                return props.modelValue
            },
            set(newVal) {
                ctx.emit('update:modelValue', newVal)
            }
        })
        console.log('props-data---', data.value)
        const containerStyle = computed(() => ({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px'
        }))

        const config = inject('config')
        const containerRef = ref(null)

        // 1.实现左侧菜单的拖拽功能
        const { dragstart, dragend } = useLeftMenuDrag(containerRef, data)  // 实现左侧菜单拖拽功能
        // 2.实现获取焦点,选中后就可以直接进行拖拽了
        let dragState = {
            startX: 0,
            startY: 0
        }
        const mousemove = (e) => {
            let {clientX: moveX, clientY: moveY} = e
            let durX = moveX - dragState.startX  // 计算出x轴的距离
            let durY = moveY - dragState.startY   // 计算出移动的y轴距离

            focusData.value.focus.forEach((block, idx) => {
                block.top = dragState.startPos[idx].top + durY
                block.left = dragState.startPos[idx].left + durX
            })

        }
        const mousedown = (e) => {
            dragState = {
                startX: e.clientX,
                startY: e.clientY, // 记录每一个选中的位置
                startPos: focusData.value.focus.map(({top, left}) => ({top, left}))
            }
            console.log('dragState---', dragState)
            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        }
        const mouseup = (e) => {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
        }
        const { blockMouseDown, containerMouaedown, focusData } = useFocus(data, (e) => {
            // 多选之后，可以获取到哪些被选中了
            mousedown(e)  // 回调函数
            console.log('hah000---', focusData.value.focus)
        })

        // 3.实现拖拽多个元素的功能



        
        return () => <div class="editor">
            <div class="editor-left">
                {/* 根据注册列表，渲染对应的内容   可以实现h5的拖拽 */}
                {
                    config.componentList.map(item => (
                        <div class="editor-left-item" draggable onDragstart={e => dragstart(e, item)} onDragend={dragend}>
                            <span>{item.label}</span>
                            {item.preview()}
                        </div>
                    ))
                }
            </div>
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性控制</div>
            <div class="editor-container">
                {/* 负责产生滚动条 */}
                <div class="editor-container-canvas">
                    {/* 产品内容区域 */}
                    <div class="editor-container-canvas_content" style={containerStyle.value} ref={containerRef} onMousedown={containerMouaedown}>
                        {
                            (data.value.blocks.map(block => (
                                <editorBlock class={block.focus ? 'editor-block-focus' : ''} block={block} onMousedown={e => blockMouseDown(e, block)}></editorBlock>
                            )))
                        }
                    </div>
                </div>
            </div>
        </div>
    }
}) 