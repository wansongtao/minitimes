// pages/addPlan/addPlan.js
import dayjs from 'dayjs'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import { showModal } from '../../utils/dialog'
import {
    separator,
    planPrev
} from '../../config/index'
import {
    writeFile,
    setFileName,
    readFile,
    verifyDataFormat,
    dataFormatConversion
} from '../../utils/util'

// 获取应用实例
const app = getApp()

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
    /**
     * @description 获取文件内容
     * @param {string} fileName 文件名
     * @returns {Object[]} 
     */
    getFileContent(fileName) {
        try {
            if (typeof fileName !== 'string' || fileName === '') {
                return []
            }

            const text = readFile(fileName)

            if (!text) {
                console.error('read file error');
                return []
            }

            const list = dataFormatConversion(text, separator)

            return list
        } catch (e) {
            console.error(e);
            return []
        }
    },
    /**
     * @description 查询是否有相同id的数据
     * @param {object[]} data
     * @param {number} id 
     * @returns {Boolean} 有true，没有false
     */
    querySameId(data, id) {
        return data.some((item) => item.id === id)
    },
    /**
     * @description 查询该时间内是否已有其他计划
     * @param {object[]} data 
     * @param {string} date
     * @param {string} time 
     * @returns {Boolean} 有true
     */
    querySameTime(data, date, time) {
        return data.some((item) => item.date === date && item.startTime <= time && item.endTime >= time)
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
    async onSubmit() {
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

        const isVerify = verifyDataFormat(data, separator)
        if (!isVerify) {
            wx.showToast({
                title: '添加失败',
                icon: 'error'
            })
            return
        }

        const fileName = setFileName(planPrev, dayjs(data.date).format('YYYYMM'))

        const list = this.getFileContent(fileName)
        if (list.length) {
            const isSameId = this.querySameId(list, data.id)
            if (isSameId) {
                console.error('id error');
                wx.showToast({
                    title: '添加失败',
                    icon: 'error'
                })
                return
            }

            const isSameTime = this.querySameTime(list, data.date, data.startTime)
            if (isSameTime) {
                const isRes = await showModal('提示', '该时间段内已有其他计划，确定要添加吗?').catch((err) => {
                    return true
                })

                if (!isRes) {
                    return
                }
            }
        }

        const isSuccess = writeFile(fileName, `${JSON.stringify(data)}${separator}`)

        if (isSuccess) {
            this.initData()
            app.globalData.isUpdatePlan = true
            app.globalData.updatePlanDate = data.date

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