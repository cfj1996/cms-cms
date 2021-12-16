/**
 * @name: content
 * @user: cfj
 * @date: 2021/12/16 15:46
 */
import Server, { PageParams, PageResolve } from '@/services';

export interface IContent {
  id: string;
  state: string;
}

export const ContentStateEnum = {
  created: { text: '创建', status: 'Default' },
  pending: { text: '待审核:', status: 'Processing' },
  passed: { text: '已通过', status: 'Success' },
  failed: { text: '未通过', status: 'Warning' },
  offsell: { text: '下架', status: 'Error' },
  canceled: { text: '用户取消:', status: 'Error' },
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
