<template>
  <div>
    <!-- 顶部下拉列表 -->
    <!-- 点击下拉框选项发送请求获取菜单数据 -->
    <el-select
      v-model="value"
      v-loading="loading"
      placeholder="请选择"
      @change="loadMenus"
    >
      <!-- label下拉框选项数据 -->
      <el-option
        v-for="item in restaurants"
        :key="item._id"
        :label="item.name['zh-CN']"
        :value="item._id"
      />
    </el-select>
    <el-table
      :data="menus.list"
      style="width: 100%"
    >
      <el-table-column
        prop="name.zh-CN"
        label="名称"
        width="180"
      />
      <el-table-column
        label="价格"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.price | currencyUSD }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="状态"
        width="180"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            @change="reviseAvailable(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash';
import { getRestaurant } from '@/api/restaurant';
import { getMenu, postAvailable } from '@/api/menu';

export default {
  name: 'Menu',
  data() {
    return {
      restaurants: [],
      menus: [],
      value: '',
      page: 1,
      limit: 10,
      keyword: '',
    };
  },
  computed: {
  },
  created() {
    // 获取全部餐馆数据
    this.loadRestaurant();
  },
  methods: {
    // 发送请求获取餐馆数据
    async loadRestaurant() {
      try {
        this.loading = true;
        this.restaurants = await getRestaurant();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    // 发送请求获取菜单信息
    async loadMenus() {
      try {
        this.loading = true;
        this.menus = await getMenu({
        // eslint-disable-next-line no-underscore-dangle
          id: this.value, page: this.page, limit: this.limit, keyword: this.keyword,
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    // 发送请求，修改开关状态
    async reviseAvailable(food) {
      try {
        this.loading = true;
        await postAvailable({
          // eslint-disable-next-line no-underscore-dangle
          id: food._id,
          data: {
            ..._.omit(food, '_id'),
          },
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        // 修改完之后还是要重新获取一下菜单数据
        await this.loadMenus();
        this.loading = false;
      }
    },
  },
};
</script>

<style>

</style>
