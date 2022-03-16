/**
 * @author wansongtao
 * @date 2022-03-16
 * @description 文件相关api
 */

/**
 * @description 创建目录，如果目录已存在则不会重新创建，直接返回
 * @param {string} path 目录路径
 * @param {boolean} [recursive=false] 是否在递归创建该目录的上级目录后再创建该目录，默认否
 * @returns {Boolean} 成功true，失败false
 */
export const mkdirDirectory = (path, recursive = false) => {
  if (typeof path !== 'string' || typeof recursive !== 'boolean') {
    console.error('argument type error');
    return false
  }

  if (path.indexOf('/') !== 0) {
    path = '/' + path
  }

  const fs = wx.getFileSystemManager()

  try {
    fs.accessSync(`${wx.env.USER_DATA_PATH}${path}`)
    return true
  } catch (e) {
    // 目录不存在，创建
    // console.error(e)
  }

  try {
    fs.mkdirSync(`${wx.env.USER_DATA_PATH}${path}`, recursive)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * @description 获取对应目录下的文件列表
 * @param {string} path 目录路径
 * @returns {object[]} 成功返回文件列表，失败返回空数组
 */
export const getFileList = (path) => {
  if (typeof path !== 'string') {
    console.error('argument type error');
    return []
  }

  if (path.indexOf('/') !== 0) {
    path = '/' + path
  }

  const fs = wx.getFileSystemManager()

  try {
    const res = fs.readdirSync(`${wx.env.USER_DATA_PATH}${path}`)
    return res
  } catch (e) {
    console.error(e)
    return []
  }
}