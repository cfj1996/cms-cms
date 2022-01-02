/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { IAddNft, INft, Purchase } from '@/services/nft/nfts';
import {
  addNft,
  editNftPurchase,
  getNftList,
  nftStateEnum,
  NftType,
  platform,
  purchaseEnum,
  updateNft,
  updateNftState,
} from '@/services/nft/nfts';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet, EditSet } from './set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import GlobalLoad from '@/components/GlobalLoad';
import Show from '@/pages/nft/nftSeries/show';
import PurchaseSet from '@/pages/nft/nftSeries/purchaseSet';

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
          const { total, price, time, ...other } = values;
          const { data, code, msg } = await platform({
            category_id: values.category_id,
            total: total!,
          });
          if (code === 'ok') {
            if (data.transaction_hash && data.token_id) {
              await addNft(
                Object.assign(
                  {
                    transaction_hash: data.transaction_hash,
                    price: String(price),
                    token_id: data.token_id,
                    start_time: time?.[0].toDate(),
                    end_time: time?.[1].toDate(),
                  },
                  {
                    ...other,
                  },
                ),
              );
              GlobalLoad.close(id);
              message.success('添加成功');
              actionRef.current?.reload();
            } else {
              throw new Error(`铸币失败, 为获取到hash`);
            }
          } else {
            throw new Error(`铸币失败,${msg}`);
          }
        } catch (error: any) {
          GlobalLoad.close(id);
          message.error(error.message || '创建失败,稍后重试。');
          return Promise.reject();
        }
      },
    });
  }

  function edit(id: string) {
    Dialog.open({
      title: '编辑nft',
      content: <EditSet id={id} />,
      async onOK(_, info) {
        const values = info?.values as IAddNft;
        const { title, name, desc, price, time } = values;
        const res = await updateNft({
          nft_id: id,
          title: title,
          name: name,
          desc: desc,
          price: String(price),
          start_time: time?.[0].toDate(),
          end_time: time?.[1].toDate(),
        }).catch((err) => {
          message.error('修改失败,稍后重试。');
          throw err;
        });
        if (res.code === 'ok') {
          message.success('修改成功');
          actionRef.current?.reload();
        } else {
          message.error(res.msg);
          throw new Error(res.msg);
        }
      },
    });
  }

  function show(id: string, total: number) {
    Dialog.open({
      type: 'view',
      title: 'nft详情',
      content: <Show id={id} total={total} />,
      footer: null,
      bodyStyle: {
        paddingTop: 0,
      },
    });
  }

  const columns: ProColumns<INft>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      key: 'keywords',
      ellipsis: true,
    },
    {
      dataIndex: 'token_id',
      title: '作品id',
      hideInSearch: true,
    },
    {
      dataIndex: 'title',
      title: '标题',
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
      dataIndex: 'is_purchase',
      title: '限购',
      hideInSearch: true,
      valueType: 'radio',
      fieldProps: {
        options: purchaseEnum,
      },
    },
    {
      dataIndex: 'limit_number',
      title: '限购数量',
      hideInSearch: true,
    },
    {
      dataIndex: 'price',
      title: '价格',
      hideInSearch: true,
    },
    {
      dataIndex: 'total',
      title: '总数',
      hideInSearch: true,
    },
    {
      dataIndex: 'sale',
      title: '已售出',
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
      width: 110,
      valueType: {
        type: 'progress',
      },
    },
    {
      dataIndex: 'type',
      title: '类型',
      valueType: 'select',
      valueEnum: NftType,
      hideInSearch: true,
    },
    {
      dataIndex: 'start_time',
      title: '售卖开始时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'end_time',
      title: '售卖结束时间',
      valueType: 'dateTime',
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
    {
      title: '操作',
      align: 'right',
      valueType: 'option',
      render(text, record) {
        return [
          <a key={'onsale'} onClick={() => show(record.id, record.total)}>
            查看
          </a>,
          <TableDropdown
            key="action"
            onSelect={(key) => {
              console.log('key', key);
              if (key === '2') {
                edit(record.id);
              } else if (key === '5') {
                Dialog.open({
                  title: '编辑限购信息',
                  content: (
                    <PurchaseSet
                      is_purchase={record.is_purchase}
                      limit_number={record.limit_number}
                    />
                  ),
                  async onOK(name, info) {
                    try {
                      const values = info?.values as Purchase;
                      const res = await editNftPurchase({ nft_id: record.id, ...values });
                      if (res.code === 'ok') {
                        message.success('编辑成功');
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
              { key: '5', name: '编辑限购' },
              {
                key: '3',
                name: '上架',
                disabled: !(record.state === 'draf' || record.state === 'offsale'),
              },

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
          persistenceKey: 'pro-table-singe-demos-6',
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
