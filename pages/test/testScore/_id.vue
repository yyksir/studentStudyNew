<template>
  <div class="container">
    详情 id 是 {{text}}
  </div>
</template>

<script>
export default {
  layout: 'index',
  data () {
    return {
      text: '加载中...'
    }
  },
  created () {
    this.text = this.$route.params.id
    // console.log(this.$route.params)
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
  .container
    width 100%
    height 100%
</style>
