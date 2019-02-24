<template>
    <div id="tobusiness">
      <el-card style="min-height: 900px;margin: 10px">
        <el-form ref="form"  label-width="150px" :inline="true">
          <el-form-item label="客户名:"  >
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="客户等级:">
            <el-select style="width:250px" placeholder="请选择产品品牌" v-model="brandSelect">
              <el-option :key="item.value" :value="item.value" :label="item.name" v-for="item in customerLevelSelectList" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="法人:" >
            <el-input v-model="nameSelect" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="联系人:">
            <el-input v-model="codeSelect" style="width:250px"></el-input>
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
            @selection-change="selectChange"
          >
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="id"
              label="客户编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="客户名"
              width="300">
            </el-table-column>
            <el-table-column
              prop="level"
              label="客户等级"
              width="140">
              <template slot-scope="scope">
                <span v-for="item in customerLevelSelectList" v-if="scope.row.level==item.value">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="representative"
              label="客户法人"
              width="200">
            </el-table-column>
            <el-table-column
              prop="bank"
              label="开户银行"
              width="140">
              <template slot-scope="scope">
                <span v-for="item in bankSelectList" v-if="scope.row.bank==item.value">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="客户电话"
              width="140">
            </el-table-column>
            <el-table-column
              prop="accountAmount"
              label="预存剩余"
              width="150">
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
          <el-form-item label="客户名:">
            <el-input v-model="customerItem.name" placeholder="请选择"  style="width:250px">
            </el-input>
          </el-form-item>
          <el-form-item label="客户编号:"  >
            <el-input v-model="customerItem.code" placeholder="请选择"  style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="客户法人:"  >
            <el-input v-model="customerItem.representative" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="客户电话:"  >
            <el-input v-model="customerItem.phone" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="客户等级:"  >
            <el-select v-model="customerItem.level" style="width:250px">
              <el-option :key="item.value" :value="item.value" :label="item.name" v-for="item in customerLevelSelectList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户传真:"  >
            <el-input v-model="customerItem.fax" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="营业执照:"  >
            <el-input v-model="customerItem.licenseno" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="地税登记号:"  >
            <el-input v-model="customerItem.taxLocalNo" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="国税登记号:"  >
            <el-input v-model="customerItem.taxNationalNo" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="注册资金:"  >
            <el-input v-model="customerItem.registerFee" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="客户地址:"  >
            <el-input v-model="customerItem.address" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="开户银行:"  >
            <el-select v-model="customerItem.bank" style="width:250px" >
              <el-option :key="item.value" :value="item.value" :label="item.name" v-for="item in bankSelectList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行账号:"  >
            <el-input v-model="customerItem.bankAccount" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:"  >
            <el-input v-model="customerItem.remark" style="width:250px" placeholder="请选择产品名称" >
            </el-input>
          </el-form-item>
          <el-form-item label="客户状态:"  >
            <el-select style="width:250px" v-model="customerItem.status">
              <el-option :key="item.value" :value="item.value" :label="item.name"  v-for="item in customerStatusSelectList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
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
            v-model="contactsData"
            style="margin-bottom: 30px"
          >
          </editable>
        </div>
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
       nameSelect:null,
       brandSelect:null,
       saleStatusSelect:null,
       codeSelect:null,
       buyDateSelect:null,
       deliveryDateSelect:null,
       payStatus:null,
       serviceStatus:null,
       isAdd:false,
       customerItem:{},
       products:[{id:null,quantity:null,price:null}],
       payStatusSelectList:[{'id':'1','name':'已结'}],
       serviceStatusSelectList:[{'id':'1','name':'未配送'}],
       productTypeSelectList:[],
       customerLevelSelectList:[],
       customerStatusSelectList:[],
       bankSelectList:[],
       typeTree:[],
       tableData:[],
       contactsData:[],
       selected:[],
       headers:[
         {
           key:'name',
           name:'<span style="color:red">*</span>联系人名',
           type:'text',
         },
         {
           key:'sex',
           name:'<span style="color:red">*</span>性别',
           type:'select',
           selectList:[{'name':'男','value':1},{"name":'女','value':'2'}]

         },
         {
           key:'occupy',
           name:'<span style="color:red">*</span>职位',
           type:'text'
         },
         {
           key:'mphone',
           name:'<span style="color:red">*</span>手机',
           type:'text',
         },
         {
           key:'phone',
           name:'<span style="color:red">*</span>电话',
           type:'text',
         },
         {
           key:'remark',
           name:'<span style="color:red">*</span>备注',
           type:'text',
         },

       ],
     }
   },
    created(){
     let _this = this
     this.initTable()
      this.findDic("customer","level",function(res){
        _this.customerLevelSelectList = res
      })
      this.findDic("customer","bank",function(res){
        _this.bankSelectList = res
      })
      this.findDic("customer","status",function(res){
        _this.customerStatusSelectList = res
      })
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/tradease/customerb/page',_this.qs.stringify({
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
      toEdit(row){
        let _this = this
        this.isAdd = true
        this.isAdd = true
        this.contactsData = []
        _this.$http.post('/tradease/customerb/find',_this.qs.stringify({
          id:row.id
        })).then(function(res){
          if(res.data.code == 0){
            _this.customerItem = res.data.obj
            _this.contactsData = res.data.obj.contacts
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
        this.contactsData = []
        this.customerItem = {}
      },
      toDelete(){
        let _this = this
        if(!this.selected&&!this.selected.length){
          _this.$notify.info({
            title: '消息',
            message:"请选择要删除的行"
          });
          return
        }
        _this.$http.post('/tradease/customerb/delete',_this.qs.stringify({
            ids:this.selected.join(",")
        })).then(function(res){
          if(res.data.code == 0){
            _this.$notify.success({
              title: '删除成功',
            });
            _this.initTable()
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })

      },
      addSubmit(){
        let _this = this
        let param = this.customerItem
        param.contacts = this.contactsData
        if(param.id){
          _this.$http({
            url: '/tradease/customerb/update',
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
            url: '/tradease/customerb/insert',
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
      selectChange(selection){
        debugger
        let _this = this
        this.selected = []
        selection.forEach(item=>{
          _this.selected.push(item.id)
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
