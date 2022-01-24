/**
 * @name: index
 * @user: cfj
 * @date: 2022/1/24 17:43
 */
import type { PageParams, PageResolve } from '@/services';
import Server from '@/services';

export interface ILosgReq {
  type: keyof IActivityType;
  staff_name: string;
}

export enum IActivityType {
  login = '登录',
  addCategory = '添加系列',
  createNft = '创建nft',
  editNft = '编辑nft',
  updateNftState = '修改nft上架 / 下架状态',
  updateAduit = '发布审核修改',
  addKeywords = '添加关键词',
  deleteKeywords = '删除关键词',
  updateKeywordsWeight = '修改关键词权重',
  deliveryOrder = '将订单状态修改成待收货状态',
  addBanner = '添加banner',
  updateBannerState = '修改banner上架/下架',
  deleteBanner = '删除banner',
  addActivity = '添加活动',
  deleteActivity = '删除活动',
  editActivity = '编辑活动',
  updateActivityState = '修改活动上架下架',
  addSku = '添加sku',
  deleteSku = '删除sku',
  addStaff = '添加员工',
  resetStaffPwd = '重置密码',
  updateStaffDisable = '禁用/启用  员工账号',
}

export interface Logs {
  staff_id: string;
  staff_name: string;
  remark: string;
  type: keyof IActivityType;
  id: string;
  create_at: string;
  update_at: string;
}

export const getLogPages = function (params: PageParams & ILosgReq) {
  return Server.get<PageResolve<Logs>>('/operatelog/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
