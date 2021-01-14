<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px">
       <app-aside :is-collapse="isCollapse"/>
      </el-aside>
      <el-container>
        <el-header>
          <div>
            <i :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse}"
              @click="isCollapse = !isCollapse"
            ></i>
            <span>江苏传智播客科技教育有限公司</span>
          </div>
          <el-dropdown>
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo">
              <span>{{ user.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu style="margin-top: 20px;" slot="dropdown">
              <el-dropdown-item>
                <i class="el-icon-setting"></i>
                个人设置
              </el-dropdown-item>
              <el-dropdown-item>
                <i class="el-icon-unlock"></i>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <!-- 子路由出口 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      isCollapse: false, // 侧边栏展开状态
      user: {}
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo () {
      getUserProfile().then(res => {
        // 获取返回的用户数据
        this.user = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .layout-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .el-container {
      height: 100%;
      .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dadce0;
        .avatar-wrap {
          display: flex;
          text-align: center;
          .avatar {
            width: 30px;
            height: 30px;
            margin-right: 5px;
          }
        }
        .el-icon-s-fold,.el-icon-s-unfold {
          font-size: 22px;
        }
      }
    }
  }
</style>
