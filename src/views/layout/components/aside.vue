<template>
  <div class="aside-container">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#002033"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse"
    >
      <div :class="{
        asideLogo: !isCollapse,
        noLogo: isCollapse
        }"></div>
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-document"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="el-icon-picture"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-present"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideIndex',
  props: ['isCollapse'],
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  .aside-container {
    height: 100%;
    .el-menu-vertical-demo {
      height: 100%;
      .asideLogo {
      height: 35px;
      background: url('./logo_admin.png') no-repeat;
      background-size: contain;
      margin: 10px;
      }
      .noLogo {
        height: 40px;
        background-size: contain;
        margin: 10px;
      }
      .el-menu-item {
        color: #fff;
      }
    }
  }
</style>
