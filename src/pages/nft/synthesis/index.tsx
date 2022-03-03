/**
 * @name: index
 * @user: cfj
 * @date: 2022/3/1 23:32
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { AddSynthesis, Synthesis } from '@/services/nft/synthesis';
import {
  addSynthesis,
  delSynthesis,
  editSynthesis,
  getSynthesisPage,
  synthesisStateEnum,
  updateSynthesisState,
} from '@/services/nft/synthesis';
import { useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TableImgCall from '@/components/tableImgCall';
import Dialog from '@/components/Dialog';
import { AddSet, EditSet } from './set';
import RuleList from '@/pages/nft/synthesis/RuleList';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<Synthesis>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
    },
    {
      dataIndex: 'title',
      title: '标题',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '项目状态',
      valueType: 'select',
      valueEnum: synthesisStateEnum,
    },
    {
      title: '项目图片',
      dataIndex: 'images',
      hideInSearch: true,
      render(text, record) {
        return (
          <TableImgCall
            alt={record.title}
            src={record.images[0]}
            images={record.images.map((image) => ({
              src: image,
              alt: record.name,
            }))}
          />
        );
      },
    },
    {
      dataIndex: 'introduction',
      title: '介绍',
      ellipsis: true,
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
      title: '操作',
      align: 'right',
      valueType: 'option',
      render(text, record) {
        return [
          <Button
            key={'edit'}
            type="link"
            disabled={record.state === 'onsale'}
            onClick={() => edit(record)}
          >
            编辑
          </Button>,
          <TableDropdown
            key={2}
            menus={[
              {
                key: '1',
                name: record.state === 'onsale' ? '下架' : '上架',
                onClick() {
                  const stateText = record.state === 'onsale' ? '下架' : '上架';
                  Dialog.open({
                    title: stateText,
                    type: 'view',
                    content: <p>确认{stateText}？</p>,
                    async onOK() {
                      console.log(1111);
                      const res = await updateSynthesisState(
                        record.id,
                        record.state === 'onsale' ? 'offsale' : 'onsale',
                      );
                      if (res.code === 'ok') {
                        message.success(stateText + '成功');
                        actionRef.current?.reload();
                      } else {
                        throw new Error(res.msg);
                      }
                    },
                    onError(error) {
                      message.error(error.message || '操作失败');
                    },
                  });
                },
              },
              {
                key: '3',
                name: '查看合成规则',
                disabled: record.state === 'onsale',
                onClick() {
                  Dialog.open({
                    title: '合成规则',
                    type: 'view',
                    content: <RuleList id={record.id} name={record.name} />,
                  });
                },
              },
              {
                key: '5',
                name: '删除',
                disabled: record.state === 'onsale',
                onClick() {
                  Dialog.open({
                    title: '删除',
                    type: 'view',
                    content: <p>确认删除吗？</p>,
                    async onOK() {
                      const res = await delSynthesis(record.id);
                      if (res.code === 'ok') {
                        message.success('删除成功');
                        actionRef.current?.reload();
                      } else {
                        throw new Error(res.msg);
                      }
                    },
                    onError(error) {
                      message.error(error.message || '操作失败');
                    },
                  });
                },
              },
            ]}
          />,
        ];
      },
    },
  ];

  function create() {
    Dialog.open({
      title: '新增合成项目',
      content: <AddSet />,
      async onOK(name, info) {
        const values = info?.values as AddSynthesis;
        console.log('values', values);
        const res = await addSynthesis(values);
        if (res.code === 'ok') {
          message.success('创建成功');
          actionRef.current?.reload();
        } else {
          throw new Error(res.msg);
        }
      },
      onError(error) {
        message.error(error.message || '操作失败');
      },
    });
  }

  function edit(record: Synthesis) {
    Dialog.open({
      title: '编辑合成项目',
      content: <EditSet id={record.id} data={record} />,
      async onOK(name, info) {
        const values = info?.values as AddSynthesis;
        const res = await editSynthesis({
          synthesis_id: record.id,
          ...values,
        });
        if (res.code === 'ok') {
          message.success('编辑成功');
          actionRef.current?.reload();
        } else {
          throw new Error(res.msg);
        }
      },
      onError(error) {
        message.error(error.message || '操作失败');
      },
    });
  }

  return (
    <PageContainer>
      <ProTable<Synthesis>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getSynthesisPage(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-13',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="合成管理列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} onClick={() => create()}>
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default Index;
