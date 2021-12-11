/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { Button, Form, Upload } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { IAccessListRes, IAddAccountReq } from '@/services/Account';
import { getAccount } from '@/services/Account';
import { UploadOutlined } from '@ant-design/icons';

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
const Set = forwardRef(function (props: IProps & PageService<IAccessListRes>, ref) {
  const initialValues: IAddAccountReq = {
    username: '',
    password: '',
    avatar: '',
  };
  if (props.id && props.data) {
    const { data } = props.data;
    initialValues.username = data.username;
    initialValues.password = '********';
    initialValues.avatar = data.avatar;
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
      <Form.Item label={'用户图像'}>
        <Upload>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(
  getAccount,
  (props: IProps) => props.id,
)(Set) as React.FC<IProps>;
