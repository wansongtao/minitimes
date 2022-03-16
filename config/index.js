export const weeks = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
];

/**
 * @description 计划相关文件名前缀
 */
export const planPrev = 'plans_'

/**
 * @description 计划文件存放目录
 */
export const planDirectory = '/plan'

/**
 * @description 笔记相关文件名前缀
 */
export const noteFilePrev = 'notes_'

/**
 * @description 笔记文件存放目录
 */
export const noteDirectory = '/note'

/**
 * @description 数据分割符
 */
export const separator = '#&#'

/**
 * @description 提示语
 */
export const commonNotice = `本应用不会上传您的任何数据，所有数据都将保存在您的本地文件中。如果您删除该小程序或清理微信存储空间，
则您之前所有的数据都将销毁，请慎重决定！推荐先导出数据，再进行相关操作。`

/**
 * @description 校验添加的笔记数据格式是否正确
 * @param {Object} data 
 * @param {number} data.id 笔记id，推荐使用时间戳
 * @param {string} data.title 笔记标题，最长20个字符
 * @param {string} data.content 笔记内容，最长999个字符
 * @param {number} data.isDelete 是否删除，0 否  1 是
 * @param {string} data.createTime 创建时间，格式：yyyy/mm/dd hh:mm:ss
 * @param {string} [data.updateTime] 修改时间
 * @param {string} [data.deleteTime] 删除时间
 * @param {string} separator 不允许出现在标题和内容中的特殊字符
 * @returns {Boolean}
 */
export const verifyNoteFormat = (data, separator) => {
    if (typeof separator !== 'string') {
        console.error('argument type error.');
        return false
    }

    const res = Object.prototype.toString.call(data).split(' ')[1]
    if (res.substring(0, res.length - 1).toLowerCase() !== 'object') {
        console.error('argument type error.');
        return false
    }

    if (typeof data.id !== 'number') {
        console.error('argument error.');
        return false
    }

    if (typeof data.title !== 'string' || data.title.length > 20 || data.title.indexOf(separator) !== -1) {
        console.error('argument error.');
        return false
    }

    if (typeof data.content !== 'string' || data.content.length > 999 || data.content.indexOf(separator) !== -1) {
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
