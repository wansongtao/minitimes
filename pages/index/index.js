// index.js
import dayjs from 'dayjs'
import { weeks } from '../../config/index'

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
      done: 5,
      continued: 5
    },
    list: [
      {
        id: 1,
        title: '不过是大梦一场空',
        content: '人生本就是一场无尽的幻想，所谓，花非花，雾非雾。',
        date: '2022-02-27',
        timeRange: ['17:00:00', '18:00:00'],
        state: 0, // 0 待完成  1已完成  2已逾期
        isDelete: 0,
        createTime: '',
        updateTime: '',
        deleteTime: ''
      },
      {
        id: 2,
        title: '不过是大梦一场空',
        content: '人生本就是一场无尽的幻想，所谓，花非花，雾非雾。',
        date: '2022-02-27',
        timeRange: ['17:00:00', '18:00:00'],
        state: 0, // 0 待完成  1已完成  2已逾期
        isDelete: 0,
        createTime: '',
        updateTime: '',
        deleteTime: ''
      },
      {
        id: 3,
        title: '不过是大梦一场空',
        content: '人生本就是一场无尽的幻想，所谓，花非花，雾非雾。',
        date: '2022-02-27',
        timeRange: ['17:00:00', '18:00:00'],
        state: 0, // 0 待完成  1已完成  2已逾期
        isDelete: 0,
        createTime: '',
        updateTime: '',
        deleteTime: ''
      }
    ]
  },
  onLoad() {

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
    console.log(2222222222);
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
  handlerClose(e) {
    console.log(e.target.dataset.id);
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
