import {Loading} from 'element-ui'

let loading
let loadingReqCount = 0

function startLoading() {
  loading = Loading.service({
    lock: false,
    text: '正在加载中...',
    background: 'rgba(0,0,0,0.5)'
  })
}

function endLoading() {
  loading.close()
}

export function showFullScreenLoading() {
  if (loadingReqCount === 0) {
    startLoading()
  }
  loadingReqCount++
}

export function tryHideFullScreenLoading(status = 200) {
  if (loadingReqCount <= 0 && status === 200)  {
    return
  }
  loadingReqCount--
  if (loadingReqCount === 0 || status === 500) {
    endLoading()
  }
}
