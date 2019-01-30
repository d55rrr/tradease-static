<template>
    <div id="storeinfo">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true" style="margin-top: 20px;">
          <el-form-item label="产品名:">
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="所属仓库:" >
            <el-select v-model="payStatus"  style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存状态:" >
            <el-select v-model="payStatus"  style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
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
              label="库存编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="产品名"
              width="300">
            </el-table-column>
            <el-table-column
              prop="unitName"
              label="产品单位名"
              width="140">
            </el-table-column>
            <el-table-column
              prop="storageNumber"
              label="库存数量"
              width="200">
            </el-table-column>
            <el-table-column
              prop="storageFreeze"
              label="冻结数量"
              width="140">
            </el-table-column>
            <el-table-column
              prop="storageOnway"
              label="待入库"
              width="140">
            </el-table-column>
            <el-table-column
              prop="storageAvaliable"
              label="可用库存"
              width="150">
            </el-table-column>
            <el-table-column
              prop="maxStorage"
              label="库存上限"
              width="150">
            </el-table-column>
            <el-table-column
              prop="minStorage"
              label="库存下限"
              width="150">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button-group >
                  <el-button type="text" size="mini" style="width:30px" @click="toEdit(scope.row)">编辑</el-button>
                  <el-button type="text" size="mini" style="width:30px" @click="toSee(scope.row)">查看</el-button>
                  <el-button type="text" size="mini" style="width:30px" @click="toEdit(scope.row)">打印</el-button>
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
        saleItem:{},
        products:[{id:null,quantity:null,price:null}],
        payStatusSelectList:[{'id':'1','name':'已结'}],
        serviceStatusSelectList:[{'id':'1','name':'未配送'}],
        tableData:[]
      }
    },
    created(){
      this.initTable()
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/tradease/storage/page',_this.qs.stringify({
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
        let param = this.saleItem
        alert(JSON.stringify(param))
        _this.$http.post('/tradease/sales/insert',_this.qs.stringify(
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
      addRow(){
        this.products.push({id:null,quantity:null,price:null})
      },
      removeRow(){
        if(this.products){
          this.products.pop()
        }
      },
    }
  }
</script>

<style scoped>

</style>
