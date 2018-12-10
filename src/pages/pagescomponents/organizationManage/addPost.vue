<template>
  <div id="addPost">
    <div class="addPost_Con">
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">所属部门：</span>
            <span class="textFontColor">*</span>
            <treeselect
              :options="options1"
              placeholder="请选择部门"
              :default-expand-level="10"
              :multiple="true"
              :normalizer="normalizer"
              v-model="selectValue1"
              @select="treeselectFn"
              :flat="true"
            />

          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="8">
          <div class="demo-input-suffix">
            <span class="inlineBlock">岗位名称：</span>
            <span class="textFontColor">*</span>
            <el-input
              placeholder="请输入岗位名称"
              suffix-icon=""
              v-model="name">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="16">
          <span class="inlineBlock">岗位职责：</span>
          <span class="textFontColorHidden">*</span>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="responsibility">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="elRow1">
        <el-col :span="16">
          <span class="inlineBlock">岗位描述：</span>
          <span class="textFontColorHidden">*</span>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="description">
          </el-input>
        </el-col>
      </el-row>
      <div class="addPost_Con_btn">
        <button v-if="classify == '' || classify == 'add'" type="button" class="el-button el-button--primary "
                @click="savecanceFn(0)"><span>提交</span></button>
        <button v-if="classify == '' || classify == 'add'" type="button" class="el-button el-button--info"
                @click="savecanceFn(1)"><span>取消</span></button>
        <button v-if="classify == 'edit'" type="button" class="el-button el-button--primary " @click="savecanceFn(3)">
          <span>提交</span></button>
        <button v-if="classify == 'edit'" type="button" class="el-button el-button--info" @click="savecanceFn(4)"><span>取消</span>
        </button>
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

        // 岗位名称
        name: '',
        // 所属部门id
        selectValue1: null,
        // 岗位职责
        responsibility: '',
        // 岗位描述
        description: '',

        textarea1: '',
        // 岗位描述
        textarea2: '',
        // 入职时间
        entryTime: '',
        tel: '',
        email: ''
      }
    },
    watch: {
      '$route' (to, from) {
        this.getuserdata()
        this.selectValue1 = null
        this.name = ''

      },
      // selectValue1 (val, oldVal) {
      //   console.log(val)
      //   var _this = this
      //   _this.selectValue2 = null
      //   // 岗位列表
      //   _this.$http.post('/user/posi/getPosiByDeptId.json', _this.qs.stringify({
      //     deptId: val
      //   }))
      //     .then(function (res) {
      //       if (res.data.resStatus == 1000) {
      //         _this.options2 = res.data.resMsg
      //         console.log(res.data.resMsg)
      //
      //       } else {
      //
      //       }
      //     })
      //     .catch(function (err) {
      //       console.log(err)
      //     })
      // },
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
        _this.id = _this.$route.params.id
        // classify

        if (_this.$route.params.classify && _this.$route.params.classify != '') {
          _this.classify = _this.$route.params.classify
        } else {
          _this.classify = ''
        }

        if (_this.id && _this.id != '') {
          // alert('AAA', _this.id)
          // 判断是修改还是新增
          _this.$http({
            url: '/user/posi/getPositionDetail.json',
            method: 'get',
            params: {
              id: _this.id
            }

          }).then(function (res) {
              if (res.data.resStatus == 1000) {

                // console.log()
                _this.name = res.data.resMsg.name
                _this.selectValue1 = res.data.resMsg.deptIds
                _this.responsibility = res.data.resMsg.responsibility
                _this.description = res.data.resMsg.description
              } else {

                console.log(res.data.resMsg)
              }

            }
          )
            .catch(function (err) {
              console.log(err)
            })

          console.log('selectValue1:', _this.selectValue1)
        } else {
          _this.name = ''
          _this.selectValue1 = null
          _this.responsibility = ''
          _this.description = ''
        }
        // 部门列表
        _this.$http.get('/user/dept/getDeptTree.json')
          .then(function (res) {
              if (res.data.resStatus == 1000) {

                _this.options1 = res.data.resMsg
              } else {

                console.log(res.data.resMsg)
              }

            }
          )
          .catch(function (err) {
            console.log(err)
          })

      },

      //确定 取消
      savecanceFn (num) {
        let _this = this
        if (num == 0) {

          if (_this.id && _this.id != '') {
            // 修改岗位
            _this.$http.post('/user/posi/updatePosition.json', _this.qs.stringify({
              id: _this.id,
              name: _this.name,
              deptIds: String(_this.selectValue1),
              responsibility: _this.responsibility,
              description: _this.description,
            }))
              .then(function (res) {
                if (res.data.resStatus == 1000) {
                  _this.$notify({
                    title: '成功',
                    message: res.data.resMsg,
                    type: 'success',
                    duration: 3000
                  })
                  setTimeout(function () {
                    _this.$router.go(-1)
                    // _this.$router.push({
                    //   name: 'post',
                    //   path: '/post'
                    // })
                  }, 1000)

                } else {
                  _this.$notify({
                    title: '错误',
                    message: res.data.resMsg,
                    type: 'error',
                    duration: 3000
                  })
                }
              })

              .catch(function (err) {
                console.log(err)
              })

          } else {
            // 新增岗位
            _this.$http.post('/user/posi/savePosition.json', _this.qs.stringify({
              name: _this.name,
              deptIds: String(_this.selectValue1),
              responsibility: _this.responsibility,
              description: _this.description,
            }))
              .then(function (res) {
                if (res.data.resStatus == 1000) {

                  _this.$notify({
                    title: '成功',
                    message: res.data.resMsg,
                    type: 'success',
                    duration: 3000
                  })
                  setTimeout(function () {
                    _this.$router.push({
                      name: 'post',
                      path: '/post'
                    })
                  }, 1000)
                  // 岗位名称
                  _this.name = ''
                  // 所属部门id
                  _this.selectValue1 = null
                  // 岗位职责
                  _this.responsibility = ''
                  // 岗位描述
                  _this.description = ''

                } else {
                  _this.$notify({
                    title: '错误',
                    message: res.data.resMsg,
                    type: 'error',
                    duration: 3000
                  })
                }
              })

              .catch(function (err) {
                console.log(err)
              })
          }

        } else if (num == 1) {
          _this.$router.go(-1)
          // 岗位名称
          _this.name = ''
          // 所属部门id
          _this.selectValue1 = null
          // 岗位职责
          _this.responsibility = ''
          // 岗位描述
          _this.description = ''

        } else if (num == 2) {
          _this.$router.go(-1)
        } else if (num == 3) {

          if (_this.id && _this.id != '') {
            // 修改岗位
            _this.$http.post('/user/posi/updatePosition.json', _this.qs.stringify({
              id: _this.id,
              name: _this.name,
              deptIds: String(_this.selectValue1),
              responsibility: _this.responsibility,
              description: _this.description,
            }))
              .then(function (res) {
                if (res.data.resStatus == 1000) {
                  _this.$notify({
                    title: '成功',
                    message: res.data.resMsg,
                    type: 'success',
                    duration: 3000
                  })
                  setTimeout(function () {
                    _this.$router.go(-1)
                  }, 1000)

                } else {
                  _this.$notify({
                    title: '错误',
                    message: res.data.resMsg,
                    type: 'error',
                    duration: 3000
                  })
                }
              })

              .catch(function (err) {
                console.log(err)
              })

          } else {
            // 新增岗位
            _this.$http.post('/user/posi/savePosition.json', _this.qs.stringify({
              name: _this.name,
              deptIds: String(_this.selectValue1),
              responsibility: _this.responsibility,
              description: _this.description,
            }))
              .then(function (res) {
                if (res.data.resStatus == 1000) {

                  _this.$notify({
                    title: '成功',
                    message: res.data.resMsg,
                    type: 'success',
                    duration: 3000
                  })

                  setTimeout(function () {
                    _this.$router.go(-1)
                  }, 1000)

                } else {
                  _this.$notify({
                    title: '错误',
                    message: res.data.resMsg,
                    type: 'error',
                    duration: 3000
                  })
                }
              })

              .catch(function (err) {
                console.log(err)
              })
          }
        } else if (num == 4) {
          _this.$router.go(-1)
        }
      },

      // 部门/岗位
      normalizer () {

      }
      ,
      //入职时间
      statusDataFn (val) {
        console.log(val)
        let time1 = this.moment(val).format('YYYY-MM-DD')
        this.entryTime = time1
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
  #addPost .elRow1 .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "*";
      line-height: 37px;
      font-size: 1rem;
      color: red;
      padding-right: 6px;
    }
  }

  #addPost .elRow1 .el-col {
    text-align: left;
  }

  #addPost .block .el-input__suffix-inner .el-input__icon {
    &:before {
      content: "" !important;
      font-style: initial;
      line-height: 30px !important;
    }

  }

  #addPost .vue-treeselect {
    width: 192px;
  }

  #addPost .el-textarea {
    width: 400px;
    & .el-textarea__inner {
      border: 1px solid #adadad;
    }
  }

  #addPost .inlineBlock {
    display: inline-block;
    width: 70px;
  }

  #addPost .el-input--suffix .el-input__inner {
    padding-right: 0;
    width: 190px;
  }

  #addPost .vue-treeselect__control {
    width: 192px !important;
  }

  #addPost .textFontColor {
    color: red;
  }

  #addPost .textFontColorHidden {
    color: #FFFFFF;
  }
</style>
