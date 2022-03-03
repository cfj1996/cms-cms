import { useRef } from 'react';
import type { ActionRef } from '@/components/InfiniteScrollBox';
import InfiniteScrollBox from '@/components/InfiniteScrollBox';
import Dialog from '@/components/Dialog';
import { Button, List, message, Popconfirm, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { AddConsumerist, Consumerist } from '@/services/nft/synthesis';
import {
  addConsumerist,
  delConsumerist,
  editConsumerist,
  getConsumeristPage,
} from '@/services/nft/synthesis';
import ConsumeSet from '@/pages/nft/synthesis/ConsumeSet';

/**
 * @name: RuleList
 * @user: cfj
 * @date: 2022/3/3 20:59
 */
interface IProps {
  id: string;
  name: string;
}

const ConsumeList = function (props: IProps) {
  const actionRef = useRef<ActionRef>();

  function add() {
    Dialog.open({
      title: '添加基础消耗品',
      content: <ConsumeSet />,
      async onOK(name, info) {
        const values = info!.values as Omit<AddConsumerist, 'synthesisrule_id'>;
        const res = await addConsumerist({ synthesisrule_id: props.id, ...values });
        if (res.code === 'ok') {
          message.success('添加成功');
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

  function editBtn(item: Consumerist) {
    Dialog.open({
      title: '编辑基础消耗品',
      content: <ConsumeSet id={props.id} data={item} />,
      async onOK(name, info) {
        const values = info!.values as Omit<AddConsumerist, 'synthesis_id'>;
        const res = await editConsumerist({
          consumenft_id: item.id,
          amount: values.amount,
        });
        if (res.code === 'ok') {
          message.success('编辑成功');
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

  async function del(id: string) {
    try {
      const res = await delConsumerist(id);
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
  }

  return (
    <InfiniteScrollBox
      ref={actionRef}
      header={
        <div className={css({ display: 'flex', justifyContent: 'flex-end' })}>
          <Tooltip title="添加基础消耗品">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={add} />
          </Tooltip>
        </div>
      }
      server={(current) =>
        getConsumeristPage({ current, pageSize: 10, synthesisrule_id: props.id })
      }
      height={'60VH'}
      renderItem={(item: Consumerist) => (
        <List.Item
          key={item.id}
          actions={[
            <Button
              key={1}
              onClick={() => editBtn(item)}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />,
            <Popconfirm
              key={2}
              title="确定删除？"
              onConfirm={() => del(item.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={`项目名称: ${props.name}`}
            description={`消耗藏品名称:${item.nft_name}, 数量：${item.amount}`}
          />
        </List.Item>
      )}
    />
  );
};

export default ConsumeList;
