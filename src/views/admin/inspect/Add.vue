<template>

  <el-main>
    <blockquote class="qcx-quote">发起巡查</blockquote>

    <el-form
      :model="inspectForm"
      class="qcx-add-form"
      label-position="right"
      label-width="120px"
      ref="inspectForm"
      :rules="inspectRules"
      status-icon
      size="medium"
    >
    
    <el-form-item label="巡查专业班级" prop="selectedOptions">
      <el-cascader class="qcx-input"
          ref="myCascader"
          :props="props"
          :options="options"
          clearable
          v-model="inspectForm.selectedOptions">
      </el-cascader>
    </el-form-item>
	  <!--
	  <el-form-item label="巡查辅导员" prop="instructor">
	    <el-select class="qcx-input" v-model="inspectForm.instructor" filterable>
	      <el-option
	        v-for="item in instructorData"
	        v-model="item.value"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value"
	      ></el-option>
	    </el-select>
	  </el-form-item>
-->
      <el-form-item label="巡查项目类型" prop="civilType">
        <el-select
          class="qcx-input"
          v-model="inspectForm.civilType"
          filterable
          @change="typeChange"
        >
          <el-option
            v-model="item.value"
            v-for="item in civilOptions.type"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="巡查项目细则" prop="civilItem">
        <el-select
          class="qcx-input"
          v-model="inspectForm.civilItem"
          filterable
          @change="infoChange"
        >
          <el-option
            v-for="item in civilOptions.info"
            v-model="item.value"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="巡查项目分值" prop="civilScore">
        <el-input class="qcx-input" v-model="inspectForm.civilScore" placeholder="该项会自动填入" disabled></el-input>
      </el-form-item>

      <el-form-item label="巡查备注">
        <el-input class="qcx-input" v-model="inspectForm.remark" placeholder="请输入额外信息，选填"></el-input>
      </el-form-item>

      <el-form-item label="巡查附件">
        <el-button type="primary" size="medium" @click="addFile">添加附件(最多可添加3个)</el-button>
        <input
          type="file"
          name="file"
          ref="inspectFile"
          @change="fileChange"
          class="el-upload__input"
        >
        <el-table :data="inspectForm.files" v-if="inspectForm.files.length > 0">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="附件名" prop="name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-close"
                @click="removeFile(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label>
        <el-button type="primary" @click="submitHandle('inspectForm')">提交</el-button>
        <el-button type="info" @click="formReset('inspectForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import qcxUtils from "../../../util/util.js";
 import Bus from '../../../assets/js/bus.js';

