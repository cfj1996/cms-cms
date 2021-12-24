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
  nftStateEnum,
  platform,
  updateNft,
  updateNftState,
} from '@/services/nft/nfts';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet, EditSet } from './set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import Detail from './detail';
import GlobalLoad from '@/components/GlobalLoad';

const Index = function () {
  const actionRef = useRef<ActionType>();

  function create() {
    Dialog.open({
      title: '新增nft',
      content: <AddSet />,
      async onOK(name, info) {
        const id = GlobalLoad.open({ tip: '铸币中，请稍后....' });
        try {
          const values = info?.values as IAddNft;
          const { total, ...other } = values;
          const { data } = await platform({
            category_id: values.category_id,
            token_id: values.token_id,
            total: total,
          });
          if (data.transaction_hash) {
            await addNft(
              Object.assign(
                { transaction_hash: data.transaction_hash },
                {
                  ...other,
                  price: String(other.price),
                },
              ),
            );
            message.success('添加成功');
            actionRef.current?.reload();
          } else {
            message.error('铸币失败，请稍后再试');
          }
          GlobalLoad.close(id);
        } catch (e) {
          GlobalLoad.close(id);
          message.error('创建失败,稍后重试。');
          return Promise.reject();
        }
      },
    });
  }

  function edit(id: string) {
    Dialog.open({
      title: '编辑nft',
      content: <EditSet id={id} />,
      async onOK(name, info) {
        const values = info?.values as IAddNft;
        console.log('values', values);
        return Promise.reject();
        await updateNft({
          nft_id: id,
          name: values.name,
          desc: values.desc,
          title: values.title,
          price: String(values.price!),
        }).catch((err) => {
          message.error('修改失败,稍后重试。');
          throw err;
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
      hideInSearch: true,
      ellipsis: true,
    },
    {
      dataIndex: 'title',
      title: 'title',
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      key: 'state',
      valueType: 'select',
      valueEnum: nftStateEnum,
    },
    {
      dataIndex: 'category_name',
      title: '系列名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'price',
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
      title: '交易哈希',
      dataIndex: 'transaction_hash',
      ellipsis: true,
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '热度',
      dataIndex: 'heat',
      hideInSearch: true,
      valueType: {
        type: 'progress',
      },
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
      align: 'right',
      dataIndex: 'state',
      valueType: 'option',
      render(text, record) {
        return [
          <a key={'onsale'} onClick={() => show(record.id)}>
            查看
          </a>,
          <TableDropdown
            key="action"
            onSelect={(key) => {
              console.log('key', key);
              if (key === '2') {
                edit(record.id);
              } else if (key === '3') {
                Modal.confirm({
                  title: '确定上架吗?',
                  async onOk() {
                    await updateNftState(record.id, 'onsale').catch((error) => {
                      message.error('操作失败,稍后重试。');
                      throw error;
                    });
                    actionRef.current?.reload();
                  },
                });
              } else if (key === '4') {
                Modal.confirm({
                  title: '确定下架吗?',
                  async onOk() {
                    await updateNftState(record.id, 'offsale').catch((error) => {
                      message.error('操作失败,稍后重试。');
                      throw error;
                    });
                    actionRef.current?.reload();
                  },
                });
              }
            }}
            menus={[
              { key: '2', name: '编辑', disabled: record.state === 'onsale' },
              { key: '3', name: '上架', disabled: record.state !== 'draf' },
              { key: '4', name: '下架', disabled: record.state !== 'onsale' },
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
