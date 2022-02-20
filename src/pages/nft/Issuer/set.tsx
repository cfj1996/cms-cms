/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */

import React, { forwardRef, useImperativeHandle } from 'react';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form } from 'antd';
import type { IEditIssuer } from '@/services/nft/Issuer';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};

const Set = forwardRef(function (props: any, ref) {
  const [form] = Form.useForm();
  const { issuer_id, issuer_name, issuer_desc } = props;
  const initialValues = issuer_id
    ? {
        issuer_name,
        issuer_desc,
      }
    : undefined;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText
        name="issuer_name"
        label="名称"
        placeholder="请输入名称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="issuer_desc"
        label="描述"
        placeholder="请输入描述"
        required={true}
        rules={[{ required: true }]}
      />
    </Form>
  );
});

export const AddSet = Set as React.FC;
export const EditSet = Set as React.FC<IEditIssuer>;
