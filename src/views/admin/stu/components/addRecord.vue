<template>
  <div style="margin-left:30px;">
    <el-form
      :model="addForm"
      label-position="right"
      label-width="100px"
      ref="civilForm"
      :rules="civilRules"
      status-icon
      size="medium"
    >
      <el-form-item
        label="文明分类"
        prop="civilType"
      >
        <el-select
          class="qcx-input"
          v-model="addForm.civilType"
          filterable
          @change="typeChange"
        >
          <el-option
            v-model="item.value"
            v-for="item in civilOptions.type"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="具体细则"
        prop="civilItem"
      >
        <el-select
          class="qcx-input"
          v-model="addForm.civilItem"
          filterable
          @change="infoChange"
        >
          <el-option
            v-for="item in civilOptions.info"
            v-model="item.value"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!--<el-form-item label="发生时间" prop="time">-->
      <!--<el-date-picker v-model="addForm.time" type="date" align="right" class="qcx-input" placeholder="请选择事件发生日期"-->
      <!--:picker-options="timeOptions.picker" :format="timeOptions.format"-->
      <!--:value-format="timeOptions.format"></el-date-picker>-->
      <!--</el-form-item>-->

      <el-form-item
        label="分值"
        prop="civilScore"
      >
        <el-input
          class="qcx-input"
          v-model="addForm.civilScore"
          placeholder="该项会自动填入"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item
        label="负责人分值"
        prop="leaderScore"
      >
        <el-input
          class="qcx-input"
          v-model="addForm.leaderScore"
          placeholder="该项会自动填入"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          class="qcx-input"
          v-model="addForm.note"
          placeholder="请输入额外信息，选填"
          @change="jianshi"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="qcx-btn-group">
      <el-button
        type="primary"
        @click="submitHandle('civilForm')"
      >立即提交</el-button>
      <el-button
        type="info"
        @click="formReset('civilForm')"
      >重置</el-button>
    </div>
  </div>
</template>

<script>
import qcxUtils from '../../../../util/util'

