/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IAccessListRes, IAddAccountReq } from '@/services/Account';
import { addAccount, deleteAccount, getAccountList, updateAccount } from '@/services/Account';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet, EditSet } from '@/pages/Account/set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import Detail from '@/pages/Account/detail';

const Index = function () {
  const actionRef = useRef<ActionType>();
  function createUser() {
    Dialog.open({
      title: '新增用户',
      content: <AddSet />,
      async onOK(name, info) {
        await addAccount(info?.values as IAddAccountReq);
        message.success('添加成功');
        actionRef.current?.reload();
      },
    });
  }
  function updateUser(id: string) {
    Dialog.open({
      title: '修改用户',
      content: <EditSet id={id} />,
      async onOK(name, info) {
        await updateAccount(id, { username: info?.values.username, avatar: info?.values.avatar });
        message.success('修改成功');
        actionRef.current?.reload();
      },
    });
  }
  function show(id: string) {
    Dialog.open({
      type: 'view',
      title: '用户信息',
      content: <Detail id={id} />,
      footer: null,
    });
  }
  const columns: ProColumns<IAccessListRes>[] = [
    {
      dataIndex: 'username',
      title: '用户名',
      key: 'username',
    },
    {
      dataIndex: 'createdTime',
      title: '创建时间',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      align: 'right',
      valueType: 'option',
      render(text, record) {
        return [
          <a
            key="editable"
            onClick={() => {
              updateUser(record.id);
            }}
          >
            编辑
          </a>,
          <a target="_blank" onClick={() => show(record.id)} rel="noopener noreferrer" key="view">
            查看
          </a>,
          <Popconfirm
            key={'delete'}
            title="您确定要删除此条记录吗？"
            onConfirm={async () => {
              await deleteAccount(record.id);
              message.success('删除成功');
              actionRef.current?.reload();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<IAccessListRes>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}, sort, filter) => {
          console.log('params', params);
          console.log('sort', sort);
          console.log('filter', filter);
          return getAccountList(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        editable={{
          type: 'multiple',
        }}
        dateFormatter="number"
        headerTitle="用户表格"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => createUser()}>
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default Index;
