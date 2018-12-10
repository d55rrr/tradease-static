<template>
  <div id="department">
    <div class="department_Con">
      <div class="departmentcon">
        <div class="departmentcon_left">
          <p class="departmentcon_left_btn">
            <button v-if="userDeptSaveDept" @click="empty" type="button" class="el-button el-button--primary">
              <span>新建</span></button>
            <button v-if="userDeptUpdateDept" @click="savedept" type="button" class="el-button el-button--success">
              <span>保存</span></button>
            <button v-if="userDeptDeleteDept" @click="deldept" type="button" class="el-button el-button--danger"><span>删除</span>
            </button>
          </p>
          <div v-if="userDeptGetDeptTree">
            <vueztree ref="deptTree"></vueztree>
          </div>
          <!-- <vue-ztree :list.sync='ztreeDataSource' :func='nodeClick'  :contextmenu='contextmenuClick' :is-open='true'></vue-ztree> -->
        </div>
        <div class="departmentcon_right">

          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span>上级部门：</span>
                <span class="textFontColorHidden">*</span>
                <span v-if="radio == 1">
                    <el-input class="bumenInput" :disabled="true" placeholder="无上级部门"></el-input>
                </span>
                <span v-if="radio != 1">
                <treeselect
                  :options="option1"
                  placeholder="请输入上级部门"
                  :default-expand-level="10"
                  :normalizer="normalizer"
                  v-model="optionValue1"
                />
                </span>
              </div>
            </el-col>
          </el-row>

          <!--<el-row  class="elRow2">-->
          <!--<el-col :span="24">-->
          <!--<div class="demo-input-suffix">-->
          <!--<span>部门编号：</span>-->
          <!--<span>部门编号：</span>-->
          <!--<el-input class="bumenInput" :disabled="true" v-model="optionValue2" placeholder="自动生成部门编号"></el-input>-->
          <!--</div>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span>部门名称：</span>
                <span class="textFontColor">*</span>
                <el-input v-model="optionValue3" placeholder="请输入部门名称"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2 ">
            <el-col :span="24" class="elRowText">
              <div>是否分公司：</div>
              <div>
                <span class="textFontColorHidden">*</span>
                <el-radio @change="radioFn" v-model="radio" label="1">是</el-radio>
                <el-radio @change="radioFn" v-model="radio" label="2">否</el-radio>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="department_Con_btn">
        <!--<button type="button" class="el-button el-button&#45;&#45;primary " @click="savecanceFn"><span>返回</span></button>-->
      </div>
    </div>
  </div>
</template>

