/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */

import React, { forwardRef, useImperativeHandle } from 'react';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { IAddNftType, INftType } from '@/services/nft/nftType';
import { getNftType } from '@/services/nft/nftType';
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
const Set = forwardRef(function (props: IProps & PageService<Resolve<INftType>>, ref) {
  const [form] = Form.useForm();

  const initialValues: IAddNftType = {
    name: '',
    symbol: '',
    desc: '',
  };
  if (props.id && props.data) {
    const {
      data: { data },
    } = props.data;
    initialValues.name = data.name;
    initialValues.symbol = data.symbol;
    initialValues.desc = data.desc;
  }
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText
        name="categoryTitle"
        label="标题"
        placeholder="请输入标题"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="symbol"
        label="简称"
        placeholder="请输入简称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormTextArea name="desc" label="描述" placeholder="请输入描述" />
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(
  getNftType,
  (props: IProps) => props.id,
)(Set) as React.FC<IProps>;
