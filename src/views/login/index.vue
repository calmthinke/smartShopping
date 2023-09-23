<template>
  <div class="login">
    <!-- 1.导航头 -->
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <!-- 2.核心内容 -->
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>
      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <!-- 在 Vue.js 项目中，@ 符号通常被配置为指向 src 目录。因此，'@/assets/code.png' 将被解析为 'src/assets/code.png' -->
          <img v-if="picUrl" :src="picUrl" alt="" @click="getPicCode">
        </div>
        <div class="form-item">
          <input v-model="smsCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
          {{totalSecond === second ? "获取验证码" : second+"秒后获取验证码"}}
          </button>
        </div>
      </div>
      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
// 按需导入相关的封装的请求模块
import { getPiCode, getMsgCode, codeLogin } from '@/api/login'
import { Toast } from 'vant'
export default {
  name: 'LoginPage',
  async created () {
    this.getPicCode()
  },
  data () {
    return {
      // 图形验证码功能
      picKey: '', // 将来请求传递的唯一标识
      picUrl: '', // 存储请求渲染的图片地址
      // 短信验证码功能
      totalSecond: 60, // 倒计时总秒数
      second: 60, // 当前秒数,对second--
      timer: null, // 定时器id
      // 手机号码以及图形验证码验证
      picCode: '', // 用户输入的图形验证码
      mobile: '', // 用户输入的手机号码
      // 登录接口
      smsCode: ''// 用户输入的短信验证码
    }
  },
  methods: {
    // 获取图形验证码
    async getPicCode () {
      // const res = await request.get('/captcha/image')
      // 解构赋值
      const { data: { base64, key } } = await getPiCode()
      this.picUrl = base64
      this.picKey = key

      Toast('获取图形验证码成功')
    },
    // 手机号以及输入的图形验证码的检验
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        Toast('请输入正确的手机号')
        return false
      }
      // 问题:
      // 只判断了输入验证码的位数,没有判断输入的和后台请求回来的验证码是否相等(发送请求时,根据返回值判断)
      if (!/^\w{4}$/.test(this.picCode)) {
        Toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    // 短信验证倒计时功能
    async getCode () {
      // 1.点击前,进行手机号码以及图形验证码的验证
      if (!this.validFn()) {
        return
      }

      // 2.点击后开始倒计时
      // 问题:
      // 1.重复点击 多次开启定时器(通过timer)
      // 2.会一直--,变为负数(到达临界条件后就清除定时器)
      // 3.离开当前页面后,一直还有倒计时(通过生命周期钩子 destroyed)
      if (this.timer === null && this.second === this.totalSecond) {
      // 开启倒计时
      // 发送请求(如果响应的status不是200的话,最好抛出一个promise错误,await只会等待成功的promise)
        const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
        Toast(res.message)
        // if (res.status !== 200) return 失败的逻辑统一配置拦截器处理,这里只考虑成功的逻辑

        this.timer = setInterval(() => {
          this.second--
          console.log('正在倒计时')
          if (this.second < 1) {
            clearInterval(this.timer)// 清除当前定时器
            this.timer = null// 重置定时器
            this.second = this.totalSecond// 秒数
          }
        }, 1000)
      }
    },
    // 登录功能(封装登录的接口,再次进行校验)
    async login () {
      if (!this.validFn()) {
        return
      }
      // 问题:
      // 只判断了短信验证码的位数(发送请求的时候判断,是否与后台发送的数据一致)
      if (!/^\d{6}$/.test(this.smsCode)) {
        Toast('请输入正确的短信验证码')
        return
      }
      const res = await codeLogin(this.mobile, this.smsCode)
      this.$store.commit('user/setUserInfo', res.data)
      Toast('登录成功')
      // ---------------------------------------------------------
      // 判断有无回跳地址
      // 有:去回跳页面
      // 没有:正常去首页

      const url = this.$route.query.backUrl || '/'
      // this.$router.push(url)
      this.$router.replace(url)

      // ----------------------------------------------------------
      // 失败的逻辑,进行拦截统一处理,在页面中只考虑成功的逻辑
      // if (res.status === 200) {
      //   this.$router.push('/')
      // }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
