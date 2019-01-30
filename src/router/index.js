import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '../pages/login'
import Home from '../pages/'

import Empty from '../components/empty'

import Indexlist from '../pages/pagescomponents/indexList'
import addUser from '../pages/pagescomponents/userManage/addUser'
import Userlist from '../pages/pagescomponents/userManage/userList'
import Permission from '../pages/pagescomponents/userManage/permission'
import Permissionmore from '../pages/pagescomponents/userManage/permissionmore'
import EditUser from '../pages/pagescomponents/userManage/editUser'

import Organization from '../pages/pagescomponents/organizationManage/organization'
import Department from '../pages/pagescomponents/organizationManage/department'
import Post from '../pages/pagescomponents/organizationManage/post'
import AddPost from '../pages/pagescomponents/organizationManage/addPost'
import EditPost from '../pages/pagescomponents/organizationManage/editPost'

import Rolelist from '../pages/pagescomponents/authorityManage/roleList'
import AddRole from '../pages/pagescomponents/authorityManage/addRole'
import Editrole from '../pages/pagescomponents/authorityManage/editRole'
import Lookrole from '../pages/pagescomponents/authorityManage/lookRole'

import Menulist from '../pages/pagescomponents/developmentManage/menuList'
import Dictionar from '../pages/pagescomponents/developmentManage/dictionar'
import Editdictionar from '../pages/pagescomponents/developmentManage/editdictionar'
import Adddictionar from '../pages/pagescomponents/developmentManage/adddictionar'

import Addproject from '../pages/pagescomponents/basedataManage/addproject'
import Projectlist from '../pages/pagescomponents/basedataManage/projectList'
import Editproject from '../pages/pagescomponents/basedataManage/addproject'
import Lookproject from '../pages/pagescomponents/basedataManage/addproject'

