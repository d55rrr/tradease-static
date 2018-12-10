<template>
  <div id="ztree">
    <div class="ztree_con">
      <ul id="tree" class="ztree" style="width:100%;"></ul>
    </div>
    <!-- <p>点击的值是：{{clickData}}</p> -->
  </div>
</template>

<script>
  // import "../assets/js/jquery2.2.2jquery.min.js";
  import '../../../assets/js/jquery.ztree.all.min.js'

  export default {
    data () {
      return {
        clickData: '',
        zNodes: [],
        // 刷新树
        treeReload: ''
      }
    },
    watch: {
      // '$route' (to, from) {
      //   // 更新用户数据
      //   if (to.path == '/permission') {
      //     this.getuserdata()
      //   }
      //
      // }
      treeReload (val, oldVal) {
        this.treeReloadFn()

      }
    },
    created () {
      let _this = this
      _this.eventsBus.$on('treeReload-dm', function (val) {
        _this.treeReload = val
        console.log('AAAAAAAAA', val)
      })
      this.treeReloadFn()
    },
    mounted () {

    },
    methods: {
      //菜单树
      treeReloadFn () {
        var zTree
        var demoIframe

        let _this = this
        _this.$http
          .post('/menu/menuall.json')
          .then(function (res) {
            // console.log(res)
            if (res.data.resStatus == 1000) {
              console.log('DDDDD', res.data.resMsg)
              _this.zNodes = res.data.resMsg
              // console.log(_this.zNodes)

              var setting = {
                // check: {
                //   enable: true
                // },
                view: {
                  dblClickExpand: false,
                  showLine: true,
                  selectedMulti: false
                },
                data: {
                  simpleData: {
                    enable: true,
                    idKey: 'id',
                    pIdKey: 'pId',
                    // rootPId: ""
                  }
                },
                callback: {
                  beforeClick: function (treeId, treeNode) {
                    var zTree = jq.fn.zTree.getZTreeObj('tree')

                    //点击获取 点击发送eventsBus事件
                    console.log(treeNode)
                    let clickData = treeNode
                    _this.eventsBus.$emit('ztreeVal-dm', clickData)

                    // if (treeNode.isParent) {
                    //   zTree.expandNode(treeNode)
                    //   return false
                    // } else {
                    //   demoIframe.attr('src', treeNode.file + '.html')
                    //   return true
                    // }
                  }
                }
              }

              jq(document).ready(function () {
                var t = jq('#tree')
                // console.log(111, _this.zNodes)
                t = jq.fn.zTree.init(t, setting, _this.zNodes)
                demoIframe = jq('#testIframe')
                demoIframe.bind('load', loadReady)
                var zTree = jq.fn.zTree.getZTreeObj('tree')
                zTree.selectNode(zTree.getNodeByParam('id', 101))
                var treeObj = zTree
                treeObj.expandAll(true)

              })

            } else {
              // alert(res.statusText)
              console.log(res.data.resMag)
            }
          })
          .catch(function (err) {
            console.log(err)
          })

        function loadReady () {
          var bodyH = demoIframe
              .contents()
              .find('body')
              .get(0).scrollHeight,
            htmlH = demoIframe
              .contents()
              .find('html')
              .get(0).scrollHeight,
            maxH = Math.max(bodyH, htmlH),
            minH = Math.min(bodyH, htmlH),
            h = demoIframe.height() >= maxH ? minH : maxH
          if (h < 530) h = 530
          demoIframe.height(h)
        }
      }

    }
  }
</script>

<style>
  @import "../../../assets/css/zTreeStyle.css";

  #ztree {
    height: 338px;
  }

  .ztree_con {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    /* background: #dae7c0; */
  }
</style>
