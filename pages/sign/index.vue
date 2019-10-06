<template>
  <div class="loginContainer">
    <a-spin class="mask" tip="加载中......" v-if="isLoading" />
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input placeholder="用户名"
          v-decorator="[
            'userName',
            { rules: [{ required: true, message: '请输入用户名!' }] }
          ]"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input placeholder="密码" type="password"
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码!' }] }
          ]"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <!-- <a-checkbox
          v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true,
            }
          ]"
        >
          Remember me
        </a-checkbox> -->
        <!-- <a class="login-form-forgot" href="javascript:;">Forgot password</a> -->
        <a-button class="login-form-button" type="primary" html-type="submit">
          登录
        </a-button>
        <!-- 或者 <a href="javascript:;">现在去注册!</a> -->
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'signIn',
  data () {
    return {
      // userName: '',
      // password: '',
      isLoading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.signIn(values)
          console.log(values, 'values')
        }
      })
    },
    signIn (values) {
      this.isLoading = true
      // userType ['0 管理员', '1 校长', '2 教师']
      this.$API.POST('/system/doStLogin', { userType: 0, ...values})
        .then((res) => {
          setTimeout(() => {
            this.isLoading = false
            console.log(res, 'res 登陆成功')
          }, 2000)
        })
        .catch((err) => {
          this.isLoading = false
          console.log(err, 'err 登录失败')
        })
    }
    //
  }
  //
}
</script>

<style scoped lang="stylus">
  .loginContainer
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    .mask
      box-sizing border-box
      width 100%
      height 100%
      padding-bottom 100px
      display flex
      justify-content center
      align-items center
      position fixed
      left 0
      top 0
      z-index 9999
      background-color rgba(0, 0, 0, .5)
      & >>> .ant-spin-text
        color #000
    #components-form-demo-normal-login
      width 30%
      height 300px
      .login-form
        max-width: 300px
      .login-form-forgot
        float: right
      .login-form-button
        width: 100%
</style>
