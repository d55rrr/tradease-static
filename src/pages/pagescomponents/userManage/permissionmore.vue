<template>
  <div id="permissionmore">
    <div class="permissionmore_Con">
      <div class="permissionmore_Con_tit">
        <p class="permissionmore_Con_tit_text">用户名：</p>
        <div class="permissionmore_Con_tit_con">

          <!-- <p class="permissionmoreActive">王大王</p> -->
          <!--<p class="permissionmoreActive" v-for="(item,index) in userdata" :key="index">{{item.name}}</p>-->
          <el-checkbox-group v-model="permissionmoreUserList">
            <el-checkbox disabled v-for="(item) in userarrName" :key="item.id">
              {{item}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="permissionmore_Con_user">
        <p class="permissionmore_Con_user_text">角色分配：</p>
        <div class="permissionmore_Con_user_con">
          <el-checkbox-group v-model="permissionmorecheckList">
            <el-checkbox v-for="(item) in permissionmoreChecked" :key="item.id" @change="checkboxFn"
                         :label="item.id">{{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="permissionmore_Con_btn">
        <button type="button" class="el-button el-button--primary " @click="savecanceFn(0)"><span>提交</span></button>
        <button type="button" class="el-button el-button--info" @click="savecanceFn(1)"><span>取消</span></button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        //用户选中变量
        permissionmoreUserList: [],

        //授权选中变量
        permissionmorecheckList: [],
        //用户数据变量
        userdata: [],

        // 批量选中用户ID的集合
        userarrId: [],
        // 批量选中用户Name的集合
        userarrName: [],
        permissionmoreChecked: ''
      }
    },
    watch: {
      '$route' (to, from) {
        // 更新用户数据
        console.log(to.path)
        if (to.path == '/permissionmore') {

          this.getuserdata()
        }
      }
    },
    created () {
      //用户数据
      this.userdata = [
        {
          name: '王大王',
          id: '0'
        },
        {
          name: '王大王1',
          id: '1'
        },
        {
          name: '王大王2',
          id: '2'
        },
        {
          name: '王大王3',
          id: '3'
        }
      ]
    },
    mounted () {
      this.getuserdata()
    },
    methods: {
      getuserdata () {
        let _this = this
        // 拿到授权用户集合
        _this.userarrId = this.$route.params.userarrId
        _this.userarrName = this.$route.params.userarrName
        console.log(_this.userarrId)
        console.log(_this.userarrName)
        //用户列表
        _this.$http.post('/user/findUsersPage.json', _this.qs.stringify({
          currentPage: 1,
          pageSize: 100000
        }))
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              // console.log('DDDDD',res.data.resMsg.data)
              _this.userdata = res.data.resMsg.data
            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }

          })
          .catch(function (err) {
            console.log(err)
          })

        // 角色权限接口
        _this.$http.get('/user/role/getAllRole.json')
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              _this.permissionmoreChecked = res.data.resMsg
              console.log(res.data.resMsg)
            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }

          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //授权选中的复选框
      checkboxFn () {
        console.log(this.permissionmorecheckList)
      },
      // 用户选中复选框
      permissionmoreFn (val) {
        console.log(_this.permissionmoreUserList)
        let _this = this

      },
      savecanceFn (val) {
        let _this = this
        if (val == 0) {
          let userIds = String(_this.userarrId)
          let roleIds = String(_this.permissionmorecheckList)

          // console.log(roleIds)
          // 用户授权，分配角色
          console.log(userIds)
          console.log(roleIds)
          _this.$http.post('/user/assignRoleBatch.json', _this.qs.stringify({
            userIds: userIds,
            roleIds: roleIds

          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
                _this.permissionmorecheckList = []
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: res.data.resMsg,
                  duration: 3000

                })
                setTimeout(function () {
                  _this.$router.push({
                    name: 'userlist',
                    path: '/userlist'
                  })
                }, 1000)

              } else {
                // alert(res.statusText)
                console.log(res.data.resMag)
              }

            })
            .catch(function (err) {
              console.log(err)
            })

        } else {
          _this.$router.push({
            name: 'userlist',
            path: '/userlist'
          })
        }

      }
    }

  }
</script>

<style lang="less">
  #permissionmore .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #permissionmore .elRow1 .el-col {
    text-align: left;
  }

  #permissionmore .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }
  }

  #permissionmore .el-textarea__inner {
    width: initial;
  }

  #permissionmore .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #616161;
  }
  #permissionmore  .el-checkbox-group .is-disabled > span:first-child{
    display: none;
  }
  #permissionmore .permissionmore_Con_tit_con{
    overflow-y: auto !important;
  }
</style>
