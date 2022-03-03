/**
 * @name: RuleSet
 * @user: cfj
 * @date: 2022/3/3 21:00
 */
import { Form } from 'antd';
import type { SynthesisRule } from '@/services/nft/synthesis';
import { SyntheticMethodEnum } from '@/services/nft/synthesis';
import { formItemLayout } from '@/components/Dialog';
import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { getNftList } from '@/services/nft/nfts';
import { forwardRef, useImperativeHandle } from 'react';

interface IProps {
  id?: string;
  data?: SynthesisRule;
}

const RuleSet = forwardRef(function (props: IProps, ref) {
  const [form] = Form.useForm();
  const data = props.data;
  const disabled = !!props.id;
  const initialValue = props.id
    ? {
        synthetic_method: data?.synthetic_method,
        base_nft_id: data?.base_nft_id,
        result_nft_id: data?.result_nft_id,
        play_instruction: data?.play_instruction,
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
        name={'synthetic_method'}
        label="成长方式"
        disabled={disabled}
        valueEnum={SyntheticMethodEnum}
        required={true}
        rules={[{ required: true }]}
      />
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, nextValues) =>
          prevValues.synthetic_method !== nextValues.synthetic_method
        }
      >
        {({ getFieldValue }) =>
          getFieldValue('synthetic_method') === 'cultivate' && (
            <ProFormSelect
              label={'基础款藏品'}
              name={'base_nft_id'}
              disabled={disabled}
              required={true}
              rules={[{ required: true }]}
              request={() => {
                return getNftList({
                  pageSize: 9999,
                  current: 1,
                  state: 'onsale',
                  is_can_sale: false,
                }).then((res) =>
                  res.data.map((i) => ({
                    value: i.id,
                    label: i.name,
                    disabled: i.is_can_sale,
                  })),
                );
              }}
            />
          )
        }
      </Form.Item>
      <ProFormSelect
        label={'合成结果'}
        disabled={disabled}
        required={true}
        rules={[{ required: true }]}
        name={'result_nft_id'}
        request={() => {
          return getNftList({
            pageSize: 9999,
            current: 1,
            state: 'onsale',
            is_can_sale: false,
          }).then((res) =>
            res.data.map((i) => ({
              value: i.id,
              label: i.name,
              disabled: i.is_can_sale,
            })),
          );
        }}
      />
      <ProFormTextArea
        name={'play_instruction'}
        label={'规则描述'}
        required={true}
        rules={[{ required: true }]}
      />
    </Form>
  );
});

export default RuleSet;
