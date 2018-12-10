<template>
  <div class="jtk-demo-main" id="versionToTestWorkflow">
    <!-- demo -->
    <div class="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan" style="height:600px;margin-top: -120px" id="canvas">
      <div class="window jtk-node" id="flowchartWindow1" style="background: green"><strong>开始</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow2" style="background: #4a6785; " v-bind:class="{processCheck:status==1}"><strong>测试经理审核</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow3" style="background: yellow"    v-bind:class="{processCheck:status==2}" ><strong>评估测试中</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow4" style="background: #4a6785"   v-bind:class="{processCheck:status==3}"><strong>退回申请</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow5" style="background: green"  v-bind:class="{processCheck:status==7}"><strong>撤销关闭</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow6" style="background: yellow" v-bind:class="{processCheck:status==4}"><strong>测试中</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow7" style="background: green"  v-bind:class="{processCheck:status==5}"><strong>测试异常结束</strong><br/><br/></div>
      <div class="window jtk-node" id="flowchartWindow8" style="background: green"  v-bind:class="{processCheck:status  ==6}"><strong>测试正常结束</strong><br/><br/></div>
    </div>
    <!-- /demo -->
    <!-- explanation -->

    <!-- /explanation -->
  </div>

</template>

<script>
  import  '../../../assets/workflow/jsplumb.js'
  import {demoInit} from '../../../assets/workflow/versiontotest/demo.js'
  export default {
    created() {},
    props:['status'],
    mounted() {
      demoInit()
    },
    data() {
      return {
      };
    },
    methods: {
      listMore(n) {}
    }
  };
</script>

<style scoped>
  @import "../../../assets/workflow/jsplumb.css";
  @import "../../../assets/workflow/jsplumbtoolkit-defaults.css";
  @import "../../../assets/workflow/jsplumbtoolkit-demo.css";
  @import "../../../assets/workflow/versiontotest/demo.css";
  @import "../../../assets/workflow/versiontotest/main.css";
  #versionToTestWorkflow .processCheck{
    border: solid #c5221f!important;
  }
</style>
