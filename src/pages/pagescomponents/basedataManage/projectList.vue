<template>
  <div id="projectList">
    <div class="projectList_Con">
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">目标客户/区域：</span>
            <el-select filterable v-model="customerId"  placeholder="请选择">
              <el-option
                v-for="item in customerOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-col>

        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">项目名称：</span>
            <el-input
              placeholder="请输入项目名称"
              v-model="name">
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">负责人：</span>
            <el-input
              placeholder="请输入负责人"
              v-model="manager">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">状态：</span>
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
            <span class="inlineBlock">立项时间：</span>
            <el-date-picker
              @change="getProjectTimeRange"
              type="daterange"
              v-model="projectTimeRange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels>
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
          <button v-if="devProjectListSave" @click="addFn" type="button" class="el-button el-button--primary"><span>新增</span></button>
          <button v-if="devProjectDelete" @click="delFn" type="button" class="el-button el-button--primary"><span>删除</span></button>
        </div>

        <el-table
          :data="projectList"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed
            prop="name"
            label="项目名称"
            height="40">
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="所属部门"
            height="40px">
          </el-table-column>
          <el-table-column
            prop="manager"
            label="负责人"
            height="40">
          </el-table-column>
          <el-table-column
            prop="type"
            label="状态"
            height="40">
            <template slot-scope="scope">
              {{scope.row.type|typeName(typeOpt)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="projectTime"
            label="立项时间"
            height="40">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="170"
            height="40">
            <template slot-scope="scope">
              <el-button v-if="devProjectUpdate" @click="editFn(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="devProjectInfo" @click="lookFn(scope.row)" type="text" size="small">查看</el-button>
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
        name:'',
        customerId:null,
        manager:'',
        type:'',
        projectTimeBegin:'',
        projectTimeEnd:'',
        projectTimeRange:[],//冗余
        projectList:[],
        totalRows:0,
        currentPage:1,
        pageSize:10,
        //选项数据
       customerOpt:[],
       typeOpt:[],
        //删除数据
        delIds:[],
        //按钮显示
        devProjectListSave:false,
        devProjectDelete:false,
        devProjectUpdate:false,
        devProjectInfo:false,
      }
    },
    watch: {
      //监听路由变化
      $route (to, from) {
        if (to.path == '/projectlist') {
          this.getOptData()
          this.privilegesMenuFn()
          this.projectListData()
        }
      },

    },
    created () {
      this.getOptData()
      this.privilegesMenuFn()
      this.projectListData()
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
      //项目列表
      projectListData () {
        let _this = this
        _this.$http
          .post(
            '/dev/project/list.json',
            _this.qs.stringify({
              currentPage: _this.currentPage,
              pageSize: _this.pageSize,
              name: _this.name,
              customerId:_this.customerId,
              manager:_this.manager,
              type:_this.type,
              projectTimeBegin:_this.projectTimeBegin,
              projectTimeEnd:_this.projectTimeEnd,
            })
          )
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.projectList=res.data.resMsg.data
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
        this.dicSelect('dev','projectType',function (data) {
          _this.typeOpt=data
        })
        this.dicSelect('dev','projectCustomer',function (data) {
          _this.customerOpt=data
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
        this.projectListData()
      },
      handleCurrentChange (val) {
        this.currentPage = Number(`${val}`)
        this.projectListData()
      },
    // 发布起止时间获取
      getProjectTimeRange (time) {
        let begin = this.moment(time[0]).format('YYYY-MM-DD')
        this.projectTimeBegin = begin
        let end = this.moment(time[1]).format('YYYY-MM-DD')
        this.projectTimeEnd = end
      },
      //查询
      searchFn () {
        this.projectListData()
      },
      //清空
      emptyFn () {
        this.name=''
        this.customerId=null
        this.manager=''
        this.type=''
        this.projectTimeBegin=''
        this.projectTimeEnd=''
        this.projectTimeRange=[]
        this.projectListData()
      },
      //table选行
      handleSelectionChange (val) {
        let ids = []
        val.forEach(item =>ids.push(item.id))
        this.delIds = ids
      },
      //新增
      addFn(){
        this.$router.push({
          name: 'addproject',
          path: '/addproject'
        })
      },
      // 删除
      delFn () {
        let _this = this
        if(!_this.delIds||_this.delIds.length===0){
          _this.$notify({
            title: '错误',
            type: 'error',
            message: '请指定项目再操作'
          })
          return
        }
        _this
          .$confirm('确定删除此项目吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            // 删除接口
            _this.$http
              .post(
                'dev/project/delete.json',
                _this.qs.stringify({
                  ids: String(_this.delIds)
                })
              )
              .then(function (res) {
                if (res.data.resStatus === 1000) {
                  _this.projectListData()
                  _this.$notify({
                    title: '成功',
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  _this.$notify({
                    title: '错误',
                    type: 'error',
                    message: '删除失败!'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          })
          .catch(() => {
          })
      },
      // 编辑
      editFn (val) {
        let _this = this
        _this.$router.push({
          name: 'editproject',
          path: '/editproject',
          query: {
            projectId: val.id
          }
        })
      },
      // 查看
      lookFn (val) {
        let _this = this
        _this.$router.push({
          name: 'lookproject',
          path: '/lookproject',
          query: {
            projectId: val.id
          }
        })
      },
    },
    filters:{
      typeName(val,typeOpt){
        if(val===''|| !val){
          return ''
        }
        let obj=typeOpt.find(item=> item.value===val)
        return obj.name;
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
