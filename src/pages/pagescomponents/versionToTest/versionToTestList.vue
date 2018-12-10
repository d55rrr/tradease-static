<template>
  <div id="versionToTestList">
      <el-card :body-style="{ padding: '20px',marginBottom:'100px'}">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="产品:"  >
            <el-select v-model="productSelect" style="width:250px" placeholder="请选择产品名称" >
              <el-option
                v-for="item in productSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="testStatusSelect" placeholder="请选择"  style="width:250px">
              <el-option
                v-for="item in testStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经办人:" >
            <el-select
              filterable
              v-model="userSelect"
              remote
              reserve-keyword
              placeholder="请输入姓名"
              :remote-method="remoteNameSearch"
              style="width:250px"
            >
              <el-option
                v-for="user in users"
                :key="user.id"
                :label="user.realnameWithDeptName"
                :value="user.id">
              </el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="转测目的:">
            <el-select v-model="targetSelect"  style="width:250px">
              <el-option
                v-for="item in targetSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="计划属性:" >
            <el-select v-model="planSelect"  style="width:250px">
              <el-option
                v-for="item in planSelectList"
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
            <button type="button" class="el-button el-button--primary" zize="medium" @click="addversion" v-show="vctPrivilegeAdd"><span>新增</span></button>
            <button  type="button" class="el-button el-button--primary" @click="deleleVersion" v-show="vctPrivilegeEdit"><span>删除</span></button>
          </div>
          <v-table
            is-horizontal-resize
            style="width:100%"
            :columns="columns"
            :table-data="tableData"
            row-hover-color="#eee"
            row-click-color="#edf7ff"
            @on-custom-comp="addversion"
            @sort-change="sortChange"
            :multiple-sort="false"
            :select-change="selectChange"
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
    <!--提交版本弹框-->
    <el-dialog title="提测版本" :visible.sync="toAdd" width="30%">
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
              action="/api/attachment/upload.json"
              :data="{groupName:'group1'}"
              :name="file"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
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
        <el-button @click="toAdd = false">取 消</el-button>
        <el-button type="primary" @click="saveVersion('ruleForm')">确 定</el-button>
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
              v-for="user in users"
              :key="user.id"
              :label="user.realnameWithDeptName"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toAssign = false">取 消</el-button>
        <el-button type="primary" @click="commitVersion()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Vue from 'vue'
  export default {
    created() {
      var _this = this
      _this.dicSelect('dev','versionTestStatus',function(data){
        _this.testStatusSelectList = data;
      });
      _this.dicSelect('dev','versionTarget',function(data){
        _this.targetSelectList = data;
      });
      _this.dicSelect('dev','versionPlanned',function(data){
        _this.planSelectList = data;
      });
      _this.dicSelect('dev','versionPriority',function(data){
        _this.versionPrioritySelectList = data;
      });
      this.projectList()
      this.productList()
      this.versionList(this.currentPage, this.pageSize)
      this.privilegesMenuFn()
    },
    mounted() {

    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/versiontotestlist') {
          this.versionList()
          this.currentPage = 1
        }
      }
    },
    data() {
      return {
        //select下拉回显对象
        currentDate:'',
        //产品列表
        productSelectList:[],
        //测试状态
        testStatusSelectList:[],
        //转测目的
        targetSelectList:[],
        //计划属性
        planSelectList:[],
        //用户列表
        userSelectList:[],
        //优先级列表
        versionPrioritySelectList:[],
        //项目列表
        projectSelectList:[],
        //产品列表
        productSelectList:[],
        //条件查询属性
        productSelect:null,
        testStatusSelect:null,
        targetSelect:null,
        planSelect:null,
        userSelect:null,
        dateSelect:['',''],
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
        columns: [
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
            field: 'summary',
            title: '概要',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'transactor',
            title: '经办人',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'testSponsor',
            title: '提测人',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'statusName',
            title: '当前状态',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'transferTestTime',
            title: '创建时间',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            orderBy: 'asc',
            isResize: true
          },
          {
            field: 'updateTime',
            title: '更新时间',
            width: 150,
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
            componentName: 'versionconverttest-operation',
            isResize: true
          }
        ],
        //添加转测弹框
        toAdd:false,
        //指派转测任务弹框
        toAssign:false,
        //版本转测数据对象
        versionItem:{},
        users:[],
        //选择数据行id集合
        rowSelect:[],
        //表单验证规则
        rules:{
          summary:[{required:true, message: '请输入名称', trigger: 'blur'},{max:100,message:'长度不大于100字符',trigger:'blur'}],
          projectId:[{required:true,message:'请选择项目',trigger:'change'}],
          productId:[{required:true,message:'请选择产品',trigger:'change'}],
          planned:[{required:true,message:'请选择计划属性',trigger:'change'}],
          version:[{required:true,message:'请输入版本号',trigger:'blur'}],
          priority:[{required:true,message:'请选择优先级',trigger:'change'}],
          target:[{required:true,message:'请选择转测目的',trigger:'change'}],
          planReleaseTime:[{required:true,message:'请选择转测时间',trigger:'change'}],
          storagePath:[{required:true,message:'请输入存储路径',trigger:'blur'}],
          description:[{required:true,message:'请输入描述信息',trigger:'blur'}]
        },
        fileList:[],
       vctPrivilegeAdd:false,
       vctPrivilegeDelete:false,
       vctPrivilegeEdit:false
      };
    },
    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.vctPrivilegeAdd = false
        _this.vctPrivilegeDelete = false
        _this.vctPrivilegeEdit = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'vctprocessCommit1') {
            _this.vctPrivilegeAdd = true
          }
          if (_this.privilegesMenuArr[i] == 'vctdelete') {
            _this.vctPrivilegeDelete = true
          }
          if (_this.privilegesMenuArr[i] == 'vctupate') {
            _this.vctPrivilegeEdit = true
          }
        }
      },
      //表格数据排列方法
      sortChange(param){
        let _this = this
        for(let attr in param){
          if(param[attr]){
            if(attr=='keyWords'){
              debugger
              _this.sort = 'id'+" "+param[attr]
            }else if(attr=='transferTestTime'){
              _this.sort = 'transfer_test_time'+" "+param[attr]
            }else if(attr=='updateTime'){
              _this.sort = 'update_time'+" "+param[attr]
           }else if(attr=='statusName'){
              _this.sort = 'test_status'+" "+param[attr]
            }
          }

        }
       _this.versionList()
      },
      //表格和页面初始方法
      versionList(){
        var _this = this;
        let startTime =null
        let endTime = null
        if(_this.dateSelect[0]!=undefined&&_this.dateSelect[0]){
          startTime=this.moment(_this.dateSelect[0]).format('YYYY-MM-DD')
        }
        if(_this.dateSelect[1]!=undefined&&_this.dateSelect[1]){
          endTime = this.moment(_this.dateSelect[1]).format('YYYY-MM-DD')

        }
        _this.$http.post('/dev/versionconverttest/list.json',_this.qs.stringify({
          currentPage:_this.currentPage,
          pageSize:_this.pageSize,
          productId:_this.productSelect,
          testStatus:_this.testStatusSelect,
          transactorId:_this.userSelect,
          target:_this.targetSelect,
          planned:_this.planSelect,
          transferTestTimeBegin:startTime,
          transferTestTimeEnd:endTime,
          sortColumns:_this.sort

        })).then(function(res){
          if(res.data.resStatus == 1000){
            _this.tableData = res.data.resMsg.data
            _this.tableData.forEach(function(col){
              col.keyWords = 'AT-'+col.id
              _this.testStatusSelectList.forEach(function (status) {
                  if(col.testStatus == status.value){
                    col.statusName = status.name;
                  }
              })
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
      //字典请求公共方法
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
      //清空条件搜索
      clearSearch(){
        this.productSelect=null
        this.testStatusSelect=null
        this.userSelect=null
        this.targetSelect=null
        this.planSelect=null
        this.transferTestTimeBegin=null
        this.transferTestTimeEnd=null
        this.dateSelect = []
      },
      //表格多选框响应
      selectChange(selection,rowData){
        this.rowSelect = selection
      },
      //版本删除
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
          _this.$http.post('/dev/versionconverttestprocess/delete.json',_this.qs.stringify({ids:param})).then(function(res){
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
      //版本编辑弹框
      addversion(row){
        let _this = this
        this.toAdd = true
        if(row.id){
          _this.$http.post('/dev/versionconverttest/info.json',_this.qs.stringify({id:row.id})).then(function(res){
            if(res.data.resStatus==1000){
              _this.versionItem = res.data.resMsg
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }
          })
        }else{
          _this.versionItem = {}
        }
      },
      //版本保存
      saveVersion(ruleForm){
        let _this = this
        _this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            if(_this.versionItem.id){
              debugger
              if(_this.fileList.length){
                let attachmentIds = []
                _this.fileList.forEach(function(file){
                  attachmentIds.push(file.id)
                })
                _this.versionItem.attachmentId = attachmentIds.join(",")
              }
              _this.$http.post('/dev/versionconverttest/update.json',_this.qs.stringify(_this.versionItem)).then(function(res){
                if(res.data.resStatus==1000){
                  _this.$notify({
                    title: '修改成功',
                    type: 'success'
                  });
                  _this.toAdd = false
                  _this.versionList()
                }else{
                  _this.$notify.error({
                    title: '错误',
                    message: res.data.resMsg
                  });
                }
              })
            }else{
              _this.toAssign = true
              _this.findProduct(_this.versionItem.productId)
            }
          } else {
            return false;
          }
        })

      },
      //版本保存和提交流程
      commitVersion(ruleForm){
        let _this = this
        if(_this.fileList.length){
          let attachmentIds = []
          _this.fileList.forEach(function(file){
            attachmentIds.push(file.id)
          })
          _this.versionItem.attachmentId = attachmentIds.join(",")
        }
        _this.$http.post('/dev/versionconverttestprocess/commit.json',_this.qs.stringify(_this.versionItem)).then(function(res){
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '添加成功',
              type: 'success'
            });
            _this.versionList()
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
          _this.toAdd = false
          _this.toAssign = false
        })
      },
      //项目列表
      projectList(){
        var _this = this
        _this.$http.post('/dev/project/datas.json').then(function(res){
          if(res.data.resStatus == 1000){
            _this.projectSelectList = res.data.resMsg
          }else{
            console.log("项目列表加载失败！")
          }
        })
      },
      //产品列表
      productList(){
        let _this = this
        _this.$http.post('/dev/product/getProductSelect.json').then(function(res){
          if(res.data.resStatus == 1000){
            _this.productSelectList = res.data.resMsg
          }else{
            console.log("产品列表加载失败！")
          }

        })
      },
      //远程人员列表下拉搜索方法
      remoteNameSearch(query){
        let _this = this
        if(query!==''){
          _this.$http.post('/user/getUserList.json', _this.qs.stringify({realname:query}))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.users = res.data.resMsg
                _this.versionItem.transactorId = undefined
              } else {
                _this.$notify.error({
                  title: '错误',
                  message: res.data.resMsg
                });
              }

            })
        }
      },
      //查看产品信息，回显测试经理
      findProduct(id){
        let _this = this
        _this.$http.post('dev/product/getProductDetail.json', _this.qs.stringify({id:id}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.users = [{id:res.data.resMsg.testLeaderId,realnameWithDeptName:res.data.resMsg.testLeader}]
              _this.versionItem.transactorId = res.data.resMsg.testLeaderId
            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
      },
      handlePreview(){

      },
      handleRemove(file,fileList){
        let _this = this
        this.fileList = fileList
        _this.$http.post('/attachment/delete.json', _this.qs.stringify({ids:file.id,groupName: "group1"}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {

            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
      },
      beforeRemove(){

      },
      handleExceed(){

      },
      uploadSuccess(response,file,fileList){
        if(response.resStatus==1000){
          file.id = response.resMsg.id
          this.fileList = fileList
        }
      }
    }



  }





  Vue.component('versionconverttest-operation', {
    template: `<span>
        <a href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        <a href="" @click.stop.prevent="toDetail(rowData,index)">查看</a>
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
      return {
        vctPrivilegeAdd:false,
        vctPrivilegeDelete:false,
        vctPrivilegeEdit:false
      }
    },
    created(){
      this.privilegesMenuFn()
    },
    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        let _this = this
        _this.vctPrivilegeAdd = false
        _this.vctPrivilegeDelete = false
        _this.vctPrivilegeEdit = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'vctprocessCommit1') {
            _this.vctPrivilegeAdd = true
          }
          if (_this.privilegesMenuArr[i] == 'vctdelete') {
            _this.vctPrivilegeDelete = true
          }
          if (_this.privilegesMenuArr[i] == 'vctupate') {
            _this.vctPrivilegeEdit = true
          }
        }
      },
      //编辑信息
      update () {
        // 参数根据业务场景随意构造
        this.$emit("on-custom-comp",this.rowData);
      },
      // 详细页面
      toDetail () {
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        this.$router.push({
          name: 'versiontotestdetail',
          path: '/versiontotestdetail',
          query: {
            id: params.rowData.id,
            // username: params.rowData.username,
            // realname: params.rowData.realname,
          }
        })
      }
    }
  })

</script>

<style lang="less">
</style>
