// pages/noteList/index.js
import { separator, noteFilePrev} from '../../config/index'
import { setFileName, readFile, dataFormatConversion } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    list: []
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
    const list = this.getNoteData()

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
    const id = e.target.dataset.id
    console.log(id);
  },
  onUpdate(e) {
    const id = e.target.dataset.id
    console.log(id);
  },
  onDelete(e) {
    const id = e.target.dataset.id
    console.log(id);
  }
})