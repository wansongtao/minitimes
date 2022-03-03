import {
  removeFile,
  createLocalFile,
  renameFile
} from './util'

/**
 * @description 将指定文件内的所有内容修改为新内容(删除原文件)
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

  // 将要删除的文件，先重命名，避免创建新文件失败，数据丢失
  const delFileName = 'delete_' + fileName
  const isRename = renameFile(fileName, delFileName)

  // 重命名失败，直接删除
  if (!isRename) {
    const isDel = removeFile(fileName)
    if (!isDel) {
      console.error('delete file error.');
      return false
    }
  }

  const isAdd = createLocalFile(text, fileName)
  if (!isAdd) {
    // 创建新文件失败，恢复原文件
    if (isRename) {
      renameFile(delFileName, fileName)
    }

    console.error('create file error.');
    return false
  }

  // 创建新文件成功，删除原文件
  if (isRename) {
    setTimeout(() => {
      removeFile(delFileName)
    }, 0)
  }

  return true
}

export default updateFileAllText