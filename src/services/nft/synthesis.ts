/**
 * @name: index
 * @user: cfj
 * @date: 2022/3/1 23:33
 */
import type { PageParams, PageResolve, Resolve } from '@/services';
import Server from '@/services';

export const synthesisStateEnum = {
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

export interface Synthesis extends AddSynthesis {
  id: string;
  state: keyof typeof synthesisStateEnum;
  created_at: string;
  updated_at: string;
}

export interface AddSynthesis {
  name: string;
  title: string;
  introduction: string;
  images: string[];
  start_time: Date;
  end_time: Date;
}

export interface EditSynthesis extends AddSynthesis {
  synthesis_id: string;
}

export const addSynthesis = function (data: AddSynthesis) {
  return Server.post<Resolve<boolean>>('/synthesis/create', data);
};

export const editSynthesis = function (data: EditSynthesis) {
  return Server.post<Resolve<boolean>>('/synthesis/edit', data);
};

export const delSynthesis = function (id: string) {
  return Server.post<Resolve<boolean>>('/synthesis/delete', { synthesis_id: id });
};
export const getSynthesisPage = function (
  params: PageParams & { state?: Synthesis['state']; name?: string },
) {
  return Server.get<PageResolve<Synthesis>>('/synthesis/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
export const updateSynthesisState = function (id: string, state: keyof typeof synthesisStateEnum) {
  return Server.post<Resolve>('/synthesis/state/update', { synthesis_id: id, state });
};

export enum SyntheticMethodEnum {
  cultivate = '养成',
  upgrade = '升级',
}

// 合成规则
export interface SynthesisRule extends AddSynthesisRule {
  id: string;
  synthesis_name: string;
  result_nft_name: string;
  created_at: string;
  updated_at: string;
}

export interface AddSynthesisRule {
  synthesis_id: string;
  play_instruction: string;
  synthetic_method: keyof typeof SyntheticMethodEnum;
  base_nft_id: string; // 基础款nft
  result_nft_id: string; // 合成生成的nft
}

export interface EditSynthesisRule {
  synthesisrule_id: string;
  play_instruction?: string;
}

export const addSynthesisRule = function (data: AddSynthesisRule) {
  return Server.post<Resolve>('/synthesisrule/create', data);
};
export const editSynthesisRule = function (data: EditSynthesisRule) {
  return Server.post<Resolve>('/synthesisrule/edit', data);
};
export const delSynthesisRule = function (id: string) {
  return Server.post<Resolve>('/synthesisrule/delete', { synthesisrule_id: id });
};
export const getSynthesisRulePage = function (params: PageParams & { synthesis_id: string }) {
  return Server.get<PageResolve<SynthesisRule>>('/synthesisrule/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};

// 基础消耗品
export interface Consumerist extends AddConsumerist {
  id: string;
  nft_name: string;
  created_at: string;
  updated_at: string;
}

export interface AddConsumerist {
  synthesisrule_id: string;
  nft_id: string;
  amount: number;
}

export interface EditConsumerist {
  consumenft_id: string;
  amount: number;
}

export const addConsumerist = function (data: AddConsumerist) {
  return Server.post<Resolve>('/consumenft/create', data);
};
export const editConsumerist = function (data: EditConsumerist) {
  return Server.post<Resolve>('/consumenft/eidt', data);
};
export const delConsumerist = function (id: string) {
  return Server.post<Resolve>('/consumenft/delete', { consumenft_id: id });
};
export const getConsumeristPage = function (params: PageParams & { synthesisrule_id: string }) {
  return Server.get<PageResolve<Consumerist>>('/consumenft/search', params).then((res) => ({
    success: res.code === 'ok',
    data: res.data.list,
    total: res.data.total,
  }));
};
