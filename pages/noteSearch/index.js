// pages/noteSearch/index.js
import {
  getFileList
} from '../../utils/file'
import {
  noteDirectory,
  separator
} from '../../config/index'
import {
  readFile,
  dataFormatConversion
} from '../../utils/util'

Page({
  data: {
    searchVal: '',
    list: [],
    fuzzys: []
  },
  global: {
    timer: null,
    spacing: 200,
    result: []
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

      this.searchContent()
      const fuzzys = this.global.result.slice(0, 10).map((item) => {
        return {
          id: item.id,
          title: item.title,
          createTime: item.createTime
        }
      })

      this.setData({
        fuzzys: fuzzys
      })
    }, global.spacing);
  },
  onSearch() {
    this.searchContent()
    this.setData({
      list: this.global.result,
      fuzzys: []
    })
  },
  onJumpDetail(e) {
    const id = e.target.dataset.id
    const item = this.data.fuzzys.find((item) => item.id === id)
    if (!item) {
      wx.showToast({
        title: '未知错误',
        icon: 'error'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/noteDetail/index?id=${encodeURIComponent(id)}&date=${encodeURIComponent(item.createTime.substr(0, 10))}`,
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
  },
  /**
   * @description 从所有文件中找出二十条相关数据，并保存在global中
   */
  searchContent() {
    const files = getFileList(noteDirectory)
    if (!files.length) {
      return
    }

    this.global.result = []
    const result = this.global.result
    for (let i = 0; i < files.length; i++) {
      const item = files[i]
      const list = this.fileContentQuery(noteDirectory + '/' + item, this.data.searchVal)

      if (!list.length) {
        continue
      }

      result.push(...list.slice(0, 20))

      if (result.length >= 20) {
        return
      }
    }
  }
})