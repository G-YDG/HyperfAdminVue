import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';
import { throttle } from '@/utils/tools';
import { useUserStore } from '@/store';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json;charset=UTF-8',
        ...config.headers,
      };
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);

const reLogin = throttle(() => {
  const userStore = useUserStore();
  userStore.logout();
  window.location.reload();
}, 2000);

axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    if (
      response.status === 200 &&
      (response.headers['content-disposition'] ||
        !/^application\/json/.test(response.headers['content-type']))
    ) {
      return response;
    }
    const res = response.data;
    if (res.code !== 200) {
      if (res.code === 1001) {
        reLogin();
      } else {
        Message.error({
          content: res.msg || 'Error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
