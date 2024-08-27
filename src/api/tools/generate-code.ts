import axios from 'axios';

export function index() {
  return axios.get('/tools/generateCode/index');
}

export function preview(params: any) {
  return axios.get('/tools/generateCode/preview', { params });
}
