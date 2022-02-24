import InfiniteScroll from 'react-infinite-scroll-component';
import { Divider, List, Skeleton } from 'antd';
import type { ReactNode, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

/**
 * @name: InfiniteScrollBox
 * @user: cfj
 * @date: 2022/2/23 22:52
 */
interface IProps<T = any> {
  header?: ReactNode;
  renderItem: (item: T) => ReactNode;
  height: number | string;
  server: (current: number) => Promise<{ data: T[]; success: boolean; total: number }>;
}

export type ActionRef =
  | {
      reload: () => void;
    }
  | undefined;

const InfiniteScrollBox = forwardRef(function <T>(props: IProps, ref: Ref<ActionRef>) {
  const { height, server, header, renderItem } = props;
  const [config, setConfig] = useState<{
    current: number;
    total?: number;
    loading: boolean;
    dataSource: T[];
  }>({
    current: 1,
    total: undefined,
    loading: false,
    dataSource: [],
  });

  const fetchPage = useCallback(
    (current: number) => {
      setConfig((state) => ({
        ...state,
        loading: true,
      }));
      server(current)
        .then((res) => {
          setConfig((state) => ({
            ...state,
            current: current + 1,
            dataSource: [...(current === 1 ? [] : state.dataSource), ...res.data],
            total: res.total,
            loading: false,
          }));
        })
        .catch(() => {
          setConfig((state) => ({
            ...state,
            current: 1,
            dataSource: [],
            total: undefined,
            loading: false,
          }));
        });
    },
    [config.current],
  );

  function loadMoreData() {
    if (config.loading) {
      return;
    }
    fetchPage(config.current);
  }

  useEffect(() => {
    fetchPage(1);
  }, []);

  useImperativeHandle(ref, () => ({
    reload() {
      fetchPage(1);
    },
  }));
  return (
    <InfiniteScroll
      dataLength={config.dataSource.length}
      next={loadMoreData}
      hasMore={Boolean(config.loading || (config.total && config.dataSource.length < config.total))}
      height={height}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />} // true
      endMessage={
        <Divider plain>{config.total === 0 ? '暂无数据 🤐' : '没有更多数据了 🤐'}</Divider> // false
      }
    >
      <List header={header}>{config.dataSource.map((item) => renderItem(item))}</List>
    </InfiniteScroll>
  );
});
export default InfiniteScrollBox;
