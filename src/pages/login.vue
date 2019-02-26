<template>
  <div id="login">
    <div class="login_content_logo">
     <!-- <img src="../assets/img/logo.png" style="margin-left: 20%;width: 200px;margin-top: 30px"/>-->
    </div>
    <div class="login_content">
      <div style=" width: 470px;float:right;margin-top: 5%;margin-right: 10%">
        <div style="text-align: center;font-size: 30px;padding: 15px;color: #FFFFFF">TRADEASE PLATFORM</div>
        <div class="login_content_input" style="display:flex;justify-content: center" >
          <el-form style="margin:10px;width: 80%;">
            <el-form-item >
              <span style="font-size: 18px;">用户登录</span><span style="color:#b3b3b3">&nbsp;&nbsp;UserLogin</span>
            </el-form-item>
            <el-form-item>
              <el-input  v-model="username"  >
                <i slot="prefix" class=" icon_user_name"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="password"   type="password" @keyup.enter.native="loginSubmit">
                <i slot="prefix" class=" icon_user_pass"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox @change="rebnamepassFn" v-model="check">记住密码</el-checkbox>
              <span style="float:right;">忘记密码？</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%" @click="loginSubmit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="login_foot">
      <div class="login_foot_loginbm">Copyright © 2019 TRADEASE All Rights Reserved.</div>
    </div>
  </div>
</template>
<script>
  import md5 from 'js-md5'
  export default {
    data () {
      return {
        username: '',
        password: '',
        //是否记住密码
        check: false
      }
    },
    created () {
    },
    mounted () {
      this.showunamepasFn()
    },
    watch: {
      '$route' (to, from) {
        this.showunamepasFn()
      }
    },
    methods: {
      // 初始判断用户名密码是否回显
      showunamepasFn () {
        let uname = localStorage.getItem('username')
        let pword = localStorage.getItem('password')
        if (uname && pword) {
          this.check = true
        }
        if (uname) {
          this.username = uname
        } else {
          this.username = ''
        }
        if (pword) {
          this.password = pword
        } else {
          this.password = ''
        }
      },
      // 记住密码
      rebnamepassFn (val) {
        this.check = val
        if (this.check) {
          localStorage.setItem('username', this.username)
          localStorage.setItem('password', this.password)
        } else {
          // localStorage.setItem('username', '')
          localStorage.setItem('password', '')
        }
      },
      loginSubmit () {
        let _this = this
        if ((_this.username).trim() == '') {
          alert('用户名不可为空')
          return
        }
        if ((_this.password).trim() == '') {
          alert('密码不可为空')
          return
        }
        //登录接口
        _this.$http.post('/sys/user/enterin', _this.qs.stringify({
          code1: _this.username,
          code2: md5(_this.password)+"tradease"
        }))
          .then(function (res) {
            let resStatus = res.data.code
            if (resStatus == 0) {
         /*     localStorage.setItem('username1',res.data.params.username)
              localStorage.setItem('realname',res.data.params.realname)
              localStorage.setItem('userId',res.data.params.userId)*/
              localStorage.setItem('system_login_update_time',new Date().getTime())
              //若登录前路径有意义进行跳转
//              let lastPath=sessionStorage.getItem("last_path")

                _this.$router.push({
                  path: '/salelist'
                })

            } else {
              alert(JSON.stringify(res.data))
            }

          })
          .catch(function (error) {
            console.log(error)
          })

      },
      //记住用户名密码
      username_nothing (v) {
        if (v == 0) {
          this.username = ''
        }
        if (v == 1) {
          this.password = ''
        }
      }
    }
  }
</script>


<style lang="less" scoped>
  @import url("../assets/less/login.less");
  .icon_user_name {
    margin: 5px;
    content: url(../assets/img/icon_account.png);
  }
  .icon_user_pass {
    margin: 5px;
    content: url(../assets/img/icon_password.png);
  }
</style>

