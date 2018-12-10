<template>
    <div id="testplan">
      <el-form  ref="form" :inline="true" label-width="80px">
        <el-form-item label="产品">
          <el-select v-model="productId" @change="refreshVersionOpt" placeholder="请选择">
            <el-option
              v-for="item in productOpt"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="版本">
          <el-select v-model="versionId" placeholder="请选择">
            <el-option
              v-for="item in versionOpt"
              :key="item.id"
              :label="item.version"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div >
            <span >创建时间</span>
            <el-date-picker
              @change="getCreateTimeRange"
              type="daterange"
              v-model="createTimeRange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="el-button el-button--primary" @click="searchFn('numberValidateForm')">查询</el-button>
          <el-button class="el-button el-button--success" @click="emptyFn('numberValidateForm')">清空</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <div class="testplan_fun_btn">
          <button v-if="true" @click="addFn" type="button" class="el-button el-button--primary"><span>新增</span></button>
        </div>
      </el-row>
      <el-table
        :data="testPlanData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="id"
          label="关键字"
          width="180">
          <template slot-scope="scope">
            {{scope.row.id|idStr}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品"
          width="180">
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本号"
        width="180">
        </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
            width="180">
        </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180">
          </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="editFn(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="lookFn(scope.row.id)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">发送邮件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="testplan_table_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="10"
          background
          layout="total,sizes,prev, pager, next"
          :total="totalRows">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  export default {
    data(){
      return {
        currentPage:1,
        pageSize:10,
        productId:'',
        versionId:'',
        createTimeBegin:'',
        createTimeEnd:'',
        createTimeRange:[],//冗余

        testPlanData:[],
        totalRows:0,
        //日期快捷选项
        pickerOptions:{
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        //选项数据
        productOpt:[],
        versionOpt:[],

        isShow:false,
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/testplanlist') {
          this.getOptData()
          // this.privilegesMenuFn()
          this.testPlanListData()
        }
      },

    },
    created () {
      this.getOptData()
      // this.privilegesMenuFn()
      this.testPlanListData()
    },
    mounted () {
    },
    methods: {
      //按钮是否显示
      privilegesMenuFn () {
        let _this = this
        _this.devProjectListSave=false
        _this.devProjectDelete=false
        _this.devProjectUpdate=false
        _this.devProjectInfo=false
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        privilegesMenu.forEach(item=>{
          if(item.priKey==='devProjectListSave'){
            _this.devProjectListSave=true
          }
          if(item.priKey==='devProjectDelete'){
            _this.devProjectDelete=true
          }
          if(item.priKey==='devProjectUpdate'){
            _this.devProjectUpdate=true
          }
          if(item.priKey==='devProjectInfo'){
            _this.devProjectInfo=true
          }
        })

      },
      //测试计划列表
      testPlanListData () {
        let _this = this
        _this.$http
          .post(
            '/dev/testplan/getTestPlanPager.json',
            _this.qs.stringify({
              currentPage: _this.currentPage,
              pageSize: _this.pageSize,
              productId: _this.productId,
              versionId:_this.versionId,
              createTimeBegin:_this.createTimeBegin,
              createTimeEnd:_this.createTimeEnd
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.testPlanData=res.data.resMsg.data
              _this.totalRows=res.data.resMsg.totalRows
            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //选项数据
      getOptData(){
        let _this=this
        _this.$http
          .post(
            '/dev/product/getProductSelect.json',
            _this.qs.stringify({
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.productOpt=res.data.resMsg
            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      refreshVersionOpt(val){
        let _this=this
        _this.$http.post('/dev/versionplan/getVersionSelect.json',_this.qs.stringify({productId:val})).then(function(res){
          if(res.data.resStatus == 1000){
             _this.versionOpt=res.data.resMsg
            _this.versionId=null
          }else{
            console.log("下拉选项加载错误！")
          }
        })
      },
      handleSizeChange (val) {
        this.pageSize = Number(`${val}`)
        this.testPlanListData()
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        this.testPlanListData()
      },
      // 发布起止时间获取
      getCreateTimeRange (time) {
        let begin = this.moment(time[0]).format('YYYY-MM-DD')
        this.createTimeBegin = begin
        let end = this.moment(time[1]).format('YYYY-MM-DD')
        this.createTimeEnd = end
      },
      //查询
      searchFn () {
        this.testPlanListData()
      },
      //清空
      emptyFn () {
          this.productId=''
          this.versionId=''
          this.createTimeBegin=''
          this.createTimeEnd=''
          this.createTimeRange=[]
         this.testPlanListData()
      },
      //新增
      addFn(){
        this.$router.push({
          name: 'addtestplan',
          path: '/addtestplan'
        })
      },
      //编辑
      editFn(val){
        this.$router.push({
          name: 'edittestplan',
          path: '/edittestplan',
          query: {
            testPlanId: val
          }
        })
      },
      //查看
      lookFn(val){
        this.$router.push({
          name: 'looktestplan',
          path: '/looktestplan',
          query: {
            testPlanId: val
          }
        })
      },

    },
    filters:{
      idStr(val){
        if(val===''|| !val){
          return ''
        }
        return 'TP-'+val
      }
    }

  }
</script>

<style>
#testplan .testplan_table_page{
  width: 100%;
  text-align: right;
  margin-top: 40px;
}
#testplan .testplan_fun_btn{
  float: right;
}
</style>
