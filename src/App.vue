<template>
  <div class="app">
    <editor v-model="state" />
  </div>
</template>
<script>
import {ref, provide} from 'vue'
import data from './data.json'
import editor from './packages/editor'
import { registerConfig as config } from './utils/editor-config'

export default {
  components: {
    editor
  },
  setup() {
    provide('config', config) // 将组件的配置直接传入
    const state = ref(data)

    return {
      state
    }
  },
}
</script>
<style lang="scss">
.app {
  width: 100%;
  height: 100%;
}
</style>
