<template>
  <div>
    <el-container>
      <!-- 左侧部分 -->
      <el-aside style="width: 200px">
        <!-- 子组件传递数据到父组件 -->
        <Aside @changePath="changePath" />
      </el-aside>
      <!-- 右侧部分 -->
      <el-container>
        <!-- 右侧头部 -->
        <el-header />
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item> admin </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ path }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 右侧中间部分 -->
        <el-main>
          <!-- 二级路由出口 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// component
import Aside from '@/views/Admin/components/Aside.vue';

export default {
  name: 'Admin',
  components: {
    Aside,
  },
  data() {
    return {
      path: this.$route.path.split('/')[1] || 'restaurant',
    };
  },
  methods: {
    // 子组件传递数据到父组件
    changePath(v) {
      this.path = v;
    },
  },
};
</script>

<style lang="scss" scoped>
// 整体盒子高度
.el-container {
  height: 100vh;
}
// 导航栏右侧竖线
.el-aside {
  border-right: 1px solid #e6e6e6;
}
// 右侧头部横线
.el-header {
  border-bottom: 1px solid #e6e6e6;
}
// 面包屑样式
.el-breadcrumb {
  margin-top: 30px;
  margin-left: 30px;
  font-size: 14px;
}

</style>
