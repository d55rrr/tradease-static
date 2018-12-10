<template>
  <div id="dictionar">
    <div v-if="userDicdataGetDicDataPage" class="dictionar_Con">
      <el-row>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">业务模块：</span>

            <!--<treeselect-->
            <!--:options="options1"-->
            <!--placeholder="请选择业务模块"-->
            <!--:default-expand-level="10"-->
            <!--:normalizer="normalizer"-->
            <!--v-model="selectValue1"-->
            <!--/>-->
            <el-select v-model="selectValue1" @change="yewuFn($event,0)" placeholder="请选择业务模块">
              <el-option
                v-for="item in options1"
                :key="item"
                :label="item"
                :value="item"

              >
              </el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">属性名称：</span>
            <!--<treeselect-->
            <!--:options="options2"-->
            <!--placeholder="请选择属性名称"-->
            <!--:default-expand-level="10"-->
            <!--:normalizer="normalizer"-->
            <!--@select="postname"-->
            <!--v-model="selectValue2"-->
            <!--/>-->
            <el-select v-model="selectValue2" @change="yewuFn($event,1)" placeholder="请选择属性名称">
              <el-option
                v-for="item in options2"
                :key="item"
                :label="item"
                :value="item"

              >
              </el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="6">
          <div class="demo-input-suffix">
            <span class="inlineBlock">状态：</span>
            <!--<treeselect-->
            <!--:options="options3"-->
            <!--placeholder="请选择状态"-->
            <!--:default-expand-level="10"-->
            <!--:normalizer="normalizer"-->
            <!--@select="postname"-->
            <!--v-model="selectValue3"-->
            <!--/>-->
            <el-select v-model="selectValue3" @change="yewuFn($event,2)" placeholder="请选择状态">
              <el-option
                v-for="item in options3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                {{item.name}}
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="dictionar_Con_search">
            <div class="dictionar_Con_btn_search">
              <button @click="searchFn(0)" type="button" class="el-button el-button--primary"><span>查询</span></button>
              <button @click="searchFn(1)" type="button" class="el-button el-button--success"><span>清空</span></button>
            </div>
          </div>
        </el-col>

        <template slot-scope="scope">
          <img :src="scope.row.imgPath" alt="" style="width: 50px;height: 50px">
        </template>

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
      <div class="dictionar_Con_table">
        <div class="dictionar_Con_table_btn">
          <button v-if="userDicdataSaveDicData" @click="addUserFn" type="button" class="el-button el-button--primary">
            <span>新增</span></button>
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
        ></v-table>

        <div class="dictionar_Con_table_pages">
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
  import qiyong from '@/assets/img/qiyong.png'
  import jinyong from '@/assets/img/jinyong.png'

  export default {
    data () {

      return {
        // 列表权限
        userDicdataGetDicDataPage: false,
        // 新增权限
        userDicdataSaveDicData: false,
        options1: [],
        options2: [],
        options3: [{
          id: 1,
          name: '启用'
        }, {
          id: 2,
          name: '禁用'
        }],
        //easytable选中删除项
        selectArr: [],
        // 启用禁用

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
            field: 'businessName',
            title: '业务模块',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',

            isResize: true
          },
          {
            field: 'subjectName',
            title: '属性名称',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',

            isResize: true
          },
          {
            field: 'name',
            title: '选项名',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',

            isResize: true
          },
          {
            field: 'value',
            title: '选项值',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',

            isResize: true
          },
          {
            field: 'status',
            title: '启用状态',
            width: 30,
            titleAlign: 'center',
            columnAlign: 'center',
            formatter: function (rowData) {
              let _this = this
              // console.log(rowData.inService)

              if (rowData.status == 1) {
                return (
                  '<img style="width: 20px;height: 20px;margin-top:10px;" title="启用"  src="' +
                  qiyong +
                  '"/>'
                )
              } else {
                return (
                  '<img style="width: 20px;height: 20px;margin-top:10px;" title="禁用"  src="' +
                  jinyong +
                  '"/>'
                )
              }
            },
            isResize: true
          },
          {
            field: '',
            title: '操作',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            componentName: 'table-dictionar',
            isResize: true
          }
        ]
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/dictionar') {
          this.privilegesMenuFn()
          this.dictionarData(this.currentPage, this.pageSize)
          this.selectValue1 = ''
          this.selectValue2 = ''
          this.selectValue3 = ''
        }

      },
      selectValue1 (newdata, olddata) {
        // 属性名称接口
        let _this = this
        _this.$http
          .post('/user/dicdata/getRangeSubjectName.json', _this.qs.stringify({
            businessName: newdata
          }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options2 = res.data.resMsg
              console.log(res.data.resMsg)
            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

    },
    created () {
      this.privilegesMenuFn()
      this.dictionarData(this.currentPage, this.pageSize)

    },
    mounted () {
      var _this = this
      _this.eventsBus.$on('uploadata-dic', function (val) {
        _this.dictionarData(_this.currentPage, _this.pageSize, _this.selectValue1, _this.selectValue2, _this.selectValue3)
      })
    },

    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.userDicdataGetDicDataPage = false
        _this.userDicdataSaveDicData = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userDicdataGetDicDataPage') {
            _this.userDicdataGetDicDataPage = true
          }
          if (_this.privilegesMenuArr[i] == 'userDicdataSaveDicData') {
            _this.userDicdataSaveDicData = true
          }

        }
      },

      //岗位列表搜索
      dictionarData (currentPage, pageSize, businessName, subjectName, status) {
        var _this = this
        // console.log(_this.input3)
        _this.$http
          .post(
            '/user/dicdata/getDicDataPage.json',
            _this.qs.stringify({
              currentPage,
              pageSize,
              businessName,
              subjectName,
              status
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log('EEEEEEE', res.data.resMsg)
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

        // 业务模块接口
        _this.$http
          .post('/user/dicdata/getAllBusinessName.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options1 = res.data.resMsg
              // console.log(res.data.resMsg)
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
      searchFn (val) {
        if (val == 0) {
          this.dictionarData(this.currentPage, this.pageSize, this.selectValue1, this.selectValue2, this.selectValue3)
        } else {
          this.selectValue1 = ''
          this.selectValue2 = ''
          this.selectValue3 = ''
          this.options2=[]
          this.dictionarData(this.currentPage, this.pageSize)
        }

      },
      emptyFn () {
        this.input1 = ''
        this.input2 = ''
        this.input3 = ''
        this.selectValue1 = null
        this.selectValue2 = null
        this.statusData = ''
        this.entryTimeBegin = ''
        this.entryTimeEnd = ''
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
          name: 'adddictionar',
          path: '/adddictionar',
          params: {}
        })
      },
      //业务模块
      yewuFn (val, index) {
        // console.log(val, index)
        if (index == 0) {
          this.selectValue1 = val
          console.log(this.selectValue1)
        } else if (index == 1) {
          this.selectValue2 = val
          console.log(this.selectValue2)
        } else {
          this.selectValue3 = val
          console.log(val)
        }

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
        this.dictionarData(this.currentPage, this.pageSize,this.selectValue1, this.selectValue2, this.selectValue3)
        console.log("==="+this.businessName)
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        console.log(this.currentPage, this.pageSize)
        this.dictionarData(this.currentPage, this.pageSize,this.selectValue1, this.selectValue2, this.selectValue3)

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
        this.selectValue2 = val.name
        console.log(this.selectValue2)
      },
      // 表格排序
      sortChange (params) {
        // console.log('000'+params.username)
        // console.log('000'+params.realname)
        // console.log('000'+params.deptName)
        // console.log('000'+params.positionName)
        // console.log('000'+params.tel)
        // console.log('000'+params.entryTime)

        // 正序
        if (params.entryTime == 'asc') {
        }
        // 倒序
        if (params.entryTime == 'desc') {
        }
      }
    }
  }

  // 自定义列组件
  Vue.component('table-dictionar', {
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/dictionar') {
          this.privilegesMenuFnd()
        }

      }
    },
    created () {
      this.privilegesMenuFnd()
    },
    data () {
      return {

        // 修改
        userDicdataEditOption: false,
        // 禁用
        userDicdataDisableOption: false,
        // 启用禁用
      }
    },
    template: `<span>
        <a v-if="userDicdataEditOption" href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        <a v-if="userDicdataDisableOption && rowData.status==1" href="" @click.stop.prevent="reloadpass(rowData,index)">禁用</a>
        <a v-if="userDicdataDisableOption && rowData.status==2" href="" @click.stop.prevent="reloadpass(rowData,index)">启用</a>
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
      privilegesMenuFnd () {
        let _this = this
        _this.userDicdataEditOption = false
        _this.userDicdataDisableOption = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'userDicdataEditOption') {
            _this.userDicdataEditOption = true
          }
          if (_this.privilegesMenuArr[i] == 'userDicdataDisableOption') {
            _this.userDicdataDisableOption = true
          }
        }
      },
      //编辑信息
      update () {
        // 参数根据业务场景随意构造
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        // this.$emit('on-custom-comp', params)
        // console.log(params)
        this.$router.push({
          name: 'editdictionar',
          path: '/editdictionar',
          params: {
            id: params.rowData.id,
            businessName: params.rowData.businessName,
            subjectName: params.rowData.subjectName,
            name: params.rowData.name,
            value: params.rowData.value,
            status: params.rowData.status,
          }
        })
      },
      // 禁用
      reloadpass () {
        let _this = this
        let params = {type: 'edit', index: _this.index, rowData: _this.rowData}
        console.log(params)
        if (params.rowData.status == 1) {
          _this.$http.post('/user/dicdata/disableOption.json', _this.qs.stringify({
            id: params.rowData.id
          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
                // console.log(res.data.resMsg)
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '禁用成功',
                  duration: 3000
                })
                _this.eventsBus.$emit('uploadata-dic', 2)

              } else {
                console.log(res.data.resMsg)
                // alert(res.statusText)
              }

            })
            .catch(function (err) {
              console.log(err)
            })
        } else {
          _this.$http.post('/user/dicdata/enableOption.json', _this.qs.stringify({
            id: params.rowData.id
          }))
            .then(function (res) {
              // console.log(res)
              if (res.data.resStatus == 1000) {
                // console.log(res.data.resMsg)
                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '启用成功',
                  duration: 3000
                })
                _this.eventsBus.$emit('uploadata-dic', 2)

              } else {
                console.log(res.data.resMsg)
                // alert(res.statusText)
              }

            })
            .catch(function (err) {
              console.log(err)
            })
        }

      },

      normalizer () {

      }
    }
  })
</script>

<style lang="less">
  #dictionar .dictionar_Con {
    max-width: 100% !important;
  }

  /*.el-row {*/
  /*max-width: 1000px;*/
  /*}*/

  #dictionar .elRow2 .el-col {
    text-align: left;
  }

  #dictionar .el-input__icon {
    line-height: 0;
  }

  #dictionar .el-date-editor .el-range-separator {
    line-height: 21px;
  }

  #dictionar .dictionar_Con_search {
    margin-top: 5px;
  }

  #dictionar .cell > button {
    padding: 0 !important;
  }

  //表格图片设置
  #dictionar .imgStyle {
    width: 15px;
    height: 15px;
    margin-top: 12px;
    display: inline-table;
  }

  #dictionar .inlineBlock {
    width: 65px;
  }
</style>
