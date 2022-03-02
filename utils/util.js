/**
 * @author wansongtao
 * @date 2022-02-27
 * @description 通用方法库
 */
import {
  filePrev,
  separator
} from '../config/index'

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

/**
 * @description 校验添加的计划数据格式是否正确
 * @param {Object} data 
 * @param {number} data.id 计划id，推荐使用时间戳
 * @param {string} data.name 计划名称
 * @param {string} [data.description] 计划描述
 * @param {string} data.date 计划日期，格式：yyyy/mm/dd
 * @param {string} data.startTime 计划开始时间（不带日期，24小时制）
 * @param {string} data.endTime 计划结束时间（不带日期，24小时制）
 * @param {number} data.state 计划状态，0 待完成  1  已完成  2 已逾期
 * @param {number} data.isDelete 是否删除，0 否  1 是
 * @param {string} data.createTime 创建时间
 * @param {string} [data.updateTime] 修改时间
 * @param {string} [data.deleteTime] 删除时间
 * @returns {Boolean}
 */
export const verifyDataFormat = (data) => {
  if (getDataType(data) !== 'object') {
    console.error('argument type error.');
    return false
  }

  if (typeof data.id !== 'number') {
    console.error('argument error.');
    return false
  }

  if (typeof data.name !== 'string' || data.name.length > 12 || data.name.indexOf(separator) !== -1) {
    console.error('argument error.');
    return false
  }

  if (data.description !== undefined && (typeof data.description !== 'string' || data.description.length > 200 || data.description.indexOf(separator) !== -1)) {
    console.error('argument error.');
    return false
  }

  const dateReg = /^(?:(?!0000)[0-9]{4}([/])(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([/])0?2\2(?:29))$/

  if (dateReg.test(data.date) === false) {
    console.error('argument error.');
    return false
  }

  if (/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(data.startTime) === false) {
    console.error('argument error.');
    return false
  }

  if (/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(data.endTime) === false) {
    console.error('argument error.');
    return false
  }

  if (data.startTime >= data.endTime) {
    console.error('argument range error.');
    return false
  }

  if ([0, 1, 2].includes(data.state) === false) {
    console.error('argument error.');
    return false
  }

  if ([0, 1].includes(data.isDelete) === false) {
    console.error('argument error.');
    return false
  }

  const regExp = /^(?:(?!0000)[0-9]{4}\/(?:(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s+([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

  if (!regExp.test(data.createTime)) {
    console.error('argument error.');
    return false
  }

  if (data.updateTime !== undefined && data.updateTime !== '' && !regExp.test(data.updateTime)) {
    console.error('argument error.');
    return false
  }

  if (data.deleteTime !== undefined && data.deleteTime !== '' && !regExp.test(data.deleteTime)) {
    console.error('argument error.');
    return false
  }

  return true
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
 * @returns {string|false} 成功返回文件内容，失败返回false
 */
export const readFile = (fileName) => {
  if (typeof fileName !== 'string' || !fileName) {
    console.error('argument error.');
    return false
  }

  const fs = wx.getFileSystemManager()
  try {
    const res = fs.readFileSync(`${wx.env.USER_DATA_PATH}/${fileName}`, 'utf8', 0)

    return res
  } catch (e) {
    console.error(e)
    return false
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

  try {
    const fd = fs.openSync({
      filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
      flag: 'a+'
    })
  
    return fd
  } catch(e) {
    console.error(e);
    return false
  }
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
 * @description 设置文件名，默认当前年月
 * @param {string} [val] 年月，格式：yyyymm
 * @returns {string} 返回文件名，命名规则：yyyymm_202201.txt
 */
export const setFileName = (val) => {
  if (val) {
    return `/${filePrev}${val}.txt`
  }

  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return `/${filePrev}${year}${month.toString().padStart(2, '0')}.txt`
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

  if (text.indexOf(separator) === -1) {
    console.error('separator error.');
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

/**
 * @description 删除本地文件
 * @param {string} fileName 文件名
 * @returns {Boolean} 成功true，失败false
 */
export const removeFile = (fileName) => {
  if (typeof fileName !== 'string' || !fileName) {
    console.error('argument error.');
    return false
  }

  const fs = wx.getFileSystemManager()

  try {
    fs.unlinkSync(`${wx.env.USER_DATA_PATH}/${fileName}`)

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}