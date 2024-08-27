import axios from 'axios';

export interface GenerateCodeModel {
  module: string;
  name: string;
}

export function index() {
  return axios.get('/tools/generateCode/index');
}

export function preview(params: object) {
  return axios.get('/tools/generateCode/preview', { params });
}
