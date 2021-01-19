<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-table
        :data="articles"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="200">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="150">
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
          width="150">
        </el-table-column>
        <el-table-column
          prop="comment_status"
          label="状态"
          width="150">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              @change="onStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        :disabled="loading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import { updateCommentStatus } from '@/api/comment'

export default {
  name: 'CommentIndex',
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 文章总条数
      pageSize: 10, // 每页数量
      page: 1, // 页数，默认第一页
      loading: false
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDisables = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(
        res => {
          // 启用开关
          article.statusDisables = false
          this.$message({
            type: 'success',
            message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
          })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
