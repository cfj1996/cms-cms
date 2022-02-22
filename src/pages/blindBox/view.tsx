/**
 * @name: view
 * @user: cfj
 * @date: 2022/2/22 23:05
 */
import type { FC } from 'react';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { BlindBox } from '@/services/blindBox';
import { blindStateMenu, getBlindBox } from '@/services/blindBox';
import TableImgCall from '@/components/tableImgCall';
import { css } from '@emotion/css';
import { dateFormat } from '@/utils';
import { Col, Row } from 'antd';
import TypographyItem from '@/components/TypographyItem';

interface IProps {
  id: string;
}

const divBox = css({
  display: 'flex',
  flexWrap: 'wrap',
  margin: 0,
  padding: 0,
});
const imgBox = css({
  padding: '5px',
});
const View = function (props: IProps & PageService<BlindBox>) {
  const { data } = props.data!;
  const list = [
    {
      label: '盲盒标题:',
      value: data.title,
    },
    {
      label: '盲盒名称:',
      value: data.blind_name,
    },
    {
      label: '盲盒图片:',
      value: (
        <div className={divBox}>
          {data.images.map((i) => (
            <div key={i} className={imgBox}>
              <TableImgCall
                images={data.images.map((img) => ({
                  alt: data.blind_name,
                  src: img,
                }))}
                alt={data.blind_name}
                src={i}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      label: '中奖率:',
      value: data.probability,
    },
    {
      label: '玩法介绍:',
      value: data.play_instruction,
    },
    {
      label: '盲盒状态:',
      value: blindStateMenu[data.state]?.text,
    },
    {
      label: '盲盒数量:',
      value: data.amount,
    },
    {
      label: '销售数量:',
      value: data.sale_amount,
    },
    { label: '创建时间：', value: dateFormat(data.created_at) },
    { label: '更新时间：', value: dateFormat(data.updated_at) },
  ];
  return (
    <Row gutter={24}>
      {list.map((i, key) => (
        <Col key={key} span={24}>
          <TypographyItem label={i.label} value={i.value} />
        </Col>
      ))}
    </Row>
  );
};

export default withServers(getBlindBox, (props: IProps) => props.id)(View) as FC<IProps>;
