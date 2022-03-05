// pages/note/note.js
import dayjs from 'dayjs'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import {
    separator
} from '../../config/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        setHeight: {maxHeight: 300, minHeight: 300},
        title: '',
        content: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        console.log(e.detail.value);

        Toast('')
    },
    onReset() {
        this.setData({
            title: '',
            content: ''
        })
    }
})