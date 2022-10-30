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
 * 指定reportId报告的详细报告
 * @param pageSize
 * @param current
 * @param reportId
 * @param userName
 * @returns {*}
 */
export function reportItemList (pageSize, current, reportId, userName) {
  const params = {
    pageSize,
    current,
    reportId,
    userName
  }
  return request({
    url: API.reportItemList,
    method: 'get',
    params
  })
}
/**
 * 指定reportId报告的详细报告
 * @returns {*}
 * @param surveyId
 */
export function myReportItemList (surveyAnswerId) {
  const params = {
    surveyAnswerId
  }
  return request({
    url: API.myReportItemList,
    method: 'get',
    params
  })
}

/**
 * 指定reportId报告的详细报告
 */
export function reportItemGenerate (reportId, surveyAnswerId) {
  const params = {
    reportId,
    surveyAnswerId
  }
  return request({
    url: API.reportItemGenerate,
    method: 'get',
    params
  })
}

/**
 * 初始化报告的所有报告项
 */
export function reportItemInit (reportId) {
  const params = {
    reportId
  }
  return request({
    url: API.reportItemInit,
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

