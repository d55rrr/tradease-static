<template>

</template>

<script>
  export default {
    watch: {
      //监听路由变化
      '$route' (to, from) {
      }
    },
    created () {
      this.emptyTopost()
    },
    methods: {
      //跳转回post页面
      emptyTopost () {
        let _this = this
        _this.$router.push({
          name: 'post',
          path: '/post'
        })

      }
    }
  }
</script>

<style scoped>

</style>
