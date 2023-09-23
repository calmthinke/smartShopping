import request from '@/utils/request'
// 此处存放所以与首页有关的接口请求

// 1.获取首页数据
export const getHomePage = () => {
  // get 请求传参 配置params:{}
  return request.get('/page/detail', {
    params: {
      pageId: 0
    }
  })
}
