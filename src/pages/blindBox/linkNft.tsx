import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { formItemLayout } from '@/components/Dialog';
import { ProFormDigit, ProFormMoney, ProFormSelect } from '@ant-design/pro-form';
import { getNftList } from '@/services/nft/nfts';
import type { BlindLinkNfts } from '@/services/blindBox';
import type { BlindBox } from '@/services/blindBox';

/**
 * @name: linkNft
 * @user: cfj
 * @date: 2022/2/23 22:29
 */
interface IProps {
  id: string;
  view: BlindBox;
  item?: BlindLinkNfts;
}

const LinkNft = forwardRef(function (props: IProps, ref) {
  const [form] = Form.useForm();
  const disabled = Boolean(props.item);
  const initialValues = props.item
    ? {
        nft_id: props.item.nft_id,
        amount: props.item.amount,
        weights: props.item.weights,
        probability: props.item.probability,
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
        disabled={disabled}
        name={'nft_id'}
        label={'藏品'}
        showSearch={true}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{
          filterOption: false,
          placeholder: '请选择藏品',
        }}
        request={() =>
          getNftList({ pageSize: 9999, current: 1 }).then((res) =>
            res.data.map((i) => ({
              value: i.id,
              label: i.name,
            })),
          )
        }
      />
      <ProFormDigit
        name="amount"
        label="数量"
        max={props.view.amount}
        placeholder="请输入数量"
        fieldProps={{ precision: 0 }}
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormMoney
        name="weights"
        label="权重"
        placeholder="请输入权重1-100"
        fieldProps={{ precision: 0 }}
        min={1}
        max={100}
        required={true}
        rules={[{ required: true }, { type: 'number' }]}
      />
      <ProFormMoney
        name="probability"
        label="中奖率"
        placeholder="请输入中奖率0-100"
        fieldProps={{ precision: 0 }}
        min={0}
        max={100}
        required={true}
        rules={[{ required: true }, { type: 'number' }]}
      />
    </Form>
  );
});

export default LinkNft;