<template>
  <div id="testcaselist">
    <el-card class="box-card" style="height: 80vh">
      <el-row style="">
        <el-col :span="7">
          <div style="width: 100%;height:78vh">
            <div style="display:flex;width:100%;border-bottom: 1px dotted #c0c4cc;min-height: 380px;margin-left: 20px;">
              <div style="width: 100%;">
                <br>
                <el-form label-position="right" label-width="100px" style="width: 70%;"  >
                  <el-form-item label="产品:" >
                    <el-select  placeholder="请选择产品" style="width: 100%"  @change="findModuleTree"  v-model="productSelect" clearable>
                      <el-option v-for="product in productSelectList" :key="product.id" :label="product.name" :value="product.id" ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="模块:">
                    <el-select  placeholder="请选择模块" style="width: 100%"    v-model="moduleSelect" clearable>
                      <el-option v-for="module in moduleSelectList" :key="module.value" :label="module.name" :value="module.value" ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="用例标题:">
                    <el-input style="width: 100%" placeholder="请填写用例标题" clearable v-model="title"></el-input>
                  </el-form-item>
                  <el-form-item label="测试方式:">
                    <el-select  placeholder="请选择测试方式" style="width: 100%;"  v-model="modeSelect" clearable >
                      <el-option v-for="mode in modeSelectList" :key="mode.value" :label="mode.name" :value="mode.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="用例级别:">
                    <el-select  placeholder="请选择用例级别" style="width: 100%;"  v-model="levelSelect" clearable >
                      <el-option v-for="level in levelSelectList" :key="level.value" :label="level.name" :value="level.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div style="float:left">
                  <el-button type="primary"  @click="initTable('')" icon="el-icon-search">搜索</el-button>
                  <el-button type="primary"  @click="clear">重置</el-button>
                </div>



              </div>
            </div>
            <div style="margin:20px">
              <el-tree
                :data="moduleTree"
                node-key="id"
                :expand-on-click-node="false"
                :highlight-current="true"
                :default-expand-all="true"
                @node-click="handleNodeClick"
                empty-text="请选择产品后查看模块内容"
              >
                <span  slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-badge :value="data.editNum" class="item" v-show="data.editNum">
                  </el-badge>
                </span>
              </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <div style="height: 70vh;border-left:1px dotted #c0c4cc;margin-left:5px;margin: 20px;" >
            <!--详细列表-->
            <div v-show="!toDetail">
              <el-row>
                <el-col :span="24">
                  <div style="float:right">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAdd">新增</el-button>
                    <el-button type="primary" icon="el-icon-remove-outline" @click="deleteObj">删除</el-button>
                    <el-button type="primary" icon="el-icon-upload">导入</el-button>
                    <el-button type="primary" icon="el-icon-download">导出</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table
                    :data="tableData"
                    border
                    style="width: 100%;margin-left: 20px"
                    @select="rowSelection"

                  >
                    <el-table-column
                      type="selection"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      prop="id"
                      label="用例编号"
                      width="120">
                     <span slot-scope="scope">
                       TC-{{scope.row.id}}
                     </span>
                    </el-table-column>
                    <el-table-column
                      prop="title"
                      label="用例标题"
                      width="300">
                    </el-table-column>
                    <el-table-column
                      prop="level"
                      label="用例级别"
                      width="140">
                     <span slot-scope="scope">
                       <template v-for="level in levelSelectList" v-if="level.value==scope.row.level">{{level.name}}</template>
                     </span>
                    </el-table-column>
                    <el-table-column
                      prop="creator"
                      label="更新人"
                      width="140">
                    </el-table-column>
                    <el-table-column
                      prop="updateTime"
                      label="更新时间"
                      width="140">
                    </el-table-column>
                    <el-table-column label="操作" >
                      <template slot-scope="scope">
                        <el-button-group >
                          <el-button type="text" size="mini" style="width:30px">审核</el-button>
                          <el-button type="text" size="mini" style="width:30px" @click="toEdit(scope.row)">编辑</el-button>
                          <el-button type="text" size="mini" style="width:30px" @click="toSee(scope.row)">查看</el-button>
                        </el-button-group>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="float:right;margin-top: 10px">
                    <el-pagination
                      :current-page.sync="currentPage"
                      :page-sizes="[10, 20, 30, 40,50]"
                      :page-size.sync="pageSize"
                      background
                      layout="sizes,prev, pager, next"
                      :total="totalRows"
                      @size-change="initTable('')"
                      @current-change="initTable('')"
                    >
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
            </div>
