/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import Upload from '@/components/upload';
import type { Banner } from '@/services/banner';
import { LinkType } from '@/services/banner';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};
const Set = forwardRef(function (props: { data?: Banner }, ref) {
  const [form] = Form.useForm();
  const initialValues = props.data
    ? {
        title: props.data.title,
        number: props.data.number,
        link_type: props.data.link_type,
        link: props.data.link,
        image: [props.data.image],
      }
    : undefined;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText name="title" label="标题" required={true} rules={[{ required: true }]} />
      <ProFormText name="number" label="编号" required={true} rules={[{ required: true }]} />
      <ProFormRadio.Group
        name="link_type"
        label="链接类型"
        rules={[{ required: true }]}
        valueEnum={LinkType}
      />
      <ProFormText name="link" label="链接地址" required={true} rules={[{ required: true }]} />

      <Form.Item name="image" label={'banner图'} required={true} rules={[{ required: true }]}>
        <Upload maxCount={1} multiple={false} />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set as FC;
export const EditSet = Set as FC<{ data: Banner }>;
