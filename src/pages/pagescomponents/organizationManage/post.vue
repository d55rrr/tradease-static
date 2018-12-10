<template>
  <div id="post">
    <div class="post_Con">
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">部门：</span>

            <treeselect
              :options="options1"
              placeholder="请选择部门"
              :default-expand-level="10"
              :normalizer="normalizer"
              v-model="selectValue1"
            />

          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">岗位：</span>
            <el-input
              @change="postname"
              placeholder="请输入岗位"
              v-model="selectValue2"
              clearable>
            </el-input>
            <!--<treeselect-->
            <!--:options="options2"-->
            <!--placeholder="请选择岗位"-->
            <!--:default-expand-level="10"-->
            <!--:normalizer="normalizer"-->
            <!--@select="postname"-->
            <!--v-model="selectValue2"-->
            <!--/>-->
          </div>
        </el-col>
        <el-col :span="8">
          <div class="post_Con_search">
            <div class="post_Con_btn_search">
              <button @click="searchFn" type="button" class="el-button el-button--primary"><span>查询</span></button>
              <button @click="emptyFn" type="button" class="el-button el-button--success"><span>清空</span></button>
            </div>
          </div>
        </el-col>
        <template slot-scope="scope">
          <img :src="scope.row.imgPath" alt="" style="width: 50px;height: 50px">
        </template>

      </el-row>


      <!-- table部分 -->
      <div v-if="userPosiGetPosiPager" class="post_Con_table">
        <div class="post_Con_table_btn">
          <button v-if="userPosiSavePosition" @click="addUserFn" type="button" class="el-button el-button--primary">
            <span>新增岗位</span></button>
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

        <div class="post_Con_table_pages">
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
        // 新增岗位权限
        userPosiSavePosition: false,
        //列表权限
        userPosiGetPosiPager: false,

        // 本页面按钮Key
        menuKey: [{}],
        options1: [],
        options2: [],
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
        scroll: '',
        //入职离职时间
        statusData: '',
        entryTimeBegin: '',
        entryTimeEnd: '',

        //分页
        currentPage4: 1,
        //文档高度
        winH: 0,
        //所属部门id数组
        deptIdss: [],

        //table数据
        tableData3: [],

        // 批量选中用户ID的集合
        userarrId: [],
        // 批量选中用户Name的集合
        userarrName: [],
        // 排序
        multipleSort: false,
        // 跨组件刷新
        tempreload: '',
        //表格构造设置
        columns: [

          {
            field: 'name',
            title: '岗位名称',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'deptsStr',
            title: '所属部门',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'responsibility',
            title: '岗位职责',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'description',
            title: '岗位描述',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'custome-adv',
            title: '操作',
            width: 30,
            titleAlign: 'center',
            columnAlign: 'center',
            componentName: 'table-operation2',
            isResize: true
          }
        ]
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/post') {
          this.selectValue1 = null
          this.selectValue2 = null
          this.privilegesMenuFn()
          this.postData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)
          // this.currentPage = 1
        }

      },

      //监听数据变化
      // selectValue1 (val, oldVal) {
      //   console.log('部门-selectValue1: ' + val)
      //   var _this = this
      //   _this.selectValue2 = null
      //   // 岗位列表
      //   _this.$http
      //     .post(
      //       '/user/posi/getPosiByDeptId.json',
      //       _this.qs.stringify({
      //         deptId: val
      //       })
      //     )
      //     .then(function (res) {
      //       if (res.data.resStatus == 1000) {
      //         _this.options2 = res.data.resMsg
      //         console.log(res.data.resMsg)
      //       } else {
      //       }
      //     })
      //     .catch(function (err) {
      //       console.log(err)
      //     })
      // },

    },
    created () {
      this.privilegesMenuFn()
      this.postData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)

    },
    mounted () {
      var _this = this
      _this.eventsBus.$on('uploadata', function (val) {
        // this.postData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)
        _this.postData(_this.currentPage, _this.pageSize, _this.selectValue1, _this.selectValue2)
      })
    },

    methods: {

      //岗位列表搜索
      postData (currentPage, pageSize, deptIds, name) {

        var _this = this

        // console.log(_this.input3)
        _this.$http
          .post(
            '/user/posi/getPosiPager.json',
            _this.qs.stringify({
              currentPage: currentPage,
              pageSize: pageSize,
              deptIds: deptIds,
              name: name
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log('EEEE', res.data.resMsg)
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

        // 部门列表
        _this.$http
          .get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options1 = res.data.resMsg
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
        this.eventsBus.$emit('postbusdata', this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)
        this.postData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)
      },
      emptyFn () {
        this.selectValue1 = null
        this.selectValue2 = null
        this.searchFn()
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
          name: 'addPost',
          path: '/addPost',
          params: {
            classify: 'add'
        }
        })
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
        // this.eventsBus.$emit('postbusdata', this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)
        this.postData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)
        // console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        console.log(this.currentPage, this.pageSize)
        this.postData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2)

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
      //岗位名称
      postname (val) {
        console.log(val)
        this.selectValue2 = val
        // console.log(this.selectValue2)
      },
      // 表格排序
      sortChange (params) {
        console.log(params)
        let nameValArr = ''
        if (params.name != '') {
          nameValArr = 'name' + ' ' + params.name
        } else if (params.responsibility != '') {
          nameValArr = 'responsibility' + ' ' + params.responsibility
        } else if (params.description != '') {
          nameValArr = 'description' + ' ' + params.description
        }
        console.log(nameValArr)
        if (nameValArr != '') {
          // this.sortFn(nameValArr)
        }

      },

      // 排序
      sortFn (nameValArr) {
        console.log(nameValArr)
        var _this = this
        _this.$http
          .post(
            '/user/posi/getPosiPager.json',
            _this.qs.stringify({
              currentPage: _this.currentPage,
              pageSize: _this.pageSize,
              deptIds: _this.selectValue1,
              name: _this.selectValue2,
              sortColumns: nameValArr
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log('EEEE', res.data.resMsg)
              _this.tableData3 = res.data.resMsg.data
              _this.totalRows = res.data.resMsg.totalRows

            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.userPosiSavePosition = false
        _this.userPosiGetPosiPager = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(localStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        // 新增岗位
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userPosiSavePosition') {
            _this.userPosiSavePosition = true
          }
          if (_this.privilegesMenuArr[i] == 'userPosiGetPosiPager') {
            _this.userPosiGetPosiPager = true
          }
          //
        }
      },
    }
  }

  // 自定义列组件
  Vue.component('table-operation2', {
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/post') {
          this.privilegesMenuFn()
        }

      }
    },
    created () {
      let _this = this
      _this.eventsBus.$on('postbusdata', function (currentPage, pageSize, selectValue1, selectValue2) {
        console.log(currentPage, pageSize, selectValue1, selectValue2)
        _this.currentPage = currentPage
        _this.pageSize = pageSize
        _this.selectValue1 = selectValue1
        _this.selectValue2 = selectValue2
      })
      _this.privilegesMenuFn()

    },
    mounted () {

    },
    data () {
      return {
        //新增
        userPosiSavePosition:false,
        // 修改
        userPosiUpdatePosition: false,
        // 删除
        userPosiDeletePosition: false,
        // 查看
        userPosiGetPosition:false,

        currentPage: '',
        pageSize: '',
        selectValue1: '',
        selectValue2: ''
      }
    },
    template: `<span>
        <a v-if="userPosiUpdatePosition" href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        <a v-if="userPosiDeletePosition" href="" @click.stop.prevent="reloadpass(rowData,index)">删除</a>
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
      privilegesMenuFn () {
        let _this = this
        _this.userPosiGetPosition=false
        _this.userPosiUpdatePosition = false
        _this.userPosiDeletePosition = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userPosiUpdatePosition') {
            _this.userPosiUpdatePosition = true
          }
          if (_this.privilegesMenuArr[i] == 'userPosiDeletePosition') {
            _this.userPosiDeletePosition = true
          }
          if (_this.privilegesMenuArr[i] == 'userPosiGetPosition') {
            _this.userPosiGetPosition = true
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
          name: 'addPost',
          path: '/addPost',
          params: {
            id: params.rowData.id,
            classify: 'edit'
          }
        })
      },
      reloadpass () {
        let _this = this
        let params = {type: 'edit', index: _this.index, rowData: _this.rowData}
        console.log(params)

        console.log(_this.currentPage, _this.currentPage, _this.selectValue1, _this.selectValue2)
        _this
          .$confirm('确定删除此岗位？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            //删除部门字符串
            let someDel = params.rowData.id

            // console.log(someDel)
            // 删除岗位接口
            _this.$http
              .post(
                '/user/posi/deletePosition.json',
                _this.qs.stringify({
                  id: someDel
                })
              )
              .then(function (res) {
                if (res.data.resStatus == 1000) {
                  console.log(res.data.resMsg)

                  //刷新岗位列表
                  _this.eventsBus.$emit('uploadata', res.data.resMsg.data)

                  _this.$notify({
                    title: '成功',
                    type: 'success',
                    message: '删除成功!',
                    duration: 3000
                  })
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
          .catch(() => {
            // _this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // })
          })

      },
      // 用户授权
      syspower () {
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        this.$router.push({
          name: 'permission',
          path: '/permission',
          params: {
            deptsId: params.rowData.id,
            username: params.rowData.username,
            realname: params.rowData.realname,
            deptName: params.rowData.deptName,
            positionName: params.rowData.positionName
          }
        })
      },
      deleteRow () {
        // 参数根据业务场景随意构造
        let params = {type: 'delete', index: this.index}
        this.$emit('on-custom-comp', params)
      },
      normalizer () {

      }
    }
  })
</script>

<style lang="less">
  #post .post_Con {
    max-width: 100% !important;
  }

  #post .el-row {
    max-width: 1000px;
  }

  #post .elRow2 .el-col {
    text-align: left;
  }

  #post .el-input__icon {
    line-height: 0px;
  }

  #post .el-date-editor .el-range-separator {
    line-height: 21px;
  }

  #post .cell > button {
    padding: 0 !important;
  }

  //表格图片设置
  #post .imgStyle {
    width: 15px;
    height: 15px;
    margin-top: 12px;
    display: inline-table;
  }

</style>
