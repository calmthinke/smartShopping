<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />
    <!-- 轮播图区域 -->
    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{detail.goods_price_min}}</span>
          <span class="oldprice">￥{{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{total}})</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commitsList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url ||  defaultImg" alt="">
            <div class="name">{{item.user.nick_name}}</div>
            <van-rate :size="16" :value="item.score/2" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
            {{item.content}}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
      <!-- 注意渲染内容还有标签的时候,采用的方式  -->
    <div class="desc" v-html="detail.content">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" />
        <span @click="gotoHome">首页</span>
      </div>
      <div class="icon-cart">
        <!-- 购物车上面的小图标 -->
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" />
        <span @click="$router.push('/cart')">购物车</span>
      </div>
      <div class="btn-add" @click="addFn">加入购物车</div>
      <div class="btn-buy" @click="buyFn">立刻购买</div>
    </div>

    <!-- 弹层效果 -->
    <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="detail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ detail.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ detail.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <CountBox v-model="addCount"></CountBox>
        </div>
        <!-- 有库存,才显示提示按钮 -->
        <div class="showbtn" v-if="detail.stock_total>0">
          <div class="btn" v-if="mode==='cart'" @click="addMyCart">加入购物车</div>
          <div class="btn now" v-else @click="goBuyNow">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
import { getProDetail, getProCommits } from '@/api/product'
import defaultImg from '@/assets/default-avatar.png'
import { addCart } from '@/api/cart'
// 导入自定义组件
import CountBox from '@/components/CountBox.vue'
// 导入mixins
import loginConfirm from '@/mixins/loginConfirm'
export default {
  name: 'ProDetail',
  mixins: [loginConfirm],
  // 注册自定义的组件
  components: {
    CountBox
  },
  data () {
    return {
      images: [

      ],
      current: 0,
      defaultImg: defaultImg, // 默认头像
      detail: '', // 请求获取的后台商品数据
      total: 0, // 评价总数
      commitsList: [], // 显示评价列表
      showPannel: false, // 控制弹层的显示隐藏
      mode: 'cart', // 控制弹层标题
      addCount: 2, // 数字框绑定的数据
      cartTotal: 0// 购物车数量
    }
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    async getDetail () {
      const res = await getProDetail(this.goodsId)
      const { data: { detail } } = res
      this.detail = detail
      this.images = detail.goods_images
    },
    async getCommits () {
      const res = await getProCommits(this.goodsId, 3)
      const { data: { list, total } } = res
      this.commitsList = list
      this.total = total
    },
    addFn () {
      this.mode = 'cart'
      this.showPannel = true
    },
    buyFn () {
      this.mode = 'buyNow'
      this.showPannel = true
    },
    async addMyCart () {
      // 判断token的有无,没有显示弹窗
      // 有继续请求
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作哟',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛逛'
        })
        // 点击确认后的逻辑
          .then(() => {
          // 问题:跳转到登录并点击后,不能跳转回来,直接进到了首页
          // 解决:需要跳转去携带参数(当前的路径地址)
            // this.$router.push({
            //   path: '/login',
            //   query: {
            //     backUrl: this.$route.fullPath
            //   }
            // })
          // 问题:商品列表页->商品详情页->登录->商品详情页,当点击返回时,会回到登录页,用户体验不好
          // 希望实现:商品列表->商品详情,直接替换
          // push与replace的区别
          // push:往历史记录里面不断累加
          // replace:不会累加历史记录,直接替换当前

            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {
          // 点击取消后的逻辑
          })

        return
      }
      // 问题:
      // 解决了,真的是参数传的有问题(拼写的锅),人家报错说这里有问题,你要相信人家,别个多少年历史了,还质疑
      const res = await addCart(this.goodsId, this.addCount, this.detail.skuList[0].goods_sku_id)
      const { data } = res
      // 问题:一波未平一波又起
      // 不应该每次刷新后有回到最初的值,怎么刷新后还是在原本的值上++,
      this.cartTotal = data.cartTotal
      this.$toast('加入购物车成功')
      this.showPannel = false
    },
    gotoHome () {
      this.$router.push('/')
    },
    goBuyNow () {
      // 没有编写loginConfirm 但是可以直接this调用,因为已经mixin
      if (this.loginConfirm()) {
        return
      }
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'buyNow',
          goodsId: this.goodsId,
          goodsSkuId: this.detail.skuList[0].goods_sku_id,
          goodsNum: this.addCount
        }
      })
    }

  },
  computed: {
    // 获取路由参数中的商品id,以此来确定传过来的是哪一个商品
    // 注意动态路由传参获取参数与普通传参获取参数的区别
    goodsId () {
      // return this.$route.query.id
      return this.$route.params.id
    }
  },
  created () {
    this.getDetail()
    this.getCommits()
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}

//弹层的样式
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}

//购物车上面的小图标
.footer .icon-cart {
  position: relative;
  padding: 0 6px;
  .num {
    z-index: 999;
    position: absolute;
    top: -2px;
    right: 0;
    min-width: 16px;
    padding: 0 4px;
    color: #fff;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 50%;
  }
}
</style>
