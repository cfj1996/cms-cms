import type { IContent } from '@/services/Review/content';
import { ContentStateEnum, getContentList, updateContent } from '@/services/Review/content';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';
import { Button, Dropdown, Menu, message, Modal } from 'antd';

/**
 * @name: index
 * @user: cfj
 * @date: 2021/12/10 23:47
 */

const Index = function () {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IContent>[] = [
    {
      dataIndex: 'user_name',
      title: '用户名',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      dataIndex: 'title',
      title: 'title',
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      valueType: 'select',
      valueEnum: ContentStateEnum,
    },
    {
      dataIndex: 'price',
      title: '价格',
      hideInSearch: true,
    },
    {
      dataIndex: 'nft_number',
      title: '数量',
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'content',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      dataIndex: 'created_at',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      dataIndex: 'updated_at',
      title: '审核时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '文件地址',
      dataIndex: 'images',
      hideInSearch: true,
      render(text, row) {
        const menu = (
          <Menu>
            {row?.images.map((i, k) => (
              <Menu.Item key={k}>
                <a target="_blank" href={i}>
                  文件{k + 1}
                </a>
              </Menu.Item>
            ))}
          </Menu>
        );
        if (row.images?.length) {
          return (
            <Dropdown overlay={menu} placement="bottomLeft" arrow>
              <Button type={'link'}>文件</Button>
            </Dropdown>
          );
        }
        return '-';
      },
    },
    {
      dataIndex: 'link',
      title: '主页',
      hideInSearch: true,
      ellipsis: true,
      render(text, row) {
        return (
          <a href={row.link} target={'_blank'}>
            {row.link}
          </a>
        );
      },
    },
    {
      title: '操作',
      align: 'right',
      valueType: 'option',
      hideInSearch: true,
      render(text, row) {
        return [
          <Button
            style={{ padding: 0 }}
            type="link"
            key={1}
            disabled={row.state !== 'pending'}
            onClick={() => {
              Modal.confirm({
                title: '确定通过吗?',
                async onOk() {
                  await updateContent(row.id, 'passed').catch((error) => {
                    message.error('操作失败,稍后重试。');
                    throw error;
                  });
                  message.success('操作成功');
                  actionRef.current?.reload();
                },
              });
            }}
          >
            通过
          </Button>,
          <Button
            style={{ padding: 0 }}
            type="link"
            key={2}
            disabled={row.state !== 'passed'}
            onClick={() => {
              Modal.confirm({
                title: '确定下架吗?',
                async onOk() {
                  await updateContent(row.id, 'passed').catch((error) => {
                    message.error('操作失败,稍后重试。');
                    throw error;
                  });
                  message.success('下架成功');
                  actionRef.current?.reload();
                },
              });
            }}
          >
            下架
          </Button>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<IContent>
        actionRef={actionRef}
        columns={columns}
        request={(params: any) => getContentList(params)}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos-7',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        dateFormatter="number"
        headerTitle="内容审核"
      />
    </PageContainer>
  );
};

export default Index;
