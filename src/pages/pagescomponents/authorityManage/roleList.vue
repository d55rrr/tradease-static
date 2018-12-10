<template>
  <div id="roleList">
    <div class="roleList_Con">
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">名称：</span>
            <el-input
              placeholder="请输入名称"
              v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="block">
            <span class="demonstration">创建时间：</span>
            <el-date-picker
              @change="statusDataFn"
              v-model="statusData"
              type="daterange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="roleList_Con_search">
            <div class="roleList_Con_btn_search">
              <button @click="searchFn" type="button" class="el-button el-button--primary"><span>查询</span></button>
              <button @click="emptyFn" type="button" class="el-button el-button--success"><span>清空</span></button>
            </div>
          </div>
        </el-col>
      </el-row>


      <!-- table部分 -->
      <div class="roleList_Con_table">
        <div class="roleList_Con_table_btn">
          <button v-if="userRoleAddRole" @click="addUserFn" type="button" class="el-button el-button--primary"><span>新增角色</span>
          </button>
          <!--<button @click="delUserFn" type="button" class="el-button el-button&#45;&#45;primary"><span>删除用户</span></button>-->
          <!--<button @click="morekeyFn" type="button" class="el-button el-button&#45;&#45;primary"><span>批量授权</span></button>-->
          <!--<button @click="importFn" type="button" class="el-button el-button&#45;&#45;primary"><span>导入</span></button>-->
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

        <div class="roleList_Con_table_pages">
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
        // 列表
        userRoleGetRolePager: false,
        // 新增角色
        userRoleAddRole: false,
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
            field: 'name',
            title: '角色',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          }, {
            field: 'createTime',
            title: '创建时间',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          }, {
            field: 'description',
            title: '描述',
            width: 300,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'custome-adv',
            title: '操作',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            componentName: 'table-operation1',
            isResize: true
          }
        ]
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/rolelist') {
          this.privilegesMenuFn()
          this.roleListData(this.currentPage, this.pageSize)
          this.currentPage = 1
        }
      },

      //监听数据变化(部门/岗位/在职状态)
      selectValue1 (val, oldVal) {
        console.log('部门-selectValue1: ' + val)

      },
      selectValue2 (val, oldVal) {
        console.log('岗位-selectValue2: ' + val)
      },
      selectValue3 (val, oldVal) {
        console.log('在职离职-selectValue3: ' + val)
      }
    },
    created () {
      this.privilegesMenuFn()
      this.roleListData(this.currentPage, this.pageSize)
    },
    mounted () {
      let _this = this
      _this.eventsBus.$on('uploadata1', function (val) {
        console.log('GGGGGG', val)
        _this.roleListData()
      })
    },

    methods: {

      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.userRoleGetRolePager = false
        _this.userRoleAddRole = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userRoleGetRolePager') {
            _this.userRoleGetRolePager = true
          }
          if (_this.privilegesMenuArr[i] == 'userRoleAddRole') {
            _this.userRoleAddRole = true
          }

        }
      },
      //角色列表--
      roleListData (currentPage, pageSize) {
        var _this = this
        // console.log(_this.input3)
        _this.$http
          .post(
            '/user/role/getRolePager.json',
            _this.qs.stringify({
              currentPage: currentPage,
              pageSize: pageSize,
              name: _this.input1,
              createTimeBegin: _this.entryTimeBegin,
              createTimeEnd: _this.entryTimeEnd
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log(res.data.resMsg.data)
              _this.tableData3 = res.data.resMsg.data
              _this.totalRows = res.data.resMsg.totalRows
            } else {
              // console.log(res.statusText)
              console.log(res.data.resMag)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

        // 部门列表
        _this.$http
          .get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.optionstt = res.data.resMsg
              console.log(res.data.resMsg)
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
      selectGet3 (val) {
        console.log(val)
      },
      searchFn () {
        this.roleListData(this.currentPage, this.pageSize)
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

      // 时间获取
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
          name: 'addrole',
          path: '/addrole',
          params:{
            classify:'add'
          }

        })
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

      //分页功能
      handleSizeChange (val) {
        this.pageSize = Number(`${val}`)
        this.roleListData(this.currentPage, this.pageSize)
        // console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        console.log(this.currentPage, this.pageSize)
        this.roleListData(this.currentPage, this.pageSize)
        // console.log(`当前页: ${val}`)
      },
      customCompFunc (params) {
        console.log(params)

        if (params.type === 'delete') {
          // do delete operation

          this.$delete(this.tableData, params.index)
        } else if (params.type === 'edit') {
          // do edit operation

          // alert(`行号：${params.index} 姓名：${params.rowData['name']}`)
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
        // console.log('AAA', usersId)
        this.userArrId = usersId
        this.userArrName = usersName
        // console.log('BBB',this.userArrId)
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
        // console.log(params)
        let nameValArr = ''
        if (params.name != '') {
          nameValArr = 'name' + ' ' + params.name
        } else if (params.createTime != '') {
          nameValArr = 'create_time' + ' ' + params.createTime
        }
        if (nameValArr != '') {
          this.sortFn(nameValArr)
        }
      },
      sortFn (nameValArr) {
        var _this = this
        // console.log(_this.input3)
        _this.$http
          .post(
            '/user/role/getRolePager.json',
            _this.qs.stringify({
              currentPage: _this.currentPage,
              pageSize: _this.pageSize,
              name: _this.input1,
              createTimeBegin: _this.entryTimeBegin,
              createTimeEnd: _this.entryTimeEnd,
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
              // console.log(res.statusText)
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
  Vue.component('table-operation1', {
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/rolelist') {
          this.privilegesMenuFnc()
        }

      }
    },
    created () {
      this.privilegesMenuFnc()
    },
    data () {
      return {
        // 删除 权限管理-角色列表
        userRoleDeleteRole: false,
        // 修改 权限管理-角色列表
        userRoleUpdateRole: false,
        // 查看 权限管理-角色列表
        userRoleGetRoleDetail: false,

      }
    },
    template: `<span>
        <a v-if="userRoleUpdateRole" href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        <a v-if="userRoleDeleteRole" href="" @click.stop.prevent="deleteRow(rowData,index)">删除</a>
        <a v-if="userRoleGetRoleDetail" href="" @click.stop.prevent="syspower(rowData,index)">查看</a>
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
        _this.userRoleUpdateRole = false
        _this.userRoleDeleteRole = false
        _this.userRoleGetRoleDetail = false

        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        // 新增用户
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {

          if (_this.privilegesMenuArr[i] == 'userRoleUpdateRole') {
            _this.userRoleUpdateRole = true
          }
          if (_this.privilegesMenuArr[i] == 'userRoleDeleteRole') {
            _this.userRoleDeleteRole = true
          }
          if (_this.privilegesMenuArr[i] == 'userRoleGetRoleDetail') {
            _this.userRoleGetRoleDetail = true
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
          name: 'editrole',
          path: '/editrole',
          params: {
            id: params.rowData.id,
            name: params.rowData.name,
            description: params.rowData.description,
            privilegeIds: params.rowData.privilegeIds
          }
        })
      },

      // 查看
      syspower () {
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        this.$router.push({
          name: 'lookrole',
          path: '/lookrole',
          params: {
            id: params.rowData.id,
            name: params.rowData.name,
            description: params.rowData.description,
            privilegeIds: params.rowData.privilegeIds
          }
        })
      },
      deleteRow () {
        let _this = this
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        // this.$emit('on-custom-comp', params)
        console.log(params)

        _this
          .$confirm('是否确定删除角色？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {

            // console.log(someDel)
            // 删除用户接口
            _this.$http
              .post(
                '/user/role/deleteRole.json',
                _this.qs.stringify({
                  id: params.rowData.id
                })
              )
              .then(function (res) {
                if (res.data.resStatus == 1000) {
                  console.log(res.data.resMsg)
                  //刷新用户列表
                  _this.$notify({
                    title: '成功',
                    type: 'success',
                    message: res.data.resMsg,
                    duration: 3000
                  })

                  _this.$http
                    .post(
                      '/user/role/getRolePager.json',
                      _this.qs.stringify({
                        currentPage: 1,
                        pageSize: 10,
                        name: _this.input1,
                        createTimeBegin: _this.entryTimeBegin,
                        createTimeEnd: _this.entryTimeEnd
                      })
                    )
                    .then(function (res) {
                      // console.log(res)
                      if (res.data.resStatus == 1000) {
                        console.log(res.data.resMsg.data)

                        _this.tableData3 = res.data.resMsg.data
                        _this.totalRows = res.data.resMsg.totalRows

                        _this.eventsBus.$emit('uploadata1', _this.tableData3)
                      } else {
                        // alert(res.statusText)
                      }
                    })
                    .catch(function (err) {
                      console.log(err)
                    })

                  // 部门列表
                  _this.$http
                    .get('/user/dept/getDeptTree.json')
                    .then(function (res) {
                      if (res.data.resStatus == 1000) {
                        _this.optionstt = res.data.resMsg
                        console.log(res.data.resMsg)
                      } else {
                      }
                    })
                    .catch(function (err) {
                      console.log(err)
                    })

                } else {
                  console.log(res.data.resMsg)
                  _this.$notify({
                    title: '失败',
                    type: 'error',
                    message: res.data.resMsg,
                    duration: 3000

                  })
                  setTimeout(function () {
                    _this.$router.push({
                      name: 'rolelist',
                      path: '/rolelist'
                    })
                  }, 1000)
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          })
          .catch(() => {
            // _this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // })
          })

      }
    }
  })
</script>

<style lang="less">
  #roleList .roleList_Con {
    max-width: 100% !important;
  }

  #roleList .el-row {
    max-width: 1200px;
  }

  #roleList .elRow2 .el-col {
    text-align: left;
  }

  #roleList .el-input__icon {
    line-height: 0;
  }

  #roleList .el-date-editor .el-range-separator {
    line-height: 27px;
  }

  #roleList .cell > button {
    padding: 0 !important;
  }

  //表格图片设置
  #roleList .imgStyle {
    width: 15px;
    height: 15px;
    margin-top: 12px;
    display: inline-table;
  }

  #roleList .roleList_Con_search {
    padding-left: 10px;
  }
</style>
