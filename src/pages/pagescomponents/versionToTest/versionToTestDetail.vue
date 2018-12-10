<template>
  <div id="versionToTestDetail" >
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="font-size: x-large">{{versionItem.summary}}</span>
      </div>
      <div>
        <el-row type="flex" justify="space-around">
          <el-col :span="15" style="border-right: 1px solid #c0c4cc;margin-right: 20px">
            <div style="margin-bottom: 10px">
              <el-row>
                <el-col :span="10"><div style="border-bottom:1px solid #c0c4cc;width: 150%" class="process-title">&nbsp;基本信息</div></el-col>
                <el-col :span="8">&nbsp;</el-col>
                <el-col :span="6">
                  <div>
                    <el-button type="primary " @click="toUpdate=true" v-show="vctEditPrivilege">编辑</el-button>
                    <el-button type="primary " @click="toList">回列表</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;提测版本号:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.version}}</div></el-col>
                <el-col :span="6"><div>当前状态:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.statusName}}<span style="margin-left:10px;color:#409eff;cursor: pointer" @click="workFlowOverview">(查看工作流)</span></div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;版本测试目的:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.targetName}}</div></el-col>
                <el-col :span="6"><div>优先级:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.priorityName}}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;版本计划属性:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.plannedName}}</div></el-col>
                <el-col :span="6"><div>所属产品:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.productName}}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;所属项目:</div></el-col>
                <el-col :span="18"><div>&nbsp;{{versionItem.projectId}}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;版本存储路径:</div></el-col>
                <el-col :span="18"><div>&nbsp;{{versionItem.storagePath}}</div></el-col>
              </el-row>
            </div>

          <div style="margin-bottom: 10px">
            <el-row>
              <el-col :span="10"><div style="border-bottom:1px solid #c0c4cc;width: 150%" class="process-title">&nbsp;描述</div></el-col>
              <el-col :span="4">&nbsp;</el-col>
              <el-col :span="10">
                <div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><div style="min-height:100px;">&nbsp;&nbsp;{{versionItem.description}}</div></el-col>
            </el-row>
          </div>
          <div style="margin-bottom: 10px">
            <el-row>
              <el-col :span="10"><div style="border-bottom:1px solid #c0c4cc;width: 150%" class="process-title">&nbsp;附件</div></el-col>
              <el-col :span="4">&nbsp;</el-col>
              <el-col :span="10">
                <div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="height:125px;border:1px outset #c0c4cc;border-radius:0.5em;margin-right:100px;overflow-y:scroll">
                  <!--文件展示-->
                  <div v-for="filedata in fileDataList" style="margin: 5px;float:left" >
                    <template v-if="filedata.extName=='jpg'||filedata.extName=='png'">
                      <img :src="filedata.src"   style="width: 100px;height: 100px;border: 1px solid #c0c4cc;border-radius:5px;margin:5px" @click="viewImg(filedata)" @mouseenter="isMouseEnter=true" @mouseleave="isMouseEnter=false" v-bind:class="{mouseEnter:isMouseEnter}"/>
                      <div style="width: 100px;text-align: center;word-break:break-all">{{filedata.originalName}}</div>
                      <div v-if="isMouseEnter" style="position: relative;bottom: 105px;left:30px;width: 50px"  @click="viewImg(filedata)" @mouseenter="isMouseEnter=true" @mouseleave="isMouseEnter=false" >点击查看</div>
                    </template>
                    <template v-else>
                      <img src="../../../assets/img/image_file.png"   style="width: 100px;height: 100px;border-radius:5px;margin:5px" @click="downloadFile(filedata)"  @mouseenter="isMouseEnter=true" @mouseleave="isMouseEnter=false"/>
                      <div style="width: 100px;text-align: center;word-break:break-all">{{filedata.originalName}}</div>
                      <div v-if="isMouseEnter" style="position: relative;bottom: 125px;left:30px;width: 50px"  @click="downloadFile(filedata)" @mouseenter="isMouseEnter=true" @mouseleave="isMouseEnter=false" >点击下载</div>
                    </template>
                  </div>

                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">&nbsp;</el-col>
              <el-col :span="6">

               <!-- 流程按钮循环-->
                <el-button type="primary" v-for="menu in processMenus" :key="menu.value" @click="handleUp(menu)">{{menu.name}}</el-button>


              </el-col>
            </el-row>
          </div>
          </el-col>

          <el-col :span="11">
            <div style="margin-bottom: 10px" >
              <el-row>
                <el-col :span="10"><div style="border-bottom:1px solid #c0c4cc;width: 150%" class="process-title">&nbsp;涉及人员</div></el-col>
                <el-col :span="8">&nbsp;</el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;当前处理人:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.transactor}}</div></el-col>
                <el-col :span="12"><div><el-button type="primary" @click="assignTask" v-show="vctAssignPrivilege">指派</el-button></div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;提测人:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.testSponsor}}</div></el-col>
                <el-col :span="12"><div></div></el-col>
              </el-row>
            </div>

            <div style="margin-bottom: 10px">
              <el-row>
                <el-col :span="10"><div style="border-bottom:1px solid #c0c4cc;width: 150%" class="process-title">&nbsp;日期</div></el-col>
                <el-col :span="4">&nbsp;</el-col>
                <el-col :span="10">
                  <div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;创建日期:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.transferTestTime}}</div></el-col>
                <el-col :span="12"><div></div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;最近更新:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.updateTime}}</div></el-col>
                <el-col :span="12"><div></div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div>&nbsp;&nbsp;计划交付时间:</div></el-col>
                <el-col :span="6"><div>&nbsp;{{versionItem.planReleaseTime}}</div></el-col>
                <el-col :span="12"><div></div></el-col>
              </el-row>
            </div>
            <div style="margin-bottom: 10px">
              <el-row>
                <el-col :span="20"><div>&nbsp;</div></el-col>
                <el-col :span="4"><div><el-button type="primary" style="position:absolute;bottom:-30px;z-index: 10" @click="commentaryAdd" v-show="versionCommentaryAddPrivilege">添加</el-button></div></el-col>
              </el-row>
              <el-tabs v-model="commentaryTab" type="card" >
                <el-tab-pane label="注释" name="first" style="height:245px;overflow: auto">
                  <template v-for="commentaryObj in commentaryObjList" >
                    <el-card shadow="hover">
                      {{commentaryObj.creator}}添加了评论-{{commentaryObj.createTime}}<div style="display: inline;float:right"><span style="color:#409eff;margin-right:10px;cursor: pointer" @click="commentaryEidt(commentaryObj)">编辑</span><span style="color:#409eff;margin-right:10px;cursor: pointer" @click="commentaryDelete(commentaryObj.id)">删除</span></div><br>
                      {{commentaryObj.commentary}}
                    </el-card>
                  </template>
                </el-tab-pane>
                <el-tab-pane label="改动记录" name="second"  style="height:245px;overflow: auto">
                  <template v-for="history in taskHistories" >
                    <el-card shadow="hover">
                      {{history.userName?history.userName:'待指派'}}-{{history.taskName}}-{{history.startTime?history.startTime:history.endTime}}<br>
                      <el-row style="margin-top:5px">
                        <el-col :span="3">操作:</el-col>
                        <el-col :span="9">&nbsp;{{history.consentName}}</el-col>
                        <el-col :span="3">备注:</el-col>
                        <el-col :span="9">&nbsp;{{history.comment}}</el-col>
                      </el-row>
                      <el-row style="margin-top:-20px">
                        <el-col :span="3">开始时间:</el-col>
                        <el-col :span="9">&nbsp;{{history.startTime}}</el-col>
                        <el-col :span="3">结束时间:</el-col>
                        <el-col :span="9">&nbsp;{{history.endTime}}</el-col>
                      </el-row>
                    </el-card>
                  </template>
                </el-tab-pane>

              </el-tabs>
            </div>
          </el-col>

        </el-row>
      </div>
    </el-card>
    <!--注释编写弹框-->
    <el-dialog title="注释" :visible.sync="commented" width="30%">
      <el-input
        type="textarea" v-model="commentary.commentary"
        :autosize="{ minRows: 3, maxRows: 4}"
        placeholder="请输入内容"
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commented = false">取 消</el-button>
        <el-button type="primary" @click="saveCommentary">确 定</el-button>
      </div>

    </el-dialog>
    <el-dialog title="流程" :visible.sync="toProcess" width="30%">
      <el-input
        type="textarea" v-model="commentary.commentary"
        :autosize="{ minRows: 3, maxRows: 4}"
        placeholder="请输入内容"
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commented = false">取 消</el-button>
        <el-button type="primary" @click="saveCommentary">确 定</el-button>
      </div>

    </el-dialog>
    <!--指派流程弹框-->
    <el-dialog title="指派" :visible.sync="toAssign" width="30%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="经办人">
          <el-select
            filterable
           style="width: 100%;"
            v-model="userId"
            remote
            reserve-keyword
            placeholder="请输入姓名"
            :remote-method="remoteNameSearch"
            >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.realnameWithDeptName"
              :value="user.id">
            </el-option>
          </el-select>
          <br>
          <span style="color:#409eff;cursor: pointer" @click="assignMe">指派给我</span>
        </el-form-item>

        <el-form-item label="备注" style="margin-top: -30px">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入内容"
            v-model="remark"
          >
          </el-input>
        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="toAssign = false">取 消</el-button>
        <el-button type="primary" @click="assignSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--流程图弹框-->
    <el-dialog title="版本转测试流程图" :visible.sync="workFlowShow" width="50%">
       <Versiontotestworkflow  :status="testStatus"/>
    </el-dialog>

    <!--流程处理弹框-->
    <el-dialog :title="processTitle" :visible.sync="toHandle" width="30%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="备注" >
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入内容"
            v-model="remark"
          >
          </el-input>
        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="toHandle = false">取 消</el-button>
        <el-button type="primary" @click="handleTask">确 定</el-button>
      </div>
    </el-dialog>
   <!-- 提测版本弹框-->
    <el-dialog title="提测版本" :visible.sync="toUpdate" width="30%">
      <el-form ref="testform" :model="versionItem" label-width="120px"  :rules="rules" >
        <el-form-item label="概要:" prop="summary">
          <el-input v-model="versionItem.summary"></el-input>
        </el-form-item>
        <el-form-item label="所属项目:" prop="projectId">
          <el-select v-model="versionItem.projectId" style="width:100%">
            <el-option
              v-for="item in projectSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属产品:" prop="productId">
          <el-select v-model="versionItem.productId" style="width:100%">
            <el-option
              v-for="item in productSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本计划属性:" prop="planned">
          <el-select v-model="versionItem.planned" style="width:100%">
            <el-option
              v-for="item in planSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提测版本号:" prop="version">
          <el-input v-model="versionItem.version"></el-input>
        </el-form-item>
        <el-form-item label="优先级:" prop="priority">
          <el-select v-model="versionItem.priority" style="width:100%">
            <el-option
              v-for="item in versionPrioritySelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本转测试目的:" prop="target">
          <el-select v-model="versionItem.target" style="width:100%">
            <el-option
              v-for="item in targetSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划交付时间:" prop="planReleaseTime">
          <el-date-picker
            v-model="versionItem.planReleaseTime"
            type="date"
            style="width:100%"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="版本存储路径:" prop="storagePath">
          <el-input
            type="textarea" v-model="versionItem.storagePath"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="附件:">
          <span style="color: #0b3a58">添加附件</span>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input
            type="textarea" v-model="versionItem.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateVersion('testform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="currentFile.originalName" :visible.sync="toViewImg" width="50%">
      <img :src="currentFile.src" style="width: 100%;height: 100%"/>
    </el-dialog>
  </div>
