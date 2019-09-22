<template>
  <div class="container">
    <div class="top">
      <slot name="top">按钮</slot>
      <div class="btn" @click="handleClick">
        <div class="arrow" :class="{ 'arrowTop' : arrowTop, 'arrowBottom': arrowBottom}"></div>
      </div>
    </div>
    <transition name="showlist">
      <div v-show="isShow">
        <slot name="bottom"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  // 下拉菜单组件
  data () {
    return {
      isShow: false,
      arrowTop: false,
      arrowBottom: true
    }
  },
  methods: {
    handleClick () {
      this.isShow = !this.isShow
      this.arrowTop = !this.arrowTop
      this.arrowBottom = !this.arrowBottom
      console.log(1)
    }
  }
}
</script>

<style scoped>
  .container {
    width: 100%;
    min-height: 60px;
  }
    .top {
      box-sizing: border-box;
      width: 100%;
      height: 60px;
      padding: 0 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
      .btn {
        width: 58px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .arrow {
        width: 0;
        height: 0;
        border-width: 7px;
        border-style: solid;
        border-color:#aaa transparent transparent transparent;
      }
  .showlist-enter-active, .showlist-leave-active {
    transition: all .3s;
    transform: translateY(0);
  }
  .showlist-enter, .showlist-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
.arrowTop {
  transform: rotate(180deg);
  transition: all .5s;
}
.arrowBottom {
  transform: rotate(0deg);
  transition: all .5s;
}
</style>
