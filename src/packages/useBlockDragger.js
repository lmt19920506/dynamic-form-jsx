import { reactive } from "vue"

export function useBlockDragger(focusData, lastSelectBlock, data) {
    console.log('focusData--', focusData)
    let dragState = {
        startX: 0,
        startY: 0
    }
    let markLine = reactive({
        x: null,
        y: null
    })

    const mousedown = (e) => {
        console.log('lastSelectBlock---', lastSelectBlock.value)
        const {width: BWidth, height: BHeight} = lastSelectBlock.value
        dragState = {
            startX: e.clientX,
            startY: e.clientY, // 记录每一个选中的位置
            startLeft: lastSelectBlock.value.left,  // B开始移动的left
            startTop: lastSelectBlock.value.top,    // B开始移动的top
            startPos: focusData.value.focus.map(({top, left}) => ({top, left})),
            lines: (() => {
                const {unfocused} = focusData.value  // 获取其他未选中的，以他们的位置做辅助线
                let lines = {x: [], y: []}  // 计算横线的位置用y来存放，x存的是纵向的
                unfocused.forEach(block => {
                    const {top: ATop, left: ALeft, width: AWidth, height:AHeight} = block
                    lines.y.push({showTop: ATop, top: ATop})  // 顶对顶, 当此元素拖到和A元素top一致的时候，要现实这根辅助线，辅助线的位置就是ATop
                    lines.y.push({showTop: ATop, top: ATop - BHeight})  // 顶对底
                    lines.y.push({showTop: ATop + AHeight/2, top: ATop + AHeight/2 - BHeight/2}) // 中对中
                    lines.y.push({showTop: ATop + AHeight, top: ATop + AHeight})  // 底对顶
                    lines.y.push({showTop: ATop + AHeight, top: ATop + AHeight - BHeight})  // 底对底
                    lines.x.push({showLeft: ALeft, left: ALeft})  // 左对左
                    lines.x.push({showLeft: ALeft + AWidth, left: ALeft + AWidth})  // 右对左
                    lines.x.push({showLeft: ALeft + AWidth/2, left: ALeft + AWidth/2 - BWidth/2})  // 中对中
                    lines.x.push({showLeft: ALeft + AWidth, left: ALeft + AWidth - BWidth})  // 右对右
                    lines.x.push({showLeft: ALeft, left: ALeft - BWidth})  // 右对左
                })
                // console.log('line---', lines)
                return lines
            })()
        }
        console.log('dragState---', dragState)
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }

    const mousemove = (e) => {
        let {clientX: moveX, clientY: moveY} = e

        // 计算当前移动元素B最新的left和top，去线里面找，找到显示线
        // 移动元素最新的left = 鼠标移动后 - 鼠标移动前 + left
        let left = moveX - dragState.startX + dragState.startLeft
        let  top = moveY - dragState.startY + dragState.startTop

        // 先计算横线，距离参照物还有5像素的时候，就显示着根线
        let y = null
        let x = null
        for (let i = 0; i < dragState.lines.y.length; i++) {
            const {top: t, showTop: s} = dragState.lines.y[i]  // 获取每一根线
            if (Math.abs(t - top) < 5) {  // 如果小于5，说明接近了
                y = s  // 线要显示的位置
                moveY = dragState.startY - dragState.startTop + t  // 最新的moveY = 容器距离顶部的距离 + 目标的高度(视频45分钟处 )
                break
            }
        }
        for (let i = 0; i < dragState.lines.x.length; i++) {
            const {left: l, showLeft: s} = dragState.lines.x[i]  // 获取每一根线
            if (Math.abs(l - left) < 5) {  // 如果小于5，说明接近了
                x = s  // 线要显示的位置
                moveX = dragState.startX - dragState.startLeft + l  // 最新的moveY = 容器距离顶部的距离 + 目标的高度(视频45分钟处 )
                break
            }
        }
        markLine.x = x  // markLine是响应式数据，x y更新了 会导致视图更新
        markLine.y = y

        let durX = moveX - dragState.startX  // 计算出拖拽之前和拖拽之后，横向的距离
        let durY = moveY - dragState.startY   // 计算出移动的y轴距离（计算出拖拽之前和拖拽之后，纵向的距离）

        focusData.value.focus.forEach((block, idx) => {
            block.top = dragState.startPos[idx].top + durY
            block.left = dragState.startPos[idx].left + durX
        })

    }

    const mouseup = (e) => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
    }
    return {
        mousedown,
        markLine
    }
}