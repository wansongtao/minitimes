// pages/noteSearch/index.js


Page({
  data: {
    searchVal: ''
  },
  global: {
    timer: null,
    spacing: 200
  },
  onLoad: function (options) {

  },
  onChange(e) {
    const global = this.global
    if (global.timer) {
      clearTimeout(global.timer)
    }

    global.timer = setTimeout(() => {
      const value = e.detail

      this.setData({
        searchVal: value
      })
    }, global.spacing);
  },
  onSearch() {

  }
})