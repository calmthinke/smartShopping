import request from '@/utils/request'
// 此处存放所以与登录有关的接口请求

// 1.获取图形验证码
export const getPiCode = () => {
  return request.get('/captcha/image')
}

// 2.获取短信验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode: captchaCode, // 用户输入的图形验证码
      captchaKey: captchaKey, // 图形验证码的唯一标识
      mobile: mobile// 发送短信的手机号
    }
  })
}

// 3.登录请求
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      smsCode: smsCode,
      mobile: mobile,
      isParty: false, // 是否三方登录
      partyData: {}// 三方登录的信息
    }
  })
}
