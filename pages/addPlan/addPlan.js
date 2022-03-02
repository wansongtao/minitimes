// pages/addPlan/addPlan.js
import dayjs from 'dayjs'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import {
    separator
} from '../../config/index'
import {
    writeFile,
    setFileName
} from '../../utils/util'

Page({
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
    initData() {
        const hour = dayjs().hour()

        this.setData({
            name: '',
            description: '',
            date: dayjs().format('YYYY/MM/DD'),
            startTime: `${hour}:00`,
            endTime: `${hour}:30`
        })
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
        const data = {
            showTimeDia: false
        }
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
        if (this.data.name === '') {
            wx.showToast({
                title: '名称不能为空',
                icon: 'error'
            })
            return
        }

        const inputData = this.data

        const data = {
            id: new Date().getTime(), // 根据当前时间生成唯一id
            name: inputData.name.replace(separator, ''),
            description: inputData.description.replace(separator, ''),
            date: inputData.date, // 计划日期
            startTime: inputData.startTime, // 计划开始时间
            endTime: inputData.endTime, // 计划结束时间
            state: 0, // 0 待完成  1 已完成  2已逾期
            isDelete: 0, // 0 正常  1 已删除
            createTime: dayjs().format('YYYY/MM/DD HH:mm:ss'),
            updateTime: '',
            deleteTime: ''
        }

        const fileName = setFileName(dayjs(data.date).format('YYYYMM'))
        const isSuccess = writeFile(fileName, `${JSON.stringify(data)}${separator}`)

        if (isSuccess) {
            this.initData()

            wx.showToast({
                title: '添加成功',
                icon: 'success'
            })
        } else {
            wx.showToast({
                title: '添加失败',
                icon: 'error'
            }) 
        }
    }
})