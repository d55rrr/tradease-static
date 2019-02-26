<template>
  <div id="saleList">
    <el-card style="min-height: 600px;margin: 10px;overflow: auto">
      <el-form ref="form"  label-width="150px" :inline="true">
        <el-form-item label="购买人姓名:"  >
          <el-input v-model="buyerSelect" style="width:250px" placeholder="请选择产品名称" >
          </el-input>
        </el-form-item>
        <el-form-item label="产品名:">
          <el-select v-model="productIdSelect" clearable filterable  style="width:250px">
            <el-option :key="item.id" :value="item.id" :label="item.name" v-for="item in productSelectList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售日期:" >
          <el-date-picker
            v-model="buyDateSelect"
            type="date"
            align="right"
            unlink-panels
            style="width:250px"
            value-format="yyyy-MM-dd HH:mm:ss"
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
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态:" >
          <el-select v-model="payStatusSelect"  clearable style="width:250px">
            <el-option
              v-for="item in payStatusSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务状态:">
          <el-select v-model="serviceStatusSelect"  style="width:250px" clearable>
            <el-option
              v-for="item in serviceStatusSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:20px;margin-bottom: -10px">
          <button type="button" class="el-button el-button--primary" @click="search"><span>查询</span></button>
          <button  type="button" class="el-button el-button--success" @click="clearSearch"><span>清空</span></button>
        </el-form-item>
      </el-form>
      <div style="margin:10px">
        <div style="float:right;margin-bottom:10px">
          <el-button type="primary" @click="toAdd">新增</el-button>
          <el-button type="primary" @click="toDelete">删除</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%;"
          @selection-change="rowSelect"
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
            <template slot-scope="scope">
              <span v-for="item in payStatusSelectList" v-if="scope.row.payStatus==item.value">{{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="serviceStatus"
            label="售后状态"
            width="150">
            <template slot-scope="scope">
              <span v-for="item in serviceStatusSelectList" v-if="scope.row.serviceStatus==item.value">{{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button-group>
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
        <el-form-item label="销售日期:" >
          <el-date-picker
            v-model="saleItem.buyTime"
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
          <el-select v-model="saleItem.customerType"  style="width:250px">
            <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in customerTypeSelectList"></el-option>
          </el-select>
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
          <template v-for="(product,index) in products">
            <el-form-item label="产品类别:"  >
              <treeselect
                style="width:250px;"
                :options="typeTree"
                placeholder="请选择产品类别"
                :default-expand-level="10"
                v-model="product.productType"
                @select="findProductList"
              />
            </el-form-item>
            <el-form-item label="商品名:"  >
              <el-select v-model="product.productId" style="width:250px" @change="selectProduct(product.productId,index)">
                <el-option v-for="item in productSelectList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品数量:"  >
              <el-input-number v-model="product.amount" style="width:250px" placeholder="请选择产品名称" @change="changeProductDetail(product.productId,index)" >
              </el-input-number>
            </el-form-item>
            <el-form-item label="单价:"  >
              <el-input v-model="product.realPrice" style="width:250px" placeholder="请选择产品名称"  @change="changeProductDetail(product.productId,index)">
              </el-input>
            </el-form-item>
            <br>
          </template>
        </div>
        <div style="width: 100%;border-top: 1px dotted #abbacc; ">
          <br>
          <el-form-item label="付款状态"  >
            <el-select v-model="saleItem.payStatus" style="width:250px">
                <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in payStatusSelectList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务状态:"  >
            <el-select v-model="saleItem.serviceStatus"  style="width:250px">
              <el-option
                v-for="item in serviceStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="width: 100%;border-top: 1px dotted #abbacc; ">
          <br>
          <el-form-item label="商品总额:"  >
            <el-input v-model="saleItem.totalPrice" style="width:250px"  disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="实际应付总额:"  >
            <el-input v-model="saleItem.realPrice" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="已付款金额:"  >
            <el-input v-model="saleItem.payed" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
        </div>
        <div style="float:right">
          <el-form-item label="应付总额:"  >
            <span style="font-size: 20px">{{saleItem.realPrice}}</span>
          </el-form-item>
          <el-form-item label="已付款金额:"  >
            <span style="font-size: 20px;color: #00b83f">{{saleItem.payed}}</span>
          </el-form-item>
          <el-form-item label="待付金额:"  >
            <span style="font-size: 20px;color:red">{{saleItem.realPrice-saleItem.payed}}</span>
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
        productIdSelect:'',
        buyDateSelect:null,
        deliveryDateSelect:null,
        payStatusSelect:null,
        serviceStatusSelect:null,
        isAdd:false,
        saleItem:{totalPrice:0,realPrice:0,payed:0},
        typeTree:[],
        totalRows:0,
        productSelectList:[],
        selectedIds:[],
        products:[{id:null,quantity:null,price:null}],
        customerTypeSelectList:[],
        payStatusSelectList:[],
        payStatusSelectList:[{'id':'1','name':'已结'}],
        serviceStatusSelectList:[{'id':'1','name':'未配送'}],
        tableData:[]
      }
    },
    created(){
      let _this = this
      this.initTable()
      this.findTypeTree()
      this.findProductSelectList()
      this.findDic("sale","customerType",function(res){
        _this.customerTypeSelectList = res
      })
      this.findDic("sale","payStatus",function(res){
        _this.payStatusSelectList = res
      })
      this.findDic("sale","serviceStatus",function(res){
        _this.serviceStatusSelectList = res
      })

    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/sales/page',_this.qs.stringify({
          currentPage:_this.currentPage,
          pageSize:_this.pageSize,
          buyer:_this.buyerSelect,
          productId:_this.productIdSelect,
          buyTime:_this.buyDateSelect,
          deliveryTime:_this.deliveryDateSelect,
          payStatus:_this.payStatusSelect,
          serviceStatus:_this.serviceStatusSelect
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
      findProductSelectList(){
        let _this = this
        _this.$http.post('/product/list'
        ).then(function(res){
          if(res.data.code == 0){
            _this.productSelectList = res.data.data
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }

        })
      },
      findTypeTree(){
        let _this = this
        _this.$http.post('/productModule/tree'
        ).then(function(res){
          if(res.data.code == 0){
            _this.typeTree = res.data.data
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }

        })
      },
      findProductList(node){
        let _this = this
        _this.$http.post('/product/list',
          _this.qs.stringify({type:node.id})
        ).then(function(res){
          if(res.data.code == 0){
            _this.productSelectList = res.data.data
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }

        })
      },
      selectProduct(productId,index){
        let _this = this
        this.productSelectList.forEach(item=>{
          if(item.id==productId){
            _this.products[index].productName = item.name
            _this.products[index].realPrice = item.salePrice
            _this.products[index].price = item.salePrice
          }
        })
      },
      changeProductDetail(productId,index){
        let _this = this
        this.saleItem.realPrice = 0;
        this.saleItem.totalPrice = 0;
        this.saleItem.unpayed = 0
        _this.products.forEach(item=>{
            item.totalPrice = item.realPrice*item.amount
            _this.saleItem.realPrice+=item.totalPrice
            _this.saleItem.totalPrice+=item.price*item.amount
        })
      },
      search(){
        this.initTable()
      },
      clearSearch(){
        this.buyerSelect = ''
      },
      rowSelect(selection){
        let _this = this
        this.selectedIds =  []
        if(selection.length){
          selection.forEach(item=>{
            _this.selectedIds.push(item.id)
          })
        }
      },
      toEdit(row){
        let _this = this
        this.isAdd = true
        this.products = []
        this.saleItem = {totalPrice:0,realPrice:0,payed:0}
        _this.$http.post('/sales/find',
          _this.qs.stringify({id:row.id})
        ).then(function(res){
          if(res.data.code == 0){
            _this.saleItem = res.data.obj
            _this.products = res.data.obj.orderDetails
            _this.products.forEach(item=>{
              _this.productSelectList.push({id:item.productId,name:item.productName})
            })
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }

        })

      },
      toSee(){

      },
      toAdd(){
        this.isAdd = true
        this.products = []
        this.saleItem = {totalPrice:0,realPrice:0,payed:0}

      },
      toDelete(){
        let _this = this
        if(!_this.selectedIds.length){
          _this.$notify.info({
            title: '消息',
            message:'请选择删除行！'
          });
          return
        }
        this.$confirm('确认删除吗？').then(function(){
          _this.$http.post('/sales/delete',
            _this.qs.stringify({ids:_this.selectedIds.join(",")})
          ).then(function(res){
            if(res.data.code == 0){
              _this.$notify.success({
                title: '成功',
                message: res.data.msg
              });
              _this.initTable()
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.msg
              });
            }

          })
        })
      },
      addSubmit(){
        let _this = this
        this.saleItem.orderDetails = this.products
        let param = this.saleItem
        if(this.saleItem.id){
          _this.$http({
            url: '/sales/update',
            method: 'post',
            data: JSON.stringify(param),
            headers: {
              'Content-Type': 'application/json'
            }

          }).then(function(res){
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
          _this.$http({
            url: '/sales/insert',
            method: 'post',
            data: JSON.stringify(param),
            headers: {
              'Content-Type': 'application/json'
            }

          }).then(function(res){
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
      addRow(){
        this.products.push({id:null,quantity:null,price:null})
      },
      removeRow(){
        if(this.products){
          this.products.pop()
        }
      },
      findDic(businessModule,subjectModule,callback){
        let _this = this
        _this.$http.post('/sysdic/dicList',_this.qs.stringify({
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
    }
  }
</script>

<style scoped>

</style>
