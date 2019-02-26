<template>
    <div id="outstore">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form  label-width="150px" :inline="true">
          <el-form-item label="出库名:"  >
            <el-input v-model="nameSelect" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="出库产品:">
            <el-input v-model="productSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="出库日期:" >
            <el-date-picker
              v-model="stockTime"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="经办人:" >
            <el-select  v-model="transactorId" style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库类型:" >
            <el-select v-model="stockType"  style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库状态:">
            <el-select v-model="serviceStatus"  style="width:250px">
              <el-option
                v-for="item in serviceStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="要货单位:">
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
              label="出库编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="出库名"
              width="300">
            </el-table-column>
            <el-table-column
              prop="buyerId"
              label="要货单位"
              width="200">
            </el-table-column>
            <el-table-column
              prop="outDate"
              label="出库时间"
              width="140">
            </el-table-column>
            <el-table-column
              prop="transactorId"
              label="经办人"
              width="150">
            </el-table-column>
            <el-table-column
              prop="outType"
              label="出货类型"
              width="150">
            </el-table-column>
            <el-table-column
              prop="deliveryType"
              label="提货方式"
              width="150">
            </el-table-column>
            <el-table-column
              prop="outStatus"
              label="出库状态"
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
          <el-form-item label="关联订单类别:">
            <el-input v-model="storeItem.orderType" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="关联订单:"  >
            <el-select v-model="storeItem.orderId"  style="width:250px">
              <el-option
                v-for="item in stockTypeSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库名:">
            <el-input v-model="storeItem.name" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="出库时间:" >
            <el-date-picker
              v-model="storeItem.outDate"
              type="datetime"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出库人:"  >
            <el-input v-model="storeItem.transactorId" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="出库类型:"  >
            <el-input v-model="storeItem.outType" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="提货方式:"  >
            <el-input v-model="storeItem.deliveryType" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="要货单位:"  >
            <el-input v-model="storeItem.buyerId" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="出库状态:"  >
            <el-input v-model="storeItem.outStatus" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:"  >
            <el-input v-model="storeItem.remark" style="width:250px" placeholder="请选择产品名称" >
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
            <editable
              :columns='headers'
              ref="edit"
              v-model="detailData"
              style="margin-bottom: 30px"
            >
            </editable>
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
  import editable from '../../../components/editable'
  export default {
    components:{
      editable
    },
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
        tableData:[],
        storeItem:[],
        detailData:[],
        stockTypeSelectList:[{'id':'1','name':'进货'}],
        headers:[
          {
            key:'productId',
            name:'<span style="color:red">*</span>产品名称',
            type:'select',
            selectList:[]
          },
          {
            key:'amount',
            name:'<span style="color:red">*</span>产品数量',
            type:'text'
          },
          {
            key:'outStatus',
            name:'<span style="color:red">*</span>出库状态',
            type:'date',
          }
        ],
      }
    },
    created(){
      this.initTable()
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/OutStock/page',_this.qs.stringify({
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
        let param = this.storeItem
        _this.$http.post('/OutStock/insert',_this.qs.stringify(
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
        this.$refs.edit.add()
      },
      removeRow(){
        this.$refs.edit.remove()
      },
    }
  }
</script>

<style scoped>

</style>
