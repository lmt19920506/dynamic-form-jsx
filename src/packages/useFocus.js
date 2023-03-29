import { computed, ref } from "vue"

export function useFocus(data, callback) {  // 获取哪些元素被选中了
    const selectIndex = ref(-1)  // 定义一个最后被选中的元素，最初始值为-1，然后通过点击每个元素，将下标传入，然后根据下表就可以找到最后被选中的值是哪个了
    const lastSelectBlock = computed(() => data.value.blocks[selectIndex.value])  // 最后选中的那个元素
    const blockMouseDown = (e, block, index) => {
        // console.log('down---', block)
        e.preventDefault()
        e.stopPropagation()
        // block上定义一个属性:focus， 获取焦点后focus变为true,
        // block.focus = !block.focus ? true : false
        if (e.shiftKey) {
            if (focusData.value.focus.length <= 1) {
                block.focus = true  // 当前只有一个节点被选中时，摁住shift键也不会切换focus状态
            } else {
                block.focus = !block.focus
            }
        } else {
            if (!block.focus) {
                clearBlockFocus()
                block.focus = true  // 要清空其他人focus属性
            }  // 当自己已经被选中了，再次点击时还是选中状态
        }
        selectIndex.value = index
        // console.log('select -index---', selectIndex)
        // 按钮触发完后就出发callback
        callback(e)
    }

    const clearBlockFocus = () => {  // 清除其他block被选中的状态
        data.value.blocks.forEach(block => block.focus = false)
    }

    const containerMouaedown = () => {
        clearBlockFocus()  // 点击容器让选中的元素失去焦点
        selectIndex.value = -1  // 点容器外面的时候，将选中的index下标滞空
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
        focusData,
        lastSelectBlock
    }
}