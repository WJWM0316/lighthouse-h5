<template>
  <div @click="runs" :class="style" :disabled="disabled || time > 0">{{text}}</div>
</template>
<style scoped lang="less">
 div{
 	color: #D7AB70;
 }
</style>

<script>
  import index from './index.js'
  export default index
</script>
