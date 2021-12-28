/**
 * @name: content
 * @user: cfj
 * @date: 2021/12/16 15:46
 */
import type { PageParams, PageResolve } from '@/services';
import Server from '@/services';

export interface IContent {
  id: string;
  state: string;
  content: string;
  images: string[];
  link: string;
  nft_id: string;
  nft_number: string;
  price: string;
  title: string;
  user_id: string;
  updated_at: string;
  created_at: string;
}

export const ContentStateEnum = {
  pending: { text: '待审核:', status: 'Processing' },
  passed: { text: '已通过', status: 'Success' },
  failed: { text: '未通过', status: 'Warning' },
  offsell: { text: '下架', status: 'Error' },
  canceled: { text: '用户取消', status: 'Error' },
};

export interface IContentReq {
  state: string;
}

export const getContentList = function (params: PageParams & IContentReq) {
  return Server.get<PageResolve<IContent>>('/audit/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};

export const updateContent = function (id: string, state: 'passed' | 'offsell') {
  return Server.post('/audit/state/update', { audit_id: id, state });
};
