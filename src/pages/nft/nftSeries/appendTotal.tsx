import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import { ProFormDigit } from '@ant-design/pro-form';

/**
 * @name: addTotal
 * @user: cfj
 * @date: 2022/2/20 18:02
 */
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};

interface IProps {
  append_total: number;
}

const AppendTotal = forwardRef(function (props: IProps, ref) {
  const [form] = Form.useForm();
  const { append_total } = props;
  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));
  return (
    <Form form={form} {...formItemLayout}>
      <Form.Item label={'现有总数'}>{append_total}</Form.Item>
      <ProFormDigit
        name="append_total"
        label="总数"
        placeholder="请输入要追加的总数"
        fieldProps={{ precision: 0 }}
        required={true}
        rules={[{ required: true }]}
      />
    </Form>
  );
});

export default AppendTotal;
