/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/24 21:22
 */

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import type { IAddKeyword, IKeyword } from '@/services/nft/keyword';
import { addKeyword, deleteKeyword, getKeywordPage, updateKeyword } from '@/services/nft/keyword';
import Dialog from '@/components/Dialog';
import Set from '@/pages/nft/keyword/set';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IKeyword>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'keywords',
      editable: false,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      valueType: 'progress',
      hideInSearch: true,
    },
    {
      dataIndex: 'created_at',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'updated_at',
      title: '修改时间',
      valueType: 'dateTime',
      hideInSearch: true,
      editable: false,
    },
    {
      title: '操作',
      align: 'right',
      valueType: 'option',
      render(text, record, index, action) {
        return [
          <a key={1} onClick={() => action?.startEditable?.(record.id)}>
            编辑
          </a>,
          <a key={2} onClick={() => del(record.id)}>
            删除
          </a>,
        ];
      },
    },
  ];

  function create() {
    Dialog.open({
      title: '新增关键词',
      content: <Set />,
      async onOK(name, info) {
        const values = info?.values as IAddKeyword;
        await addKeyword(values);
        message.success('添加成功');
        actionRef.current?.reload();
      },
    });
  }

  function del(id: string) {
    Modal.confirm({
      title: '确定上架吗?',
      async onOk() {
        await deleteKeyword(id).catch((error) => {
          message.error('操作失败,稍后重试。');
          throw error;
        });
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  }

  return (
    <PageContainer>
      <ProTable<IKeyword>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getKeywordPage(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-3',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        editable={{
          type: 'multiple',
          async onSave(key, row, originRow) {
            console.log(key, row, originRow, originRow);
            if (originRow.weight !== row.weight) {
              await updateKeyword(row.id, row.weight);
            }
          },
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
