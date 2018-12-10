<template>
  <div id="addRole">
    <div class="addRole_Con">
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">角色名称：</span>
            <span class="textFontColor">*</span>
            <el-input

              placeholder="请输入角色名称"
              v-model="name">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="16">
          <span class="inlineBlock addroleText">角色描述：</span>
          <span class="textFontColorHidden">*</span>
          <el-input

            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="description">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <div class="addRole_Con_user">


          <div class="addRole_Con_user_con">
            <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选-->
            <!--</el-checkbox>-->

            <div class="addRole_Con_user_con_c">
              <!--<p v-for="item in roleOption1" :key="item.id">{{item.name}}</p>-->

            </div>
            <div class="addRole_Con_user_con_cselectbox">
              <rolecheckboxadd></rolecheckboxadd>
            </div>

          </div>
          <span class="addRole_Con_user_text">功能权限：</span>
          <span class="textFontColorHidden">*</span>
        </div>
      </el-row>

      <div class="addRole_Con_btn">
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
  import rolecheckboxadd from './rolecheckboxadd'

  export default {

    data () {
      return {
        // 新增
        userRoleSaveRole: false,
        id: '',
        input1: '',
        input2: '',
        input3: '',
        activeName: '',
        valueDate: '',
        options1: [],
        options2: [],

        //授权选中变量
        permissioncheckList: [],
        // 岗位名称
        name: '',
        // 所属部门id
        selectValue1: null,
        // 岗位职责
        responsibility: '',
        // 岗位描述
        description: '',
        // 关联菜单id
        menuIds: [],
        // 关联权限id
        privilegeIds: [],

        // 所有回显权限ID
        roleAllId: [],

        // 递归取所有ID
        loopAllId: [],

        tel: '',
        email: '',

        checkAll: false,

        checkedCities: [],

        // 权限数据
        roleOption1: [],
        // 子集数据
        roleOption2: [],
        //选中的数据集合
        checkedRelos: [],
        //一级ID匹配
        oneidArr: [],
        //当前选中的Tabs索引
        currentIndex: 0,

        isIndeterminate: true,
        // 树结构设置
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        classify: ''

      }
    },
    watch: {
      '$route' (to, from) {
        if (to.path == '/addrole') {
          this.privilegesMenuFn()
          this.getuserdata()
          // alert(to.path)
        }
      },

    },

    created () {
      this.privilegesMenuFn()
      this.getuserdata()
    },
    mounted () {

    },
    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        let userRS = this.$route.params.userRoleSaveRole
        if (this.$route.params.classify == 'add') {
          _this.classify = this.$route.params.classify
        } else {
          _this.classify = ''
        }

        if (!userRS || userRS == '') {
          _this.userRoleSaveRole = false
          _this.privilegesMenuArr = []
          // console.log(localStorage.getItem('privilegesMenu'))
          let privilegesMenu = JSON.parse(localStorage.getItem('privilegesMenu'))
          // console.log(privilegesMenu)
          privilegesMenu.map(val => {
            _this.privilegesMenuArr.push(val.priKey)
          })
          // console.log(_this.privilegesMenuArr)
          for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
            if (_this.privilegesMenuArr[i] == 'userRoleSaveRole') {
              _this.userRoleSaveRole = true
            }
          }
        } else {
          _this.userRoleSaveRole = true
          _this.privilegesMenuArr = []
          let privilegesMenu = JSON.parse(localStorage.getItem('privilegesMenu'))
          privilegesMenu.map(val => {
            _this.privilegesMenuArr.push(val.priKey)
          })

        }
      },

      selectGet1 (val) {
        console.log(val)
      },
      selectGet2 (val) {
        console.log(val)
      },

      getuserdata () {
        let _this = this
        _this.id = _this.$route.params.id
        // 新增
        // _this.name = _this.$route.params.name
        // // _this.selectValue1 = _this.$route.params.deptIdss
        // _this.responsibility = _this.$route.params.responsibility
        // _this.description = _this.$route.params.description
        // _this.status = _this.$route.params.status

        //功能权限
        _this.$http({
          url: '/user/role/getPrivilegeTree.json',
          method: 'get'

        })
          .then(res => {
            if (res.data.resStatus == 1000) {
              console.log('FFFFFFFFFFFFFFF', res.data.resMsg)
              let d = res.data.resMsg
              let idarr = []
              console.log('DDDDDD', d)
              d.map(val => {
                idarr.push(val.id)
              })
              console.log('idarr:', idarr)
              _this.roleOption1 = d
              _this.oneidArr = idarr
              console.log(_this.roleOption1)
              _this.jqroleFn()
              // console.log(_this.roleOption1)

              let dataIndex = _this.roleOption1[0]
              _this.roleOption2 = dataIndex.children
              _this.activeName = _this.roleOption2[0].label
              console.log(_this.roleOption2)
              console.log(_this.activeName)
              // console.log('_this.activeName',_this.activeName)

            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      },
      // jquery权限方法(checkBox树状结构联动)
      jqroleFn () {
        let _this = this
        let html = ''
        for (let i = 0; i < _this.roleOption1.length; i++) {
          html +=
            '<p class="privilegeIds addRole_Con_user_con_cp">' +
            '<input style="margin-right:5px;" type="checkbox" class="privilegeIds" name="" id="' + _this.roleOption1[i].id + '"/>' +
            '<span>' + _this.roleOption1[i].name + '</span>' + '</p>'
        }
        jq('.addRole_Con_user_con_c').html(html)
        jq('.addRole_Con_user_con_c span').parent('p').eq(0).addClass('addRole_Con_active')

        jq('.addRole_Con_user_con_c >p').on('click', function () {
          jq('.addRole_Con_user_con_c >p').attr('class', 'addRole_Con_user_con_cp')
          jq('.addRole_Con_user_con_c >p').eq(jq(this).index()).addClass('addRole_Con_active')
          jq('.menuIndex > li').css('display', 'none')
          jq('.menuIndex > li').eq(jq(this).index()).css('display', 'block')
        })

        //处理全选
        jq('.addRole_Con_user_con_c input:checkbox').on('click', function () {
          if (jq(this).parent('p').children('input:checkbox').is(':checked')) {
            // console.log(jq('.menuIndex').children('li').eq(jq(this).index()).html())
            jq('.menuIndex').children('li').eq(jq(this).parent('p').index()).find('input:checkbox').prop('checked', true)
          } else {
            jq('.menuIndex').children('li').eq(jq(this).parent('p').index()).find('input:checkbox').prop('checked', false)
          }
        })

      }
      ,

      checkboxFn () {
        console.log(this.permissioncheckList)
        console.log(String(this.permissioncheckList))
      }
      ,
      addRolecheckList () {

      }
      ,
      addRoleChecked () {

      }
      ,
      handleClick (tab, event) {
        // console.log(tab, event)

        //改变选项卡索引
        this.currentIndex = tab.index

        //json数据处理 功能权限分类

        let dataIndex = this.roleOption1[tab.index]
        this.roleOption2 = dataIndex.children
        console.log(this.roleOption2)

      }
      ,

      // 角色权限设置
      handleCheckAllChange (val) {
        this.checkedCities = val ? this.roleOption1 : []
        this.isIndeterminate = false
        console.log(this.checkAll)
      }
      ,
      handleCheckedCitiesChange (value) {
        console.log(value)
        let checkedCount = value.length
        this.checkAll = checkedCount === this.roleOption1.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleOption1.length

        // console.log(this.roleOption1[0])
      }
      ,
      // 树点击 获取选中数组
      treeFn (val) {

        let arr = this.$refs.tree[val].getCheckedKeys()

        //如果选中项不为空则增加第一级菜单ID

        if (arr != '') {
          // currentIndex
          let cIndex = this.oneidArr[this.currentIndex]
          this.checkedRelos = arr
          this.checkedRelos.push(cIndex)
        } else {
          this.checkedRelos = arr
        }
        console.log(this.checkedRelos)

        console.log('EEEEEEEEEEEEEEEEEE', arr)
        console.log('this.checkedRelos:', this.checkedRelos)
        // console.log(this.$refs)
      }
      ,

      //确定 取消

      savecanceFn (num) {
        let _this = this
        if (num == 0) {
          // 获取用户权限数组
          let jqDom = jq('.menuIndex').find('input:checkbox')
          let menuIndex = jq('.menuIndex').find('input:checkbox').length
          // console.log(menuIndex)
          _this.menuIds = []
          _this.privilegeIds = []

          // menuIds: String(_this.menuIds),
          //   privilegeIds: String(_this.privilegeIds),

          for (let i = 0; i < menuIndex; i++) {
            if (jqDom.eq(i).is(':checked') && jqDom.eq(i).hasClass('menuIds')) {
              _this.menuIds.push(jqDom.eq(i).attr('id'))
              // console.log(jqDom.eq(i).attr('id'))
            }
            if (jqDom.eq(i).is(':checked') && jqDom.eq(i).hasClass('privilegeIds')) {
              _this.privilegeIds.push(jqDom.eq(i).attr('id'))
            }
          }

          // 数据分类(重要)------
          // -------------------
          console.log('name:', _this.name)
          console.log('description:', _this.description)
          console.log('menuIds:', _this.menuIds)
          console.log('privilegeIds', _this.privilegeIds)

          // 修改岗位接口
          _this.$http.post('/user/role/saveRole.json', _this.qs.stringify({
            name: _this.name,
            description: _this.description,
            menuIds: String(_this.menuIds),
            privilegeIds: String(_this.privilegeIds),
          }))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: res.data.resMsg,
                  duration: 3000

                })
                _this.name = ''
                _this.description = ''
                let len = jq('.addRole_Con_user_con').find('input:checkbox').length
                for (let i = 0; i < len; i++) {
                  jq('.addRole_Con_user_con').find('input:checkbox').eq(i).prop('checked', false)
                }
                setTimeout(function () {
                  _this.$router.push({
                    name: 'rolelist',
                    path: '/rolelist'
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
        } else if (num == 1) {
          _this.$router.go(-1)
        } else if (num == 2) {

        }

      }
      ,
      // 部门/岗位
      normalizer () {

      }

    },
    components: {
      Treeselect,
      rolecheckboxadd
    }
  }
</script>

<style lang="less">
  #addRole .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #addRole .elRow1 .el-col {
    text-align: left;
  }

  #addRole .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }

  }

  #addRole .inlineBlock {
    display: inline-block;
    width: 65px;
  }

  #addRole .addRole_Con_user_con{
    margin-left: 80px !important;
  }


  #addRole .el-textarea {
    width: 50%;
  }

  #addRole .el-textarea > textarea {
    min-height: 100px;
  }

  #addRole .addRole_Con_user_con_c {
    width: 100%;
    height: 30px;
    line-height: 30px;
    float: left;
  }

  #addRole .addRole_Con_user_con_cp {
    padding: 0 !important;
    float: left;
    width: 100px;
    text-align: center;
    height: 100%;

  }

  #addRole .addRole_Con_active {
    border-bottom: 2px solid #3183DB !important;
  }

  #addRole .menuIndex > li:first-child {
    display: block;
  }

  #addRole .addroleText {
    /*position: absolute;*/
    margin-top: 20px;

  }
  #addRole .addRole_Con_user_text{
    display: block;
    margin-top: -20px !important;
  }

  #addRole .textFontColor {
    color: red;
  }
  #addRole .textFontColorHidden {
    color: #FFFFFF;
  }
</style>
