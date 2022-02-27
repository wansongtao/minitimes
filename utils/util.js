/**
 * @author wansongtao
 * @date 2022-02-27
 * @description 通用方法库
 */

/**
 * @description 获取参数数据类型
 * @param {*} obj 任意参数
 * @returns {string} 返回数据类型字符串（小写）
 */
export const getDataType = (obj) => {
  let res = Object.prototype.toString.call(obj).split(' ')[1];
  res = res.substring(0, res.length - 1).toLowerCase();
  return res;
};

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * @description 自动更新小程序
 */
export const updateMiniprogram = () => {
  if (!wx.canIUse('getUpdateManager')) {
    return;
  }

  const updateManager = wx.getUpdateManager();

  updateManager.onCheckForUpdate(function (res) {});
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (!res.confirm) {
          return;
        }

        updateManager.applyUpdate();
      }
    })
  });
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
    wx.showModal({
      title: '更新提示',
      content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
    });
  });
};

/**
 * @description 登录
 * @returns {Promise} 成功resolve(code)，失败reject(errmsg)
 */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (!res.code) {
          reject(res.errMsg)
        }

        resolve(res.code);
      }
    });
  });
};
