import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layouts/Layout.vue'
import LoginLayout from '@/components/layouts/LoginLayout.vue'
import NoTopLayout from '@/components/layouts/NoTopLayout.vue'
import DwAnswer from '@/views/dw-survey/dw-collect/DwAnswer'
import DwSurveyList from '@/views/dw-survey/DwSurveyList'
import DwSurveyAttr from '@/views/dw-survey/dw-collect/DwSurveyAttr'
import DwAnswerUrl from '@/views/dw-survey/dw-collect/DwAnswerUrl'
import DwSiteComp from '@/views/dw-survey/dw-collect/DwSiteComp'
import DwSiteShare from '@/views/dw-survey/dw-collect/DwSiteShare'
import DwAnswerWeixin from '@/views/dw-survey/dw-collect/DwAnswerWeixin'
import DwSurveyCharts from '@/views/dw-survey/dw-data/DwSurveyCharts'
import DwSurveyAnswer from '@/views/dw-survey/dw-data/DwSurveyAnswer'
import DwSurveyAnswerInfo from '@/views/dw-survey/dw-data/DwSurveyAnswerInfo'
import DwSurveyReportPdf from '@/views/dw-survey/dw-data/DwSurveyReportPdf'
import DwUser from '@/views/dw-user/DwUser'
import DwUserPwd from '@/views/dw-user/DwUserPwd'
import AdminUserList from '@/views/dw-admin/AdminUserList'
import Login from '@/views/Login'
import ReportList from '@/views/dw-report/ReportList'
import ReportItemList from '@/views/dw-report/ReportItemList'
import DwMySurveyAnswer from '@/views/dw-survey/dw-data/DwMySurveyAnswer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      meta: '首页',
      component: Layout,
      children: [
        {
          path: '/',
          redirect: '/dw/my-survey'
        },
        {
          path: '/dw/my-survey',
          name: 'DwMySurveyAnswer',
          component: DwMySurveyAnswer
        },
        {
          path: '/dw/survey',
          name: 'DwSurveyList',
          component: DwSurveyList
        },
        {
          path: '/dw/survey/c/attr/:id',
          name: 'DwSurveyAttr',
          component: DwSurveyAttr
        },
        {
          path: '/dw/survey/c/url/:id',
          name: 'DwAnswerUrl',
          component: DwAnswerUrl
        },
        {
          path: '/dw/survey/c/comp/:id',
          name: 'DwSiteComp',
          component: DwSiteComp
        },
        {
          path: '/dw/survey/c/share/:id',
          name: 'DwSiteShare',
          component: DwSiteShare
        },
        {
          path: '/dw/survey/c/weixin/:id',
          name: 'DwAnswerWeixin',
          component: DwAnswerWeixin
        },
        {
          path: '/dw/survey/d/chart/:id',
          name: 'DwSurveyCharts',
          component: DwSurveyCharts
        },
        {
          path: '/dw/survey/d/data/:id',
          name: 'DwSurveyAnswer',
          component: DwSurveyAnswer
        },
        {
          path: '/dw/user/pwd',
          name: 'DwUserPwd',
          component: DwUserPwd
        },
        {
          path: '/dw/user',
          name: 'DwUser',
          component: DwUser
        },
        {
          path: '/dw/admin/user',
          name: 'AdminUserList',
          component: AdminUserList
        },
        {
          path: '/dw/report',
          name: 'ReportList',
          component: ReportList
        },
        {
          path: '/dw/report/d/item/:id',
          name: 'ReportItemList',
          component: ReportItemList
        }
      ]
    },
    {
      path: '/diaowen/:sid',
      name: 'DwAnswer',
      component: DwAnswer
    },
    {
      path: '/no-top',
      name: 'NoTopLayout',
      component: NoTopLayout,
      children: [
        {
          path: '/no-top/dw-survey/d/data/:id/:answerId',
          name: 'DwSurveyAnswerInfo',
          component: DwSurveyAnswerInfo
        },
        {
          path: '/no-top/dw-survey/d/report/:reportId/:itemId', // 一份具体的报告
          name: 'DwSurveyReportPdf',
          component: DwSurveyReportPdf
        }
      ]
    },
    {
      path: '/login',
      name: 'LoginLayout',
      component: LoginLayout,
      children: [
        {
          path: '/',
          name: 'Login',
          component: Login
        }
      ]
    }
  ]
})
