/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/24 22:19
 */
import type { FC } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import Upload from '@/components/upload';
import type { Banner } from '@/services/banner';
import { LinkType } from '@/services/banner';
import { getActivityPage } from '@/services/activity';
import { getBlindBoxPage } from '@/services/blindBox';

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
  const initialValues = props.data
    ? {
        title: props.data.title,
        number: props.data.number,
        link_type: props.data.link_type,
        link: props.data.link || undefined,
        image: [props.data.image],
      }
    : { link_type: 'outlink' };
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
          form.setFieldsValue({ link: undefined });
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
      <Form.Item
        noStyle
        shouldUpdate={(prevValues: any, curValues: any) =>
          prevValues.link_type !== curValues.link_type
        }
      >
        {({ getFieldValue }) => {
          const value = getFieldValue('link_type');
          if (value === 'outlink') {
            return (
              <ProFormText
                name="link"
                label="外部链接"
                placeholder={'请输入跳转链接'}
                required={true}
                rules={[{ required: true }]}
              />
            );
          } else if (value === 'innerlink') {
            return (
              <ProFormSelect
                name="link"
                label="活动地址"
                placeholder={'请选择关联活动'}
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
            );
          } else {
            return (
              <ProFormSelect
                name="link"
                label="盲盒"
                placeholder={'请选择盲盒'}
                required={true}
                rules={[{ required: true }]}
                request={() =>
                  getBlindBoxPage({
                    current: 1,
                    pageSize: 10000,
                    state: 'onsale',
                  }).then((res) => res.data.map((item) => ({ value: item.id, label: item.title })))
                }
              />
            );
          }
        }}
      </Form.Item>
      <Form.Item name="image" label={'banner图'} required={true} rules={[{ required: true }]}>
        <Upload maxCount={1} multiple={false} />
      </Form.Item>
    </Form>
  );
});

export const AddSet = Set as FC;
export const EditSet = Set as FC<{ data: Banner }>;
