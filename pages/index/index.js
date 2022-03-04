// index.js
import dayjs from 'dayjs'
import {
  weeks,
  commonNotice,
  separator,
  planPrev
} from '../../config/index'
import {
  setFileName,
  readFile,
  dataFormatConversion
} from '../../utils/util'
import useUpdateFile from '../../utils/useUpdateFile'
import updateFileAllText from '../../utils/useUpdateFileAllText'

// 获取应用实例
const app = getApp()

Page({
  data: {
    showNotice: true,
    notice: commonNotice,
    show: false,
    minDate: new Date(dayjs().format('YYYY/MM/DD')).getTime() - 99 * 24 * 60 * 60 * 1000,
    maxDate: new Date(dayjs().format('YYYY/MM/DD')).getTime() + 7 * 24 * 60 * 60 * 1000,
    week: weeks[dayjs().day()],
    date: dayjs().format('YYYY/MM/DD'),
    plan: {
      total: 0,
      done: 0, // 已完成数量
      continued: 0, // 待完成数量
      timeout: 0
    },
    list: [],
    currPage: 1, // 页码
    pageSize: 6 // 每页条数
  },
  global: {
    plans: [], // 今天的计划数据
    allPlan: {} // 读取过的月份计划数据
  },
  onLoad() {
    this.initData()
  },
  onShow() {
    if (app.globalData.isUpdatePlan && app.globalData.updatePlanDate) {
      const date = app.globalData.updatePlanDate.replace('/', '').substr(0, 6)
      const list = this.planDataSort(this.getFilePlanData(date))

      // 更新当前月份的数据
      this.global.allPlan[date] = list

      if (this.data.date === app.globalData.updatePlanDate) {
        // 更新当天的数据
        this.global.plans = list.filter((item) => item.date === this.data.date)
        this.setPlanNumber(this.global.plans)

        const showList = this.global.plans.slice(0, this.data.currPage * this.data.pageSize)
        this.setData({
          list: showList
        })
      }

      app.globalData.isUpdatePlan = false
      app.globalData.updatePlanDate = ''
    }
  },
  /**
   * @description 将已超时(今天之前)未完成的计划，状态修改为已逾期(改变原数组)
   * @param {object[]} data 计划列表
   * @param {string} fileName 文件名
   */
  updateDataState(data, fileName) {
    if (!Array.isArray(data)) {
      console.error('argument type error.');
      return
    }

    if (typeof fileName !== 'string') {
      console.error('argument error.');
      return
    }

    let isUpdate = false
    const date = new Date(dayjs().format('YYYY/MM/DD')).getTime()

    data.forEach((item) => {
      // 未完成且未删除的超时计划
      if (new Date(item.date).getTime() < date && item.state === 0 && item.isDelete === 0) {
        isUpdate = true
        item.state = 2
        item.updateTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
      }
    })

    // 没有要更新的数据
    if (!isUpdate) {
      return
    }

    setTimeout(() => {
      let text = ''
      data.forEach((item) => {
        text += `${JSON.stringify(item)}${separator}`
      })

      updateFileAllText(fileName, text)
    }, 0);
  },
  /**
   * @description 计划列表数据排序，状态升序+时间升序
   * @param {Object[]} data 待排序数据
   * @returns {Object[]} 排好序的数据
   */
  planDataSort(data) {
    if (data.length === 0) {
      return data
    }

    data.sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime > b.startTime) {
        return 1;
      }

      return 0;
    })

    data.sort((a, b) => a.state - b.state)

    return data
  },
  /**
   * @description 获取本地文件中的计划相关数据
   * @param {string} [date] 日期字符串，默认当前年月
   * @returns {Object[]} 成功返回数据列表，失败返回空数组
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
   * @param {object[]} list
   */
  setPlanNumber(list) {
    const plan = {
      total: list.length,
      done: 0,
      continued: 0,
      timeout: 0
    }

    list.forEach((item) => {
      if (item.state === 0) {
        plan.continued += 1
      }

      if (item.state === 1) {
        plan.done += 1
      }

      if (item.state === 2) {
        plan.timeout += 1
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
      list: newList
    })
  },
  initData() {
    const date = dayjs().format('YYYYMM')
    const list = this.planDataSort(this.getFilePlanData(date))

    this.updateDataState(list, setFileName(planPrev, date))

    // 保存当前月份的数据
    this.global.allPlan[date] = list

    // 保存当天的数据
    this.global.plans = list.filter((item) => item.date === this.data.date)

    this.setPlanNumber(this.global.plans)

    const showList = this.global.plans.slice(0, this.data.pageSize)
    this.setData({
      list: showList
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

    this.setData({
      currPage: this.data.currPage + 1
    })
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

          // 不能删除已完成/已逾期的计划
          if (data[idx].state !== 0) {
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

          const yearMonth = dayjs(data[idx].date).format('YYYYMM')
          const delIdx = that.global.allPlan[yearMonth].findIndex((item) => item.id === id)
          that.global.allPlan[yearMonth].splice(delIdx, 1)

          data.splice(idx, 1)

          const planNum = that.data.plan
          planNum.total -= 1
          planNum.continued -= 1

          that.setData({
            list: data,
            plan: planNum
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

    const yearMonth = data[idx].date.replace('/', '').substr(0, 6)
    this.global.allPlan[yearMonth].forEach((item) => {
      if (item.id === id) {
        item.state = 1
      }
    })

    this.setData({
      list: data
    })

    this.setPlanNumber(this.global.plans)

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
    this.setData({
      show: false
    })

    const date = dayjs(e.detail)
    const nowDate = date.format('YYYY/MM/DD')

    // 没有改变日期
    if (nowDate === this.data.date) {
      return
    }

    const yearMonth = date.format('YYYYMM')
    const allPlan = this.global.allPlan

    // 今天
    if (nowDate === dayjs().format('YYYY/MM/DD')) {
      this.global.plans = allPlan[yearMonth].filter((item) => item.date === nowDate)
      this.setPlanNumber(this.global.plans)

      const showList = this.global.plans.slice(0, this.data.pageSize)
      this.setData({
        list: showList,
        currPage: 1,
        week: weeks[date.day()],
        date: nowDate
      })
      return
    }

    // 没有这个月份的数据，需要去文件中读取
    if (!allPlan[yearMonth] || !allPlan[yearMonth].length) {
      const list = this.getFilePlanData(yearMonth)

      if (!list.length) {
        wx.showToast({
          title: '无当前月份的相关数据',
          icon: 'none'
        })
        return
      }

      const sortList = this.planDataSort(list)
      this.updateDataState(sortList, setFileName(planPrev, yearMonth))

      this.global.allPlan[yearMonth] = sortList

      const nowList = list.filter((item) => item.date === nowDate)
      if (!nowList.length) {
        wx.showToast({
          title: '无当前日的相关数据',
          icon: 'none'
        })
        return
      }

      this.global.plans = nowList
      this.setPlanNumber(this.global.plans)

      const showList = this.global.plans.slice(0, this.data.pageSize)
      this.setData({
        list: showList,
        currPage: 1,
        week: weeks[date.day()],
        date: nowDate
      })
      return
    }

    const currList = allPlan[yearMonth].filter((item) => item.date === nowDate)
    if (!currList.length) {
      wx.showToast({
        title: '无当前日的相关数据',
        icon: 'none'
      })
      return
    }

    this.global.plans = currList
    this.setPlanNumber(this.global.plans)

    const showList = this.global.plans.slice(0, this.data.pageSize)
    this.setData({
      list: showList,
      currPage: 1,
      week: weeks[date.day()],
      date: nowDate
    })
    return
  },
  onCloneNotice() {
    this.setData({
      showNotice: false
    })
  }
})