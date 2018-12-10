<template>
  <div id="treeListData"></div>
</template>

<script>
  export default {
    props: ['userid'],
    watch: {
      '$route' (to, from) {
        if (to.path == '/editrole') {
          // jq('.menuIndex').find('input:checkbox').prop('checked', false)
          this.privilegesID = []
          this.privilegesArr = []
          jq('.menuIndex').html('')
          this.jqtreeFn()
        }
      }

    },
    data () {

      return {
        jsonData: [],
        // 权限按钮父级ID
        privilegesID: [],
        // 权限按钮数组
        privilegesArr: [],
      }
    },
    created () {

    },
    mounted () {
      this.jqtreeFn()
    },
    methods: {
      jqtreeFn () {

        let _this = this
        //获取用户权限数据

        _this.$http({
          url: '/user/role/getRoleDetail.json',
          method: 'get',
          params: {
            id: this.userid
          }

        })
          .then(res => {
            if (res.data.resStatus == 1000) {
              _this.jsonData = res.data.resMsg
              // console.log('GGGGGG', res.data.resMsg)

              var showlist = jq('<ul class="menuIndex"></ul>')
              showall(_this.jsonData.menuPrivilegeTree, showlist)

              jq('#treeListData').append(showlist)
              _this.menuFn()
              _this.checkboxClick()
            } else {
              alert(res.data.resMsg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
        //menu_list为json数据
        //parent为要组合成html的容器
        function showall (menu_list, parent) {
          // console.log(menu_list, parent)
          for (var menu in menu_list) {
            //如果有子节点，则遍历该子节点
            if (menu_list[menu].children && menu_list[menu].children.length > 0) {
              console.log(menu_list[menu].children)
              // 选中回显处理
              // console.log(menu_list[menu].selected)
              if (menu_list[menu].selected == 1) {
                console.log(menu_list[menu].selected)
                //创建一个子节点li
                var li = jq('<li></li>')
                //将li的文本设置好，并马上添加一个空白的ul子节点，并且将这个li添加到父亲节点中
                jq(li).append('<input class="menuIds" type="checkbox"  checked="checked"  name="" id="' + menu_list[menu].id + '"/>' + '<span>' + menu_list[menu].name +
                  '</span>').append(
                  '<ul></ul>').appendTo(parent)
                //将空白的ul作为下一个递归遍历的父亲节点传入
                showall(menu_list[menu].children, jq(li).children().eq(2))
              }
              else {
                //创建一个子节点li
                var li = jq('<li></li>')
                //将li的文本设置好，并马上添加一个空白的ul子节点，并且将这个li添加到父亲节点中
                jq(li).append('<input class="menuIds" type="checkbox" name="" id="' + menu_list[menu].id + '"/>' + '<span>' + menu_list[menu].name +
                  '</span>').append(
                  '<ul></ul>').appendTo(parent)
                //将空白的ul作为下一个递归遍历的父亲节点传入
                showall(menu_list[menu].children, jq(li).children().eq(2))
              }

            }
            else {
              //如果该节点没有子节点，获取按钮权限后将该节点li以及文本创建好直接添加到父亲节点中
              //遍历按钮权限
              if (menu_list[menu].selected == 1) {
                jq('<li><input type="checkbox"  checked="checked"  class="menuIds" name="" id="' + menu_list[menu].id + '"/></li>').append('<span>' + menu_list[menu].name +
                  '</span>').appendTo(
                  parent)
              } else {
                jq('<li><input type="checkbox"  class="menuIds"  name="" id="' + menu_list[menu].id + '"/></li>').append('<span>' + menu_list[menu].name +
                  '</span>').appendTo(
                  parent)
              }
            }

            //菜单操作权限获取
            if (menu_list[menu].privileges && menu_list[menu].privileges.length > 0) {
              // console.log('ididid:', menu_list[menu].id)
              _this.privilegesID.push(menu_list[menu].id)
              _this.privilegesArr.push(menu_list[menu].privileges)
            }

          }

        }
      },

      //处理CheckBox事件点击
      checkboxClick () {
        jq('#treeListData input:checkbox').on('click', function () {
          // console.log(this.checked)
          if (this.checked) {
            // 父级勾选联动
            jq(this).parents('li').children('input:checkbox').prop('checked', true)
            //子级全选联动
            jq(this).parent().find('input:checkbox').prop('checked', true)
          } else {
            // 父级取消联动
            let length = jq(this).parent().parent().children('li').length
            console.log(length)
            let arr = []
            for (let i = 0; i < length; i++) {
              if (jq(this).parent().parent().children('li').eq(i).find('input:checkbox').prop('checked')) {
                arr.push(jq(this).parent().parent().children('li').eq(i).find('input:checkbox').prop('checked'))
              }
            }
            var isTrue = arr.indexOf(true)
            console.log(isTrue)
            if (isTrue < 0) {
              //子级没有选中项时再取消父级
              jq(this).parents('li').children('input:checkbox').prop('checked', false)
              // console.log(jq(this).parents('li').length)
              let length = jq(this).parents('li').length
              let arr1 = []

              for (let i = 0; i < length; i++) {
                if (i > 0) {
                  // console.log('AAA', jq(this).parents('li').eq(i).children('ul').children('li').html())
                  let length2 = jq(this).parents('li').eq(i).children('ul').children('li').length
                  // console.log(length2)
                  for (let j = 0; j < length2; j++) {
                    arr1.push(jq(this).parents('li').eq(i).children('ul').children('li').eq(j).children('input:checkbox').prop(
                      'checked'))
                  }
                  console.log(arr1)
                  let isTrue2 = arr1.indexOf(true)
                  // console.log(isTrue2)
                  if (isTrue2 >= 0) {
                    jq(this).parents('li').eq(i).children('input:checkbox').prop(
                      'checked', true)
                  }
                  arr1 = []
                }
              }
            }
            // 子级取消联动
            jq(this).parent('li').find('input:checkbox').prop('checked', false)
          }

          let checkLength = jq('.menuIndex').children('li').length
          let checkT = jq('.menuIndex').children('li')
          let checkTop = jq('.addRole_Con_user_con_c').children('p')
          for (let g = 0; g < checkLength; g++) {
            if (checkT.eq(g).find('input:checkbox').is(':checked')) {
              checkTop.eq(g).children('input:checkbox').prop('checked', true)
            } else {
              checkTop.eq(g).children('input:checkbox').prop('checked', false)
            }

          }

        })

      },

      //遍历权限按钮
      menuFn () {
        console.log(this.privilegesID)
        console.log(this.privilegesArr)
        let _this = this

        let liLength = jq('.menuIndex').find('li').length
        let liDom = jq('.menuIndex').find('li')
        for (let i = 0; i < liLength; i++) {
          // console.log(liDom.eq(i).children('input:checkbox').attr('id'))
          for (let k = 0; k < _this.privilegesID.length; k++) {
            if (liDom.eq(i).children('input:checkbox').attr('id') == _this.privilegesID[k]) {
              // console.log(liDom.eq(i).children('input:checkbox').attr('id'))
              for (let j = 0; j < _this.privilegesArr[k].length; j++) {
                // console.log(_this.privilegesArr[k][j])
                // liDom.eq(i).html('')

                if (_this.privilegesArr[k][j].selected == 1) {
                  liDom.eq(i).append('<ul><li><input type="checkbox" checked="checked" class="privilegeIds" name="" id="' + _this.privilegesArr[k][j].id + '"/>' + '<span>' + _this.privilegesArr[k][j].name + '</span></li></ul>')
                } else {
                  liDom.eq(i).append('<ul><li><input type="checkbox"  class="privilegeIds" name="" id="' + _this.privilegesArr[k][j].id + '"/>' + '<span>' + _this.privilegesArr[k][j].name + '</span></li></ul>')
                }

                // checked="checked"

              }
            }
          }
        }
        _this.topNavFn()
      },

      //处理顶级菜单是否勾选
      topNavFn () {
        let checkLength = jq('.menuIndex').children('li').length
        let checkT = jq('.menuIndex').children('li')
        let checkTop = jq('.addRole_Con_user_con_c').children('p')
        for (let g = 0; g < checkLength; g++) {
          if (checkT.eq(g).find('input:checkbox').is(':checked')) {
            checkTop.eq(g).children('input:checkbox').prop('checked', true)
          } else {
            checkTop.eq(g).children('input:checkbox').prop('checked', false)
          }
        }
      }

    }
  }
</script>

<style>
  #treeListData .menuIndex li {
    list-style: none;
    padding-left: 15px;

  }

  #treeListData .menuIndex li span {
    padding-left: 5px;
    /*margin-bottom: 10px;*/
    line-height: 25px;
  }

  #treeListData .menuIndex > li {
    display: none;
    margin-left: -20px;
    /*margin: 50px 0 0 0;*/
  }

  #treeListData .menuIndex > li > input,
  #treeListData .menuIndex > li > span {
    display: none;
  }
</style>
