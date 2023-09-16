<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 3
    }
  }

}

</script>

<style lang="less">
.box{
  width: 300px;
  height: 300px;
  border: 2px solid black;
}
</style>
