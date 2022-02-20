/**
 * @name: index
 * @user: cfj
 * @date: 2022/2/20 19:21
 */
import type { IAddIssuer, Issuer } from '@/services/nft/Issuer';
import { addIssuer, editIssuer, getIssuerList } from '@/services/nft/Issuer';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import Dialog from '@/components/Dialog';
import { AddSet, EditSet } from './set';

const Index = function () {
  const actionRef = useRef<ActionType>();

  function create() {
    Dialog.open({
      title: '新增发行方',
      content: <AddSet />,
      async onOK(name, info) {
        try {
          const values = info?.values as IAddIssuer;
          const res = await addIssuer(values);
          if (res.code === 'ok') {
            message.success('创建成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message || '创建失败,稍后重试。');
          throw error;
        }
      },
    });
  }

  function edit(record: Issuer) {
    Dialog.open({
      title: '编辑发行方',
      content: (
        <EditSet
          issuer_id={record.id}
          issuer_name={record.issuer_name}
          issuer_desc={record.issuer_desc}
        />
      ),
      async onOK(name, info) {
        try {
          const values = info?.values as IAddIssuer;
          const res = await editIssuer(Object.assign({ issuer_id: record.id }, values));
          if (res.code === 'ok') {
            message.success('编辑成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message || '编辑失败,稍后重试。');
          throw error;
        }
      },
    });
  }

  const columns: ProColumns<Issuer>[] = [
    {
      dataIndex: 'id',
      title: '发行方id',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'issuer_name',
      title: '发行方名称',
      ellipsis: true,
    },
    {
      dataIndex: 'issuer_desc',
      title: '发行方描述',
      hideInSearch: true,
      ellipsis: true,
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
    {
      title: '操作',
      hideInSearch: true,
      render(text, record) {
        return [
          <a
            key="editable"
            onClick={() => {
              edit(record);
            }}
          >
            编辑
          </a>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<Issuer>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getIssuerList(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-11',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="发行方列表"
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
