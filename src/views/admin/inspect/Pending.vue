<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">待处理巡查</blockquote>
      <el-table :data="pendingTable.data">
        <el-table-column label="发起账号" prop="initiator" width="80"></el-table-column>
        <el-table-column label="巡查项目" prop="detailCategory"></el-table-column>
        <el-table-column label="巡查细则" prop="detailName"></el-table-column>
        <el-table-column label="提交时间" prop="time" sortable></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status==='pass'"
              size="mini"
              type="success"
              icon="el-icon-success"
            >已处理</el-tag>
            <el-tag
              v-if="scope.row.status==='wait'"
              size="mini"
              type="warning"
              icon="el-icon-warning"
            >待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              :disabled="!!!scope.row.filePath"
              @click="showFiles(scope.row)"
            >查看附件</el-button>
            <el-button
              v-if="scope.row.status==='wait'"
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="inspectHandle(scope.row)"
            >处理巡查</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="qcx-pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pendingTable.data.length"
        :current-page.sync="pendingTable.currentPage"
        :page-size="pendingTable.pageSize"
        :page-sizes="[10,25,50,100]"
        @size-change="tableSizeChange"
        @current-change="tablePageChange"
      ></el-pagination>
    </el-main>

    <el-dialog
      :visible.sync="dialogOptions.file.visible"
      :width="dialogOptions.width"
      :title="dialogOptions.file.title"
      :center="false"
    >
      <el-table :data="dataList.file">
        <el-table-column label="附件名" prop="label"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" @click="download(scope.row.path)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogOptions.inspect.visible"
      :width="dialogOptions.width"
      :title="dialogOptions.inspect.title"
      :center="false"
    >
      <el-form class="qcx-form-container">
        <el-form-item label="学院">
          <el-select class="qcx-input" v-model="dialog.academic" @change="getMajorList" filterable>
            <el-option
              v-model="item.value"
              v-for="item in dataList.academic"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select class="qcx-input" v-model="dialog.major" @change="getClassNameList" filterable>
            <el-option
              v-for="item in dataList.major"
              v-model="item.value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班级">
          <el-select v-model="dialog.class" placeholder="请选择班级" filterable>
            <el-option
              v-for="item in dataList.class"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              @change="getStuData"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学生">
          <el-select v-model="dialog.stuId" placeholder="请选择学生" filterable>
            <el-option
              v-for="item in dataList.student"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="infoSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>
<script>
import qcxUtils from "../../../util/util.js";

