import type { IContent } from '@/services/Review/content';
import { ContentStateEnum, getContentList, updateContent } from '@/services/Review/content';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useRef } from 'react';
import { Button, message, Modal } from 'antd';
import TableImgCall from '@/components/tableImgCall';

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
      title: '图片',
      dataIndex: 'images',
      hideInSearch: true,
      render(text, row) {
        return (
          <TableImgCall
            alt={row.content}
            src={row.images?.[0]}
            images={row.images?.map((i) => ({
              alt: row.content,
              src: i,
            }))}
          />
        );
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
            key={2}
            disabled={row.state !== 'passed'}
            onClick={() => {
              Modal.confirm({
                title: '确定下架吗?',
                async onOk() {
                  try {
                    const res = await updateContent(row.id, 'offsell');
                    if (res.code === 'ok') {
                      message.success('下架成功');
                      actionRef.current?.reload();
                    } else {
                      throw new Error(res.msg);
                    }
                    return true;
                  } catch (e: any) {
                    message.error(e.message);
                    return Promise.reject();
                  }
                },
              });
            }}
          >
            下架
          </Button>,
          <TableDropdown
            key={3}
            onSelect={(key) => {
              if (key === '1') {
                Modal.confirm({
                  title: '审核通过吗?',
                  async onOk() {
                    try {
                      const res = await updateContent(row.id, 'passed');
                      if (res.code === 'ok') {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      } else {
                        throw new Error(res.msg);
                      }
                      return true;
                    } catch (e: any) {
                      message.error(e.message);
                      return Promise.reject();
                    }
                  },
                });
              } else if (key === '2') {
                Modal.confirm({
                  title: '审核不通过吗?',
                  async onOk() {
                    try {
                      const res = await updateContent(row.id, 'failed');
                      if (res.code === 'ok') {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      } else {
                        throw new Error(res.msg);
                      }
                      return true;
                    } catch (e: any) {
                      message.error(e.message);
                      return Promise.reject();
                    }
                  },
                });
              }
            }}
            menus={[
              { key: '1', name: '通过', disabled: row.state !== 'pending' },
              { key: '2', name: '不通过', disabled: row.state !== 'pending' },
            ]}
          />,
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
          persistenceKey: 'pro-table-singe-demos-9',
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
