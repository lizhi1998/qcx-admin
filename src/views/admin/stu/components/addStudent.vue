<template>
  <!-- <blockquote class="qcx-quote">添加学生</blockquote> -->
  <el-form
    :model="addForm"
    class="qcx-add-form"
    label-position="right"
    label-width="100px"
    ref="addForm"
    :rules="stuRules"
    status-icon
    size="medium"
  >
    <el-form-item
      label="学号"
      prop="stuId"
    >
      <el-input
        class="qcx-input"
        v-model="addForm.stuId"
        placeholder="请输入学号"
      ></el-input>
    </el-form-item>

    <el-form-item
      label="姓名"
      prop="stuName"
    >
      <el-input
        class="qcx-input"
        v-model="addForm.stuName"
        placeholder="请输入姓名"
      ></el-input>
    </el-form-item>

    <el-form-item
      label="学院"
      prop="stuAcademic"
    >
      <el-select
        class="qcx-input"
        v-model="addForm.stuAcademic"
        @change="getMajorList"
        filterable
      >
        <el-option
          v-model="item.value"
          v-for="item in classList.academic"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label="专业"
      prop="stuMajor"
    >
      <el-select
        class="qcx-input"
        v-model="addForm.stuMajor"
        @change="getClassNameList"
        filterable
      >
        <el-option
          v-for="item in classList.major"
          v-model="item.value"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label="班级"
      prop="stuClass"
    >
      <el-select
        class="qcx-input"
        v-model="addForm.stuClass"
        filterable
      >
        <el-option
          v-for="item in classList.class"
          v-model="item.value"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="宿舍">
      <el-input
        class="qcx-input"
        v-model="addForm.stuDorm"
        placeholder="请输入学生宿舍（可留空）"
      ></el-input>
    </el-form-item>

    <el-form-item label="">
      <el-button
        type="primary"
        @click="submitHandle('addForm')"
      >添加</el-button>
      <el-button
        type="info"
        @click="formReset('addForm')"
      >重置</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import qcxUtils from '../../../../util/util'

export default {
  name: "add",
  data() {
    return {
      addForm: {
        stuId: '',
        stuName: '',
        stuAcademic: '',
        stuMajor: '',
        stuClass: '',
        stuDorm: '',
      },
      stuRules: {
        stuAcademic: [{
          required: true,
          message: '请选择学院',
          trigger: 'change'
        }],
        stuMajor: [{
          required: true,
          message: '请选择专业',
          trigger: 'change'
        }],
        stuClass: [{
          required: true,
          message: '请选择班级',
          trigger: 'change'
        }],
        stuId: [{
          required: true,
          message: '请输入学号',
          trigger: 'change'
        }],
        stuName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'change'
        }]
      },
      classData: [],
      classList: {
        major: [],
        academic: [],
        class: []
      },
      formStatus: false
    }
  },
  mounted() {
    this.getClassList();
  },
  beforeDestroy() {

  },
  methods: {
    /**
     * 数据处理
     * @param _data
     * @param _from 源属性名
     * @param _to 目标属性名
     * @param value
     */
    dataHandle: function (_data, _from, _to, value) {
      return Array.from(new Set(
        _data.map(item => {
          return item[_to]
        })
      ))
        .map(item => {
          return {
            label: item,
            value: item
          }
        })
    },

    /**
     * 获取班级信息
     */
    getClassList: function () {
      const url = '/api/class/query'
      const settings = qcxUtils.getSettings(url)
      this.$axios(settings)
        .then(res => {
          if (parseInt(res.data.status) === 200) {
            this.classData = res.data.data;
            this.classList.academic = this.dataHandle(this.classData, "", "academic");
          }
        })
        .catch(err => {
          this.$message.error("页面上发生错误，请重试或联系管理员")
        })
    },

    /**
     * 专业信息填充处理
     */
    getMajorList: function (value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.addForm.stuAcademic
      })
      this.classList.major = this.dataHandle(data, "academic", "major", value);
      if (this.classList.major.length > 0) {
        this.addForm.stuMajor = this.classList.major[0].value;
        this.getClassNameList(this.addForm.stuMajor);
      }
    },

    /**
     * 班级信息填充处理
     */
    getClassNameList: function (value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.addForm.stuAcademic && item["major"] === this.addForm.stuMajor
      })
      this.classList.class = this.dataHandle(data, "major", "className", value);
      if (this.classList.class.length > 0) {
        this.addForm.stuClass = this.classList.class[0].value;
      }
    },

    /**
     * 提交表单处理
     * @param formName
     */
    submitHandle: function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dataCommit();
        }
      })
    },
    //通知框
    open1() {
      this.$notify({
        title: '添加学生' + this.addForm.stuName + '成功',
        dangerouslyUseHTMLString: true,
        message: '学号：' + this.addForm.stuId + '</br>姓名：' + this.addForm.stuName + '</br>学院：' + this.addForm.stuAcademic + '</br>专业：' + this.addForm.stuMajor + '</br>班级：' + this.addForm.stuClass,
        type: 'success',
        duration: 8000
      });
    },
    open2() {
      this.$notify({
        title: '添加学生' + this.addForm.stuName + '失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 8000
      });
    },
    /**
     * 提交表单操作
     */
    dataCommit: function () {
      const url = '/api/student/add'
      const data = `stuId=${this.addForm.stuId}&stuName=${this.addForm.stuName}` +
        `&stuAcademic=${this.addForm.stuAcademic}&stuMajor=${this.addForm.stuMajor}` +
        `&stuClass=${this.addForm.stuClass}&stuDorm=${this.addForm.stuDorm}`

      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        // console.log(res)
        if (res !== undefined) {
          this.open1()
          this.formStatus = true
          // this.formReset('addForm')
          this.$emit("updatas", data);
        }
        else { this.open2() }
      })
    },

    /**
     * 表单重置
     * @param formName
     */
    formReset: function (formName) {
      this.$refs[formName].resetFields();
      this.formStatus = false;

    }
  }
}
</script>

<style scoped>
.el-input,
.el-select,
.qcx-input {
  width: 250px !important;
  min-width: 100px;
  float: left;
}

.qcx-add-form {
  margin-left: 0;
  margin-top: 15px;
}

/*.qcx-btn-group {*/
/*float: left;*/
/*margin-left: 13vh;*/
/*}*/
</style>
