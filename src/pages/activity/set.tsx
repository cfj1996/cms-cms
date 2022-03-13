/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormDateTimeRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { getNftList } from '@/services/nft/nfts';
import type { Activity } from '@/services/activity';
import moment from 'moment';

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 16 },
  },
};

const Set = forwardRef(function (props: { data?: Activity }, ref) {
  const [form] = Form.useForm();
  const initialValues = props.data
    ? {
        title: props.data.title,
        content: props.data.content,
        number: props.data.number,
        list_title: props.data.list_title,
        associate: props.data.associate,
        images: props.data.images,
        time: [moment(props.data.start_time), moment(props.data.end_time)],
      }
    : undefined;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} initialValues={initialValues} {...formItemLayout}>
      <ProFormText name="title" label="活动标题" required={true} rules={[{ required: true }]} />
      <ProFormText name="content" label="活动内容" required={true} rules={[{ required: true }]} />
      <ProFormText name="number" label="活动编号" required={true} rules={[{ required: true }]} />
      <ProFormDateTimeRangePicker
        label={'起至时间'}
        name={'time'}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{
          disabledDate: (d) => !d || d.isBefore(moment().startOf('day')),
        }}
      />
      <ProFormText
        name="list_title"
        label="榜单标题"
        required={true}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        mode="multiple"
        request={() =>
          getNftList({
            current: 1,
            pageSize: 99999,
            state: 'onsale',
          }).then((res) =>
            res.data.map((item) => ({
              value: item.id,
              label: `${item.name}(${item.is_can_sale ? '可售' : '不可售'})`,
            })),
          )
        }
        name="associate"
        label="关联藏品库"
        required={true}
        rules={[{ required: true }]}
      />
      <Form.Item name="images" label={'活动图片'} required={true} rules={[{ required: true }]}>
        <Upload multiple={true} />
      </Form.Item>
    </Form>
  );
});
export const EditSet = Set as FC<{ data: Activity }>;
export const AddSet = Set as unknown as FC;
