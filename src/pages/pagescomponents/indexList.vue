<template>
    <div id="indexList">
        <el-row type="flex" class="row-bg index_Con_right_con_row" justify="space-around">
                      <el-col :span="7">
                        <div class="index_Con_right_con_row_tit">
                          <span>转测试版本(待处理)</span>
                          <i @click="listMore(0)">更多>></i>
                        </div>
                        <div class="index_Con_right_con_row_con">
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                        </div>
                      </el-col>

                    <el-col :span="7">
                        <div class="index_Con_right_con_row_tit">
                          <span>待执行用例</span>
                          <i @click="listMore(1)">更多>></i>
                        </div>
                        <div class="index_Con_right_con_row_con">
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                        </div>
                      </el-col>

                       <el-col :span="7">
                        <div class="index_Con_right_con_row_tit">
                          <span>待执行用例</span>
                          <i @click="listMore(2)">更多>></i>
                        </div>
                        <div class="index_Con_right_con_row_con">
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                          <p>AT-1 XXXXXXXXXXXXX</p>
                        </div>
                      </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  created() {
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {
    listMore(n) {}
  }
};
</script>

<style lang="less">
</style>
