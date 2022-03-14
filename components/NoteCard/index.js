// components/NoteCard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardId: {
      type: Number
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    createTime: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLook() {
      const id = this.data.cardId
      const createTime = this.data.createTime

      wx.navigateTo({
        url: `/pages/noteDetail/index?id=${encodeURIComponent(id)}&date=${encodeURIComponent(createTime.substr(0, 10))}`,
      })
    }
  }
})