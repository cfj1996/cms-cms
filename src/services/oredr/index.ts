/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/16 16:46
 */

import type { PageParams, PageResolve } from '..';
import Server from '..';

export interface IOrder {
  id: string;
  state: string;
}

export const OrderStatusEnum = {
  created: { text: '创建', status: 'Default' },
  pending: { text: '待付款', status: 'Warning' },
  shipped: { text: '待发货', status: 'Default' },
  received: { text: '待收货', status: 'Default' },
  completed: { text: '已完成', status: 'Success' },
  canceled: { text: '已取消', status: 'Error' },
};
export interface IOrderReq {
  state: string;
}
export const getOrderList = function (params: PageParams & IOrder) {
  return Server.get<PageResolve<IOrderReq>>('/orders/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
