<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="dw-table-form" style="padding-left: 60px;">
          <el-form :inline="true" :model="formInline" class="dw-form-inline" size="medium" >
            <el-form-item label="报告标题">
              <el-input v-model="formInline.surveyName" placeholder="请输入查询的报告标题" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 40px;">
              <el-button @click="onSubmit">重置</el-button>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="dw-table">
          <div class="dw-table-title">
            <el-row :span="24" type="flex" justify="space-between" align="middle">
              <el-col :span="4"><h3>报告列表</h3></el-col>
              <el-col :span="20" style="text-align: right;">
                <el-button type="primary" size="medium" @click="form.id=null;form.name=null;dialogTitle = '创建报告';dialogFormVisible = true" >新建报告</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="报告" >
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p v-html="scope.row.reportName" ></p>
                  <div slot="reference" class="name-wrapper">
                    <div v-if="scope.row.reportNameText != null" v-text="scope.row.reportNameText"></div>
                    <div v-else v-html="scope.row.reportName"></div>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="最小有效样本量" width="120" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.minSampleSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总报告数" width="100" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.reportNum!=null ? scope.row.reportNum:0 }}&nbsp;份</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.reportState === 0" >配置中</el-tag>
                <el-tag v-else-if="scope.row.reportState === 1" type="info" >激活中</el-tag>
                <el-tag v-else-if="scope.row.reportState === 2" type="success" >生效中</el-tag>
                <el-tag v-else-if="scope.row.reportState === 3" type="danger" >不可用</el-tag>
                <el-tag v-else disable-transitions style="margin-left: 10px" >未知</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="180" >
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button-group>
                  <el-tooltip effect="dark" content="编辑报告" placement="top">
                    <!-- <el-button size="mini" content="编辑报告" icon="el-icon-edit" @click="buttonClickA(`/static/diaowen/report-answer-p.html?reportId=${scope.row.id}&surveyId=${scope.row.surveyId}`)" ></el-button>-->
                    <el-button size="mini" icon="el-icon-edit" @click="handleGo(`/no-top/report/d/qu/${scope.row.id}/${scope.row.surveyId}`)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="关联答卷" placement="top">
                    <el-button size="mini" icon="el-icon-share" @click="handlePush(`/dw/survey/c/url/${scope.row.surveyId}`)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="报告详细数据" placement="top">
                    <el-button size="mini" icon="el-icon-s-data" @click="handlePush(`/dw/report/d/item/${scope.row.id}`)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="设置" placement="top">
                    <el-button size="mini" icon="el-icon-setting" @click="handleSetting(scope.row.id, scope.row.minSampleSize, scope.row.reportState)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除报告" placement="top">
                    <el-button size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
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

    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" append-to-body width="40%" >
        <el-form :model="form" label-position="top">
          <el-form-item :label-width="formLabelWidth" label="报告标题" >
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入报告标题" ></el-input>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="选择问卷" >
            <el-select v-model="form.surveyId" @click.native="getSurveyList">
              <el-option
                v-for="item in surveyList"
                :key="item.id"
                :label="item.surveyName"
                :value="item.id">
                <!-- todo: 懒加载&加载动画 -->
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog :visible.sync="dialogFormVisibleSetting" title="报告设置" append-to-body width="40%" >
        <el-form label-position="top">
          <el-form-item :label-width="formLabelWidth" label="报告生成最少样本量：" >
            <el-input-number :min="0" :max="10000" v-model="settingForm.minSampleSize"></el-input-number>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="报告状态变更：" prop="status" class="dw-dialog-form-item">
            <el-radio-group v-model="settingForm.reportState">
              <el-radio :label="0">配置中</el-radio>
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="2">生效</el-radio>
              <el-radio :label="3">不可用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleSetting = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogSettingConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>

import {dwSurveyList} from '@/api/dw-survey'
import {reportCreate, reportList, reportMinSampleSizeAndStatue, reportDelete} from '@/api/dw-report'
import {dwSurveyCopy} from '../../api/dw-survey'

