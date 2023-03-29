# vue3_draggable_form

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

App.vue:
定义一个json，主要是用于渲染的，container定义了容器的宽度和高度，整个数据传入了Editor这个组件中，
同样，在editor-config配置了一些物料，componentList是所有物料的列表，componentMap是映射关系， registerConfig.registerregister去注册物料，
有了这个注册列表之后呢， 就在App.vue根组件直接provide（‘config’， config）提供出去，那么在所有自组件可以通过inject注入进去，
然后editor.jsx里面，会收到modelValue这个属性， 因为<Editor>用的是v-model，在vue3里面，它绑定数据，默认的名字就叫modelValue，事件名就叫update:modelValue,我们这样去绑定数据可以让数据实现双向绑定，数据变了可以把数据更新出去，所以在prop里面接受modelValue这个属性，同样在emits里面，通过['update:modelValue']可以出触发这个值的更新，
我们把modelValue传过来的属性作为自己的状态，
