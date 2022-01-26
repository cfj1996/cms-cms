import type { Moment } from 'moment';
import type { PageParams, PageResolve, Resolve } from '..';
import Server from '..';

export enum NftType {
  collection = '藏品',
  collectionEntity = '藏品+实体',
}

// TODO 为了年前上的阉割功能 临时增加的权限
export const nftTypeEnum = {
  collection: {
    text: '藏品',
  },
  collectionEntity: {
    text: '藏品+实体',
    disabled: true,
  },
};

/**
 * @name: nfts
 * @user: cfj
 * @date: 2021/12/12 16:00
 */
export enum NftState {
  draf = '草稿',
  onsale = '上架',
  offsale = '下架',
}

export const nftStateEnum = {
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

export interface INft {
  id: string;
  name: string;
  title: string;
  type: string;
  category_id: string;
  category_name: string;
  images: string[];
  price: string;
  state: string;
  token_id: number;
  total: number;
  sale: number;
  desc: string;
  heat: number;
  transaction_hash: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface AddSku {
  nft_id: string;
  price: string;
  attribute: string;
  images: string[];
  amount: number;
}

export interface Sku extends AddSku {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface INftReq {
  state: keyof typeof nftStateEnum;
}

/**
 * 获取nft列表
 * @param params
 */
export const getNftList = function (params: PageParams & INftReq) {
  return Server.get<PageResolve<INft>>('/nft/search', params).then((res) => {
    return {
      success: res.code === 'ok',
      data: res.data.list,
      total: res.data.total,
    };
  });
};

export interface IAddNft {
  category_id: string;
  name: string;
  type: string;
  title: string;
  desc: string;
  transaction_hash: string;
  images?: string[];
  token_id?: number;
  total?: number;
  price?: string;
  start_time: string;
  end_time: string;
  time?: Moment[];
}

/**
 * 新增Nft
 * @param data
 */
export const addNft = function (data: IAddNft) {
  return Server.post<boolean>('/nft/create', data);
};

export interface IUpdateNft {
  nft_id: string;
  name: string;
  price: string;
  desc: string;
}

/**
 * 修改nft基本信息
 * @param data
 */
export const updateNft = function (data: IUpdateNft) {
  return Server.post<Resolve<boolean>>(`/nft/edit`, data);
};
/**
 * 修改nft状态
 * @param id
 * @param state
 */
export const updateNftState = function (id: string, state: string) {
  return Server.post(`/nft/state/update`, { nft_id: id, state: state });
};
/**
 * 修改nft 热度
 * @param id
 * @param heat
 */
export const updateNftWeight = function (id: string, heat: number) {
  return Server.put(`/nft/${id}`, { heat: heat });
};

/**
 * 修改nft 热门搜索关键词
 * @param id
 * @param keyWords
 */
export const updateNftKeyWords = function (id: string, keyWords: string[]) {
  return Server.put(`/nft/${id}`, { keyWords: keyWords });
};
/**
 * 获取nft详情
 * @param id
 */
export const getNft = function (id: string) {
  return Server.get<Resolve<INft>>('/nft/info', { nft_id: id });
};
/**
 * 获取合约地址
 */
export const getContractAddress = function () {
  return Server.get<Resolve<{ contract_address: string }>>('/nft/contract/deploy');
};

/**
 * 铸币
 */
export interface IPlatform {
  category_id: string;
  total: number;
}

export const platform = function (data: IPlatform) {
  return Server.post<Resolve<{ transaction_hash: string; token_id: number }>>(
    '/nft/mint/platform',
    data,
  );
};

export const getSkuList = function (params: PageParams & { nft_id: string; attribute?: string }) {
  return Server.get<PageResolve<Sku>>('/sku/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};

export const addSku = function (data: AddSku) {
  return Server.post<Resolve<boolean>>('/sku/create', data);
};

export const delSku = function (id: string) {
  return Server.post<Resolve<boolean>>('/sku/delete', { sku_id: id });
};
