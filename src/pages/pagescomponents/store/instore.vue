<template>
    <div id="instore">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="入库名:"  >
            <el-input v-model="nameSelect" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="入库产品:">
            <el-input v-model="productSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="入库日期:" >
            <el-date-picker
              v-model="stockTime"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="经办人:">
            <el-select  v-model="transactorId" style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库类型:" >
            <el-select v-model="stockType"  style="width:250px">
              <el-option
                v-for="item in instockTypeSelectList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提货方式:" >
            <el-select v-model="deliveryType"  style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库状态:">
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
              label="入库编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="入库名称"
              width="300">
            </el-table-column>
            <el-table-column
              prop="transactorId"
              label="入库人"
              width="140">
              stockType
            </el-table-column>
            <el-table-column
              prop="stockTime"
              label="入库时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="deliveryType"
              label="提货方式"
              width="140">
              <template slot-scope="scope">
                <span v-for="item in deliveryTypeSelectList" v-if="scope.row.deliveryType==item.value">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stockType"
              label="入库类型"
              width="150">
              <template slot-scope="scope">
                <span v-for="item in instockTypeSelectList" v-if="scope.row.stockType==item.value">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stockStatus"
              label="入库状态"
              width="150">
            </el-table-column>
            <el-table-column label="操作" width="120px" >
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
          <el-form-item label="入库名:">
            <el-input v-model="storeItem.name" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="入库类型:"  >
            <el-select v-model="storeItem.stockType"  style="width:250px">
              <el-option
                v-for="item in instockTypeSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库时间:" >
            <el-date-picker
              v-model="storeItem.stockTime"
              type="datetime"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入库人:"  >
            <el-select v-model="storeItem.transactorId" style="width:250px">
              <el-option
                v-for="item in userSelectList"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提货方式:"  >
            <el-select v-model="storeItem.deliveryType"  style="width:250px">
              <el-option
                v-for="item in deliveryTypeSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
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
          <div style="width: 100%;border-top: 1px dotted #abbacc; ">
            <br>
            <el-form-item label="商品总额:"  >
              <el-input v-model="storeItem.realPrice" style="width:250px"  disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="实际应付总额:"  >
              <el-input v-model="storeItem.totalPrice" style="width:250px" placeholder="请选择产品名称" >
              </el-input>
            </el-form-item>
            <el-form-item label="已付款金额:"  >
              <el-input v-model="storeItem.payed" style="width:250px" placeholder="请选择产品名称" >
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
        storeItem:{},
        products:[{id:null,quantity:null,price:null}],
        payStatusSelectList:[{'id':'1','name':'已结'}],
        serviceStatusSelectList:[{'id':'1','name':'未配送'}],
        tableData:[],
        detailData:[],
        instockTypeSelectList:[],
        instockStatusSelectList:[],
        deliveryTypeSelectList:[],
        warehouseSelectList:[],
        productSelectList:[],
        userSelectList:[],
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
            key:'price',
            name:'<span style="color:red">*</span>单价',
            type:'text'
          },
          {
            key:'stockTime',
            name:'<span style="color:red">*</span>入库日期',
            type:'date',
          },
          {
            key:'warehouseId',
            name:'仓库名',
            type:'select',
            selectList:[]
          },
          {
            key:'stockStatus',
            name:'入库状态',
            type:'select',
            selectList:[]
          },
        ],
      }
    },
    created(){
      let _this = this
      this.initTable()
      this.findDic("stock","instockType",function(res){
        _this.instockTypeSelectList = res
      })
      this.findDic("stock","instockStatus",function(res){
        _this.instockStatusSelectList = res
      })
      this.findDic("sale","deliveryType",function(res){
        _this.deliveryTypeSelectList = res
      })
      this.findDic("stock","warehouse",function(res){
        _this.warehouseSelectList = res
      })
      this.findProductList()
      this.findUserList()

    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/tradease/inStock/page',_this.qs.stringify({
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
        this.headers[4].selectList = this.warehouseSelectList
        this.headers[5].selectList = this.instockStatusSelectList
        this.headers[0].selectList = this.productSelectList

      },
      toDelete(){

      },
      addSubmit(){
        let _this = this
        let param = this.storeItem
        param.inStockDetail = this.detailData
        if(param.id){

        }else{
          //alert(JSON.stringify(param))
          _this.$http({
            url: '/tradease/inStock/insert',
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
      findUserList(){
        let _this = this
        _this.$http.post('/tradease/sys/user/userList',
          _this.qs.stringify({pageSize:10000})
        ).then(function(res){
          if(res.data.code == 0){
            _this.userSelectList = res.data.page.datas
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }

        })
      },
      findProductList(){
        let _this = this
        _this.productSelectList = []
        _this.$http.post('/tradease/product/list'
        ).then(function(res){
          if(res.data.code == 0){
            res.data.data.forEach(item=>{
              _this.productSelectList.push({name:item.name,value:item.id})
            })
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

    }
  }
</script>

<style scoped>

</style>
