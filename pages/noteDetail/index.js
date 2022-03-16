// pages/noteDetail/index.js
import dayjs from 'dayjs'
import {
  separator,
  noteFilePrev,
  noteDirectory
} from '../../config/index'
import {
  setFileName,
  readFile,
  dataFormatConversion
} from '../../utils/util'
import {
  showModal
} from '../../utils/dialog'
import updateNoteFile from '../../utils/updateNote'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: [],
    time: '',
    lastUpdateTime: ''
  },
  global: {
    id: '',
    date: '',
    data: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id || !options.date) {
      this.back('参数错误')
      return
    }

    const id = decodeURIComponent(options.id)
    const date = decodeURIComponent(options.date)

    this.global.id = id
    this.global.date = date

    this.initData()
  },
  initData() {
    const global = this.global
    if (!global.id || !global.date) {
      this.back('参数错误')
    }

    const date = global.date
    const fileName = setFileName(noteDirectory, noteFilePrev, date.replace('/', '').substr(0, 6))
    const text = readFile(fileName)

    if (!text) {
      this.back('获取内容失败')
      return
    }

    const list = dataFormatConversion(text, separator)
    if (!list.length) {
      this.back('获取内容失败')
      return
    }

    const data = list.find((item) => item.id === Number(global.id))
    if (!data) {
      this.back('获取内容失败')
      return
    }

    const content = data.content.split('\n')

    this.setData({
      title: data.title,
      content: content,
      time: data.createTime,
      lastUpdateTime: data.updateTime || ''
    })
    global.data = data
  },
  /**
   * @description 弹出错误提示框，并返回上一页
   * @param {string} [title='参数错误'] 提示语
   */
  back(title = '参数错误') {
    wx.showToast({
      title,
      icon: 'error'
    })

    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 500);
  },
  onUpdate() {
    const item = this.global.data

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
  async onDelete() {
    const confirm = await showModal('提示', '确认要永久删除该笔记吗？')
    if (!confirm) {
      return
    }

    const global = this.global

    // 修改文件中的相关数据
    const oldVal = JSON.parse(JSON.stringify(global.data))

    const deleteTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
    const newVal = {...global.data}
    newVal.isDelete = 1
    newVal.deleteTime = deleteTime

    const isSuccess = updateNoteFile(oldVal, newVal)
    if (!isSuccess) {
      wx.showToast({
        title: '删除失败',
        icon: 'error'
      })
      return
    }

    wx.showToast({
      title: '删除成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/noteList/index',
      })
    }, 500);
  }
})