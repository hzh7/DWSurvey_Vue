import request from '@/utils/request'
import API from '@/api/index.js'

/**
 * 报告列表
 * @param pageSize
 * @param current
 * @returns {*}
 */
export function reportList (pageSize, current, reportName) {
  const params = {
    pageSize,
    current,
    reportName
  }
  return request({
    url: API.reportList,
    method: 'get',
    params
  })
}

/**
 * 创建报告
 * @param data
 * @returns {*}
 */
export function reportCreate (data) {
  return request({
    url: API.reportCreate,
    method: 'post',
    data
  })
}

/**
 * 报告的生成状态
 * @param surveyId
 * @param surveyState
 * @returns {*}
 */
export function reportItemState (reportId, itemId) {
  const params = {
    reportId,
    itemId
  }
  return request({
    url: API.reportItemState,
    method: 'get',
    params
  })
}

/**
 * 复制问卷
 * @param data
 * @returns {*}
 */
export function dwSurveyCopy (fromSurveyId, surveyName) {
  const params = {
    fromSurveyId,
    surveyName,
    tag: '2'
  }
  return request({
    url: API.surveyCopy,
    method: 'post',
    params
  })
}
/**
 * 获取问卷信息
 * @param surveyId
 * @returns {*}
 */
export function dwSurveyInfo (surveyId) {
  const params = {
    id: surveyId
  }
  return request({
    url: API.surveyInfo,
    method: 'get',
    params
  })
}
/**
 * 更新问卷信息
 * @param data
 * @returns {*}
 */
export function dwSurveyUpdate (data) {
  return request({
    url: API.surveyUpdate,
    method: 'put',
    data
  })
}
/**
 * 更新问卷信息
 * @param data
 * @returns {*}
 */
export function dwSurveyDelete (data) {
  return request({
    url: API.surveyDelete,
    method: 'delete',
    data
  })
}
/**
 * 获取问卷的统计信息
 * @param surveyId
 * @returns {*}
 */
export function dwSurveyReport (surveyId) {
  const params = {
    surveyId
  }
  return request({
    url: API.surveyReport,
    method: 'get',
    params
  })
}
/**
 * 获取问卷的答卷列表
 * @param pageSize
 * @param current
 * @param surveyId
 * @returns {*}
 */
export function dwSurveyAnswerList (pageSize, current, surveyId) {
  const params = {
    pageSize,
    current,
    surveyId
  }
  return request({
    url: API.surveyAnswerList,
    method: 'get',
    params
  })
}
/**
 * 更新问卷信息
 * @param data
 * @returns {*}
 */
export function dwSurveyAnswerDelete (data) {
  return request({
    url: API.surveyAnswerDelete,
    method: 'delete',
    data
  })
}
/**
 * 获取问卷答卷详情
 * @param answerId
 * @returns {*}
 */
export function dwSurveyAnswerInfo (answerId) {
  const params = {
    answerId
  }
  return request({
    url: API.surveyAnswerInfo,
    method: 'get',
    params
  })
}

