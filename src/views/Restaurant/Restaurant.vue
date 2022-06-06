<template>
  <div>
    <el-table :data="restaurants">
      <!-- 名称 -->
      <el-table-column
        prop="name.zh-CN"
        label="名称"
        width="255"
      />
      <!-- 地址 -->
      <el-table-column
        prop="address.formatted"
        label="地址"
        width="255"
      />
      <!-- tags -->
      <el-table-column
        prop="tags"
        label="tags"
        width="255"
      />
      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="255"
      >
        <el-button @click="openModel">
          操作
        </el-button>
      </el-table-column>
      <!-- 关闭状态 -->
      <el-table-column
        prop="name"
        label="关闭状态"
        width="255"
      >
        <!-- <el-switch
          v-model="close"
          active-color="#13ce66"
          inactive-color="#ff4949"
        /> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import getRestaurant from '@/api/restaurant.js';

export default {
  name: 'Restaurant',
  data() {
    return {
      restaurants: [],
      close: false,
    };
  },
  computed: {
  },
  created() {
    this.loadRestaurant();
  },
  methods: {
    // 发送请求获取餐馆数据
    async loadRestaurant() {
      try {
        const restaurants = await getRestaurant();
        this.restaurants = restaurants;
      } catch (error) {
        console.log(error);
      }
    },
    openModel() {
      console.log(0);
    },
    // changeClose() {
    //   this.close = !this.close;
    // },
  },
};
</script>

<style>

</style>
