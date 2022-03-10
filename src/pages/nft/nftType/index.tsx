/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IAddNftType, INftType } from '@/services/nft/nftType';
import {
  addNftType,
  delNftType,
  getNftTypeList,
  NftTypeStateEnum,
  updateNftTypeState,
} from '@/services/nft/nftType';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet } from './set';
import React, { useRef } from 'react';
import Dialog from '@/components/Dialog';
import { getContractAddress } from '@/services/nft/nfts';
import GlobalLoad from '@/components/GlobalLoad';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const closeId = useRef<React.Key | undefined>();

  function create() {
    Dialog.open({
      title: '新增藏品系列',
      content: <AddSet />,
      onError(error) {
        GlobalLoad.close(closeId.current!);
        message.error(error.message || '创建失败,稍后重试。');
      },
      async onOK(name, info) {
        const { issuer_id, ...other } = info?.values as Omit<IAddNftType, 'contract_address'>;
        closeId.current = GlobalLoad.open({ tip: '藏品系列创建中，请稍后....' });
        const { data, code, msg } = await getContractAddress(issuer_id);
        if (code === 'ok') {
          const address = data.contract_address;
          if (address) {
            const res = await addNftType({ contract_address: address, ...other } as IAddNftType);
            if (res.code === 'ok') {
              message.success('创建成功');
              GlobalLoad.close(closeId.current);
              actionRef.current?.reload();
            } else {
              throw new Error(res.msg);
            }
          } else {
            throw new Error('未获取到地址');
          }
        } else {
          throw new Error(msg);
        }
      },
    });
  }

  const columns: ProColumns<INftType>[] = [
    {
      dataIndex: 'issuer_name',
      title: '发行方名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'name',
      title: '系列名称',
      key: 'keywords',
      fieldProps: {
        placeholder: '请输入系列名称',
      },
    },
    {
      dataIndex: 'symbol',
      title: '系列简称',
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      key: 'state',
      valueType: 'select',
      valueEnum: NftTypeStateEnum,
    },
    {
      dataIndex: 'contract_address',
      title: '合约地址',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
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
      valueType: 'option',
      title: '操作',
      render(_, record) {
        const text = record.state === 'onsale' ? '下架' : '上架';
        return [
          <Popconfirm
            key={1}
            title={`确认${text}吗？`}
            onConfirm={async () => {
              const res = await updateNftTypeState(
                record.id,
                record.state === 'onsale' ? 'offsale' : 'onsale',
              );
              if (res.code === 'ok') {
                message.success('操作成功');
                actionRef.current?.reload();
              } else {
                message.error(res.msg || '操作失败');
                throw new Error(res.msg);
              }
            }}
          >
            <a onClick={() => {}}>{text}</a>
          </Popconfirm>,
          <Popconfirm
            key={2}
            disabled={record.state === 'onsale'}
            title={`确认删除吗？`}
            onConfirm={async () => {
              const res = await delNftType(record.id);
              if (res.code === 'ok') {
                message.success('删除成功');
                actionRef.current?.reload();
              } else {
                message.error(res.msg || '操作失败');
                throw new Error(res.msg);
              }
            }}
          >
            <Button type="link" disabled={record.state === 'onsale'} style={{ marginLeft: 10 }}>
              删除
            </Button>
          </Popconfirm>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<INftType>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getNftTypeList(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-7',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="藏品系列列表"
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
