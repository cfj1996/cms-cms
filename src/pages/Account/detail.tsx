/**
 * @name: detail
 * @user: cfj
 * @date: 2021/12/12 2:39
 */
import React from 'react';
import { Avatar, Col, Row } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { IAccessListRes } from '@/services/Account';
import { getAccount } from '@/services/Account';
import TypographyItem from '@/components/TypographyItem';

interface IProps {
  id: string;
}
const Detail = function (props: IProps & PageService<IAccessListRes>) {
  const { data } = props.data!;
  const list = [
    { label: '用户名：', value: data.username },
    { label: '创建时间：', value: data.createdTime },
    { label: '头像：', value: <Avatar src={data.avatar} /> },
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

export default withServers(getAccount, (props: IProps) => props.id)(Detail) as React.FC<IProps>;
