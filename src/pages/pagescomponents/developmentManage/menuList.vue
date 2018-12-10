<template>
  <div id="menuList">
    <div  class="menuList_Con">
      <div class="menuListcon">
        <div class="menuListcon_left">
          <p class="menuListcon_left_btn">
            <button v-if="" @click="empty" type="button" class="el-button el-button--primary">
              <span>新建</span></button>
            <button v-if="" @click="savedept" type="button" class="el-button el-button--success">
              <span>保存</span></button>
            <button v-if="" @click="deldept" type="button" class="el-button el-button--danger">
              <span>删除</span></button>
          </p>
          <vueztree></vueztree>
          <!-- <vue-ztree :list.sync='ztreeDataSource' :func='nodeClick'  :contextmenu='contextmenuClick' :is-open='true'></vue-ztree> -->
        </div>
        <div class="menuListcon_right">

          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span style="padding-right: 29px;">上级菜单：</span>
                <treeselect
                  :options="option1"
                  placeholder="请选择上级菜单"
                  :default-expand-level="10"
                  :normalizer="normalizer"
                  v-model="pId"
                  @select="pIdFn"
                />
              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span style="padding-right: 29px;">菜单名称：</span>
                <span class="textFontColor">*</span>
                <el-input v-model="optionValue2" placeholder="请输入菜单名称"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span style="padding-right: 30px;">菜单顺序：</span>
                <el-input-number v-model="sortnum" @change="numCilckFn" :min="1" :max="1000"
                                 label="描述文字"></el-input-number>

              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span>路由名称(URL)：</span>
                <el-input v-model="optionValue3" placeholder="请输入路由名称"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2">
            <el-col :span="24">
              <div class="demo-input-suffix">
                <span style="padding-right: 8px;">功能操作分组：</span>
                <!--<treeselect-->
                <!--:options="option3"-->
                <!--placeholder="请输入部门名称"-->
                <!--:default-expand-level="10"-->
                <!--:normalizer="normalizer"-->
                <!--v-model="optionValue3"-->
                <!--/>-->

                <!--<treeselect-->
                <!--:options="option2"-->
                <!--placeholder="请输入功能操作分组"-->
                <!--:default-expand-level="10"-->
                <!--:normalizer="normalizer"-->
                <!--v-model="optionValue4"-->
                <!--@select="fenzFn"-->
                <!--/>-->
                <el-select v-model="optionValue4" @change="fenzFn" placeholder="请选择">
                  <el-option
                    v-for="item in option2"
                    :key="item.description"
                    :label="item.description"
                    :value="item.description">
                  </el-option>
                </el-select>

              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2 ">
            <el-col :span="24" class="elRowText">
              <div>状态：</div>
              <div>
                <el-radio v-model="radio" label="1">是</el-radio>
                <el-radio v-model="radio" label="2">否</el-radio>
              </div>
            </el-col>
          </el-row>
          <el-row class="elRow2 ">
            <el-col :span="24" class="elRowText">
              <div>关联功能操作：</div>
              <div class="menulist_gncon">
                <el-checkbox-group
                  v-model="optionValue5" @change="operationFn">
                  <el-checkbox v-for="item in option5" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>

              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="menuList_Con_btn">
        <!--<button type="button" class="el-button el-button&#45;&#45;primary " @click="savecanceFn"><span>返回</span></button>-->
      </div>
    </div>
  </div>
</template>

