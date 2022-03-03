/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import Upload from '@/components/upload';
import RangePicker from '@/components/RangePicker';
import type { Synthesis } from '@/services/nft/synthesis';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};

interface IProps {
  id: string;
  data: Synthesis;
}

const Set = forwardRef(function (props: IProps | undefined, ref) {
  const [form] = Form.useForm();

  const initialValue =
    props && props?.id
      ? {
          name: props.data.name,
          title: props.data.title,
          introduction: props.data.introduction,
          images: props.data.images,
          start_time: props.data.start_time,
          end_time: props.data.end_time,
        }
      : undefined;

  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValue} {...formItemLayout}>
      <ProFormText name="name" label="名称" required={true} rules={[{ required: true }]} />
      <ProFormText name="title" label="标题" required={true} rules={[{ required: true }]} />
      <ProFormTextArea
        name="introduction"
        label="介绍"
        required={true}
        rules={[{ required: true }]}
      />
      <RangePicker
        name={['start_time', 'end_time']}
        label={'始止时间'}
        required={true}
        rules={[{ required: true }]}
      />
      <Form.Item label={'图片'} name={'images'} required={true} rules={[{ required: true }]}>
        <Upload multiple={true} />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set as unknown as FC;
export const EditSet = Set as FC<IProps>;
