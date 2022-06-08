import request from '@/common/request';

// 获取菜单数据
export async function getRestaurant() {
  const result = await request.get('/api/restaurant/location/-74.0059413,40.7127837');
  return result;
}

// 获取开关是否关闭数据
export async function getClosed() {
  const result = await request.post('/api/restaurant');
  return result;
}
