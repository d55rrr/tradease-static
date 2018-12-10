<template>
  <div id="editPost">
    <div class="editPost_Con">
      <el-row class="">
        <!--<el-col :span="8">-->
        <!--<div class="demo-input-suffix">-->
        <!--<span class="inlineBlock">用户名：</span>-->
        <!--<el-input-->
        <!--v-model="username">-->
        <!--</el-input>-->
        <!--</div>-->
        <!--</el-col>-->
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">用户名：</span>
            <el-input
              :disabled="true"
              v-model="username">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">姓名：</span>
            <el-input
              v-model="realname">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">手机号：</span>
            <el-input
              v-model="tel">
            </el-input>
          </div>
        </el-col>


      </el-row>

      <el-row class="">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">部门：</span>
            <treeselect
              :options="options1"
              placeholder="请选择部门"
              :default-expand-level="10"
              :normalizer="normalizer"
              @select="bumenFn"
              v-model="selectValue1"
            />

          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">岗位：</span>
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
            <span class="inlineBlock">E-mail：</span>
            <el-input
              v-model="email">
            </el-input>
          </div>
        </el-col>


      </el-row>
      <div class="editPost_Con_status">
        <span>状态：</span>
        <el-radio v-model="inService" label="1">在职</el-radio>
        <el-radio v-model="inService" label="2">离职</el-radio>
      </div>
      <div class="editPost_Con_btn">
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
        selectValue2: '2',
        options1: [],
        options2: []
      }
    },

    watch: {
      '$route' (to, from) {
        if (to.path == '/editPost') {
          // this.getuserdata()
        }
      },
      selectValue1 (val, oldVal) {
        console.log(val)
        var _this = this
        // 岗位列表
        _this.$http.post('/user/posi/getPosiByDeptId.json', _this.qs.stringify({
          deptId: val
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options2 = res.data.resMsg
              console.log(res.data.resMsg)

            } else {

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
      // 初始化用户数据
      this.getuserdata()
    },
    mounted () {
    },
    methods: {
      // 拿到用户数据
      getuserdata () {
        var _this = this
        _this.id = this.$route.params.id
        _this.username = this.$route.params.username
        _this.realname = this.$route.params.realname
        _this.deptId = this.$route.params.deptId
        _this.positionId = this.$route.params.positionId
        _this.tel = this.$route.params.tel
        _this.email = this.$route.params.email
        _this.inService = String(this.$route.params.inService)

        _this.selectValue1 = _this.deptId
        _this.selectValue2 = _this.positionId
        // console.log(this.username, this.realname, this.deptId, this.positionId, this.tel, this.email, this.inService)

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
                alert(res.data.resMsg)
                // _this.$router.push({
                //   name: 'userlist',
                //   path: '/userlist'
                // })
                _this.$router.go(-1)

              } else {
                alert(res.data.resMsg)
              }
            })
            .catch(function (err) {
              console.log(err)
            })

        } else {
          let _this = this
          _this.$router.go(-1)
        }
      },
      bumenFn () {
        this.selectValue2 = null
      },
      normalizer (val) {
        // console.log(val)
      }
    }
  }
</script>

<style lang="less">
  #editPost .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #editPost .elRow1 .el-col {
    text-align: left;
  }

  #editPost .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }
  }
</style>
