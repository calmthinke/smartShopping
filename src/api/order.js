import request from '@/utils/request'

// 订单结算确认
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    // 传递的query参数
    params: {
      mode, // cart or buyNow
      delivery: 0, // 10 快递 20 门店自提
      couponId: 0, // 优惠券Id
      isUsePoints: 0, // 积分
      ...obj// 将传递过来的参数动态展开
    }
  })
}
// -------------------------------------------------------
// 提交订单
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 物流方式  配送方式 (10快递配送 20门店自提)
    couponId: 0, // 优惠券 id
    payType: 10, // 余额支付
    isUsePoints: 0, // 是否使用积分
    ...obj
  })
}
// -------------------------------------------------------
// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    // 传递query参数
    params: {
      dataType,
      page
    }
  })
}
