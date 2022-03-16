/**
 * @author wansongtao
 * @date 2022-03-16
 * @description 文件相关api
 */

/**
 * @description 创建目录
 * @param {string} path 目录路径
 * @param {boolean} [recursive=false] 是否在递归创建该目录的上级目录后再创建该目录，默认否
 * @returns {Boolean}
 */
export const mkdirDirectory = (path, recursive = false) => {
  if (typeof path !== 'string' || typeof recursive !== 'boolean' ) {
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
  } catch(e) {
    // 目录不存在，创建
    // console.error(e)
  }

  try {
    fs.mkdirSync(`${wx.env.USER_DATA_PATH}${path}`, recursive)
    return true
  } catch(e) {
    console.error(e)
    return false
  }
}