export default {
  name: 'ReportList',
  data: function () {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogTitle: '创建报告',
      formInline: {
        surveyName: null,
        surveyState: null
      },
      dialogFormVisible: false,
      dialogFormVisibleSetting: false,
      form: {
        name: '',
        id: null,
        surveyId: ''
      },
      settingForm: {
        minSampleSize: null,
        reportId: null,
        reportState: 0
      },
      formLabelWidth: '120px',
      surveyList: [{
        id: '111',
        surveyName: 'test'
      }]
    }
  },
  mounted () {
    this.queryList(1)
  },
  methods: {
    buttonClickA (href) {
      window.location.href = href
    },
    // handlePreviewPdf (reportId, itemId) {
    //   reportItemState(reportId, itemId).then((response) => {
    //     console.log(response)
    //     const httpResult = response.data
    //     if (httpResult.resultCode === 200 && httpResult.data === null) {
    //       window.location.href = '/api/dwsurvey/app/report/readPdf'
    //     } else {
    //       this.$message.error(httpResult.data)
    //     }
    //   }).catch(() => {
    //     console.log('error')
    //   })
    // },
    handlePush: function (to) {
      this.$router.push(to)
    },
    handleGo (to) {
      this.$router.push(to)
    },
    handleCopy (index, row) {
      console.log(index, row)
      this.form.id = row.id
      if (row.surveyNameText !== undefined && row.surveyNameText !== null) {
        this.form.name = `${row.surveyNameText}`
      } else {
        this.form.name = `复制报告标题`
      }
      this.dialogFormVisible = true
      this.dialogTitle = '复制报告'
    },
    formatNumber () {
      this.formLabelWidth = this.formLabelWidth.toString().replace(/[^\d]/g, '')
    },
    handleSetting (reportId, minSampleSize, reportState) {
      this.settingForm.reportId = reportId
      this.settingForm.minSampleSize =minSampleSize
      this.settingForm.reportState =reportState
      this.dialogFormVisibleSetting = true
    },
    handleDelete (reportId) {
      this.$msgbox.confirm('确认删除此报告吗？', '删除警告', {type: 'warning', confirmButtonText: '确认删除'}).then(() => {
        const data = {id: [reportId]}
        reportDelete(data).then((response) => {
          console.log(response)
          const httpResult = response.data
          if (httpResult.resultCode === 200) {
            this.$message.success('删除成功，即将刷新数据。')
            this.queryList(1)
          } else {
            this.$message.error('删除报告失败')
          }
        })
      }).catch(() => {})
    },
    onSubmit () {
      console.log('submit!')
      this.queryList(1)
    },
    handleCurrentChange (val) {
      this.queryList(val)
    },
    queryList (pageNo) {
      const {surveyName, surveyState} = this.formInline
      reportList(this.pageSize, pageNo, surveyName, surveyState).then((response) => {
        const resultData = response.data.data
        this.tableData = resultData
        this.total = response.data.total
        this.currentPage = response.data.current
        this.pageSize = response.data.pageSize
      })
    },
    handleDialogConfirm () {
      this.createReport()
    },
    handleDialogSettingConfirm () {
      reportMinSampleSizeAndStatue(this.settingForm.reportId, this.settingForm.minSampleSize, this.settingForm.reportState).then((response) => {
        console.log(response)
        const httpResult = response.data
        if (httpResult.resultCode === 200) {
          this.$message.success('修改成功')
          this.settingForm.minSampleSize = null
          this.dialogFormVisibleSetting = false
          this.queryList(1)
        }
      }).catch(() => {
        this.$message.error('修改失败')
      })
    },
    createReport () {
      const data = {reportName: this.form.name, surveyId: this.form.surveyId}
      reportCreate(data).then((response) => {
        const httpResult = response.data
        const resultData = httpResult.data
        if (httpResult.resultCode === 200) {
          this.dialogFormVisible = false
          this.$confirm('报告创建成功，点击“继续编辑报告”进入报告内容编辑。', '系统提示', {confirmButtonText: '继续编辑报告'}).then(({value}) => {
            // window.location.href=`/static/diaowen/report-answer-p.html?reportId=${resultData.id}&surveyId=${resultData.surveyId}`
            this.handleGo(`/no-top/report/d/qu/${resultData.id}/${resultData.surveyId}`)
          }).catch(() => {
            this.queryList(1)
          })
        } else {
          this.$message.error('创建报告失败')
        }
      })
    },
    copySurvey (surveyId) {
      dwSurveyCopy(surveyId, this.form.name).then((response) => {
        const httpResult = response.data
        const resultData = httpResult.data
        if (httpResult.resultCode === 200) {
          this.dialogFormVisible = false
          this.$confirm('报告复制成功，点击“继续编辑报告”进入报告编辑。', '系统提示', {confirmButtonText: '继续编辑报告'}).then(({value}) => {
            window.location.href=`/static/diaowen/design.html?surveyId=${resultData.id}`
          }).catch(() => {
            this.queryList(1)
          })
        } else {
          this.$message.error('报告复制失败')
        }
      })
    },
    getSurveyList () {
      console.log(this.surveyList)
      const {surveyName, surveyState} = this.formInline
      dwSurveyList(1000, 1, surveyName, surveyState).then((response) => { // fixme: 可选问卷写死了1000个
        this.surveyList = response.data.data
      })
      console.log(this.surveyList)
    }
  }
}
</script>
<style scoped>
.dw-table-form{
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
}
.dw-table{
  background: white;
  padding: 20px;
}
.dw-table .dw-table-title{
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f3f3;
}
.dw-table .dw-table-title h3{
  padding: 0px;
  margin: 0px;
}
.el-form-item{
  margin-bottom: 0px;
}
.dw-pagination{
  padding-top: 20px;
  text-align: right;
}
</style>
