<template>
  <div>
    restaurant
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
    };
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
  },
};
</script>

<style>

</style>
