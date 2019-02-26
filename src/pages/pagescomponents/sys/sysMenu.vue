<template>
    <div id="sysMenu">
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
          <el-form-item label="菜单名:">
            <el-input v-model="menuItem.name" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="父节点:">
            <el-input v-model="menuItem.pid" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="路径:">
            <el-input v-model="menuItem.url" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <el-input v-model="menuItem.type" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="序号:">
            <el-input v-model="menuItem.orderNum" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="图标:">
            <el-input v-model="menuItem.icon" placeholder="请选择"  style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="叶子节点:">
            <el-input v-model="menuItem.isEnd" placeholder="请选择"  style="width:100%">
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
        menuItem:{},
        header:[
          {
            label:'菜单名',
            prop:'name',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'路径',
            prop:'url',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'类型',
            prop:'type',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'序号',
            prop:'orderNum',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'子节点',
            prop:'isEnd',
            headerAlign:'center',
            align:'center',
            minWidth:'100px',
          },
          {
            label:'图标',
            prop:'icon',
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
      this.initTable()
    },
    methods:{
      initTable(){
        let _this = this
        _this.$http.post('/system/menu/menuTree'
        ).then(function(res){
          if(res.data.code == 0){
           _this.tableData = res.data.data
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
        let param = this.menuItem
        _this.$http.post('/system/menu/add',_this.qs.stringify(
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
