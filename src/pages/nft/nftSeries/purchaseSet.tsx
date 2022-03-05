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
import { formItemLayout } from '@/components/Dialog';

const PurchaseSet = forwardRef(function (props: Purchase, ref) {
  const { is_purchase, limit_number, interval_time } = props;
  const [form] = Form.useForm();

  const initialValues = {
    is_purchase,
    limit_number,
    interval_time,
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
      <Form.Item
        noStyle={true}
        shouldUpdate={(prevValues: any, curValues: any) =>
          prevValues.is_purchase !== curValues.is_purchase
        }
      >
        {({ getFieldValue }) => (
          <ProFormDigit
            name="interval_time"
            label="间隔时间"
            tooltip="间隔多少秒后才能再次购买"
            required={Boolean(getFieldValue('is_purchase'))}
            placeholder="请输入间隔时间, 以秒为单位"
            min={1}
            fieldProps={{ precision: 0 }}
            addonAfter={'秒'}
            rules={[{ required: Boolean(getFieldValue('is_purchase')) }]}
          />
        )}
      </Form.Item>
    </Form>
  );
});

export default PurchaseSet;
