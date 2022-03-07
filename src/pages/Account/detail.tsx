/**
 * @name: detail
 * @user: cfj
 * @date: 2021/12/12 2:39
 */
import React from 'react';
import { Col, Row } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { Access } from '@/services/Account';
import { getAccount } from '@/services/Account';
import TypographyItem from '@/components/TypographyItem';

interface IProps {
  id: string;
}

const Detail = function (props: IProps & PageService<Access>) {
  const { data } = props.data!;
  const list = [
    { label: '用户名：', value: data.full_name },
    { label: '角色：', value: data.role },
    { label: '是否禁用：', value: data.is_disable ? '禁用' : '启用' },
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

export default withServers(getAccount, (props: IProps) => props.id)(Detail) as React.FC<IProps>;
