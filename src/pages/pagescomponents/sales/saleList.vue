<template>
  <div id="saleList">
    <el-card style="min-height: 900px;margin: 10px">
      <el-form ref="form"  label-width="150px" :inline="true">
        <el-form-item label="用户姓名:"  >
          <el-input v-model="buyerSelect" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="产品名:">
          <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
          </el-input>
        </el-form-item>
        <el-form-item label="销售日期:" >
          <el-date-picker
            v-model="buyDateSelect"
            type="date"
            align="right"
            unlink-panels
            style="width:250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="送货日期:">
          <el-date-picker
            v-model="deliveryDateSelect"
            type="date"
            align="right"
            unlink-panels
            style="width:250px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态:" >
          <el-select v-model="payStatus"  style="width:250px">
            <el-option
              v-for="item in payStatusSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务状态:">
          <el-select v-model="serviceStatus"  style="width:250px">
            <el-option
              v-for="item in serviceStatusSelectList"
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
            label="订单编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="订单名称"
            width="300">
          </el-table-column>
          <el-table-column
            prop="buyer"
            label="购买人"
            width="140">
          </el-table-column>
          <el-table-column
            prop="buyerPhone"
            label="联系电话"
            width="200">
          </el-table-column>
          <el-table-column
            prop="buyTime"
            label="销售时间"
            width="140">
          </el-table-column>
          <el-table-column
            prop="deliveryTime"
            label="送货时间"
            width="140">
          </el-table-column>
          <el-table-column
            prop="payStatus"
            label="付款状态"
            width="150">
          </el-table-column>
          <el-table-column
            prop="serviceStatus"
            label="售后状态"
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
    <el-dialog title="新增" :visible.sync="isAdd" width="60%">
      <el-form label-position="right" label-width="100px" :inline="true">
        <el-form-item label="订单名称:">
          <el-input v-model="saleItem.name" placeholder="请选择"  style="width:250px">
          </el-input>
        </el-form-item>
        <el-form-item label="产品类别:"  >
          <el-select v-model="saleItem.type"  style="width:250px">
            <el-option
              v-for="item in serviceStatusSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售日期:" >
          <el-date-picker
            v-model="saleItem.buyDate"
            type="datetime"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            style="width:250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户姓名:"  >
          <el-input v-model="saleItem.buyer" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="用户电话:"  >
          <el-input v-model="saleItem.buyerPhone" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="顾客类型:"  >
          <el-input v-model="saleItem.customerType" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="收货人姓名:"  >
          <el-input v-model="saleItem.receiver" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="收货人电话:"  >
          <el-input v-model="saleItem.receiverPhone" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="收货时间:"  >
          <el-date-picker
            v-model="saleItem.deliveryTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            unlink-panels
            style="width:250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货地址:"  >
          <el-input v-model="saleItem.deliveryAddress" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <div style="width: 100%;border-top: 1px dotted #abbacc; ">
          <br>
          <el-row>
            <el-col :span="20">&nbsp;</el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini"  @click="addRow">增行</el-button>
              <el-button type="primary" size="mini"  @click="removeRow">删行</el-button>
            </el-col>
          </el-row>
          <template v-for="product in products">
            <el-form-item label="商品名:"  >
              <el-input v-model="product.id" style="width:250px" placeholder="请选择产品名称" >
              </el-input>
            </el-form-item>
            <el-form-item label="商品数量:"  >
              <el-input v-model="product.quatity" style="width:250px" placeholder="请选择产品名称" >
              </el-input>
            </el-form-item>
            <el-form-item label="单价:"  >
              <el-input v-model="product.price" style="width:250px" placeholder="请选择产品名称" >
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div style="width: 100%;border-top: 1px dotted #abbacc; ">
          <br>
          <el-form-item label="付款状态"  >
            <el-input v-model="saleItem.payStatus" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="服务状态:"  >
            <el-input v-model="saleItem.serviceStatus" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
        </div>
        <div style="width: 100%;border-top: 1px dotted #abbacc; ">
          <br>
          <el-form-item label="商品总额:"  >
            <el-input v-model="saleItem.realPrice" style="width:250px"  disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="实际应付总额:"  >
            <el-input v-model="saleItem.totalPrice" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="已付款金额:"  >
            <el-input v-model="saleItem.payed" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
        </div>
        <div style="float:right">
          <el-form-item label="应付总额:"  >
            <span style="font-size: 20px">8000</span>
          </el-form-item>
          <el-form-item label="已付款金额:"  >
            <span style="font-size: 20px;color: #00b83f">3000</span>
          </el-form-item>
          <el-form-item label="待付金额:"  >
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
        _this.$http.post('/tradease/sales/page',_this.qs.stringify({
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