<script>
  // import vueZtree  from '../../../components/vue-ztree'
  import vueztree from './ztree_dm'

  export default {
    data () {
      return {
        // 菜单树权限
        menuMenuall: false,
        // 新增
        menuAddmenu: false,
        // 删除
        menuDeletemenu: false,
        // 修改
        menuUpdatemenu: false,
        id: '',
        pId: null,
        // 单选
        radio:'1',
        option1: [],
        option2: [],
        option3: [],
        option4: [],
        option5: [],
        optionValue2: '',
        optionValue3: '',
        optionValue4: null,
        //关联数组
        optionValue5: [],
        // 排序字段
        sortnum: 1,
        setting: {},

        // deptTreeVal: '',

        // ztree
      }
    }, watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/menulist') {
          this.privilegesMenuFn()
        }
      }
      },
    created () {
      let _this = this
      _this.privilegesMenuFn()
      _this.deptTree()
      _this.eventsBus.$on('ztreeValdm', function (val) {
        console.log('GGGGG', val)
        // console.log(val.privileges)
        _this.option5 = val.privileges
        let optionValue5Arr = []
        for (let i = 0; i < val.privileges.length; i++) {
          if (val.privileges[i].selected == 1) {
            optionValue5Arr.push(val.privileges[i].id)
          }
        }
        _this.optionValue5 = optionValue5Arr
        // _this.deptTree()

        if (val.id <= 0) {
          _this.empty()
        } else {
          _this.id = val.id
          _this.pId = val.pId
          _this.sortnum = val.seqNo
          _this.optionValue2 = val.name
          _this.optionValue3 = val.menuUrl
          _this.radio = String(val.status)
          _this.optionValue4=val.description
        }

      })

    },
    mounted () {
      // this.ztree();
      // 局部样式适配
      jq('.menuListcon').height(jq(window).height() - 200 + 'px')
    },
    // watch: {
    //   //监听路由变化
    //   $route (to, from) {
    //     if (to.path == '/menuList') {
    //
    //
    //     }
    //   }
    // }

    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
         _this.menuMenuall = false
        _this.menuAddmenu = false
        _this.menuDeletemenu = false
        _this.menuUpdatemenu = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'menuMenuall') {
            _this.menuMenuall = true
          }
          if (_this.privilegesMenuArr[i] == 'menuAddmenu') {
            _this.menuAddmenu = true
          }
          if (_this.privilegesMenuArr[i] == 'menuDeletemenu') {
            _this.menuDeletemenu = true
          }
          if (_this.privilegesMenuArr[i] == 'menuUpdatemenu' || _this.privilegesMenuArr[i] == 'menuAddmenu' || _this.privilegesMenuArr[i] == 'menuDeletemenu') {
            _this.menuUpdatemenu = true
          }

        }
        // 局部样式适配
        jq('.menuListcon').height(jq(window).height() - 200 + 'px')
      },

      // 排序字段
      numCilckFn (val) {
        console.log(val)
      },
      normalizer () {
      },
      // 上级菜单树
      deptTree () {
        let _this = this
        _this.$http
          .post('/menu/menuall.json')
          .then(function (res) {
            console.log(res)
            if (res.data.resStatus == 1000) {
              console.log('DDDDD', res.data.resMsg)
              _this.option1 = res.data.resMsg

            }
          })

        // 功能操作分组
        _this.$http
          .post('/menu/baseOperationDes.json')
          .then(function (res) {
            console.log(res)
            if (res.data.resStatus == 1000) {
              // console.log('CCCCCCC', res.data.resMsg)
              _this.option2 = res.data.resMsg

            }
          })

      },
      empty () {
        this.id = ''
        this.pId = null
        this.optionValue2 = ''
        this.optionValue3 = ''
        this.optionValue4 = null
        this.optionValue5 = []
        this.radio = '1'
        this.sortnum = 1

      },
      savedept () {
        //新增/编辑部门
        let _this = this
        if (_this.id && _this.id != 0 && _this.id != '') {
          // 编辑
          if (!_this.radio || _this.radio == 0 || _this.radio == '') {
            _this.$notify({
              title: '错误',
              type: 'error',
              message: '请选择状态',
              duration: 3000
            })
            return
          }
          let menu = {
            id: Math.abs(_this.id),
            pid: Math.abs(_this.pId),
            name: _this.optionValue2,
            menuUrl: _this.optionValue3,
            status: _this.radio,
            operids: _this.optionValue5,
            seqNo: _this.sortnum
          }

          _this.$http.post('/menu/updatemenu.json', _this.qs.stringify({
            menu: JSON.stringify(menu)

          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
                _this.id = 0
                _this.option5 = []
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '更新成功',
                  duration: 3000
                })

                _this.eventsBus.$emit('toplistdata', '1')
                _this.deptTree()
                let reloadArr = []
                reloadArr.push(_this.id)
                reloadArr.push(_this.pId)
                reloadArr.push(_this.optionValue3)
                reloadArr.push(_this.radio)
                _this.eventsBus.$emit('treeReload-dm', reloadArr)

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
          //新建
          let menu = {
            id: Math.abs(_this.id),
            pid: Math.abs(_this.pId),
            name: _this.optionValue2,
            menuUrl: _this.optionValue3,
            status: _this.radio,
            operids: _this.optionValue5,
            seqNo: _this.sortnum
          }

          _this.$http.post('/menu/addmenu.json', _this.qs.stringify({
            menu: JSON.stringify(menu)

          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {

                _this.id = 0
                _this.option5 = []
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '新增成功',
                  duration: 3000
                })

                let reloadArr = []
                reloadArr.push(_this.id)
                reloadArr.push(_this.pId)
                reloadArr.push(_this.optionValue3)
                reloadArr.push(_this.radio)
                _this.eventsBus.$emit('treeReload-dm', reloadArr)
                _this.deptTree()
              } else {
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: res.data.resMsg,
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
        //删除菜单
        let _this = this
        _this.$http.post('/menu/deletemenu.json', _this.qs.stringify({
          id: _this.id,
        }))
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              // console.log(res.data.resMsg)
              _this.id = 0
              _this.option5 = []
              _this.$notify({
                title: '成功',
                type: 'success',
                message: '删除成功',
                duration: 3000

              })

              let reloadArr = []
              reloadArr.push(_this.id)
              reloadArr.push(_this.pId)
              reloadArr.push(_this.optionValue3)
              reloadArr.push(_this.radio)
              _this.eventsBus.$emit('treeReload-dm', reloadArr)
              _this.deptTree()
              _this.empty()

            } else {
              console.log(res.data.resMsg)
              // _this.$notify({
              //   title: '成功',
              //   type: 'success',
              //   message: ,
              //   duration: 3000
              //
              // })

            }

          })
          .catch(function (err) {
            console.log(err)
          })

      },

      fenzFn (val) {
        console.log(val)
        let _this = this

        // 关联功能操作
        _this.$http
          .post('/menu/baseOperations.json', _this.qs.stringify({
            des: val
          }))
          .then(function (res) {
            console.log(res)
            if (res.data.resStatus == 1000) {
              let operationArr = []
              _this.option5 = res.data.resMsg
              res.data.resMsg.map(item => {
                operationArr.push(item.id)
              })
              _this.optionValue5 = operationArr

              // _this.optionValue5 = operationArr

            }
          })

      },
      pIdFn (val) {
        let _this = this

        _this.pId = val.id

        console.log(val)
        console.log(_this.pId)
      },
      operationFn (val) {
        // 关联功能ID集合
        console.log(val)
        this.optionValue5 = val
      }
    }
    ,
    components: {
      vueztree
    }
  }
</script>

<style lang="less">
  #menuList .orgchartcon {
    width: 100%;
    height: 100%;
    /*height: 400px;*/
  }

  #menuList .menuListcon_left {
    width: 40%;
    float: left;
  }

  #menuList .menuListcon_right {
    float: left;
    width: 50%;
    margin-left: 50px;
  }

  #menuList .ztree {
    margin-top: 20px;
  }

  #menuList .elRowText > div {
    float: left;
  }

  #menuList .menuList_Con {
    width: 1200px;
  }

  #menuList .el-input-number__decrease, #menuList .el-input-number__increase {
    margin-top: 6px;
    width: 25px;
    line-height: 25px;
    background: #FFFFFF;
  }

  #menuList .el-input-number {
    width: 150px;
  }

  #menuList .index_Con_right_con {
    /*overflow-y: hidden !important;*/
  }

  #menuList .el-checkbox + .el-checkbox {
    width: 95px;
    float: left;
  }

  #menuList .textFontColor {
    color: red;
  }
</style>
