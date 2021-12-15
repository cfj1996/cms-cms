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
const Set = forwardRef(function (props: IProps & PageService<INftType>, ref) {
  const [form] = Form.useForm();
  const initialValues: IAddNftType = {
    category_title: '',
    category_desc: '',
  };
  if (props.id && props.data) {
    const { data } = props.data;
    initialValues.category_title = data.category_title;
    initialValues.category_desc = data.category_desc;
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
      <ProFormTextArea name="categoryDesc" label="描述" placeholder="请输入描述" />
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(
  getNftType,
  (props: IProps) => props.id,
)(Set) as React.FC<IProps>;
