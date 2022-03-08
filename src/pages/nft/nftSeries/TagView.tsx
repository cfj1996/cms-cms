/**
 * @name: TagView
 * @user: cfj
 * @date: 2022/3/7 22:48
 */
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import { addNftTag, delNftTag, getNftTags } from '@/services/nft/nfts';
import type { Tag } from '@/services/nft/tag';
import type { FC } from 'react';
import { Button, List, message, Popconfirm, Result, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dialog from '@/components/Dialog';
import { TagSet } from '@/pages/nft/nftSeries/TagSet';

interface IProps {
  id: string;
}

const TagView = function (props: IProps & PageService<{ list: Tag[] }>) {
  const list = props.data?.data?.list || [];

  function create() {
    Dialog.open({
      title: '添加标签',
      content: <TagSet />,
      async onOK(name, info) {
        const { tag_id } = info?.values as { tag_id: string };
        const res = await addNftTag({ tag_id, nft_id: props.id });
        if (res.code === 'ok') {
          props.refresh?.();
          message.success('添加成功');
        } else {
          throw new Error(res.msg || '操作失败,稍后重试。');
        }
      },
      onError(error) {
        message.error(error.message || '操作失败,稍后重试。');
      },
    });
  }

  return (
    <div>
      <List
        header={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="添加标签">
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => create()}
              />
            </Tooltip>
          </div>
        }
      >
        {list.length ? (
          list.map((tag) => (
            <List.Item
              key={tag.id}
              actions={[
                <Popconfirm
                  key={'del'}
                  title="确认删除吗?"
                  onConfirm={async () => {
                    const res = await delNftTag(tag.id);
                    if (res.code === 'ok') {
                      message.success('删除成功');
                      props.refresh?.();
                    } else {
                      message.error(res.msg || '操作失败,稍后重试。');
                      throw new Error(res.msg || '操作失败,稍后重试。');
                    }
                  }}
                >
                  <a>删除</a>
                </Popconfirm>,
              ]}
            >
              <div>{tag.tag_name}</div>
            </List.Item>
          ))
        ) : (
          <Result status="404" title="暂无数据" />
        )}
      </List>
    </div>
  );
};

export default withServers(getNftTags, (props: IProps) => props.id)(TagView) as FC<IProps>;
