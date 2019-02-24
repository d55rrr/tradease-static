<template>
    <div id="productlist">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="产品类别:"  >
            <treeselect
              style="width:250px;"
              :options="typeTree"
              placeholder="请选择产品类别"
              :default-expand-level="10"
              v-model="productTypeSelect"
            />
          </el-form-item>
          <el-form-item label="产品名:">
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌:" >
            <el-select style="width:250px" placeholder="请选择产品品牌" v-model="brandSelect">
              <el-option :key="item.value" :value="item.value" :label="item.name" v-for="item in brandSelectList" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号:">
            <el-input v-model="codeSelect" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="在售状态:" >
            <el-select v-model="saleStatusSelect"  style="width:250px">
              <el-option
                v-for="item in saleStatusSelectList"
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
              label="商品编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名"
              width="300">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="商品类别"
              width="140">
            </el-table-column>
            <el-table-column
              prop="brandId"
              label="品牌"
              width="200">
              <template slot-scope="scope">
                <span v-for="item in brandSelectList" v-if="scope.row.brandId==item.value">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="型号"
              width="140">
            </el-table-column>
            <el-table-column
              prop="duration"
              label="保修期"
              width="140">
            </el-table-column>
            <el-table-column
              prop="buyPrice"
              label="入库价格"
              width="150">
            </el-table-column>
            <el-table-column
              prop="salePrice"
              label="售价"
              width="150">
            </el-table-column>
            <el-table-column
              prop="wholesalePrice"
              label="批发价"
              width="150">
            </el-table-column>
            <el-table-column
              prop="saleStatus"
              label="在售状态"
              width="150">
              <template slot-scope="scope">
                <span v-for="item in saleStatusSelectList" v-if="scope.row.saleStatus==item.value">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"  width="120">
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
      <el-dialog title="新增" :visible.sync="isAdd" width="60%">
        <el-form label-position="right" label-width="100px" :inline="true">
          <el-form-item label="商品名:">
            <el-input v-model="productItem.name" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="商品类别:"  >
              <treeselect
                style="width:250px;"
                :options="typeTree"
                @select="selectProductType"
                placeholder="请选择产品类别"
                :default-expand-level="10"
                v-model="productItem.type"
              />
          </el-form-item>
          <el-form-item label="品牌:"  >
            <el-select style="width:250px" placeholder="请选择产品品牌" v-model="productItem.brandId">
              <el-option :key="item.value" :value="item.value" :label="item.name" v-for="item in brandSelectList" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号:"  >
            <el-input v-model="productItem.code" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="重量(kg):"  >
            <el-input v-model="productItem.weight" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="产地:"  >
            <el-input v-model="productItem.original" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="保修期(月):"  >
            <el-input v-model="productItem.duration" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="售价:"  >
            <el-input v-model="productItem.salePrice" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="批发价:"  >
            <el-input v-model="productItem.wholesalePrice" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="在售状态:"  >
            <el-select style="width:250px" v-model="productItem.saleStatus">
              <el-option :key="item.value" :value="item.value" :label="item.name"  v-for="item in saleStatusSelectList"></el-option>
            </el-select>
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
       nameSelect:null,
       brandSelect:null,
       saleStatusSelect:null,
       codeSelect:null,
       buyDateSelect:null,
       deliveryDateSelect:null,
       payStatus:null,
       serviceStatus:null,
       isAdd:false,
       productItem:{},
       products:[{id:null,quantity:null,price:null}],
       payStatusSelectList:[{'id':'1','name':'已结'}],
       serviceStatusSelectList:[{'id':'1','name':'未配送'}],
       productTypeSelectList:[],
       brandSelectList:[],
       saleStatusSelectList:[],
       typeTree:[],
       tableData:[]
     }
   },
    created(){
     let _this = this
     this.findTypeTree()
     this.initTable()
      this.findDic("product","saleStatus",function(res){
        _this.saleStatusSelectList = res
      })
      this.findDic("product","brand",function(res){
        _this.brandSelectList = res
      })
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/tradease/product/page',_this.qs.stringify({
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
      findTypeTree(){
        let _this = this
        _this.$http.post('/tradease/productModule/tree'
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
      selectProductType(node){
        this.productItem.typeName = node.label
      },
      search(){

      },
      clearSearch(){

      },
      toEdit(row){
        this.isAdd = true
        this.productItem = row
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
        let param = this.productItem
        if(param.id){
          _this.$http.post('/tradease/product/update',_this.qs.stringify(
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
          _this.$http.post('/tradease/product/insert',_this.qs.stringify(
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