export default {
  name: "add",
  props: ['stuId', 'stuName', 'stuDorm', 'stuAcademic', 'stuMajor', 'stuClass', 'addType', 'dormHeader', 'monitor'],
  data() {
    return {
      addForm: {
        civilType: '',
        civilItem: '',
        civilScore: '0.0',
        leaderScore: '0.0',
        note: '',
        time: '',
        type: this.addType,
        id: this.stuId,
        name: this.stuName,
        dorm: this.stuDorm,
        academic: this.stuAcademic,
        major: this.stuMajor,
        class: this.stuClass,
        dormHeader: parseInt(this.dormHeader),
        monitor: parseInt(this.monitor)
      },
      civilRules: {
        civilType: [{
          required: true,
          message: '请选择类别',
          trigger: 'change'
        }],
        civilItem: [{
          required: true,
          message: '请选择细项',
          trigger: 'change'
        }],
        time: [{
          required: true,
          message: '请选择发生时间',
          trigger: 'blur'
        }],
        civilScore: [{
          required: true,
          trigger: 'change'
        }],
        leaderScore: [{
          required: true,
          trigger: 'change'
        }]
      },
      civilOptions: {
        type: [
          {
            label: '课堂文明',
            value: '课堂文明'
          },
          {
            label: '宿舍文明',
            value: '宿舍文明'
          },
          {
            label: '网络文明',
            value: '网络文明'
          }
        ],
        info: []
      },
      civilData: [],
      timeOptions: {
        format: 'yyyy-MM-dd',
        picker: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }
          ],
          disabledDate: function (time) {
            return time.getTime() > Date.now()
          }
        }
      },
      formStatus: false
    }
  },
  mounted() {
    this.getCivilLists();
  },
  beforeDestroy() {

  },
  watch: {
    stuId: function (newValue, oldValue) {
      this.addForm.id = newValue;
    },
    stuName: function (news, old) {
      this.addForm.name = news;
    },
    stuClass: function (newss, oldss) {
      this.addForm.class = newss;
    },
    stuDorm: function (newsss, oldsss) {
      this.addForm.dorm = newsss;
    },
    addType: function (newsx, oldsx) {
      this.addForm.type = newsx;
    },
    stuAcademic: function (ne, olss) {
      this.addForm.academic = ne;
    },
    stuMajor: function (nes, olss) {
      this.addForm.major = nes;
    }
  },
  methods: {
    /**
     * 获取细则
     */
    getCivilLists: function () {
      this.formStatus = true
      const url = '/api/civil/getList'
      const settings = qcxUtils.getSettings(url)
      this.$axios(settings)
        .then(res => {
          this.civilData = res.data.data
          const civilSet = new Set()
          this.civilData.map(item => {
            civilSet.add(item.civilType)
          })
          this.civilOptions.type = Array.from(civilSet).map(item => {
            return {
              value: item,
              label: item
            }
          })
        })
    },

    /**
     * 选择分类时触发
     */
    typeChange: function () {
      this.formStatus = false
      const type = this.addForm.civilType;
      this.civilOptions.info = (this.civilData.filter(item => {
        return item.civilType === type
      })
        .sort((a, b) => {
          return parseInt(a.civilScore) - parseInt(b.civilScore)
        })
        .map((item) => {
          return {
            value: item.civilReason,
            label: item.civilReason
          }
        })) || [];
      if (this.civilOptions.info.length > 0) {
        this.addForm.civilItem = this.civilOptions.info[0].value
        this.infoChange()
      }
    },

    /**
     * 选择细则时触发
     */
    infoChange: function () {
      const reason = this.addForm.civilItem;
      const civilInfo = this.civilData.filter(item => {
        return item.civilReason === reason
      })
      if (civilInfo.length > 0) {
        this.addForm.leaderScore = civilInfo[0].civilScoreLeader
        if (this.addForm.type === 'person' && this.addForm.civilType === '宿舍文明' && this.addForm.dormHeader === 1 ||
          this.addForm.type === 'person' && this.addForm.civilType === '网络文明' && this.addForm.monitor === 1) {
          this.addForm.civilScore = this.addForm.leaderScore
        } else {
          this.addForm.civilScore = civilInfo[0].civilScore
        }
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
        title: this.addForm.class + this.addForm.dorm + this.addForm.name + '加分成功',
        dangerouslyUseHTMLString: true,
        message: '加分项目：' + this.addForm.civilItem + '</br>加分分值：+' + this.addForm.civilScore,
        type: 'success',
        duration: 8000
      });
    },
    open2() {
      this.$notify({
        title: this.addForm.name + '文明分更改失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 5000
      });
    },
    open3() {
      this.$notify({
        title: this.addForm.class + this.addForm.dorm + this.addForm.name + '扣分成功',
        dangerouslyUseHTMLString: true,
        message: '扣分项目：' + this.addForm.civilItem + '</br>扣分分值：' + this.addForm.civilScore,
        type: 'success',
        duration: 8000
      });
    },
    /**
     * 提交表单操作
     */
    dataCommit: function () {
      const url = '/api/scoreDetail/add'
      let queryData = '&detailCategory=' + this.addForm.civilType +
        '&detailName=' + this.addForm.civilItem +
        // '&happenDate=' + this.addForm.time +
        '&score=' + this.addForm.civilScore +
        '&scoreForHeader=' + this.addForm.leaderScore +
        '&remarks=' + this.addForm.note +
        '&type=' + this.addForm.type
      if (this.addForm.type === 'person') {
        queryData = queryData + '&stuId=' + this.addForm.id
        this.addForm.class = ''
      }
      if (this.addForm.type === 'dorm') {
        queryData = queryData + '&stuDorm=' + this.addForm.dorm
        this.addForm.name = ''
        this.addForm.class = ''
      }
      if (this.addForm.type === 'class') {
        queryData = 'stuAcademic=' + this.addForm.academic + '&stuMajor=' + this.addForm.major + '&stuClass=' + this.addForm.class + queryData
        this.addForm.name = ''
        this.addForm.dorm = ''
      }
      const settings = qcxUtils.getSettings(url, queryData)
      this.$axios(settings).then(res => {
        if (res !== undefined) {
          this.formStatus = true
          //this.formReset('civilForm')
          if (this.addForm.civilScore >= 0 && res.data.status == 200) {
            this.open1()
          }
          else if (this.addForm.civilScore < 0 && res.data.status == 200) {
            this.open3()
          }
          else {
            this.open2()
          }
        }
        else if (res.data.status !== 200) {
          this.open2()
        }
      })
    },

    /**
     * 表单重置
     * @param formName
     */
    jianshi() {
      if (this.addForm.note !== '') {
        this.formStatus = false
      }
      else {
        this.formStatus = true
      }
    },
    formReset: function (formName) {
      this.$refs[formName].resetFields();
      this.addForm.note = '';
      this.formStatus = true
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

/*.qcx-btn-group {*/
/*float: left;*/
/*margin-left: 13vh;*/
/*}*/
.qcx-btn-group {
  text-align: center;
}
/* .add .el-form-item:focus-within .el-form-item__label {
  color: #02a0ff;
} */
</style>
