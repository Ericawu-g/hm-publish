<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        :model="article"
        :rules="rules"
        ref="publish-form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title" style="width: 500px;">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <upload-cover
              :key="cover"
              v-for="(cover, index) in article.cover.type"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择">
            <el-option
              :label="channel.name"
              v-for="(channel, index) in channels"
              :key="index"
              :value="channel.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{ this.$route.query.id ? '修改' : '发表'}}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getChannels, getArticle, editArticle, publishArticle } from '@/api/article'
import UploadCover from './components/upload-cover'

export default {
  name: 'PublishIndex',
  components: {
    UploadCover
  },
  data () {
    return {
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型
          images: [] // 封面图片地址
        },
        channel_id: null // 频道
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              console.log('validator')
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  created () {
    this.loadChannels()
    // 因为发布和修改使用同一个组件
    // 如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticles()
    }
  },
  methods: {
    loadChannels () {
      getChannels().then(res => {
        // 获取频道列表
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft) {
      this.$refs['publish-form'].validate((valid) => {
        if (!valid) {
          return
        }
        // 验证通过提交表单
        // 如果是修改文章执行修改操作否则执行添加操作
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作
          editArticle(articleId, this.article, draft).then(res => {
            this.$message({
              type: 'suceess',
              message: `${draft ? '存入草稿成功' : '修改成功'}`
            })
            this.$router.push('/article')
          })
        } else {
          // 执行添加操作
          publishArticle(this.article, draft).then(res => {
            this.$message({
              type: 'success',
              message: `${draft ? '存入草稿成功' : '发布成功'}`
            })
            this.$router.push('/article')
          })
        }
      })
    },
    loadArticles () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
