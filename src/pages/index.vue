<template>
  <div id="index">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="0" style="font-size: 18px;margin-right: 60px" disabled>TRADEASE</el-menu-item>
      <el-menu-item :index="menu.orderNum" v-for="menu in navList" @click="findChildren(menu.id)">{{menu.name}}</el-menu-item>
      <el-submenu index="2" style="float:right">
        <template slot="title"><i class="el-icon-picture"></i>管理员</template>
        <el-menu-item index="2-1">个人信息</el-menu-item>
        <el-menu-item index="2-2">修改密码</el-menu-item>
        <el-menu-item index="2-3">退出</el-menu-item>
      </el-submenu>
    </el-menu>
    <div>
      <el-row>
        <el-col :span="2" style="height:1000px">
          <el-menu
            default-active="2"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            style="height:100%"
            active-text-color="#ffd04b">
            <template v-for="menu in leftNavData">
              <el-menu-item v-if="menu.isEnd==1"   :index="menu.orderNum"  @click="findPage(menu)">
                <i :class="menu.icon"></i>
                {{menu.name}}
              </el-menu-item>
              <el-submenu :index="menu.orderNum" v-if="menu.isEnd==2">
                <template slot="title">
                  <i :class="menu.icon"></i>
                  <span>{{menu.name}}</span>
                </template>
                <el-menu-item-group >
                  <el-menu-item :index="menu.orderNum+'-'+subMenu.orderNum"  v-for="submenu in menu.children"  @click="findPage(subMenu)">{{submenu.name}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
        </el-col>
        <el-col :span="22">
          <div>
            <keep-alive>
              <router-view/>
            </keep-alive>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import icon_base from '../assets/img/icon_base.png'
  import icon_test from '../assets/img/icon_test.png'
  import icon_sys from '../assets/img/icon_sys.png'
  import icon_staff from '../assets/img/icon_staff.png'

  export default {
    data () {
      return {
        //选项卡高亮
        activeNum: null,
        //左侧栏标题
        navListTit: '',
        //面包屑
        breadcrumb: ['首页'],
        //导航栏数据
        navList: [],
        //左侧导航数据
        // 顶部图片显示
        leftNavData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        expandedIds :[],
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        let _this = this
        if (to.path == '/indexlist') {
          _this.topnavFn()
          _this.goHome()
        }
      }
    },

    created () {
      // 顶部一级导航
      let _this = this
      _this.firstMenus()
      _this.topnavFn()
      _this.eventsBus.$on('toplistdata', function (val) {
        _this.topnavFn()
        jq('.index_Nav_middle_list').eq(0).click()
      })
    },
    mounted () {
      //this.goHome()

    },
    methods: {
      firstMenus(){
        let _this = this
        _this.$http.post('/tradease/system/menu/menus', _this.qs.stringify({
          menuType:1
        }))
          .then(function (res) {
           _this.navList = res.data.data
          })
      },
      findChildren(id){
        let _this = this
        _this.$http.post('/tradease/system/menu/menuTree', _this.qs.stringify({
          pid:id
        }))
          .then(function (res) {
            _this.leftNavData = res.data.data
          })
      },
      findPage(menu){
        debugger
        let _this = this
        if(menu.isEnd==1){
          _this.$router.push({
            name: menu.url,
            path: menu.url
          })
        }
      },
      // 顶部一级导航
      topnavFn () {
        let _this = this
        _this.$http.get('/menu/getOwnedMenuOneList.json', _this.qs.stringify({
          userId: _this.userIds
        }))
          .then(function (res) {
            console.log(res)
            if (res.data.resStatus == 1000) {
              _this.navList = res.data.resMsg

              let pid = sessionStorage.getItem("current_menu_id")
              let cnid = sessionStorage.getItem("current_nav_id")
              let index = 0
              if(pid!=null&&pid!=undefined){
                _this.navList.forEach(function(nav){
                  if(nav.id == pid){
                    _this.activeNum = index
                  }
                  index++
                })
                _this.leftnavFn(pid)
              }
              if(cnid!=null&&cnid!=undefined){
                _this.expandedIds.push(parseInt(cnid))
              }



              // 当前用户左侧导航栏菜单
              // _this.id = res.data.resMsg[0].id
              // _this.leftnavFn(_this.id)

              _this.navListTit = '个人管理'
              _this.leftNavData = [{
                label: '个人信息管理',
                name: '个人信息管理',
                menuUrl: '',
                children: [{
                  label: '个人信息变更',
                  name: '个人信息变更',
                  menuUrl: '',

                }, {
                  label: '密码修改',
                  name: '密码修改',
                  menuUrl: '',

                }]

              },
                {
                  label: '待办任务管理',
                  name: '待办任务管理',
                  menuUrl: '',
                  children: [{
                    label: '待处理版本',
                    name: '待处理版本',
                    menuUrl: '',

                  }, {
                    label: '待执行用例',
                    name: '待执行用例',
                    menuUrl: '',

                  }, {
                    label: '待审核用例',
                    name: '待审核用例',
                    menuUrl: '',

                  }]

                }]

              setTimeout(function () {
                // console.log('index_Nav_middle_list:', jq('.index_Nav_middle_list').children('div').length)
                let arrLenth = jq('.index_Nav_middle_list').children('div').length

                // 顶部图片设置
                // navList
                // let imgArr = [
                //   '../assets/img/icon_base.png',
                //   '../assets/img/icon_test.png',
                //   '../assets/img/icon_sys.png',
                //   '../assets/img/icon_staff.png',
                // ]
                for (let i = 0; i < arrLenth; i++) {
                  // console.log(_this.navList[i].menuUrl)
                  // console.log(jq('.index_Nav_middle_list').children('div').eq(i).children('p').html())
                  if (jq('.index_Nav_middle_list').children('div').eq(i).children('p').html() == '测试管理') {
                    jq('.index_Nav_middle_list').children('div').eq(i).children('img').attr('src', icon_test)
                  }
                  else if (jq('.index_Nav_middle_list').children('div').eq(i).children('p').html() == '基础信息管理') {
                    jq('.index_Nav_middle_list').children('div').eq(i).children('img').attr('src', icon_base)
                  } else if (jq('.index_Nav_middle_list').children('div').eq(i).children('p').html() == '系统管理') {
                    jq('.index_Nav_middle_list').children('div').eq(i).children('img').attr('src', icon_sys)
                  } else if (jq('.index_Nav_middle_list').children('div').eq(i).children('p').html() == '开发平台管理') {
                    jq('.index_Nav_middle_list').children('div').eq(i).children('img').attr('src', icon_staff)
                  }
                }
                jq('.index_Nav_right_topright_usermsg').find('span').html(localStorage.getItem('username1'))
              }, 200)

            } else {
              _this.$router.push({
                name: 'Login',
                path: '/login'
              })
              // alert(res.statusText)
            }

          })
          .catch(function (err) {
            console.log(err)
          })

      },
      // 当前用户左侧导航栏菜单
      leftnavFn (menuOneId) {
        let _this = this
        _this.$http({
          url: '/menu/getOwnedMenuTree.json',
          method: 'get',
          params: {menuOneId}

        })
          .then(res => {
            _this.leftNavData = res.data.resMsg
            _this.$nextTick(function(){
              if(_this.expandedIds&&_this.expandedIds.length>0){
                _this.$refs.vuetree.setCurrentKey(_this.expandedIds[0])
                _this.$nextTick(function(){
                  _this.setBreadCrumb(_this.$refs.vuetree.getNode(_this.expandedIds[0]))
                })
              }

            })
            console.log(res.data.resMsg)
          })
      },
      toSale(){
        let _this = this
        _this.$router.push({
          path: 'salelist',
          name: 'salelist',
        })
      },
      toMenu(){
        let _this = this
        _this.$router.push({
          path: 'sysmenu',
          name: 'sysmenu',
        })
      },
      toService(){
        let _this = this
        _this.$router.push({
          path: 'productinstall',
          name: 'productinstall',
        })
      },
      goHome () {
        let _this = this
        _this.$router.push({
          name: 'indexlist',
          path: '/home/indexlist'
        })

      },

      active (id, index, num, url) {
        this.activeNum = index
        this.navListTit = num
        //获取左侧导航
        this.leftnavFn(id)
        this.expandedIds = []
        //保存当前点击index
      },
      //获取左侧导航栏点击
      handleNodeClick (data) {
        let _this = this
        console.log(data)

        //获取当前节点
        let nowId = _this.$refs.vuetree.currentNode.node
        // console.log(nowId)
        // console.log(nowId.parent.label)
        // console.log(data.menuUrl);
        // let selectNode = _this.$refs.vuetree.getNode(nowId)
        _this.setBreadCrumb(nowId)

        _this.localstorageFn(data.menuUrl)
        _this.$refs.vuetree.setCurrentKey(data.menuUrl)

        localStorage.setItem('privilegesMenu', JSON.stringify(data.privileges))
        console.log('路由名称：', data.menuUrl)
        console.log('按钮权限：', data)
        if (data.menuUrl != '' && data.menuUrl) {
          _this.$router.push({
            name: data.menuUrl,
            path: '/' + data.menuUrl
          })
        } else {
          console.log('menuUrl为空或为undefined')
        }
      },
      //设置面包屑
      setBreadCrumb(selectNode){
        let _this = this
        let selectedLabelArray = []
        let recursionParent = function (node) {
          if (node.parent) {
            console.log(node.label, 'AAAA')
            selectedLabelArray.push(node.label)
            recursionParent(node.parent)
          }

        }
        recursionParent(selectNode)
        // console.log(selectedLabelArray.reverse().join(' > '))
        _this.breadcrumb = selectedLabelArray.reverse()

      },
      //退出登录
      loginout () {
        let _this = this
        _this.$http.post('/user/logout.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '成功',
                type: 'success',
                message: '退出登录成功',
                duration: 2000
              })
              sessionStorage.removeItem("system_login_update_time")
              _this.activeNum = null
              setTimeout(function () {
                _this.$router.push({
                  name: 'login',
                  path: '/login'
                })
              }, 500)

            }
          })
          .catch(function (err) {
            console.log(err)
          })

      }
    },
    components: {}
  }
</script>

<style lang="less">
  @import url("../assets/less/style.less");
  .el-submenu .el-menu-item{
    min-width: 150px;
  }

</style>
