<template>
  <el-container class="qcx-container">
    <el-main>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane index="0" label="添加学生">
          <batch-slot :batchType="tabType" :name="activeTabName" v-if="tabType === 'add_student'"></batch-slot>
        </el-tab-pane>
        <el-tab-pane label="添加加减分记录">
          <batch-slot :batchType="tabType" :name="activeTabName" v-if="tabType === 'add_score_record'"></batch-slot>
        </el-tab-pane>
        <el-tab-pane label="更新学生宿舍">
          <batch-slot :batchType="tabType" :name="activeTabName" v-if="tabType === 'update_dorm'"></batch-slot>
        </el-tab-pane>
        <el-tab-pane label="更新宿舍舍长">
          <batch-slot :batchType="tabType" :name="activeTabName" v-if="tabType === 'update_dorm_header'"></batch-slot>
        </el-tab-pane>
        <el-tab-pane label="更新班级班长">
          <batch-slot :batchType="tabType" :name="activeTabName" v-if="tabType === 'update_class_monitor'"></batch-slot>
        </el-tab-pane>
        <el-tab-pane label="更多功能尽请期待" disabled>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import batchSlot from './slot/batch.vue'
  export default {
    components: {
      batchSlot
    },
    data() {
      return {
        activeTab: '',
        activeTabName: '添加学生记录',
        tabTypeName:['add_student', 'add_score_record', 'update_dorm', 'update_dorm_header', 'update_class_monitor'],
        tabType: 'add_student'
      };
    },
    created() {

    },
    methods: {
      handleClick: function(tab, event) {
        this.tabType = this.tabTypeName[parseInt(tab.index)];
        this.activeTabName = tab.label;
      }
    }
  }
</script>

<style scoped>
  .el-form {
    padding: 15 0;
    margin: 0;
  }

  .el-button p {
    margin: 0;
    padding: 0;
  }

  .el-button--text {
    padding: 0;
  }

  .el-form-item {
    float: left;
    margin-bottom: 15px;
  }

  .el-select-dropdown__empty {
    color: #e84343 !important;
  }

  img {
    vertical-align: middle;
    padding-bottom: 2px;
    height: 22px;
    width: 22px;
  }
</style>
