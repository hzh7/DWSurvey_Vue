<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="dw-table-form" style="padding-left: 60px;">
          <el-form :inline="true" :model="formInline" class="dw-form-inline" size="medium" >
            <el-form-item label="用户名">
              <el-input v-model="formInline.userName" placeholder="请输入查询的用户" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 40px;">
              <el-button @click="onSubmit">重置</el-button>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="dw-dcs-main">
          <div class="dw-dcs-main-title">
            <el-row type="flex">
              <el-col :span="18"><div style="font-size: 14px;padding: 10px;"><strong>详细报告列表</strong></div></el-col>
              <el-col :span="5" style="text-align: right;padding-right: 2px;" ><el-button type="primary" size="small" @click="handleInit" >初始化报告</el-button></el-col>
              <el-col :span="2" style="text-align: right;padding-right: 2px;" ><el-button type="primary" size="small" @click="handleGenerateBatch" >生成报告</el-button></el-col>
            </el-row>
          </div>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户名" >
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p v-html="scope.row.id" ></p>
                  <div slot="reference" class="name-wrapper">
                    <div v-html="scope.row.userName"></div>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="报告状态" >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.generateStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报告生成时间" >
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" >
              <template slot-scope="scope">
                <el-button-group>
                  <el-tooltip effect="dark" content="查看报告" placement="top">
                    <el-button size="mini" icon="el-icon-view" @click="handlePreviewPdf(scope.row.reportId, scope.row.id)"></el-button>
                    <!--                    <el-button size="mini" icon="el-icon-document" @click="handleGo(`/no-top/dw-survey/d/report/${scope.row.surveyId}/${scope.row.id}`)"></el-button>-->
                  </el-tooltip>
                  <el-tooltip effect="dark" content="查看关联问卷报告" placement="top">
                    <el-button size="mini" icon="el-icon-document" @click="handleGo(`/no-top/dw-survey/d/data/${scope.row.surveyId}/${scope.row.surveyAnswerId}`)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="强制生成" placement="top">
                    <el-button size="mini" icon="el-icon-refresh-left" @click="handleGenerate(scope.row.reportId, scope.row.surveyAnswerId)"></el-button>
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import DwSurveyDcsWrapper from '@/components/common/DwSurveyDcsWrapper'
import {dwSurveyAnswerDelete} from '@/api/dw-survey'
import {reportItemList, reportItemGenerate, reportItemState, reportItemInit} from '@/api/dw-report'
import API from '@/api/index'

export default {
  name: 'DwSurveyAnswer',
  components: {
    DwSurveyDcsWrapper
  },
  data () {
    return {
      reportId: this.$route.params.id,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogFormVisible: false,
      expUpQu: 0,
      formInline: {
        userName: null
      }
    }
  },
  mounted () {
    this.queryList(1)
  },
  methods: {
    onSubmit () {
      console.log('submit!')
      this.queryList(1)
    },
    handleGo (to) {
      this.$router.push(to)
    },
    handlePush: function (to) {
      this.$router.push(to)
    },
    handleDelete (index, row) {
      console.log(index, row)
      this.$msgbox.confirm('确认删除此条答卷吗？', '删除警告', {type: 'warning', confirmButtonText: '确认删除'}).then(() => {
        const data = {id: [row.id]}
        dwSurveyAnswerDelete(data).then((response) => {
          console.log(response)
          const httpResult = response.data
          if (httpResult.resultCode === 200) {
            this.$message.success('删除成功，即将刷新数据。')
            this.queryList(1)
          } else {
            this.$message.error('删除答卷失败')
          }
        })
      }).catch(() => {})
    },
    handleGenerate (reportId, surveyAnswerId) {
      console.log(reportId, surveyAnswerId)
      this.$msgbox.confirm('确认重新生成此报告吗？', '重新生成', {type: 'warning', confirmButtonText: '确认'}).then(() => {
        reportItemGenerate(reportId, surveyAnswerId).then((response) => {
          console.log(response)
          const httpResult = response.data
          if (httpResult.resultCode === 200) {
            this.$message.success('生成成功，即将刷新数据。')
            this.queryList(1)
          } else {
            this.$message.error('生成失败')
          }
        })
      }).catch(() => {})
    },
    handlePreviewPdf (reportId, reportItemId) {
      reportItemState(reportId, reportItemId).then((response) => {
        console.log(response)
        const httpResult = response.data
        if (httpResult.resultCode === 200 && httpResult.data === '生成完毕') {
          window.location.href = '/api/dwsurvey/app/report/readPdf?reportItemId='+reportItemId
        } else {
          this.$message.error(httpResult.data)
        }
      }).catch(() => {
        console.log('error')
      })
    },
    handleCurrentChange (val) {
      this.queryList(val)
    },
    handleGenerateBatch () {
      this.dialogFormVisible = true
    },
    handleInit () {
      reportItemInit(this.reportId).then((response) => {
        const httpResult = response.data
        if (httpResult.resultCode === 200) {
          this.$message.success('报告初始化成功，即将刷新数据。')
          this.queryList(1)
        } else {
          this.$message.error(httpResult.data)
        }
      }).catch(() => {
        console.log('error')
      })
    },
    executeExportData () {
      const downUrl = `${process.env.DW_API_URL}${API.surveyAnswerExport}?surveyId=${this.$route.params.id}&expUpQu=${this.expUpQu}`
      this.dialogFormVisible = false
      window.location.href = downUrl
    },
    queryList (pageNo) {
      reportItemList(this.pageSize, pageNo, this.$route.params.id, this.formInline.userName).then((response) => {
        const resultData = response.data.data
        this.tableData = resultData
        this.total = response.data.total
        this.currentPage = response.data.current
        this.pageSize = response.data.pageSize
      })
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
