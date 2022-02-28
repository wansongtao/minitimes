// pages/addPlan/addPlan.js
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
        
    }
})