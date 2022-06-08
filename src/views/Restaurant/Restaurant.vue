<template>
  <div>
    <!-- 前端分页，数据量不大的时候，一次性从后端拿到所有数据，通过前端逻辑进行分页 -->
    <!-- 分页的逻辑是，通过控制所渲染数组的长度来进行分页，0-9，10-19，... -->
    <el-table
      v-loading="loading"
      :data="restaurants.slice((page-1)*limit,page*limit)"
    >
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
      <!-- 标签 -->
      <el-table-column
        prop="tags"
        label="标签"
        width="255"
      >
        <!-- 插槽 -->
        <!-- scope在这里就是restaurants，是个形参，scope.row代表表格每一行的数据 -->
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.tags"
            :key="tag"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="255"
      >
        <el-button>
          操作
        </el-button>
      </el-table-column>
      <!-- 关闭状态 -->
      <el-table-column
        prop="name"
        label="关闭状态"
        width="255"
      >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isClosed" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next "
      :total="restaurants.length"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import { getRestaurant } from '@/api/restaurant';

export default {
  name: 'Restaurant',
  data() {
    return {
      restaurants: [],
      page: 1,
      limit: 10,
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
        this.loading = true;
        const restaurants = await getRestaurant();
        // 数据重构，通过给原始数据添加上isClose属性，然后再通过该属性判断开关是否打开
        this.restaurants = this.setClosed(restaurants);
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    // 通过changePage事件来改变对应分页渲染的数据
    changePage(v) {
      this.page = v;
    },
    // 重构closed数据，使用后端给的数据要注意是否可以直接用
    setClosed(restaurants) {
      restaurants.forEach((item) => {
        // 如果closed存在
        if (item.closed) {
          // 这里不用item.isClosed的原因是，为了实现响应式
          this.$set(item, 'isClosed', true);
        } else {
          this.$set(item, 'isClosed', false);
        }
      });
      return restaurants;
    },
  },

};
</script>

<style>

</style>
