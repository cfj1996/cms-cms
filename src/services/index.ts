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
type Methods = 'post' | 'get' | 'delete' | 'put';

export interface PageParams {
  current: number;
  pageSize: number;
}
export interface Resolve<T> {
  data: T;
  success: boolean;
  status: number;
  message?: string;
  total: number;
  page: number;
}
export type IServer<S = any, T = any> = (page?: S) => Bluebird<Resolve<T>>;

const Request = extend({
  prefix: '/api',
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
};

class Core {
  private auth = true;
  private _source: CancelTokenSource;
  private instance: RequestMethod;
  private url: string;
  private method: Methods;
  get headers(): HeadersInit {
    if (this.auth) {
      return {
        token: getToken(),
      };
    } else {
      return {};
    }
  }

  constructor(url: string, method: Methods) {
    this.url = url;
    this.method = method;
    this.instance = Request;
    const CancelToken = this.instance.CancelToken;
    this._source = CancelToken.source();
  }

  request<T>(data?: Record<string, any>, config?: RequestConfig): Bluebird<Resolve<T>> {
    const { auth = true, ...other } = config || {};
    this.auth = auth;
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
    const core = new Core(url, 'get');
    return core.request<T>(params, config);
  }
  static delete<T>(url: string, params?: Record<string, any>, config?: RequestConfig) {
    const core = new Core(url, 'delete');
    return core.request<T>(params, config);
  }
  static post<T>(url: string, data?: Record<string, any>, config?: RequestConfig) {
    const core = new Core(url, 'post');
    return core.request<T>(data, config);
  }
  static put<T>(url: string, data?: Record<string, any>, config?: RequestConfig) {
    const core = new Core(url, 'put');
    return core.request<T>(data, config);
  }
}
