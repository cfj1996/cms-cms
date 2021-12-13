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
import { getAllNftType } from '@/services/nft/nftType';
// import { upFile } from '@/services/user/login';
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
  let defaultFileList;
  const [form] = Form.useForm();
  const initialValues = {
    categoryId: '',
    name: '',
    desc: '',
    price: undefined,
    fileSource: undefined,
    serialNumber: '',
    total: undefined,
  } as unknown as IAddNft;
  if (id && props.data) {
    const { data } = props.data;
    initialValues.categoryId = data.categoryId;
    initialValues.name = data.name;
    initialValues.desc = data.desc;
    initialValues.serialNumber = data.serialNumber;
    initialValues.price = Number(data.price);
    initialValues.total = Number(data.total);
    if (data.files?.length > 0) {
      defaultFileList = data.files.map((i) => ({
        uid: i,
        name: i,
        percent: 100,
        status: 'success',
        url: i,
      }));
      initialValues.fileSource = defaultFileList;
    }
    console.log(data);
  }
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormSelect
        name={'categoryId'}
        label={'nft分类'}
        required={true}
        rules={[{ required: true }]}
        request={() =>
          getAllNftType().then((res) =>
            res.data.map((i) => ({ value: i.id, label: i.categoryTitle })),
          )
        }
      />
      <ProFormText
        disabled={!!id}
        name="serialNumber"
        label="系列ID"
        placeholder="请输入系列ID"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="name"
        label="nft名称"
        placeholder="请输入名称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormDigit
        disabled={!!id}
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
        locale={'zh-CN'}
        placeholder="请输入单价"
        min={0}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{ precision: 2 }}
      />
      <ProFormUploadDragger
        fieldProps={{
          multiple: true,
          defaultFileList: undefined,
        }}
        normalize={(value: UploadFile<Resolve<string>>[]) => {
          return value.map((item) => ({
            url: item.response?.data,
            ...item,
          }));
        }}
        disabled={!!id}
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
