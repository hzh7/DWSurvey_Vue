<template>
  <div>
    <el-page-header content="答卷详情" class="dw-page-header" @back="goBack" ></el-page-header>

    <iframe style="width: 100%; height: 100%;" class="dw-report-content" src="/static/xxx.pdf"></iframe>

  </div>
</template>
<script>

import DwSurveyDcsWrapper from '@/components/common/DwSurveyDcsWrapper'

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
      expUpQu: 0
    }
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
      console.log(index, scope)
      this.$msgbox.confirm('确认删除此条答卷吗？', '删除警告', {type: 'warning', confirmButtonText: '确认删除'}).then(() => {
        const data = {id: [scope.row.id]}
        console.log(data)
      }).catch(() => {})
    }
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
