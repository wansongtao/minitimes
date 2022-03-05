/**
 * @description 微信弹窗相关方法
 * @author 万松涛
 * @date 2022/03/04
 */

 /**
  * @description 显示一个确认弹窗
  * @param {string} title 标题
  * @param {string} content 内容
  * @returns {Promise} 点击确定resolve(true)，点击取消resolve(false)，错误reject()
  */
export const showModal = (title, content) => {
  return new Promise((resolve, reject) => {
    if (typeof title !== 'string' || typeof content !== 'string') {
      console.error('argument type error');
      reject()
      return
    }

    wx.showModal({
      title,
      content,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          resolve(false)
        }
      },
      fail(err) {
        console.error(err);
        reject()
      }
    })
  })
}