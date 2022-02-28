// pages/addPlan/addPlan.js
import dayjs from 'dayjs'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        description: '',
        date: dayjs().format('YYYY/MM/DD'),
        startTime: '',
        endTime: '14:00',
        showDateDia: false,
        showTimeDia: false,
        timeType: 0,
        currentTime: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setDefaultTime()
    },
    setDefaultTime() {
        const hour = dayjs().hour()

        this.setData({
            startTime: `${hour}:00`,
            endTime: `${hour}:30`
        })
    },
    /**
     * @description 修改表单项的值
     * @param {*} e 
     */
    onChangeValue(e) {
        this.setData({
            [e.target.dataset.name]: e.detail
        })
    },
    onVoice() {
        // 显示开发中弹窗
        Toast('')
    },
    onDisplayDateDia() {
        this.setData({
            showDateDia: true
        })
    },
    onCloseDateDia() {
        this.setData({
            showDateDia: false
        })
    },
    onConfirmDate(e) {
        this.setData({
            date: dayjs(e.detail).format('YYYY/MM/DD'),
            showDateDia: false
        })
    },
    onSelectTimes(e) {
        const data = { showTimeDia: false }
        if (this.data.timeType) {
            // 结束时间
            if (e.detail <= this.data.startTime) {
                wx.showToast({
                  title: '结束时间必须大于开始时间',
                  icon: 'none'
                })
                return
            }

            data.endTime = e.detail
        } else {
            // 开始时间
            if (e.detail >= this.data.endTime) {
                wx.showToast({
                  title: '开始时间必须小于结束时间',
                  icon: 'none'
                })
                return
            }

            data.startTime = e.detail
        }

        this.setData(data)
    },
    onShowTimeDia(e) {
        const type = Number(e.target.dataset.type)
        const time = type ? this.data.endTime : this.data.startTime
        this.setData({
            showTimeDia: true,
            timeType: type,
            currentTime: time
        })
    },
    onCloseTimeDia() {
        this.setData({
            showTimeDia: false
        })
    },
    onSubmit() {
        // 显示开发中弹窗
        Toast('')
    }
})