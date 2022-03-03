import { removeFile, createLocalFile } from './util'

/**
 * @description 将指定文件内的所有内容修改为新内容
 * @param {string} fileName 文件名
 * @returns {boolean} 成功true，失败false
 */
const updateFileAllText = (fileName, text) => {
  if (typeof fileName !== 'string' || typeof text !== 'string') {
    console.error('argument type error.');
    return false
  }

  if (text.length === 0) {
    console.error('argument error.');
    return false
  }

  const isDel = removeFile(fileName)
  if (!isDel) {
    console.error('delete file error.');
    return false
  }

  const isAdd = createLocalFile(text, fileName)
  if (!isAdd) {
    console.error('create file error.');
    return false
  }

  return true
}

export default updateFileAllText