export default {
  data() {
    return {
      classData: [],
      pendingData: [],
      pendingTable: {
        data: [],
        currentPage: 1,
        pageSize: 10,
        height: 540
      },
      dialogOptions: {
        inspect: {
          visible: false,
          title: "巡查处理"
        },
        file: {
          visible: false,
          title: "附件下载"
        },
        status: false,
        width: "55%"
      },
      dialog: {
        inspectionId: "",
        stuId: "",
        stuName: "",
        academic: "",
        major: "",
        class: ""
      },
      dataList: {
        major: [],
        academic: [],
        class: [],
        student: [],
        file: []
      }
    };
  },
  mounted() {
    this.tableInit();
  },
  methods: {
    /**
     * 数据处理
     * @param _data
     * @param _from 源属性名
     * @param _to 目标属性名
     * @param value
     */
    dataHandle: function(_data, _from, _to, value) {
      return Array.from(
        new Set(
          _data.map(item => {
            return item[_to];
          })
        )
      ).map(item => {
        return {
          label: item,
          value: item
        };
      });
    },

    /**
     * 表格初始化
     */
    tableInit() {
      this.dialogInit();
      this.getPendingData();
    },

    /**
     * 对话框内容初始化
     */
    dialogInit() {
      for (let key in this.dialog) {
        this.dialog[key] = "";
      }
    },

    /**
     * 显示附件
     */
    showFiles(row) {
      if (row.filePath) {
        this.dataList.file = JSON.parse(row.filePath).map((item, index) => {
          return {
            path: item,
            label: `${index}.${item.split(".")[1]}`
          };
        });
        this.dialogOptions.file.visible = true;
      }
    },

    /**
     * 附件下载
     */
    download(path) {
      const url = "/api/inspection/download";
      const data = `filePath=${path}`;
      const config = qcxUtils.getSettings(url, data);
      config.responseType = "arraybuffer";
      window.open(`${config.url}?${data}`);
    },

    /**
     * 获取待处理记录
     */
    getPendingData: function() {
      const url = "/api/inspection/getItemsNeedToWork";
      const settings = qcxUtils.getSettings(url);
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          if (res.data.data) {
            let page = this.pendingTable.currentPage;
            let size = this.pendingTable.pageSize;
            this.pendingData = res.data.data;
            this.pendingTable.data = this.pendingData.slice(
              (page - 1) * size,
              page * size
            );
          }
        }
      });
    },

    /**
     * 专业信息填充处理
     */
    getMajorList: function(value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.dialog.academic;
      });
      this.dataList.major = this.dataHandle(data, "academic", "major", value);
      if (this.dataList.major.length > 0) {
        this.dialog.major = this.dataList.major[0].value;
        this.getClassNameList(this.dialog.major);
      }
    },

    /**
     * 班级信息填充处理
     */
    getClassNameList: function(value) {
      const data = this.classData.filter(item => {
        return (
          item["academic"] === this.dialog.academic &&
          item["major"] === this.dialog.major
        );
      });
      this.dataList.class = this.dataHandle(data, "major", "className", value);
      if (this.dataList.class.length > 0) {
        this.dialog.class = this.dataList.class[0].value;
        this.getStuData();
      }
    },

    /**
     * 获取班级信息
     */
    getClassList: function() {
      const url = "/api/class/query";
      const settings = qcxUtils.getSettings(url);
      this.$axios(settings)
        .then(res => {
          if (parseInt(res.data.status) === 200) {
            this.classData = res.data.data;
            this.dataList.academic = this.dataHandle(
              this.classData,
              "",
              "academic"
            );
          }
        })
        .catch(err => {
          this.$message.error("页面上发生错误，请重试或联系管理员");
        });
    },

    /**
     * 获取学生数据
     */
    getStuData: function() {
      const url = "/api/student/query";
      const data = `academic=${this.dialog.academic}&major=${
        this.dialog.major
      }&className=${this.dialog.class}&type=stuClass`;
      const settings = qcxUtils.getSettings(url, data);
      qcxUtils.ajaxHandle(this, settings, res => {
        this.dataList.student = res.data.data.map(item => {
          return {
            value: item.stuId,
            label: item.stuName
          };
        });
      });
    },

    /**
     * 巡查处理
     */
    inspectHandle: function(row) {
      this.dialog.inspectionId = row.id;
      new Promise(resolve => {
        this.getClassList();
        resolve();
      }).then(() => {
        this.dialogOptions.inspect.visible = true;
      });
    },

    /**
     * 巡查处理
     */
    infoSubmit: function(row) {
      let url = "/api/inspection/pass";
      let data =
        "inspectionId=" +
        this.dialog.inspectionId +
        "&stuId=" +
        this.dialog.stuId;
      const settings = qcxUtils.getSettings(url, data);
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          this.dialogOptions.inspect.visible = false;
          this.tableInit();
        }
      });
    },

    /**
     * 改变每页显示条数时触发
     * @param size 每页显示条数
     */
    tableSizeChange: function(size) {
      let page = this.pendingTable.currentPage;
      this.pendingTable.pageSize = size;
      this.pendingTable.data = this.studentData.slice(
        (page - 1) * size,
        page * size
      );
    },

    /**
     * 改变当前页时触发
     * @oaram page 页码
     */
    tablePageChange: function(page) {
      let size = this.pendingTable.pageSize;
      this.pendingTable.currentPage = page;
      this.pendingTable.data = this.studentData.slice(
        (page - 1) * size,
        page * size
      );
    }
  },
  destroyed() {
    this.dataList = null;
  }
};
</script>
<style scoped>
.el-icon-warning {
  color: #ffffff;
}

.qcx-pagination {
  margin-top: 15px;
}

.el-form {
  display: grid;
  justify-items: center;
  align-items: center;
}

.el-form-item {
  display: inline-flex;
}

.el-input,
.el-select,
.qcx-input {
  width: 380px !important;
  min-width: 300px;
  float: left;
}
</style>

