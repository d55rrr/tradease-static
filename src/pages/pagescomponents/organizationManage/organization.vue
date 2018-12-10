<template>
  <div id="organization" >
      <vo-basic  :direction="'l2r'" :data="orgData" :nodeContent = "'deptNo'" ></vo-basic>
  </div>
</template>

<script>
  import { VoBasic } from 'vue-orgchart'

  export default {
    components: { VoBasic },
    data () {
      return {
        // 部门树
        orgData: []
      }

    },
    created () {
      this.orgchartFn()
    },
    mounted () {

    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/organization') {
          let exists = document.getElementsByClassName("orgchart l2r")
          while (exists.length>1){
            exists[exists.length-1].parentElement.removeChild(exists[length-1])
          }
          this.orgchartFn()
        }
      }
    },
    methods: {
      orgchartFn () {

        let _this = this
        // 组织架构图接口
        _this.$http.get('/user/dept/getOrgTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.orgData = res.data.resMsg
            } else {
              alert(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },


    }
  }
</script>

<style lang="less">
  #organization {
    height: 100%;
  }
  #chart-container{
    min-height: 750px;
    padding-right: 90%;
    padding-top: 5%;
  }
  #organization .orgchart{
    background-image: none;
  }

  #organization .orgchart > table > tbody > tr:not(:last-child) {
    display: none !important;
  }

  #organization .orgchart > table > tr:not(:last-child) {
    display: none !important;
  }
  #organization .orgchart{
    min-width: 30% !important;
  }
</style>
