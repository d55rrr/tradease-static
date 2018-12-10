<!--
  可编辑表格

  用法：
  <editable :columns='headers'
                  v-model = "datas"
                  ref="edit"
   />
   指令属性：
   v-model与数据域绑定
   :columns属性绑定可编辑表格表头格式

   表头格式：
   如下：
   [
    {
      key:'projectId',
      name:'<span style="color:red">*</span>所属项目',
      type:'select',
      selectList:[],
      dataType:array,
      parentKey:'',
      selectTree:{}
    }
    ]

    表头定义：
    key：数据标识符
    name:表头显示标题，支持html样式
    type:数据格式  select为下拉列表,text为文本框,date为日期选中框,treeSelect为级联选择
    selectList:数据格式为下拉列表框时，下拉列表数据，值为value,显示label为name,如格式:[{value:1,name:'北京'}]
    dataType;dataType属性代表表格对应数据的数据类型，默认为text，可以申明为array 仅在type为select时有效，当dataType为array是，支持下拉列表多选
    parentKey:父节点数据标识，用于级联选择节点
    selectTree:树形信息,用于级联选择，与parentKey同用形成级联选择链条的起点


    方法使用：
    使用可编辑表格定义的方法，如增行，删行，复制增行
    在<editable>标签中申明ref,如申明ref=edit然后通过vue对象的this.$refs.edit.方法名   如：this.$refs.edit.remove()

