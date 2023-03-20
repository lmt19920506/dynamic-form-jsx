<template>
  <Item v-model="message"></Item>---{{ message }}
</template>

<script setup>
import {ref} from 'vue'
import Item from '@/packages/item.vue'
const message = ref('haha')
</script>

<style>

</style>