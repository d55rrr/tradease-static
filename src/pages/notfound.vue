<template>
    <div id="notfound" style="width: 100%;background: #DCDFE6" >
      <div style=" display: flex;justify-content: center;height:100vh;flex-direction: column;align-items: center;flex: 1">
        <span style="font-size: 20pt">很抱歉，您访问的页面不存在......</span>
        <span style="font-family:Helvetica Neue;font-size: 50pt">404 Not Found</span>
        <div style="margin-top: 10px">
          <el-button type="primary" plain @click="back">返回上一级</el-button>
          <el-button type="primary" plain @click="front">返回首页</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    methods:{
      back(){
        this.$router.go(-2)
      },
      front(){
        this.$router.push({
          path:'/indexlist'
        })
      }
    }
  }
</script>

<style scoped>

</style>
