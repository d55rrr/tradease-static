<template>
    <div id="sysuser">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="姓名:"  >
            <el-input v-model="nameSelect" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="phoneSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="创建时间:" >
            <el-date-picker
              v-model="cdateSelect"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别:">
            <el-select v-model="sexSelect"  style="width:250px">
              <el-option key="1" label="男" value="1"></el-option>
              <el-option key="2" label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="在职状态:" >
            <el-select v-model="inServiceSelect"  style="width:250px" clearable>
              <el-option
                v-for="item in inServiceSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:20px">
            <button type="button" class="el-button el-button--primary" @click="search"><span>查询</span></button>
            <button  type="button" class="el-button el-button--success" @click="clearSearch"><span>清空</span></button>
          </el-form-item>
        </el-form>
        <div style="margin:10px">
          <div style="float:right;margin:10px">
            <el-button type="primary" @click="toAdd">新增</el-button>
            <el-button type="primary" @click="toDelete">删除</el-button>
          </div>
          <el-table
            :data="tableData"
            border
            style="width: 100%;"
          >
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="id"
              label="用户编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="account"
              label="用户名"
              width="300">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
              width="140">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              width="200">
            </el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.sex==1">男</span>
                <span v-if="scope.row.sex==2">女</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="cdate"
              label="创建时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="occupy"
              label="是否在职"
              width="140">
            </el-table-column>
            <el-table-column
              prop="buyPrice"
              label="密码权限"
              width="150">
            </el-table-column>
            <el-table-column label="操作"  width="120">
              <template slot-scope="scope" >
                <el-button-group >
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
        </div>
      </el-card>
      <el-dialog title="新增" :visible.sync="isAdd" width="30%">
        <el-form label-position="right" label-width="100px" style="margin-right:30px">
          <el-form-item label="用户名:">
            <el-input v-model="userItem.account" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="姓名:">
            <el-input v-model="userItem.userName" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="userItem.phone" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="在职状态:">
            <el-select v-model="userItem.occupy" placeholder="请选择"  style="width:100%">
              <el-option :label="item.name" :value="item.value" :key="item.value" v-for="item in inServiceSelectList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别:"  >
            <el-radio-group v-model="userItem.sex"  style="width:100%">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="toAssign = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
   data(){
     return {
       currentPage: 1,
       pageSize: 10,
       buyerSelect:'',
       nameSelect:'',
       buyDateSelect:null,
       deliveryDateSelect:null,
       payStatus:null,
       serviceStatus:null,
       isAdd:false,
       userItem:{},
       inServiceSelect:null,
       sexSelect:null,
       products:[{id:null,quantity:null,price:null}],
       inServiceSelectList:[],
       tableData:[]
     }
   },
    created(){
     let _this = this
      this.initTable()
      this.findDic("sys","inService",function(res){
        _this.inServiceSelectList = res
      })
    },
    methods:{
      findDic(businessModule,subjectModule,callback){
        let _this = this
        _this.$http.post('/tradease/sysdic/dicList',_this.qs.stringify({
          businessModule:businessModule,
          subjectModule:subjectModule,
        })).then(function(res){
          if(res.data.code == 0){
            callback(res.data.data)
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      initTable(){
        let _this = this
        _this.$http.post('/tradease/sys/user/userList',_this.qs.stringify({
          currentPage:_this.currentPage,
          pageSize:_this.pageSize,
        })).then(function(res){
          if(res.data.code == 0){
            _this.tableData = res.data.page.datas
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      search(){

      },
      clearSearch(){

      },
      toEdit(){

      },
      toSee(){

      },
      toAdd(){
        this.isAdd = true
      },
      toDelete(){

      },
      addSubmit(){
        let _this = this
        let param = this.userItem
        alert(JSON.stringify(param))
        _this.$http.post('/tradease/sys/user/add',_this.qs.stringify(
          param
        )).then(function(res){
          if(res.data.code == 0){
            _this.$notify.success({
              title: '添加成功',
              message: res.data.msg
            });
            _this.isAdd = false
            _this.initTable()
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }
        })
      },


    }
  }
</script>

<style scoped>

</style>
