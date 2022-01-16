/**
 * @name: show
 * @user: cfj
 * @date: 2022/1/16 16:17
 */
import { Tabs } from 'antd';
import Detail from './detail';
import SkuDetail from '@/pages/nft/nftSeries/SkuDetail';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { INft } from '@/services/nft/nfts';
import { getNft } from '@/services/nft/nfts';
import React from 'react';

const { TabPane } = Tabs;

interface IProps {
  id: string;
  total: number;
}

const Show = function (props: IProps & PageService<INft>) {
  const { data } = props.data!;
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="nft 详情" key="1">
        <Detail data={data} />
      </TabPane>
      <TabPane tab="SKU" key="2">
        <SkuDetail data={data} />
      </TabPane>
    </Tabs>
  );
};

export default withServers(getNft, (props: IProps) => props.id)(Show) as React.FC<IProps>;
