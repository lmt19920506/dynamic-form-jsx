import { defineComponent, computed, inject, ref } from "vue";
import './editor.scss'
import editorBlock from "./editor-block";
import transformLayer from './transformLayer.vue'
import { useLeftMenuDrag } from './useLeftMenuDragger'
import { useFocus } from './useFocus.js'
import { useBlockDragger } from "./useBlockDragger";
import { useCommond } from './useCommond'
export default defineComponent({
    components: {
        editorBlock, transformLayer
    },
    props: {
        modelValue: {
            type: Object
        }
    },
    emits: ['update:modelValue'],  // 要触发的事件
    setup(props, ctx) {
        // console.log('props---', props.modelValue)
        const data = computed({
            get() {
                return props.modelValue
            },
            set(newVal) {
                ctx.emit('update:modelValue', newVal)
            }
        })
        // console.log('props-data---', data.value)
        const containerStyle = computed(() => ({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px'
        }))

        const config = inject('config')
        const containerRef = ref(null)

        // 1.实现左侧菜单的拖拽功能
        const { dragstart, dragend } = useLeftMenuDrag(containerRef, data)  // 实现左侧菜单拖拽功能
        // 2.实现获取焦点,选中后就可以直接进行拖拽了
        const { blockMouseDown, containerMouaedown, focusData, lastSelectBlock } = useFocus(data, (e) => {
            // 多选之后，可以获取到哪些被选中了
            mousedown(e)  // 回调函数
            // console.log('hah000---', focusData.value.focus)
            // console.log('lastSelectBlock---1', lastSelectBlock.value)
        })
        // 3.实现组件拖拽
        let { mousedown, markLine } = useBlockDragger(focusData, lastSelectBlock, data)

        // 3.实现拖拽多个元素的功能

    const { commonds } = useCommond(data)
        const buttons = [
            { label: '撤销', handler: () => commonds.undo() },
            { label: '重做', handler: () => commonds.redo() },
        ]




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
            <div class="editor-top">
                {
                    buttons.map((btn, index) => {
                        return <div class="editor-top-button" onClick={btn.handler}>
                            <span>{btn.label}</span>
                        </div>
                    })
                }
            </div>
            <div class="editor-right">属性控制</div>
            <div class="editor-container">
                {/* 负责产生滚动条 */}
                <div class="editor-container-canvas">
                    {/* 产品内容区域 */}
                    <div class="editor-container-canvas_content" style={containerStyle.value} ref={containerRef} onMousedown={containerMouaedown}>
                        {
                            (data.value.blocks.map((block, index) => (
                                <editorBlock class={block.focus ? 'editor-block-focus' : ''} block={block} onMousedown={e => blockMouseDown(e, block, index)}></editorBlock>
                            )))
                        }
                        {
                            markLine.x !== null && <div class="line-x" style={{ left: markLine.x + 'px' }}></div>
                        }
                        {
                            markLine.y !== null && <div class="line-y" style={{ top: markLine.y + 'px' }}></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    }
}) 