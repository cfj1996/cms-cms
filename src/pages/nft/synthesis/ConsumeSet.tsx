/**
 * @name: RuleSet
 * @user: cfj
 * @date: 2022/3/3 21:00
 */
import { Form } from 'antd';
import type { Consumerist } from '@/services/nft/synthesis';
import { formItemLayout } from '@/components/Dialog';
import { ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { getNftList } from '@/services/nft/nfts';
import { forwardRef, useImperativeHandle } from 'react';

interface IProps {
  id?: string;
  data?: Consumerist;
}

const RuleSet = forwardRef(function (props: IProps, ref) {
  const [form] = Form.useForm();
  const data = props.data;
  const disabled = !!props.id;
  const initialValue = props.id
    ? {
        nft_id: data?.nft_id,
        amount: data?.amount,
      }
    : undefined;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValue} {...formItemLayout}>
      <ProFormSelect
        label={'消耗藏品'}
        disabled={disabled}
        required={true}
        rules={[{ required: true }]}
        name={'nft_id'}
        request={() => {
          return getNftList({
            pageSize: 9999,
            current: 1,
            state: 'onsale',
          }).then((res) =>
            res.data.map((item) => ({
              value: item.id,
              label: `${item.name}(${item.is_can_sale ? '可售' : '不可售'})`,
            })),
          );
        }}
      />
      <ProFormDigit
        name="amount"
        label="数量"
        placeholder="请输入数量"
        min={1}
        fieldProps={{ precision: 0 }}
        rules={[{ required: true }]}
      />
    </Form>
  );
});

export default RuleSet;
