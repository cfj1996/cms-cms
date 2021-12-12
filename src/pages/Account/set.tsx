/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { IAccess } from '@/services/Account';
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
const Set = forwardRef(function (props: IProps & PageService<IAccess>, ref) {
  const initialValues = {
    account: '',
    password: '',
    secondPassword: '',
    role: '',
    isDisable: false,
  };
  if (props.id && props.data) {
    const { data } = props.data;
    initialValues.account = data.account;
    initialValues.password = '';
    initialValues.secondPassword = '';
    initialValues.role = data.role;
    initialValues.isDisable = data.isDisable;
  }
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText
        name="username"
        label="用户名"
        placeholder="请输入名称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="role"
        label="角色"
        placeholder="请选择角色"
        required={true}
        options={roleEnum}
        rules={[{ required: true }]}
      />
      <ProFormSwitch
        name="isDisable"
        label="是否关闭"
        required={true}
        rules={[{ required: true }]}
      />
      {!props.id && (
        <>
          <ProFormText.Password
            name="password"
            label="密码"
            placeholder="请输入密码"
            required={true}
            rules={[{ required: true }]}
          />
          <ProFormText.Password
            name="secondPassword"
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
        </>
      )}
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(
  getAccount,
  (props: IProps) => props.id,
)(Set) as React.FC<IProps>;
