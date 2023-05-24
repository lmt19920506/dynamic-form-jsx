import { events } from "./events"

export function useLeftMenuDrag(containerRef, data) {
    // console.log('use drag---', data)
    let currentComponent = null
    const dragenter = e => {
        // console.log('dragenter---', e)
        e.dataTransfer.dropEffect = 'move'
    }
    const dragover = e => {
        e.preventDefault()
    }
    const dragleave = e => {
        e.dataTransfer.dropEccect = 'none'
        // console.log('drop leave---', e)
    }
    const drop = e => {
        // console.log('current-component---', currentComponent)
        console.log('data--', data.value)

        let blocks = data.value.blocks // 内部已经渲染的组件
        data.value = {
            ...data.value, blocks: [
                ...blocks,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    key: currentComponent.key,
                    zIndex: 1,
                    alignCenter: true, // 定义一个标识，是拖拽过来的元素，drop的时候，鼠标在元素中心点
                }
            ]
        }
        console.log('after---', data.value)

        currentComponent = null  // 3.然后在drop的时候清空
    }
    const dragstart = (e, component) => {
        // console.log('drag start---', e)
        // console.log('drag start---', component)
        // console.log('container ref---', containerRef.value)
        // dragenter进入元素中，添加一个移动的标识
        // dragover 在目标元素经过，必须要阻止默认行为，否则不能出发drop
        // dragleave 离开元素的时候，需要添加一个禁用表示
        // drop 松手的时候，根据拖拽的组件 添加一个组件
        containerRef.value.addEventListener('dragenter', dragenter)
        containerRef.value.addEventListener('dragover', dragover)
        containerRef.value.addEventListener('dragleave', dragleave)
        containerRef.value.addEventListener('drop', drop)
        currentComponent = component  // 2.开始拖的时候把当前被拖的赋值给currentComponent
        events.emit('start')  // 发布start   每次拖拽前发布事件
    }
    const dragend = (e) => {  // 移除事件监听
        containerRef.value.removeEventListener('dragenter', dragenter)
        containerRef.value.removeEventListener('dragover', dragover)
        containerRef.value.removeEventListener('dragleave', dragleave)
        containerRef.value.removeEventListener('drop', drop)
        events.emit('end')  // 每次拖拽后派发事件
    }

    return {
        dragstart,
        dragend
    }
}