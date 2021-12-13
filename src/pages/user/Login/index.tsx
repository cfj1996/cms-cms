import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import type { ILoginReq } from '@/services/user/login';
import { login } from '@/services/user/login';

import styles from './index.less';
import { setToken } from '@/utils';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: ILoginReq) => {
    try {
      // 登录
      const data = await login(values);
      console.log('data', data);
      if (data.success) {
        setToken(data.data.token);
        message.success('登录成功');
        await fetchUserInfo();
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      setLoginError(data.message!);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={'Ant Design'}
          initialValues={{
            autoLogin: true,
            email: 'setup@tiancai.pro',
            password: 'tiancai001',
          }}
          onFinish={async (values: ILoginReq) => {
            await handleSubmit({
              email: values.email,
              password: values.password,
            });
          }}
        >
          {loginError && <LoginMessage content={'账户或密码错误(admin/ant.design)'} />}
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'用户名: admin'}
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'密码: 123456'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
