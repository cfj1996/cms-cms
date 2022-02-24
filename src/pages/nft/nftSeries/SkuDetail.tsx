/**
 * @name: Sku
 * @user: cfj
 * @date: 2022/1/16 16:24
 */
import { Button, Input, List, message, Popconfirm, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { useRef } from 'react';
import type { AddSku, INft, Purchase, Sku } from '@/services/nft/nfts';
import { addSku, delSku, getSkuList, skuNftPurchase } from '@/services/nft/nfts';
import TableImgCall from '@/components/tableImgCall';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Dialog from '@/components/Dialog';
import { AddSkuSet } from '@/pages/nft/nftSeries/SkuSet';
import PurchaseSet from '@/pages/nft/nftSeries/purchaseSet';
import type { ActionRef } from '@/components/InfiniteScrollBox';
import InfiniteScrollBox from '@/components/InfiniteScrollBox';

interface IProps {
  data: INft;
}

const headerBox = css({
  height: '50px',
  display: 'flex',
  alignItems: 'status',
});
const scrollBox = css({
  height: '65VH',
  overflow: 'auto',
});
const addBtn = css({
  marginLeft: '10px',
});
const imgCall = css({
  width: '80px',
  overflow: 'hidden',
});
const amountCss = css({
  paddingRight: '15px',
});
const editBtn = css({
  marginRight: 15,
});
const SkuDetail = function (props: IProps) {
  const actionRef = useRef<ActionRef>();
  const searchText = useRef<string>('');
  const { id, total, state } = props.data;

  function deleteSku(id: string) {
    delSku(id)
      .then((res) => {
        if (res.code === 'ok') {
          message.success('删除成功');
          actionRef.current?.reload();
        } else {
          message.error(res.msg);
          throw new Error(res.msg);
        }
      })
      .catch((err) => {
        message.error(err.msg);
      });
  }

  function create() {
    Dialog.open({
      title: '新增SKu',
      content: <AddSkuSet total={total} />,
      async onOK(name, info) {
        const { price, ...other } = info?.values as Omit<AddSku, 'nft_id'>;
        const res = await addSku(Object.assign({ nft_id: id, price: String(price) }, other)).catch(
          (err) => {
            message.error('添加失败,稍后重试。');
            throw err;
          },
        );
        if (res.code === 'ok') {
          message.success('添加成功');
          actionRef.current?.reload();
        } else {
          message.error(res.msg);
          throw new Error(res.msg);
        }
      },
    });
  }

  return (
    <div id="scrollableDiv" className={scrollBox}>
      <InfiniteScrollBox
        ref={actionRef}
        header={
          <div className={headerBox}>
            <Input.Search
              allowClear={true}
              placeholder="sku属性"
              enterButton="搜索"
              size="large"
              onChange={(event) => {
                searchText.current = event.target.value;
              }}
              onSearch={(value) => {
                searchText.current = value;
                actionRef.current?.reload();
              }}
            />
            <Tooltip title="新建 SKU">
              <Button
                disabled={state === 'onsale'}
                className={addBtn}
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => create()}
              />
            </Tooltip>
          </div>
        }
        server={(current) =>
          getSkuList({
            pageSize: 10,
            current,
            nft_id: id,
            attribute: searchText.current,
          })
        }
        height={'60VH'}
        renderItem={(item: Sku) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <div className={imgCall}>
                  <TableImgCall
                    images={item.images.map((img) => ({
                      alt: item.attribute,
                      src: img,
                    }))}
                    alt={item.attribute}
                    src={item.images[0]}
                  />
                </div>
              }
              title={item.attribute}
              description={`售价: $ ${Number(item.price).toLocaleString()}, 总数: ${
                item.amount
              } 个${item.is_purchase ? `, 限购: ${item.limit_number}个` : ''}`}
            />
            <Button
              type="primary"
              shape="circle"
              className={editBtn}
              icon={<EditOutlined />}
              onClick={() => {
                Dialog.open({
                  title: '编辑限购信息',
                  content: (
                    <PurchaseSet
                      is_purchase={item.is_purchase}
                      limit_number={item.limit_number}
                      interval_time={item.interval_time}
                    />
                  ),
                  async onOK(name, info) {
                    console.log('info?.values', info?.values);
                    try {
                      const values = info?.values as Purchase;
                      const res = await skuNftPurchase({ sku_id: item.id, ...values });
                      if (res.code === 'ok') {
                        message.success('编辑成功');
                        actionRef.current?.reload();
                      } else {
                        throw new Error(res.msg);
                      }
                    } catch (error: any) {
                      message.error(error.message);
                      throw error;
                    }
                  },
                });
              }}
            />
            <div className={amountCss}>
              <Popconfirm
                title="确定删除？"
                onConfirm={() => deleteSku(item.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  disabled={state === 'onsale'}
                  type="primary"
                  shape="circle"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default SkuDetail;
