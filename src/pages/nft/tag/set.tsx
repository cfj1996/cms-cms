/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */

import { forwardRef, useImperativeHandle } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import { formItemLayout } from '@/components/Dialog';

export const Set = forwardRef(function (props, ref) {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} {...formItemLayout}>
      <ProFormText
        name="tag_name"
        label="名称"
        placeholder="请输入标题"
        required={true}
        rules={[{ required: true }]}
      />
    </Form>
  );
});
