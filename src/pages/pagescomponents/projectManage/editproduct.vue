<template>
  <div id="editproduct">
    <!--表单Mark弹层-->

    <el-dialog title="新增" :visible.sync="dialogMark" width="650px">
      <div class="tebleMark">
        <div class="tebleMark_con">
          <p class="inlineBlock">版本号：<i>*</i></p>
          <p>
            <el-input v-model="newinput1" placeholder="请输入版本号" @blur="isExist" ref="versionInput"></el-input>
          </p>
        </div>
        <div class="tebleMark_con">
          <p class="inlineBlock" >目的：<i>*</i></p>
          <p>
            <el-select  clearable @change="newinput1Fn($event)" v-model="newinput2" placeholder="请选择">
              <el-option
                v-for="item in targetArr"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con">
          <p  class="inlineBlock">负责人：<i>*</i></p>
          <p>
            <el-select  clearable @change="newinput2Fn($event)" multiple v-model="newinput3" placeholder="请选择">
              <el-option
                v-for="item in allUserlist"

                :key="item.id"
                :label="item.realnameWithDeptName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="tebleMark_con">
          <p  class="inlineBlock">发布时间：<i>*</i></p>
          <p>
            <el-date-picker
              v-model="newinput4"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </p>
        </div>
        <div class="tebleMark_con">
          <p>描述：</p>
          <p>
          <textarea v-model="newinput5" id="describeArr">
          </textarea>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRowTrue(0)">取 消</el-button>
          <el-button type="primary" @click="addRowTrue(1)">确 定</el-button>
        </span>
      </div>

    </el-dialog>

    <div class="editproduct_Con">
      <p class="departmentcon_left_btn">
        <button @click="saveProduct" type="button" class="el-button el-button--success"><span>保存</span></button>
        <button @click="backList" type="button" class="el-button el-button--warning"><span>回列表</span></button>
      </p>
      <el-tabs @tab-click="activeNumFn" type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-edit-outline"></i> 基础信息</span>
          <el-row>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">产品名称：<i>*</i></span>
                <el-input
                  placeholder="请输入工号"
                  v-model="name">
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">一级分类：<i>*</i></span>

                <el-select filterable clearable v-model="firstTypeValue" @change="firstTypeFn($event)" placeholder="请选择">
                  <el-option
                    v-for="item in firstTypeOpt"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>

              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">二级分类：<i>*</i></span>
                <el-select filterable clearable v-model="type"  placeholder="请选择">
                  <el-option
                    v-for="item in typeOpt"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>

              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">所属部门：<i>*</i></span>
                <treeselect
                  :options="deptOpt"
                  placeholder="请选择"
                  :default-expand-level="10"
                  :normalizer="normalizer"
                  v-model="deptId"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">状态：<i>*</i></span>
                <el-select filterable clearable @change="stageFn" v-model="stage" placeholder="请选择">
                  <el-option
                    v-for="item in stageOpt"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>

              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1 dateTime">首次上线时间：<i>*</i></span>
                <el-date-picker
                  v-model="firstreleaseTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">硬件研发负责人：<i v-if="mustList == firstTypeOpt[0].value|| mustList == firstTypeOpt[2].value">*</i></span>

                <el-select filterable clearable @change="dataFilterFn1($event)" v-model="hardwareRdLeader" placeholder="请选择">
                  <el-option
                    v-for="item in hardwareRdLeaderOpt"
                    :key="item.id"
                    :label="item.realnameWithDeptName"
                    :value="item.id">
                    {{item.realnameWithDeptName}}
                  </el-option>
                </el-select>

              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">软件研发负责人：<i v-if="mustList == firstTypeOpt[1].value|| mustList == firstTypeOpt[2].value">*</i></span>

                <el-select filterable clearable @change="dataFilterFn2($event)" v-model="softwareRdLeader" placeholder="请选择">
                  <el-option
                    v-for="item in softwareRdLeaderOpt"
                    :key="item.id"
                    :label="item.realnameWithDeptName"
                    :value="item.id">
                    {{item.realnameWithDeptName}}
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">测试负责人：<i>*</i></span>
                <el-select filterable clearable @change="dataFilterFn3($event)" v-model="testLeader" placeholder="请选择">
                  <el-option
                    v-for="item in testLeaderOpt"
                    :key="item.id"
                    :label="item.realnameWithDeptName"
                    :value="item.id">
                    {{item.realnameWithDeptName}}
                  </el-option>
                </el-select>

              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">硬件CCB裁决人：<i v-if="mustList == firstTypeOpt[0].value|| mustList == firstTypeOpt[2].value">*</i></span>
                <el-select filterable clearable @change="dataFilterFn4($event)" v-model="hardwareCcb" placeholder="请选择">
                  <el-option
                    v-for="item in hardwareCcbOpt"
                    :key="item.id"
                    :label="item.realnameWithDeptName"
                    :value="item.id">
                    {{item.realnameWithDeptName}}
                  </el-option>
                </el-select>

              </div>
            </el-col>
            <el-col :span="8">
              <div class="demo-input-suffix">
                <span class="inlineBlock inlineB1">软件CCB裁决人：<i v-if="mustList == firstTypeOpt[1].value || mustList == firstTypeOpt[2].value">*</i></span>
                <el-select filterable clearable @change="dataFilterFn5($event)" v-model="softwareCcb" placeholder="请选择">
                  <el-option
                    v-for="item in softwareCcbOpt"
                    :key="item.id"
                    :label="item.realnameWithDeptName"
                    :value="item.id">
                    {{item.realnameWithDeptName}}
                  </el-option>
                </el-select>
              </div>

            </el-col>
          </el-row>
          <el-row>
            <el-col class="productextarea" :span="16">
              <span class="inlineBlock inlineB1 desText">产品简介：</span>
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="description">
              </el-input>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 版本信息</span>
          <p class="departmentcon_left_btn">
            <button @click="addRow" type="button" class="el-button el-button--primary">
              <span>
                增行
              </span>
            </button>

            <button @click="delRow" type="button" class="el-button el-button--success"><span>删行</span></button>
          </p>
          <div class="easytable">

            <el-table
              ref="singleTable"
              highlight-current-row
              :data="versions"
              :row-class-name="tableRowClassName"
              @row-click="rowClick"
              @current-change="handleCurrentChange"
              style="width: 100%;min-height:200px;">
              <el-table-column
                type="index"
                label="序号"
                width="">
              </el-table-column>
              <el-table-column
                property="version"
                label="版本号"
                width="">
              </el-table-column>

              <el-table-column
                property="target"
                label="目的"
                width="">
                <template slot-scope="scope">
                  {{scope.row.target|targetName(targetArr)}}
                </template>
              </el-table-column>
              <el-table-column
                property="managerNames"
                label="负责人"
                width="">
              </el-table-column>
              <el-table-column
                property="releaseTime"
                label="发布时间"
                width="">
              </el-table-column>
              <el-table-column
                property="description"
                label="描述"
                width="">
              </el-table-column>
            </el-table>

          </div>
          <!--:multiple-sort="multipleSort"-->
          <!--:select-change="selectChange"-->
          <!--@on-custom-comp="customCompFunc"-->
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        name: '',
        //首次上线时间
        firstreleaseTime: '',
        firstTypeValue: null,
        // activeNum: '',
        firstTypeOpt: [{
          value: 'hardware',
          name: '纯硬件'
        }, {
          value: 'software',
          name: '纯软件'
        }, {
          value: 'hsware',
          name: '软硬件结合'
        }],
        type: null,
        typeOpt: [],
        deptId: null,
        deptOpt: [],
        stage: null,
        stageOpt: [],
        // 负责人列表
        allUserlist: '',

        testLeaderId: null,
        testLeader: '',
        testLeaderOpt: [],
        releaseTime: null,
        hardwareRdLeaderId: null,
        hardwareRdLeader: '',
        hardwareRdLeaderOpt: [],
        hardwareCcbId: null,
        hardwareCcb: '',
        hardwareCcbOpt: [],
        softwareRdLeaderId: null,
        softwareRdLeader: '',
        softwareRdLeaderOpt: [],
        softwareCcbId: null,
        softwareCcb: '',
        softwareCcbOpt: [],
        description: '',
        // 版本json串
        versionJson: [],
        //选中的行
        rowIndex: '',
        //版本table弹出层
        dialogMark: false,
        // 目的
        targetArr: [],

        // 提交信息的内容
        newinput1: '',
        newinput2: '',
        newinput3: [],
        newinput4: '',
        newinput5: '',
        newinput2Id: '',
        newinput3Id: '',
        newinput3Text: [],

        //表格排序
        multipleSort: '',
        versions: [],

        //必选星号 '1,2,3'
        mustList: ''
      }
    },
    watch: {
      $route (to, from) {
        let _this = this
        if (to.path == '/editproduct') {
          _this.addProduct()
          this.getStagesFromDic()
          this.getVersionTargetsFromDic()
          _this.getUserList()
        }
      }
    },
    created () {
      this.getStagesFromDic()
      this.getVersionTargetsFromDic()
      this.getUserList()

    },
    mounted () {

    },
    methods: {
      //判断版本号是否已存在
      isExist(){
        let _this=this
        let result= _this.versions.filter(version=>version.version===_this.newinput1)
        console.log(result)
        if(result.length>0){
          _this.$notify({
            title: '错误',
            type: 'error',
            message: '版本号重复！',
            duration: 3000
          })
          this.$refs.versionInput.select()
        }
      },
      getVersionTargetsFromDic () {
        //所有版本目的
        let _this = this
        _this.$http.post('/user/dicdata/getdics.json', _this.qs.stringify({
          businessName: 'dev',
          subjectName: 'versionTarget'
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.targetArr = res.data.resMsg
            } else {
              _this.$notify({
                title: '错误',
                type: 'error',
                message: res.data.resMsg,
                duration: 3000
              })
            }

          })
          .catch(function (err) {
            console.log(err)
          })

      },
      getStagesFromDic(){
        //所有产品阶段
        let _this = this
        _this.$http.post('/user/dicdata/getdics.json', _this.qs.stringify({
          businessName: 'dev',
          subjectName: 'productStage'
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.stageOpt = res.data.resMsg
            } else {
              _this.$notify({
                title: '错误',
                type: 'error',
                message: res.data.resMsg,
                duration: 3000
              })
            }

          })
          .catch(function (err) {
            console.log(err)
          })

      },
      getUserList () {
        let _this = this
        _this.productId = _this.$route.query.productId
        // 所属部门
        _this.$http
          .get('/user/dept/getDeptTree.json')
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.deptOpt = res.data.resMsg
              // console.log(res.data.resMsg)
            } else {
            }
          })
          .catch(function (err) {
            console.log(err)
          })

        // 数据下拉 人员列表
        _this.$http.get('/user/getUserList.json', _this.qs.stringify({}))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              console.log(res.data.resMsg)
              _this.allUserlist = res.data.resMsg
              _this.hardwareRdLeaderOpt = res.data.resMsg
              _this.softwareRdLeaderOpt = res.data.resMsg
              _this.testLeaderOpt = res.data.resMsg
              _this.hardwareCcbOpt = res.data.resMsg
              _this.softwareCcbOpt = res.data.resMsg
            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }

          })
          .catch(function (err) {
            console.log(err)
          })

        //数据回显
        _this.$http.post('/dev/product/getProductDetail.json', _this.qs.stringify({
          id: _this.productId
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.typeOpt=[]
              //回显二级分类处理
              let secondType={}
              secondType.name=res.data.resMsg.secondType.secondTypeName
              secondType.value=res.data.resMsg.secondType.secondTypeValue
              _this.typeOpt.push(secondType)
              console.log(res.data.resMsg)
              _this.deptId = res.data.resMsg.deptId
              _this.name = res.data.resMsg.name
              _this.stage = res.data.resMsg.stage
              _this.firstTypeValue = res.data.resMsg.firstTypeValue
              _this.type = res.data.resMsg.type
              _this.firstreleaseTime = res.data.resMsg.releaseTime
              _this.hardwareCcb = res.data.resMsg.hardwareCcb
              _this.hardwareCcbId = res.data.resMsg.hardwareCcbId
              _this.hardwareRdLeader = res.data.resMsg.hardwareRdLeader
              _this.hardwareRdLeaderId = res.data.resMsg.hardwareRdLeaderId
              _this.softwareCcb = res.data.resMsg.softwareCcb
              _this.softwareCcbId = res.data.resMsg.softwareCcbId
              _this.softwareRdLeader = res.data.resMsg.softwareRdLeader
              _this.softwareRdLeaderId = res.data.resMsg.softwareRdLeaderId
              _this.testLeader = res.data.resMsg.testLeader
              _this.testLeaderId = res.data.resMsg.testLeaderId
              _this.description = res.data.resMsg.description
              _this.mustList=res.data.resMsg.firstTypeValue
              // 版本Json串列表
              console.log(res.data.resMsg.versions)
              _this.versions = res.data.resMsg.versions
            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }

          })
          .catch(function (err) {
            console.log(err)
          })

      },
      //新增产品
      addProduct () {
        let _this = this
        _this.name = ''
        _this.firstreleaseTime = ''
        _this.firstTypeValue = null
        _this.type = null
        _this.deptId = null
        _this.stage = null
        _this.testLeaderId = null
        _this.testLeader = ''
        _this.testLeaderOpt = []
        _this.releaseTime = null
        _this.hardwareRdLeaderId = null
        _this.hardwareRdLeader = ''
        _this.hardwareRdLeaderOpt = []
        _this.hardwareCcbId = null
        _this.hardwareCcb = ''
        _this.hardwareCcbOpt = []
        _this.softwareRdLeaderId = null
        _this.softwareRdLeader = ''
        _this.softwareRdLeaderOpt = []
        _this.softwareCcbId = null
        _this.softwareCcb = ''
        _this.softwareCcbOpt = []
        _this.description = ''
        //选中的行
        _this.rowIndex = ''
        //版本table弹出层
        _this.dialogMark = false
        // 提交信息的内容
        _this.newinput1 = ''
        _this.newinput2 = ''
        _this.newinput3 = []
        _this.newinput4 = ''
        _this.newinput5 = ''
        _this.newinput2Id = ''
        _this.newinput3Id = ''
        _this.newinput3Text = []

        //表格排序
        _this.multipleSort = ''
        _this.versions = []

      },
      //保存产品
      saveProduct () {
        let _this = this
        let addproductData = {
          id: _this.productId,
          name: _this.name,
          firstTypeValue:_this.firstTypeValue,
          type: _this.type,
          deptId: _this.deptId,
          stage: _this.stage,
          testLeaderId: _this.testLeaderId,
          testLeader: _this.testLeader,
          releaseTime: String(_this.moment(_this.firstreleaseTime).format('YYYY-MM-DD')),
          hardwareRdLeaderId: _this.hardwareRdLeaderId,
          hardwareRdLeader: _this.hardwareRdLeader,
          hardwareCcbId: _this.hardwareCcbId,
          hardwareCcb: _this.hardwareCcb,
          softwareRdLeaderId: _this.softwareRdLeaderId,
          softwareRdLeader: _this.softwareRdLeader,
          softwareCcbId: _this.softwareCcbId,
          softwareCcb: _this.softwareCcb,
          description: _this.description,
          versions: ''
        }

        addproductData.versions = _this.versions
        for (let i = 0; i < addproductData.versions.length; i++) {
          // delete addproductData.versions[i].managerNames
          delete addproductData.versions[i].index
        }

        let addproductDataAll = JSON.stringify(addproductData)
        _this.$http({
          url: '/dev/product/updateProduct.json',
          method: 'post',
          data: addproductDataAll,
          headers: {
            'Content-Type': 'application/json'
          }

        })
          .then(res => {
            if (res.data.resStatus == 1000) {
              _this.$notify({
                title: '成功',
                type: 'success',
                message: res.data.resMsg,
                duration: 3000
              })
              setTimeout(function () {
                _this.$router.push({
                  name: 'productlist',
                  path: '/productlist'
                })
              }, 1000)
            } else {
              _this.$notify({
                title: '错误',
                type: 'error',
                message: res.data.resMsg,
                duration: 3000
              })
            }

            // console.log(res.data)
          })

      },
      // 回列表
      backList () {
        this.$router.push({
          name: 'productlist',
          path: '/productlist'
        })
      },
      dataFilterFn1 (val) {
        let _this = this
        if(!val){
          _this.hardwareRdLeaderId = ''
          _this.hardwareRdLeader = ''
          return
        }
        let obj = {}
        obj = _this.hardwareRdLeaderOpt.find((item) => {
          return item.id === val
        })
        _this.hardwareRdLeaderId = obj.id
        _this.hardwareRdLeader = obj.realnameWithDeptName
        // console.log(obj.id)
        // console.log(obj.realnameWithDeptName)
      },
      dataFilterFn2 (val) {
        let _this = this
        if(!val){
          _this.softwareRdLeaderId = ''
          _this.softwareRdLeader = ''
          return
        }
        let obj = {}
        obj = _this.softwareRdLeaderOpt.find((item) => {
          return item.id === val
        })
        _this.softwareRdLeaderId = obj.id
        _this.softwareRdLeader = obj.realnameWithDeptName
        // console.log(obj.id)
        // console.log(obj.realnameWithDeptName)
      },
      dataFilterFn3 (val) {
        let _this = this
        if(!val){
          _this.testLeaderId = ''
          _this.testLeader = ''
          return
        }
        let obj = {}
        obj = _this.testLeaderOpt.find((item) => {
          return item.id === val
        })
        _this.testLeaderId = obj.id
        _this.testLeader = obj.realnameWithDeptName
        // console.log(obj.id)
        // console.log(obj.realnameWithDeptName)
      },
      dataFilterFn4 (val) {
        let _this = this
        if(!val){
          _this.hardwareCcbId = ''
          _this.hardwareCcb = ''
          return
        }
        let obj = {}
        obj = _this.hardwareCcbOpt.find((item) => {
          return item.id === val
        })
        _this.hardwareCcbId = obj.id
        _this.hardwareCcb = obj.realnameWithDeptName
        // console.log(obj.id)
        // console.log(obj.realnameWithDeptName)
      },
      dataFilterFn5 (val) {
        let _this = this
        if(!val){
          _this.softwareCcbId =''
          _this.softwareCcb = ''
          return
        }
        let obj = {}
        obj = _this.softwareCcbOpt.find((item) => {
          return item.id === val
        })
        _this.softwareCcbId = obj.id
        _this.softwareCcb = obj.realnameWithDeptName
        // console.log(obj.id)
        // console.log(obj.realnameWithDeptName)
      },
      //获取状态ID
      stageFn (val) {
        this.stage = val
        // console.log(val)
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      normalizer (val) {
      },
      sortChange () {

      },
      //一级菜单触发
      firstTypeFn (value) {
        console.log("一级菜单选中"+value)
        let _this = this
        _this.firstTypeValue = value
        _this.mustList = value
        _this.type = null
        // 二级级菜单联动
        _this.$http.post('/user/dicdata/getdics.json', _this.qs.stringify({
          businessName: 'dev',
          subjectName: value
        }))
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              // console.log(res.data.resMsg)
              _this.typeOpt=[]
              _this.typeOpt = res.data.resMsg
            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }

          })
          .catch(function (err) {
            console.log(err)
          })

      },
      //点击行触发
      rowClick (row) {
        this.rowIndex = row.index
        console.log(this.rowIndex)
      },
      tableRowClassName ({row, rowIndex}) {
        row.index = rowIndex
      },
      //表单提交
      newinput1Fn (val) {

        let _this = this
        let obj = {}
        obj = _this.targetArr.find((item) => {
          return item.id === val
        })
        _this.newinput2Id = obj.id
        _this.newinput2 = obj.name
      },
      newinput2Fn (val) {
        let _this = this
        // console.log(val)
        // console.log(_this.allUserlist)

        let objId = []
        let objName = []
        for (let i = 0; i < _this.allUserlist.length; i++) {
          for (let j = 0; j < val.length; j++) {
            if (_this.allUserlist[i].id == val[j]) {
              objId.push(_this.allUserlist[i].id)
              objName.push(_this.allUserlist[i].realnameWithDeptName)
            }
          }
        }

        _this.newinput3Id = objId
        _this.newinput3Text = []
        for (let g = 0; g < objName.length; g++) {
          _this.newinput3Text.push(objName[g])
        }
      },

      // 增行
      addRow () {
        // this.versionMark = true
        let _this = this
        _this.dialogMark = true

      },
      // 增行确定方法
      addRowTrue (num) {
        let _this = this
        if (num == 1) {
          if(_this.newinput1==''||_this.newinput2Id==''||_this.newinput3Id==[]|| !_this.newinput4){
            _this.$notify({
              title: '错误',
              type: 'error',
              message: '未填写完整',
              duration: 3000
            })
            return
          }
          _this.dialogMark = false
          console.log(_this.newinput3Text)
          //增加行
          _this.versionJson = _this.versions
          let j = {}
          j.version = _this.newinput1
          j.stage = _this.stage
          j.target = _this.newinput2Id
          j.managerNames = _this.newinput3Text
          j.managerIds = _this.newinput3Id
          j.releaseTime = _this.moment(_this.newinput4).format('YYYY-MM-DD')
          j.description = _this.newinput5
          _this.versionJson.push(j)

          console.log(_this.versionJson)
          _this.rowIndex = ''

          // 提交信息的内容
          _this.newinput1 = ''
          _this.newinput2 = ''
          _this.newinput3 = []
          _this.newinput4 = ''
          _this.newinput5 = ''
          _this.newinput2Id = ''
          _this.newinput3Id = ''
          _this.newinput3Text = []

          //表格排序
          // _this.multipleSort = ''
          // _this.versions = []

        } else {
          _this.dialogMark = false
        }
      },
      activeNumFn (val) {
        // this.activeNum = val.index
      },

      // 删行
      delRow () {
        this.versions.splice(this.rowIndex, 1)
        this.rowIndex = ''
      }
    },
    filters:{
      targetName(val,targetArr){
        let obj=targetArr.find(item=> item.value===val)
        return obj.name;
      }
    }
  }
