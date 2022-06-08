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
            v-for="item1 in scope.row.tags"
            :key="item1"
          >
            {{ item1 }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="255"
      >
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)">
            操作
          </el-button>
        </template>
      </el-table-column>
      <!-- 关闭状态 -->
      <el-table-column
        prop="name"
        label="关闭状态"
        width="255"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            @change="changeClose(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next "
      :total="restaurants.length"
      @current-change="changePage"
    />
    <!--弹出框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    >
      <div>
        <!-- 如果没有v-if那么表示，这个框在打开页面的时候就会渲染，只是没有显示，
        但是这个时候，dialogData.name是没有值的，会报错。
        加上v-if，那么当我点击button，触发openDialog的时候，
        就会传值，dialogData.name就有值了 -->
        <el-input
          v-if="dialogVisible"
          v-model="dialogData.name[lang]"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-select
            slot="prepend"
            v-model="lang"
            placeholder="请选择"
          >
            <el-option
              label="中文"
              value="zh-CN"
            />
            <el-option
              label="英文"
              value="en-US"
            />
          </el-select>
        </el-input>
        <div class="tag-container">
          <!-- 下方的下拉框 -->
          <el-select
            v-model="tag"
            placeholder="请选择"
            @change="addTag"
          >
            <el-option
              v-for="item in tags"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- 下方下拉框右边tag -->
          <div>
            <el-tag
              v-for="item in dialogData.tags"
              :key="item"
              closable
              @close="removeTag(item)"
            >
              {{ item }}
            </el-tag>
          </div>
        </div>
        <!-- 时间卡片 -->
        <el-card>
          {{ time }}
        </el-card>
        <!-- <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        /> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRestaurant, getClosed, getTags } from '@/api/restaurant';
import _ from 'lodash';
import moment from 'moment-timezone';

export default {
  name: 'Restaurant',
  data() {
    return {
      restaurants: [],
      page: 1,
      limit: 10,
      // 控制dialog是否显示
      dialogVisible: false,
      // dialog里面的内容
      dialogData: {},
      // dialog里面输入框旁边下拉框的默认属性
      lang: 'zh-CN',
      // dialog的标题数据重构
      dialogTitle: '',
      // tags所有数据
      tags: [],
      // 输入框下面下拉框中被点击的tag
      tag: '',
      // 卡片时间
      time: moment().locale('zh-cn').tz('America/New_York').format('YYYY-MM-DD HH:mm:ss dddd'),
      // 计时器
      timer: null,
      // value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
    };
  },
  computed: {

  },
  created() {
    // 获取全部餐馆数据
    this.loadRestaurant();
    // 获取全部tag数据
    this.loadTags();
    // 启动计时器
    this.startTime();
  },
  beforeDestroy() {
    // 清除计时器
    if (this.timer) {
      clearInterval(this.timer);
    }
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
    // 获取tags数据
    async loadTags() {
      try {
        this.loading = true;
        this.tags = await getTags();
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
    // 发请求更新开关的状态数据
    async changeClose({ _id, isClosed }) {
      try {
        this.loading = true;
        let data = {};
        if (isClosed) {
          data = { closed: { closed: true } };
        } else {
          data = { closed: null };
        }
        await getClosed({
          data,
          id: _id,
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
        // 这里是重新获取restaurant，渲染到页面，
        // 因为如果不重新获取，当请求出现错误的时候，开关是不会回退到对应的状态的
        this.loadRestaurant();
      }
    },
    // 打开操作框
    openDialog(v) {
      // 这里使用_.cloneDeep是深拷贝，这样dialogData和restaurants的每行都是指向不同的内存地址了
      // 两边的操作不会互相影响
      this.dialogData = _.cloneDeep(v);
      // 这里dialogTitle和restaurants的每行都是指向同一内存地址
      this.dialogTitle = v.name['zh-CN'];
      this.dialogVisible = true;
    },
    // 操作框添加tag
    addTag() {
      if (this.dialogData.tags.indexOf(this.tag) === -1) {
        this.dialogData.tags.push(this.tag);
      }
    },
    // 操作框删除tag
    removeTag(v) {
      const index = this.dialogData.tags.indexOf(v);
      this.dialogData.tags.splice(index, 1);
    },
    // 计时器
    startTime() {
      this.timer = setInterval(() => {
        this.time = moment().locale('zh-cn').tz('America/New_York').format('YYYY-MM-DD HH:mm:ss dddd');
      }, 1000);
    },
  },

};
</script>

<style scoped lang="scss">
// dialog输入框旁边下拉框的样式
::v-deep .el-select .el-input {
    width: 130px;
}
.tag-container{
  display:flex;
}
</style>
