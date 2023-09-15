module.exports = {
  plugins: {
    // 该插件,自动将px转换成为vw
    'postcss-px-to-viewport': {
      viewportWidth: 375// vw 适配的标准屏的宽度
      // 设计图 750 ->调成1倍 -> 350标准屏幕
    }
  }
}
