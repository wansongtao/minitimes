// app.js
import { updateMiniprogram } from './utils/util';

App({
  onLaunch() {
    updateMiniprogram()
  },
  globalData: {
    userInfo: null
  }
})
