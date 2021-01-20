<template>
  <div class="imageList">
    <div class="action-head">
        <el-radio-group
          size="small"
          v-model="collect"
          @change="onCollectChange"
        >
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button v-if="isShowAdd" size="small" type="success" @click="dialogVisible = true">添加素材</el-button>
      </div>

    <!-- 中间图片 -->
    <el-row :gutter="30">
      <el-col
        class="image-item"
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        v-for="(image, index) in images"
        :key="index"
        @click.native="selected = index"
      >
        <el-image
          style="height: 152px;"
          :src="image.url"
          fit="cover"
          lazy
        >
        </el-image>
        <div class="selected" v-if="isShowSelected && selected === index"></div>
        <div class="image-action" v-if="isShowAction">
          <!-- <i
            :class="{
              'el-icon-star-on': image.is_collected,
              'el-icon-star-off': !image.is_collected
            }"
            @click="onCollect(image)"
            :loading="image.loading"
          ></i>
          <i class="el-icon-delete"></i> -->
          <el-button
            type="warning"
            :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            size="small"
            @click="onCollect(image)"
            :loading="image.loading"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="onDelete(image)"
            :loading="image.loading"
          ></el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      :disabled="loading"
      @current-change="onPageChange"
    >
    </el-pagination>

    <!-- 上传素材弹窗 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-upload
        :show-file-list="false"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        name="image"
        :headers="uploadHeaders"
        :on-success="uploadSuccess"
      >
      <!-- <el-upload
        class="upload-demo"
        drag
        name="image"
        :http-request="uploadImageURL"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      > -->
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getUserImages } from '@/api/user'
import { collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageList',
  props: {
    // 是否显示图片下方的收藏和删除
    isShowAction: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否展示选择
    isShowSelected: {
      type: Boolean, // 布尔值
      default: false // 默认值
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      totalCount: 0, // 文章总条数
      pageSize: 10, // 每页数量
      page: 1, // 默认第一页
      selected: null, // 选中的索引
      collect: false, // 默认查询全部图片
      images: [], // 图片素材列表
      dialogVisible: false, // 是否显示添加素材对话框
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      loading: false // 表单数据加载中loading
    }
  },
  created () {
    this.loadImages(1)
  },
  methods: {
    loadImages (page) {
      // 重置高亮页码，防止数据与页码不对应
      this.page = page

      getUserImages({
        collect: this.collect, // 是否收藏
        page: this.page, // 页数
        per_page: this.pageSize // 每页数量
      }).then(res => {
        // image对象本来没有loading数据
        // 遍历加上
        res.data.data.results.forEach(image => {
          image.loading = false
        })
        this.totalCount = res.data.data.total_count
        this.images = res.data.data.results
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollectChange () {
      this.loadImages(1)
    },
    onCollect (image) {
      // 展示loading
      image.loading = true
      collectImage(image.id, !image.is_collected).then(res => {
        // 更新视图状态
        image.is_collected = !image.is_collected
        // 关闭loading
        image.loading = false
      })
    },
    onDelete (image) {
      image.loading = true
      deleteImage(image.id).then(res => {
        this.loadImages(this.page)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        image.loading = false
      })
    },
    uploadSuccess () {
      // 关闭对话框
      this.dialogVisible = false

      // 更新素材列表
      this.loadImages(this.page)

      this.$message({
        type: 'success',
        message: '上传成功'
      })
    }
    // uploadImageURL (params) {
    //   const file = params.file
    //   const formData = new FormData()
    //   formData.append('file', file)
    //   uploadImage(formData).then(res => {
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.action-head {
  display: flex;
  justify-content: space-between;
}
.image-item {
  width: 150px;
  border: 1px dashed #ddd;
  position: relative;
  display: inline-block;
  margin: 20px;
  margin-bottom: 10px;
  padding: 0 !important;
}
.image-action {
  width: 149px;
  height: 30px;
  background: rgba(0,0,0,.3);
  position: absolute;
  left: 0;
  bottom: 2px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  line-height: 30px;
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
.selected {
  background: url('./selected.png') no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
