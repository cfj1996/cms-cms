import type { IContent } from '@/services/Review/content';
import { ContentStateEnum, getContentList } from '@/services/Review/content';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';

/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:47
 */

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IContent>[] = [
    {
      title: '内容状态',
      valueType: 'select',
      dataIndex: 'state',
      valueEnum: ContentStateEnum,
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
      <ProTable<IContent>
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
        headerTitle="内容审核"
      />
    </PageContainer>
  );
};

export default Index;
