// index.js
import dayjs from 'dayjs'
import {
  weeks
} from '../../config/index'
import {
  separator,
  planPrev
} from '../../config/index'
import {
  setFileName,
  readFile,
  dataFormatConversion
} from '../../utils/util'
import useUpdateFile from '../../utils/useUpdateFile'

// 获取应用实例
// const app = getApp()

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
    load: 0, // 0 第一次打开
    plans: []
  },
  onLoad() {
    this.initData()

    setTimeout(() => {
      this.global.load = 1
    }, 100);
  },
  onShow() {
    // 从其他页面返回改页面时且显示的数据小于设定的条数时，重新初始化
    if (this.global.plans.length < this.data.pageSize && this.global.load) {
      this.initData()
    }
  },
  /**
   * @description 获取本地文件中的计划
   * @param {string} [date] 日期字符串，默认当前年月
   * @returns {Object[]}
   */
  getFilePlanData(date) {
    if (date) {
      date = dayjs(date).format('YYYYMM')
    }

    const fileName = setFileName(planPrev, date)
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
    const that = this

    wx.showModal({
      title: '提示',
      content: '确定永久删除该计划吗？',
      confirmColor: '#f10a24',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          const id = e.target.dataset.id
          const data = that.data.list

          const idx = data.findIndex((item) => item.id === id)
          if (idx === -1) {
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            })
            return
          }

          const oldVal = JSON.parse(JSON.stringify(data[idx]))

          data[idx].isDelete = 1
          data[idx].deleteTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
          const newVal = data[idx]

          const isSuccess = useUpdateFile(oldVal, newVal)
          if (!isSuccess) {
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            })
            return
          }

          data.splice(idx, 1)
          that.setData({
            list: data
          })

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },
  handlerFinish(e) {
    const id = e.target.dataset.id
    const data = this.data.list

    const idx = data.findIndex((item) => item.id === id)
    if (idx === -1) {
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
      return
    }

    const nowDate = dayjs().format('YYYY/MM/DD')
    if (nowDate < data[idx].date) {
      wx.showToast({
        title: '时间未到',
        icon: 'error'
      })
      return
    }

    const nowTime = dayjs().format('HH:mm')

    if (nowTime < data[idx].endTime) {
      wx.showToast({
        title: '时间未到',
        icon: 'error'
      })
      return
    }

    const oldVal = JSON.parse(JSON.stringify(data[idx]))

    data[idx].state = 1
    data[idx].updateTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
    const newVal = data[idx]

    const isSuccess = useUpdateFile(oldVal, newVal)
    if (!isSuccess) {
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
      return
    }

    this.setData({
      list: data
    })

    wx.showToast({
      title: '操作成功',
      icon: 'success'
    })
  },
  handlerCloneDialog() {
    this.setData({
      show: false
    });
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