/**
 * @name: detail
 * @user: cfj
 * @date: 2021/12/12 2:39
 */
import React from 'react';
import { Col, Row } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { INftType } from '@/services/nft/nftType';
import { getNftType } from '@/services/nft/nftType';
import TypographyItem from '@/components/TypographyItem';

interface IProps {
  id: string;
}
const Detail = function (props: IProps & PageService<INftType>) {
  const { data } = props.data!;
  const list = [
    { label: '标题：', value: data.category_title },
    { label: '描述：', value: data.category_desc },
    { label: '创建时间：', value: data.create_at },
    { label: '更新时间：', value: data.update_at },
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

export default withServers(getNftType, (props: IProps) => props.id)(Detail) as React.FC<IProps>;
