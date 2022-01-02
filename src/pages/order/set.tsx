/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */

import { forwardRef, useImperativeHandle } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};

const Set = forwardRef(function (props, ref) {
  const [form] = Form.useForm();
  const initialValues: { track_number: string } = {
    track_number: '',
  };
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText
        name="track_number"
        label="快递单号"
        placeholder="请输入快递单号"
        required={true}
        rules={[{ required: true }]}
      />
    </Form>
  );
});

export const AddSet = Set;