<!--
            详细列表
-->
            <div v-show="toDetail" style="overflow-y: scroll;height: 70vh" >
              <el-row>
                <el-col :span="24">
                  <span style="font-size: 15pt;margin-left: 100px;">基本信息<i class="el-icon-d-caret"></i></span>
                  <br>
                  <br>
                  <el-form label-position="right" label-width="130px" style="width: 70%;margin-left: 100px;"  :rules="caseRules" ref="caseForm" :model="updateObj">
                    <el-form-item label="测试用例标题:" prop="title">
                      <el-input style="width: 100%" placeholder="请填写用例标题" v-model="updateObj.title"></el-input>
                    </el-form-item>
                    <el-form-item label="前提条件:">
                      <el-input style="width: 100%" placeholder="请填写前提条件" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="updateObj.precondition"></el-input>
                    </el-form-item>
                    <el-form-item label="测试方式:">
                      <el-radio-group v-model="updateObj.mode">
                        <el-radio v-for="mode in modeSelectList"  :label="mode.value"  >{{mode.name}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="用例类型:" >
                      <el-select  placeholder="" style="width: 100%"   v-model="updateObj.type">
                        <el-option v-for="type in typeSelectList" :key="type.id" :label="type.name" :value="type.id" ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="用例级别:">
                      <el-select  placeholder="请选择用例级别" style="width: 100%;"  v-model="updateObj.level" >
                        <el-option v-for="level in levelSelectList" :key="level.value" :label="level.name" :value="level.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="预计执行时间(分):">
                      <el-input style="width: 100%" placeholder="请添加预计执行时间" v-model="updateObj.timeConsume"></el-input>
                    </el-form-item>
                    <el-form-item label="进度比重:">
                      <el-select  placeholder="请选择用例级别" style="width: 100%;" v-model="updateObj.progressRatio">
                        <el-option v-for="ratio in ratioSelectList" :key="ratio.value" :label="ratio.name" :value="ratio.value" v></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="备注:">
                      <el-input style="width: 100%" placeholder="请添加备注" v-model="updateObj.description"></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <span style="font-size: 15pt;margin-left: 100px;">操作步骤<i class="el-icon-d-caret"></i></span>
                  <div style="width:80%;margin-left: 100px;min-height: 50px">
                    <div style="float:right;margin-right:20px;margin-bottom: 5px">
                      <i class="el-icon-circle-plus"style="cursor: pointer;zoom:150%;color:#606266" @click="addColumn" ></i>
                      <i class="el-icon-remove"style="cursor: pointer;zoom:150%;color:#606266" @click="deleteColumn"></i>
                    </div>
                    <editable
                      :columns="headers"
                      ref="edit"
                      v-model="updateSteps"
                    ></editable>
                  </div>

                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="width:80%;margin-left:100px">
                    <div style="float:right;margin-bottom: 20px">
                      <el-button type="primary" icon="el-icon-check" @click="saveObj(1,1)">保存</el-button>
                      <el-button type="primary" @click="saveAdd">保存&新增</el-button>
                      <el-button type="primary" @click="saveCopy">保存&复制新增</el-button>
                      <el-button type="primary" icon="el-icon-back" @click="toList">取消</el-button>
                    </div>
                  </div>

                </el-col>
              </el-row>
            </div>

          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
  import Editable from '../../../components/editable'
  export default {
    components: {Editable},
    data(){
      return{
        productSelectList:[],
        moduleTree:[],
        currentObj:{name:''},
        users:[],
        tableData:[],
        levelSelectList:[],
        modeSelectList:[],
        typeSelectList:[],
        ratioSelectList:[],
        moduleSelectList:[],
        levelSelect:null,
        modeSelect:null,
        title:null,
        productSelect:null,
        moduleSelect:null,
        totalRows:0,
        pageSize:10,
        currentPage:0,
        toDetail:false,
        headers:[
          {
            key:'stepMemo',
            name:'步骤',
            type:'text'
          },
          {
            key:'expectedResult',
            name:'预期结果',
            type:'text'
          }
        ],
        updateObj:{title:null,precondition:null,mode:null,type:null,level:null,timeConsume:null,progressRatio:null,description:null},
        updateSteps:[],
        rowSelectList:[],
        caseRules:{
          title:[{ required: true, message: '请输入标题', trigger: 'blur' }]
        }

      }
    },
    created(){
      let _this = this
      _this.dicSelect('dev','caseLevel',function(data){
        _this.levelSelectList = data;
      });
      _this.dicSelect('dev','caseMode',function(data){
        _this.modeSelectList = data;
      });
      _this.dicSelect('dev','caseType',function(data){
        _this.typeSelectList = data;
      });
      _this.dicSelect('dev','caseProgressRatio',function(data){
        _this.ratioSelectList = data;
      });
      this.findProductList()
      this.initTable()
    },
    mounted(){

    },
    watch:{
      $router(to,from){
        this.findProductList()
        this.initTable()
      }
    },
    methods:{
      initTable(moduleId){
        let _this = this
        _this.$http.post('/dev/testcase/list.json',this.qs.stringify({
          productId:this.productSelect,
          moduleId:moduleId?moduleId:this.moduleSelect,
          mode:this.modeSelect,
          level:this.levelSelect,
          title:this.title,
          totalRows: this.totalRows,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })).then(function(res){
          if(res.data.resStatus == 1000){
            _this.tableData = res.data.resMsg.data
            _this.totalRows = res.data.resMsg.totalRows
            _this.currentPage = res.data.resMsg.currentPage
            _this.pageSize = res.data.resMsg.pageSize
          }else{
            console.log("用例列表加载失败！")
          }

        })
      },
      clear(){
        this.productSelect =null
        this.moduleSelect = null
        this.title = null
        this.modeSelect = null
        this.levelSelect = null
        this.moduleTree = []
        this.moduleSelectList = []
      },
      toAdd(){
        this.toDetail = true
      },
      toSee(row){
        alert(JSON.stringify(row))
        this.toDetail = true
        this.findCaseDetail(row.id)

      },
      toEdit(row){
        this.toDetail = true
        this.findCaseDetail(row.id)

      },
      toList(){
        this.toDetail = false
        this.updateSteps = []
        this.updateObj = {title:null,precondition:null,mode:null,type:null,level:null,timeConsume:null,progressRatio:null,description:null}
      },
      rowSelection(selection,row){
        let _this = this
        this.rowSelectList = []
        selection.forEach((select)=>{
          _this.rowSelectList.push(select.id)
        })
      },
      findCaseDetail(id){
        let _this = this
        _this.$http.post('/dev/testcase/info.json',this.qs.stringify({id:id})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.updateObj = res.data.resMsg
            if(_this.updateObj.steps&&_this.updateObj.steps.length){
              _this.updateSteps = _this.updateObj.steps
            }
          }else{
            console.log("产品列表加载失败！")
          }

        })
      },
      findProductList(){
        let _this = this
        _this.$http.post('/dev/product/getProductSelect.json').then(function(res){
              if(res.data.resStatus == 1000){
                _this.productSelectList = res.data.resMsg
              }else{
                console.log("产品列表加载失败！")
              }

        })
      },
      findModuleTree(){
        let _this = this
        _this.$http.post("/dev/testcasemodule/gettree.json",this.qs.stringify({productId:this.productSelect})).then(function (res) {
          if(res.data.resStatus == 1000){
            let parent = {}
            parent.label = '父节点'
            parent.id = 0
            parent.children = []
            if(_this.productSelect&&_this.productSelectList.length){
              _this.productSelectList.forEach(product=>{
                if(_this.productSelect==product.id){
                  parent.label = product.name
                  parent.id = 0
                }
              })
            }
            parent.children = res.data.resMsg
            _this.moduleTree = []
            _this.moduleTree.push(parent)
            _this.moduleSelectList = []
            if(res.data.resMsg.length){
              res.data.resMsg.forEach((data)=>{
                let temp = {}
                temp.value = data.id
                temp.name = data.name
                _this.moduleSelectList.push(temp)
              })
            }
          }else{
            console.log("模块树加载失败！")
          }

        })
      },
      handleNodeClick(obj,node,component){
        if(obj.id==0){
          this.currentObj = {}
          this.currentObj.id = 0
          return
        }
        let temp = {}
        temp.id = obj.managerId
        temp.realnameWithDeptName = obj.manager
        this.currentObj = obj
        this.initTable(obj.id)
      },
      remoteNameSearch(query){
        let _this = this
        if(query!==''){
          _this.$http.post('/user/getUserList.json', _this.qs.stringify({realname:query}))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.users = res.data.resMsg
              } else {
                _this.$notify.error({
                  title: '错误',
                  message: res.data.resMsg
                });
              }

            })
        }

      },
      addNode(){
        this.currentObj = {}
      },
      saveObj(toClear,toRedirect){
        let validateResult = true
        this.$refs.caseForm.validate((valid)=>{
          if(!valid){
            validateResult =  false
          }
        })
        if(!validateResult){
          return
        }
        let _this = this
        this.updateObj.moduleId = this.currentObj.id
        if(this.updateSteps.length){
          this.updateObj.steps = this.updateSteps
        }
        if(!this.currentObj.id){
          _this.$notify.info({
            title: '消息',
            message: '请先测试选择模块'
          });
          return
        }
        if(this.updateObj.id){
          this.editSubmit()
        }else{
          this.addSubmit()
        }
        if(toClear){
          _this.updateObj = {title:null,precondition:null,mode:null,type:null,level:null,timeConsume:null,progressRatio:null,description:null}
          _this.updateSteps = []
        }
        if(toRedirect){
          _this.initTable()
          _this.toDetail = false
        }
      },
      saveAdd(){
        this.saveObj(true)
      },
      saveCopy(){
        this.saveObj()
      },
      addSubmit(){
        let _this = this
        let updateObjStr = JSON.stringify(this.updateObj)
        _this.$http.post("/dev/testcase/save.json",this.qs.stringify({testCase:updateObjStr})).then(function (res) {
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '添加成功',
              type: 'success'
            });
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }

        })
      },
      editSubmit(){
        let _this = this
        let updateObjStr = JSON.stringify(this.updateObj)
        _this.$http.post("/dev/testcase/update.json",this.qs.stringify({testCase:updateObjStr})).then(function (res) {
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '修改成功',
              type: 'success'
            });
            _this.toDetail = false
            _this.initTable()
            _this.updateObj = {title:null,precondition:null,mode:null,type:null,level:null,timeConsume:null,progressRatio:null,description:null}
            _this.updateSteps = []
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }

        })
      },
      deleteObj(){
        let _this = this
        if(!this.rowSelectList.length){
          _this.$notify.info({
            title:'消息',
            message:'请选择需要删除的列'
          })
          return
        }
        let param = this.rowSelectList.join(",")
        this.$confirm('确认删除吗？').then(function(){
          _this.$http.post("/dev/testcase/delete.json",_this.qs.stringify({ids:param})).then(function (res) {
            if(res.data.resStatus == 1000){
              _this.$notify({
                title:'删除成功',
                type: 'success'
              });
              _this.initTable()
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
        })
      },
      addColumn(){
        this.$refs.edit.add()
      },
      deleteColumn(){
        this.$refs.edit.remove()
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
</script>

<style scoped>

</style>
