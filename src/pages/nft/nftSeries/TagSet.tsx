/**
 * @name: set
 * @user: cfj
 * @date: 2021/12/11 22:30
 */

import { forwardRef, useImperativeHandle } from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
import { Form } from 'antd';
import { formItemLayout } from '@/components/Dialog';
import { getTags } from '@/services/nft/tag';

export const TagSet = forwardRef(function (props, ref) {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} {...formItemLayout}>
      <ProFormSelect
        name={'tag_id'}
        label={'标签'}
        showSearch={true}
        required={true}
        rules={[{ required: true }]}
        fieldProps={{
          filterOption: false,
        }}
        request={() => {
          return getTags({ current: 1, pageSize: 100000, tag_name: '' }).then((res) =>
            res.data.map((i) => ({ value: i.id, label: i.tag_name })),
          );
        }}
      />
    </Form>
  );
});
