<template>
    <div class="count-box">
      <button @click="handleSub" class="minus">-</button>
      <input :value="value" class="inp" @change="handleChange" type="text">
      <button @click="handleAdd" class="add">+</button>
    </div>
  </template>
<script>
export default {
// V-model :value 和 @input的组合
// 1.父传子(父:属性,子:props接收)
  props: {
    value: {
      type: Number,
      default: 1
    }

  },
  // 2.子传父,(子:this.$emit('父组件事件名',传递参数))
  methods: {
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    handleSub () {
      if (this.value <= 1) { return }
      this.$emit('input', this.value - 1)
    },
    // 当用户直接在输入框输入的时候
    handleChange (e) {
      // e 事件对象
    //   console.log(e.target.value)// 获取输入框的值(当失去焦点的时候或者回车时候 打印)
      const num = +e.target.value// 转数字,不是数字会被转为NAN
      if (isNaN(num)) {
        e.target.value = this.value
      }
      this.$emit('imput', num)
    }
  }
}
</script>

  <style lang="less" scoped>
  .count-box {
    width: 110px;
    display: flex;
    .add, .minus {
      width: 30px;
      height: 30px;
      outline: none;
      border: none;
      background-color: #efefef;
    }
    .inp {
      width: 40px;
      height: 30px;
      outline: none;
      border: none;
      margin: 0 5px;
      background-color: #efefef;
      text-align: center;
    }
  }
  </style>
