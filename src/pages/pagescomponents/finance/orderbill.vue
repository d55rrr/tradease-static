<template>
    <div id="orderbill">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="销售类别:"  >
            <el-input v-model="buyerSelect" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="创建时间:" >
            <el-date-picker
              v-model="buyDateSelect"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="完成状态:">
            <el-date-picker
              v-model="deliveryDateSelect"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="所属订单:" >
            <el-select v-model="payStatus"  style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="待付金额:" >
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
              label="收款编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="saleId"
              label="关联订单"
              width="300">
            </el-table-column>
            <el-table-column
              prop="saleType"
              label="销售类型"
              width="140">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="总金额"
              width="200">
            </el-table-column>
            <el-table-column
              prop="unpayed"
              label="待付金额"
              width="140">
            </el-table-column>
            <el-table-column
              prop="payMan"
              label="支付人"
              width="140">
            </el-table-column>
            <el-table-column
              prop="payStatus"
              label="完成状态"
              width="150">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button-group >
                  <el-button type="text" size="mini" style="width:30px" @click="toEdit(scope.row)">修改</el-button>
                  <el-button type="text" size="mini" style="width:60px" @click="toSee(scope.row)">查看记录</el-button>
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
      <el-dialog title="新增" :visible.sync="isAdd" width="60%">
        <el-form label-position="right" label-width="100px" :inline="true">
          <el-form-item label="销售类型:"  >
            <el-select v-model="orderItem.saleType"  style="width:250px">
              <el-option
                v-for="item in serviceStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联订单:">
            <el-input v-model="orderItem.saleId" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="支付方式:"  >
            <el-input v-model="orderItem.payType" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="付款金额:"  >
            <el-input v-model="orderItem.payed" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="支付公司:"  >
            <el-input v-model="orderItem.payCompany" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="支付人:"  >
            <el-input v-model="orderItem.payMan" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:"  >
            <el-input v-model="orderItem.remark" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <div style="float:right">
            <el-form-item label="账单总额:"  >
              <span style="font-size: 20px">8000</span>
            </el-form-item>
            <el-form-item label="付款金额:"  >
              <span style="font-size: 20px;color: #00b83f">3000</span>
            </el-form-item>
            <el-form-item label="未付金额:"  >
              <span style="font-size: 20px;color:red">5000</span>
            </el-form-item>
          </div>
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
        orderItem:{},
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
        _this.$http.post('/orderBill/page',_this.qs.stringify({
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
        let param = this.orderItem
        alert(JSON.stringify(param))
        _this.$http.post('/orderBill/insert',_this.qs.stringify(
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
