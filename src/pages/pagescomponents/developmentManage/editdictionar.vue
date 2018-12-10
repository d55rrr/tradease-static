<template>
  <div id="editdictionar">
    <div class="editdictionar_Con">

      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">业务模块：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入业务模块"
              suffix-icon=""
              v-model="businessName">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">属性名称：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入属性名称"
              suffix-icon=""
              v-model="subjectName">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">选项名：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入选项名"
              suffix-icon=""
              v-model="name">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">选项值：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入选项值"
              suffix-icon=""
              v-model="value">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">状态：</span>
            <span class="textFontColorHidden">*</span>
            <el-radio v-model="status" label="1">启用</el-radio>
            <el-radio v-model="status" label="2">禁用</el-radio>
          </div>
        </el-col>
      </el-row>

      <div class="editdictionar_Con_btn">
        <button type="button" class="el-button el-button--primary " @click="savecanceFn(0)"><span>提交</span></button>
        <button type="button" class="el-button el-button--info" @click="savecanceFn(1)"><span>取消</span></button>
      </div>
    </div>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'

  export default {
    data () {
      return {
        id: '',
        input2: '',
        input3: '',

        valueDate: '',
        options1: [],
        options2: [],

        // 所属部门id
        selectValue1: null,
        // 岗位职责
        responsibility: '',
        // 岗位描述
        description: '',

        businessName: '',
        subjectName: '',
        name: '',
        value: '',
        status: ''

      }
    },
    watch: {
      '$route' (to, from) {
        this.getuserdata()

      },
      selectValue1 (val, oldVal) {
        console.log(val)
        var _this = this
        _this.selectValue2 = null
        // 岗位列表
        _this.$http.post('/user/posi/getPosiByDeptId.json', _this.qs.stringify({
          deptId: val
        }))
          .then(function (res) {
            if (res.data.resStatus == 1000) {
              _this.options2 = res.data.resMsg
              console.log(res.data.resMsg)

            } else {

            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      selectValue2 (val, oldVal) {
        console.log('岗位-selectValue2: ' + val)
      }
    },

    created () {
      this.getuserdata()
    },
    methods: {
      selectGet1 (val) {
        console.log(val)
      },
      selectGet2 (val) {
        console.log(val)
      },

      getuserdata () {
        let _this = this
        // 修改字典信息
        _this.id = _this.$route.params.id
        _this.businessName = _this.$route.params.businessName
        _this.subjectName = _this.$route.params.subjectName
        _this.name = _this.$route.params.name
        _this.value = _this.$route.params.value
        _this.status = String(_this.$route.params.status)
      },

      //确定 取消
      savecanceFn (num) {
        let _this = this
        if (num == 0) {
          if (isNaN(_this.value)) {
            // alert('选项值只能为数字')
            _this.$notify({
              title: '错误',
              type: 'error',
              message: '选项值只能为数字',
              duration: 3000
            })

            _this.value = ''
            return
          }
          // 修改字典
          _this.$http.post('/user/dicdata/editOption.json', _this.qs.stringify({
            id: _this.id,
            businessName: _this.businessName,
            subjectName: _this.subjectName,
            name: _this.name,
            value: _this.value,
            status: _this.status,
          }))
            .then(function (res) {
              if (res.data.resStatus == 1000) {

                _this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '修改成功',
                  duration: 3000
                })
                setTimeout(function () {
                  _this.$router.push({
                    name: 'dictionar',
                    path: '/dictionar'
                  })
                }, 1000)

              } else {
                _this.$notify({
                  title: '失败',
                  type: 'error',
                  message: res.data.resMsg,
                  duration: 3000
                })

              }
            })

            .catch(function (err) {
              console.log(err)
            })

        } else {
          _this.$router.push({
            name: 'dictionar',
            path: '/dictionar'
          })
        }
      }
      ,
      // 部门/岗位
      normalizer () {

      }
      ,
      treeselectFn (val) {
        console.log(val)
      }

    },
    components: {
      Treeselect
    }
  }
</script>

<style lang="less">
  #editdictionar .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #editdictionar .elRow1 .el-col {
    text-align: left;
  }

  #editdictionar .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }

  }

  #editdictionar .vue-treeselect {
    width: 192px;
  }

  #editdictionar.el-textarea {
    width: 400px;
    & .el-textarea__inner {
      border: 1px solid #adadad;
    }
  }

  #editdictionar .inlineBlock {
    display: inline-block;
    width: 70px;
  }

  #editdictionar .textFontColor {
    color: red;
  }

  #editdictionar .textFontColorHidden {
    color: #FFFFFF;
  }
</style>
