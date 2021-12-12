import { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import type { IServer, Resolve } from '@/services';
import type Bluebird from 'bluebird';

interface IOptions<S, T> {
  manual?: boolean;
  params?: S;
  initData?: Resolve<T>;
}
export const useServer = function <S = any, T = any>(
  server: IServer<S, T>,
  options?: IOptions<S, T>,
) {
  const requestRef = useRef<Bluebird<T>>();
  const { manual, initData, params } = options || {};
  const [dd, setDd] = useImmer({
    loading: false,
    data: initData || undefined,
    error: undefined,
  });
  function request(param?: S) {
    setDd((draft) => {
      draft.loading = true;
    });
    requestRef.current = server(param)
      .then((res) => {
        setDd((draft) => {
          draft.loading = false;
          // @ts-ignore
          draft.data = res;
        });
        return res;
      })
      .catch((err) => {
        setDd((draft) => {
          draft.loading = false;
          draft.error = err;
        });
        return err;
      })
      .finally(() => {
        if (requestRef.current?.isCancelled()) {
          setDd((draft) => {
            draft.loading = false;
          });
        }
      });
    return requestRef.current;
  }
  useEffect(() => {
    if (!manual) {
      request(params);
    }
    return () => {
      requestRef.current?.cancel();
    };
  }, [params]);
  return {
    ...dd,
    run(params: S) {
      requestRef.current?.cancel();
      return request(params);
    },
    refresh() {
      requestRef.current?.cancel();
      request(params);
    },
  };
};
