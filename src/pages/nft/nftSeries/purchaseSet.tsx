/**
 * @name: purchaseSet
 * @user: cfj
 * @date: 2022/2/7 22:07
 */
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormDigit, ProFormRadio } from '@ant-design/pro-form';
import type { Purchase } from '@/services/nft/nfts';
import { purchaseEnum } from '@/services/nft/nfts';

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};
const PurchaseSet = forwardRef(function (props: Purchase, ref) {
  const { is_purchase, limit_number } = props;
  const [form] = Form.useForm();

  const initialValues = {
    is_purchase,
    limit_number,
  };
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormRadio.Group name={'is_purchase'} label={'限购'} options={purchaseEnum} />
      <Form.Item
        noStyle={true}
        shouldUpdate={(prevValues: any, curValues: any) =>
          prevValues.is_purchase !== curValues.is_purchase
        }
      >
        {({ getFieldValue }) => (
          <ProFormDigit
            name="limit_number"
            label="限购数量"
            required={Boolean(getFieldValue('is_purchase'))}
            placeholder="请输入限购数量"
            min={1}
            fieldProps={{ precision: 0 }}
            rules={[{ required: Boolean(getFieldValue('is_purchase')) }]}
          />
        )}
      </Form.Item>
    </Form>
  );
});

export default PurchaseSet;
