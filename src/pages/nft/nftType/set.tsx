/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */

import React, { forwardRef, useImperativeHandle } from 'react';
import { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form } from 'antd';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { INftType } from '@/services/nft/nftType';
import { getNftType } from '@/services/nft/nftType';
import type { Resolve } from '@/services';
import { getIssuerList } from '@/services/nft/Issuer';

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

const Set = forwardRef(function (props: IProps & PageService<Resolve<INftType>>, ref) {
  const [form] = Form.useForm();
  const data = props.data?.data?.data as INftType;
  const initialValues =
    props.id && data
      ? {
          issuer_id: data.issuer_id,
          name: data.name,
          symbol: data.symbol,
          desc: data.desc,
        }
      : undefined;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormSelect
        name={'issuer_id'}
        label={'发行方'}
        showSearch={true}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{
          filterOption: false,
        }}
        request={() => {
          return getIssuerList({ current: 1, pageSize: 100000, issuer_name: '' }).then((res) =>
            res.data.map((i) => ({ value: i.id, label: i.issuer_name })),
          );
        }}
      />
      <ProFormText
        name="name"
        label="标题"
        placeholder="请输入标题"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="symbol"
        label="简称"
        placeholder="请输入简称"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="desc"
        label="描述"
        placeholder="请输入描述"
        required={true}
        rules={[{ required: true }]}
      />
    </Form>
  );
});

export const AddSet = Set;
export const EditSet = withServers(
  getNftType,
  (props: IProps) => props.id,
)(Set) as React.FC<IProps>;