-->
<template>
    <div id="editable">
      <table >
        <tr>
          <td v-for="column in columns" :key="column.key"><div v-html="column.name"></div></td>
        </tr>
        <tr v-for="(row,rowindex ) in datas" @click="rowEdited=rowindex" class="v-table-header-row">
          <td v-for="(cell,cellindex) in row" @click="cellClick(rowindex,cellindex)"  >
            <span v-show="rowindex!=rowEdited||cellindex!=cellEdited">
                <template v-if="typeList[cellindex]=='select'&&dataTypeList[cellindex]=='text'">
                  <span v-for="select in selectDataList[cellindex]" v-show="select['value']==datas[rowindex][cellindex]">{{select["name"]}}</span>
                </template>
                <template v-else-if="typeList[cellindex]=='select'&&dataTypeList[cellindex]=='array'">
                      <template v-for="value in datas[rowindex][cellindex]">
                        <span v-for="select in selectDataList[cellindex]" v-show="select['value']==value">{{select["name"]}}|</span>
                      </template>
                </template>
                <template v-else-if="typeList[cellindex]=='treeSelect'">
                  <span v-for="select in treeSelectDataList[rowindex][cellindex]" v-show="select['value']==datas[rowindex][cellindex]">{{select["name"]}}</span>
                </template>
                <template v-else>
                  {{datas[rowindex][cellindex]}}
                </template>
            </span>
            <input   v-if="typeList[cellindex]=='number'" type="number" v-show="rowindex==rowEdited&&cellindex==cellEdited" style="width:100%;height:100%" v-model="datas[rowindex][cellindex]" @blur="collectData" />
            <input   v-if="typeList[cellindex]=='text'" v-show="rowindex==rowEdited&&cellindex==cellEdited" style="width:100%;height:100%" v-model="datas[rowindex][cellindex]" @blur="collectData" />
            <el-date-picker  v-if="typeList[cellindex]=='date'"  v-show="rowindex==rowEdited&&cellindex==cellEdited" value-format="yyyy-MM-dd"  v-model="datas[rowindex][cellindex]" type="date" placeholder="选择日期"  @blur="collectData"  >
            </el-date-picker>
            <el-select v-model="datas[rowindex][cellindex]" placeholder="请选择"  v-if="typeList[cellindex]=='select'&&dataTypeList[cellindex]=='array'"  v-show="rowindex==rowEdited&&cellindex==cellEdited"  @blur="collectData"  multiple  filterable collapse-tags   >
              <el-option
                v-for="item in selectDataList[cellindex]"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="datas[rowindex][cellindex]" placeholder="请选择"  v-if="typeList[cellindex]=='select'&&dataTypeList[cellindex]=='text'"  v-show="rowindex==rowEdited&&cellindex==cellEdited"  @blur="collectData"  @change="selectChange">
              <el-option
                v-for="item in selectDataList[cellindex]"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select v-model="datas[rowindex][cellindex]" placeholder="请选择"  v-if="typeList[cellindex]=='treeSelect'&&dataTypeList[cellindex]=='text'"  v-show="rowindex==rowEdited&&cellindex==cellEdited"  @blur="collectData"  @change="selectChange">
              <el-option
                v-for="item in treeSelectDataList[rowindex][cellindex]"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
  export default {
    props:['columns','value'],
    created(){
      this.columns.unshift({"key":"dataIndex","name":"序号","type":"null"})
      this.init()
    },
    mounted(){
    },
    data(){
      return {
        //表格数据对象
        datas:[],
        //单元格位置或属性
        cellEdited:null,
        //行所在位置
        rowEdited:null,
        //标题行
        innerColumns:this.columns,
        innerObj:{},
        //文本类型列表
        typeList:[],
        dataTypeList:[],
        //下拉选择列表
        selectDataList:[],
        treeSelectDataList:[],
        selectTree:[],
        selectTreeValue:[],
        valueTemp:{}
      }
    },
    watch:{
      columns:{
        handler(newVal){
          this.init()
        }
      },
      value:{
        handler(newVal,oldVal){
          debugger
          if(oldVal==null&&oldVal.length==undefined||!oldVal.length){
            this.datas = []
            if(newVal&&newVal.length!=undefined&&newVal.length>0){
              this.datas = newVal
              this.initDatas()
            }
          }
        }
      },
      deep:true
    },
    methods:{
      init(){
        let _this = this
        _this.innerObj = {}
        _this.typeList = []
        _this.selectDataList = []
        _this.dataTypeList = []
        _this.treeSelectDataList=[]
        _this.selectTreeValue=[]
        for(let i=0;i<_this.columns.length;i++){
          _this.innerObj[_this.columns[i].key] = _this.columns[i]
          _this.typeList[_this.columns[i].key] = _this.columns[i].type
          if(_this.columns[i].selectList!=undefined){
            _this.selectDataList[_this.columns[i].key] =_this.columns[i].selectList
          }else{
            _this.selectDataList[_this.columns[i].key] = null
          }
          if(_this.columns[i].dataType==undefined){
            _this.dataTypeList[_this.columns[i].key] = 'text'
          }else{
            _this.dataTypeList[_this.columns[i].key] = _this.columns[i].dataType
          }
          if(_this.columns[i].selectTree!=undefined){
            _this.selectTree = _this.columns[i].selectTree
          }
        }
        for(let attr in _this.innerObj){
          if(_this.innerObj[_this.innerObj[attr].parentKey]){
            _this.innerObj[_this.innerObj[attr].parentKey].childKey = attr
          }
        }
        if(_this.datas.length){
          _this.initDatas()
        }
      },
      //增行
      add(){
        let _this = this
        let row = {}
        for(let i=0;i<_this.innerColumns.length;i++){
          if(this.innerColumns[i].dataType=='array'){
            row[_this.innerColumns[i].key] = []
          }else{
            row[_this.innerColumns[i].key] = null
          }
        }
        for(let attr in _this.innerObj){
          if(_this.innerObj[attr].parentKey!=undefined||_this.innerObj[attr].selectTree!=undefined){
            _this.treeSelectDataList[_this.datas.length] = {}
            _this.treeSelectDataList[_this.datas.length][attr] = []
          }
        }

        row.dataIndex = _this.datas.length+1
        _this.datas.push(row)
      },
      //初始化数据
      initDatas(){
        let _this = this
        if(_this.datas.length){
          for(let j=0;j<_this.datas.length;j++){
            let tempData = _this.datas[j]
            let row = {}
            tempData.dataIndex = j+1
            _this.columns.forEach(function (column) {
              if(tempData[column.key]!==undefined){
                row[column.key] = tempData[column.key]
              }else{
                if(_this.innerObj[column.key].dataType=="array"){
                  row[column.key] = []
                }else{
                  row[column.key] = null
                }
              }
              if(column.type=="treeSelect"){
                _this.treeSelectDataList[j] = {}
                _this.treeSelectDataList[j][column.key] = []
                if(row[column.key]){
                  let treeSelectValue = _this.findSelectTreeNodeList(row[column.key]).reverse()
                  if(treeSelectValue!=null&&treeSelectValue.length>0){
                    let parentName = ''
                    for(let m = 0;m<treeSelectValue.length;m++){
                      if(!parentName){
                        parentName = column.key
                      }
                      _this.selectTreeValue = treeSelectValue.slice(m+1)
                      _this.treeSelectDataList[j][parentName] = _this.findSelectListFromTree()
                      if(_this.innerObj[parentName].parentKey){
                        parentName = _this.innerObj[parentName].parentKey
                        row[parentName] = treeSelectValue[m+1]
                      }
                    }
                  }
                }
              }
            })
            _this.valueTemp = row
            _this.datas[j] =  _this.valueTemp
          }

        }
      },
      //删行
      remove(){
        this.datas.pop()
      },
      //复制增行
      copy(){
        let obj = {}
        for(let attr in this.datas[this.datas.length-1]){
          obj[attr] = this.datas[this.datas.length-1][attr]
        }
        obj.dataIndex = this.datas.length+1
        this.datas.push(obj)
        let tempSelectList = this.treeSelectDataList[this.treeSelectDataList.length-1]
        let tempStr = JSON.stringify(tempSelectList)
        let tempSelectFinal = JSON.parse(tempStr)
        this.treeSelectDataList.push(tempSelectFinal)
      },
      //blur事件响应,绑定v-model
      collectData(){
     /*   this.cellEdited=null
        this.rowEdited =null*/
        this.$emit('input',this.datas)

      },
      findSelectValueFromTree(selectKey,rowindex,index){
        let _this = this
        if(!index){
          index  = 0
        }
        if(index!=0){
          _this.selectTreeValue.push(_this.datas[rowindex][selectKey])
        }
        index++
        if(_this.innerObj[selectKey].parentKey!=undefined){
          return _this.findSelectValueFromTree(_this.innerObj[selectKey].parentKey,rowindex,index)
        }else{
          return
        }
      },
      findSelectListFromTree(treeValueList,treeNode){
        if(!treeNode){
          treeNode = this.selectTree
        }
        if(!treeValueList){
          treeValueList = this.selectTreeValue
        }
        if(treeValueList.length){
          let treeValue = treeValueList.pop()
          let temp = null
          treeNode.forEach(function (node) {
            if(node.value==treeValue){
              temp = node.children
              if(!temp){
                temp = []
              }
            }
          })
          return this.findSelectListFromTree(treeValueList,temp)
        }else{
          let selectList = []
          treeNode.forEach(function (node) {
            let temp = {name:'',value:''}
            temp.name = node.name
            temp.value = node.value
            selectList.push(temp)
          })
          return selectList
        }

      },
      clearTreeChildrenData(cellindex,rowindex){
        if(this.innerObj[cellindex].childKey){
          let childKey = this.innerObj[cellindex].childKey
          this.datas[rowindex][childKey]=''
          this.clearTreeChildrenData(childKey,rowindex)
          return
        }else{
          return
        }

      },
      cellClick(rowindex,cellindex){
        this.cellEdited=cellindex
        if(this.innerObj[cellindex].selectTree!=undefined||this.innerObj[cellindex].parentKey!=undefined){
           this.findSelectValueFromTree(cellindex,rowindex)
          if(this.treeSelectDataList[rowindex]){
            this.treeSelectDataList[rowindex][cellindex] = this.findSelectListFromTree()
          }else {
            this.treeSelectDataList[rowindex] = {}
            this.treeSelectDataList[rowindex][cellindex] = this.findSelectListFromTree()
          }
        }
      },
      selectChange(){
        this.clearTreeChildrenData(this.cellEdited,this.rowEdited)
      },
      //给出联动选择的最后一个节点，联动选择树，返回从根到尾树形节点上选择的值集合
      findSelectTreeNodeList(key,tree,keyList,degree,isTrue){
        if(isTrue==undefined){
          isTrue = {isTrue:false}
        }
        let _this = this
        if(!tree){
           tree = this.selectTree
        }
        if(!keyList){
          keyList = []
        }
        if(degree==undefined){
          degree = 0
        }
        for(let i=0;i<tree.length;i++){
          if(isTrue.isTrue){
            break
          }else{
            if(tree[i].value!=key){
              let temp = degree
              keyList[temp] = tree[i].value
              temp++
              if(tree[i].children!=undefined&&tree[i].children.length!=undefined&&tree[i].children.length>0){
                _this.findSelectTreeNodeList(key,tree[i].children,keyList,temp,isTrue)
              }
            }else{
              keyList[degree] = tree[i].value
              isTrue.isTrue = true
            }
          }

        }
        return keyList
      }
    }

  }
</script>

<style scoped>
  #editable td{
    height:35px;
    width:100px;
    border:1px solid #dddddd;
    text-align:center;
  }
  #editable table{
    border:1px solid #dddddd;
    width:100%
  }
  #editable .el-date-editor.el-input,#editable .el-date-editor.el-input__inner{
    width:100%
  }

</style>
