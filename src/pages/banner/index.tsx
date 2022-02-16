/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/24 21:22
 */

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import Dialog from '@/components/Dialog';
import { AddSet, EditSet } from './set';
import type { Banner } from '@/services/banner';
import {
  addBanner,
  bannerState,
  delBanner,
  editBanner,
  getBannerPage,
  LinkType,
  updateBannerState,
} from '@/services/banner';
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
            key={0}
            onClick={() => {
              edit(record);
            }}
          >
            编辑
          </Button>,
          <TableDropdown
            onSelect={(key) => {
              if (key === '1') {
                Modal.confirm({
                  title: '确定上架吗?',
                  async onOk() {
                    await updateBannerState(record.id, 'onsale').catch((error) => {
                      message.error('操作失败,稍后重试。');
                      throw error;
                    });
                    actionRef.current?.reload();
                  },
                });
              } else if (key === '2') {
                Modal.confirm({
                  title: '确定下架吗?',
                  async onOk() {
                    await updateBannerState(record.id, 'offsale').catch((error) => {
                      message.error('操作失败,稍后重试。');
                      throw error;
                    });
                    actionRef.current?.reload();
                  },
                });
              } else {
                Modal.confirm({
                  title: '确定删除吗?',
                  async onOk() {
                    await delBanner(record.id).catch((error) => {
                      message.error('操作失败,稍后重试。');
                      throw error;
                    });
                    actionRef.current?.reload();
                  },
                });
              }
            }}
            menus={[
              { key: '1', name: '上架', disabled: record.state === 'onsale' },
              { key: '2', name: '下架', disabled: record.state !== 'onsale' },
              { key: '3', name: '删除' },
            ]}
            key={1}
          />,
        ];
      },
    },
  ];

  function create() {
    Dialog.open({
      title: '新增banner',
      content: <AddSet />,
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

  function edit(data: Banner) {
    Dialog.open({
      title: '编辑banner',
      content: <EditSet data={data} />,
      async onOK(name, info) {
        const { image, ...other } = info?.values as any;
        other.image = image[0];
        other.banner_id = data.id;
        try {
          const res = await editBanner(other);
          if (res.code === 'ok') {
            message.success('编辑成功');
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
          persistenceKey: 'pro-table-singe-demos-4',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="banner管理列表"
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
