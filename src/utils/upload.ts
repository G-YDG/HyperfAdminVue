import { getToken } from '@/utils/auth';

const getUploadUrl = () => {
  let baseURL = '';
  if (import.meta.env.VITE_API_BASE_URL) {
    baseURL = import.meta.env.VITE_API_BASE_URL;
  }
  return `${baseURL}/system/file/upload`;
};

const getUploadHeaders = () => {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
};

export { getUploadUrl, getUploadHeaders };
