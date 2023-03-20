import { computed } from "vue"

export function useFocus(data, callback) {  // 获取哪些元素被选中了
    const blockMouseDown = (e, block) => {
        console.log('down---', block)
        e.preventDefault()
        e.stopPropagation()
        // block上定义一个属性:focus， 获取焦点后focus变为true,
        // block.focus = !block.focus ? true : false
        if (!block.focus) {
            if (e.shiftKey) {
                block.focus = !block.focus
            } else {
                clearBlockFocus()
                block.focus = true
            }
        } else {
            block.focus = false
        }
        // 按钮触发完后就出发callback
        callback(e)
    }

    const clearBlockFocus = () => {  // 清除其他block被选中的状态
        data.value.blocks.forEach(block => block.focus = false)
    }

    const containerMouaedown = () => {
        clearBlockFocus()  // 点击容器让选中的元素失去焦点
    }


    // 哪些选中，哪些没选中
    const focusData = computed(() => {
        let focus = []
        let unfocused = []
        data.value.blocks.forEach(block => (block.focus ? focus : unfocused).push(block))
        return {
            focus,
            unfocused
        }
    })

    return {
        blockMouseDown,
        containerMouaedown,
        focusData
    }
}