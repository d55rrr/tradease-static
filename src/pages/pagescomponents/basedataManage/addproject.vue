<template>
  <div id="addproject">
    <!--涉及人员tab中弹层-->
    <el-dialog title="新增" :visible.sync="dialogMark1" width="650px">
      <div class="tebleMark">
        <div class="tebleMark_con">
          <p>部门：</p>
          <treeselect
            :options="deptOpt"
            placeholder="请选择"
            :default-expand-level="10"
            :normalizer="normalizer"
            v-model="deptIdTemp2"
            @select="deptChangeTabTwo"
          />
        </div>
        <div class="tebleMark_con">
          <p>姓名：</p>
          <p>
            <el-select @change="getUserInfo" v-model="staff.id" placeholder="请选择">
              <el-option
                v-for="item in userOptTabTwo"
                :key="item.id"
                :label="item.realnameWithDeptName"
                :value="item.id">
              </el-option>
            </el-select>

          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userTabDoCancal(0)">取 消</el-button>
          <el-button type="primary" @click="userTabDoCancal(1)">确 定</el-button>
        </span>
      </div>

    </el-dialog>
    <!--涉及产品tab中弹层-->
<!--    <el-dialog title="新增" :visible.sync="dialogMark2" width="650px">
      <div class="tebleMark">
        <div class="tebleMark_con">
          <p>一级分类：</p>
          <p>
            <el-select @change="getFirstTypeInfo" placeholder="请选择">
              <el-option
                v-for="item in firstTypeOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con">
          <p>二级分类：</p>
          <p>
            <el-select @change="getSecondTypeInfo" placeholder="请选择">
              <el-option
                v-for="item in secondTypeOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con">
          <p>产品名称：</p>
          <p>
            <el-select @change="getProductInfo"  placeholder="请选择">
              <el-option
                v-for="item in productOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con">
          <p>版本号：</p>
          <p>
            <el-select @change="getVersionInfo"  placeholder="请选择">
              <el-option
                v-for="item in versionOpt"
                :key="item.id"
                :label="item.version"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRow2True(0)">取 消</el-button>
          <el-button type="primary" @click="addRow2True(1)">确 定</el-button>
        </span>
      </div>
    </el-dialog>-->

    <div class="addproject_Con">
      <p class="departmentcon_left_btn">
        <button v-show="!editPage&&!lookPage" @click="emptyFn" type="button" class="el-button el-button--primary"><span>新增</span></button>
        <button v-show="!lookPage" @click="saveFn(false)" type="button" class="el-button el-button--success"><span>保存</span></button>
        <button v-show="!editPage&&!lookPage" @click="saveFn(true)" type="button" class="el-button el-button--warning"><span>保存并新增</span></button>
        <button v-show="editPage||lookPage" @click="backFn" type="button" class="el-button el-button--warning"><span>回列表</span></button>
      </p>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-edit-outline"></i> 基础信息</span>
          <el-row>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">项目名称：<i>*</i></span>
                <el-input
                  placeholder="请输入项目名称"
                  v-model="name">
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">所属部门：<i>*</i></span>
                <treeselect
                  :options="deptOpt"
                  placeholder="请选择"
                  :default-expand-level="10"
                  :normalizer="normalizer"
                  v-model="deptId"
                  @select="deptChangeTabOne"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">主要负责人：<i>*</i></span>
                <el-select filterable v-model="managerId" placeholder="请选择">
                  <el-option
                    v-for="item in userOptTabOne"
                    :key="item.id"
                    :label="item.realnameWithDeptName"
                    :value="item.id">
                    {{item.realnameWithDeptName}}
                  </el-option>
                </el-select>

              </div>
            </el-col>
          </el-row>

          <el-row>

            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">状态：<i>*</i></span>
                <el-select filterable v-model="type" placeholder="请选择">
                  <el-option
                    v-for="item in typeOpt"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>

              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1 dateTime">立项时间：</span>
                <el-date-picker
                  v-model="projectTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1 dateTime">结束时间：</span>
                <el-date-picker
                  v-model="releaseTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1 dateTime">目标客户/区域：</span>
                <el-select filterable v-model="customerId" placeholder="请选择">
                  <el-option
                    v-for="item in customerOpt"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col class="productextarea" :span="2.7">
              <span class="inlineBlock inlineB1 lxmb">项目目标：</span>
            </el-col>
            <el-col class="productextarea" :span="13.3">
              <el-input
                class="desText"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="objectives">
              </el-input>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 涉及人员</span>
          <p class="departmentcon_left_btn">
            <button @click="userTabAddRow" type="button" class="el-button el-button--primary"><span>增行</span></button>
            <button @click="userTabDelRow" type="button" class="el-button el-button--success"><span>删行</span></button>
          </p>
          <div class="easytable">
            <el-table
              ref="userTable"
              highlight-current-row
              :row-class-name="userTableRowClassName"
              :data="staffs"
              @row-click="userRowClick"
              style="width: 100%;min-height:200px;">
              <el-table-column
                type="index"
                label="序号"
                width="">
              </el-table-column>
              <el-table-column
                property="deptName"
                label="部门"
                width="">
              </el-table-column>

              <el-table-column
                property="userName"
                label="姓名"
                width="">
              </el-table-column>

            </el-table>

          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 涉及产品</span>
          <p class="departmentcon_left_btn">
            <button @click="productTabAddRow" type="button" class="el-button el-button--primary"> <span>增行 </span> </button>
            <button @click="productTabDelRow" type="button" class="el-button el-button--success"><span>删行</span></button>
          </p>
          <div class="easytable">
            <editable :columns='headers'
                      v-model = "products"
                      ref="edit" />
          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 计划里程碑</span>
          <el-row class="table3">
            <el-col :span="8">
              <span class="demonstration">TR2时间：</span>
              <el-date-picker
                v-model="tr2Time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="8">
              <span class="demonstration">TR4A时间：</span>
              <el-date-picker
                v-model="tr4Time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="8">
              <span class="demonstration">TR5时间：</span>
              <el-date-picker
                v-model="tr5Time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row class="table3">
            <el-col :span="8">
              <span class="demonstration">TR6时间：</span>
              <el-date-picker
                v-model="tr6Time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="8">
              <span class="demonstration">POC时间：</span>
              <el-date-picker
                v-model="pocTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="8">
              <span class="demonstration">量产时间：</span>
              <el-date-picker
                v-model="batchTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 扩展信息</span>
          <p class="extendText">子项目交付计划：</p>
          <div>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="subProjectPlan">
            </el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import Editable from '../../../components/editable'
  export default {
    components: {Editable},
    data () {
      return {
        name:'',
        deptId:null,
        managerId:'',
        type:'',
        projectTime:'',
        releaseTime:'',
        customerId:'',
        objectives:'',

        staffs:[],//冗余
        products:[],//冗余
        userIds:[],
        versionIds:[],
        tr2Time:'',
        tr4Time:'',
        tr5Time:'',
        tr6Time:'',
        pocTime:'',
        batchTime:'',

        subProjectPlan:'',

        //页面中选项数据
        deptOpt:[],
        userOptTabOne:[],
        userOptTabTwo:[],
        typeOpt:[],
        customerOpt:[],

        //涉及人员信息
        staff:{id:'',userName:''},
        //涉及人员表格当前下标
        userTableRowIndex:'',
        //涉及人员tab中弹框
        dialogMark1:false,

        //冗余
        deptIdTemp2:null,

        //涉及产品信息
        headers:[
          {
            key:'firstTypeValue',
            name:'<span style="color:red">*</span>一级分类',
            type:'treeSelect',
            selectTree:[]
          },{
            key:'secondTypeValue',
            parentKey:'firstTypeValue',
            name:'<span style="color:red">*</span>二级分类',
            type:'treeSelect',
          },{
            key:'productId',
            parentKey:'secondTypeValue',
            name:'<span style="color:red">*</span>产品名称',
            type:'treeSelect',
          },{
            key:'versionId',
            parentKey:'productId',
            name:'<span style="color:red">*</span>版本号',
            type:'treeSelect',
          },{
            key:'unknow',
            name:'<span style="color:red">*</span>型号规格(硬件类)',
            type:'select',
            selectList:[]
          }],

        //共用页面变量
        editPage:false,
        lookPage:false,

        //编辑页附加数据
        id:'',

      }
    },
    watch: {
      deptId(){
        this.userOptTabOne=[]
        this.managerId=null
      },
      deptIdTemp2(){
        this.userOptTabTwo=[]
        this.staff.id=null
      },
      $route (to, from) {
        let _this = this
        if(to.path=='/addproject'||to.path=='/editproject'||to.path=='/lookproject'){
          _this.confirmPageType(to.path,to.query.projectId)
        }
      }
    },
    created () {
      this.getOptData()
      this.confirmPageType(this.$route.path,this.$route.query.projectId)
    },
    mounted () {
    },
    methods: {
      //共用页面方法
      confirmPageType(path,projectId){
          let _this=this
        if (path == '/addproject') {
          _this.emptyFn()
          _this.getOptData()
          _this.editPage=false
          _this.lookPage=false
        }else if(path == '/editproject'){
          _this.emptyFn()
          _this.getOptData()
          _this.editPage=true
          _this.lookPage=false
          _this.showDetail(projectId)
        }else if(path == '/lookproject'){
          _this.emptyFn()
          _this.getOptData()
          _this.editPage=false
          _this.lookPage=true
          _this.showDetail(projectId)
        }
      },
      //编辑页回显数据
      showDetail(id){
        let _this=this
        _this.$http
          .post('dev/project/info.json',_this.qs.stringify({
            id: id
          }))
         .then(function (res) {
          if (res.data.resStatus == 1000) {
           let data=res.data.resMsg
            _this.refreshUserOpt(1,data.project.deptId,data.project.managerId)
            _this.id=data.project.id
            _this.name=data.project.name
            _this.deptId=data.project.deptId
            _this.managerId=data.project.managerId
            _this.type=data.project.type
            _this.projectTime=data.project.projectTime
            _this.releaseTime=data.project.releaseTime
            _this.customerId=data.project.customerId
            _this.objectives=data.project.objectives

            _this.staffs=data.staffs//冗余
            _this.products=data.products//冗余
            _this.tr2Time=data.project.tr2Time
            _this.tr4Time=data.project.tr4Time
            _this.tr5Time=data.project.tr5Time
            _this.tr6Time=data.project.tr6Time
            _this.pocTime=data.project.pocTime
            _this.batchTime=data.project.batchTime

            _this.subProjectPlan=data.project.subProjectPlan
        }})
          .catch(function (err) {
            console.log(err)
          })
      },
      deptChangeTabOne(node){
       this.deptId=node.id
        this.refreshUserOpt(1,node.id)
      },
      deptChangeTabTwo(node){
        this.deptIdTemp2=node.id
        this.staff.deptName=node.name
        this.refreshUserOpt(2,node.id)
      },
      //刷新人员选项数据
     refreshUserOpt(num,deptId,managerId){
       let _this=this
       _this.$http
         .post('/user/getUserList.json',_this.qs.stringify({
           deptId: deptId
         }))
         .then(function (res) {
           if (res.data.resStatus == 1000) {
             if(num==1){
               _this.userOptTabOne = res.data.resMsg
               _this.$nextTick(
                 function(){
                   _this.managerId=managerId
                 }
               )
             }else if(num==2){
               _this.userOptTabTwo = res.data.resMsg
             }
           } else {
           }
         })
         .catch(function (err) {
           console.log(err)
         })
      },
      //查询选项数据
      getOptData(){
        let _this = this
        // 所属部门数据
        _this.$http
          .get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.deptOpt = res.data.resMsg
            } else {
            }
          })
          .catch(function (err) {
            console.log(err)
          })
          //字典数据 状态
        _this.dicSelect('dev','projectType',function (data) {
          _this.typeOpt=data;
        })
        //字典数据 目标客户/区域
        _this.dicSelect('dev','projectCustomer',function (data) {
          _this.customerOpt=data;
        })
        //涉及产品 可编辑表格选项数据
        _this.$http
          .get('/dev/project/versiontree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.headers[1].selectTree = res.data.resMsg
              let headers = JSON.stringify(_this.headers)
              _this.headers = JSON.parse(headers)
              console.log('here')
              console.log(res.data.resMsg)
            } else {
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //请求字典方法
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
      // 涉及人员tab中增行
      userTabAddRow () {
        let _this = this
        _this.dialogMark1 = true
      },
      // 增行确定取消方法
      userTabDoCancal (num) {
        let _this = this
        if (num == 1) {
          //确定
          _this.dialogMark1 = false
          let staff={}
          staff.id=_this.staff.id
          staff.userName=_this.staff.userName
          staff.deptName=_this.staff.deptName
          _this.staffs.push(staff);
        } else {
          _this.dialogMark1 = false
        }
        _this.staff.id=null
        _this.staff.userName=''
        _this.staff.deptName=''
        this.userTableRowIndex=''
        _this.deptIdTemp2=null
      },
      // 涉及人员tab中删行
      userTabDelRow () {
        if(this.staffs.length<1){
          return
        }else if(this.userTableRowIndex===''){
          this.staffs.pop()
        }else{
          this.staffs.splice(this.userTableRowIndex, 1)
          this.userTableRowIndex=''
        }
      },
      //人员表格点击行下标
      userRowClick(row){
        this.userTableRowIndex = row.index
      },
      userTableRowClassName ({row, rowIndex}) {
        row.index = rowIndex
      },
      getUserInfo(val){
        let _this=this
        let user=_this.userOptTabTwo.find(item=>item.id===val)
        _this.staff.userName=user.realnameWithDeptName
      },
      //涉及产品tab中增行
      productTabAddRow(){
        this.$refs.edit.add()
      },
      //涉及产品tab中删行
      productTabDelRow(){
        this.$refs.edit.remove()
      },
      //goOn为false 保存；goOn为true 保存并新增
      saveFn (goOn) {
        let _this = this
        debugger
        _this.userIds=[]
        _this.versionIds=[]
        _this.staffs.forEach(item=>_this.userIds.push(item.userId))
       _this.products.forEach(item=>_this.versionIds.push(item.versionId))
        let obj = {
          id:_this.id,//编辑页数据
          name: _this.name,
          deptId: _this.deptId,
          managerId: _this.managerId,
          type: _this.type,
          projectTime: _this.projectTime,
          releaseTime: _this.releaseTime,
          customerId: _this.customerId,
          objectives: _this.objectives,

          userIds:String(_this.userIds),
          versionIds:String(_this.versionIds),

          tr2Time:_this.tr2Time,
          tr4Time:_this.tr4Time,
          tr5Time:_this.tr5Time,
          tr6Time:_this.tr6Time,
          pocTime:_this.pocTime,
          batchTime:_this.batchTime,

          subProjectPlan: _this.subProjectPlan
        }
        if(!_this.editPage){
          //新增页按钮方法
          _this.$http
            .post(
              '/dev/project/add.json',
              _this.qs.stringify(obj)
            ).then(res => {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '成功',
                type: 'success',
                message: res.data.resMsg,
                duration: 3000
              })
              _this.emptyFn()
              console.log('goOn')
              console.log(goOn)
              if(goOn){
                //切换至tab1
              }else{
                setTimeout(function () {
                  _this.$router.push({
                    name: 'projectlist',
                    path: '/projectlist'
                  })
                }, 1000)
              }
            } else {
              _this.$notify({
                title: '错误',
                type: 'error',
                message: res.data.resMsg,
                duration: 3000
              })
            }
          })
        }else{
          //编辑页按钮方法
          _this.$http
            .post(
              '/dev/project/update.json',
              _this.qs.stringify(obj)
            ).then(res => {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '成功',
                type: 'success',
                message: res.data.resMsg,
                duration: 3000
              })
              _this.emptyFn()
              setTimeout(function () {
                _this.$router.push({
                  name: 'projectlist',
                  path: '/projectlist'
                })
              }, 1000)
            } else {
              _this.$notify({
                title: '错误',
                type: 'error',
                message: res.data.resMsg,
                duration: 3000
              })
            }
          })
        }

      },
      //新增
      emptyFn(){
          this.id=''
          this.name=''
          this.deptId=null
          this.managerId=''
          this.type=''
          this.projectTime=''
          this.releaseTime=''
          this.customerId=''
          this.objectives=''

          this.staffs=[]//冗余
          this.products=[]//冗余
          this.userIds=[]
          this.versionIds=[]
          this.tr2Time=''
          this.tr4Time=''
          this.tr5Time=''
          this.tr6Time=''
          this.pocTime=''
          this.batchTime=''

          this.subProjectPlan=''
      },
      //回列表
      backFn(){
        this.$router.push({
          name: 'projectlist',
          path: '/projectlist'
        })
      }
    }
  }
