<template>
  <div class="article-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="text item">
        <el-form
          :model="form"
          ref="form"
          label-position="left"
          label-width="60px"
          class="demo-ruleForm">
          <el-form-item label="状态:" prop="status">
            <el-radio-group v-model="status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道:">
            <el-select  v-model="channelId" placeholder="请选择">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                :label="channel.name"
                :value="channel.id"
                v-for="(channel, index) in channels"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="日期:">
            <!-- 使用format指定输入框的格式；使用value-format
            指定绑定值的格式。 -->
              <el-date-picker
                v-model="rangeDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="loading" @click="loadArticles(1)">筛选</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{ totalCount }} 条结果：</span>
      </div>
      <div class="text item">
        <el-table
          :data="articles"
          style="width: 100%">
          <el-table-column
            prop="cover"
            label="封面"
            width="180">
             <template slot-scope="scope">
                <el-image
                  style="width: 100px"
                  :src="scope.row.cover.images[0]"
                  fit="cover"
                  lazy
                >
                </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0">草稿</el-tag>
              <el-tag v-else-if="scope.row.status === 1" type="info">待审核</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
              <el-tag v-else-if="scope.row.status === 3" type="warning">审核失败</el-tag>
              <el-tag v-else-if="scope.row.status === 4" type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button @click="onDeleteArtcile(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        :disabled="loading"
        @current-change="onCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      form: {
        status: '',
        channel_id: '',
        date1: '',
        date2: ''
      },
      articles: [], // 文章数据列表
      totalCount: 0, // 文章总条数
      pageSize: 10, // 每页数量
      page: 1, // 页数，默认第一页
      status: null, // 查询文章状态，不传为全部
      channels: [], // 文章频道列表
      channelId: null, // 频道id，不传为全部
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表单数据加载中loading
      articleStatus: [
        { status: 0, text: '草稿', typa: 'info' },
        { status: 1, text: '待审核', typa: '' },
        { status: 2, text: '审核通过', typa: 'success' },
        { status: 3, text: '审核失败', typa: 'warning' }
      ]
    }
  },
  created () {
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      //  展示加载中loading
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
        // 关闭加载中loading
        this.loading = false
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onDeleteArtcile (articleId) {
      this.$confirm('此操作将删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击删除文章
        deleteArticle(articleId.toString()).then(res => {
          console.log(articleId.toString())
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新加载文章列表
          this.loadArticles()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
