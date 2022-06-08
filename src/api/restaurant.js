import request from '@/common/request';

// 获取餐馆数据
export async function getRestaurant() {
  const result = await request.get('/api/restaurant/location/-74.0059413,40.7127837');
  return result;
}

// 获取开关是否关闭数据
export async function getClosed(data) {
  const result = await request.post('/api/restaurant', data);
  return result;
}

// 获取所有tags数据
export async function getTags() {
  const result = await request.get('/api/tags');
  return result;
}