</script>

<style>
  #editproduct .departmentcon_left_btn {
    margin-bottom: 10px;
  }

  #editproduct .easytable {
    max-height: 487px;
    overflow-y: auto;
  }

  #editproduct .inlineB1 {
    text-align: right;
    width: 110px !important;
  }

  /*.inlineBlock {*/
  /*width: 110px !important;*/
  /*text-align: right;*/
  /*}*/

  #editproduct .inlineBlock > i {
    color: red;
    font-size: 0.5rem;
    font-style: initial !important;
  }

  #editproduct .el-date-editor.el-input, #editproduct .el-date-editor.el-input__inner {
    position: absolute;
    margin-left: 4px;
  }

  #editproduct .dateTime {
    margin-top: 10px;
  }

  #editproduct .desText {
    text-align: left !important;
  }

  #editproduct .el-input--suffix {
    width: 177px !important;
  }

  #editproduct .tebleMark {

  }

  #editproduct .tebleMark_con {
    float: left;
    width: 100%;
    margin-bottom: 20px;
  }

  #editproduct .tebleMark_con select {
    border: 1px solid #adadad;
    border-radius: 4px;
    padding: 2px 10px;
    width: 189px;
    color: #606266;
    font-size: 0.8rem;
  }

  #editproduct .tebleMark_con p {
    float: left;
    width: 70px;
  }

  #editproduct .tebleMark_con p:first-child {
    margin-top: 7px;
  }

  #editproduct .tebleMark_con p input {
    border: 1px solid #adadad;
    border-radius: 4px;
    width: 189px;
  }

  #editproduct #describeArr {
    border: 1px solid #adadad;
    border-radius: 4px;
    padding: 1px 10px;
    width: 400px;
    height: 100px;
  }

  #editproduct .el-message-box__btns {
    margin-top: 40px;
  }
</style>
