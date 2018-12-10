<template>
  <div id="projectList">
    <div class="projectList_Con">
      <el-dialog title="编辑" :visible.sync="editDialog" width="1000px">
        <div class="tebleMark">
          <div class="tebleMark_con tebleMark_con_input">
            <p class="inlineBlock">实际测试开始时间：<i>*</i></p>
            <p>
              <el-date-picker
                v-model="testTimeStart"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </p>
          </div>
          <div class="tebleMark_con tebleMark_con_input">
            <p class="inlineBlock">实际测试结束时间：<i>*</i></p>
            <p>
              <el-date-picker
                v-model="testTimeEnd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </p>
          </div>

          <div class="tebleMark_con">
            <p class="inlineBlock">测试状态：<i>*</i></p>
            <p>
              <el-select  v-model="testStatus" placeholder="请选择">
                <el-option
                  v-for="item in testStatusOpt"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </p>
          </div>
          <div class="tebleMark_con">
            <p class="inlineBlock">归档状态：<i>*</i></p>
            <p>
              <el-select  v-model="archiveStatus" placeholder="请选择">
                <el-option
                  v-for="item in archiveStatusOpt"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </p>
          </div>

          <div class="tebleMark_con">
            <p>主要问题&风险：</p>
            <p>
          <textarea v-model="mainProblem" >
          </textarea>
            </p>
          </div>
          <div class="tebleMark_con">
            <p>备注：</p>
            <p>
          <textarea v-model="description" >
          </textarea>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="doOrCancel(0)">取 消</el-button>
          <el-button type="primary" @click="doOrCancel(1)">确 定</el-button>
        </span>
        </div>
      </el-dialog>

      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">产品分类：</span>
            <el-select filterable v-model="productType" @change="productTypeChange" placeholder="请选择">
              <el-option
                v-for="item in productTypeOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">产品名称：</span>
            <el-select filterable v-model="productId"  placeholder="请选择">
              <el-option
                v-for="item in productOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">计划属性：</span>
            <el-select filterable v-model="planned"  placeholder="请选择">
              <el-option
                v-for="item in plannedOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">转测目的：</span>
            <el-select filterable v-model="target"  placeholder="请选择">
              <el-option
                v-for="item in targetOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">提测时间：</span>
            <el-date-picker
              @change="getTransferTestTimeRange"
              type="daterange"
              v-model="transferTestRange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="projectList_Con_search">
            <div class="projectList_Con_btn_search">
              <button @click="searchFn" type="button" class="el-button el-button--primary"><span>查询</span></button>
              <button @click="emptyFn" type="button" class="el-button el-button--success"><span>清空</span></button>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- table部分 -->
      <div class="projectList_Con_table">
        <div class="projectList_Con_table_btn">
          <!--todo-->
          <button v-if="false" @click="exportFn" type="button" class="el-button el-button--primary"><span>导出</span></button>
        </div>
        <el-table
          :data="versions"
          border>
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="主要问题&风险:">
                  <span>{{ props.row.mainProblem }}</span>
                </el-form-item>
                <el-form-item label="备注说明:">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            prop="projectNames"
            label="所属项目"
            height="40">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            height="40px">
          </el-table-column>
          <el-table-column
            prop="version"
            label="发布版本"
            height="40">
          </el-table-column>
          <el-table-column
            prop="plannedName"
            label="计划属性"
            height="40">
          </el-table-column>
          <el-table-column
            prop="targetName"
            label="转测目的"
            height="40">
          </el-table-column>
          <el-table-column
            prop="planTestTime"
            label="计划转测时间"
            height="40">
          </el-table-column>
          <el-table-column
            prop="transferTestTime"
            label="实际转测时间"
            height="40">
          </el-table-column>
          <el-table-column
            prop="planReleaseTime"
            label="计划发布时间"
            height="40">
          </el-table-column>
          <el-table-column
            prop="testTimeStart"
            label="实际开始测试时间"
            height="40">
          </el-table-column>
          <el-table-column
            prop="testTimeEnd"
            label="实际测试结束时间"
            height="40">
          </el-table-column>
          <el-table-column
            prop="testStatusName"
            label="测试状态"
            height="40">
          </el-table-column>
          <el-table-column
            prop="id"
            label="提测ID"
            height="40">
            <template slot-scope="scope">
              {{scope.row.id|submitId}}
            </template>
          </el-table-column>
          <el-table-column
            prop="archiveStatusName"
            label="归档状态"
            height="40">
          </el-table-column>
          <el-table-column
            prop="id"
            label="归档ID"
            height="40">
            <template slot-scope="scope">
              {{scope.row.id|archiveId}}
            </template>
          </el-table-column>
          <el-table-column
            prop="testManagerNames"
            label="测试负责人"
            height="40">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="170"
            height="40">
            <template slot-scope="scope">
              <el-button v-if="updateVersionTrace" @click="editFn(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="false" @click="lookFn(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="projectList_Con_table_pages">
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
        productType:'',
        productId:null,
        planned:'',
        target:'',
        transferTestTimeBegin:'',
        transferTestTimeEnd:'',
        transferTestRange:[],//冗余

        versions:[],
        totalRows:0,
        currentPage:1,
        pageSize:10,

        editDialog:false,//编辑dialog 及数据
        id:'',
        testTimeStart:'',
        testTimeEnd:'',
        testStatus:'',
        archiveStatus:'',
        mainProblem:'',
        description:'',

        //选项数据
        testStatusOpt:[],
        archiveStatusOpt:[],
        productTypeOpt:[],
        productOpt:[],
        plannedOpt:[],
        targetOpt:[],

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
        //按钮显示
        updateVersionTrace:false,
        exportVersionTrace:false //todo
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/versiontracelist') {
          this.getOptData()
          this.privilegesMenuFn()
          this.versionTraceListData()
        }
      },

    },
    created () {
      this.getOptData()
      this.privilegesMenuFn()
      this.versionTraceListData()
    },
    mounted () {
    },

    methods: {
      //按钮是否显示
      privilegesMenuFn () {
        let _this = this
        _this.updateVersionTrace=false
        _this.exportVersionTrace=false
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        privilegesMenu.forEach(item=>{
          if(item.priKey==='updateVersionTrace'){
            _this.updateVersionTrace=true
          }
          if(item.priKey==='exportVersionTrace'){
            _this.exportVersionTrace=true
          }
        })

      },
      //版本转测列表
      versionTraceListData () {
        let _this = this
        _this.$http
          .post(
            '/dev/versiontrace/getVersionTracePager.json',
            _this.qs.stringify({
              currentPage: _this.currentPage,
              pageSize: _this.pageSize,
              productType: _this.productType,
              productId:_this.productId,
              planned:_this.planned,
              target:_this.target,
              transferTestTimeBegin:_this.transferTestTimeBegin,
              transferTestTimeEnd:_this.transferTestTimeEnd,
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.versions=res.data.resMsg.data
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
        this.dicSelect('dev','versionTestStatus',function (data) {
          _this.testStatusOpt=data
        })
        this.dicSelect('dev','versionArchiveStatus',function (data) {
          _this.archiveStatusOpt=data
        })
        this.dicSelect('dev','versionPlanned',function (data) {
          _this.plannedOpt=data
        })
        this.dicSelect('dev','versionTarget',function (data) {
          _this.targetOpt=data
        })
        this.dicSelect('dev','ware',function (data) {
          _this.productTypeOpt=data
        })
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
      },
      handleSizeChange (val) {
        this.pageSize = Number(`${val}`)
        this.versionTraceListData()
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        this.versionTraceListData()
      },
      //编辑弹框确定取消方法
      doOrCancel(num){
        let _this=this
        if(num==1){
          let obj={}
          obj.id=_this.id
          obj.testTimeStart=_this.testTimeStart
          obj.testTimeEnd=_this.testTimeEnd
          obj.testStatus=_this.testStatus
          obj.archiveStatus=_this.archiveStatus
          obj.mainProblem=_this.mainProblem
          obj.description=_this.description
          _this.$http({
            url: 'dev/versiontrace/updateVersionTrace.json',
            method: 'post',
            data: JSON.stringify(obj),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(
            function (res) {
              if (res.data.resStatus == 1000) {
                _this.emptyDialogData()
                _this.versionTraceListData()
                _this.$notify({
                  title: '成功',
                  message: res.data.resMsg,
                  type: 'success',
                  duration: 3000
                })
              } else {
                _this.$notify({
                  title: '错误',
                  message: res.data.resMsg,
                  type: 'error',
                  duration: 3000
                })
              }
            }
          ).catch(function (err) {
            console.log(err)
          })
        }else if(num==0){
          _this.emptyDialogData()
        }

      },
     emptyDialogData(){
       this.editDialog=false
       this.id=''
       this.testTimeStart=''
       this.testTimeEnd=''
       this.testStatus=''
       this.archiveStatus=''
       this.mainProblem=''
       this.description=''
     },
      // 提测起止时间获取
      getTransferTestTimeRange (time) {
        let begin = this.moment(time[0]).format('YYYY-MM-DD')
        this.transferTestTimeBegin = begin
        let end = this.moment(time[1]).format('YYYY-MM-DD')
        this.transferTestTimeEnd = end
      },
      productTypeChange(val){
        let _this=this
        _this.$http
          .post(
            '/dev/product/getProductSelect.json',
            _this.qs.stringify({
             type:val
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.productOpt=res.data.resMsg
              _this.productId=null
            } else {
              console.log(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //查询
      searchFn () {
        this.versionTraceListData()
      },
      //清空
      emptyFn () {
        this.productType=''
        this.productId=null
        this.planned=''
        this.target=''
        this.transferTestTimeBegin=''
        this.transferTestTimeEnd=''
        this.transferTestRange=[]
        this.versionTraceListData()
      },
      //导出
      exportFn(){
       // todo
        /*window.location.href = '/dev/versiontrace/exportVersionTrace.json';*/
        /* let _this=this
        _this.$http
          .get('/dev/versiontrace/exportVersionTrace.json')
          .then(function (res) {
            console.log('what')
            if (res.data.resStatus == 999) {
              _this.$notify({
                title: '错误',
                message: res.data.resMsg,
                type: 'error',
                duration: 3000
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })*/
      },
      // 编辑
      editFn (row) {
        let _this = this
        _this.editDialog=true
        _this.id=row.id
        _this.testTimeStart=row.testTimeStart
        _this.testTimeEnd=row.testTimeEnd
        _this.testStatus=row.testStatus
        _this.archiveStatus=row.archiveStatus
        _this.mainProblem=row.mainProblem
        _this.description=row.description
      }
    },
    filters:{
      submitId(id){
        return 'AT-'+id
      },
      archiveId(id){
        return 'RV-'+id
      }
    }
  }


</script>

<style lang="less">
  #projectList .projectList_Con {
    max-width: 100% !important;
  }

  #projectList .el-row {
    max-width: 1000px;
  }

  #projectList .elRow2 .el-col {
    text-align: left;
  }

  #projectList .el-input__icon {
    line-height: 0px;
  }

  #projectList .el-date-editor .el-range-separator {
    line-height: 27px;
  }

  #projectList .cell > button {
    padding: 0 !important;
  }

  //表格图片设置
  #projectList .imgStyle {
    width: 15px;
    height: 15px;
    margin-top: 12px;
    display: inline-table;
  }

  #projectList .inlineBlock {
    display: inline-block;
    width: 70px;
  }

  #projectList .el-date-editor.el-input, #projectList .el-date-editor.el-input__inner {
    width: 250px;
  }

  #projectList .el-row .el-input {
    width: 192px;
  }

  #projectList .inlineB1 {
    text-align: right !important;
    width: 110px !important;
  }

  #projectList .tebleMark {
    float: left;
    width: 100%;
  }

  #projectList .tebleMark_con {
    float: left;
    width: 100%;
    margin-bottom: 25px;
  }

  #projectList .tebleMark_con > p:first-child {
    width: 80px;
    text-align: right;
  }

  #projectList .tebleMark_con > p {
    float: left;
    font-size: 0.9rem;
  }

  #projectList .tebleMark_con_input .el-date-editor.el-input {
    width: 193px;
  }

  #projectList .el-inputStyle {
    width: 193px;
  }

  #projectList textarea {
    border: 1px solid #adadad;
    width: 400px;
    height: 100px;
  }

  #projectList .projectList_Con_search {
    padding-left: 20px;
  }
</style>
