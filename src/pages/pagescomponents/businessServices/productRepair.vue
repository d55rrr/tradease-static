<template>
    <div id="productrepair">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="订单名:">
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="产品名:">
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="收货人姓名:"  >
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
          <el-form-item label="安装日期:">
            <el-date-picker
              v-model="deliveryDateSelect"
              type="date"
              align="right"
              unlink-panels
              style="width:250px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="安装人:" >
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
              label="安装编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="安装产品"
              width="300">
            </el-table-column>
            <el-table-column
              prop="buyer"
              label="收货人"
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
              label="安装时间"
              width="140">
            </el-table-column>
            <el-table-column
              prop="payStatus"
              label="地址"
              width="300">
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
    </div>
</template>

<script>
  export default {
    data(){
      return {
        tableData:[],
        repairItemrepairItem:{},
        isAdd:false,
        totalRows:null,
        currentPage:1,
        pageSize:10,
      }
    },
    created(){

    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
