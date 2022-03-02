import dayjs from 'dayjs'
import { planPrev, separator } from '../config/index'
import {
  setFileName,
  readFile,
  removeFile,
  createLocalFile,
  verifyDataFormat
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

  const isDelete = removeFile(oldFileName)
  if (!isDelete) {
    return false
  }

  const newFileName = setFileName(planPrev, dayjs(newVal.date).format('YYYYMM'))
  const isSuccess = createLocalFile(newText, newFileName)
  return isSuccess
}

export default useUpdateFile
