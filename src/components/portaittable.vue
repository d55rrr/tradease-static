<template >
  <div id="ptable">
    <table class="portaittable" :style="styleObject">
      <tr v-for="index in rowCount">
        <td class="column">{{rows[index-1].label}}</td>
        <td @click="editThis(index)">
          <span v-if="rows[index-1].type!='text'&&rows[index-1].type!='textarea'" v-show="index!=editIndex">
              <p v-if="rows[index-1].type=='selectId'||rows[index-1].type=='selectValue'||rows[index-1].type=='selectMulti'" > {{showName(index-1,value[rows[index-1].key])}}</p>
              <p v-else>{{value[rows[index-1].key]}}</p>
          </span>
          <el-input   v-if="rows[index-1].type=='text'"   v-model="value[rows[index-1].key]"  @blur="blurFn" />
          <el-input  type="textarea" v-if="rows[index-1].type=='textarea'"   v-model="value[rows[index-1].key]"  @blur="blurFn" />
          <el-date-picker  v-if="rows[index-1].type=='date'"  value-format="yyyy-MM-dd"  v-model="value[rows[index-1].key]" type="date" placeholder="选择日期" v-show="index==editIndex" @blur="blurFn"  >
          </el-date-picker>
          <el-select v-if="rows[index-1].type=='selectId'" v-model="value[rows[index-1].key]" placeholder="请选择" v-show="index==editIndex"  @change="changeFn($event,rows[index-1].key)" @blur="blurFn"  collapse-tags   >
            <el-option
              v-for="item in rows[index-1].selectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-if="rows[index-1].type=='selectValue'" v-model="value[rows[index-1].key]" placeholder="请选择" v-show="index==editIndex"   @blur="blurFn"  @focus="focusFn(index)" collapse-tags   >
            <el-option
              v-for="item in rows[index-1].selectList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-if="rows[index-1].type=='selectMulti'"  v-model="value[rows[index-1].key]" placeholder="请选择" v-show="index==editIndex"   @blur="blurFn" multiple   >
            <el-option
              v-for="item in rows[index-1].selectList"
              :key="item.id"
              :label="item.realnameWithDeptName"
              :value="item.id">
            </el-option>
          </el-select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        styleObject:{},
        editIndex:0
      }
    },
    created() {
    },
     props: ['rows', 'value','tableStyle'],
      computed: {
    rowCount: function() {
      return this.rows.length;
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
      editThis(index){
       this.editIndex=index
      },
      showName(index,val){
        if(!val||val==''){
          return ''
        }
        if(this.rows[index].type=='selectId'){
          let obj=this.rows[index].selectList.find(item=>item.id==val)
          if(obj){
            return obj.name
          }
        }else if(this.rows[index].type=='selectValue'){
          let obj=this.rows[index].selectList.find(item=>item.value==val)
          if(obj){
            return obj.name
          }
        }else if(this.rows[index].type=='selectMulti'){
          let strArr=[]
         this.rows[index].selectList.forEach(item=>{
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

      }
    },
  }
</script>

<style scoped>
  #ptable td{
    height:35px;
    width:100px;
    border:1px solid #dddddd;
    text-align:center;
  }
  #ptable table{
    border:1px solid #dddddd;
    width:100%
  }
</style>
