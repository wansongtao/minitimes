// app.js
import {
  updateMiniprogram
} from './utils/util'

App({
  onLaunch() {
    updateMiniprogram()
  },
  globalData: {
    isUpdatePlan: false, // 是否需要更新首页的计划数据
    updatePlanDate: '', // 需要更新的计划数据的日期
    updateNoteData: null, // 需要修改的笔记数据
  }
})