import Addproduct from '../pages/pagescomponents/projectManage/addproduct'
import Productlist from '../pages/pagescomponents/product/productList'
import Lookproduct from '../pages/pagescomponents/projectManage/lookproduct'
import Editproduct from '../pages/pagescomponents/projectManage/editproduct'
import Versiontotestlist from '../pages/pagescomponents/versionToTest/versionToTestList'
import Versiontotestdetail from '../pages/pagescomponents/versionToTest/versionToTestDetail'
import Versionplanlist from '../pages/pagescomponents/versionPlan/versionPlanList'
import Notfound from '../pages/notfound'
import Versiontracelist from '../pages/pagescomponents/versionTrace/versionTraceList'
import Testplanlist from '../pages/pagescomponents/testDelivery/testPlan/testplanlist'
import Addtestplan from '../pages/pagescomponents/testDelivery/testPlan/addtestplan'
import Edittestplan from '../pages/pagescomponents/testDelivery/testPlan/addtestplan'
import Looktestplan from '../pages/pagescomponents/testDelivery/testPlan/addtestplan'
import Testcasemodule from '../pages/pagescomponents/testCase/testCaseModule'
import Testcaselist from '../pages/pagescomponents/testCase/testCaseList'
import Salelist from '../pages/pagescomponents/sales/saleList'
import Productinstall from '../pages/pagescomponents/businessServices/productInstall'
import Sysmenu from '../pages/pagescomponents/sys/sysMenu'
import Wholesalelist from '../pages/pagescomponents/sales/wholeSaleList'
import Productrepair from '../pages/pagescomponents/businessServices/productRepair'
import Storeinfo from '../pages/pagescomponents/store/storeInfo'
import Outstore from '../pages/pagescomponents/store/outstore'
import Instore from '../pages/pagescomponents/store/instore'
import Producttype from '../pages/pagescomponents/product/productType'
import Orderbill from '../pages/pagescomponents/finance/orderbill'
import Sysuser from '../pages/pagescomponents/sys/sysUser'
import SysDic from '../pages/pagescomponents/sys/sysDic'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login
  },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        // 用户管理
        {
          path: 'indexlist',
          name: 'indexlist',
          component: Indexlist,
        }, {
          path: 'adduser',
          name: 'adduser',
          component: addUser,
        }, {
          path: 'userlist',
          name: 'userlist',
          component: Userlist,
        }, {
          path: 'permission',
          name: 'permission',
          component: Permission,
        }, {
          path: 'permissionmore',
          name: 'permissionmore',
          component: Permissionmore,
        }, {
          path: 'edituser',
          name: 'edituser',
          component: EditUser,
        },
        // 组织架构管理
        {
          path: 'organization',
          name: 'organization',
          component: Organization,
        },
        {
          path: 'department',
          name: 'department',
          component: Department,
        }, {
          path: 'post',
          name: 'post',
          component: Post,
        }, {
          path: 'addPost',
          name: 'addPost',
          component: AddPost,
        },
        {
          path: 'editPost',
          name: 'editPost',
          component: EditPost,
        },
        // 权限管理
        {
          path: 'rolelist',
          name: 'rolelist',
          component: Rolelist,
        }, {
          path: 'empty',
          name: 'empty',
          component: Empty,
        }, {
          path: 'addrole',
          name: 'addrole',
          component: AddRole,
        }, {
          path: 'editrole',
          name: 'editrole',
          component: Editrole,
        }, {
          path: 'lookrole',
          name: 'lookrole',
          component: Lookrole,
        },

        // 开发平台管理
        {
          path: 'menulist',
          name: 'menulist',
          component: Menulist,
        }, {
          path: 'dictionar',
          name: 'dictionar',
          component: Dictionar,
        }, {
          path: 'editdictionar',
          name: 'editdictionar',
          component: Editdictionar,
        }, {
          path: 'adddictionar',
          name: 'adddictionar',
          component: Adddictionar,
        },

        // 基础信息
        {
          path: 'addproject',
          name: 'addproject',
          component: Addproject,
        }, {
          path: 'projectlist',
          name: 'projectlist',
          component: Projectlist,
        }, {
          path: 'editproject',
          name: 'editproject',
          component: Editproject,
        }, {
          path: 'lookproject',
          name: 'lookproject',
          component: Lookproject,
        },{
          path: 'addproduct',
          name: 'addproduct',
          component: Addproduct,
        }, {
          path: 'productlist',
          name: 'productlist',
          component: Productlist,
        }, {
          path: 'editproduct',
          name: 'editproduct',
          component: Editproduct,
        }, {
          path: 'lookproduct',
          name: 'lookproduct',
          component: Lookproduct,
        }, {
          path: 'versiontotestlist',
          name: 'versiontotestlist',
          component: Versiontotestlist
        } , {
          path: 'versiontotestdetail',
          name: 'versiontotestdetail',
          component: Versiontotestdetail
        },{
          path: 'versionplanlist',
          name: 'versionplanlist',
          component: Versionplanlist
        }, {
          path: 'versiontracelist',
          name: 'versiontracelist',
          component: Versiontracelist,
        }, {
          path: 'testcasemodule',
          name: 'testcasemodule',
          component: Testcasemodule,
        }, {
          path: 'testcaselist',
          name: 'testcaselist',
          component: Testcaselist,
        }
       //测试交付件管理 测试计划管理
        ,{
          path: 'testplanlist',
          name: 'testplanlist',
          component: Testplanlist,
        },
        {
          path: 'addtestplan',
          name: 'addtestplan',
          component: Addtestplan,
        },
        {
          path: 'edittestplan',
          name: 'edittestplan',
          component: Edittestplan,
        },
        {
          path: 'looktestplan',
          name: 'looktestplan',
          component: Looktestplan,
        },
        {
          path: 'salelist',
          name: 'salelist',
          component: Salelist,
        },
        {
          path: 'wholesalelist',
          name: 'wholesalelist',
          component: Wholesalelist,
        },
        {
          path: 'productinstall',
          name: 'productinstall',
          component: Productinstall,
        },
        {
          path: 'productrepair',
          name: 'productrepair',
          component: Productrepair,
        },
        {
          path: 'storeinfo',
          name: 'storeinfo',
          component: Storeinfo,
        },
        {
          path: 'instore',
          name: 'instore',
          component: Instore,
        },
        {
          path: 'outstore',
          name: 'outstore',
          component: Outstore,
        },
        {
          path: 'sysmenu',
          name: 'sysmenu',
          component: Sysmenu,
        },
        {
          path: 'producttype',
          name: 'producttype',
          component: Producttype,
        },
        {
          path: 'orderbill',
          name: 'orderbill',
          component: Orderbill,
        },
        {
          path: 'sysuser',
          name: 'sysuser',
          component: Sysuser,
        },
        {
          path: 'sysdic',
          name: 'sysdic',
          component: SysDic,
        }

      ]
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: Notfound
    },
    {
      path: '*',
      name: 'login',
      component: Login
    }
  ]
})
/*router.beforeEach((to, from, next) => {
  if(sessionStorage.getItem('system_login_update_time')!=null&&sessionStorage.getItem('system_login_update_time')!=undefined){
    //设置登陆超时为30分钟
    if(new Date().getTime()-parseInt(sessionStorage.getItem('system_login_update_time'))>1000*60*30){
      sessionStorage.removeItem('system_login_update_time')
      next({
        path:'/login'
      })
      return
    }
    sessionStorage.setItem('system_login_update_time',new Date().getTime())
    if(to.path=="/"){
      next({
        path:'indexlist'
      })
      return
    }else if(to.path=='/indexlist'){
      sessionStorage.removeItem("current_menu_id")
      sessionStorage.removeItem("current_nav_id")
      next()
      return
    }
    let param = to.path.substr(1)
      axios.get('/menu/getMappedMenuTree.json?menuUrl='+param).then(function(res){
      if(res.data.resStatus == 1000){
        let treenode = res.data.resMsg
        let findparent = function(node){
          if(node.parent!=undefined&&node.parent!=null){
            return findparent(node.parent)
          }else{
            return node
          }
        }
        let pnode = findparent(treenode)
        let menuOneId = treenode.id
        sessionStorage.setItem("current_menu_id",pnode.id)
        sessionStorage.setItem("current_nav_id",treenode.id)
        let _this = this
        axios.get('/menu/getMenuWithPri.json?menuId='+menuOneId).then(res => {
            if(res.data.resStatus==1000){
              sessionStorage.setItem("privilegesMenu",JSON.stringify(res.data.resMsg.privileges))
            }

          }).finally(()=>{
             next()
          })
      }else{
        if(to.path=='/notfound'){
          next()
        }else{
          next({
            path:'/notfound'
          })
        }
      }
    })
  }else{
    if(to.path=='/login'){
      next()
    }else{
      next({
        path:'/login'
      })
    }

  }
})*/
export default router


