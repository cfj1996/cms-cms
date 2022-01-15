/**
 * @name: DebounceSelect
 * @user: cfj
 * @date: 2022/1/15 15:16
 */
import React from 'react';
import type { SelectProps } from 'antd';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  request: (keyword: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

const DebounceSelect = function <
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ request, debounceTimeout = 800, ...props }: DebounceSelectProps) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);
  const fetchRef = React.useRef(0);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      request(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [request, debounceTimeout]);
  return (
    <Select<ValueType>
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
};

export default DebounceSelect;
