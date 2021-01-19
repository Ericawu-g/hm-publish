<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="粉丝列表" name="fansList">
        <el-col :span="12">
          <div class="fans-wrap">
            <div class="demo-basic--circle">
            <div class="block"><el-avatar :size="100" :src="circleUrl"></el-avatar></div>
            </div>
            <div class="sub-title">粉丝名称</div>
            <el-button type="primary" size="small">+关注</el-button>
          </div>
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="粉丝画像" name="fansImg">
        <div id="main" style="width: 600px;height:400px;"></div>
      </el-tab-pane>
    </el-tabs>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'FansIndex',
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  data () {
    return {
      activeName: 'fansList',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    }
  }
}
</script>

<style lang="less" scoped>
.fans-wrap {
  width: 120px;
  border: 1px dashed #c0c4cc;
  text-align: center;
  border-radius: 10%;
  padding: 5px 0;
}
.sub-title {
  margin: 10px auto;
}
</style>
