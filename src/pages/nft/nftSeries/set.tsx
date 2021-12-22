/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  ProFormDigit,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Form } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import { getNftTypeList } from '@/services/nft/nftType';
import type { IAddNft, INft } from '@/services/nft/nfts';
import { getNft } from '@/services/nft/nfts';
import type { UploadFile } from 'antd/es/upload/interface';
import type { Resolve } from '@/services';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};
interface IProps {
  id?: string;
}
const Set = forwardRef(function (props: IProps & PageService<INft>, ref) {
  const { id } = props;
  const disabled = !!id;
  let initialImages: UploadFile[] = [];
  const [form] = Form.useForm();
  const initialValues: Omit<IAddNft, 'transaction_hash'> = {
    category_id: '',
    name: '',
    title: '',
    desc: '',
    images: [],
    token_id: undefined,
    total: undefined,
    price: undefined,
  };
  if (id && props.data?.data) {
    const data = props.data?.data;
    initialValues.category_id = data.category_id;
    initialValues.name = data.name;
    initialValues.title = data.title;
    initialValues.desc = data.title;
    initialImages = data.images.map((i) => ({
      uid: i,
      name: i,
      status: 'success',
      url: i,
    }));
    initialValues.token_id = data.token_id;
    initialValues.total = data.total;
    initialValues.price = data.price;
  }
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  console.log('form');
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormSelect
        name={'category_id'}
        label={'nft分类'}
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
      <ProFormText
        name="name"
        label="nft名称"
        placeholder="请输入名称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="title"
        label="nft标题"
        placeholder="请输入标题"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormText
        disabled={disabled}
        name="token_id"
        label="nft id"
        placeholder="请输 id"
        required={true}
        normalize={(value) => (isNaN(value) ? value : Number(value))}
        rules={[{ required: true }, { type: 'number' }]}
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
      <ProFormUploadDragger
        disabled={disabled}
        initialValue={initialImages}
        fieldProps={{
          multiple: true,
          defaultFileList: initialImages,
        }}
        normalize={(value: UploadFile<Resolve<string>>[]) => {
          return value.map((item) => ({
            url: item.response?.data,
            ...item,
          }));
        }}
        name={'fileSource'}
        required={true}
        rules={[{ required: true }]}
        label="源文件"
        action={'http://localhost:3000/upload/file'}
      />
      <ProFormTextArea name="desc" label="NFT描述" placeholder="请输入描述" />
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(getNft, (props: IProps) => props.id)(Set) as React.FC<IProps>;
