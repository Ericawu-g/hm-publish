<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

    <div class="settings-wrap">
      <el-form :model="user" :rules="rules" ref="ruleForm" label-width="100px" class="settings-form">
        <el-form-item label="编号：">
          <span>{{ user.id }}</span>
        </el-form-item>
        <el-form-item label="手机：">
          <span>{{ user.mobile}}</span>
        </el-form-item>
        <el-form-item label="媒体名称：" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="媒体介绍：" prop="intro">
          <el-input type="textarea" v-model="user.intro"></el-input>
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱："
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" :loading="updateProfileLoading" @click="updateUser">保存设置</el-button>
        </el-form-item>
      </el-form>

      <el-upload
        ref="masterPic"
        class="avatar-uploader"
        action="upload_url"
        :http-request="onChangePhoto"
        :show-file-list="false"
      >
        <el-avatar
          v-if="user.photo"
          class="avatar"
          shape="square"
          :size="180"
          fit="fill"
          :src="user.photo"
        >
        </el-avatar>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div class="title">修改头像</div>
      </el-upload>
    </div>
    </el-card>
  </div>
</template>

<script>
import { getUserProfile, updateUserInfo, updateUserPhoto } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      updateProfileLoading: false,
      ruleForm: {
        name: '',
        intro: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请填写媒体介绍', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onChangePhoto (config) {
      const fd = new FormData()
      fd.append('photo', config.file)
      updateUserPhoto(fd).then(res => {
        // 更新视图展示
        this.user.photo = window.URL.createObjectURL(config.file)
        this.$message({
          type: 'success',
          message: '更新头像成功'
        })
      })
    },
    updateUser () {
      // 开启loading状态
      this.updateProfileLoading = true
      updateUserInfo({
        name: this.user.name,
        intro: this.user.intro,
        email: this.user.email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 关闭loading状态
        this.updateProfileLoading = false
        // 更新头部当前登录用户的信息
        globalBus.$emit('update-user', this.user)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item {
  width: 400px;
}
.settings-wrap {
  display: flex;
}
.settings-form {
  flex: 1;
}
.avatar-uploader {
  margin-right: 50px
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.title {
  margin-top: 5px;
}
</style>
