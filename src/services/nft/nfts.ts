import type { PageParams, Resolve } from '..';
import Server from '..';

/**
 * @name: nfts
 * @user: cfj
 * @date: 2021/12/12 16:00
 */
export enum NftState {
  draft = '草稿',
  onsale = '上架',
  offsale = '下架',
}
export const nftStateEnum = Object.keys(NftState).map((key) => ({
  value: key,
  label: NftState[key],
}));
export interface INft {
  id: string;
  name: string;
  title: string;
  serialNumber: string;
  categoryId: string;
  files: string[];
  price: string;
  total: number;
  sale: number;
  desc: string;
  heat: number;
  blockChainMsg: string;
  state: string;
  createAt: string;
  updateAt: string;
}
export interface INftReq {
  name: string;
  categoryId: string;
}

/**
 * 获取nft列表
 * @param params
 */
export const getNftList = function (params: PageParams & INftReq) {
  return Server.get<INft[]>('/nft', params).then((res) => {
    return res;
  });
};
export interface IAddNft {
  category_id: string;
  name: string;
  title: string;
  desc: string;
  transaction_hash: string;
  images?: string[];
  token_id?: number;
  total?: number;
  price?: number;
}

/**
 * 新增Nft
 * @param data
 */
export const addNft = function (data: IAddNft) {
  return Server.post<boolean>('/nft/create', data);
};
export interface IUpdateNft {
  categoryId: string;
  name: string;
  desc: string;
  price: number;
}

/**
 * 修改nft基本信息
 * @param id
 * @param data
 */
export const updateNft = function (id: string, data: IUpdateNft) {
  return Server.put(`/nft/${id}`, data);
};
/**
 * 修改nft状态
 * @param id
 * @param state
 */
export const updateNftState = function (id: string, state: NftState) {
  return Server.put(`/nft/${id}`, { state: state });
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
  return Server.get<Resolve<INft>>(`/nft/${id}`);
};
/**
 * 获取合约地址
 */
export const getContractAddress = function () {
  return Server.get<Resolve<{ contract_address: string }>>('/nft/contract/deploy').then(
    (res) => res.data.contract_address,
  );
};

/**
 * 铸币
 */
export interface IPlatform {
  category_id: string;
  token_id: string;
  total?: number;
}
export const platform = function (data: IPlatform) {
  return Server.post<Resolve<{ transaction_hash: string }>>('/nft/mint/platform', data);
};
