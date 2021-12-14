import type Bluebird from 'bluebird';
import Promise from 'bluebird';
import type { CancelTokenSource, RequestMethod, RequestOptionsInit } from 'umi-request';
import { extend } from 'umi-request';
import { getToken } from '@/utils';
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
export interface Resolve<T> {
  data: T;
  // 操作是否成功
  success: boolean;
  // 错误消息
  message?: string;
  // 列表查询总数
  total?: number;
}
export type IServer<S = any, T = any> = (page?: S) => Bluebird<Resolve<T>>;

const Request = extend({
  prefix: '/api/v1/admin',
  timeout: 60 * 1000,
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
  dataFilter?: DefaultDataFilter<any> | null;
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
        token: getToken(),
        ...this.config.headers,
      };
    } else {
      return {
        ...this.config.headers,
      };
    }
  }
  constructor(url: string, method: Methods, dataFilter?: DefaultDataFilter<T> | null) {
    this.url = url;
    this.method = method;
    this.instance = Request;
    const CancelToken = this.instance.CancelToken;
    this._source = CancelToken.source();
    if (dataFilter !== null) {
      this.instance.use(async (ctx, next) => {
        await next();
        ctx.res = dataFilter ? dataFilter(ctx.res) : this.dataFilter(ctx.res);
      });
    }
  }
  private dataFilter: DefaultDataFilter<T> = function (res) {
    if (Object.prototype.toString.call(res) === '[object Object]') {
      return { success: res.code === 'ok', data: res.data, message: res.msg };
    }
    return res;
  };
  request(data?: Record<string, any>, config?: RequestConfig): Bluebird<Resolve<T>> {
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
    const core = new Core<T>(url, 'get', config?.dataFilter);
    return core.request(params, config);
  }
  static delete<T>(url: string, params?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'delete', config?.dataFilter);
    return core.request(params, config);
  }
  static post<T>(url: string, data?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'post', config?.dataFilter);
    return core.request(data, config);
  }
  static put<T>(url: string, data?: Record<string, any>, config?: RequestConfig) {
    const core = new Core<T>(url, 'put', config?.dataFilter);
    return core.request(data, config);
  }
}