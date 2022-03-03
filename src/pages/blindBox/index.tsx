/**
 * @name: index
 * @user: cfj
 * @date: 2022/2/22 22:06
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { AddBlindBox, BlindBox } from '@/services/blindBox';
import {
  addBlindBox,
  blindStateMenu,
  delBlindBox,
  editBlindBox,
  getBlindBoxPage,
  updateBlindBoxState,
} from '@/services/blindBox';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import TableImgCall from '@/components/tableImgCall';
import Dialog from '@/components/Dialog';
import View from '@/pages/blindBox/view';
import { AddSet, EditSet } from '@/pages/blindBox/set';
import LinkNftView from '@/pages/blindBox/linkNftView';

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<BlindBox>[] = [
    {
      dataIndex: 'id',
      title: '盲盒id',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'blind_name',
      title: '盲盒名称',
    },
    {
      dataIndex: 'title',
      title: '盲盒标题',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'images',
      title: '图片',
      hideInSearch: true,
      render(text, record) {
        return (
          <TableImgCall
            alt={record.title}
            src={record.images[0]}
            images={record.images.map((i) => ({
              src: i,
              alt: record.title,
            }))}
          />
        );
      },
    },
    {
      dataIndex: 'state',
      title: '盲盒状态',
      valueType: 'select',
      valueEnum: blindStateMenu,
    },
    {
      dataIndex: 'price',
      title: '盲盒价格',
      hideInSearch: true,
    },
    {
      dataIndex: 'amount',
      title: '总数',
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
        const menu = [
          { key: '0', name: '编辑', disabled: record.state === 'onsale' },
          { key: '1', name: record.state === 'onsale' ? '下架' : '上架' },
          { key: '2', name: '删除' },
          { key: '3', name: '关联藏品' },
        ];
        return [
          <a key={'view'} onClick={() => show(record.id)}>
            查看
          </a>,
          <TableDropdown
            key={'action'}
            menus={menu}
            onSelect={(key) => {
              if (key === '0') {
                edit(record.id);
              } else if (key === '1') {
                updateState(record.id, record.state === 'onsale' ? 'offsale' : 'onsale');
              } else if (key === '2') {
                del(record.id);
              } else if (key === '3') {
                showLinkNft(record.id);
              }
            }}
          />,
        ];
      },
    },
  ];

  function showLinkNft(id: string) {
    Dialog.open({
      title: '关联藏品',
      content: <LinkNftView id={id} />,
    });
  }

  function show(id: string) {
    Dialog.open({
      title: '盲盒详情',
      content: <View id={id} />,
    });
  }

  function create() {
    Dialog.open({
      title: '新增盲盒',
      content: <AddSet />,
      async onOK(name, info) {
        const { price, ...other } = info?.values as AddBlindBox;
        const data = {
          ...other,
          price: String(price),
        };
        const res = await addBlindBox(data);
        if (res.code === 'ok') {
          message.success('新增成功');
          actionRef.current?.reload();
        } else {
          throw new Error(res.msg);
        }
      },
      onError(error) {
        message.error(error.message || '操作失败,稍后重试。');
      },
    });
  }

  function del(id: string) {
    Modal.confirm({
      title: '确认删除吗？',
      async onOk() {
        try {
          const res = await delBlindBox(id);
          if (res.code === 'ok') {
            message.success('删除成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message || '操作失败,稍后重试。');
          throw error;
        }
      },
    });
  }

  function edit(id: string) {
    Dialog.open({
      title: '编辑盲盒',
      content: <EditSet id={id} />,
      async onOK(name, info) {
        const { price, ...other } = info?.values as AddBlindBox;
        const data = {
          ...other,
          blind_id: id,
          price: String(price),
        };
        try {
          const res = await editBlindBox(data);
          if (res.code === 'ok') {
            message.success('编辑成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message || '操作失败,稍后重试。');
          throw error;
        }
      },
    });
  }

  function updateState(id: string, state: 'onsale' | 'offsale') {
    Modal.confirm({
      title: state === 'onsale' ? '确认上架?' : '确认下架?',
      async onOk() {
        try {
          const res = await updateBlindBoxState(id, state);
          if (res.code === 'ok') {
            message.success(state === 'onsale' ? '上架成功' : '下架成功');
            actionRef.current?.reload();
          } else {
            throw new Error(res.msg);
          }
        } catch (error: any) {
          message.error(error.message || '操作失败,稍后重试。');
          throw error;
        }
      },
    });
  }

  return (
    <PageContainer>
      <ProTable<BlindBox>
        actionRef={actionRef}
        columns={columns}
        request={async (params = {}) => {
          return getBlindBoxPage(params as any);
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-12',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="number"
        headerTitle="盲盒列表"
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
