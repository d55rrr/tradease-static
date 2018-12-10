<template>
  <div id="userList">
    <div class="userList_Con">
      <el-row>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">工号：</span>
            <el-input
              placeholder="请输入工号"
              v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">用户名：</span>
            <el-input
              placeholder="请输入用户名"
              v-model="input2">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class=".inlineBlock">姓名：</span>
            <el-input
              placeholder="请输入姓名"

              v-model="input3">
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="userList_Con_search">
            <div class="userList_Con_btn_search">
              <button @click="searchFn" type="button" class="el-button el-button--primary"><span>查询</span></button>
              <button @click="emptyFn" type="button" class="el-button el-button--success"><span>清空</span></button>
              <button @click="highSearchFn" type="button" class="el-button el-button--danger"><span>{{baseHigh}}</span>
              </button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow2" v-show="highSearch">
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">部门：</span>
            <treeselect
              :options="optionstt"
              placeholder="请选择部门"
              :default-expand-level="10"
              :normalizer="normalizer"
              v-model="selectValue1"
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">岗位：</span>
            <!--<el-select v-model="selectValue2" @change="selectGet2">-->
            <!--<el-option-->
            <!--v-for="item in options2"-->
            <!--:key="item.value"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <treeselect
              :options="optionstg"
              placeholder="请选择岗位"
              :default-expand-level="10"
              :normalizer="normalizer"
              v-model="selectValue2"
            />
          </div>
        </el-col>

        <template slot-scope="scope">
          <img :src="scope.row.imgPath" alt="" style="width: 50px;height: 50px">
        </template>


        <el-col :span="6">
          <div class="demo-input-suffix">
            <span>状态：</span>
            <treeselect
              :options="optionstz"
              placeholder="请输入岗位"
              :default-expand-level="10"
              :normalizer="normalizer"
              v-model="selectValue3"
            />
          </div>
        </el-col>

      </el-row>
      <el-row class="elRow2" v-show="highSearch">
        <div class="block">
          <span class="demonstration">入职时间：</span>
          <el-date-picker
            @change="statusDataFn"
            v-model="statusData"
            type="daterange"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-row>


      <!-- table部分 -->
      <div v-if="userFindUsersPage" class="userList_Con_table">
        <div class="userList_Con_table_btn">
          <button v-if="userSave" @click="addUserFn" type="button" class="el-button el-button--primary">
            <span>新增用户</span></button>
          <button v-if="userDeleteUserBatch" @click="delUserFn" type="button" class="el-button el-button--primary">
            <span>删除用户</span></button>
          <button v-if="userAssignRoleBatch" @click="morekeyFn" type="button" class="el-button el-button--primary">
            <span>批量授权</span></button>
          <!--todo-->
          <button v-if="false" @click="importFn" type="button" class="el-button el-button--primary"><span>导入</span></button>
        </div>

        <v-table
          is-horizontal-resize
          style="width:100%"
          :columns="columns"
          :multiple-sort="multipleSort"
          :table-data="tableData3"
          row-hover-color="#eee"
          row-click-color="#edf7ff"
          @on-custom-comp="customCompFunc"
          :select-all="selectALL"
          :select-change="selectChange"
          @sort-change="sortChange"
          :sort-always="true"
        ></v-table>

        <div class="userList_Con_table_pages">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="10"
            background
            layout="total,sizes,prev, pager, next"
            :total="totalRows">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import statusIn from '@/assets/img/inwork.png'
  import statusOut from '@/assets/img/outwork.png'

  export default {
    data () {
      return {
        //查看 用户管理-用户列表

        userSave: false,
        // 列表 用户管理-新增用户
        userFindUsersPage: false,
        // 删除 用户管理-用户列表
        userDeleteUserBatch: false,
        // 批量授权 用户管理-用户列表
        userAssignRoleBatch: false,

        optionstt: [],
        optionstg: [],
        optionstz: [
          {
            id: 1,
            label: '在职'
          },
          {
            id: 2,
            label: '离职'
          }
        ],
        //easytable选中删除项
        selectArr: [],

        // 分页
        // 当前第几页
        currentPage: 1,
        // 一页多少条
        pageSize: 10,
        //总条数
        totalRows: 0,
        // 总页数
        // totalPages: 0,
        input1: '',
        input2: '',
        input3: '',

        // 高级/基础/搜索
        baseHigh: '高级搜索',
        //请选择部门
        selectValue1: null,
        selectValue2: null,
        selectValue3: null,
        scroll: '',
        //入职离职时间
        statusData: '',
        entryTimeBegin: '',
        entryTimeEnd: '',
        //高级搜索是否打开
        highSearch: false,

        //分页
        currentPage4: 1,
        //文档高度
        winH: 0,
        //在职状态
        options3: [
          {
            status: '0'
          },
          {
            status: '1'
          }
        ],

        //table数据
        tableData3: [],

        // 批量选中用户ID的集合
        userarrId: [],
        // 批量选中用户Name的集合
        userarrName: [],
        // 排序
        multipleSort: false,
        //表格构造设置
        columns: [
          {
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            type: 'selection'
          },
          {
            field: 'username',
            title: '用户名',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'realname',
            title: '姓名',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'jobNumber',
            title: '工号',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'deptName',
            title: '部门',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'positionName',
            title: '岗位',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'tel',
            title: '手机号码',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'entryTime',
            title: '入职时间',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'email',
            title: 'E-Mail',
            width: 150,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'inService',
            title: '用户状态',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',

            formatter: function (rowData) {
              let _this = this
              // console.log(rowData.inService)

              if (rowData.inService == 1) {
                return (
                  '<img style="width: 15px;height: 15px;" title="在职"  src="' +
                  statusIn +
                  '"/>'
                )
              } else {
                return (
                  '<img style="width: 15px;height: 15px;" title="离职" src="' +
                  statusOut +
                  '"/>'
                )
              }
            },
            isResize: true
          },
          {
            field: 'custome-adv',
            title: '操作',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            componentName: 'table-operation',
            isResize: true
          }
        ]
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/userlist') {
          this.privilegesMenuFn()
          this.userListData(this.currentPage, this.pageSize)
        }
      },

      //监听数据变化(部门/岗位/在职状态)
      selectValue1 (val, oldVal) {
        console.log('部门-selectValue1: ' + val)
        var _this = this
        _this.selectValue2 = null
        // 岗位列表
        _this.$http
          .post(
            '/user/posi/getPosiByDeptId.json',
            _this.qs.stringify({
              deptId: val
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.optionstg = res.data.resMsg
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
      },
      selectValue3 (val, oldVal) {
        console.log('在职离职-selectValue3: ' + val)
      }
    },
    created () {
      this.getDeptTree()
      this.privilegesMenuFn()
      this.userListData(this.currentPage, this.pageSize)
    },
    mounted () {
    },

    methods: {
      getDeptTree(){
        // 部门列表
        let _this =this
        _this.$http.get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.optionstt = res.data.resMsg
              // console.log(res.data.resMsg)
            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //用户列表
      userListData (currentPage, pageSize) {
        var _this = this
        // console.log(_this.input3)
        _this.$http
          .post(
            '/user/findUsersPage.json',
            _this.qs.stringify({
              currentPage: currentPage,
              pageSize: pageSize,
              jobNumber: _this.input1,
              username: _this.input2,
              realname: _this.input3,
              deptId: _this.selectValue1,
              positionId: _this.selectValue2,
              inService: _this.selectValue3,
              // tel: '',

              entryTimeBegin: _this.entryTimeBegin,
              entryTimeEnd: _this.entryTimeEnd
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log(res.data.resMsg.data)
              _this.tableData3 = res.data.resMsg.data
              _this.totalRows = res.data.resMsg.totalRows

            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      },
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.userSave = false
        _this.userFindUsersPage = false
        _this.userDeleteUserBatch = false
        _this.userAssignRoleBatch = false

        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userSave') {
            _this.userSave = true
          }
          if (_this.privilegesMenuArr[i] == 'userFindUsersPage') {
            _this.userFindUsersPage = true
          }
          if (_this.privilegesMenuArr[i] == 'userDeleteUserBatch') {
            _this.userDeleteUserBatch = true
          }
          if (_this.privilegesMenuArr[i] == 'userAssignRoleBatch') {
            _this.userAssignRoleBatch = true
          }
        }
      },
      selectGet1 (val) {
        console.log(val)
      },
      selectGet2 (val) {
        console.log(val)
      },
      selectGet3 (val) {
        console.log(val)
      },
      searchFn () {
        this.userListData(this.currentPage, this.pageSize)
      },
      emptyFn () {
        this.input1 = ''
        this.input2 = ''
        this.input3 = ''
        this.selectValue1 = null
        this.selectValue2 = null
        this.selectValue3 = null
        this.statusData = ''
        this.entryTimeBegin = ''
        this.entryTimeEnd = ''
        this.searchFn()
      },
      highSearchFn () {
        this.highSearch = !this.highSearch
        if (this.highSearch) {
          this.baseHigh = '基础搜索'
        } else {
          this.baseHigh = '高级搜索'
        }

        if (!this.highSearch) {
          this.selectValue1 = null
          this.selectValue2 = null
          this.selectValue3 = null
          this.statusData = ''
          this.entryTimeBegin = ''
          this.entryTimeEnd = ''
        }
      },
      //入职时间判断（0,1）
      statusYnFn (row, column, cellValue) {
        console.log(row)
        console.log(column)
        console.log(cellValue)
      },

      // 入职离职时间获取
      statusDataFn (time) {
        let time1 = this.moment(time[0]).format('YYYY-MM-DD')
        console.log(time1)
        this.entryTimeBegin = time1

        let time2 = this.moment(time[1]).format('YYYY-MM-DD')
        console.log(time2)
        this.entryTimeEnd = time2

        // console.log(val[1])
      },
      //右侧按钮功能
      addUserFn () {
        let _this = this
        _this.$router.push({
          name: 'adduser',
          path: '/adduser',
          params:{
            classify:'add'
          }
        })
      },
      // mark弹出层 删除用户信息
      delUserFn () {
        let _this = this

        if (_this.userArrId != null && _this.userArrId != '') {
          _this
            .$confirm('确定删除此用户吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              //批量删除ID字符串
              let someDel = ''
              console.log(_this.userArrId)
              _this.userArrId.map(val => {
                someDel += val + ','
              })
              // console.log(someDel)
              // 删除用户接口
              _this.$http
                .post(
                  '/user/deleteUserBatch.json',
                  _this.qs.stringify({
                    id: someDel.substr(0, someDel.length - 1)
                  })
                )
                .then(function (res) {
                  console.log(someDel)
                  if (res.data.resStatus == 1000) {
                    console.log(res.data.resMsg.data)

                    //刷新用户列表
                    _this.userListData(_this.currentPage, _this.pageSize)
                    _this.$notify({
                      title: '成功',
                      type: 'success',
                      message: '删除成功!',
                      duration: 3000
                    })
                    _this.userArrId = []
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
            })
            .catch((err) => {
              console.log(err)
              // _this.$message({
              //   type: 'info',
              //   message: '已取消删除'
              // })
            })
        } else {
          _this.$notify({
            title: '错误',
            type: 'error',
            message: '请指定用户再操作'
          })
        }
      },
      keyFn (val) {
        this.$router.push({
          name: 'permission',
          path: '/permission',
          params: {
            id: val.id,
            username: val.username,
            name: val.name,
            bumen: val.bumen,
            ganwang: val.ganwang
          }
        })
      },

      morekeyFn () {
        let _this = this
        //字符串转数组
        // let arr = _this.userArrId.split(",")
        // console.log('AAAA',arr)

        if (_this.userArrId != null && _this.userArrId != '' && _this.userArrId.length) {
          console.log(_this.userArrId)
          _this.$router.push({
            name: 'permissionmore',
            path: '/permissionmore',
            params: {
              userarrId: String(_this.userArrId),
              userarrName: _this.userArrName
            }
          })
          _this.userArrId = []
        } else {
          _this.$notify({
            title: '错误',
            message: '请指定用户再操作',
            type: 'error',
            duration: 3000
          })

        }
      },

      eidtuser (val) {
      },
      importFn () {
      },
      normalizer (val) {
        // console.log(val)
      },

      //table方法
      handleSelectionChange (val) {
        val.map(val => {
          console.log(val.address)
        })
      },

      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 != 0) {
          return 'tableRowBack'
        } else {
          return 'success-row'
        }
        return ''
      },

      //分页功能
      handleSizeChange (val) {
        this.pageSize = Number(`${val}`)
        this.userListData(this.currentPage, this.pageSize)
        // console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        console.log(this.currentPage, this.pageSize)
        this.userListData(this.currentPage, this.pageSize)
        // console.log(`当前页: ${val}`)
      },
      customCompFunc (params) {
        console.log(params)

        if (params.type === 'delete') {
          // do delete operation

          this.$delete(this.tableData, params.index)
        } else if (params.type === 'edit') {
          // do edit operation

          alert(`行号：${params.index} 姓名：${params.rowData['name']}`)
        }
      },
      // 表格选中
      selectALL (selection) {
        //拿到选中用户ID的集合
        let _this = this
        let usersId = []
        let usersName = []
        selection.map(arr => {
          usersId.push(arr.id)
          usersName.push(arr.realname)
        })
        console.log('AAA', usersId)
        this.userArrId = usersId
        this.userArrName = usersName
        console.log('BBB', this.userArrId)
      },
      selectChange (selection, rowData) {
        // console.log(selection)
        //拿到选中用户ID的集合
        let _this = this
        let usersId = []
        let usersName = []
        selection.map(arr => {
          usersId.push(arr.id)
          usersName.push(arr.realname)
        })
        // console.log('AAA', usersId)
        this.userArrId = usersId
        this.userArrName = usersName
        // console.log('BBB',this.userArrId)
      },
      // 表格排序
      sortChange (params) {
        console.log(params)
        let nameValArr = ''
        if (params.entryTime != '') {
          nameValArr = 'entry_time' + ' ' + params.entryTime
        } else if (params.jobNumber != '') {
          nameValArr = 'job_number' + ' ' + params.jobNumber
        } else if (params.realname != '') {
          nameValArr = 'realname' + ' ' + params.realname
        } else if (params.tel != '') {
          nameValArr = 'tel' + ' ' + params.tel
        } else if (params.username != '') {
          nameValArr = 'username' + ' ' + params.username
        }
        // console.log(nameValArr)
        if (nameValArr != '') {
          this.sortFn(nameValArr)
        }

      },
      sortFn (nameValArr) {
        var _this = this
        // console.log(_this.input3)
        _this.$http
          .post(
            '/user/findUsersPage.json',
            _this.qs.stringify({
              currentPage: _this.currentPage,
              pageSize: _this.pageSize,
              jobNumber: _this.input1,
              username: _this.input2,
              realname: _this.input3,
              deptId: _this.selectValue1,
              positionId: _this.selectValue2,
              inService: _this.selectValue3,
              entryTimeBegin: _this.entryTimeBegin,
              entryTimeEnd: _this.entryTimeEnd,
              sortColumns: nameValArr
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log(res.data.resMsg.data)
              _this.tableData3 = res.data.resMsg.data
              _this.totalRows = res.data.resMsg.totalRows
            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      }

    }
  }

  // 自定义列组件
  Vue.component('table-operation', {
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/userlist') {
          this.privilegesMenuFnc()
        }

      }
    },
    created () {
      this.privilegesMenuFnc()
    },
    data () {
      return {
        // 修改 用户管理-用户列表
        userUpdateUser: false,
        // 查看 用户管理-用户列表
        userGetUser: false,
        // 授权 用户管理-用户列表
        userAssignRole: false,

        // 查看授权 用户管理-用户列表
        userGetRoleIdsByUserId: false,
      }
    },
    template: `<span>
        <a v-if="userUpdateUser" href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        <a v-if="userResetPassword" href="" @click.stop.prevent="reloadpass(rowData,index)">重置密码</a>
        <a v-if="userAssignRole" href="" @click.stop.prevent="syspower(rowData,index)">授权</a>
        </span>`,
    props: {
      rowData: {
        type: Object
      },
      field: {
        type: String
      },
      index: {
        type: Number
      }
    },
    methods: {
      //按钮权限判断
      privilegesMenuFnc () {
        let _this = this
        _this.userGetUser = false
        _this.userUpdateUser = false
        _this.userAssignRole = false
        _this.userResetPassword = false

        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        // 新增用户
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {

          if (_this.privilegesMenuArr[i] == 'userGetUser') {
            _this.userGetUser = true
          }
          if (_this.privilegesMenuArr[i] == 'userUpdateUser') {
            _this.userUpdateUser = true
          }
          if (_this.privilegesMenuArr[i] == 'userAssignRole') {
            _this.userAssignRole = true
          }
          if (_this.privilegesMenuArr[i] == 'userResetPassword') {
            _this.userResetPassword = true
          }

        }
      },
      //编辑信息
      update () {
        // 参数根据业务场景随意构造
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        // this.$emit('on-custom-comp', params)
        console.log(params)
        this.$router.push({
          name: 'edituser',
          path: '/edituser',
          params: {
            id: params.rowData.id,
            username: params.rowData.username,
            realname: params.rowData.realname,
            deptId: params.rowData.deptId,
            positionId: params.rowData.positionId,
            tel: params.rowData.tel,
            email: params.rowData.email,
            inService: params.rowData.inService
          }
        })
      },
      reloadpass () {
        // 重置密码
        let _this = this
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        _this.$http
          .post(
            '/user/resetPassword.json',
            _this.qs.stringify({
              id: params.rowData.id
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.optionstg = res.data.resMsg
              _this.$notify({
                title: '成功',
                type: 'success',
                message: res.data.resMsg,
                duration: 3000
              })
              // console.log(res.data.resMsg)
            } else {
              _this.optionstg = res.data.resMsg
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
      },
      // 用户授权
      syspower () {
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        this.$router.push({
          name: 'permission',
          path: '/permission',
          params: {
            id: params.rowData.id,
            deptName: params.rowData.deptName,
            positionName: params.rowData.positionName
          }
        })
      },
      deleteRow () {
        // 参数根据业务场景随意构造
        let params = {type: 'delete', index: this.index}
        this.$emit('on-custom-comp', params)
      }
    }
  })
</script>

<style lang="less">
  #userList .userList_Con {
    max-width: 100% !important;
  }

  #userList .el-row {
    max-width: 1100px;
  }

  #userList .elRow2 .el-col {
    text-align: left;
  }

  #userList .el-input__icon {
    line-height: 0;
  }

  #userList .el-date-editor .el-range-separator {
    line-height: 21px;
  }

  #userList .cell > button {
    padding: 0 !important;
  }

  //表格图片设置
  #userList .imgStyle {
    width: 15px;
    height: 15px;
    margin-top: 12px;
    display: inline-table;
  }

  #userList .userList_Con_search {

  }
</style>
