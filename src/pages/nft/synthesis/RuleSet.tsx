/**
 * @name: RuleSet
 * @user: cfj
 * @date: 2022/3/3 21:00
 */
import { Form, Radio, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { SynthesisRule } from '@/services/nft/synthesis';
import { syntheticMethod } from '@/services/nft/synthesis';
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
      <Form.Item
        name={'synthetic_method'}
        label="合成方式"
        required={true}
        rules={[{ required: true }]}
      >
        <Radio.Group disabled={disabled}>
          {syntheticMethod.map((item) => (
            <Radio value={item.value} key={item.value}>
              {item.label}
              <Tooltip title={item.help}>
                <QuestionCircleOutlined style={{ marginLeft: 5 }} size={12} />
              </Tooltip>
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
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
