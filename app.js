// app.js
import {
  updateMiniprogram
} from './utils/util'

App({
  onLaunch() {
    updateMiniprogram()

  },
  globalData: {
    updateFile: null, // 修改的文件
    updateData: null // 需要修改的数据
  }
})