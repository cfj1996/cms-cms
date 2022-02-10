import type Bluebird from 'bluebird';
import Promise from 'bluebird';
import type { CancelTokenSource, RequestMethod, RequestOptionsInit } from 'umi-request';
import { extend } from 'umi-request';
import { getToken, tokeKey } from '@/utils';
import { history } from '@@/core/history';
import { stringify } from 'querystring';
import { logout } from '@/services/user/login';

const loginPath = '/user/login';

Promise.config({
  cancellation: true,
});
export type DefaultResolve<T> = { code: string; data: T; msg: string };
export type DefaultDataFilter<T> = (res: DefaultResolve<T>) => Resolve<T> | DefaultResolve<T>;
// 请求方法
export type Methods = 'post' | 'get' | 'delete' | 'put';

// 列表查询
export interface PageParams {
  // 当前页面
  current: number;
  // 分页大小
  pageSize: number;
}

// 响应数据结构
export interface Resolve<T = any> {
  data: T;
  msg: string;
  code: string | 'ok';
}

export type PageResolve<T> = Resolve<{ list: T[]; total: number }>;

export type IServer<S = any, T = any> = (page?: S) => Bluebird<Resolve<T>>;
console.log('HTTP_URL', process.env.HTTP_URL);
const Request = extend({
  prefix: process.env.HTTP_URL + '/api/v1',
  timeout: 120 * 1000,
});
Request.interceptors.response.use(async (response) => {
  if (response.status === 401 || response.status === 403) {
    const { pathname, query = {}, search } = history.location;
    const { redirect } = query;

    if (history.location.pathname !== loginPath && !redirect) {
      logout().then();
      location.replace(
        loginPath +
          '?' +
          stringify({
            redirect: pathname + search,
          }),
      );
    }
  }
  return response;
});
export type RequestConfig = RequestOptionsInit & {
  auth?: boolean;
};

class Core<T> {
  private config: RequestConfig = {
    auth: true,
  };
  private _source: CancelTokenSource;
  private instance: RequestMethod;
  private url: string;
  private method: Methods;

  get headers(): HeadersInit {
    if (this.config.auth) {
      return {
        [tokeKey]: getToken(),
        ...this.config.headers,
      };
    } else {
      return {
        ...this.config.headers,
      };
    }
  }

  constructor(url: string, method: Methods) {
    this.url = url;
    this.method = method;
    this.instance = Request;
    const CancelToken = this.instance.CancelToken;
    this._source = CancelToken.source();
  }

  request(data?: Record<string, any>, config?: RequestConfig): Bluebird<T> {
    if (config) {
      Object.assign(this.config, config);
    }
    const { ...other } = this.config;
    return new Promise((resolve, reject, onCancel) => {
      this.instance(this.url, {
        ...other,
        method: this.method,
        params: this.method === 'get' || this.method === 'delete' ? data : undefined,
        data: this.method === 'put' || this.method === 'post' ? data : undefined,
        headers: this.headers,
        cancelToken: this._source.token,
      }).then(resolve, reject);
      onCancel?.(() => {
        this._source.cancel();
        reject(new Error('cancel'));
      });
    });
  }
}

export default class Server {
  static get<T>(url: string, params?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'get');
    return core.request(params, config);
  }

  static delete<T>(url: string, params?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'delete');
    return core.request(params, config);
  }

  static post<T>(url: string, data?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'post');
    return core.request(data, config);
  }

  static put<T>(url: string, data?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'put');
    return core.request(data, config);
  }
}
