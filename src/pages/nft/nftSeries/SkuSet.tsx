/**
 * @name: SkuSet
 * @user: cfj
 * @date: 2022/1/16 17:17
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormDigit, ProFormMoney, ProFormText } from '@ant-design/pro-form';
import Upload from '@/components/upload';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};

export interface IProps {
  id?: string;
  total: number;
}

const SkuSet = forwardRef(function (props: IProps, ref) {
  const disabled = !!props.id;
  const total = props.total;
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} {...formItemLayout}>
      <ProFormText
        disabled={disabled}
        name="attribute"
        label="sku属性"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormDigit
        disabled={disabled}
        name="amount"
        label="sku数量"
        placeholder={`请输入数量, 最大数量${total}`}
        max={total}
        fieldProps={{ precision: 0 }}
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormMoney
        name="price"
        label="sku价格"
        placeholder="请输入价格"
        min={0}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{ precision: 2 }}
      />
      <Form.Item name="images" label={'sku图片'} required={true} rules={[{ required: true }]}>
        <Upload multiple={true} disabled={disabled} />
      </Form.Item>
    </Form>
  );
});

export const AddSkuSet = SkuSet;
export const EditSkuSet = SkuSet as FC<IProps>;
