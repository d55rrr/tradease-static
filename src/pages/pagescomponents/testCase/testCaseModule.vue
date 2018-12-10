<template>
    <div id="testcasemodule">
      <el-card class="box-card" style="height: 80vh">
        <el-row style="">
          <el-col :span="7">
            <el-row>
              <el-col :span="24" style="height: 12px">
                <el-button type="primary" style="margin-left:25px;margin-top: 15px" @click="addNode" icon="el-icon-circle-plus-outline">新增</el-button>
                <el-button type="primary"  @click="saveNode" icon="el-icon-circle-check-outline">保存</el-button>
                <el-button type="primary"  @click="deleteNode" icon="el-icon-delete">删除</el-button>
              </el-col>
            </el-row>
            <div style="width: 100%;height:78vh">
              <div style="display:flex;align-items: center;width:100%;border-bottom: 1px solid #c0c4cc;min-height: 100px;margin-left: 20px">
                <div>
                  <el-form  label-width="50px" style="height: 40px;width: 300px" >
                    <el-form-item label="产品:">
                      <el-select  placeholder="请选择活动区域" style="width: 100%"  @change="findModuleTree"  v-model="productSelect">
                        <el-option v-for="product in productSelectList" :key="product.id" :label="product.name" :value="product.id" ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div style="margin:20px">
                <el-tree
                  :data="moduleTree"
                   node-key="id"
                  :expand-on-click-node="false"
                  :highlight-current="true"
                  :default-expand-all="true"
                  @node-click="handleNodeClick"
                  empty-text="请选择产品后查看模块内容"
                ></el-tree>
              </div>
            </div>
          </el-col>
          <el-col :span="17">
            <div style="height: 70vh;border-left:1px solid #c0c4cc;margin-left:5px;margin: 20px">
              <br><br><br>
              <el-form label-position="right" label-width="150px" style="width: 55%;margin-left: 20%"  >
                <el-form-item label="上级模块:">
                  <treeselect
                    placeholder="请选择上级模块"
                    :options="moduleTree"
                    :default-expand-level="10"
                    v-model="currentObj.pid"
                    :no-children-text = "''"
                    style="width: 100%"
                  ></treeselect>
                </el-form-item>
                <el-form-item label="模块名称:" >
                  <el-input style="width: 100%" v-model="currentObj.name"  placeholder="请填写模块名"></el-input>
                </el-form-item>
                <el-form-item label="模块负责人:">
                  <el-select
                    filterable
                    style="width: 100%;"
                    v-model="currentObj.managerId"
                    remote
                    reserve-keyword
                    placeholder="请输入姓名"
                    :remote-method="remoteNameSearch"
                    :clearable="true"
                  >
                    <el-option
                      v-for="user in users"
                      :key="user.id"
                      :label="user.realnameWithDeptName"
                      :value="user.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-card>

    </div>
</template>

<script>
  export default {
    data(){
      return{
        productSelectList:[],
        productSelect:null,
        moduleTree:[],
        currentObj:{name:''},
        users:[]
      }
    },
    created(){
      this.findProductList()
    },
    mounted(){

    },
    watch:{
      $router(to,from){
      }
    },
    methods:{
      findProductList(){
        let _this = this
        _this.$http.post('/dev/product/getProductSelect.json').then(function(res){
          if(res.data.resStatus == 1000){
            _this.productSelectList = res.data.resMsg
          }else{
            console.log("产品列表加载失败！")
          }

        })
      },
      findModuleTree(){
        let _this = this
        _this.$http.post("/dev/testcasemodule/gettree.json",this.qs.stringify({productId:this.productSelect})).then(function (res) {
          if(res.data.resStatus == 1000){
            let parent = {}
            parent.label = '父节点'
            parent.id = 0
            parent.children = []
            if(_this.productSelect&&_this.productSelectList.length){
              _this.productSelectList.forEach(product=>{
                if(_this.productSelect==product.id){
                  parent.label = product.name
                  parent.id = 0
                }
              })
            }
            parent.children = res.data.resMsg
            _this.moduleTree = []
            _this.moduleTree.push(parent)
          }else{
            console.log("模块树加载失败！")
          }

        })
      },
      handleNodeClick(obj,node,component){
        if(obj.id==0){
          this.currentObj = {}
          this.currentObj.id = 0
          return
        }
        let temp = {}
        temp.id = obj.managerId
        temp.realnameWithDeptName = obj.manager
        this.currentObj = obj
        if(!this.users.length){
          this.users.push(temp)
        }else{
          if(!obj.managerId){
            return
          }
          for(let i= 0;i<this.users.length;i++){
            if(this.users[i].id == temp.id){
              return;
            }
          }
          this.users.push(temp)

        }
        alert(JSON.stringify(obj))
      },
      remoteNameSearch(query){
        let _this = this
        if(query!==''){
          _this.$http.post('/user/getUserList.json', _this.qs.stringify({realname:query}))
            .then(function (res) {
              if (res.data.resStatus == 1000) {
                _this.users = res.data.resMsg
              } else {
                _this.$notify.error({
                  title: '错误',
                  message: res.data.resMsg
                });
              }

            })
        }

      },
      addNode(){
        this.currentObj = {}
      },
      saveNode(){
        let _this = this
        if(this.currentObj.managerId){
          this.users.forEach(user=>{
            if(user.id==_this.currentObj.managerId){
              _this.currentObj.manager = user.realnameWithDeptName
            }
          })
        }
        if(this.moduleTree.length>0&&this.moduleTree[0].productId){
          this.currentObj.productId = this.moduleTree[0].productId
        }else if(this.productSelect){
          this.currentObj.productId = this.productSelect
        }else{
          _this.$notify.info({
            title: '消息',
            message:'请选择产品'
          });
          return
        }
       if(this.currentObj.id){
         this.editSubmit()
       }else{
         this.addSubmit()
       }
      },
      addSubmit(){
        if(this.currentObj.id == 0){
          this.$notify.info({
            title: '消息',
            message: '不能保存此节点'
          });
          return
        }
        let _this = this
        _this.$http.post("/dev/testcasemodule/save.json",this.qs.stringify(this.currentObj)).then(function (res) {
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '添加成功',
              type: 'success'
            });
            _this.findModuleTree()
            _this.currentObj = {}
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }

        })
      },
      editSubmit(){
        let _this = this
        alert(JSON.stringify(this.currentObj))
        _this.$http.post("/dev/testcasemodule/update.json",this.qs.stringify(this.currentObj)).then(function (res) {
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '修改成功',
              type: 'success'
            });
            _this.findModuleTree()
            _this.currentObj = {}
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }

        })
      },
      deleteNode(){
        let _this = this
        if(!this.currentObj.id){
          _this.$notify.info({
            title:'消息',
            message:'请选择需要删除的节点'
          })
          return
        }
        this.$confirm('确认删除吗？').then(function(){
          _this.$http.post("/dev/testcasemodule/delete.json",_this.qs.stringify({id:_this.currentObj.id})).then(function (res) {
            if(res.data.resStatus == 1000){
              _this.$notify({
                title:'删除成功',
                type: 'success'
              });
              _this.findModuleTree()
              _this.currentObj = {}
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
