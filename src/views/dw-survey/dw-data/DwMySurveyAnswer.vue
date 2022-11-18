<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="dw-table-form" style="padding-left: 60px;">
          <el-form :inline="true" :model="formInline" class="dw-form-inline" size="medium" >
            <el-form-item label="问卷">
              <el-input v-model="formInline.surveyName" placeholder="请输入查询的问卷" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 40px;">
              <el-button @click="onSubmit(true)">重置</el-button>
              <el-button type="primary" @click="onSubmit(false)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="问卷" >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.surveyDirectory.surveyName }}&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column label="回答时间" >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.endAnDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="回答的题数" >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.completeItemNum!=null ? scope.row.completeItemNum:0 }}&nbsp;题</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" >
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip v-if="isAdmin" effect="dark" content="查看答卷" placement="top">
                  <el-button size="mini" icon="el-icon-view" @click="handleGo(`/no-top/dw-survey/d/data/${scope.row.surveyId}/${scope.row.id}`)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="查看报告" placement="top">
                  <el-button size="mini" icon="el-icon-document" @click="handleDialogTable(scope.row.id)" ></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="dw-pagination">
          <el-pagination
            :page-size="pageSize"
            :current-page="currentPage"
            :total="total"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>

        <div>
          <el-dialog :visible.sync="dialogTableVisible" title="报告列表" append-to-body width="60%" >
            <el-table
              :data="reportItemData"
              stripe
              style="width: 100%">
              <el-table-column property="reportName" label="报告名称" width="250"></el-table-column>
              <el-table-column label="报告状态" width="200" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.generateStatus === 0" >初始化</el-tag>
                  <el-tag v-else-if="scope.row.generateStatus === 1" type="info" >生成中</el-tag>
                  <el-tag v-else-if="scope.row.generateStatus === 2 || scope.row.generateStatus === 4" type="success" >生成成功</el-tag>
                  <el-tag v-else-if="scope.row.generateStatus === 3" type="danger" >生成失败</el-tag>
                  <el-tag v-else disable-transitions style="margin-left: 10px" >未知</el-tag>
                </template>
              </el-table-column>
              <el-table-column property="createDate" label="生成时间"></el-table-column>
              <el-table-column label="操作" width="200" >
                <template slot-scope="scope">
                  <el-button-group>
                    <el-tooltip effect="dark" content="点击跳转" placement="top">
                      <el-button :disabled="scope.row.generateStatus!==2 && scope.row.generateStatus!==4" size="mini" icon="el-icon-document" @click="handlePreviewPdf(scope.row.reportId, scope.row.id)" ></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="下载报告" placement="top">
                      <el-button size="mini" icon="el-icon-download" @click="handleDownloadPdf(scope.row.reportId, scope.row.id)"></el-button>
                    </el-tooltip>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import DwSurveyDcsWrapper from '@/components/common/DwSurveyDcsWrapper'
import {dwMySurveyAnswerList} from '@/api/dw-survey'
import {myReportItemList, reportItemState} from '@/api/dw-report'
import DwAuthorized from '@/utils/dw-authorized'

export default {
  name: 'DwMySurveyAnswer',
  components: {
    DwSurveyDcsWrapper
  },
  data () {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      expUpQu: 0,
      dialogTableVisible: false,
      reportItemData: [],
      formInline: {
        surveyName: null
      },
      isAdmin: DwAuthorized.isAdmin()
    }
  },
  mounted () {
    this.queryList(1)
  },
  methods: {
    handleGo (to) {
      this.$router.push(to)
    },
    handlePush: function (to) {
      this.$router.push(to)
    },
    handleCurrentChange (val) {
      this.queryList(val)
    },
    handlePreviewPdf (reportId, reportItemId) {
      reportItemState(reportId, reportItemId).then((response) => {
        console.log(response)
        const httpResult = response.data
        if (httpResult.resultCode === 200 && (httpResult.data === 2 || httpResult.data === 4)) {
          window.location.href = '/api/dwsurvey/app/report/readPdf?reportItemId='+reportItemId
        } else {
          this.$message.error(httpResult.data)
        }
      }).catch(() => {
        console.log('error')
      })
    },
    handleDownloadPdf (reportId, reportItemId) {
      reportItemState(reportId, reportItemId).then((response) => {
        console.log(response)
        const httpResult = response.data
        if (httpResult.resultCode === 200 && (httpResult.data === 2 || httpResult.data === 4)) {
          window.location.href = '/api/dwsurvey/app/report/downloadPdf?reportItemId='+reportItemId
        } else {
          this.$message.error(httpResult.data)
        }
      }).catch(() => {
        console.log('error')
      })
    },
    handleDialogTable (surveyAnswerId) {
      myReportItemList(surveyAnswerId).then((response) => {
        this.reportItemData = response.data.data
      })
      console.log(this.reportItemData)
      this.dialogTableVisible = true
    },
    queryList (pageNo) {
      dwMySurveyAnswerList(this.pageSize, pageNo, this.formInline.surveyName).then((response) => {
        this.tableData = response.data.data
        this.total = response.data.total
        this.currentPage = response.data.current
        this.pageSize = response.data.pageSize
      })
    },
    onSubmit (reset) {
      if (reset) {
        this.formInline.surveyName = null
      }
      this.queryList(1)
    }
  }
}

</script>
<style scoped>
.dw-pagination{
  padding-top: 20px;
  text-align: right;
}
</style>
