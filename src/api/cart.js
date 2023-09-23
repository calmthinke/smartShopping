import request from '@/utils/request'
// ---------------------------------------------------------------------

// 添加商品到购物车
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// export const addCart = (goodsId, goodsNum, goodsSkuld) => {
//   return request.post('/cart/add', {
//     goodsId,
//     goodsNum,
//     goodsSkuld
//   })
// }

// ---------------------------------------------------------------------
// 获取购物车列表数据
export const getCartList = () => {
  return request.get('/cart/list')
}
// ---------------------------------------------------------------------
export const changeCount = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    // 传递的body参数
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// ---------------------------------------------------------------------
// 删除购物车数据
export const delSelect = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}
