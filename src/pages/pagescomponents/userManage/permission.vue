<template>
  <div id="permission">
    <div class="permission_Con">
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">用户名：</span>
            <el-input
              :disabled="true"
              placeholder=""
              v-model="username">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">姓名：</span>
            <el-input
              :disabled="true"
              placeholder=""
              v-model="realname">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">部门：</span>
            <el-input
              :disabled="true"
              placeholder=""
              v-model="bumen">
            </el-input>
          </div>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">岗位：</span>
            <el-input
              :disabled="true"
              placeholder=""
              v-model="ganwang">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <div class="permission_Con_user">
        <p class="permission_Con_user_text">角色分配：</p>
        <div class="permission_Con_user_con">
          <el-checkbox-group v-model="permissionChecked" @change="checkboxFn">
            <el-checkbox v-for="(item) in permissioncheckList" :key="item.id"
                         :label="item.id">{{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="permission_Con_btn">
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
        //授权选中变量
        permissioncheckList: [],
        //用户数据变量
        userdata: [],
        //多选数据
        permissionChecked: [],

        //用户数据
        username: '',
        name: '',
        bumen: '请选择部门',
        ganwang: '请选择岗位',
        valueDate: '',
        email: '',
        userIds: '',
        //权限回显
        getRoleIdsByUserId: ''

      }
    },
    watch: {
      '$route' (to, from) {
        // 更新用户数据
        if (to.path == '/permission') {
          this.getuserdata()
        }

      }
    },
    created () {
      this.getuserdata()

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
    methods: {
      // 拿到用户数据
      getuserdata () {
        this.userIds = this.$route.params.id
        this.username = ''
        this.realname = ''
        this.bumen = this.$route.params.deptName
        this.ganwang = this.$route.params.positionName
        this.permissionChecked = []
        // console.log(this.username, this.realname, this.bumen, this.ganwang)

        // 用户授权，获取用户已有角色列表
        let _this = this

        _this.$http({
          url: '/user/getRoleListByUserId.json',
          method: 'get',
          params: {
            userId: _this.userIds
          }

        })
          .then(res => {
            if (res.data.resStatus == 1000) {
              _this.username = res.data.resMsg.username
              _this.realname = res.data.resMsg.realname
              _this.bumen = _this.bumen
              _this.ganwang = _this.ganwang

              _this.permissioncheckList = res.data.resMsg.roleList
              _this.permissioncheckList.map(val => {
                if (val.selected == 1) {
                  _this.permissionChecked.push(val.id)
                  console.log(_this.permissionChecked)
                }

              })

              // _this.bumenFn(res.data.resMsg.positionId)

            }

          })

        //角色权限回显
        // _this.$http.post('/user/getRoleIdsByUserId.json', _this.qs.stringify({
        //   userId: _this.userIds
        // }))
        //   .then(function (res) {
        //     // console.log(res)
        //     if (res.data.resStatus == 1000) {
        //       // console.log(res.data.resMsg)
        //       _this.permissioncheckList = res.data.resMsg
        //
        //     } else {
        //       alert(res.statusText)
        //     }
        //
        //   })
        //   .catch(function (err) {
        //     console.log(err)
        //   })

      },
      //选中的复选框
      checkboxFn (val) {
        // console.log(this.permissioncheckList)
        // console.log(String(this.permissioncheckList))
      },
      savecanceFn (num) {
        if (num == 0) {

          let userIds = String(this.userIds)
          let roleIds = String(this.permissionChecked)
          console.log(roleIds)

          // 用户授权，分配角色
          let _this = this
          _this.$http.post('/user/assignRoleBatch.json', _this.qs.stringify({
            userIds: userIds,
            roleIds: roleIds

          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
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
                _this.$notify({
                  title: '错误',
                  type: 'error',
                  message: res.data.resMsg,
                  duration: 3000
                })
              }

            })
            .catch(function (err) {
              console.log(err)
            })

        } else {
          let _this = this
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
  #permission .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #permission .elRow1 .el-col {
    text-align: left;
  }

  #permission .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }
  }

  #permission .el-textarea__inner {
    width: initial;
  }
</style>
