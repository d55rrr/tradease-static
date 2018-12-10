<template>

  <div id="addtestplan">
    <el-card class="box-card">
    <div>
      <div>
        <span style="font-size: 25px">测试计划{{projectName}}  {{productName}} {{version}}</span>
      </div>
      <portaittable :rows="rows"
                    v-model="tableData"
                    v-on:refreshSelectFn="refreshSelectFn">
      </portaittable>
      <horizontaltable :columns="columns"
                v-model="planDetailList"
                >
      </horizontaltable>
      <!--<el-button @click="showData">show</el-button>-->
      <div class="right_bottom_btn">
        <button  @click="saveFn" type="button" class="el-button el-button--success"><span>保存</span></button>
        <button @click="saveSendFn" type="button" class="el-button el-button--success"><span>保存并发送邮件</span></button>
        <button  @click="backFn" type="button" class="el-button el-button--warning"><span>取消</span></button>
      </div>
    </div>
    </el-card>
  </div>

</template>

<script>
  import Portaittable from '../../../../components/portaittable'
  import Horizontaltable from '../../../../components/horizontaltable'
  import Editable from '../../../../components/editable'
  export default {
    components: {Editable, Portaittable,Horizontaltable},
    data(){
      return {
        rows:[
          {label: '所属项目', key: 'projectId',type:'selectId',selectList:[]},
          {label: '产品', key: 'productId',type:'selectId',selectList:[]},
          {label: '版本号', key: 'versionId',type:'selectId',selectList:[]},
          {label: '版本计划属性', key: 'planned',type:'selectValue',selectList:[]},
          {label: '版本测试目的', key: 'target',type:'selectValue',selectList:[]},
          {label: '版本提测时间', key: 'transferTestTime',type:'date'},
          {label: '版本信息', key: 'versionInfo',type:'textarea'},
          {label: '测试重点及范围', key: 'focusScope',type:'textarea'},
          {label: '版本测试负责人', key: 'testManagerIds',type:'selectMulti',selectList:[]}
        ],
        tableData:{
          projectId:'',
          productId:'',
          versionId:'',
          planned:'',
          target:'',
          transferTestTime:'',
          versionInfo:'',
          focusScope:'',
          testManagerIds:[]
        },

       projectName:'xxx',
       productName:'xxx',
       version:'xxx',
        //选项数据
      /*  projectOpt:[{id:1,name:'欧尚'}],
        productOpt:[{id:1,name:'E31'}],
        versionOpt:[{id:1,name:'1.1.2'}],
        plannedOpt:[{value:1,name:'计划内'}],
        targetOpt:[{value:1,name:'商用'}],
        testManagerOpt:[{id:1,name:'张三'},{id:2,name:'李四'}]*/
        columns:[
          {label:'测试项目',key:'project',type:'text'},
          {label:'测试内容',key:'content',type:'text'},
          {label:'测试环境',key:'environment',type:'text'},
          {label:'用例选择策略',key:'strategy',type:'treeselect',selectList:[]},
          {label:'测试周期',key:'testStartToEnd',type:'daterange'},
          {label:'测试策略',key:'unkonw1',type:'text'},
          {label:'测试执行人',key:'unknow2',type:'text'},
          {label:'测试备注',key:'description',type:'text'},
        ],
        planDetailList:[],
        //共用页面变量
        editPage:false,
        lookPage:false,
        //编辑页面数据
        id:'',
      }
    },
    watch:{
      $route (to, from) {
        let _this = this
        if(to.path=='/addtestplan'||to.path=='/edittestplan'||to.path=='/looktestplan'){
          _this.getOptData()
          _this.confirmPageType(to.path,to.query.testPlanId)
        }
      }
    },
    created(){
     /* this.rows[0].selectList=this.projectOpt
      this.rows[1].selectList=this.productOpt
      this.rows[2].selectList=this.versionOpt
      this.rows[3].selectList=this.plannedOpt
      this.rows[4].selectList=this.targetOpt
      this.rows[8].selectList=this.testManagerOpt*/
      this.getOptData()
      this.confirmPageType(this.$route.path,this.$route.query.testPlanId)
    },
    methods:{
      //共用页面方法
      confirmPageType(path,testPlanId){
        let _this=this
        if (path == '/addtestplan') {
          _this.emptyFn()
          _this.getOptData()
          _this.editPage=false
          _this.lookPage=false
        }else if(path == '/edittestplan'){
          _this.emptyFn()
          _this.getOptData()
          _this.editPage=true
          _this.lookPage=false
          _this.showDetail(testPlanId)
        }else if(path == '/looktestplan'){
          _this.emptyFn()
          _this.getOptData()
          _this.editPage=false
          _this.lookPage=true
          _this.showDetail(testPlanId)
        }
      },
      getOptData(){
        let _this=this
        //所属项目
        _this.$http.get('/dev/project/datas.json', _this.qs.stringify({}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.rows[0].selectList=res.data.resMsg
            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
        //所属产品
        _this.$http.post('/dev/product/getProductSelect.json',_this.qs.stringify({})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.rows[1].selectList = res.data.resMsg
          }else{
            console.log("产品列表加载失败！")
          }
        })
        //版本号
        _this.$http.post('/dev/versionplan/getVersionSelect.json',_this.qs.stringify({})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.rows[2].selectList = res.data.resMsg
          }else{
            console.log("下拉选项加载错误！")
          }
        })
        //字典
        _this.dicSelect('dev','versionPlanned',function (data) {
          _this.rows[3].selectList=data
        })
        _this.dicSelect('dev','versionTarget',function (data) {
          _this.rows[4].selectList=data
        })
        //版本测试负责人
        _this.$http.get('/user/getUserList.json', _this.qs.stringify({}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.rows[8].selectList=res.data.resMsg
            } else {
              console.log(res.data.resMsg)
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
      refreshSelectFn(val){
          if(val){
            if(val=='projectId'){
              this.refreshProductInfo(this.tableData.projectId)
              this.refreshVersionInfo()
              this.refreshVersionDetail()
              this.refreshCaseModule()
            }else if(val=='productId'){
               this.refreshVersionInfo(this.tableData.productId)
              this.refreshVersionDetail()
              this.refreshCaseModule(this.tableData.productId)
            }else if(val=='versionId'){
               this.refreshVersionDetail(this.tableData.versionId)
            }
          }
      },
      //刷新产品
      refreshProductInfo(val){
        let _this=this
        _this.tableData.productId=null
        _this.$http.post('/dev/product/getProductSelect.json',_this.qs.stringify({projectId:val})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.rows[1].selectList = res.data.resMsg
          }else{
            console.log("产品列表加载失败！")
          }
        })
      },
      //刷新版本
      refreshVersionInfo(val){
        let _this=this
        _this.tableData.versionId=null
        if(val){
          _this.$http.post('/dev/versionplan/getVersionSelect.json',_this.qs.stringify({productId:val})).then(function(res){
            if(res.data.resStatus == 1000){
              _this.rows[2].selectList = res.data.resMsg
            }else{
              console.log("下拉选项加载错误！")
            }
          })
        }else{
          _this.rows[2].selectList = []
        }
      },
      //刷新版本详情
      refreshVersionDetail(val){
        let _this=this
        if(val){
          _this.$http.post('/dev/versionplan/getVersionPlanDetail.json',_this.qs.stringify({id:val})).then(function(res){
            if(res.data.resStatus == 1000){
              let data=res.data.resMsg
              _this.tableData.planned=data.planned
              _this.tableData.target=data.target
              _this.tableData.transferTestTime=data.transferTestTime
            }else{
              console.log("下拉选项加载错误！")
            }
          })
        }else{
          _this.tableData.planned=null
          _this.tableData.target=null
          _this.tableData.transferTestTime=''
        }

      },
      //刷新用例选择策略
      refreshCaseModule(val){
        let _this=this
        _this.planDetailList=[]
        _this.columns[3].selectList=[]
        if(val){
          _this.$http.post('/dev/testcasemodule/gettree.json', _this.qs.stringify({productId:val}))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.columns[3].selectList=res.data.resMsg
              } else {
                console.log(res.data.resMsg)
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      },
      showData(){
        console.log('data',this.planDetailList)
      },
      //保存
      saveFn(){
        let _this=this
        let obj={}
        obj.versionId=_this.tableData.versionId
        obj.versionInfo=_this.tableData.versionInfo
        obj.focusScope=_this.tableData.focusScope
        obj.testManagerIds=_this.tableData.testManagerIds
        _this.planDetailList.forEach(item=>{
          if(item.testStartToEnd.length>0){
            item.testStart=item.testStartToEnd[0]
            item.testEnd=item.testStartToEnd[1]
            //todo 以下待去除
            item.testCaseExecuteList=[{id:1,executiveId:1,executive:'张三'}]
          }
        })
        obj.planDetailList=_this.planDetailList
        if(!_this.editPage){
          //新增页面保存
          _this.$http({
            url: '/dev/testplan/saveTestPlan.json',
            method: 'post',
            data:JSON.stringify(obj),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => {
              if (res.data.resStatus == 1000) {
                _this.$notify({
                  title: '成功',
                  message: res.data.resMsg,
                  type: 'success',
                  duration: 3000
                })
                setTimeout(function () {
                  _this.$router.go(-1)
                }, 1000)
              } else {
                _this.$notify({
                  title: '错误',
                  message: res.data.resMsg,
                  type: 'error',
                  duration: 3000
                })
              }
            })
        }else{
          //修改页面保存

        }

      },
      //保存并发送邮件
      saveSendFn(){},
      //取消
      backFn(){
        this.$router.go(-1)
      },
      showDetail(id){
        let _this=this
        _this.$http
          .post('dev/testplan/getTestPlanDetail.json',_this.qs.stringify({
            id: id
          }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              let data=res.data.resMsg
              _this.columns[3].selectList=data.testCaseTree
              _this.id=data.id
              _this.tableData.projectId=data.projectId
              _this.tableData.productId=data.versionPlan.productId
              _this.tableData.versionId=data.versionPlan.id
              _this.tableData.planned=data.versionPlan.planned
              _this.tableData.target=data.versionPlan.target
              _this.tableData.transferTestTime=data.versionPlan.transferTestTime
              _this.tableData.versionInfo=data.versionInfo
              _this.tableData.focusScope=data.focusScope
              _this.tableData.testManagerIds=data.testManagerIds
              data.planDetailList.forEach(item=>{
                item.testStartToEnd=[]
                item.testStartToEnd.push(item.testStart)
                item.testStartToEnd.push(item.testEnd)
              })
              console.log('tree',data.testCaseTree)
              _this.planDetailList=data.planDetailList
            }})
          .catch(function (err) {
            console.log(err)
          })
      },
      emptyFn(){
        this.tableData.projectId=''
        this.tableData.productId=''
        this.tableData.versionId=''
        this.tableData.planned=''
        this.tableData.target=''
        this.tableData.transferTestTime=''
        this.tableData.versionInfo=''
        this.tableData.focusScope=''
        this.tableData.testManagerIds=[]

        this.planDetailList=[]

        this.rows[1].selectList = [] //产品选项
        this.rows[2].selectList=[] //版本选型
        this.planDetailList=[]
        this.columns[3].selectList=[] //用例选择策略选项
      }
    },

  }
</script>

<style scoped>
 #addtestplan .right_bottom_btn{
    float: right;
    margin-top: 45px;
    margin-right: 20px;
   margin-bottom: 20px;
 }
</style>
