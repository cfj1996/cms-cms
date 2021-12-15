import type { IProps } from '@/components/Dialog';
import Dialog from '@/components/Dialog';
/**
 * @name: useDialog
 * @user: cfj
 * @date: 2021/12/15 23:39
 */
import type React from 'react';
import { useState } from 'react';

export const useDialog = function (): [(options: IProps) => number, React.ReactPortal | null] {
  const [contextHolder, setContextHolder] = useState<React.ReactPortal | null>(null);
  function open(options: IProps) {
    const [id, portalDom] = Dialog.open(options, () => {
      setContextHolder(null);
    });
    setContextHolder(portalDom);
    return id;
  }
  return [open, contextHolder];
};
