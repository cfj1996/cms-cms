/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Access, IAddAccess, IRePassword } from '@/services/Account';
import { addAccount, disableAccount, getAccountList, rePass, roleEnum } from '@/services/Account';
import { Badge, Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet } from './set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import RePassword from '@/pages/Account/rePassword';
import { useModel } from 'umi';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');

  function create() {
    Dialog.open({
      title: '新增用户',
      content: <AddSet />,
      async onOK(name, info) {
        try {
          const values = info!.values as IAddAccess;
          const res = await addAccount(values).catch((err) => {
            console.log('err', err);
            throw new Error(err.message);
          });
          if (res.code === 'ok') {
            message.success('添加成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message);
          throw error;
        }
      },
    });
  }

  function rePassword(row: Access) {
    Dialog.open({
      title: `重置${row.full_name}的密码`,
      content: <RePassword id={row.id} />,
      async onOK(name, info) {
        try {
          const values = info!.values as IRePassword;
          const res = await rePass(values).catch((err) => {
            throw new Error(err.message);
          });
          if (res.code === 'ok') {
            message.success('重置成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message);
          throw error;
        }
      },
    });
  }

  const columns: ProColumns<Access>[] = [
    {
      dataIndex: 'full_name',
      title: '用户名',
      key: 'keywords',
    },
    {
      dataIndex: 'email',
      title: 'email',
      hideInSearch: true,
    },
    {
      dataIndex: 'role',
      title: '角色',
      valueType: 'select',
      valueEnum: roleEnum,
    },
    {
      dataIndex: 'is_disable',
      title: '是否禁用',
      valueType: 'radio',
      initialValue: undefined,
      render(text, row) {
        return <Badge text={text} status={row.is_disable ? 'error' : 'success'} />;
      },
      fieldProps: {
        options: [
          { value: true, label: '已禁用', status: 'Success' },
          { value: false, label: '启用', status: 'Error' },
        ],
      },
    },
    {
      dataIndex: 'create_at',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'update_at',
      title: '更新时间',
      valueType: 'dateTime',
      hideInSearch: true,
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
              rePassword(record);
            }}
          >
            重置密码
          </a>,
          <Popconfirm
            key={'delete'}
            title={`您确定要${record.is_disable ? '启用' : '禁用'}${record.full_name}用户吗？`}
            onConfirm={async () => {
              try {
                const res = await disableAccount(record.id).catch((err) => {
                  throw new Error(err.message);
                });
                if (res.code === 'ok') {
                  message.success(`${record.is_disable ? '启用' : '禁用'}成功`);
                  actionRef.current?.reload();
                } else {
                  throw new Error(res.msg);
                }
              } catch (error: any) {
                message.error(error.message);
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button
              disabled={initialState?.currentUser?.id === record.id}
              type="link"
              key={'disable'}
            >
              {record.is_disable ? '启用' : '禁用'}
            </Button>
          </Popconfirm>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<Access>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getAccountList(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-2',
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
