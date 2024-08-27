import { Message } from '@arco-design/web-vue';

export function copy(text: string) {
  try {
    navigator.clipboard.writeText(text);
    Message.success('复制成功');
  } catch (e) {
    Message.error('复制失败');
  }
}

export function formatJson(json: string) {
  return JSON.stringify(JSON.parse(json), null, 2);
}
