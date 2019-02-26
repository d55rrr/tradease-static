<template>
    <div id="productrepair">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="产品名:">
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="联系人姓名:"  >
            <el-input v-model="buyerSelect" style="width:250px" placeholder="请选择产品名称" >
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
          <el-form-item label="维修日期:">
            <el-date-picker
              v-model="deliveryDateSelect"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="维修人:" >
            <el-select v-model="payStatus"  style="width:250px">
              <el-option
                v-for="item in payStatusSelectList"
                :key="item.id"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维修状态:">
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
              label="维修编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="productId"
              label="产品名"
              width="200">
            </el-table-column>
            <el-table-column
              prop="customer"
              label="联系人"
              width="140">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="联系电话"
              width="150">
            </el-table-column>
            <el-table-column
              prop="buyTime"
              label="购买时间"
              width="140">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              width="250">
            </el-table-column>
            <el-table-column
              prop="serviceTime"
              label="维修时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="manId"
              label="维修人"
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
              @size-change="initTable()"
              @current-change="initTable()"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
      <el-dialog title="新增" :visible.sync="isAdd" width="60%">
        <el-form label-position="right" label-width="100px" :inline="true">
          <el-form-item label="产品名:">
            <el-input v-model="repairItem.productId" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="订单名称:">
            <el-input v-model="repairItem.orderId" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="联系人:">
            <el-input v-model="repairItem.customer" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="repairItem.phone" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="安装时间:" >
            <el-date-picker
              v-model="repairItem.installTime"
              type="datetime"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地址:">
            <el-input v-model="repairItem.address" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="内机条码:">
            <el-input v-model="repairItem.innerCode" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="外机条码:">
            <el-input v-model="repairItem.outterCode" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="故障现象:">
            <el-input v-model="repairItem.malfunction" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="故障代码:">
            <el-input v-model="repairItem.malfunctionCode" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="维修措施:">
            <el-input v-model="repairItem.repairWay" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="维修人:">
            <el-input v-model="repairItem.manId" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="维修时间:">
            <el-date-picker
              v-model="repairItem.serviceTime"
              type="datetime"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              style="width:250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="repairItem.remark" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="维修状态:">
            <el-input v-model="repairItem.serviceStatus" placeholder="请输入"  style="width:250px">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="toAdd = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    data(){
      return {
        tableData:[],
        repairItem:{},
        isAdd:false,
        totalRows:null,
        currentPage:1,
        pageSize:10,
      }
    },
    created(){
      this.initTable()
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/productRepair/page',_this.qs.stringify({
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
      toAdd(){
        this.isAdd = true
      },
      search(){

      },
      clearSearch(){

      },
      addSubmit(){
        let _this = this
        let param = this.repairItem
        _this.$http.post('/productRepair/insert',_this.qs.stringify(
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
      toEdit(){

      },
      toSee(){

      }


    }
  }
</script>

<style scoped>

</style>
