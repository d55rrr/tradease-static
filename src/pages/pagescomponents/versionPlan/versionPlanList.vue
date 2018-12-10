<template>
  <div id="versionplanlist">
    <el-card :body-style="{ padding: '20px',marginBottom:'100px'}">
      <el-form ref="form"  label-width="150px" :inline="true">
        <el-form-item label="产品分类:"  >
          <el-select v-model="productTypeSelect" style="width:250px" clearable  placeholder="请选择产品名称" @change="productList" >
            <el-option
              v-for="item in productTypeSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select v-model="productSelect" placeholder="请选择" clearable   style="width:250px"  >
            <el-option
              v-for="item in productSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级:">
          <el-select v-model="versionPrioritySelect" placeholder="请选择" clearable  style="width:250px">
            <el-option
              v-for="item in versionPrioritySelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <br>
        <el-form-item label="负责人:" >
          <el-select
            clearable
            filterable
            v-model="userSelect"
            remote
            reserve-keyword
            placeholder="请输入姓名"
            :remote-method="remoteNameSearch"
            style="width:250px"
          >
            <el-option
              v-for="user in userSelectList"
              :key="user.id"
              :label="user.realnameWithDeptName"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转测目的:">
          <el-select v-model="targetSelect" clearable   style="width:250px">
            <el-option
              v-for="item in targetSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="dateSelect"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left:20px">
          <button type="button" class="el-button el-button--primary" @click="versionList"><span>查询</span></button>
          <button  type="button" class="el-button el-button--success" @click="clearSearch"><span>清空</span></button>
        </el-form-item>
      </el-form>
      <div>
        <div style="float:right;margin-bottom:10px;">
          <button type="button" class="el-button el-button--primary" zize="medium" @click="addVersionUp" v-show="versionPrivilegeAdd"><span>新增</span></button>
          <button  type="button" class="el-button el-button--primary" @click="deleleVersion" v-show="versionPrivilegeDelete"><span>删除</span></button>
        </div>
        <v-table
          is-horizontal-resize
          style="width:100%"
          :columns="columns"
          :table-data="tableData"
          row-hover-color="#eee"
          row-click-color="#edf7ff"
          @sort-change="sortChange"
          :multiple-sort="false"
          :select-change="selectChange"
          @on-custom-comp="customCompFunc"
          :cell-merge="cellMerge"
          :column-cell-class-name = "columnCellClass"
        >
        </v-table>
        <div style="float:right;margin-top: 10px">
          <el-pagination
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size.sync="pageSize"
            background
            layout="sizes,prev, pager, next"
            :total="totalRows"
            @size-change="versionList"
            @current-change="versionList"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog title="添加版本计划" :visible.sync="versionAdd" width="80%">
      <el-button type="primary" @click="tableAdd">增行</el-button>
      <el-button type="primary" @click="tableRemove">删行</el-button>
      <el-button type="primary" @click="tableCopy">复制增行</el-button>
      <div style="height:350px;overflow: auto;margin-top: 10px">
        <editable :columns='headers'
                  v-model = "datas"
                  ref="edit"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="versionAdd = false">取 消</el-button>
        <el-button type="primary" @click="saveVersion">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改版本计划" :visible.sync="versionEdit" width="30%">
      <el-form ref="ruleForm" :model="versionItem" label-width="120px"  :rules="rules" style="width: 95%">
        <el-form-item label="产品:" >
          <el-input v-model="versionItem.productName"></el-input>
        </el-form-item>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="versionItem.version"></el-input>
        </el-form-item>
        <el-form-item label="优先级:" prop="priority">
          <el-select v-model="versionItem.priority" style="width:100%">
            <el-option
              v-for="item in versionPrioritySelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本转测试目的:" prop="target">
          <el-select v-model="versionItem.target" style="width:100%">
            <el-option
              v-for="item in targetSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划转测时间:" prop="planReleaseTime">
          <el-date-picker
            v-model="versionItem.planTestTime"
            type="date"
            style="width:100%"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划发布时间:" prop="planReleaseTime">
          <el-date-picker
            v-model="versionItem.planReleaseTime"
            type="date"
            style="width:100%"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="版本负责人:" >
          <el-select
            clearable
            filterable
            multiple
            v-model="versionItem.managerIds"
            remote
            reserve-keyword
            placeholder="请输入姓名"
            style="width:100%"
            :remote-method="remoteNameSearch"
          >
            <el-option
              v-for="user in userSelectList"
              :key="user.id"
              :label="user.realnameWithDeptName"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用范围:" prop="storagePath">
          <el-input
            type="textarea" v-model="versionItem.scope"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="description" >
          <el-input
            type="textarea" v-model="versionItem.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="versionEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateVersion">确 定</el-button>
      </div>
    </el-dialog>
    <!--提交版本弹框-->
    <el-dialog title="提测版本" :visible.sync="versionCommit" width="30%">
      <el-form ref="ruleForm" :model="versionItem" label-width="120px"  :rules="rules">
        <el-form-item label="概要:" prop="summary">
          <el-input v-model="versionItem.summary"></el-input>
        </el-form-item>
        <el-form-item label="所属项目:" prop="projectId">
          <el-select v-model="versionItem.projectId" style="width:100%">
            <el-option
              v-for="item in projectSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属产品:" prop="productId">
          <el-select v-model="versionItem.productId" style="width:100%">
            <el-option
              v-for="item in productSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本计划属性:" prop="planned">
          <el-select v-model="versionItem.planned" style="width:100%">
            <el-option
              v-for="item in planSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提测版本号:" prop="version">
          <el-input v-model="versionItem.version"></el-input>
        </el-form-item>
        <el-form-item label="优先级:" prop="priority">
          <el-select v-model="versionItem.priority" style="width:100%">
            <el-option
              v-for="item in versionPrioritySelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本转测试目的:" prop="target">
          <el-select v-model="versionItem.target" style="width:100%">
            <el-option
              v-for="item in targetSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划交付时间:" prop="planReleaseTime">
          <el-date-picker
            v-model="versionItem.planReleaseTime"
            type="date"
            style="width:100%"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="版本存储路径:" prop="storagePath">
          <el-input
            type="textarea" v-model="versionItem.storagePath"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="附件:">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述:" prop="description" >
          <el-input
            type="textarea" v-model="versionItem.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="versionCommit = false">取 消</el-button>
        <el-button type="primary" @click="openAssign('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--指派流程弹框-->
    <el-dialog title="指派" :visible.sync="toAssign" width="25%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="经办人">
          <el-select
            filterable
            style="width: 100%;"
            v-model="versionItem.transactorId"
            remote
            reserve-keyword
            placeholder="请输入姓名"
            :remote-method="remoteNameSearch"
          >
            <el-option
              v-for="user in userSelectList"
              :key="user.id"
              :label="user.realnameWithDeptName"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toAssign = false">取 消</el-button>
        <el-button type="primary" @click="commitTest()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Editable from '../../../components/editable'
  import Vue from 'vue'

  export default {
    components: {Editable},
    data() {
      return {
        //产品分类选中
        productTypeSelect:null,
        productSelect:null,
        versionPrioritySelect:null,
        targetSelect:null,
        userSelect:null,
        dateSelect:null,
        dateSelect:[],

        //产品分类列表
        productTypeSelectList:[],
        productSelectList:[],
        versionPrioritySelectList:[],
        targetSelectList:[],
        userSelectList:[],
        columns:[],
        versionAdd:false,
        versionEdit:false,
        versionCommit:false,
        toAssign:false,
        versionItem:{},
        sort:'',
        // 分页
        // 当前第几页
        currentPage: 1,
        // 一页多少条
        pageSize: 10,
        //总条数
        totalRows: 0,
        //table数据
        tableData: [],
        datas:[],
        //单元格详细展开相关
        rowOpened:null,
        rowDetail:{},
        rowSelect:[],
        //文件列表
        fileList:[],
        columns:[
          {
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            type: 'selection'
          },
          {
            field: 'keyWords',
            title: '关键字',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'productName',
            title: '产品名',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'version',
            title: '发布版本',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'priorityName',
            title: '优先级',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'targetName',
            title: '转测目的',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'planTestTime',
            title: '计划转测时间',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'planReleaseTime',
            title: '计划发布时间',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'managers',
            title: '负责人',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'custome-adv',
            title: '操作',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            componentName: 'versionplanlist-operation',
            isResize: true
          }
        ],
        headers:[
          {
            key:'projectId',
            name:'<span style="color:red">*</span>所属项目',
            type:'select',
            selectList:[]
          },
          {
            key:'prodouctType',
            name:'<span style="color:red">*</span>产品分类',
            type:'select',
            selectList:[{'value':'1','name':'基站'},{'value':'2','name':'价签'}]
          },
          {
            key:'productId',
            name:'<span style="color:red">*</span>产品名称',
            type:'select',
            selectList:[]
          },
          {
            key:'version',
            name:'<span style="color:red">*</span>发布版本',
            type:'text'
          },
          {
            key:'priority',
            name:'<span style="color:red">*</span>版本交付优先级',
            type:'select',
            selectList:[]
          },
          {
            key:'target',
            name:'<span style="color:red">*</span>转测试目的',
            type:'select',
            selectList:[]
          },
          {
            key:'planTestTime',
            name:'<span style="color:red">*</span>计划转测试时间',
            type:'date',
          },
          {
            key:'planReleaseTime',
            name:'<span style="color:red">*</span>计划发布时间',
            type:'date',
          },
          {
            key:'managerIds',
            name:'<span style="color:red">*</span>版本负责人',
            type:'select',
            selectList:[],
            dataType:'array'
          },
          {
            key:'scope',
            name:'适用范围',
            type:'text'
          },
          {
            key:'description',
            name:'备注',
            type:'text'
          },
        ],
        //权限控制按钮
        versionPrivilegeAdd:false,
        versionPrivilegeDelete:false,
        versionPrivilegeEdit:false,
        versionPrivilegeSubmitTest:false
      }
    },
    created() {
      var _this = this
      _this.dicSelect('dev','versionTarget',function(data){
        _this.targetSelectList = data;
        _this.headers[5].selectList = data;
      });
      _this.dicSelect('dev','versionPlanned',function(data){
        _this.planSelectList = data;
      });
      _this.dicSelect('dev','versionPriority',function(data){
        _this.versionPrioritySelectList = data;
        _this.headers[4].selectList = data;
      });
      _this.dicSelect('dev','ware',function(data){
        _this.productTypeSelectList = data;
        _this.headers[1].selectList = data;
      });
      this.privilegesMenuFn()
      this.projectList()
      this.productList()
      this.versionList()
      this.selectAllUsers()
    },
    mounted() {

    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/versionplanlist') {
          this.versionList()
          this.currentPage = 1
        }
      }
    },
    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.versionPrivilegeAdd = false
        _this.versionPrivilegeDelete = false
        _this.versionPrivilegeEdit = false
        _this.versionPrivilegeSubmitTest = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'saveVersionPlanBatch') {
            _this.versionPrivilegeAdd = true
          }
          if (_this.privilegesMenuArr[i] == 'removeVersionPlanBatch') {
            _this.versionPrivilegeDelete = true
          }
          if (_this.privilegesMenuArr[i] == 'updateVersionPlan') {
            _this.versionPrivilegeEdit = true
          }
          if (_this.privilegesMenuArr[i] == 'vctprocessCommit') {
            _this.versionPrivilegeSubmitTest = true
          }
        }
      },
      versionList(){
        let _this = this
        let startTime =null
        let endTime = null
        if(_this.dateSelect[0]!=undefined&&_this.dateSelect[0]){
          startTime=this.moment(_this.dateSelect[0]).format('YYYY-MM-DD')
        }
        if(_this.dateSelect[1]!=undefined&&_this.dateSelect[1]) {
          endTime = this.moment(_this.dateSelect[1]).format('YYYY-MM-DD')
        }
          _this.$http.post('/dev/versionplan/getVersionPlanPager.json',_this.qs.stringify({
          currentPage:_this.currentPage,
          pageSize:_this.pageSize,
          productId:_this.productSelect,
          testStatus:_this.testStatusSelect,
          creatorId:_this.userSelect,
          target:_this.targetSelect,
          planned:_this.planSelect,
          createTimeBegin:startTime,
          createTimeEnd:endTime,
          sortColumns:_this.sort,
          priority:_this.versionPrioritySelect
        })).then(function(res){
          if(res.data.resStatus == 1000){
            _this.tableData = res.data.resMsg.data
            _this.tableData.forEach(function(col){
              col.keyWords = 'VP-'+col.id
              for(let i=0;i<_this.versionPrioritySelectList.length;i++){
                if(_this.versionPrioritySelectList.value==col.priority){
                  col.priorityName = _this.versionPrioritySelectList.name
                }
              }
              for(let i=0;i<_this.targetSelectList.length;i++){
                if(_this.targetSelectList.value==col.priority){
                  col.targetName = _this.targetSelectList.name
                }
              }
              if(col.managerNames.length){
                col.managers =''
                for(let i=0;i<col.managerNames.length;i++){
                  col.managers+=col.managerNames[i]+','
                }
                col.managers = col.managers.substr(0,col.managers.length-1)
              }
            })
            _this.totalRows = res.data.resMsg.totalRows
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      //项目列表
      projectList(){
        var _this = this
        _this.$http.post('/dev/project/datas.json').then(function(res){
          if(res.data.resStatus == 1000){
            _this.projectSelectList = res.data.resMsg
            let projects = []
            res.data.resMsg.forEach(function(col){
              let project = {}
              project.value = col.id
              project.name = col.name
              projects.push(project)
            })
            _this.headers[0].selectList =  projects
          }else{
            console.log("项目列表加载失败！")
          }
        })
      },
      productList(){
        debugger
        this.productSelect = null
        this.productSelectList= []
        let _this = this
        _this.$http.post('/dev/product/getProductSelect.json',_this.qs.stringify({type:_this.productTypeSelect})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.productSelectList = res.data.resMsg
            let products = []
            res.data.resMsg.forEach(function(col){
              let product = {}
              product.value = col.id
              product.name = col.name
              products.push(product)
            })
            _this.headers[2].selectList =  products
          }else{
            console.log("产品列表加载失败！")
          }

        })
      },
      sortChange(){

      },
      addVersionUp(){
        debugger
        this.versionAdd = true
      },
      openAssign(ruleForm){
        let _this = this
        _this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            _this.toAssign = true
          }else{
            return false;

          }
        })

          },
      commitTest(){
        let _this = this

        _this.$http.post('/dev/versionconverttestprocess/commit.json',_this.qs.stringify(_this.versionItem)).then(function(res) {
          if (res.data.resStatus == 1000) {
            _this.$notify({
              title: '提交成功',
              type: 'success'
            });
            _this.toAssign = false
            _this.versionCommit = false
            _this.versionList()
          } else {
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })


      },
      saveVersion(){
        let _this = this
        _this.$http({
          url: 'dev/versionplan/saveVersionPlanBatch.json',
          method: 'post',
          data: _this.datas,
          headers: {
            'Content-Type': 'application/json'
          }

        })
          .then(res => {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '添加成功',
                type: 'success'
              });
              _this.versionAdd = false
              _this.versionList()

            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

            // console.log(res.data)
          })
      },
      updateVersion(){
        let _this = this
        _this.$http({
          url: 'dev/versionplan/updateVersionPlan.json',
          method: 'post',
          data:_this.versionItem,
          headers: {
            'Content-Type': 'application/json'
          }

        })
          .then(res => {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '修改成功',
                type: 'success'
              });
              _this.versionEdit = false
              _this.versionList()

            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }
          })
      },
      deleleVersion(){
        let _this = this
        let param = ''
        if(!_this.rowSelect||_this.rowSelect.length==0){
          _this.$notify.error({
            title: '错误',
            message: '请先选择行'
          });
          return;
        }
        _this.rowSelect.forEach(function(row){
          param+=','+row.id
        })
        param = param.substr(1)
        this.$confirm('确认删除吗？').then(function(){
          _this.$http.post('dev/versionplan/removeVersionPlanBatch.json',_this.qs.stringify({ids:param})).then(function(res){
            if(res.data.resStatus==1000){
              _this.$notify({
                title: '删除成功',
                type: 'success'
              });
              _this.versionList()
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }
          })
        })

      },
      clearSearch(){
        this.productSelect=null
        this.userSelect=null
        this.targetSelect=null
        this.planSelect=null
        this.transferTestTimeBegin=null
        this.transferTestTimeEnd=null
        this.dateSelect = []
        this.versionPrioritySelect = null
        this.productTypeSelect = null
      },
      selectAllUsers(){
        let _this = this
        _this.$http.post('/user/getUserList.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
                let users = []
                res.data.resMsg.forEach(function(col){
                  let user = {}
                  user.value = col.id
                  user.name = col.realnameWithDeptName
                  users.push(user)
                })
                _this.headers[8].selectList =  users
            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
      },
      remoteNameSearch(query){
        let _this = this
        _this.$http.post('/user/getUserList.json', _this.qs.stringify({realname:query}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.userSelectList = res.data.resMsg
              //_this.versionItem.creatorId = undefined
            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
      },
      customCompFunc(params){
        if(params.type=='detail'){
          let index = params.index
          this.rowDetail = params.rowData
          let temp = {}
          for(let attr in this.rowDetail){
            temp[attr] = this.rowDetail[attr]
          }
          temp.keyWords = 'temp'
          //单元格展开和关闭
          if(this.rowOpened == index){
            this.tableData.splice(index+1,2)
            this.rowOpened = null
          }else if(this.rowOpened == null){
            this.tableData.splice(index+1,0,temp,{})
            this.rowOpened = index
          }else{
            debugger
            this.tableData.splice(this.rowOpened+1,2)
            if(this.rowOpened<index){
              this.tableData.splice(index+1-2,0,temp,{})
              this.rowOpened = index-2
            }else{
              this.tableData.splice(index+1,0,temp,{})
              this.rowOpened = index
            }
          }
        }else if(params.type=='edit'){
          this.versionEdit = true
          this.versionItem = params.rowData
        }else if(params.type=='commit'){
          this.versionItem = params.rowData
          this.versionCommit = true
        }

      },
      cellMerge(rowIndex,rowData,field){
        if (field === 'keyWords' && rowData[field] === 'temp') {
          let rowDetail = this.rowDetail
          return {
            colSpan:10,
            rowSpan: 2,
            componentName: 'versionplanlist-detail',
            rowDetail:this.rowDetail

          }
        }
      },
      columnCellClass(rowIndex,columnName,rowData){
        if (columnName === 'keyWords' && rowData[columnName] === 'temp') {
          return 'column-cell-expand';
        }
      },
      //表格多选框响应
      selectChange(selection,rowData){
        this.rowSelect = selection
      },
      tableAdd(){
        this.$refs.edit.add()
      },
      tableRemove(){
        this.$refs.edit.remove()
      },
      tableCopy(){
        this.$refs.edit.copy()
      },
      getTableData(){
        alert(JSON.stringify(this.datas))
      },
      //文件上传相关方法
      handlePreview(){

      },
      handleRemove(){

      },
      beforeRemove(){

      },
      handleExceed(){

      },
      //字典表查询
      dicSelect(businessName,subjectName,callback){
        var _this = this;
        return _this.$http.post('/user/dicdata/getdics.json',_this.qs.stringify({businessName:businessName,subjectName:subjectName})).then(function(res){
          if(res.data.resStatus == 1000){
            callback(res.data.resMsg);
          }else{
            console.log("下拉选项加载错误！")
          }
        })
      },

    }
  }



  Vue.component('versionplanlist-operation', {
    template: `<span>
        <a href=""  @click.stop.prevent="update(rowData,index)"  v-if="versionPrivilegeEdit">编辑</a>&nbsp;
        <a href="" @click.stop.prevent="toDetail(rowData,index)">展开详情</a>&nbsp;
        <a href="" @click.stop.prevent="commitTest(rowData,index)" v-if="versionPrivilegeSubmitTest">提测</a>
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
    data(){
      return{
        //权限控制按钮
        versionPrivilegeAdd:false,
        versionPrivilegeDelete:false,
        versionPrivilegeEdit:false,
        versionPrivilegeSubmitTest:false
      }
    },
    created(){
      this.privilegesMenuFn()
    },
    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.versionPrivilegeAdd = false
        _this.versionPrivilegeDelete = false
        _this.versionPrivilegeEdit = false
        _this.versionPrivilegeSubmitTest = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'saveVersionPlanBatch') {
            _this.versionPrivilegeAdd = true
          }
          if (_this.privilegesMenuArr[i] == 'removeVersionPlanBatch') {
            _this.versionPrivilegeDelete = true
          }
          if (_this.privilegesMenuArr[i] == 'updateVersionPlan') {
            _this.versionPrivilegeEdit = true
          }
          if (_this.privilegesMenuArr[i] == 'vctprocessCommit') {
            _this.versionPrivilegeSubmitTest = true
          }
        }
      },
      //编辑信息
      update (rowData,index) {
        let params = {type:'edit',index:index,rowData:rowData};
        this.$emit("on-custom-comp",params);
      },
      // 详细页面
      toDetail (rowData,index) {
        let params = {type:'detail',index:index,rowData:rowData};
        this.$emit("on-custom-comp",params);
      },
      commitTest(rowData,index){
        let params = {type:'commit',index:index,rowData:rowData};
        this.$emit("on-custom-comp",params);
      }
    }
  })
  Vue.component('versionplanlist-detail', {
    template: `<div style="padding:10px"><el-row justify="left" type="flex"><el-col :span="3">需求:</el-col><el-col :span="3">&nbsp;{{rowData.demand}}</el-col><el-col :span="2">测试状态:</el-col><el-col  :span="4">&nbsp;{{rowData.testStatus}}</el-col><el-col :span="2">ESL模块:</el-col><el-col :span="4">&nbsp;{{rowData.module}}</el-col><el-col :span="2">适用范围:</el-col><el-col :span="4">&nbsp;{{rowData.scope}}</el-col></el-row>
    <el-row justify="left" type="flex"><el-col :span="3" >创建人:</el-col><el-col :span="3">&nbsp;{{rowData.creator}}</el-col><el-col :span="2">创建时间:</el-col><el-col  :span="4">&nbsp;{{rowData.createTime}}</el-col><el-col :span="2">描述:</el-col><el-col :span="10">&nbsp;{{rowData.description}}</el-col></el-row></div>`,
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
    mounted(){
    },
    methods: {

    }
  })

</script>

<style lang="less">
  .column-cell-expand>div{
    line-height: 10px !important;
  }
</style>
