/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:52
 */

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';
import type { IPlat } from '@/services/platformUser';
import { getPlatLIst } from '@/services/platformUser';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IPlat>[] = [
    {
      title: '名称',
      dataIndex: 'nick_name',
      key: 'keywords',
    },
    {
      title: 'open id',
      dataIndex: 'open_id',
      hideInSearch: true,
    },
    {
      title: 'open id',
      dataIndex: 'open_id',
      hideInSearch: true,
    },
    {
      dataIndex: 'created_at',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'updated_at',
      title: '更新时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];
  return (
    <PageContainer>
      <ProTable<IPlat>
        actionRef={actionRef}
        columns={columns}
        request={(params: any) => getPlatLIst(params)}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-6',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="用户管理"
      />
    </PageContainer>
  );
};

export default Index;
