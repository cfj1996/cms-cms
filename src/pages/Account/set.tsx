/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import { withServers } from '@/hoc/withServers';
import { getAccount, roleEnum } from '@/services/Account';

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

const Set = forwardRef(function (props: IProps, ref) {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} {...formItemLayout}>
      <ProFormText
        name="full_name"
        label="员工名字"
        placeholder="请输入名字"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="role"
        label="角色"
        required={true}
        valueEnum={roleEnum}
        fieldProps={{
          placeholder: '请选择角色',
        }}
        rules={[{ required: true }]}
      />
      <ProFormText
        name={'email'}
        label="注册邮箱"
        placeholder={'请输入邮箱号'}
        required={true}
        rules={[
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱号',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        placeholder="请输入密码"
        required={true}
        rules={[{ required: true, min: 6 }]}
      />
      <ProFormText.Password
        label="确定密码"
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

export const AddSet = Set;
export const EditSet = withServers(
  getAccount,
  (props: IProps) => props.id,
)(Set) as React.FC<IProps>;
