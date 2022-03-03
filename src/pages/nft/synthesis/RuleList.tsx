import { useRef } from 'react';
import type { ActionRef } from '@/components/InfiniteScrollBox';
import InfiniteScrollBox from '@/components/InfiniteScrollBox';
import Dialog from '@/components/Dialog';
import { Button, List, message, Popconfirm, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { AddSynthesisRule, SynthesisRule } from '@/services/nft/synthesis';
import {
  addSynthesisRule,
  delSynthesisRule,
  editSynthesisRule,
  getSynthesisRulePage,
  SyntheticMethodEnum,
} from '@/services/nft/synthesis';
import RuleSet from '@/pages/nft/synthesis/RuleSet';
import ConsumeList from '@/pages/nft/synthesis/ConsumeList';

/**
 * @name: RuleList
 * @user: cfj
 * @date: 2022/3/3 20:59
 */
interface IProps {
  id: string;
  name: string;
}

const RuleList = function (props: IProps) {
  const actionRef = useRef<ActionRef>();

  function add() {
    Dialog.open({
      title: '添加合成规则',
      content: <RuleSet />,
      async onOK(name, info) {
        const values = info!.values as Omit<AddSynthesisRule, 'synthesis_id'>;
        const res = await addSynthesisRule({ synthesis_id: props.id, ...values });
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

  function editBtn(item: SynthesisRule) {
    Dialog.open({
      title: '编辑规则',
      content: <RuleSet id={props.id} data={item} />,
      async onOK(name, info) {
        const values = info!.values as Omit<AddSynthesisRule, 'synthesis_id'>;
        const res = await editSynthesisRule({
          synthesisrule_id: item.id,
          play_instruction: values.play_instruction,
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
      const res = await delSynthesisRule(id);
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
          <Tooltip title="添加合成规则">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={add} />
          </Tooltip>
        </div>
      }
      server={(current) => getSynthesisRulePage({ current, pageSize: 10, synthesis_id: props.id })}
      height={'60VH'}
      renderItem={(item: SynthesisRule) => (
        <List.Item
          key={item.id}
          actions={[
            <Button
              key={0}
              size={'small'}
              type="link"
              onClick={() => {
                Dialog.open({
                  title: '查看消耗品',
                  type: 'view',
                  content: <ConsumeList id={item.id} name={props.name} />,
                });
              }}
            >
              查看消耗品
            </Button>,
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
            description={`成长方式:${SyntheticMethodEnum[item.synthetic_method]}, `}
          />
        </List.Item>
      )}
    />
  );
};

export default RuleList;