export default {
  name: "inspect",
  
  data() {
    return {
      props: {value: 'value', 
      label: 'label',
      children:'children',
      multiple: true },
		  classList: {
		  major: [],
		  academic: [],
      className: [],
		},
        inspectForm: {
        selectedOptions: [],
        instructor: "",
        civilType: "",
        civilItem: "",
        civilScore: "",
        remark: "",
        files: []
      },
      inspectRules: {
        selectedOptions: [
          {
            required: true,
            message: "请选择专业班级",
            trigger: "change"
          }
        ],
        civilType: [
          {
            required: true,
            message: "请选择项目分类",
            trigger: "change"
          }
        ],
        civilItem: [
          {
            required: true,
            message: "请选择项目细则",
            trigger: "change"
          }
        ],
        civilScore: [
          {
            required: true,
            message: "请输入项目分值",
            trigger: "change"
          }
        ],
        maxFiles: 3
      },
      civilOptions: {
        type: [
          {
            label: "课堂文明",
            value: "课堂文明"
          },
          {
            label: "宿舍文明",
            value: "宿舍文明"
          },
          {
            label: "网络文明",
            value: "网络文明"
          }
        ],
        info: []
      },
      civilData: [],
      instructorData: [],
      classData: [],
      options:[], 
      errostatusinfo:''  
    };
  },
  mounted() {
    new Promise((resolve, reject) => {
      this.getCivilLists();
      resolve();
	 
    }).then(() => {
      //this.getInstructorList();
      this.getClassList();
    });

   
 
  
  },
  beforeDestroy() {},
  
  methods: {
   
  /**
    * 返回标签
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
    * 获取学院专业班级
    */
  getClassList: function () {
    const url = '/api/class/query'
    const settings = qcxUtils.getSettings(url)
    this.$axios(settings)
      .then(res => {
        if (parseInt(res.data.status) === 200) {
          this.classData = res.data.data;
          this.classList.academic = this.dataHandle(this.classData, "", "academic");
          this.options = this.classList.academic;
          for (let i = 0; i < this.options.length; i++) {
            this.options[i]['children'] = []
            let set = new Set()
            for (let j = 0; j < res.data.data.length; j++) {
              if (res.data.data[j]['academic'] === this.options[i]['label']) {
                set.add(res.data.data[j]['major'])
              }
            }
            set.forEach((key, value) => {
              this.options[i]['children'].push({
                'label': key,
                'value': key,
                'children': [],
              })
            })
          }
          for (let i = 0; i < this.options.length; i++) {
            for (let j = 0; j < this.options[i]['children'].length; j++) {
              for (let k = 0; k < res.data.data.length; k++) {
                if (res.data.data[k]['academic'] === this.options[i]['label'] && res.data.data[k]['major'] === this.options[i]['children'][j]['label']) {
                  this.options[i]['children'][j]['children'].push({
                    'label': res.data.data[k]['className'],
                    'value': res.data.data[k]['className'],
                  
                  })
                }
              }
            }
          }
        }
      }).catch(err => {
        this.$message.error("页面上发生错误，请重试或联系管理员")
      })
  },
   /**
     * 多选数据转换成API接口数据
     */
    getclssname:function(data){
        let cont =[];
        for(let i=0;i<data.length; i++)
        {
        cont[i]={};
        cont[i].academic = data[i][0];
        cont[i].major = data[i][1];
        cont[i].className = data[i][2];
    }
    
    return cont;
  },  
    getClasstitle:function(data){
      let cost = [];
      for(let i=0;i<data.length;i++){
        cost[i] = data[i][1]
       
      }
         return cost;
    },      
   /**
    * 获取细则
    */
    getCivilLists: function() {
      const url = "/api/civil/getList";
      const settings = qcxUtils.getSettings(url);
      this.$axios(settings).then(res => {
        this.civilData = res.data.data;
        const civilSet = new Set();
        this.civilData.map(item => {
          civilSet.add(item.civilType);
        });
        this.civilOptions.type = Array.from(civilSet).map(item => {
          return {
            value: item,
            label: item
          };
        });
      });
    },

    /**
     * 选择分类时触发
     */
    typeChange: function() {
      const type = this.inspectForm.civilType;
      this.civilOptions.info =
        this.civilData
          .filter(item => {
            return item.civilType === type;
          })
          .sort((a, b) => {
            return parseInt(a.civilScore) - parseInt(b.civilScore);
          })
          .map(item => {
            return {
              value: item.civilReason,
              label: item.civilReason
            };
          }) || [];
      if (this.civilOptions.info.length > 0) {
        this.inspectForm.civilItem = this.civilOptions.info[0].value;
        this.infoChange();
      }
    },

    /**
     * 选择细则时触发
     */
    infoChange: function() {
      const reason = this.inspectForm.civilItem;
      const civilInfo = this.civilData.filter(item => {
        return item.civilReason === reason;
      });
      if (civilInfo.length > 0) {
        this.inspectForm.leaderScore = civilInfo[0].civilScoreLeader;
        if (
          (this.inspectForm.type === "person" &&
            this.inspectForm.civilType === "宿舍文明" &&
            this.inspectForm.dormHeader === 1) ||
          (this.inspectForm.type === "person" &&
            this.inspectForm.civilType === "网络文明" &&
            this.inspectForm.monitor === 1)
        ) {
          this.inspectForm.civilScore = this.inspectForm.leaderScore;
        } else {
          this.inspectForm.civilScore = civilInfo[0].civilScore;
        }
      }
    },

    /**
     * 获取辅导员列表
     */

	
    // getInstructorList: function(value) {
    //   const url = "/api/master/queryAll";
    //  const data = "queryString=&queryType=all";
    //   const settings = qcxUtils.getSettings(url, data);
    //   qcxUtils.ajaxHandle(this, settings, res => {
    //     if (res !== undefined) {
    //       const insData = res.data.data;
    //       this.instructorData = insData.map(item => {
    //         return {
    //           label: item.masName,
    //           value: item.masAccount
    //         };
    //       });
    //     }
    //   });
    // },

    /**
     * 提交表单处理
     * @param formName
     */
    submitHandle: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dataCommit();
        }
      });
    },

    /**
     * 添加附件
     */
    addFile: function() {
      this.$refs.inspectFile.click();
    },

    /**
     * 移除附件
     */
    removeFile: function(index) {
      this.inspectForm.files.splice(index, 1);
    },

    fileChange: function(ev) {
      let files = Array.prototype.slice.apply(ev.target.files) || [];
      try {
        if (this.inspectForm.files.length >= this.inspectRules.maxFiles) {
          throw new Error("附件数量超过上限");
        }

        files.forEach(file => {
          if (file.name.match(/(.jpg)|(.bmp)|(.png)|(.xls)/) === null) {
            throw new Error(
              "不支持的附件类型(仅支持*.jpg, *.png, *.bmp, *.xls)"
            );
          }
        });

        this.inspectForm.files.push(files[0]);
      } catch (error) {
        this.$message({
          message: error.message,
          type: "warning"
        });
      }
    },
    //通知框
    open1() {
        this.$notify({
          title: '提交巡查成功',
          dangerouslyUseHTMLString: true,
          message: '巡查专业：'+this.getClasstitle(this.inspectForm.selectedOptions)+'</br>巡查细则：'+this.inspectForm.civilItem+'</br>巡查分值：'+this.inspectForm.civilScore+'</br>巡查备注：'+this.inspectForm.remark,
          type: 'success' ,
          duration:8000
        });
      },
        open2() {
        this.$notify({
          title: this.errostatusinfo,
          message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
          type: 'error' ,
          duration:3000
        });
      },
    /**
     * 提交表单操作
     */
    dataCommit: function() {
      const url = "/api/inspection/add";
      let data = new FormData();
      data.append("classInfos", JSON.stringify(this.getclssname(this.inspectForm.selectedOptions)));
      data.append("detailCategory", this.inspectForm.civilType);
      data.append("detailName", this.inspectForm.civilItem);
      data.append("score", this.inspectForm.civilScore);
      data.append("remarks", this.inspectForm.remark);
      this.inspectForm.files.forEach(file => {
      data.append("files", file);
      });
      const config = qcxUtils.getSettings(url, data);
      qcxUtils.ajaxHandle(this, config, res => {
        // if (res !== undefined) {
        //   // this.formReset("inspectForm");
        //   // this.inspectForm.files = [];
        // }
        if(res.status === 200){
          this.open1()
        }
        else{
          this.errostatusinfo = res.info
          this.open2()
        }
     
      });
    },

    /**
     * 表单重置
     * @param formName
     */
    formReset: function(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
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

/*.qcx-btn-group {*/
/*float: left;*/
/*margin-left: 13vh;*/
/*}*/
</style>
