<template>
  <div class="aside-container">
    <!-- 左侧导航栏 -->
    <el-menu
      class="el-menu-vertical-demo"
      router
    >
      <!-- 左侧图片 -->
      <div class="img-logo">
        <img
          src="@/assets/logo.png"
          alt=""
          class="img-container"
        >
      </div>
      <!-- 餐馆 -->
      <el-menu-item
        index="/restaurant"
        @click="changePath('restaurant')"
      >
        <i class="el-icon-fork-spoon" />
        <span slot="title">餐馆</span>
      </el-menu-item>
      <!-- 菜单 -->
      <el-menu-item
        index="/menu"
        @click="changePath('menu')"
      >
        <i class="el-icon-food" />
        <span slot="title">菜单</span>
      </el-menu-item>
      <!-- 订单 -->
      <el-menu-item
        index="/order"
        @click="changePath('order')"
      >
        <i class="el-icon-s-order" />
        <span slot="title">订单</span>
      </el-menu-item>
      <!-- 按钮 -->
      <div class="btn-container">
        <el-button>登出</el-button>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  methods: {
    //   子组件传递数据到父组件
    changePath(path) {
      this.$emit('changePath', path);
    },
  },
};
</script>

<style scoped lang="scss">

// 去除导航栏自带的右边样式
.el-menu-vertical-demo {
  border-right: none;
  position: relative;
}
// 图片盒子样式
.img-logo {
  width: 199px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
// 图片大小
.img-container {
  height: 60px;
  width: 60px;
}
// 按钮盒子
.btn-container {
  position: fixed;
  left: 50px;
  bottom: 0px;
}
// 按钮大小
.el-button {
  width: 100px;
  margin-bottom: 50px;
}
</style>
