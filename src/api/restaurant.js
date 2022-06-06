import request from '@/common/request';

// 获取菜单数据
export default async function getRestaurant(data) {
  const result = await request.get('/api/restaurant/location/-74.0059413,40.7127837', data);
  return result;
}
