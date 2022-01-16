/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Form } from 'antd';
import { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import Upload from '@/components/upload';
import type { Banner } from '@/services/banner';
import { LinkType } from '@/services/banner';
import { getActivityPage } from '@/services/activity';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};
const Set = forwardRef(function (props: { data?: Banner }, ref) {
  const [form] = Form.useForm();
  const [linkType, setLinkType] = useState('outlink');
  const initialValues = props.data
    ? {
        title: props.data.title,
        number: props.data.number,
        link_type: props.data.link_type,
        link: props.data.link,
        image: [props.data.image],
      }
    : { link_type: linkType };
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  console.log('link_type', form.getFieldValue('link_type'));
  return (
    <Form
      form={form}
      initialValues={initialValues}
      {...formItemLayout}
      onValuesChange={(changedFields) => {
        if (changedFields.link_type) {
          setLinkType(changedFields.link_type);
        }
      }}
    >
      <ProFormText name="title" label="标题" required={true} rules={[{ required: true }]} />
      <ProFormText name="number" label="编号" required={true} rules={[{ required: true }]} />
      <ProFormRadio.Group
        name="link_type"
        label="链接类型"
        rules={[{ required: true }]}
        valueEnum={LinkType}
      />
      {linkType === 'outlink' ? (
        <ProFormText name="link" label="外部链接" required={true} rules={[{ required: true }]} />
      ) : (
        <ProFormSelect
          name="link"
          label="活动地址"
          required={true}
          rules={[{ required: true }]}
          request={() =>
            getActivityPage({
              current: 1,
              pageSize: 10000,
              state: 'onsale',
            }).then((res) => res.data.map((item) => ({ value: item.id, label: item.title })))
          }
        />
      )}

      <Form.Item name="image" label={'banner图'} required={true} rules={[{ required: true }]}>
        <Upload maxCount={1} multiple={false} />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set as FC;
export const EditSet = Set as FC<{ data: Banner }>;
