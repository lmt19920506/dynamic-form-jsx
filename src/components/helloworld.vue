<template>
  <div>{{ text }}</div>
</template>

<script>
export default {
    props: {
        text: {
            type: String || Number,
            default: ''
        }
    }
}
</script>

<style>

</style>