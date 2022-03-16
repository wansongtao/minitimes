// pages/noteSearch/index.js
import {
  getFileList
} from '../../utils/file'
import {
  noteDirectory,
  separator
} from '../../config/index'
import { readFile, dataFormatConversion } from '../../utils/util'

Page({
  data: {
    searchVal: '',
    list: []
  },
  global: {
    timer: null,
    spacing: 200
  },
  onLoad: function (options) {
    
  },
  onChange(e) {
    const global = this.global
    if (global.timer) {
      clearTimeout(global.timer)
    }

    global.timer = setTimeout(() => {
      const value = e.detail

      this.setData({
        searchVal: value
      })
    }, global.spacing);
  },
  onSearch() {
    const files = getFileList(noteDirectory)
    if (!files.length) {
      return
    }

    files.forEach((item) => {
      setTimeout(() => {
        const list = this.fileContentQuery(noteDirectory + '/' + item, this.data.searchVal)

        if (!list.length) {
          return
        }

        const newList = [...this.data.list, ...list]

        this.setData({
          list: newList
        })
      }, 0);
    })
  },
  /**
   * @description 模糊匹配文件中的内容
   * @param {string} fileName 文件名
   * @param {string} searchVal 搜索值
   * @returns {Object[]}
   */
  fileContentQuery(fileName, searchVal) {
    if (typeof fileName !== 'string' || typeof searchVal !== 'string') {
      console.error('argument type error');
      return []
    }

    if (fileName === '' || searchVal === '') {
      return []
    }

    const text = readFile(fileName)
    if (!text) {
      return []
    }

    const list = dataFormatConversion(text, separator)
    if (!list.length) {
      return []
    }

    return list.filter((item) => {
      if (item.isDelete) {
        return false
      }

      if (item.title.search(searchVal) !== -1) {
        return true
      }

      if (item.createTime.search(searchVal) !== -1) {
        return true
      }

      if (item.content.search(searchVal) !== -1) {
        return true
      }

      return false
    })
  }
})