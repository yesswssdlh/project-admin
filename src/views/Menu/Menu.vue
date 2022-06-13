<template>
  <div>
    <!-- 顶部下拉列表 -->
    <!-- 点击下拉框选项发送请求获取菜单数据 -->
    <el-select
      v-model="selected"
      v-loading="loading"
      placeholder="请选择"
      filterable
      :filter-method="filterMethod"
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
    <!-- 表格内容 -->
    <el-table
      :data="menus"
      style="width: 100%"
    >
      <!-- 名称 -->
      <el-table-column
        prop="name.zh-CN"
        label="名称"
        width="220"
      />
      <!-- 输入框 -->
      <el-table-column
        align="right"
        width="220"
      >
        <template
          slot="header"
        >
          <el-input
            v-model="keyword"
            size="medium"
            placeholder="输入关键字搜索"
            @change="getKeywordData"
          />
        </template>
      </el-table-column>
      <!-- 价格 -->
      <el-table-column
        label="价格"
        width="426"
      >
        <template slot-scope="scope">
          {{ scope.row.price | currencyUSD }}
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column
        v-loading="loading"
        prop="address"
        label="状态"
        width="426"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            @change="reviseAvailable(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="1"
      :page-sizes="[10, 50, 100]"
      :page-size="limit"
      layout="prev, pager, next, sizes"
      :total="total"
      @current-change="changePage"
      @size-change="changeLimit"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { getRestaurant } from '@/api/restaurant';
import { getMenu, postAvailable } from '@/api/menu';
import PinyinMatch from 'pinyin-match';

export default {
  name: 'Menu',
  data() {
    return {
      restaurants: [],
      copyRestaurant: [],
      menus: [],
      selected: '',
      page: 1,
      limit: 10,
      keyword: '',
      total: 0,
      loading: false,
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
        this.copyRestaurant = _.cloneDeep(this.restaurants);
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
        const result = await getMenu({
        // eslint-disable-next-line no-underscore-dangle
          id: this.selected, page: this.page, limit: this.limit, keyword: this.keyword,
        });
        this.menus = result.list;
        this.total = result.count;
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
    // 分页，修改页数
    // 点击对应的页数，发送请求获取当前页的菜单数据
    async changePage(v) {
      this.page = v;
      await this.loadMenus();
    },
    // 分页，修改每页多少条数据
    async changeLimit(v) {
      // 每次修改之前，要让菜单数据展示为第一页的数据
      // 比如当页数为第11页，每页10条数据时，修改为每页50条数据，
      // 页数如果不变为第一页，不能保证每页50条数据时，数据量能够达到11页，如果不够就会报错
      this.page = 1;
      this.limit = v;
      await this.loadMenus();
    },
    // 输入框搜索
    async getKeywordData() {
      console.log('getKeywordData: ');
      this.page = 1;
      this.limit = 10;
      await this.loadMenus();
    },

    // 下拉列表搜索
    filterMethod(v) {
      if (!v) {
        this.restaurants = this.copyRestaurant;
      } else {
        this.restaurants = this.copyRestaurant.filter((item) => PinyinMatch.match(item.name['zh-CN'], v));
      }
    },
  },
};
</script>

<style>

</style>
