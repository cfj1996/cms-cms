/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import {
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
import { AssetsType, canSaleEnum, getNft, NftLevel, nftTypeEnum } from '@/services/nft/nfts';
import Upload from '@/components/upload';
import Quill from '@/components/Quill';
import RangePicker from '@/components/RangePicker';

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
        category_id: data.category_id,
        type: data.type,
        name: data.name,
        title: data.title,
        desc: data.desc,
        material_type: data.material_type,
        images: data.images,
        token_id: data.token_id,
        total: data.total,
        available_number: Number(data.available_number) || 0,
        is_can_sale: Boolean(data.is_can_sale),
        price: data.price,
        level: data.level,
        start_time: data.start_time,
        end_time: data.end_time,
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

      <RangePicker
        name={['start_time', 'end_time']}
        label={'售卖起止时间'}
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        label={'藏品等级'}
        name={'level'}
        required={true}
        rules={[{ required: true }]}
        valueEnum={NftLevel}
      />
      <ProFormSelect
        label={'资源类型'}
        name={'material_type'}
        required={true}
        rules={[{ required: true }]}
        valueEnum={AssetsType}
      />
      <Form.Item
        noStyle
        shouldUpdate={(prevValues: any, nextValues: any) =>
          prevValues.material_type !== nextValues.material_type
        }
      >
        {({ getFieldValue }) => (
          <Form.Item
            hidden={!getFieldValue('material_type')}
            name="images"
            label={'上传资源'}
            required={true}
            rules={[{ required: true }]}
          >
            <Upload multiple={true} disabled={disabled} type={getFieldValue('material_type')} />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item name="desc" label="藏品描述" required={true} rules={[{ required: true }]}>
        <Quill />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(getNft, (props: IProps) => props.id)(Set) as React.FC<IProps>;