<script>
  // import vueZtree  from '../../../components/vue-ztree'
  import vueztree from '../../../components/ztree'

  export default {
    data () {
      return {
        // 新增权限
        userDeptSaveDept: false,
        // 删除权限
        userDeptDeleteDept: false,
        // 修改权限
        userDeptUpdateDept: false,
        // 部门树权限
        userDeptGetDeptTree: false,

        id: '',
        // 单选
        radio: '2',
        option1: [],
        option2: [],
        option3: [],
        optionValue1: null,
        optionValue2: '',
        optionValue3: '',
        // openMark: false,
        setting: {},

        // deptTreeVal: '',

      }
    },
    created () {
      let _this = this
      _this.deptTree()
      _this.eventsBus.$on('ztreeVal', function (val) {
        console.log('GGGGG', val)
        _this.deptTree()
        _this.id = val.id
        if (val.parentDeptId != 0) {
          _this.optionValue1 = val.parentDeptId
        } else {
          _this.optionValue1 = null
        }

        _this.optionValue2 = val.deptNo
        _this.optionValue3 = val.name
        _this.radio = String(val.subStatus)
        // console.log(_this.id)

        //树状右侧数据显示

      })
      _this.privilegesMenuFn()
    },
    mounted () {
      // 局部样式适配
      jq('.departmentcon').height(jq(window).height() - 200 + 'px')
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/department') {
          // this.ztree()
          this.privilegesMenuFn()
        }
      }
    }
    ,
    methods: {
      changeIcon(data){
        let _this=this
        data.forEach(item=>{
          if(!item.children){
            console.log('changeIcon')
            item.isParent=true
          }else{
            _this.changeIcon(item.children)
          }
        })
      },
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.userDeptSaveDept = false
        _this.userDeptDeleteDept = false
        _this.userDeptUpdateDept = false
        _this.userDeptGetDeptTree = false

        _this.privilegesMenuArr = []

        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        // 新增岗位
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userDeptSaveDept') {
            _this.userDeptSaveDept = true
          }
          if (_this.privilegesMenuArr[i] == 'userDeptDeleteDept') {
            _this.userDeptDeleteDept = true
          }
          if (_this.privilegesMenuArr[i] == 'userDeptUpdateDept'  || _this.privilegesMenuArr[i] == 'userDeptSaveDept') {
            _this.userDeptUpdateDept = true
          }
          if (_this.privilegesMenuArr[i] == 'userDeptGetDeptTree') {
            _this.userDeptGetDeptTree = true
          }
          //
        }
        // 局部样式适配
        jq('.departmentcon').height(jq(window).height() - 200 + 'px')
      },

      radioFn (val) {
        // console.log(val)
        this.radio = String(val)
        if (this.radio == '1') {

        }
      },
      // 点击节点
      nodeClick: function (m) {
        console.log(JSON.parse(JSON.stringify(m)))
      }
      ,
      // 右击事件
      contextmenuClick: function (m) {
        console.log(m)
        console.log('触发了自定义的contextmenuClick事件')
      },

      normalizer () {
      },
      // 部门树
      deptTree () {
        let _this = this
        _this.$http
          .get('/user/dept/getDeptTree.json')
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
             console.log('here',res.data.resMsg)
              let data=res.data.resMsg
              _this.changeIcon(data)
              _this.option1 = data
              _this.$refs.deptTree.refreshFn()
            }
          })

      },
      empty () {
        this.id = 0
        this.optionValue1 = null
        this.optionValue2 = ''
        this.optionValue3 = ''
        this.radio = '2'
      },
      savedept () {
        //新增/编辑部门
        let _this = this
        if (_this.id && _this.id != 0) {
          // 编辑
          _this.$http.post('/user/dept/updateDept.json', _this.qs.stringify({
            id: _this.id,
            parentDeptId: _this.optionValue1,
            name: _this.optionValue3,
            subStatus: _this.radio

          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
                _this.$notify({
                  title: '成功',
                  message: res.data.resMsg,
                  type: 'success',
                  duration: 3000
                })
                let reloadArr = []
                reloadArr.push(_this.id)
                reloadArr.push(_this.optionValue1)
                reloadArr.push(_this.optionValue3)
                reloadArr.push(_this.radio)
                _this.eventsBus.$emit('treeReload', reloadArr)
                _this.deptTree()
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
          //新建
          _this.$http.post('/user/dept/saveDept.json', _this.qs.stringify({
            parentDeptId: _this.optionValue1,
            name: _this.optionValue3,
            subStatus: _this.radio

          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
                _this.$notify({
                  title: '成功',
                  message: res.data.resMsg,
                  type: 'success',
                  duration: 3000
                })
                let reloadArr = []
                reloadArr.push(_this.optionValue1)
                reloadArr.push(_this.optionValue3)
                reloadArr.push(_this.radio)
                _this.eventsBus.$emit('treeReload', reloadArr)
                _this.deptTree()

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

        }

      },

      deldept () {
        //删除部门
        let _this = this
        _this.$http.post('/user/dept/deleteDept.json', _this.qs.stringify({
          id: _this.id,
        }))
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '成功',
                message: res.data.resMsg,
                type: 'success',
                duration: 3000
              })
              let reloadArr = []
              reloadArr.push(_this.id)
              reloadArr.push(_this.optionValue1)
              reloadArr.push(_this.optionValue3)
              reloadArr.push(_this.radio)
              _this.eventsBus.$emit('treeReload', reloadArr)
              _this.deptTree()
              _this.id = 0
              _this.optionValue1 = null
              _this.optionValue2 = ''
              _this.optionValue3 = ''
              _this.radio = 0

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

      },
    }
    ,
    components: {
      vueztree
    }
  }
</script>

<style lang="less">
  #department .orgchartcon {
    width: 100%;
    height: 400px;
  }

  #department .ztree {
    margin-top: 20px;
  }

  #department .elRowText > div {
    float: left;
  }

  #department .bumenInput, #department .bumenInput > input,#department .el-input > input {
    height: 33px;
  }

  #department .el-row .el-input {
    width: 177px;
  }

  #department .textFontColor {
    color: red;
  }
  #department .textFontColorHidden {
    color: #FFFFFF;
  }
  /*#department .vue-treeselect__control {*/
  /*width: 199px !important;*/
  /*}*/
</style>
