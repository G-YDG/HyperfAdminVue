import axios from 'axios';

export function getLoginLogPageList(params: object) {
  return axios.get('/system/logs/getLoginLogPageList', { params });
}

export function deleteLoginLog(id: string) {
  return axios.post(`/system/logs/deleteLoginLog?ids=${id}`);
}
