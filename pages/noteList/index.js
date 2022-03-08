// pages/noteList/index.js
import { separator, noteFilePrev} from '../../config/index'
import { setFileName, readFile, dataFormatConversion } from '../../utils/util'
import updateNoteFile from '../../utils/updateNote'
import dayjs from 'dayjs'
import { showModal } from '../../utils/dialog'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    yearMonth: dayjs().format('YYYY/MM'),
    searchVal: '',
    list: [],
    timeSheetValue: new Date().getTime(),
    maxDate: new Date().getTime(),
  },
  global: {
    allData: [],
    pageSize: 6
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },
  initData() {
    const yearMonth = this.data.yearMonth.replace('/', '')
    const list = this.getNoteData(yearMonth)

    if (!list.length) {
      this.global.allData = []
      this.setData({
        list: []
      })
      return
    }

    list.sort((a, b) => {
      if (a.createTime > b.createTime) {
        return -1
      }
      if (a.createTime < b.createTime) {
        return 1
      }
      return 0
    })

    this.global.allData = list
    const showList = list.slice(0, this.global.pageSize)

    this.setData({
      list: showList
    })
  },
  /**
   * @description 获取某月的笔记数据
   * @param {string} date 年月，格式：yyyymm
   * @returns {Object[]} 成功返回数据列表，失败返回空数组
   */
  getNoteData(date) {
    const fileName = setFileName(noteFilePrev, date)
    const text = readFile(fileName)

    if (!text) {
      return []
    }

    const list = dataFormatConversion(text, separator)
    return list.filter((item) => item.isDelete !== 1)
  },
  onSearch() {
    wx.showToast({
      title: '开发中~',
      icon: 'none'
    })
  },
  onCancel() {
    this.setData({
      searchVal: ''
    })
  },
  onLoadMore() {
    const showList = this.data.list
    const allData = this.global.allData

    if (showList.length >= allData.length) {
      return
    }

    const newList = allData.slice(showList.length, showList.length + this.global.pageSize)

    showList.push(...newList)

    this.setData({
      list: showList
    })
  },
  onLook(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.list.find((item) => item.id == id)

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
  onUpdate(e) {
    const id = e.target.dataset.id
    const item = this.data.list.find((item) => item.id === id)

    if (!item) {
      wx.showToast({
        title: '修改失败',
        icon: 'error'
      })
      return
    }

    app.globalData.updateNoteData = item
    wx.switchTab({
      url: '/pages/note/note',
    })
  },
  async onDelete(e) {
    const confirm = await showModal('提示', '确认要永久删除该笔记吗？')
    if (!confirm) {
      return
    }

    const id = e.target.dataset.id
    const showList = this.data.list
    const idx = showList.findIndex((item) => item.id === id)
    if (idx === -1) {
      console.error('id error');
      return
    }

    // 修改文件中的相关数据
    const oldVal = JSON.parse(JSON.stringify(showList[idx]))
    const newVal = JSON.parse(JSON.stringify(oldVal))
    newVal.isDelete = 1
    newVal.deleteTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
    const isSuccess = updateNoteFile(oldVal, newVal)
    if (!isSuccess) {
      wx.showToast({
        title: '删除失败',
        icon: 'error'
      })
      return
    }

    // 删除显示的数据
    const allData = this.global.allData
    this.global.allData = allData.filter((item) => item.id !== id)
    showList.splice(idx, 1)

    const len = showList.length
    if (len < this.global.allData.length && len % this.global.pageSize) {
      const adds = this.global.allData.slice(len, len + (len % this.global.pageSize))
      showList.push(...adds)
    }

    this.setData({
      list: showList
    })

    wx.showToast({
      title: '删除成功',
      icon: 'success'
    })
  },
  onShowSheet() {
    this.setData({
      show: true
    })
  },
  onSelect(e) {
    const dateNum = e.detail
    
    this.setData({
      yearMonth: dayjs(dateNum).format('YYYY/MM'),
      timeSheetValue: e.detail,
      show: false
    })
    this.initData()
  },
  onCloseSheet() {
    this.setData({
      show: false
    })
  }
})