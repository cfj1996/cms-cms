/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IAddNftType, INftType } from '@/services/nft/nftType';
import { addNftType, getNftTypeList, updateNftType } from '@/services/nft/nftType';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet, EditSet } from './set';
import Dialog from '@/components/Dialog';
import { useRef } from 'react';
import Detail from './detail';

const Index = function () {
  const actionRef = useRef<ActionType>();
  function create() {
    Dialog.open({
      title: '新增nft类型',
      content: <AddSet />,
      async onOK(name, info) {
        await addNftType(info?.values as IAddNftType);
        message.success('添加成功');
        actionRef.current?.reload();
      },
    });
  }
  function update(id: string) {
    Dialog.open({
      title: '修改nft类型',
      content: <EditSet id={id} />,
      async onOK(name, info) {
        await updateNftType(id, info?.values as IAddNftType);
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
  const columns: ProColumns<INftType>[] = [
    {
      dataIndex: 'categoryTitle',
      title: '分类标题',
      key: 'categoryTitle',
    },
    {
      dataIndex: 'createAt',
      title: '创建时间',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            createStartTime: value[0],
            createEndTime: value[1],
          };
        },
      },
    },
    {
      dataIndex: 'updateAt',
      title: '更新时间',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateAt',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            updateStartTime: value[0],
            updateEndTime: value[1],
          };
        },
      },
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
