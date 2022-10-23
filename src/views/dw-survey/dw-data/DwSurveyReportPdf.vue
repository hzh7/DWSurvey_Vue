<template>
  <div>
    <el-page-header content="答卷详情" class="dw-page-header" @back="goBack" ></el-page-header>

    <iframe style="width: 100%; height: 100%;" class="dw-report-content" src="http://localhost:8080/api/dwsurvey/app/report/download?fileName=test.pdf"></iframe>

  </div>
</template>
<script>

import DwSurveyDcsWrapper from '@/components/common/DwSurveyDcsWrapper'
import {reportItemState} from '@/api/dw-report'

export default {
  name: 'DwSurveyReportPdf',
  components: {
    DwSurveyDcsWrapper
  },
  data () {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogFormVisible: false,
      expUpQu: 0,
      reportStatus: 0,
      reportPdfSrc: '',
      reportId: this.$route.params.reportId,
      itemId: this.$route.params.itemId
    }
  },
  mounted () {
    this.queryReportStatus(this.reportId, this.itemId)
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    handleGo (to) {
      this.$router.push(to)
    },
    handlePush: function (to) {
      this.$router.push(to)
    },
    handleStatus (index, scope) {

    }
  },
  queryReportStatus (reportId, itemId) {
    reportItemState(reportId, itemId).then((response) => {
      const resultData = response.data.data
      this.tableData = resultData
      this.total = response.data.total
      this.currentPage = response.data.current
      this.pageSize = response.data.pageSize
    })
  }
}

</script>
<style scoped>
.dw-page-header{
  padding: 20px;
  background-color: white;
}

.dw-report-content{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  border:0;
}

</style>
