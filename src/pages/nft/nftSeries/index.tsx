/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { IAddNft, INft } from '@/services/nft/nfts';
import {
  addNft,
  getNftList,
  NftState,
  nftStateEnum,
  updateNft,
  updateNftState,
} from '@/services/nft/nfts';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet, EditSet } from './set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import Detail from './detail';

const Index = function () {
  const actionRef = useRef<ActionType>();
  function create() {
    Dialog.open({
      title: '新增nft',
      content: <AddSet />,
      async onOK(name, info) {
        const values = info?.values as IAddNft;
        values.files = values.fileSource?.map((i) => i.url);
        values.fileSource = undefined;
        await addNft(values);
        message.success('添加成功');
        actionRef.current?.reload();
      },
    });
  }
  function update(id: string) {
    Dialog.open({
      title: '修改nft',
      content: <EditSet id={id} />,
      async onOK(name, info) {
        const values = info?.values as IAddNft;
        await updateNft(id, {
          categoryId: values.categoryId,
          name: values.name,
          desc: values.desc,
          price: values.price,
        });
        message.success('修改成功');
        actionRef.current?.reload();
      },
    });
  }
  function show(id: string) {
    Dialog.open({
      type: 'view',
      title: 'nft详情',
      content: <Detail id={id} />,
      footer: null,
    });
  }
  const columns: ProColumns<INft>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      key: 'name',
    },
    {
      dataIndex: 'state',
      title: '状态',
      key: 'state',
      valueType: 'select',
      fieldProps: {
        options: nftStateEnum,
      },
    },
    {
      dataIndex: 'serialNumber',
      title: '系列ID',
      key: 'serialNumber',
    },
    {
      dataIndex: 'serialNumber',
      title: '价格',
      hideInSearch: true,
    },
    {
      dataIndex: 'total',
      title: '剩余数量',
      renderText(text, record) {
        return `${record.total - record.sale}=${record.total}-${record.sale}`;
      },
      hideInSearch: true,
    },
    {
      dataIndex: 'heat',
      title: '热度',
      hideInSearch: true,
      sorter: true,
    },
    {
      dataIndex: 'createAt',
      title: '创建时间',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'updateAt',
      title: '更新时间',
      valueType: 'dateTime',
      sorter: true,
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
              update(record.id);
            }}
          >
            编辑
          </a>,
          <a target="_blank" onClick={() => show(record.id)} rel="noopener noreferrer" key="view">
            查看
          </a>,
          <TableDropdown
            key="action"
            onSelect={(key) => {
              console.log('key', key);
              if (key === '3') {
                Modal.confirm({
                  title: '确定上架吗?',
                  async onOk() {
                    await updateNftState(record.id, NftState.onsale);
                  },
                });
              } else if (key === '4') {
                Modal.confirm({
                  title: '确定下架吗?',
                  async onOk() {
                    await updateNftState(record.id, NftState.offsale);
                  },
                });
              }
            }}
            menus={[
              { key: '1', name: '修改热度' },
              { key: '2', name: '添加关键词' },
              { key: '3', name: '上架' },
              { key: '4', name: '下架' },
            ]}
          />,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<INft>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getNftList(params as any);
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
        headerTitle="nft类型表格"
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
