// pages/addPlan/addPlan.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onChangeName(e) {
        this.setData({
            name: e.detail
        })
    },
    onVoice() {
        // 显示开发中弹窗
        Toast('')
    }
})