/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:57
 */

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';
import type { IOrder } from '@/services/oredr';
import { DeliveryType, getOrderList, OrderStatusEnum, orderToReceived } from '@/services/oredr';
import { Button, message } from 'antd';
import Dialog from '@/components/Dialog';
import { AddSet } from './set';

const Index = function () {
  const actionRef = useRef<ActionType>();

  function ship(row: IOrder) {
    Dialog.open({
      title: '实物发货',
      content: <AddSet />,
      async onOK(name, info) {
        const values = info?.values;
        const res = await orderToReceived({
          track_number: values!.track_number,
          order_id: row.id,
          contact_name: row.contact_name,
          contact_mobile: row.contact_mobile,
          address: row.address,
        }).catch((error) => {
          message.error(error.message);
          return Promise.reject();
        });
        if (res.code === 'ok') {
          message.success('实物发货成功');
          actionRef.current?.reload();
        } else {
          throw new Error(res.msg);
        }
      },
    });
  }

  const columns: ProColumns<IOrder>[] = [
    {
      title: '买家',
      hideInSearch: true,
      dataIndex: 'buyer_name',
    },
    {
      title: '联系人',
      hideInSearch: true,
      dataIndex: 'contact_name',
    },
    {
      title: '联系方式',
      hideInSearch: true,
      dataIndex: 'contact_mobile',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '联系地址',
      hideInSearch: true,
      dataIndex: 'address',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '卖家名称',
      hideInSearch: true,
      dataIndex: 'seller_name',
    },
    {
      title: '订单状态',
      valueType: 'select',
      dataIndex: 'state',
      valueEnum: OrderStatusEnum,
    },
    {
      title: '快递单号',
      hideInSearch: true,
      dataIndex: 'track_number',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '作品id',
      hideInSearch: true,
      dataIndex: 'nft_number',
    },
    {
      title: '作品价格',
      hideInSearch: true,
      dataIndex: 'price',
    },
    {
      title: '购买数量',
      hideInSearch: true,
      dataIndex: 'amount',
    },
    {
      dataIndex: 'delivery_type',
      title: '订单类型',
      valueType: 'select',
      valueEnum: DeliveryType,
      hideInSearch: true,
    },
    {
      dataIndex: 'deal_at',
      title: '交易时间',
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
      hideInSearch: true,
      render(text, row) {
        return [
          <Button
            key={1}
            onClick={() => ship(row)}
            disabled={!(row.state === 'shipped' && row.delivery_type === 'in_kine')}
            style={{ padding: 0 }}
            type={'link'}
          >
            发货
          </Button>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<IOrder>
        actionRef={actionRef}
        columns={columns}
        request={(params: any) => getOrderList(params)}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-8',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="订单管理"
      />
    </PageContainer>
  );
};

export default Index;
