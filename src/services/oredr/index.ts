/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/16 16:46
 */

import type { PageParams, PageResolve, Resolve } from '..';
import Server from '..';

export enum DeliveryType {
  online = '线上',
  in_kine = '实物',
}

export interface IOrder {
  id: string;
  title: string;
  state: string;
  buyer_name: string;
  track_number: string;
  address: string;
  contact_mobile: string;
  contact_name: string;
  created_at: string;
  deal_at: string;
  nft_number: string;
  price: string;
  delivery_type: string;
  amount: number;
  seller_name: string;
  updated_at: string;
}

export const OrderStatusEnum = {
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
  return Server.get<PageResolve<IOrder>>('/orders/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};

// 发货
interface IOrderToReceived {
  order_id: string;
  contact_name?: string;
  contact_mobile?: string;
  track_number?: string;
  address?: string;
}

export const orderToReceived = function (data: IOrderToReceived) {
  return Server.post<Resolve<boolean>>('/orders/delivery', data);
};

// 获取已完成交易hash
export const getCompletedHash = function (data: { order_id: string }) {
  return Server.post<Resolve<{ hash: string }>>('/platfrom/shipment', data);
};

// 已完成订单
interface IOrderToCompleted {
  order_id: string;
  hash: string;
}

export const orderToCompleted = function (data: IOrderToCompleted) {
  return Server.post<Resolve<any>>('/orders/completed', data);
};

export const onlineGetHash = function (id: string) {
  return Server.post<Resolve<{ hash: string }>>('/platfrom/shipment', { order_id: id });
};
export const onlineSend = function (data: { order_id: string; hash: string }) {
  return Server.post<Resolve>('/orders/completed', data);
};
