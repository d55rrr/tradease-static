<template >
  <div id="htable">
    <table class="horizontaltable" :style="styleObject">
      <tr>
        <td v-for="cindex in columnCount" >{{columns[cindex-1].label}}</td>
        <td><span style="color:cornflowerblue" @click="addRowFn">增行</span></td>
      </tr>
      <tr v-for="rindex in rowCount">
        <td @click="editThis(rindex,cindex)" v-for="cindex in columnCount">
          <span v-if="columns[cindex-1].type!='text'&&columns[cindex-1].type!='textarea'" v-show="rindex!=editrindex||cindex!=editcindex">
              <p v-if="columns[cindex-1].type=='selectId'||columns[cindex-1].type=='selectValue'||columns[cindex-1].type=='selectMulti'||columns[cindex-1].type=='treeselect'" > {{showName(cindex-1,value[rindex-1][columns[cindex-1].key])}}</p>
              <p v-else-if="columns[cindex-1].type=='daterange'">{{String(value[rindex-1][columns[cindex-1].key])}}</p>
              <p v-else>{{value[rindex-1][columns[cindex-1].key]}}</p>
          </span>
          <el-input   v-if="columns[cindex-1].type=='text'"   v-model="value[rindex-1][columns[cindex-1].key]"  @blur="blurFn" />
          <el-input  type="textarea" v-if="columns[cindex-1].type=='textarea'"   v-model="value[rindex-1][columns[cindex-1].key]"  @blur="blurFn" />
          <el-date-picker  v-if="columns[cindex-1].type=='date'"  value-format="yyyy-MM-dd"  v-model="value[rindex-1][columns[cindex-1].key]" type="date" placeholder="选择日期" v-show="rindex==editrindex&&cindex==editcindex" @blur="blurFn"  ></el-date-picker>
          <el-date-picker type="daterange"  unlink-panels v-if="columns[cindex-1].type=='daterange'"  value-format="yyyy-MM-dd"  v-model="value[rindex-1][columns[cindex-1].key]"  placeholder="选择日期" v-show="rindex==editrindex&&cindex==editcindex" @blur="blurFn"  ></el-date-picker>
          <el-select v-if="columns[cindex-1].type=='selectId'" v-model="value[rindex-1][columns[cindex-1].key]" placeholder="请选择" v-show="rindex==editrindex&&cindex==editcindex"  @change="changeFn($event,rows[index-1].key)" @blur="blurFn"  collapse-tags   >
            <el-option
              v-for="item in columns[cindex-1].selectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-if="columns[cindex-1].type=='selectValue'" v-model="value[rindex-1][columns[cindex-1].key]" placeholder="请选择" v-show="rindex==editrindex&&cindex==editcindex"   @blur="blurFn"  collapse-tags   >
            <el-option
              v-for="item in columns[cindex-1].selectList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-if="columns[cindex-1].type=='selectMulti'"  v-model="value[rindex-1][columns[cindex-1].key]" placeholder="请选择" v-show="rindex==editrindex&&cindex==editcindex"   @blur="blurFn" multiple   >
            <el-option
              v-for="item in columns[cindex-1].selectList"
              :key="item.id"
              :label="item.realnameWithDeptName"
              :value="item.id">
            </el-option>
          </el-select>
          <treeselect v-if="columns[cindex-1].type=='treeselect'"
            :options="columns[cindex-1].selectList"
            :default-expand-level="10"
            v-model="value[rindex-1][columns[cindex-1].key]"
            v-show="rindex==editrindex&&cindex==editcindex"
              placeholder="请选择"
             @blur="blurFn"
          />
        </td>
        <td><span style="color:indianred;" @click="delRowFn(rindex-1)">删行</span></td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        styleObject:{},
        editrindex:0,
        editcindex:0,
      }
    },
    created() {
    },
    props: ['columns', 'value','tableStyle'],
    computed: {
      rowCount: function() {
        return this.value.length;
      },
      columnCount: function() {
        return this.columns.length;
      }
    },
    watch:{
    },
    methods:{
      changeFn(val,key){
        this.$emit('refreshSelectFn',key)
      },
      focusFn(val){
      },
      blurFn(){
        // this.editIndex=0
      },
      editThis(rindex,cindex){
        this.editrindex=rindex
        this.editcindex=cindex
      },
      showName(index,val){
        if(!val||val==''){
          return ''
        }
        if(this.columns[index].type=='selectId'||this.columns[index].type=='treeselect'){
          let obj=this.columns[index].selectList.find(item=>item.id==val)
          console.log('name',obj)
          if(obj){
            return obj.name
          }
        }else if(this.columns[index].type=='selectValue'){
          let obj=this.columns[index].selectList.find(item=>item.value==val)
          if(obj){
            return obj.name
          }
        }else if(this.columns[index].type=='selectMulti'){
          let strArr=[]
          this.columns[index].selectList.forEach(item=>{
            let exist=false
            for (let i=0;i<val.length;i++){
              if(item.id==val[i]){
                exist=true
                strArr.push(item.realnameWithDeptName)
              }
            }
            return exist
          })
          return String(strArr)
        }

      },
      addRowFn(){
        let obj={}
         this.columns.forEach(item=>{
           obj[item.key]=''
         })
        console.log('obj',obj)
        this.value.push(obj)
      },
      delRowFn(index){
        this.value.splice(index,1)
      },
    },
  }
</script>

<style scoped>
  #htable td{
    height:35px;
    width:100px;
    border:1px solid #dddddd;
    text-align:center;
  }
  #htable table{
    border:1px solid #dddddd;
    width:100%
  }
</style>
