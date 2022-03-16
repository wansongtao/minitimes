// app.js
import {
  updateMiniprogram,
  renameFile
} from './utils/util'
import { getFileList, mkdirDirectory } from './utils/file'
import { noteDirectory, planDirectory } from './config/index'

App({
  onLaunch() {
    updateMiniprogram()

    const files = getFileList()

    files.forEach((item) => {
      if (item.indexOf('.txt') === -1) {
        return
      }

      if (item.indexOf('plans_') !== -1) {
        mkdirDirectory(planDirectory)
        renameFile(item, 'plan/' + item)
        return
      }

      if (item.indexOf('notes_') !== -1) {
        mkdirDirectory(noteDirectory)
        renameFile(item, 'note/' + item)
        return
      }
    })
  },
  globalData: {
    isUpdatePlan: false, // 是否需要更新首页的计划数据
    updatePlanDate: '', // 需要更新的计划数据的日期
    updateNoteData: null, // 需要修改的笔记数据
  }
})