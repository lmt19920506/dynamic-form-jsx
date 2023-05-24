import deepcopy from 'deepcopy'
import { onUnmounted } from 'vue'
import { events } from './events'

export function useCommond(data) {
    const state = {  // 前进后退需要指针
        current: -1,   // 前进后退的索引值
        queue: [],   // 存放所有的操作命令
        commonds: {},  // 制作命令和执行功能一个映射表， undo: () => {}  redo: () => {}
        commandArray: [],  // 存放所有的命令
        destoryArray: [],
    }
    const register = (commond) => {
        state.commandArray.push(commond)
        state.commonds[commond.name] = () => {  // 命令名字对应执行函数
            const { redo, undo } = commond.execute()
            redo()
            if (!commond.pushQueue) {  // 不需要放到队列中 直接跳过即可
                return 
            }
            let { queue, current } = state
            // 如果先放了 组件1 -》组件2 -》组件3 -》组件4 --》组件3
            // 组件1 -》组件3
            if (queue.length > 0) {
                queue = queue.slice(0, current + 1)  // 可能在放置的过程中有撤销操作，所以根据当前最新的current值来计算新的对了
                state.queue = queue
            }
            queue.push({redo, undo})  // 保存指令的前进后退
            state.current = current + 1 
            console.log('queue---', queue)
        }
    }
    // 注册我们需要的命令
    register({
        name: 'redo',
        keyboard: 'ctrl+y',
        execute() {
            return {
                redo() {
                    let item = state.queue[state.current + 1]  // 找到当前的下一步，还原操作
                    if (item) {
                        item.redo && item.redo()
                        state.current++
                    }
                }
            }
        }
    })
     register({  // 如果希望将操作放到队列中可以增加一个属性标识，等会操作要放到队列中
        name: 'undo',
        keyboard: 'ctrl+z',
        execute() {
            return {
                redo() {
                    if (state.current === -1) return  // 没有可以撤销的了
                    // 如果有，在队列中拿出当前的这个，
                    let item = state.queue[state.current]  // 找到上一步
                    if (item) {  // 看看有没有值，有的话，撤销，就调指令的undo
                        item.undo && item.undo()
                        state.current--
                    }
                }
            }
        }
    })
    register({
        name: 'drag',
        pushQueue: true,
        // 当我们默认注册这个指令的时候，它就会监控开始和之后，
        // 开始的时候会保存一个开始的状态， 结束的时候会调指令，
        // 调指令的时候，就可以拿到之前的状态，还有之后的状态
        // 当我们去调redo的时候，用之后的状态作为最新的内容 

        // 过一下逻辑： 我们要先进行一下初始化：init函数
        // 初始化的过程会绑定start事件，当拖拽之前，我们就记住当前拖拽的内容
        // 松手的时候，就调这个指令，调指令的时候，默认会做一次redo，会把当前的值更改了，
        // 调undo，就把值还原回去，

        init() {  // 初始化操作  默认就会执行
            this.before = null  // 初始化的时候，记住当前的状态
            // 监控拖拽开始事件，保存状态
            const start = () => this.before = deepcopy(data.value.blocks)
            // 拖拽之后需要触发对应的指令
            const end = () => state.commonds.drag()
            events.on('start', start)
            events.on('end', end)
            return () => {
                events.off('start', start)
                events.off('end', end)
            }
        },
        // 拖拽的redo和undo，分别存了之前的内容和之后的内容 redo之后的，undo之前的  
        execute() {  // state.commonds.drag()
            let before = this.before;
            let after = data.value.blocks  // 之后的状态
            return {
                redo() {  // 默认一松手，就直接把当前事做了
                    data.value = {
                        ...data.value,
                        blocks: after
                    }
                },
                undo() {  // 前一步的
                    data.value = {
                        ...data.value,
                        blocks: before
                    }
                }
            }
        }
    });
    const keyboardEvent = (() => {
        const keyCodes = {
            90: 'z',
            89: 'y'
        }
        const onKeydown = (e) => {
            const { ctrlKey, keyCode } = e  // ctrl + z  ctrl + y
            let keyString = []
            if (ctrlKey) keyString.push('ctrl')
            keyString.push(keyCodes[keyCode])
            keyString = keyString.join('+')

            state.commandArray.forEach(({ keyboard, name }) => {
                if (!keyboard) return  // 没有键盘事件
                if (keyboard === keyString) {
                    state.commonds[name]()
                    e.preventDefault();
                    
                }
            })
        }
        const init = () => {  // 初始化事件
            window.addEventListener('keydown', onKeydown)
            return () => {  // 销毁事件
                window.removeEventListener('keydown', onKeydown)
            }

        }
        return init
    })()

    ;(() => {
        state.destoryArray.push(keyboardEvent())
        state.commandArray.forEach(command => command.init && state.destoryArray.push(command.init()))
    })()
    onUnmounted(() => {  //   清理绑定的事件
        state.destoryArray.forEach(fn => fn && fn())
    })
    return state
}