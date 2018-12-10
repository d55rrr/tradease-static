<template>
  <div id="login">
    <div class="login_Sky_top">

    </div>
    <div class="login_Sky_foot">

    </div>
    <div class="login_content">
      <div class="login_content_logo"></div>
      <div class="login_content_input">
        <input type="text" class="login_content_input_username" v-model="username" @click="username_nothing(0)"
               value="username">
        <input type="password" class="login_content_input_password" v-model="password" @click="username_nothing(1)"
               value="password">
        <div class="login_content_input_loginlostpass">
          <input type="button" class="login_content_input_loginlostpass_loginbtn" value="登录" @click="loginSubmit">
          <!--<input type="checkbox" class="login_content_input_loginlostpass_lostpassbtn"-->
          <!--@change="rebnamepassFn" v-model="check"> -->
          <el-checkbox @change="rebnamepassFn" v-model="check"><i>记住密码</i></el-checkbox>
          <i>忘记密码？</i>
        </div>
      </div>
    </div>
    <div class="login_foot">
      <div class="login_foot_loginbm">Copyright ©Hanshow. All Rights Reserved.</div>
    </div>
  </div>
</template>
<script>
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
      let _this = this
      document.onkeydown=function(event) {
        let e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){
          _this.loginSubmit()
        }
      }
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

        this.$router.push({
          path: '/indexlist'
        })

        let _this = this
        console.log(_this.username, _this.password)
        if ((_this.username).trim() == '') {
          alert('用户名不可为空')
          return
        }
        if ((_this.password).trim() == '') {
          alert('密码不可为空')
          return
        }
        //登录接口
        localStorage.setItem('username1',_this.username)
        _this.$http.post('/user/doLogin.json', _this.qs.stringify({
          username: _this.username,
          password: _this.password
        }))
          .then(function (res) {
            let resStatus = res.data.resStatus
            // console.log(resStatus)
            // console.log(res.data.params.resMsg)
            // console.log(res.params.resMsg)
            if (resStatus == 1000) {
              sessionStorage.setItem('system_login_update_time',new Date().getTime())
              _this.$router.push({
                path: '/indexlist'
              })
            } else {
              alert(res.data.resMsg)
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
</style>

