import axios from 'axios';
import { ConfigGroupRecord } from '@/api/system/config-group';

export interface ConfigModel {
  id: string;
  key: string;
  value: string;
  value_type: number;
  remark: string;
  is_system: number;
  system_group_id: number;
}

export interface ConfigRecord {
  id: string;
  key: string;
  value: string;
  value_type: number;
  remark: string;
  is_system: number;
  system_group_id: number;
  group: ConfigGroupRecord;
  created_at: string;
}

export function index(params: object) {
  return axios.get('/system/config/index', { params });
}

export function save(data: ConfigModel) {
  return axios.post('/system/config/save', data);
}

export function update(id: any, data: ConfigModel) {
  return axios.post(`/system/config/update/${id}`, data);
}

export function deleted(id: string) {
  return axios.post(`/system/config/delete?ids=${id}`);
}
