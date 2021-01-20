<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form
        :model="user"
        ref="login-form"
        :rules="formRules"
        class="login-form"
      >
        <el-form-item label="" prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="agree">
            <el-checkbox label="" v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
           class="login-btn"
           type="primary"
           @click="onLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },
      isLoading: false, // 默认关闭loading层
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[|3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      this.$refs['login-form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.login()
      })
    },
    login () {
      // 开启登陆中loading
      this.isLoading = true
      login(this.user).then(res => {
        // 登陆成功，跳转首页
        this.$message({
          type: 'success',
          message: '登陆成功'
        })
        // this.$router.push('/')
        // 关闭loading
        this.isLoading = false

        // 将接口返回数据存放到本地存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        this.$router.push({
          name: 'home'
        })
      }).catch(error => {
        console.log(error)
        // 登陆失败
        this.$message.error('手机号或验证码错误')
        // 关闭loading
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background: #fff;
    .login-head {
      height: 57px;
      display: flex;
      justify-content: center;
      .logo {
        width: 150px;
        background: url('./logo_index.png') no-repeat;
        background-size: contain; // 把图像扩展至最大尺寸，以使宽度和高度 完全适应内容区域
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}

</style>