</script>

<style>
  #addproject .departmentcon_left_btn {
    margin-bottom: 10px;
  }

  #addproject .easytable {
    max-height: 487px;
    overflow-y: auto;
  }

  #addproject .inlineB1 {
    text-align: right;
    width: 110px !important;
  }

  /*.inlineBlock {*/
  /*width: 110px !important;*/
  /*text-align: right;*/
  /*}*/

  #addproject .inlineBlock > i {
    color: red;
    font-size: 0.5rem;
    font-style: initial !important;
  }

  #addproject .el-date-editor.el-input, #addproject .el-date-editor.el-input__inner {
    position: absolute;
    margin-left: 4px;
  }

  #addproject .dateTime {
    margin-top: 10px;
  }

  #addproject .desText {
    width: 450px
  }

  #addproject .el-input--suffix, #addproject .vue-treeselect__control {
    width: 199px !important;
  }

  #addproject .tebleMark_con .vue-treeselect__control {
    width: 190px !important;
    height: 40px;
    font-size: 0.7rem !important;
  }

  #addproject .tebleMark {

  }

  #addproject .tebleMark_con {
    float: left;
    width: 100%;
    margin-bottom: 20px;
  }

  #addproject .tebleMark_con select {
    border: 1px solid #adadad;
    border-radius: 4px;
    padding: 2px 10px;
    width: 189px;
    color: #606266;
    font-size: 0.8rem;
  }

  #addproject .tebleMark_con p {
    float: left;
    width: 70px;
  }

  #addproject .tebleMark_con p:first-child {
    margin-top: 7px;
  }

  #addproject .tebleMark_con p input {
    border: 1px solid #adadad;
    border-radius: 4px;
    padding: 1px 10px;
    width: 189px;
  }

/*  #describeArr {
    border: 1px solid #adadad;
    border-radius: 4px;
    padding: 1px 10px;
    width: 400px;
    height: 100px;
  }*/

  #addproject .el-message-box__btns {
    margin-top: 40px;
  }

  #addproject .table3 {
    text-align: left;
    padding-left: 100px;
    padding-bottom: 40px !important;
  }

  #addproject .table3 .demonstration {
    display: block;
    float: left;
    margin-top: 10px;
  }

  #addproject .desText textarea {
    border: 1px solid #dcdfe6;
  }

  #addproject .lxmb {
    padding-top: 10px;
  }
</style>
