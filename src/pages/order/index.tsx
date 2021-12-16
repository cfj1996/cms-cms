/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:57
 */

import { PageContainer } from '@ant-design/pro-layout';
import { getContentList } from '@/services/Review/content';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';
import type { IOrder } from '@/services/oredr';
import { OrderStatusEnum } from '@/services/oredr';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IOrder>[] = [
    {
      title: '订单状态',
      valueType: 'select',
      dataIndex: 'state',

      valueEnum: OrderStatusEnum,
    },
    {
      title: '操作',
      hideInSearch: true,
      render() {
        return [<a key={1}>通过</a>, <a key={2}>下架</a>];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<IOrder>
        actionRef={actionRef}
        columns={columns}
        request={(params: any) => getContentList(params)}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="订单管理"
      />
    </PageContainer>
  );
};

export default Index;
