/**
 * @name: detail
 * @user: cfj
 * @date: 2021/12/12 2:39
 */
import React from 'react';
import { Col, Row } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import TypographyItem from '@/components/TypographyItem';
import { getNft, INft, NftState } from '@/services/nft/nfts';
import { dateFormat } from '@/utils';

interface IProps {
  id: string;
}
const Detail = function (props: IProps & PageService<INft>) {
  const { data } = props.data!;
  const list = [
    { label: '名称：', value: data.name },
    { label: '标题：', value: data.title },
    { label: '类别名称：', value: data.category_name },
    {
      label: '源文件地址：',
      value: (
        <ol style={{ margin: 0, padding: 0 }}>
          {data.images.map((i) => (
            <li key={i}>
              <a href={i} target="_blank">
                {i}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
    { label: '热度：', value: `${data.heat}%` },
    { label: '状态：', value: NftState[data.state] },
    { label: '价格：', value: data.price },
    { label: '总数：', value: data.total },
    { label: '销售数量：', value: data.sale },
    { label: '交易HASH：', value: data.transaction_hash },
    { label: '作品热度：', value: data.heat },
    { label: '作品描述：', value: data.desc },
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

export default withServers(getNft, (props: IProps) => props.id)(Detail) as React.FC<IProps>;
