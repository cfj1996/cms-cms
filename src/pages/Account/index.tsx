/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IAccess, IAddAccountReq, IUpdateAccountReq } from '@/services/Account';
import {
  addAccount,
  deleteAccount,
  getAccountList,
  roleEnum,
  updateAccount,
} from '@/services/Account';
import { Badge, Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet, EditSet } from './set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import Detail from './detail';

const Index = function () {
  const actionRef = useRef<ActionType>();
  function create() {
    Dialog.open({
      title: '新增用户',
      content: <AddSet />,
      async onOK(name, info) {
        const values = info!.values as IAddAccountReq;
        await addAccount({
          account: values.account,
          role: values.role,
          password: values.password,
          isDisable: values.isDisable,
        });
        message.success('添加成功');
        actionRef.current?.reload();
      },
    });
  }
  function update(id: string) {
    Dialog.open({
      title: '修改用户',
      content: <EditSet id={id} />,
      async onOK(name, info) {
        const values = info!.values as IUpdateAccountReq;
        await updateAccount(id, {
          account: values.account,
          role: values.role,
          isDisable: values.isDisable,
        });
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
  const columns: ProColumns<IAccess>[] = [
    {
      dataIndex: 'account',
      title: '用户名',
      key: 'account',
    },
    {
      dataIndex: 'role',
      title: '角色',
      key: 'role',
      valueType: 'select',
      fieldProps: {
        options: roleEnum,
      },
    },
    {
      dataIndex: 'isDisable',
      title: '是否禁用',
      valueType: 'radio',
      initialValue: undefined,
      render(text, row) {
        return <Badge text={text} status={row.isDisable ? 'error' : 'success'} />;
      },
      fieldProps: {
        options: [
          { value: true, label: '已禁用', status: 'Success' },
          { value: false, label: '启用', status: 'Error' },
        ],
      },
    },
    {
      dataIndex: 'createAt',
      title: '创建时间',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
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
              update(record.id);
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
      <ProTable<IAccess>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
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
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => create()}>
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default Index;
