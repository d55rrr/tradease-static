<template>
  <div id="productList">
    <!--表单Mark弹层-->
    <el-dialog title="新增" :visible.sync="dialogMark" width="650px">
      <div class="tebleMark">
        <div class="tebleMark_con">
          <p class="inlineBlock">版本号：<i>*</i></p>
          <p>
            <el-input class="el-inputStyle" v-model="newinput1" placeholder="请输入版本号" @blur="isExist" ref="versionInput"></el-input>
          </p>
        </div>
        <div class="tebleMark_con">
          <p class="inlineBlock">目的：<i>*</i></p>
          <p>
            <el-select @change="newinput1Fn($event)" v-model="newinput2" placeholder="请选择">
              <el-option
                v-for="item in targetArr"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con">
          <p class="inlineBlock">负责人：<i>*</i></p>
          <p>
            <el-select @change="newinput2Fn($event)" multiple v-model="newinput3" placeholder="请选择">
              <el-option
                v-for="item in allUserlist"
                :key="item.id"
                :label="item.realnameWithDeptName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con tebleMark_con_input">
          <p class="inlineBlock">发布时间：<i>*</i></p>
          <p>
            <el-date-picker
              v-model="newinput4"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </p>
        </div>
        <div class="tebleMark_con">
          <p>描述：</p>
          <p>
          <textarea v-model="newinput5" id="describeArr">
          </textarea>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRowTrue(0)">取 消</el-button>
          <el-button type="primary" @click="addRowTrue(1)">确 定</el-button>
        </span>
      </div>

    </el-dialog>

    <el-dialog title="新增" :visible.sync="dialogMarkTable" width="1000px">
      <div>
        <button @click="addRow" type="button" class="el-button el-button--primary"><span>增行</span></button>
        <button @click="delRow" type="button" class="el-button el-button--success"><span>删行</span></button>
      </div>
      <div class="tebleMark">
        <div class="easytable">

          <el-table
            ref="singleTable"
            highlight-current-row
            :data="versions"
            :row-class-name="tableRowClassName1"
            @current-change="handleCurrentChange"
            @row-click="rowClick1"
            style="width: 100%;min-height:200px;">
            <el-table-column
              type="index"
              label="序号"
              width="">
            </el-table-column>
            <el-table-column
              property="version"
              label="版本号"
              width="">
            </el-table-column>

            <el-table-column
              property="target"
              label="目的"
              width="">
              <template slot-scope="scope">
                {{scope.row.target|targetName(targetArr)}}
              </template>
            </el-table-column>
            <el-table-column
              property="managerNames"
              label="负责人"
              width="">
            </el-table-column>
            <el-table-column
              property="releaseTime"
              label="发布时间"
              width="">
            </el-table-column>
            <el-table-column
              property="description"
              label="描述"
              width="">
            </el-table-column>
          </el-table>

        </div>
      </div>

    </el-dialog>

    <div class="productList_Con">
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">产品名称：</span>
            <el-input
              placeholder="请输入产品名称"
              v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">一级分类：</span>

            <el-select filterable v-model="input2" @change="firstTypeFn" placeholder="请选择">
              <el-option
                v-for="item in firstTypeOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">二级分类：</span>

            <el-select filterable v-model="type"  placeholder="请选择">
              <el-option
                v-for="item in typeOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <div class="demo-input-suffix">
            <span class="inlineBlock">所属部门：</span>
            <treeselect
              :options="optionstt"
              placeholder="请选择部门"
              :default-expand-level="10"
              v-model="selectValue1"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock inlineB1">状态：</span>
            <el-select filterable  v-model="stage" placeholder="请选择">
              <el-option
                v-for="item in stageOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>

        <template slot-scope="scope">
          <!--<img :src="scope.row.imgPath" alt="" style="width: 50px;height: 50px">-->
        </template>

      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">上线时间：</span>
            <el-date-picker
              @change="statusDataFn1"
              v-model="statusData1"
              type="daterange"
              range-separator="——"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">下线时间：</span>
            <el-date-picker
              @change="statusDataFn2"
              v-model="statusData2"
              type="daterange"
              range-separator="——"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">

          <div class="productList_Con_search">
            <div class="productList_Con_btn_search">
              <button @click="searchFn" type="button" class="el-button el-button--primary"><span>查询</span></button>
              <button @click="emptyFn" type="button" class="el-button el-button--success"><span>清空</span></button>
            </div>
          </div>
        </el-col>
      </el-row>


      <!-- table部分 -->
      <div class="productList_Con_table">
        <div class="productList_Con_table_btn">
          <button v-if="devProductListSave" @click="addUserFn" type="button" class="el-button el-button--primary"><span>新增</span></button>
          <button v-if="devProductDeleteProductBatch" @click="delUserFn" type="button" class="el-button el-button--primary"><span>删除</span></button>
        </div>

        <el-table
          :data="tableData3"
          border
          @selection-change="handleSelectionChange">
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed
            prop="name"
            label="产品名称"
            height="40">
          </el-table-column>
          <el-table-column
            prop="secondType.secondTypeName"
            label="产品分类"
            height="40">
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="所属部门"
            height="40px">
          </el-table-column>
          <el-table-column
            prop="releaseTime"
            label="首次上线时间"
            height="40">
          </el-table-column>
          <el-table-column
            prop="stageName"
            label="状态"
            height="40">
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="170"
            height="40">
            <template slot-scope="scope">
              <el-button  v-if="devProductUpdateProduct"  @click="editFn(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="devProductGetProductDetail" @click="lookFn(scope.row)" type="text" size="small">查看</el-button>
              <el-button v-if="devProductUpdateProductVersion&&devProductGetVersionList" @click="addFn(scope.row)" type="text" size="small">增加版本</el-button>
            </template>
          </el-table-column>
        </el-table>


        <div class="productList_Con_table_pages">
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

  export default {
    data () {
      return {
        type: null,
        startTime: '',
        endTime: '',
        optionstt: [],
        optionstg: [],
        stage: null,
        stageOpt: [],
        firstTypeOpt: [{
          value: 'hardware',
          name: '纯硬件'
        }, {
          value: 'software',
          name: '纯软件'
        }, {
          value: 'hsware',
          name: '软硬件结合'
        }],
        typeOpt: [],
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
        //上下线时间
        statusData1: '',
        statusData2: '',
        startTimeBegin: '',
        startTimeEnd: '',
        endTimeBegin: '',
        endTimeEnd: '',
        versions: [],
        // 增加版本ID
        versId: '',
        //分页
        currentPage4: 1,
        //文档高度
        winH: 0,
        // 负责人列表
        allUserlist: '',
        // 目的
        targetArr: [],

        // 提交信息的内容
        newinput1: '',
        newinput2: '',
        newinput3: [],
        newinput4: '',
        newinput5: '',
        newinput2Id: '',
        newinput3Id: '',
        newinput3Text: [],
        versionJson: [],
        //选中的行
        rowIndex: '',
        // 删除商品ID
        delRowId: '',
        stageName:'',
        dialogMarkTable: false,
        dialogMark: false,
        //table数据
        tableData3: [],

        // 批量选中用户ID的集合
        userarrId: [],
        // 批量选中用户Name的集合
        userarrName: [],
        // 排序
        multipleSort: false,
        //按钮显示
        devProductListSave:false,
        devProductDeleteProductBatch:false,
        devProductUpdateProduct:false,
        devProductGetProductDetail:false,
        devProductUpdateProductVersion:false,
        devProductGetVersionList:false,

      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/productlist') {
          let _this=this
          this.dicSelect('dev','productStage',function (data) {
            _this.stageOpt=data
          })
          this.dicSelect('dev','versionTarget',function (data) {
            _this.targetArr=data
          })
          this.privilegesMenuFn()
          this.productListData(this.currentPage, this.pageSize)
        }
      },

    },
    created () {
      let _this=this
      this.dicSelect('dev','productStage',function (data) {
        _this.stageOpt=data
      })
      this.dicSelect('dev','versionTarget',function (data) {
        _this.targetArr=data
        console.log('dic')
        console.log(data)
      })
      this.privilegesMenuFn()
      this.productListData(this.currentPage, this.pageSize)
    },
    mounted () {
    },

    methods: {
      //按钮是否显示
      privilegesMenuFn () {
        let _this = this
        _this.devProductListSave=false
          _this.devProductDeleteProductBatch=false
          _this.devProductUpdateProduct=false
          _this.devProductGetProductDetail=false
          _this.devProductUpdateProductVersion=false
          _this.devProductGetVersionList=false
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        privilegesMenu.forEach(item=>{
          if(item.priKey==='devProductListSave'){
            _this.devProductListSave=true
          }
          if(item.priKey==='devProductDeleteProductBatch'){
            _this.devProductDeleteProductBatch=true
          }
          if(item.priKey==='devProductUpdateProduct'){
            _this.devProductUpdateProduct=true
          }
          if(item.priKey==='devProductGetProductDetail'){
            _this.devProductGetProductDetail=true
          }
          if(item.priKey==='devProductUpdateProductVersion'){
            _this.devProductUpdateProductVersion=true
          }
          if(item.priKey==='devProductGetVersionList'){
            _this.devProductGetVersionList=true
          }
        })

      },
      //判断版本号是否已存在
      isExist(){
        let _this=this
        let result= _this.versions.filter(version=>version.version===_this.newinput1)
        console.log(result)
        if(result.length>0){
          _this.$notify({
            title: '错误',
            type: 'error',
            message: '版本号重复！',
            duration: 3000
          })
          this.$refs.versionInput.select()
        }
      },
      //产品列表
      productListData (currentPage, pageSize) {
        var _this = this
        // console.log(_this.input3)
        _this.$http
          .post(
            '/dev/product/getProductPager.json',
            _this.qs.stringify({
              currentPage: currentPage,
              pageSize: pageSize,
              name: _this.input1,
              type: _this.type,
              stage: _this.stage,
              deptId: _this.selectValue1,
              releaseTimeBegin: _this.startTimeBegin,
              releaseTimeEnd: _this.startTimeEnd,
              offlineTimeBegin: _this.endTimeBegin,
              offlineTimeEnd: _this.endTimeEnd,
            })
          )
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              // console.log(res.data.resMsg.data)
              _this.tableData3 = res.data.resMsg.data
              _this.totalRows = res.data.resMsg.totalRows
            } else {
              alert(res.data.resMsg)
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
        this.productListData(this.currentPage, this.pageSize)
      },
      emptyFn () {
        this.input1 = ''
        this.input2 = ''
        this.input3 = ''
        this.typeOpt=[]
        this.type = ''
        this.stage = ''
        this.selectValue1 = null
        this.selectValue2 = null
        this.selectValue3 = null
        this.statusData1 = ''
        this.statusData2 = ''
        this.startTimeBegin = ''
        this.startTimeEnd = ''
        this.endTimeBegin = ''
        this.endTimeEnd = ''
        this.productListData(this.currentPage,this.pageSize)
      },

      //入职时间判断（0,1）
      statusYnFn (row, column, cellValue) {
        console.log(row)
        console.log(column)
        console.log(cellValue)
      },

      // 上线离职时间获取
      statusDataFn1 (time) {
        console.log(time)
        let time1 = this.moment(time[0]).format('YYYY-MM-DD')
        console.log(time1)
        this.startTimeBegin = time1

        let time2 = this.moment(time[1]).format('YYYY-MM-DD')
        console.log(time2)
        this.startTimeEnd = time2

        // console.log(val[1])
      },
      // 下线离职时间获取
      statusDataFn2 (time) {
        let time1 = this.moment(time[0]).format('YYYY-MM-DD')
        console.log(time1)
        this.endTimeBegin = time1

        let time2 = this.moment(time[1]).format('YYYY-MM-DD')
        console.log(time2)
        this.endTimeEnd = time2

        // console.log(val[1])
      },
      //右侧按钮功能
      addUserFn () {
        let _this = this
        _this.$router.push({
          name: 'addproduct',
          path: '/addproduct'
        })
      },
      // mark弹出层 删除用户信息
      delUserFn () {
        let _this = this
        if(!_this.selectArr||_this.selectArr.length===0){
          _this.$notify({
            title: '错误',
            type: 'error',
            message: '请指定产品再操作'
          })
          return
        }
        _this.$confirm('确定删除产品吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //批量删除ID字符串
            let someDel = ''
            // console.log(_this.selectArr)
            // 删除用户接口
            _this.$http
              .post(
                '/dev/product/deleteProductBatch.json',
                _this.qs.stringify({
                  id: String(_this.selectArr)
                })
              )
              .then(function (res) {
                console.log(someDel)
                if (res.data.resStatus == 1000) {
                  console.log(res.data.resMsg.data)

                  //刷新用户列表
                  _this.productListData(_this.currentPage, _this.pageSize)
                  _this.$notify({
                    title: '成功',
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  alert(res.data.resMsg)
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
      //点击行触发
      rowClick1 (row) {
        console.log(row)
        console.log(row.index)
        let _this = this
        // 获取点击的脚标
        _this.rowIndex = row.index
        _this.delRowId = row.id
        // console.log(_this.rowIndex)
      },

      morekeyFn () {
        let _this = this
        //字符串转数组
        // let arr = _this.userArrId.split(",")
        // console.log('AAAA',arr)

        if (_this.userArrId != null && _this.userArrId != '' && _this.userArrId.length && _this.userArrId.length > 1) {
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
          alert('选择用户数量应大于一个')
        }
      },

      eidtuser (val) {
      },
      importFn () {
      },
      normalizer (val) {
        // console.log(val)
      },
      tableRowClassName1 ({row, rowIndex}) {
        row.index = rowIndex
      },

      //分页功能
      handleSizeChange (val) {
        this.pageSize = Number(`${val}`)
        this.productListData(this.currentPage, this.pageSize)
        // console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        this.productListData(this.currentPage, this.pageSize)
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
      },
      // 一级分类
      firstTypeFn (val) {
        let _this = this
        _this.type = null
        // 二级级菜单联动
        _this.$http.post('/user/dicdata/getdics.json', _this.qs.stringify({
          businessName: 'dev',
          subjectName: val
        }))
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              // console.log(res.data.resMsg)
              _this.typeOpt = res.data.resMsg
            } else {
              console.log(res.data.resMag)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      },
      // 编辑
      editFn (val) {
        console.log(val)
        let _this = this
        _this.$router.push({
          name: 'editproduct',
          path: '/editproduct',
          query: {
            productId: val.id
          }
        })
      },
      // 查看
      lookFn (val) {
        let _this = this
        _this.$router.push({
          name: 'lookproduct',
          path: '/lookproduct',
          query: {
            productId: val.id
          }
        })
      },
      // 增加版本
      addFn (val) {
        console.log(val)

        let _this = this
        _this.dialogMarkTable = true
        // 版本列表
        _this.versId = val.id
        _this.$http
          .post('/dev/product/getVersionList.json', _this.qs.stringify({
            id: val.id
          }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.versions = res.data.resMsg
            } else {
              alert(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      },
      // 增行
      addRow () {
        let _this = this
        // 数据下拉 人员列表
        _this.$http.get('/user/getUserList.json', _this.qs.stringify({}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              console.log(res.data.resMsg)
              _this.allUserlist = res.data.resMsg
              _this.hardwareRdLeaderOpt = res.data.resMsg
              _this.softwareRdLeaderOpt = res.data.resMsg
              _this.testLeaderOpt = res.data.resMsg
              _this.hardwareCcbOpt = res.data.resMsg
              _this.softwareCcbOpt = res.data.resMsg

            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }

          })
          .catch(function (err) {
            console.log(err)
          })

        _this.dialogMarkTable = false
        setTimeout(function () {
          _this.dialogMark = true
        }, 300)

      },
      // 增行确定方法
      addRowTrue (num) {
        let _this = this
        if (num == 1) {
          if(_this.newinput1==''||_this.newinput2Id==''||_this.newinput3==[]|| !_this.newinput4){
            _this.$notify({
              title: '错误',
              type: 'error',
              message: '未填写完整',
              duration: 3000
            })
            return
          }
          _this.dialogMarkTable = true
          setTimeout(function () {
            _this.dialogMark = false
          }, 300)
          // console.log(_this.newinput3Text)
          //增加行
          let j = {}
          j.version = _this.newinput1
          j.target = _this.newinput2Id
          j.managerNames = _this.newinput3Text
          j.managerIds = _this.newinput3
          j.releaseTime = _this.moment(_this.newinput4).format('YYYY-MM-DD')
          j.description = _this.newinput5
          _this.versions.push(j)
          // console.log(_this.versions)
          setTimeout(function () {
            for (let i = 0; i < _this.versions.length; i++) {
              console.log(_this.versions[i].index)
              delete _this.versions[i].index
            }
            let vdata = {
              id: _this.versId,
              versions: _this.versions
            }
            console.log(vdata)
            _this.$http({
              url: '/dev/product/updateProductVersions.json',
              method: 'post',
              data: JSON.stringify(vdata),
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(function (res) {
                if (res.data.resStatus == 1000) {
                  console.log(res.data.resMsg)

                } else {
                  alert(res.data.resMsg)
                }

              })
              .catch(function (err) {
                console.log(err)
              })
            _this.rowIndex = ''
          }, 300)

          // 提交信息的内容
          _this.newinput1 = ''
          _this.newinput2 = ''
          _this.newinput3 = []
          _this.newinput4 = ''
          _this.newinput5 = ''
          _this.newinput2Id = ''
          _this.newinput3Id = ''
          _this.newinput3Text = []

          // 表格排序
          // _this.multipleSort = ''
          // _this.versions = []

        } else {
          _this.dialogMarkTable = true
          setTimeout(function () {
            _this.dialogMark = false
          }, 300)
        }
      },
      // 删行
      delRow () {
        let _this = this
        _this.versions.splice(this.rowIndex, 1)
        setTimeout(function () {
          for (let i = 0; i < _this.versions.length; i++) {
            console.log(_this.versions[i].index)
            delete _this.versions[i].index
          }
          console.log(_this.versions)
          let vdata = {
            id: _this.versId,
            versions: JSON.stringify(_this.versions)
          }
          vdata.versions = _this.versions
          console.log(JSON.stringify(vdata))
          _this.$http({
            url: '/dev/product/updateProductVersions.json',
            method: 'post',
            data: JSON.stringify(vdata),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                console.log(res.data.resMsg)

              } else {
                alert(res.data.resMsg)
              }

            })
            .catch(function (err) {
              console.log(err)
            })
          _this.rowIndex = ''
        }, 300)

      },
      //表单提交
      newinput1Fn (val) {
        let _this = this
        let obj = {}
        obj = _this.targetArr.find((item) => {
          return item.value === val
        })
        _this.newinput2Id = obj.value
        _this.newinput2 = obj.name
      },
      newinput2Fn (val) {
        let _this = this
        // console.log(val)
        // console.log(_this.allUserlist)

        let objId = []
        let objName = []
        for (let i = 0; i < _this.allUserlist.length; i++) {
          for (let j = 0; j < val.length; j++) {
            if (_this.allUserlist[i].id == val[j]) {
              objId.push(_this.allUserlist[i].id)
              objName.push(_this.allUserlist[i].realnameWithDeptName)
            }
          }
        }

        _this.newinput3Id = objId
        _this.newinput3Text = []
        for (let g = 0; g < objName.length; g++) {
          _this.newinput3Text.push(objName[g])
        }
      },

      // 选中处理
      handleSelectionChange (val) {
        let dataId = []
        val.map(item => {
          dataId.push(item.id)
        })
        this.selectArr = dataId

      },

      //请求字典接口
      dicSelect(businessName,subjectName,callback){
        var _this = this;
        return _this.$http.post('/user/dicdata/getdics.json',_this.qs.stringify({businessName:businessName,subjectName:subjectName})).then(function(res){
          if(res.data.resStatus == 1000){
            callback(res.data.resMsg);
          }else{
            console.log("下拉选项加载错误！")
          }
        })
      }
    },
    filters:{
      targetName(val,targetArr){
        let obj=targetArr.find(item=> item.value===val)
        return obj.name;
      }
    }
  }


</script>

<style lang="less">
  #productList .productList_Con {
    max-width: 100% !important;
  }

  #productList .el-row {
    max-width: 1000px;
  }

  #productList .elRow2 .el-col {
    text-align: left;
  }

  #productList .el-input__icon {
    line-height: 0px;
  }

  #productList .el-date-editor .el-range-separator {
    line-height: 27px;
  }

  #productList .cell > button {
    padding: 0 !important;
  }

  //表格图片设置
  #productList .imgStyle {
    width: 15px;
    height: 15px;
    margin-top: 12px;
    display: inline-table;
  }

  #productList .inlineBlock > i {
    color: red;
    font-size: 0.5rem;
    font-style: initial !important;
  }

  #productList .inlineBlock {
    display: inline-block;
    width: 70px;
  }

  #productList .el-date-editor.el-input, #productList .el-date-editor.el-input__inner {
    width: 250px;
  }

  #productList .el-row .el-input {
    width: 192px;
  }

  #productList .inlineB1 {
    text-align: right !important;
    width: 110px !important;
  }

  #productList .tebleMark {
    float: left;
    width: 100%;
  }

  #productList .tebleMark_con {
    float: left;
    width: 100%;
    margin-bottom: 25px;
  }

  #productList .tebleMark_con > p:first-child {
    width: 80px;
    text-align: right;
  }

  #productList .tebleMark_con > p {
    float: left;
    font-size: 0.9rem;
  }

  #productList .tebleMark_con_input .el-date-editor.el-input {
    width: 193px;
  }

  #productList .el-inputStyle {
    width: 193px;
  }

  #productList textarea {
    border: 1px solid #adadad;
    width: 400px;
    height: 100px;
  }

  #productList .productList_Con_search {
    padding-left: 20px;
  }
  #productList .vue-treeselect__control{
    width: 193px;
  }
</style>
