/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:19
 */
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IAddNftType, INftType } from '@/services/nft/nftType';
import { addNftType, getNftTypeList } from '@/services/nft/nftType';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSet } from './set';
import { useRef } from 'react';
import Dialog from '@/components/Dialog';
import { getContractAddress } from '@/services/nft/nfts';
import GlobalLoad from '@/components/GlobalLoad';

const Index = function () {
  const actionRef = useRef<ActionType>();

  function create() {
    Dialog.open({
      title: '新增藏品系列',
      content: <AddSet />,
      async onOK(name, info) {
        const values = info?.values;
        const id = GlobalLoad.open({ tip: '藏品系列创建中，请稍后....' });
        try {
          const { data, code, msg } = await getContractAddress();
          if (code === 'ok') {
            const address = data.contract_address;
            if (address) {
              await addNftType({ contract_address: address, ...values } as IAddNftType);
              message.success('创建成功');
              GlobalLoad.close(id);
              actionRef.current?.reload();
            } else {
              throw new Error('未获取到地址');
            }
          } else {
            throw new Error(msg);
          }
        } catch (error: any) {
          GlobalLoad.close(id);
          message.error(error.message || '创建失败,稍后重试。');
          return Promise.reject(error);
        }
      },
    });
  }

  // function update(id: string) {
  //   Dialog.open({
  //     title: '修改藏品系列',
  //     content: <EditSet id={id} />,
  //     async onOK(name, info) {
  //       await updateNftType(id, info?.values as IAddNftType);
  //       message.success('修改成功');
  //       actionRef.current?.reload();
  //     },
  //   });
  // }
  // function show(id: string) {
  //   Dialog.open({
  //     type: 'view',
  //     title: '藏品详情',
  //     content: <Detail id={id} />,
  //     footer: null,
  //   });
  // }
  const columns: ProColumns<INftType>[] = [
    {
      dataIndex: 'name',
      title: '系列名称',
      key: 'keywords',
      fieldProps: {
        placeholder: '请输入系列名称',
      },
    },
    {
      dataIndex: 'symbol',
      title: '系列简称',
      hideInSearch: true,
    },
    {
      dataIndex: 'contract_address',
      title: '合约地址',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
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
    /* {
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
     },*/
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
