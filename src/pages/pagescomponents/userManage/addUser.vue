<template>
  <div id="addUser">
    <div class="addUser_Con">
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">工号：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入工号"
              suffix-icon="iconfont icon-xinghao"
              v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">用户名：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入用户名"
              suffix-icon="iconfont icon-xinghao"
              v-model="input2">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">姓名：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入姓名"
              suffix-icon="iconfont icon-xinghao"
              v-model="input3">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">部门：</span>
            <span class="textFontColor">*</span>
            <treeselect
              :options="options1"
              placeholder="请选择部门"
              :default-expand-level="10"
              :normalizer="normalizer"
              v-model="selectValue1"
            />

          </div>
        </el-col>
        <el-col :span="8">
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

        <el-col :span="8">
          <div class="demo-input-suffix">
            <div class="block">
              <span class="demonstration ">入职时间：</span>
              <span class="textFontColor">*</span>
              <el-date-picker
                style="width: 193px;"
                v-model="valueDate"
                @change="statusDataFn"
                type="date"
                placeholder="选择日期">
              </el-date-picker>

            </div>
          </div>
        </el-col>
      </el-row>

      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">手机号：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入手机号"
              suffix-icon="iconfont icon-xinghao"
              v-model="tel">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">E-mail：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入E-mail"
              suffix-icon="iconfont icon-xinghao"
              v-model="email">
            </el-input>
          </div>
        </el-col>

      </el-row>
      <div class="addUser_Con_btn">
        <!--权限：userAddUser-->
        <button type="button" class="el-button el-button--primary " @click="savecanceFn(0)">
          <span>提交</span></button>
        <button type="button" class="el-button el-button--info" @click="savecanceFn(1)"><span>取消</span></button>
        <!--classify-->
      </div>

    </div>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'

  export default {
    data () {
      return {
        // 新增 用户管理-新增用户
        userAddUser: false,
        input1: '',
        input2: '',
        input3: '',
        selectValue1: null,
        selectValue2: null,
        valueDate: '',
        options1: [],
        options2: [],
        // 入职时间
        entryTime: '',
        tel: '',
        email: '',
        classify: ''
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.path == '/adduser') {
          this.privilegesMenuFn()
          this.emptyAll()
          this.getuserdata()

        }

      },
      selectValue1 (val, oldVal) {
        console.log(val)
        var _this = this
        _this.selectValue2 = null
        // 岗位列表
        _this.$http.post('/user/posi/getPosiByDeptId.json', _this.qs.stringify({
          deptId: val
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options2 = res.data.resMsg
              console.log(res.data.resMsg)

            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      selectValue2 (val, oldVal) {
        console.log('岗位-selectValue2: ' + val)
      }
    },

    created () {

      this.privilegesMenuFn()
      this.getuserdata()
    },
    mounted () {
      jq('.index_Con_right_con').height(jq(window).height() - 160 + 'px')
    },
    methods: {
      //清空表单
      emptyAll () {
        this.input1 = ''
        this.input2 = ''
        this.input3 = ''
        this.selectValue1 = null
        this.selectValue2 = null
        this.entryTime = ''
        this.valueDate = ''
        this.tel = ''
        this.email = ''
      },
      selectGet1 (val) {
        console.log(val)
      },
      selectGet2 (val) {
        console.log(val)
      },

      getuserdata () {
        let _this = this

        if (_this.$route.params.classify == 'add') {
          _this.classify = _this.$route.params.classify
        } else {
          _this.classify = ''
        }
        _this.emptyAll()

        // classify

        // 部门列表
        _this.$http.get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options1 = res.data.resMsg
              // console.log(res.data.resMsg)
            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //确定 清空
      savecanceFn (num) {
        let _this = this
        // _this.privilegesMenuFn()
        if (num == 0) {
          // 新增用户
          // 手机号验证

          // 邮箱验证
          if (_this.tel == '' || _this.tel == null) {
            _this.$notify({
              title: '错误',
              message: '手机号不可为空',
              type: 'error',
              duration: 3000
            })
            return
          }
          if (_this.email == '' || _this.email == null) {
            _this.$notify({
              title: '错误',
              message: '邮箱不可为空',
              type: 'error',
              duration: 3000
            })
            return
          }

          _this.$http.post('/user/addUser.json', _this.qs.stringify({
            jobNumber: _this.input1,
            username: _this.input2,
            realname: _this.input3,
            deptId: _this.selectValue1,
            positionId: _this.selectValue2,
            entryTime: _this.entryTime,
            tel: _this.tel,
            email: _this.email

          }))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.$notify({
                  title: '成功',
                  message: res.data.resMsg,
                  type: 'success',
                  duration: 3000
                })
                _this.emptyAll()
                setTimeout(function () {
                  _this.$router.push({
                    name: 'userlist',
                     path: '/userlist'
                   })
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

          //
          // this.$router.push({
          //   name: 'userlist',
          //   path: '/userlist'
          // })
        } else if (num == 1) {
          _this.emptyAll()
          _this.$router.go(-1)
        } else if (num == 2) {

        }
      },
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.userAddUser = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(localStorage.getItem('privilegesMenu'))
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userAddUser') {
            _this.userAddUser = true
          }
        }
      },

      // 部门/岗位
      normalizer (val) {
        // console.log(val)
      },

      //入职时间
      statusDataFn (val) {
        console.log(val)
        let time1 = this.moment(val).format('YYYY-MM-DD')
        this.entryTime = time1
      },

    },
    components: {
      Treeselect
    }
  }
</script>

<style lang="less">
  #addUser .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "";
      /*line-height: 37px;*/
      /*font-size: 1rem;*/
      /*color: red;*/
      /*padding-right: 6px;*/
    }
  }

  #addUser .elRow1 .el-col {
    text-align: left;
  }

  #addUser .elRow1 .el-input {
    width: 193px;
  }

  #addUser .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }

  }

  #addUser .vue-treeselect {
    width: 193px;
  }

  #addUser .demonstration {
    width: 70px;
    padding-top: 12px;
    display: inline-block;
  }

  #addUser .addusermust {
    position: absolute;
    /*margin-left: 165px;*/
    margin-left: -15px;
    margin-top: 15px;
    font-size: 0.5rem;
    color: red;
  }

  #addUser .treespan {
    position: absolute;
    color: red;
    margin: 10px 0 0 -26px;
    z-index: 1;
  }

  #addUser .textFontColor {
    color: red;
  }

  #addUser .vue-treeselect__control {
    width: 193px;
  }
</style>
