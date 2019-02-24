<template>
    <div id="sysdic">
      <el-card style="height: 600px;margin: 10px;overflow: auto">
        <el-form ref="form"  label-width="150px" :inline="true" style="margin-top: 20px">
          <el-form-item label="模块名:"  >
            <el-select v-model="businessNameSelect" style="width:250px" placeholder="请选择产品名称" @change="findSubjectNameSelect">
                <el-option :key="item" :value="item" :label="item" v-for="item in businessNameSelectList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务名:">
            <el-select v-model="subjectNameSelect" placeholder="请选择"  style="width:250px">
              <el-option :key="item" :value="item" :label="item" v-for="item in subjectNameSelectList"></el-option>
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
              label="编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="businessModule"
              label="模块名"
              width="250">
            </el-table-column>
            <el-table-column
              prop="subjectModule"
              label="业务名"
              width="250">
            </el-table-column>
            <el-table-column
              prop="name"
              label="属性名"
              width="300">
            </el-table-column>
            <el-table-column
              prop="value"
              label="属性值"
              width="140">
            </el-table-column>
            <el-table-column
              prop="cdate"
              label="创建时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="flag"
              label="状态"
              width="140">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
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
          <el-form-item label="模块名:">
            <el-input v-model="dicItem.businessModule" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="业务名:">
            <el-input v-model="dicItem.subjectModule" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="属性名:">
            <el-input v-model="dicItem.name" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="属性值:"  >
            <el-input v-model="dicItem.value" placeholder="请选择"  style="width:100%"></el-input>
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
        totalRows:null,
        isAdd:false,
        dicItem:{},
        products:[{id:null,quantity:null,price:null}],
        businessNameSelect:null,
        subjectNameSelect:null,
        subjectNameSelectList:[],
        businessNameSelectList:[],
        tableData:[]
      }
    },
    created(){
      this.initTable()
      this.findBusinessNameSelect()
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/tradease/sysdic/page',_this.qs.stringify({
          currentPage:_this.currentPage,
          pageSize:_this.pageSize,
        })).then(function(res){
          if(res.data.code == 0){
            _this.tableData = res.data.page.datas
            _this.totalRows = res.data.page.total
            _this.currentPage = res.data.page.currentPage
            _this.pageSize = res.data.page.pageSize
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
      toEdit(row){
        let _this = this
        this.isAdd = true
        _this.$http.post('/tradease/sysdic/find',_this.qs.stringify({
            id:row.id
        })).then(function(res){
          if(res.data.code == 0){
            _this.dicItem = res.data.obj
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      toSee(){

      },
      toAdd(){
        this.isAdd = true
        this.dicItem = {}
      },
      toDelete(){

      },
      addSubmit(){
        let _this = this
        let param = this.dicItem
        if(this.dicItem.id){
          _this.$http.post('/tradease/sysdic/update',_this.qs.stringify(
            param
          )).then(function(res){
            if(res.data.code == 0){
              _this.$notify.success({
                title: '修改成功',
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
        }else{
          _this.$http.post('/tradease/sysdic/insert',_this.qs.stringify(
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
        }

      },
      findSubjectNameSelect(){
        let _this = this
        _this.$http.post('/tradease/sysdic/typeList',_this.qs.stringify({
          businessModule:_this.businessNameSelect
        })).then(function(res){
          if(res.data.code == 0){
            _this.subjectNameSelectList = res.data.data
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      findBusinessNameSelect(name){
        let _this = this
        _this.$http.post('/tradease/sysdic/typeList',_this.qs.stringify({
          businessModule:name
        })).then(function(res){
          if(res.data.code == 0){
              _this.businessNameSelectList = res.data.data
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      }


    }
  }
</script>

<style scoped>

</style>
