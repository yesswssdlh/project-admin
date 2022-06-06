import { create } from 'axios';

// 创建基本server
const api = create({
  // 配置请求
  // timeout设置超时时间
  timeout: 2000,
});

// ? 拦截器
// ? 请求拦截器
// ? 发送请求之前，所做的逻辑
api.interceptors.request.use(
  (request) => {
    console.log('请求拦截器');
    return request;
  },
  (error) => Promise.reject(error),
);

// ? 响应拦截器
// ? 获取响应之后，所做的逻辑
api.interceptors.response.use(
  (response) => {
    console.log('response ====>', response);
    // ? 通过响应拦截器，自定义响应数据
    return response.data;
  },
  // ? 如果响应错误
  // ? 自定义错误,把error进行再封装
  (error) => Promise.reject(error),
);

export default api;
