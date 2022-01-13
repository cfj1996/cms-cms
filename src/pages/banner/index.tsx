/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/24 21:22
 */

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import Dialog from '@/components/Dialog';
import Set from './set';
import type { Banner } from '@/services/banner';
import { addBanner, bannerState, getBannerPage, LinkType } from '@/services/banner';
import TableImgCall from '@/components/tableImgCall';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<Banner>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'keywords',
    },
    {
      title: '编号',
      dataIndex: 'number',
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      key: 'state',
      valueType: 'select',
      valueEnum: bannerState,
    },
    {
      dataIndex: 'link_type',
      title: '链接类型',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: LinkType,
    },
    {
      dataIndex: 'link',
      title: '链接地址',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      dataIndex: 'image',
      title: 'banner图',
      hideInSearch: true,
      render(text, record) {
        return <TableImgCall alt={record.title} src={record.image} />;
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
      title: '修改时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'right',
      valueType: 'option',
      render(text, record) {
        return [
          <Button
            style={{ padding: 0 }}
            type={'link'}
            disabled={record.state === 'onsale'}
            key={1}
            onClick={() => {}}
          >
            上架
          </Button>,
          <Button
            style={{ padding: 0 }}
            type={'link'}
            disabled={record.state !== 'onsale'}
            key={2}
            onClick={() => {}}
          >
            下架
          </Button>,
        ];
      },
    },
  ];

  function create() {
    Dialog.open({
      title: '新增banner',
      content: <Set />,
      async onOK(name, info) {
        const values = info?.values as any;
        try {
          const res = await addBanner({ ...values, image: values.image[0] });
          if (res.code === 'ok') {
            message.success('添加成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message);
          return Promise.reject();
        }
      },
    });
  }

  return (
    <PageContainer>
      <ProTable<Banner>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getBannerPage(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-3',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="banner 管理"
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
