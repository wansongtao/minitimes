// pages/noteList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    list: [{
        id: 324133424,
        title: '不过是大梦一场空',
        content: '不过是孤影照惊鸿，不过是白驹之过一场梦。不过是孤影照惊鸿，不过是白驹之过一场梦。不过是孤影照惊鸿，不过是白驹之过一场梦。不过是孤影照惊鸿，不过是白驹之过一场梦。不过是孤影照惊鸿，不过是白驹之过一场梦。不过是孤影照惊鸿，不过是白驹之过一场梦。不过是孤影照惊鸿，不过是白驹之过一场梦。',
        createTime: '2022/03/07 12:12:12'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onSearch() {

  },
  onCancel() {
    this.setData({
      searchVal: ''
    })
  },
  onLoad() {

  },
  onLook(e) {
    const id = e.target.dataset.id
    console.log(id);
  },
  onUpdate(e) {
    const id = e.target.dataset.id
    console.log(id);
  },
  onDelete(e) {
    const id = e.target.dataset.id
    console.log(id);
  }
})