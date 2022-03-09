// pages/noteSearch/index.js


Page({
  data: {
    searchVal: ''
  },
  onLoad: function (options) {

  },
  onChange(e) {
    const value = e.detail
    this.setData({
      searchVal: value
    })
  },
  onSearch() {
    
  }
})