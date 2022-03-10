import type { PageParams, PageResolve, Resolve } from '..';
import Server from '..';

/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/12 13:25
 */
export interface INftType extends IAddNftType {
  id: string;
  state: keyof typeof NftTypeStateEnum;
  issuer_name: string;
  created_at: string;
  updated_at: string;
}

interface IGetTypeReq {
  keywords: string;
}

export const NftTypeStateEnum = {
  draf: {
    text: '草稿',
    status: 'Default',
  },
  onsale: {
    text: '上架',
    status: 'Success',
  },
  offsale: {
    text: '下架',
    status: 'Error',
  },
};

/**
 * 获取所有nft类型
 */
export const getAllNftType = function () {
  return Server.get<Resolve<INftType[]>>('/nftTypes/all');
};

/**
 * 获取nft 列表
 * @param params
 */
export const getNftTypeList = function (params: PageParams & IGetTypeReq) {
  return Server.get<PageResolve<INftType>>('/nft/category/search', params).then((res) => {
    return {
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    };
  });
};

/**
 * 添加nft
 * @param data
 */
export interface IAddNftType {
  issuer_id: string;
  name: string;
  symbol: string;
  desc: string;
  contract_address?: string;
}

export const addNftType = function (data: IAddNftType) {
  return Server.post<Resolve<boolean>>('/nft/category/add', data);
};
/**
 * 获取单个nftType详情
 * @param id
 */
export const getNftType = function (id: string) {
  return Server.get<Resolve<INftType>>('/nftTypes/' + id);
};

export const updateNftTypeState = function (id: string, state: keyof typeof NftTypeStateEnum) {
  return Server.post<Resolve<boolean>>('/nft/category/state/update', { category_id: id, state });
};
export const delNftType = function (id: string) {
  return Server.post<Resolve<boolean>>('/nft/category/delete', { category_id: id });
};
