import qcxUtil from '../util/util.js'

/**
 * 添加巡查
 * @param {*} this 
 * @param {*} data 
 */
export function add(this, data) {
  let config = qcxUtil.getSettings({
    url: '/api/inspection/add',
    data: data
  })
  return this.$axios(config)
}

/**
 * 通过巡查
 * @param {*} this 
 * @param {*} data 
 */
export function pass(this, data) {
  let config = qcxUtil.getSettings({
    url: '/api/inspection/pass',
    data: data
  })
  return this.$axios(config)
}

/**
 * 获取提交的巡查记录
 * @param {*} this 
 * @param {*} data 
 */
export function getSubmittedList(this, data) {
  let config = qcxUtil.getSettings({
    url: '/api/inspection/getMySubmit',
    data: data
  })
  return this.$axios(config)
}

/**
 * 获取待处理的巡查记录
 * @param {*} this 
 * @param {*} data 
 */
export function getPendingList(this, data) {
  let config = qcxUtil.getSettings({
    url: '/api/inspection/getItemsNeedToWork',
    data: data
  })
  return this.$axios(config)
}
