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

// 节流
// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, delay: number): Function => {
  let throttleTimer: ReturnType<typeof setTimeout> | null;
  return (...args: unknown[]) => {
    if (throttleTimer) {
      return;
    }
    throttleTimer = setTimeout(() => {
      fn.apply(this, args);
      throttleTimer = null;
    }, delay);
  };
};

// 防抖
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, delay: number) => {
  let debounceTimer: ReturnType<typeof setTimeout> | null;
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
