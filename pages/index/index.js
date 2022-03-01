// index.js
import dayjs from 'dayjs'
import { weeks } from '../../config/index'
import { separator } from '../../config/index'
import { setFileName, readFile, dataFormatConversion } from '../../utils/util'

// 获取应用实例
const app = getApp()

Page({
  data: {
    show: false,
    minDate: new Date(dayjs().format('YYYY/MM/DD')).getTime() - 99 * 24 * 60 * 60 * 1000,
    maxDate: new Date(dayjs().format('YYYY/MM/DD')).getTime(),
    week: weeks[dayjs().day()],
    date: dayjs().format('YYYY/MM/DD'),
    plan: {
      total: 10,
      done: 5, // 已完成数量
      continued: 5 // 待完成数量
    },
    list: [],
    currPage: 1, // 页码
    pageSize: 6 // 每页条数
  },
  global: {
    load: 0,
    plans: []
  },
  onLoad() {
    this.global.load = 1
    this.initData()
  },
  onShow() {
    if (this.global.plans.length < this.data.pageSize &&  this.global.load) {
      this.initData()
    }
  },
  /**
   * @description 获取本地文件中的计划，当前年月
   */
  getFilePlanData() {
    const fileName = setFileName()
    const text = readFile(fileName)

    if (text === false) {
      return []
    }

    const list = dataFormatConversion(text, separator)

    return list.filter((item) => !item.isDelete)
  },
  /**
   * @description 设置不同状态计划数量
   */
  setPlanNumber() {
    const list = this.global.plans

    const plan = {
      total: list.length,
      done: 0,
      continued: 0
    }

    list.forEach((item) => {
      if (item.state === 0) {
        plan.continued += 1
      }

      if (item.state === 1) {
        plan.done += 1
      }
    })

    this.setData({
      plan
    })
  },
  /**
   * @description 分页加载数据
   */
  loadPlans() {
    const plans = this.global.plans
    const data = this.data

    const start = (data.currPage - 1) * data.pageSize

    if (start >= plans.length) {
      return
    }

    const end = data.currPage * data.pageSize
    const newList = [...data.list, ...plans.slice(start, end)]
    this.setData({
      list: newList,
      currPage: data.currPage + 1
    })
  },
  initData() {
    const list = this.getFilePlanData()
    this.global.plans = list

    this.setPlanNumber()

    const showList = this.global.plans.slice(0, this.data.pageSize)
    this.setData({
      list: showList,
      currPage: 2
    })
  },
  handlerOpenDialog() {
    this.setData({
      show: true
    })
  },
  handlerCreate() {
    wx.navigateTo({
      url: '../addPlan/addPlan',
    })
  },
  handlerLoad() {
    if (this.data.list.length >= this.data.plan.total) {
      return
    }

    this.loadPlans()
  },
  handlerDel(e) {
    console.log(e.target.dataset.id);
    wx.showModal({
      title: '提示',
      content: '确定永久删除该计划吗？',
      confirmColor: '#f10a24',
      cancelColor: '#333',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handlerFinish(e) {
    const id = e.target.dataset.id
    const data = this.data.list

    data.forEach((item) => {
      if (item.id === id) {
        item.state = 1
      }
    })

    this.setData({
      list: data
    })
  },
  handlerCloneDialog() {
    this.setData({ show: false });
  },
  handlerChangeDate(e) {
    const date = e.detail

    this.setData({
      show: false,
      week: weeks[dayjs(date).day()],
      date: dayjs(date).format('YYYY/MM/DD')
    })
  }
})
