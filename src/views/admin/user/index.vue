<template>
  <el-main>
    <blockquote class="qcx-quote">更新带班表</blockquote>
    <el-form
      :model="chargeForm"
      class="qcx-add-form"
      label-position="right"
      label-width="100px"
      ref="chargeForm"
      :rules="chargeRules"
      status-icon
      size="medium"
    >

      <el-form-item
        label="辅导员"
        prop="instructor"
      >
        <el-select
          class="qcx-input"
          v-model="chargeForm.instructor"
          @change="getmasInstitution"
          filterable
        >
          <el-option
            v-for="item in classList.instructor"
            v-model="item.value"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="学院"
        prop="academic"
      >
        <el-select
          class="qcx-input"
          v-model="chargeForm.academic"
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
        prop="major"
      >
        <el-select
          class="qcx-input"
          v-model="chargeForm.major"
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
        prop="class"
      >
        <el-select
          class="qcx-input"
          v-model="chargeForm.class"
          @change="getoldMaster"
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

      <el-form-item label="">
        <el-button
          type="primary"
          @click="submitHandle('chargeForm')"
        >更新</el-button>
        <el-button
          type="info"
          @click="formReset('chargeForm')"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span class="logotitle"><i class="el-icon-info"></i><strong>相关信息</strong></span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div class="text item">
        {{'所选辅导员原所在学院：'+masInstitution}}

      </div>
      <div class="text item">
        {{' 所选专业班级原辅导员：'+masName}}
      </div>
    </el-card>
  </el-main>

</template>

<script>
import qcxUtils from '../../../util/util.js'

export default {
  name: "add",
  data() {
    return {
      chargeForm: {
        instructor: '',
        academic: '',
        major: '',
        class: ''
      },
      chargeRules: {
        academic: [{
          required: true,
          message: '请选择学院',
          trigger: 'change'
        }],
        major: [{
          required: true,
          message: '请选择专业',
          trigger: 'change'
        }],
        class: [{
          required: true,
          message: '请选择班级',
          trigger: 'change'
        }],
        instructor: [{
          required: true,
          message: '请选择辅导员',
          trigger: 'change'
        }]
      },
      classData: [],
      classList: {
        major: [],
        academic: [],
        class: [],
        instructor: []
      },
      masInstitution: '',
      masName: '',
      newmasName: '',
      formStatus: false
    }
  },
  mounted() {
    this.getClassList()
    this.getInstructorList()
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
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          this.classData = res.data.data
          this.classList.academic = this.dataHandle(this.classData, '', 'academic', '', this.classData)
        }
      })
    },

    /**
     * 专业信息填充处理
     */
    getMajorList: function (value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.chargeForm.academic
      })
      this.classList.major = this.dataHandle(data, "academic", "major", value, this.classData);
      if (this.classList.major.length > 0) {
        this.chargeForm.major = this.classList.major[0].value;
        this.getClassNameList(this.chargeForm.Major);
      }
    },

    /**
     * 班级信息填充处理
     */
    getClassNameList: function (value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.chargeForm.academic && item["major"] === this.chargeForm.major
      })
      this.classList.class = this.dataHandle(data, "major", "className", value, this.classData)
      if (this.classList.class.length > 0) {
        this.chargeForm.class = this.classList.class[0].value
      }
      this.getoldMaster()
    },

    getInstructorList: function (value) {
      const url = '/api/master/queryAll'
      const data = 'queryString=&queryType=all'
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          const insData = res.data.data
          this.classList.instructor = insData.map(item => {
            return {
              label: item.masName,
              value: item.masAccount,
              masInstitution: item.masInstitution

            }
          })
          //  console.log(this.classList.instructor)

        }
      })

    },
    getmasInstitution: function () {
      const cont = this.classList.instructor.filter(item => {
        return item.value === this.chargeForm.instructor
      })
      this.masInstitution = cont[0].masInstitution
      this.newmasName = cont[0].label

      // console.log(this.chargeForm.instructor)
      // console.log(this.masInstitution)
    },

    /**
    * 通过班级获取辅导员
    */
    getoldMaster: function () {
      const url = '/api/class/getMaster'
      const data = `academic=${this.chargeForm.academic}&major=${this.chargeForm.major}&className=${this.chargeForm.class}`
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          this.masName = res.data.data.masName
        }
      })
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
        title: '更新带班表成功',
        dangerouslyUseHTMLString: true,
        message: '辅导员：' + this.newmasName + '</br>新带班学院：' + this.chargeForm.academic + '</br>新专业班级：' + this.chargeForm.class,
        type: 'success',
        duration: 5000
      });
    },
    open2() {
      this.$notify({
        title: '更新带班表失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 3000
      });
    },
    open3() {
      this.$notify({
        title: '权限不足',
        message: '请联系管理员查看自己是否拥有权限！',
        type: 'warning',
        duration: 3000
      });
    },
    /**
     * 提交表单操作
     */
    dataCommit: function () {
      const url = '/api/masterClass/update'
      const data = `masAccount=${this.chargeForm.instructor}&academic=${this.chargeForm.academic}` +
        `&major=${this.chargeForm.major}&className=${this.chargeForm.class}`
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        //  console.log(res.status)
        if (res !== undefined) {
          if (res.status === 200) {
            this.open1()
          }
          else if (res.status === 501 || res.status === 401) {
            this.open3()
          }
          else {
            this.open2()
          }
          this.formStatus = true
          this.masName = this.newmasName
          this.masInstitution = this.chargeForm.academic
          // this.formReset('chargeForm')
        }
      })
    },

    /**
     * 表单重置
     * @param formName
     */
    formReset: function (formName) {
      this.$refs[formName].resetFields();
      this.formStatus = false;
      this.masName = '';
      this.masInstitution = '';
    }
  }
}
</script>

<style scoped>
.el-input,
.el-select,
.qcx-input {
  width: 380px !important;
  min-width: 300px;
  float: left;
}

.qcx-add-form {
  margin: 40px 10px;
}
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  position: relative;
  left: 600px;
  top: -310px;
}
.logotitle {
  margin-right: 3px;
  font-size: 17px;
  color: red;
}
/*.qcx-btn-group {*/
/*float: left;*/
/*margin-left: 13vh;*/
/*}*/
</style>
