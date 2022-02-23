/**
 * @name: lintNftView
 * @user: cfj
 * @date: 2022/2/23 23:13
 */
import type { ActionRef } from '@/components/InfiniteScrollBox';
import InfiniteScrollBox from '@/components/InfiniteScrollBox';
import type {
  AddBlindLinkNft,
  BlindBox,
  BlindLinkNfts,
  EditBlindLinkNft,
} from '@/services/blindBox';
import {
  addBlindLinkNft,
  delBlindLinkNft,
  editBlindLinkNft,
  getBlindBox,
  getBlindLinkNfts,
} from '@/services/blindBox';
import { Button, List, message, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import { css } from '@emotion/css';
import Dialog from '@/components/Dialog';
import LinkNft from '@/pages/blindBox/linkNft';
import type { FC } from 'react';
import { useRef } from 'react';

interface IProps {
  id: string;
}

const LinkNftView = function (props: IProps & PageService<BlindBox>) {
  const data = props.data!.data;
  const actionRef = useRef<ActionRef>();
  const disabled = data.state === 'onsale';

  function add() {
    Dialog.open({
      title: '添加关联藏品',
      content: <LinkNft id={props.id} view={data} />,
      async onOK(name, info) {
        try {
          const values = info!.values as Omit<AddBlindLinkNft, 'blind_box_id'>;
          const res = await addBlindLinkNft({ blind_box_id: props.id, ...values });
          if (res.code === 'ok') {
            message.success('添加成功');
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

  function editBtn(item: BlindLinkNfts) {
    Dialog.open({
      title: '编辑关联藏品',
      content: <LinkNft id={props.id} view={data} item={item} />,
      async onOK(name, info) {
        try {
          const values = info!.values as Omit<EditBlindLinkNft, 'blindcollection_id'>;
          const res = await editBlindLinkNft({
            blindcollection_id: item.id,
            amount: values.amount,
            weights: values.weights,
            probability: values.probability,
          });
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

  async function deleteSku(id: string) {
    try {
      const res = await delBlindLinkNft(id);
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
          <Tooltip title="添加关联藏品">
            <Button
              disabled={disabled}
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => add()}
            />
          </Tooltip>
        </div>
      }
      server={(current) => getBlindLinkNfts({ current, pageSize: 10, blind_box_id: props.id })}
      height={'60VH'}
      renderItem={(item: BlindLinkNfts) => (
        <List.Item
          key={item.id}
          actions={[
            <Button
              key={1}
              disabled={disabled}
              onClick={() => editBtn(item)}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />,
            <Popconfirm
              key={2}
              title="确定删除？"
              onConfirm={() => deleteSku(item.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button disabled={disabled} type="primary" shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={item.nft_name}
            description={`数量:${item.amount}, 销售数量: ${item.sale_amount}, 权重: ${item.weights}%, 中奖率: ${item.probability}%`}
          />
        </List.Item>
      )}
    />
  );
};

export default withServers(getBlindBox, (props: IProps) => props.id)(LinkNftView) as FC<IProps>;
