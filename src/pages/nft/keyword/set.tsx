/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormDigit, ProFormText } from '@ant-design/pro-form';

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

  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} {...formItemLayout}>
      <ProFormText name="name" label="关键词" required={true} rules={[{ required: true }]} />
      <ProFormDigit
        name="weight"
        label="权重"
        placeholder="请输入权重1-100"
        fieldProps={{ precision: 0 }}
        min={0}
        max={100}
        required={true}
        rules={[{ required: true }, { type: 'number' }]}
      />
    </Form>
  );
});

export default Set;
