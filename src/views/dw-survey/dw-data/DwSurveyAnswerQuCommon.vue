<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" label-position="left" >
      <div class="dw-qu-item">
        <div class="dw-qu-item-title">
          <span>{{ index + 1 }}、</span>
          <span v-html="question.quTitle" ></span>
          <span>【{{ question.quTypeName }}】</span>
        </div>
        <div class="dw-qu-item-body">
          <div v-if="question.quType === 'RADIO'">
            <div>
              <el-radio-group v-model="question.anRadio.quItemId" >
                <el-radio v-for="(item) in question.quRadios" :key="item.id" :label="item.id" >{{ item.optionName }}</el-radio>
              </el-radio-group>
            </div>
            <div><span>{{ question.anRadio.otherText }}</span></div>
          </div>
          <div v-if="question.quType === 'CHECKBOX'">
            <el-checkbox v-for="(item) in question.quCheckboxs" :key="item.id" :label="item.id" :checked="item.answer" >{{ item.optionName }}</el-checkbox>
          </div>
          <div v-if="question.quType === 'FILLBLANK'">
            <el-row><el-col :span="12"><el-input v-model="question.anFillblank.answer" readonly ></el-input></el-col></el-row>
          </div>
          <div v-if="question.quType === 'MULTIFILLBLANK'">
            <el-form-item v-for="(item,index) in question.quMultiFillblanks" :label="(index+1)+'、'+item.optionName" :key="item.id" >
              <el-input v-model="item.answer" style="width: 360px;" ></el-input>
            </el-form-item>
          </div>
          <div v-if="question.quType === 'SCORE'">
            <el-form-item v-for="(item,index) in question.quScores" :label="(index+1)+'、'+fixOptionName(item.optionName)" :key="item.id" label-width="50%" >
              <el-rate v-model="item.answer" :show-text="true" :texts="scoreText" disabled text-color="#ff9900"></el-rate>
            </el-form-item>
          </div>
          <div v-if="question.quType === 'ORDERQU'">
            <el-form-item v-for="(item,index) in question.quOrderbys" :label="(index+1)+'、'+item.optionName" :key="item.id" >
              <el-input v-model="item.answer" style="width: 360px;" ></el-input>
            </el-form-item>
          </div>
          <div v-if="question.quType === 'UPLOADFILE'">
            <div v-for="(item) in question.anUplodFiles" :key="item.id" >
              <a :href="`${dwResourceUrl}${item.filePath}`" target="_blank">{{ item.fileName }}</a>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>

export default {
  name: 'DwSurveyAnswerInfo',
  props: {
    question: {
      type: Object,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      radio: 3,
      formSize: 'medium',
      rateValue: 3.7,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      dwResourceUrl: '',
      scoreText: ['完全不符合', '比较不符合', '不确定', '比较符合', '完全符合'] // 定义一个字典
    }
  },
  mounted () {
    console.debug(process.env.DW_RESOURCE_URL)
    this.dwResourceUrl = process.env.DW_RESOURCE_URL
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    handleInfo (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    fixOptionName (optionName) {
      console.log(optionName)
      const split = optionName.split('</span>')[0].split('>')
      return split[split.length-1]
    },
    // fixOptionValue (value) {
    //   return ScoreV2Dic[value]
    // },
    handleCurrentChange: function (val) {
      this.queryList(val)
    }
  }
}

</script>
<style scoped>
.dw-page-header{
  padding: 20px;
  background-color: white;
}
.dw-answer-title{
  font-size: 16px;
  padding: 10px;
}
.dw-answer-content{
  padding: 20px;
}
.margin-top{
  margin-top: 20px;
}
.dw-qu-item{
  margin-top: 10px;
}
.dw-qu-item-title{
  padding: 20px 0px;
  color: grey;
}
.dw-qu-item-body{
  margin-left: 10px;
}
</style>
