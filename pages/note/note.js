// pages/note/note.js
import dayjs from 'dayjs'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import {
  separator,
  verifyNoteFormat,
  noteFilePrev,
  noteDirectory
} from '../../config/index'
import {
  setFileName,
  readFile,
  writeFile
} from '../../utils/util'
import updateNoteFile from '../../utils/updateNote'
import {
  mkdirDirectory
} from '../../utils/file'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    setHeight: {
      maxHeight: 300,
      minHeight: 300
    },
    title: '',
    content: '',
    isUpdate: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    if (app.globalData.updateNoteData) {
      const oldVal = app.globalData.updateNoteData

      this.setData({
        title: oldVal.title,
        content: oldVal.content,
        isUpdate: true
      })
    }
  },
  /**
   * @description 修改表单项的值
   * @param {*} e 
   */
  onChangeValue(e) {
    let val = e.detail

    if (val.indexOf(separator) !== -1) {
      wx.showToast({
        title: `非法字符${separator}`,
        icon: 'error'
      })
      val = val.replace(separator, '')
    }

    this.setData({
      [e.target.dataset.name]: val
    })
  },
  onVoice() {
    // 显示开发中弹窗
    Toast('')
  },
  onSubmit(e) {
    const data = e.detail.value

    if (data.name === '' || data.content === '') {
      wx.showToast({
        title: '请输入标题和内容哟😉',
        icon: 'none'
      })
      return
    }

    data.id = new Date().getTime()
    data.isDelete = 0
    data.createTime = dayjs().format('YYYY/MM/DD HH:mm:ss')

    const isVerify = verifyNoteFormat(data, separator)
    if (!isVerify) {
      wx.showToast({
        title: '添加错误',
        icon: 'error'
      })
      return
    }

    const isHas = mkdirDirectory(noteDirectory)
    if (!isHas) {
      wx.showToast({
        title: '添加错误',
        icon: 'error'
      })
      return
    }

    const fileName = setFileName(noteDirectory, noteFilePrev)
    const note = readFile(fileName)
    if (note && note.indexOf(data.id) !== -1) {
      wx.showToast({
        title: '已存在相同id的笔记啦🤣',
        icon: 'none'
      })
      return
    }

    const isSuccess = writeFile(fileName, `${JSON.stringify(data)}${separator}`)
    if (!isSuccess) {
      wx.showToast({
        title: '添加失败',
        icon: 'error'
      })
      return
    }

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })

    this.onReset()
  },
  onReset() {
    this.setData({
      title: '',
      content: '',
      isUpdate: false
    })
    app.globalData.updateNoteData = null
  },
  onUpdate() {
    const oldVal = app.globalData.updateNoteData
    const data = this.data

    if (data.title === oldVal.title && data.content === oldVal.content) {
      wx.showToast({
        title: '您没有修改任何内容',
        icon: 'none'
      })
      return
    }

    const updateTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
    const newVal = {
      ...oldVal,
      title: data.title,
      content: data.content,
      updateTime
    }

    const isSuccess = updateNoteFile(oldVal, newVal)
    if (!isSuccess) {
      wx.showToast({
        title: '修改失败',
        icon: 'error'
      })
      return
    }

    app.globalData.updateNoteData = null
    this.setData({
      title: '',
      content: '',
      isUpdate: false
    })
    wx.showToast({
      title: '修改成功',
      icon: 'success'
    })
  }
})