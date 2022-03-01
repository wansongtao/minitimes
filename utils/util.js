/**
 * @author wansongtao
 * @date 2022-02-27
 * @description 通用方法库
 */
import { filePrev } from '../config/index'

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

/**
 * @description 创建本地文件
 * @param {string} data 要写入文件的内容
 * @param {string} name 文件名，带上后缀
 * @returns {boolean} 成功返回true，失败返回false
 */
export const createLocalFile = (data, name) => {
  if (typeof data !== 'string' || data === '') {
    console.error('augument error.');
    return false
  }

  if (typeof name !== 'string' || !name) {
    console.error('argument error.');
    return
  }

  const fs = wx.getFileSystemManager()

  // 同步接口
  try {
    fs.writeFileSync(
      `${wx.env.USER_DATA_PATH}/${name}`,
      data,
      'utf8'
    )

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * @description 读取文件内容
 * @param {string} fileName 文件名，带上后缀
 * @returns {string} 返回文件内容
 */
export const readFile = (fileName) => {
  if (typeof fileName !== 'string' || !fileName) {
    console.error('argument error.');
    return ''
  }

  const fs = wx.getFileSystemManager()
  try {
    const res = fs.readFileSync(`${wx.env.USER_DATA_PATH}/${fileName}`, 'utf8', 0)

    return res
  } catch (e) {
    console.error(e)
    return ''
  }
}

/**
 * @description 打开文件用于读取和追加，该文件不存在会自动创建
 * @param {string} fileName 文件名，带上后缀名
 * @returns {Boolean|string} 成功返回文件描述符，失败返回false
 */
export const openFile = (fileName) => {
  if (typeof fileName !== 'string' || !fileName) {
    console.error('argument error.');

    return false
  }

  const fs = wx.getFileSystemManager()
  const fd = fs.openSync({
    filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
    flag: 'a+'
  })

  return fd
}

/**
 * @description 向文件中追加内容，该文件不存在时，自动创建
 * @param {string} fileName 文件名
 * @param {string} data 需要追加的内容
 * @param {number} [position] 数据要被写入的位置
 * @returns {Boolean} 成功true，失败false
 */
export const writeFile = (fileName, data, position) => {
  if (typeof fileName !== 'string' || !fileName) {
    console.error('argument error.');
    return false
  }

  if (typeof data !== 'string' || !data) {
    console.error('argument error.');
    return false
  }

  const fd = openFile(fileName)

  if (!fd) {
    console.error('open file fail.');
    return false
  }

  const fs = wx.getFileSystemManager()

  const res = fs.writeSync({
    fd: fd,
    data,
    position: position
  })

  if (res.bytesWritten !== undefined) {
    return true
  } else {
    console.error(res)
    return false
  }
}

/**
 * @description 设置文件名
 * @param {string} val 年月，格式：yyyymm
 * @returns {string} 返回文件名，命名规则：yyyymm_202201.txt
 */
export const setFileName = (val) => {
  if (val) {
    return `${filePrev}${val}.txt`
  }

  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return `${filePrev}${year}${month.toString().padStart(2)}.txt`
}

/**
 * @description 将读取的文件内容，转换为js数组
 * @param {string} text 文件内容
 * @param {string} separator 数据分割符
 * @returns {object[]} 返回转换后的数据
 */
export const dataFormatConversion = (text, separator) => {
  if (typeof text !== 'string' || typeof separator !== 'string') {
    console.error('argument type error');
    return []
  }

  if (!text || !separator) {
    console.error('argument error.');
    return []
  }

  let list = text.split(separator)

  if (!list.length) {
    return list
  }

  let str = list.join(',')
  str = '[' + str.substring(0, str.length - 1) + ']'

  list = JSON.parse(str)
  return list
}
