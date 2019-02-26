<template>
    <div id="producttype">
      <el-card style="height: 900px;margin: 10px;overflow: auto">
        <button type="button" class="el-button el-button--primary" @click="toAdd"><span>新增</span></button>
        <button  type="button" class="el-button el-button--success" @click="toDelete"><span>删除</span></button>
        <div style="margin: 10px">
          <treeTable
            :data="tableData"
            :columns="header"
            :show-header="true"
            :expand-type="false"
          ></treeTable>
        </div>
      </el-card>
      <el-dialog title="新增" :visible.sync="isAdd" width="30%">
        <el-form label-position="right" label-width="80px" >
          <el-form-item label="商品类别:">
            <el-input v-model="moduleItem.name" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="父节点:">
            <treeselect
              style="width:100%;"
              :options="typeTree"
              placeholder="请选择父类型"
              :default-expand-level="10"
              v-model="moduleItem.pid"
            />
          </el-form-item>
          <el-form-item label="描述:">
            <el-input v-model="moduleItem.remark" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAdd = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import treeTable from 'vue-table-with-tree-grid'
  export default {
    components:{
      treeTable
    },
    data(){
      return {
        tableData:[],
        isAdd:false,
        moduleItem:{},
        typeTree:[],
        header:[
          {
            label:'商品类型',
            prop:'name',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'类型级别',
            prop:'level',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'描述信息',
            prop:'remark',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'操作',
            prop:'oper',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          }
        ]
      }
    },
    created(){
      let _this = this
      this.initTable()
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/productModule/tree'
        ).then(function(res){
          if(res.data.code == 0){
            _this.tableData = res.data.data
            _this.typeTree = res.data.data
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }

        })
      },
      transferData(){

      },
      toAdd(){
        this.isAdd = true
      },
      toDelete(){

      },
      addSubmit(){
        let _this = this
        let param = this.moduleItem
        _this.$http.post('/productModule/insert',_this.qs.stringify(
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
