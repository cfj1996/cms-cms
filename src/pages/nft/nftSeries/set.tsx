/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormMoney,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Form } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import { getNftTypeList } from '@/services/nft/nftType';
import type { INft } from '@/services/nft/nfts';
import { canSaleEnum, getNft, nftTypeEnum } from '@/services/nft/nfts';
import Upload from '@/components/upload';
import moment from 'moment';
import Quill from '@/components/Quill';
import { getIssuerList } from '@/services/nft/Issuer';

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};

interface IProps {
  id?: string;
}

const Set = forwardRef(function (props: IProps & PageService<INft>, ref) {
  const { id } = props;
  const disabled = !!id;
  const [form] = Form.useForm();
  const data = props.data?.data || ({} as INft);
  const initialValues = props.data?.data
    ? {
        issuer_id: data.issuer_id,
        category_id: data.category_id,
        type: data.type,
        name: data.name,
        title: data.title,
        desc: data.desc,
        images: data.images,
        token_id: data.token_id,
        total: data.total,
        available_number: Number(data.available_number) || 0,
        is_can_sale: Boolean(data.is_can_sale),
        price: data.price,
        time: [moment(data.start_time), moment(data.end_time)],
      }
    : undefined;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormSelect
        name={'issuer_id'}
        label={'发行方'}
        showSearch={true}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{
          filterOption: false,
        }}
        request={() => {
          return getIssuerList({ current: 1, pageSize: 100000, issuer_name: '' }).then((res) =>
            res.data.map((i) => ({ value: i.id, label: i.issuer_name })),
          );
        }}
      />
      <ProFormSelect
        name={'category_id'}
        label={'藏品系列'}
        showSearch={true}
        disabled={disabled}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{
          filterOption: false,
        }}
        request={() => {
          return getNftTypeList({ current: 1, pageSize: 100000, keywords: '' }).then((res) =>
            res.data.map((i) => ({ value: i.id, label: i.name })),
          );
        }}
      />
      <ProFormSelect
        name="type"
        label="藏品类型"
        disabled={disabled}
        placeholder="请选择藏品类型"
        required={true}
        rules={[{ required: true }]}
        valueEnum={nftTypeEnum}
      />
      <ProFormText
        name="name"
        label="藏品名称"
        placeholder="请输入藏品名称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="title"
        label="藏品标题"
        placeholder="请输入藏品标题"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormDigit
        disabled={disabled}
        name="total"
        label="总数"
        placeholder="请输入总数"
        fieldProps={{ precision: 0 }}
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormMoney
        name="price"
        label="单价"
        placeholder="请输入单价"
        min={0}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{ precision: 2 }}
      />
      <ProFormRadio.Group
        disabled={disabled}
        name={'is_can_sale'}
        label={'可售'}
        options={canSaleEnum}
        required={true}
        rules={[{ required: true }]}
      />
      <Form.Item
        noStyle={true}
        shouldUpdate={(prevValues: any, curValues: any) => prevValues.total !== curValues.total}
      >
        {({ getFieldValue }) => (
          <ProFormDigit
            name="available_number"
            label="可售数量"
            placeholder="可售数量"
            fieldProps={{ precision: 0 }}
            required={true}
            max={getFieldValue('total')}
            rules={[{ required: true }]}
          />
        )}
      </Form.Item>

      <ProFormDateTimeRangePicker
        name="time"
        label="售卖起止时间"
        required={true}
        fieldProps={{
          disabledDate: (d) => !d || d.isBefore(moment().startOf('day')),
        }}
        rules={[{ required: true }]}
      />
      <Form.Item name="images" label={'藏品源图片'} required={true} rules={[{ required: true }]}>
        <Upload multiple={true} disabled={disabled} />
      </Form.Item>
      <Form.Item name="desc" label="藏品描述" required={true} rules={[{ required: true }]}>
        <Quill />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(getNft, (props: IProps) => props.id)(Set) as React.FC<IProps>;
