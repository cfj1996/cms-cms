/**
 * @name: rePassword
 * @user: cfj
 * @date: 2022/1/24 16:10
 */
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormText } from '@ant-design/pro-form';

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};
const RePassword = forwardRef(function (props: { id: string }, ref) {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={{ staff_id: props.id }} {...formItemLayout}>
      <Form.Item name="staff_id" noStyle={true} />
      <ProFormText.Password
        name="password"
        label="新密码"
        placeholder="请输入密码"
        required={true}
        rules={[{ required: true, min: 6 }]}
      />
      <ProFormText.Password
        label="确定新密码"
        placeholder="请输入密码"
        required={true}
        rules={[
          { required: true },
          {
            validator: (rule, value) => {
              const password = form.getFieldValue('password');
              console.log(password);
              console.log(value);

              if (password && password === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次密码不一致');
            },
          },
        ]}
      />
    </Form>
  );
});

export default RePassword;
