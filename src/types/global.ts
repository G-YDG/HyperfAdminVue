export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  current?: number;
  total?: number;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  totalPage: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export type SizeProps = 'mini' | 'small' | 'medium' | 'large';

export interface SearchConfig {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  options?: Array<any>;
}
