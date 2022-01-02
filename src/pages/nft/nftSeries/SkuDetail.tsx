/**
 * @name: Sku
 * @user: cfj
 * @date: 2022/1/16 16:24
 */
import { Button, Divider, Input, List, message, Popconfirm, Skeleton, Tooltip } from 'antd';
import { css } from '@emotion/css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useEffect, useState } from 'react';
import type { AddSku, INft, Purchase, Sku } from '@/services/nft/nfts';
import { addSku, delSku, getSkuList, skuNftPurchase } from '@/services/nft/nfts';
import TableImgCall from '@/components/tableImgCall';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Dialog from '@/components/Dialog';
import { AddSkuSet } from '@/pages/nft/nftSeries/SkuSet';
import PurchaseSet from '@/pages/nft/nftSeries/purchaseSet';

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
  const { id, total, state } = props.data;
  const [config, setConfig] = useState({
    attribute: '',
    nft_id: id,
    current: 1,
    pageSize: 10,
    total: null as number | null,
    loading: false,
    dataSource: [] as Sku[],
  });

  const fetchPage = useCallback(
    (current: number) => {
      setConfig((state) => ({
        ...state,
        loading: true,
      }));
      getSkuList({
        pageSize: config.pageSize,
        current: current,
        nft_id: config.nft_id,
        attribute: config.attribute,
      })
        .then((res) => {
          setConfig((state) => ({
            ...state,
            current: current + 1,
            dataSource: [...(current === 1 ? [] : state.dataSource), ...res.data],
            total: res.total,
            loading: false,
          }));
        })
        .catch(() => {
          setConfig((state) => ({
            ...state,
            current: 1,
            dataSource: [],
            total: null,
            loading: false,
          }));
        });
    },
    [config.current, config.pageSize, config.attribute, config.nft_id],
  );

  function loadMoreData() {
    console.log(1111);
    if (config.loading) {
      return;
    }
    fetchPage(config.current);
  }

  function deleteSku(id: string) {
    delSku(id)
      .then((res) => {
        if (res.code === 'ok') {
          message.success('删除成功');
          setConfig((state) => ({
            ...state,
            attribute: '',
            current: 1,
          }));
          fetchPage(1);
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
          setConfig((state) => ({
            ...state,
            attribute: '',
            current: 1,
          }));
          fetchPage(1);
        } else {
          message.error(res.msg);
          throw new Error(res.msg);
        }
      },
    });
  }

  useEffect(() => {
    fetchPage(1);
  }, []);
  return (
    <div id="scrollableDiv" className={scrollBox}>
      <InfiniteScroll
        pullDownToRefresh={false}
        dataLength={config.dataSource.length}
        next={loadMoreData}
        hasMore={Boolean(
          config.loading || (config.total && config.dataSource.length < config.total),
        )}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />} // true
        endMessage={
          <Divider plain>{config.total === 0 ? '暂无数据 🤐' : '没有更多数据了 🤐'}</Divider> // false
        }
        scrollableTarget="scrollableDiv"
      >
        <List
          header={
            <div className={headerBox}>
              <Input.Search
                allowClear={true}
                value={config.attribute}
                onChange={(event) => {
                  setConfig((state) => ({
                    ...state,
                    attribute: event.target.value,
                  }));
                }}
                placeholder="sku属性"
                enterButton="搜索"
                size="large"
                onSearch={(value) => {
                  setConfig((state) => ({
                    ...state,
                    attribute: value,
                    current: 1,
                  }));
                  fetchPage(1);
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
        >
          {config.dataSource.map((item) => (
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
                      />
                    ),
                    async onOK(name, info) {
                      console.log('info?.values', info?.values);
                      try {
                        const values = info?.values as Purchase;
                        const res = await skuNftPurchase({ sku_id: item.id, ...values });
                        if (res.code === 'ok') {
                          message.success('编辑成功');
                          fetchPage(1);
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
          ))}
        </List>
      </InfiniteScroll>
    </div>
  );
};

export default SkuDetail;
