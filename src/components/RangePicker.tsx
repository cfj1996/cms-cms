/**
 * @name: RangePicker
 * @user: cfj
 * @date: 2022/3/3 0:01
 */
import type { FormItemProps } from 'antd';
import { DatePicker, Form } from 'antd';
import moment from 'moment';

type IProps = FormItemProps & { name: [string, string] };
const RangePicker = function (props: IProps) {
  const { name, ...other } = props;
  return (
    <>
      <Form.Item
        {...other}
        shouldUpdate={(prevValues: any, curValues: any) =>
          !curValues[name[0]] ||
          !curValues[name[1]] ||
          prevValues[name[0]] !== curValues[name[0]] ||
          prevValues[name[1]] !== curValues[name[1]] ||
          (curValues[name[0]] && curValues[name[1]])
        }
        rules={[
          {
            required: true,
            message: '请选择起止时间',
          },
          ({ getFieldValue }) => ({
            validator() {
              return getFieldValue(name[0]) && getFieldValue(name[1])
                ? Promise.resolve()
                : Promise.reject(new Error('请选择起止时间'));
            },
          }),
        ]}
      >
        {({ getFieldValue, setFields, getFieldsError }) => {
          const aaa = getFieldsError(name).map((i) => i.errors);
          const errors = [].concat(...(aaa as any)).length
            ? [
                <span key={'1'} style={{ color: 'red' }}>
                  请选择起止时间
                </span>,
              ]
            : [];
          const value: any = [];
          if (getFieldValue(name[0])) {
            value.push(moment(getFieldValue(name[0])));
          }
          if (getFieldValue(name[1])) {
            value.push(moment(getFieldValue(name[1])));
          }
          return (
            <div>
              <DatePicker.RangePicker
                showTime
                defaultValue={value}
                disabledDate={(d) => !d || d.isBefore(moment().startOf('day'))}
                onChange={(data) => {
                  if (data && data.length) {
                    setFields([
                      { name: name[0], value: data[0]?.toDate() },
                      { name: name[1], value: data[1]?.toDate() },
                    ]);
                  } else {
                    setFields([
                      { name: name[0], value: '' },
                      { name: name[1], value: '' },
                    ]);
                  }
                }}
                // value={value}
              />
              <Form.ErrorList errors={errors} />
            </div>
          );
        }}
      </Form.Item>
      <main>
        <Form.Item {...other} noStyle name={name[0]} hidden initialValue={''}>
          <input type={'hidden'} value={''} />
        </Form.Item>
        <Form.Item {...other} noStyle name={name[1]} hidden initialValue={''}>
          <input type={'hidden'} value={''} />
        </Form.Item>
      </main>
    </>
  );
};

export default RangePicker;
