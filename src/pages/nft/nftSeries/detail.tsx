/**
 * @name: detail
 * @user: cfj
 * @date: 2021/12/12 2:39
 */
import { Col, Progress, Row } from 'antd';
import TypographyItem from '@/components/TypographyItem';
import type { INft } from '@/services/nft/nfts';
import { NftState, NftType, purchaseEnum } from '@/services/nft/nfts';
import { dateFormat } from '@/utils';
import TableImgCall from '@/components/tableImgCall';
import { css } from '@emotion/css';

interface IProps {
  data: INft;
}

const containerBox = css({
  height: '65VH',
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
console.log('imgBox', imgBox);

const Detail = function (props: IProps) {
  const { data } = props;
  const list = [
    { label: '名称：', value: data.name },
    { label: '标题：', value: data.title },
    { label: '类别名称：', value: data.category_name },
    { label: '作品id：', value: data.token_id },
    { label: '作品类型：', value: NftType[data.type] },
    {
      label: '图片：',
      value: (
        <div className={divBox}>
          {data.images.map((i) => (
            <div key={i} className={imgBox}>
              <TableImgCall
                images={data.images.map((img) => ({
                  alt: data.name,
                  src: img,
                }))}
                alt={data.name}
                src={i}
              />
            </div>
          ))}
        </div>
      ),
    },
    { label: '状态：', value: NftState[data.state] },
    { label: '价格：', value: data.price },
    { label: '总数：', value: data.total },
    { label: '限购：', value: purchaseEnum.find((i) => i.value === data.is_purchase)?.label },
    { label: '限购数量：', value: String(data.limit_number) },
    { label: '销售数量：', value: String(data.sale) },
    { label: '交易HASH：', value: data.transaction_hash },
    { label: '作品热度：', value: <Progress percent={data.heat} /> },
    { label: '作品描述：', value: data.desc },
    { label: '售卖时间：', value: dateFormat(data.start_time) + ' ~ ' + dateFormat(data.end_time) },
    { label: '创建时间：', value: dateFormat(data.created_at) },
    { label: '更新时间：', value: dateFormat(data.updated_at) },
  ];
  return (
    <div className={containerBox}>
      <Row gutter={24}>
        {list.map((i, key) => (
          <Col key={key} span={24}>
            <TypographyItem label={i.label} value={i.value} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default Detail;
