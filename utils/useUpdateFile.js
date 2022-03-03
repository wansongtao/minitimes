import dayjs from 'dayjs'
import {
  planPrev,
  separator
} from '../config/index'
import {
  setFileName,
  readFile,
  removeFile,
  createLocalFile,
  verifyDataFormat,
  renameFile
} from './util'

/**
 * @description 更新文件内容(删除原文件)
 * @param {Object} oldVal 需要更新的项
 * @param {Object} newVal 新项
 * @returns {Boolean} 成功true，失败false
 */
const useUpdateFile = (oldVal, newVal) => {
  if (!verifyDataFormat(oldVal, separator) || !verifyDataFormat(newVal, separator)) {
    console.error('argument error.');
    return false
  }

  const oldFileName = setFileName(planPrev, dayjs(oldVal.date).format('YYYYMM'))

  const text = readFile(oldFileName)
  if (!text) {
    return false
  }

  const newText = text.replace(JSON.stringify(oldVal), JSON.stringify(newVal))

  // 将要删除的文件，先重命名，避免创建新文件失败，数据丢失
  const oldFileName_new = 'delete_' + oldFileName
  const isRenameDel = renameFile(oldFileName, oldFileName_new)

  // 重命名失败，直接删除
  if (!isRenameDel) {
    const isDelete = removeFile(oldFileName)
    if (!isDelete) {
      return false
    }
  }

  const newFileName = setFileName(planPrev, dayjs(newVal.date).format('YYYYMM'))
  const isSuccess = createLocalFile(newText, newFileName)

  // 创建新文件失败，恢复原文件
  if (!isSuccess && isRenameDel) {
    renameFile(oldFileName_new, oldFileName)
  }

  // 创建新文件成功，删除原文件
  if (isRenameDel) {
    setTimeout(() => {
      removeFile(oldFileName_new)
    }, 0)
  }

  return isSuccess
}

export default useUpdateFile