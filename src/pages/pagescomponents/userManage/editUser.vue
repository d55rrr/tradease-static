<template>
  <div id="editUser">
    <div class="editUser_Con">
      <el-row class="">
        <!--<el-col :span="8">-->
        <!--<div class="demo-input-suffix">-->
        <!--<span class="inlineBlock">用户名：</span>-->
        <!--<el-input-->
        <!--v-model="username">-->
        <!--</el-input>-->
        <!--</div>-->
        <!--</el-col>-->
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">用户名：</span>
            <span class="textFontColor">*</span>
            <el-input
              :disabled="true"
              v-model="username">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">姓名：</span>
            <span class="textFontColor">*</span>
            <el-input
              v-model="realname">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">手机号：</span>
            <span class="textFontColor">*</span>
            <el-input
              v-model="tel">
            </el-input>
          </div>
        </el-col>


      </el-row>

      <el-row class="">
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">部门：</span>
            <span class="textFontColor">*</span>
            <treeselect
              :options="options1"
              placeholder="请选择部门"
              :default-expand-level="10"
              :normalizer="normalizer"
              @select="bumenFn1"
              v-model="selectValue1"
            />

          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">岗位：</span>
            <span class="textFontColor">*</span>
            <treeselect
              :options="options2"
              placeholder="请选择岗位"
              :default-expand-level="10"
              :normalizer="normalizer"
              v-model="selectValue2"
            />

          </div>
        </el-col>

        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">E-mail：</span>
            <span class="textFontColor">*</span>
            <el-input
              v-model="email">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="editUser_Con_btn">
            <button type="button" class="el-button el-button--primary " @click="savecanceFn(0)"><span>提交</span></button>
            <button type="button" class="el-button el-button--info" @click="savecanceFn(1)"><span>取消</span></button>
          </div>
        </el-col>

      </el-row>
      <el-row class="">
        <el-col :span="8">
          <div class="editUser_Con_status">
            <span>状态：</span>
            <el-radio v-model="inService" label="1">在职</el-radio>
            <el-radio v-model="inService" label="2">离职</el-radio>
          </div>
        </el-col>
      </el-row>


    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        //用户数据
        id: '',
        username: '',
        deptId: '',
        realname: '',
        positionName: '',
        tel: '',
        email: '',
        // 单选
        inService: 0,

        valueDate: '',
        //请选择部门
        selectValue1: null,
        selectValue1Old: null,
        selectValue2: null,
        options1: [],
        options2: []
      }
    },

    watch: {
      '$route' (to, from) {
        if (to.path == '/edituser') {
          this.getuserdata()
        }
      },
    },

    created () {

      // 初始化用户数据
      this.getuserdata()
    },
    mounted () {
      jq('.index_Con_right_con').height(jq(window).height() - 160 + 'px')
    },
    methods: {
      // 拿到用户数据
      getuserdata () {
        var _this = this
        _this.id = this.$route.params.id
        _this.username = ''
        _this.realname = ''
        _this.tel = ''
        _this.selectValue1 = null
        _this.selectValue1Old = null
        _this.selectValue2 = null
        _this.email = ''
        _this.inService = '0'

        //用户信息改为请求接口
        _this.$http({
          url: '/user/getUser.json',
          method: 'get',
          params: {
            id: _this.id
          }

        })
          .then(res => {
            console.log(res.data.resMsg)
            if (res.data.resStatus == 1000) {
              _this.username = res.data.resMsg.username
              _this.realname = res.data.resMsg.realname
              _this.tel = res.data.resMsg.tel
              _this.selectValue1 = res.data.resMsg.deptId
              _this.selectValue1Old = res.data.resMsg.deptId
              _this.selectValue2 = res.data.resMsg.positionId
              _this.email = res.data.resMsg.email
              _this.inService = String(res.data.resMsg.inService)

              _this.bumenFn(this.selectValue1)

            }

          })

        // 部门列表
        _this.$http.get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options1 = res.data.resMsg
              // console.log(res.data.resMsg)
            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })

      },
      selectGet1 (val) {
        console.log(val)
      },
      selectGet2 (val) {
        console.log(val)
      },

      //确定 取消
      savecanceFn (num) {
        if (num == 0) {
          // 编辑用户
          let _this = this
          _this.$http.post('/user/updateUser.json', _this.qs.stringify({
            id: _this.id,
            realname: _this.realname,
            deptId: _this.selectValue1,
            positionId: _this.selectValue2,
            tel: _this.tel,
            email: _this.email,
            inService: _this.inService
          }))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.$notify({
                  title: '成功',
                  message: res.data.resMsg,
                  type: 'success',
                  duration: 3000
                })
                setTimeout(function () {
                  _this.$router.go(-1)
                  // _this.$router.push({
                  // name: 'userlist',
                  //   path: '/userlist'
                  // })
                }, 1000)

              } else {
                _this.$notify({
                  title: '错误',
                  message: res.data.resMsg,
                  type: 'error',
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
      },
      bumenFn (val) {
        console.log(this.selectValue1)
        let _this = this
        console.log(val)
        _this.$http.post('/user/posi/getPosiByDeptId.json', _this.qs.stringify({
          deptId: val
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options2 = res.data.resMsg
              // console.log(res.data.resMsg)

            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      bumenFn1 (val) {
        let _this = this
        // console.log(val.id)
        if (_this.selectValue1Old != val.id) {
          _this.selectValue2 = null
        }
        _this.$http.post('/user/posi/getPosiByDeptId.json', _this.qs.stringify({
          deptId: val.id
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options2 = res.data.resMsg
              // console.log(res.data.resMsg)

            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      normalizer (val) {
        // console.log(val)
      }
    }
  }
</script>

<style lang="less">
  #editUser .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #editUser .elRow1 .el-col {
    text-align: left;
  }

  #editUser .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }
  }

  #editUser .editUser_Con_status {
    padding-left: 32px;
  }

  #editUser .vue-treeselect__control {
    width: 199px;
  }

  #editUser .textFontColor {
    color: red;
  }
</style>
