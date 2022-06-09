import request from '@/common/request';
// 获取菜单数据
export async function getMenu({
  id, page, limit, keyword,
}) {
  const result = await request.get(`/api/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`);
  return result;
}

// 获取available数据
export async function postAvailable(data) {
  const result = await request.post('/api/food', data);
  return result;
}
