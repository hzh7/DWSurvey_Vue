<template>
  <div>
    <el-page-header content="报告题目配置" class="dw-page-header" @back="goBack" ></el-page-header>
    <div class="dw-answer-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="16" :push="4">
          <div style="background: white;">
            <div class="dw-answer-title" style="padding-top: 30px;padding-bottom: 0px;">问题题目列表</div>
            <div style="padding: 0px 20px 30px 20px;">
              <div v-for="(question,index) in survey.questions" :key="question.id" :id="question.id" >
                <el-form ref="form" :model="form" style=" box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)" label-width="80px" label-position="left" >
                  <div class="dw-qu-item">
                    <div class="dw-qu-item-title">
                      <span>{{ index + 1 }}、</span>
                      <span v-html="question.quTitle" ></span>
                      <span>【{{ question.quTypeName }}】</span>
                    </div>
                    <div class="dw-qu-item-body">
                      <div v-if="question.quType === 'RADIO'">
                        <div>
                          <el-radio-group v-model="question.anRadio.quItemId" disabled>
                            <el-radio v-for="(item) in question.quRadios" :key="item.id" :label="item.id" >{{ item.optionName }}</el-radio>
                          </el-radio-group>
                        </div>
                        <div><span>{{ question.anRadio.otherText }}</span></div>
                      </div>
                      <div v-if="question.quType === 'CHECKBOX'" disabled>
                        <el-checkbox v-for="(item) in question.quCheckboxs" :key="item.id" :label="item.id" :checked="item.answer">{{ item.optionName }}</el-checkbox>
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
                        <el-form-item v-for="(item) in question.quScores" :label="' '+fixOptionName(item.optionName)" :key="item.id" label-width="50%" >
                          <el-switch
                            v-show="question.reportQuType"
                            v-model="item.scoringType"
                            :active-value="0"
                            :inactive-value="1"
                            active-text="正向赋分"
                            inactive-text="反向赋分">
                          </el-switch>
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
                  <br>
                </el-form>
                <div class="dw-qu-item-tail">
                  <span> 是否在报告中显示：</span>
                  <el-switch
                    v-model="question.showInReport"
                    active-text="是"
                    inactive-text="否">
                  </el-switch>
                  <div v-if="question.showInReport === true">
                    <span> 在报告中显示的名称：</span>
                    <el-input v-model="question.reportQuTitle" size="small" style="width: 160px;" ></el-input>
                    <el-radio-group v-model="question.reportQuType" style="margin-left: 20px">
                      <el-radio :label="0">信息题</el-radio>
                      <el-radio :label="1">量表题</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="dw-answer-footer">
              <el-button @click="goBack">取 消</el-button>
              <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>

import DwSurveyDcsWrapper from '@/components/common/DwSurveyDcsWrapper'
// import DwSurveyAnswerQuCommon from '../dw-survey/dw-data/DwSurveyAnswerQuCommon'
import {surveyAll} from '@/api/dw-survey'

export default {
  name: 'DwSurveyAnswerInfo',
  components: {
    DwSurveyDcsWrapper
    // DwSurveyAnswerQuCommon
  },
  data () {
    return {
      survey: {
        questions: [{
          showInReport: true
        }]
      },
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
      value1: true
    }
  },
  mounted () {
    // this.querySurveyAll()

    this.querySurveyAnswer()
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
      const split = optionName.split('</span>')[0].split('>')
      return split[split.length-1]
    },
    handleConfirm () {
      console.log(this.survey.questions)
    },
    querySurveyAnswer () {
      surveyAll(this.$route.params.surveyId).then((response) => {
        this.survey.questions = response.data.data.questions

        for (let i=0; i < this.survey.questions.length; i++) {
          // this.$set(this.survey.questions[i], 'showInReport', true)
          const questionData = this.survey.questions[i]
          if (questionData.showInReport === null) {
            questionData.showInReport = true
          }
          const quType = questionData.quType
          let quOptionsObj
          if (quType==='CHECKBOX') {
            questionData.quTypeName = '多选题'
            quOptionsObj = questionData.quCheckboxs
          } else if (quType==='RADIO') {
            questionData.quTypeName = '单选题'
            // questionData.showInReport = true
            quOptionsObj = questionData.quRadios
          } else if (quType==='FILLBLANK') {
            questionData.quTypeName = '填空题'
          } else if (quType==='SCORE') {
            questionData.quTypeName = '评分题'
            quOptionsObj = questionData.quScores
            questionData.reportQuType = 1
          } else if (quType==='ORDERQU') {
            questionData.quTypeName = '排序题'
            quOptionsObj = questionData.quOrderbys
          } else if (quType==='MULTIFILLBLANK') {
            questionData.quTypeName = '多项填空题'
            quOptionsObj = questionData.quMultiFillblanks
          } else if (quType==='UPLOADFILE') {
            questionData.quTypeName = '文件上传题'
          } else {
            questionData.quTypeName = quType
          }
          if (quType==='CHECKBOX' || quType==='SCORE' || quType==='ORDERQU' || quType==='MULTIFILLBLANK') {
            for (let j=0; j < quOptionsObj.length; j++) {
              const item = quOptionsObj[j]
              if (quType==='CHECKBOX') {
                const anCheckboxs = questionData.anCheckboxs
                for (let k=0; k<anCheckboxs.length; k++) {
                  if (anCheckboxs[k].quItemId === item.id) {
                    item.answer = true
                    break
                  }
                }
              } else if (quType==='SCORE') {
                const anScores = questionData.anScores
                // this.$set(this.survey.questions[i].quScores[j], 'scoringType', item.scoringType)
                // console.log('item.scoringType:', item.scoringType)
                for (let k=0; k<anScores.length; k++) {
                  if (anScores[k].quRowId === item.id) {
                    if (anScores[k].answserScore != null) {
                      item.answer = parseInt(anScores[k].answserScore)
                      break
                    }
                  }
                }
              } else if (quType==='ORDERQU') {
                const anOrders = questionData.anOrders
                for (let k=0; k<anOrders.length; k++) {
                  if (anOrders[k].quRowId === item.id) {
                    item.answer = anOrders[k].orderyNum
                    break
                  }
                }
              } else if (quType==='MULTIFILLBLANK') {
                const anDFillblanks = questionData.anDFillblanks
                for (let k=0; k<anDFillblanks.length; k++) {
                  if (anDFillblanks[k].quItemId === item.id) {
                    item.answer = anDFillblanks[k].answer
                    break
                  }
                }
              }
            }
          }
          questionData.reportQuTitle = questionData.quTitle
        }
      })
    },
    handleCurrentChange: function (val) {

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
.dw-answer-footer{
  font-size: 16px;
  padding: 10px;
  margin: 0 auto;
  text-align: center
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
.dw-qu-item-tail{
  padding: 20px 0px;
  color: grey;
  margin-left: 10px;
}
</style>
