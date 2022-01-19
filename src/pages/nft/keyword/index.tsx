/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/24 21:22
 */

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, InputNumber, message, Modal } from 'antd';
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
      width: 150,
      renderFormItem(item, props) {
        return <InputNumber {...props} min={1} max={100} />;
      },
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
        try {
          const res = await addKeyword(values);
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

  function del(id: string) {
    Modal.confirm({
      title: '确定删除吗?',
      async onOk() {
        try {
          const res = await deleteKeyword(id);
          if (res.code === 'ok') {
            message.success('删除成功');
            actionRef.current?.reload();
            return true;
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
      <ProTable<IKeyword>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getKeywordPage(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-5',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        editable={{
          type: 'multiple',
          async onSave(key, row, originRow) {
            if (originRow.weight !== row.weight) {
              if (row.weight >= 0 && row.weight <= 100) {
                await updateKeyword(row.id, row.weight);
              } else {
                message.error('请输入1~100的数字');
                throw new Error('请输入1~100的数字');
              }
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
