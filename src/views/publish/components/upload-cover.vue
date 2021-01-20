<template>
  <div class="uploadCover"  @click="showCoverSelect">
    <div class="cover-wrap">
      <img
        class="cover-image"
        ref="cover-image"
        :src="value">
    </div>

    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <image-list
            :isShowAdd="false"
            :isShowAction="false"
            isShowSelected
            ref="image-list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input
            type="file"
            ref="file"
            @change="onFileChange">
          <img width="100" ref="preview-image">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import imageList from '@/views/image/components/image-list'
import { uploadImages } from '@/api/image'

export default {
  name: 'uploadCover',
  components: {
    imageList
  },
  props: ['value'],
  data () {
    return {
      dialogVisible: false, // 默认隐藏封面遮罩层
      activeName: 'first' // 默认选中素材库
    }
  },
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
    },
    onCoverConfirm () {
      // 如果 tab 是上传图片，并且 input-file 有选择的文件，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImages(fd).then(res => {
          this.dialogVisible = false
          // 将图片地址发给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        this.dialogVisible = false
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px dashed #c0c0c0;
  .cover-image {
    height: 120px;
    max-width: 100%;
  }
}
</style>
