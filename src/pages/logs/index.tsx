/**
 * @name: index
 * @user: cfj
 * @date: 2022/1/24 17:42
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Logs } from '@/services/logs';
import { getLogPages, IActivityType } from '@/services/logs';

const Index = function () {
  const columns: ProColumns<Logs>[] = [
    {
      dataIndex: 'staff_name',
      title: '操作人',
    },
    {
      dataIndex: 'type',
      title: '操作类型',
      valueType: 'select',
      valueEnum: IActivityType,
    },
    {
      dataIndex: 'remark',
      title: '描述',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
    },
    {
      dataIndex: 'create_at',
      title: '操作时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];
  return (
    <PageContainer>
      <ProTable<Logs>
        columns={columns}
        request={async (params = {}) => {
          return getLogPages(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-10',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="用户操作日志"
      />
    </PageContainer>
  );
};

export default Index;
