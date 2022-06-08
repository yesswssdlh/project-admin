import request from '@/common/request';
// 获取菜单数据
export default async function getMenu({
  id, page, limit, keyword,
}) {
  const result = await request.get(`/api/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`);
  return result;
}
