/**
 * @name: view
 * @user: cfj
 * @date: 2022/3/3 23:38
 */
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { IOrder } from '@/services/oredr';
import { getOrder } from '@/services/oredr';
import { css } from '@emotion/css';
import { Col } from 'antd';
import TypographyItem from '@/components/TypographyItem';
import type { FC } from 'react';
import TableImgCall from '@/components/tableImgCall';

const containerBox = css({
  overflow: 'auto',
  paddingLeft: 12,
  paddingRight: 12,
});
const divBox = css({
  display: 'flex',
  flexWrap: 'wrap',
  margin: 0,
  padding: 0,
});
const imgBox = css({
  padding: '5px',
});

interface IProps {
  id: string;
}

const View = function (props: IProps & PageService<IOrder>) {
  const data = props.data?.data as IOrder;
  const list = [
    { label: '订单id', value: data.order_id },
    { label: '订单标题', value: data.title },
    { label: '订单描述', value: data.desc },
    {
      label: '订单图片',
      value: (
        <div className={divBox}>
          {data.images.map((i) => (
            <div key={i} className={imgBox}>
              <TableImgCall
                images={data.images.map((img) => ({
                  alt: data.title,
                  src: img,
                }))}
                alt={data.title}
                src={i}
              />
            </div>
          ))}
        </div>
      ),
    },
    { label: '订单价格', value: data.price },
  ];
  return (
    <div className={containerBox}>
      {list.map((i, key) => (
        <Col key={key} span={24}>
          <TypographyItem label={i.label} value={i.value} />
        </Col>
      ))}
    </div>
  );
};

export default withServers(getOrder, (props: IProps) => props.id)(View) as FC<IProps>;
