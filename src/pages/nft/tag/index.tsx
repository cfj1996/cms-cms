import { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { AddTag, Tag } from '@/services/nft/tag';
import { addTag, delTag, getTags } from '@/services/nft/tag';
import { Set } from './set';
import Dialog from '@/components/Dialog';

/**
 * @name: index
 * @user: cfj
 * @date: 2022/3/7 22:27
 */

const Index = function () {
  const actionRef = useRef<ActionType>();

  function create() {
    Dialog.open({
      title: '添加标签',
      content: <Set />,
      async onOK(name, info) {
        const values = info?.values as AddTag;
        const res = await addTag(values);
        if (res.code === 'ok') {
          message.success('添加成功');
          actionRef.current?.reload();
        } else {
          throw new Error(res.msg || '操作失败');
        }
      },
      onError(error) {
        message.error(error.message);
      },
    });
  }

  const columns: ProColumns<Tag>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      key: 'keywords',
      hideInSearch: true,
    },
    {
      dataIndex: 'tag_name',
      title: '名称',
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
      valueType: 'option',
      render(text, record) {
        return (
          <Popconfirm
            title="确认删除吗?"
            onConfirm={async () => {
              const res = await delTag(record.id);
              if (res.code === 'ok') {
                message.success('删除成功');
                actionRef.current?.reload();
              } else {
                message.error(res.msg || '操作失败,稍后重试。');
                throw new Error(res.msg || '操作失败,稍后重试。');
              }
            }}
          >
            <a>删除</a>
          </Popconfirm>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<Tag>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getTags(params as any);
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
