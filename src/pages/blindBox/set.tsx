/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormDigit, ProFormMoney, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import Upload from '@/components/upload';
import type { PageService } from '@/hoc/withServers';
import { withServers } from '@/hoc/withServers';
import type { BlindBox } from '@/services/blindBox';
import { getBlindBox } from '@/services/blindBox';

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
}

const Set = forwardRef(function (props: IProps & PageService<BlindBox>, ref) {
  const [form] = Form.useForm();
  const initialValues =
    props.id && props.data?.data
      ? {
          title: props.data.data.title,
          blind_name: props.data.data.blind_name,
          price: props.data.data.price,
          amount: props.data.data.amount,
          play_instruction: props.data.data.play_instruction,
          images: props.data.data.images,
        }
      : { link_type: 'outlink' };
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText name="title" label="盲盒标题" required={true} rules={[{ required: true }]} />
      <ProFormText
        name="blind_name"
        label="盲盒名字"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormMoney
        name="price"
        label="盲盒价格"
        min={0}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{ precision: 2 }}
      />
      <ProFormDigit
        name="amount"
        label="盲盒数量"
        min={0}
        fieldProps={{ precision: 0 }}
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="play_instruction"
        label="玩法介绍"
        required={true}
        rules={[{ required: true }]}
      />
      <Form.Item name="images" label={'图片'} required={true} rules={[{ required: true }]}>
        <Upload multiple={true} />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set as unknown as FC;
export const EditSet = withServers(getBlindBox, (props: IProps) => props.id)(Set) as FC<IProps>;
