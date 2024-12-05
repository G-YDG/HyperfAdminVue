import axios from 'axios';

export interface ConfigGroupModel {
  id: string;
  name: string;
  key: string;
}

export interface ConfigGroupRecord {
  id: string;
  name: string;
  key: string;
  created_at: string;
  updated_at: string;
}

export function index(params: object) {
  return axios.get('/system/configGroup/index', { params });
}

export function list() {
  return axios.get<ConfigGroupRecord[]>('/system/configGroup/list');
}

export function save(data: ConfigGroupModel) {
  return axios.post('/system/configGroup/save', data);
}

export function update(id: any, data: ConfigGroupModel) {
  return axios.post(`/system/configGroup/update/${id}`, data);
}

export function deleted(id: string) {
  return axios.post(`/system/configGroup/delete?ids=${id}`);
}
