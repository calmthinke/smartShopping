// 用户权证信息本地化永久储存
// 约定一个通用的键名
const INFO_KEY = 'my_shopping_info'
// 获取个人信息
export const getInfo = () => {
  const defaultObj = {
    token: '',
    userId: ''
  }
  const res = localStorage.getItem(INFO_KEY)
  return res ? JSON.parse(res) : defaultObj
}
// 设置个人信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}
// 清除个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}