</template>

<script>
  import Versiontotestworkflow from './versionToTestWorkflow'
  export default {
    components: {
      Versiontotestworkflow
    },
    created() {
      let _this = this
      this.privilegesMenuFn()
      _this.dicSelect('dev','versionTestStatus',function(data){
        _this.testStatusSelectList = data;
      });
      _this.dicSelect('dev','versionTarget',function(data){
        _this.targetSelectList = data;
      });
      _this.dicSelect('dev','versionPlanned',function(data){
        _this.planSelectList = data;
      });
      _this.dicSelect('dev','versionPriority',function(data){
        _this.versionPrioritySelectList = data;
      });
      this.versionDetail()
      this.productList()
      this.projectList()
    },
    mounted() {},
    data() {
      return {
        taskHistories:[],
        commented:false,
        commentary:{id:null,commentary:null,versionId:null},
        commentaryObjList:[],
        commentaryTab:'first',
        //流程处理弹出控制
        toProcess:false,
        //指派按钮弹出控制
        toAssign:false,
        //工作流图弹出控制
        workFlowShow:false,
        //控制流程处理弹框
        toHandle:false,
        //修改弹框
        toUpdate:false,
        task:[],
        userId:null,
        userName:'',
        remark:'',
        users:[],
        processMenus:[],
        processTitle:'',
        consent:null,
        //关系显示的数据字典
        productSelectList:[],
        testStatusSelectList:[],
        targetSelectList:[],
        planSelectList:[],
        userSelectList:[],
        versionPrioritySelectList:[],
        projectSelectList:[],
        productSelectList:[],
        testStatus:null,
        versionItem:{},
        fileDataList:[],
        toViewImg:false,
        currentFile:{},
        isMouseEnter:false,
        rules:{
          summary:[{required:true, message: '请输入名称', trigger: 'blur'},{max:100,message:'长度不大于100字符',trigger:'blur'}],
          projectId:[{required:true,message:'请选择项目',trigger:'change'}],
          productId:[{required:true,message:'请选择产品',trigger:'change'}],
          planned:[{required:true,message:'请选择计划属性',trigger:'change'}],
          version:[{required:true,message:'请输入版本号',trigger:'blur'}],
          priority:[{required:true,message:'请选择优先级',trigger:'change'}],
          target:[{required:true,message:'请选择转测目的',trigger:'change'}],
          planReleaseTime:[{required:true,message:'请选择转测时间',trigger:'change'}],
          storagePath:[{required:true,message:'请输入存储路径',trigger:'blur'}],
          description:[{required:true,message:'请输入描述信息',trigger:'blur'}]
        },
        vctEditPrivilege:false,
        vctAssignPrivilege:false,
        versionCommentaryAddPrivilege:false
      }
    },
    watch:{
      $route (to, from) {
        if (to.path == '/versiontotestdetail') {
          this.versionDetail()
        }
      }
    },
    methods: {
      //按钮权限判断
      privilegesMenuFn () {
        debugger
        let _this = this
        _this.vctEditPrivilege = false
        _this.vctAssignPrivilege = false
        _this.versionCommentaryAddPrivilege = false
        _this.privilegesMenuArr = []
        // console.log(localStorage.getItem('privilegesMenu'))
        let privilegesMenu = JSON.parse(sessionStorage.getItem('privilegesMenu'))
        // console.log(privilegesMenu)
        privilegesMenu.map(val => {
          _this.privilegesMenuArr.push(val.priKey)
        })
        // console.log(_this.privilegesMenuArr)
        for (let i = 0; i < _this.privilegesMenuArr.length; i++) {
          if (_this.privilegesMenuArr[i] == 'versioncommentarySave') {
            _this.versionCommentaryAddPrivilege = true
          }
          if (_this.privilegesMenuArr[i] == 'vctupate1') {
            _this.vctEditPrivilege = true
          }
          if (_this.privilegesMenuArr[i] == 'vctassign') {
            _this.vctAssignPrivilege = true
          }
        }
      },
      listMore(n) {},
      toList(){
        this.$router.push({
          name: 'versiontotestlist',
          path: '/versiontotestlist',
        })
      },
      versionDetail(){
        let _this = this;
        let businessId = this.$route.query.id
        if(businessId){
          _this.$http.post('/dev/versionconverttest/info.json',this.qs.stringify({id:businessId})).then(function(res){
            if(res.data.resStatus == 1000){
              _this.versionItem = res.data.resMsg
              if(_this.versionItem.testStatus!=undefined){
                _this.testStatus = _this.versionItem.testStatus
                _this.testStatusSelectList.forEach(function(status){
                  if(_this.versionItem.testStatus == status.value){
                    _this.versionItem.statusName = status.name;
                  }
                })
              }
              if(_this.versionItem.target!=undefined){
                _this.targetSelectList.forEach(function(target){
                  if(_this.versionItem.target == target.value){
                    _this.versionItem.targetName = target.name;
                  }
                })
              }
              if(_this.versionItem.planned!=undefined){
                _this.planSelectList.forEach(function(plan){
                  if(_this.versionItem.planned == plan.value){
                    _this.versionItem.plannedName = plan.name;
                  }
                })
              }
              if(_this.versionItem.priority!=undefined){
                _this.versionPrioritySelectList.forEach(function(priority){
                  if(_this.versionItem.priority == priority.value){
                    _this.versionItem.priorityName = priority.name;
                  }
                })
              }
              if(_this.versionItem.productId!=undefined){
                _this.productSelectList.forEach(function(product){
                  if(_this.versionItem.productId == product.id){
                    _this.versionItem.productName = product.name
                  }
                })
              }
              if(_this.versionItem.attachmentId){
                debugger;
                _this.$http.post('/attachment/list.json',_this.qs.stringify({ids:_this.versionItem.attachmentId})).then(function(res){
                  debugger
                  if(res.data.resStatus == 1000){
                    _this.fileDataList = res.data.resMsg
                    if(_this.fileDataList.length){
                      _this.fileDataList.forEach(function (fileData) {
                        fileData.src = 'http://localhost:8080/attachment/view.json?groupName=group1&id='+fileData.id
                      })
                    }
                  }else{
                    _this.$notify.error({
                      title: '错误',
                      message: res.data.resMsg
                    });
                  }
                })
              }

            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }
          })
          _this.$http.post('/dev/versionconverttestprocess/taskhistory.json',this.qs.stringify({businessObjId:businessId})).then(function(res){
            if(res.data.resStatus == 1000){
              _this.taskHistories = res.data.resMsg
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }
          })
          _this.commentaryList(businessId)
          _this.currentTask(businessId)
          _this.userTask(businessId)
        }


      },
      projectList(){
        var _this = this
        _this.$http.post('/dev/project/datas.json').then(function(res){
          if(res.data.resStatus == 1000){
            _this.projectSelectList = res.data.resMsg
          }else{
            console.log("项目列表加载失败！")
          }
        })
      },
      productList(){
        let _this = this
        _this.$http.get('/dev/product/getProductSelect.json').then(function(res){
          if(res.data.resStatus == 1000){
            _this.productSelectList = res.data.resMsg
          }else{
            console.log("产品列表加载失败！")
          }

        })
      },
      commentaryList(id){
        let _this = this
        _this.$http.post('/dev/versioncommentary/list.json',this.qs.stringify({versionId:id})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.commentaryObjList = res.data.resMsg
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      commentaryAdd(){
        this.commentary = {id:null,commentary:null,versionId:null}
        this.commented = true

      },
      commentaryEidt(commentaryObj){
        this.commented = true
        this.commentary.id = commentaryObj.id
        this.commentary.commentary=commentaryObj.commentary
      },
      commentaryDelete(id){
        let _this = this
        this.$confirm('确认删除吗？').then(function(){
          _this.$http.post('/dev/versioncommentary/delete.json',_this.qs.stringify({versionId:id})).then(function(res){
            if(res.data.resStatus == 1000){
              _this.$notify({
                title: '删除成功',
                type: 'success'
              });
            }else{
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }
            _this.commentaryList(_this.versionItem.id)
          })
        })

      },
      saveCommentary(){
        let _this = this;
        let url = '/dev/versioncommentary/update.json'
        if(!_this.commentary.id){
          url = '/dev/versioncommentary/save.json'
        }
        _this.commentary.versionId = _this.versionItem.id
        _this.$http.post(url,this.qs.stringify(_this.commentary)).then(function(res){
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '更新成功',
              type: 'success'
            });
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });

          }
          _this.commentary = {id:null,commentary:null,versionId:null}
          _this.commented = false
          _this.commentaryList(_this.versionItem.id)
        })
      },
      currentTask(id){
        let _this = this
        _this.$http.post('/dev/versionconverttestprocess/currenttask.json',_this.qs.stringify({businessObjId:id})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.task = res.data.resMsg
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      userTask(id){
        let _this = this
        _this.$http.post('/dev/versionconverttestprocess/usertask.json',_this.qs.stringify({businessObjId:id})).then(function(res){
          if(res.data.resStatus == 1000){
            if(res.data.resMsg[0]!=undefined){
              _this.processMenus = res.data.resMsg[0].menus
            }
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      assignTask(){
        this.toAssign = true
      },
      assignSubmit(){
        let _this = this
        _this.$http.post('/dev/versionconverttestprocess/assign.json',_this.qs.stringify({taskId:_this.task[0].taskId,userId:_this.userId,comment:_this.remark})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '指派成功',
              type: 'success'
            });
            _this.toAssign = false
            _this.versionDetail()
            _this.processMenus = []
            _this.userTask(_this.versionItem.id)
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
      },
      workFlowOverview(){
        this.workFlowShow = true

      },
      assignMe(){
        let _this = this
        if(!_this.task[0].taskId){
          _this.$notify.error({
            title: '错误',
            message: '指派出错'
          });
          return;
        }
        _this.$http.post('/dev/versionconverttestprocess/assign.json',_this.qs.stringify({taskId:_this.task[0].taskId,comment:_this.remark})).then(function(res){
          if(res.data.resStatus == 1000){
            _this.$notify({
              title: '指派成功',
              type: 'success'
            });
            _this.toAssign = false
            _this.versionDetail()
            _this.processMenus = []
            _this.userTask(_this.versionItem.id)
          }else{
            _this.$notify.error({
              title: '错误',
              message: res.data.resMsg
            });
          }
        })
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
      handleUp(menu){
        this.processTitle = menu.name
        this.toHandle = true
        this.consent = menu.value
        this.remark = ''

      },
      dicSelect(businessName,subjectName,callback){
        var _this = this;
        return _this.$http.post('/user/dicdata/getdics.json',_this.qs.stringify({businessName:businessName,subjectName:subjectName})).then(function(res){
          if(res.data.resStatus == 1000){
            callback(res.data.resMsg);
          }else{
            console.log("字典信息加载错误！")
          }
        })
      },
      handleTask(){
        let _this = this
        _this.$http.post('/dev/versionconverttestprocess/handleTask.json', _this.qs.stringify({taskId:_this.task[0].taskId,consent:_this.consent,comment:_this.remark}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '处理成功',
                type: 'success'
              });
              _this.versionDetail()
              _this.processMenus = []
              _this.userTask(_this.versionItem.id)
              _this.toHandle = false
            } else {
              _this.$notify.error({
                title: '错误',
                message: res.data.resMsg
              });
            }

          })
      },
      updateVersion(testform){
        let _this = this
        _this.$refs[testform].validate((valid) => {
          if (valid) {
            _this.$http.post('/dev/versionconverttest/update.json',_this.qs.stringify(_this.versionItem)).then(function(res){
              if(res.data.resStatus==1000){
                _this.$notify({
                  title: '修改成功',
                  type: 'success'
                });
                _this.toUpdate = false
                _this.versionDetail()
              }else{
                _this.$notify.error({
                  title: '错误',
                  message: res.data.resMsg
                });
              }
            })
          }else{
            return
          }
        })

      },
      viewImg(fileData){
        this.toViewImg = true
        this.currentFile = fileData
      },
      downloadFile(fileData){
        let _this = this
        _this.$http.get('/attachment/download.json?groupName=group1&id='+fileData.id).then(function(res){
          _this.download(res.data,fileData)
        })
      },
      download (data,fileData) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileData.originalName)
        document.body.appendChild(link)
        link.click()
      }


    }


  }
</script>

<style scoped>
  #versionToTestDetail .process-title{
    font-size: x-large;
  }
  #versionToTestDetail .mouseEnter{
  background:rgba(0,0,0,0.2);
  }
</style>
