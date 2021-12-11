// @ts-nocheck
import { forwardRef, useMemo } from 'react';
import { useServer } from '@/hooks';
import Promise from 'bluebird';
import { Button, Result, Spin } from 'antd';
import type { IServer, Resolve } from '@/services';

export interface PageService<T> {
  data?: Resolve<T>;
  loading?: boolean;
  error?: any;
  refresh?: () => void;
}

export const withServers = function (
  servers: IServer[] | IServer,
  setParams: (props: any) => any,
  options = {},
) {
  return function (component: any) {
    return forwardRef((props, ref) => {
      let server = servers;
      const params = useMemo(() => {
        return setParams?.(props);
      }, []);
      if (Array.isArray(servers)) {
        server = function () {
          return Promise.all(
            servers.map((server, i) => {
              const param = params ? params?.[i] : undefined;
              return server(param);
            }),
          );
        };
      }
      const Component = component;
      const { autoError = true } = options;
      console.log('params', params);
      const { data, loading, error, refresh } = useServer(server, {
        params: Array.isArray(servers) ? undefined : params,
      });
      if (loading) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Spin />
          </div>
        );
      }
      if (error && autoError) {
        return (
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={
              <Button type="primary" onClick={refresh}>
                Back Home
              </Button>
            }
          />
        );
      }
      if (data) {
        return (
          <Component
            ref={ref}
            data={data}
            loading={loading}
            error={error}
            refresh={refresh}
            {...props}
          />
        );
      }
      return null;
    });
  };
};
