import axios from 'axios';

export interface GenerateCodeModel {
  module: string;
  name: string;
  datasource: string;
}

export function datasource() {
  return axios.get('/tools/generateCode/datasource');
}

export function index(params: object) {
  return axios.get('/tools/generateCode/index', { params });
}

export function preview(params: object) {
  return axios.get('/tools/generateCode/preview', { params });
}
