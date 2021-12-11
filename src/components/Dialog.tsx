/**
 * @name: Dialog
 * @user: cfj
 * @date: 2021/12/11 23:05
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Modal } from 'antd';
import type { FormFinishInfo } from 'rc-field-form/lib/FormContext';
import type { ModalProps } from 'antd/lib/modal/Modal';

type IProps = {
  type?: 'form' | 'view';
  title: string;
  content: React.ReactElement;
  onOK?: (name?: string, info?: FormFinishInfo) => Promise<void> | void;
  onCancel?: (iSFinish?: boolean) => void;
} & Omit<ModalProps, 'visible' | 'title' | 'content' | 'onOK' | 'onCancel'>;
let id = 0;
export default class Dialog extends React.Component<IProps> {
  static dialogs = new Map<React.Key, Dialog | null>();

  static open(options: IProps) {
    id++;
    const div = document.createElement('div');
    const dom = document.documentElement.appendChild(div);
    let dialogRef: Dialog | null = null;
    ReactDOM.render(
      <Dialog
        ref={(ref) => {
          dialogRef = ref;
        }}
        afterClose={() => {
          document.documentElement.removeChild(dom);
        }}
        {...options}
      />,
      dom,
    );
    Dialog.dialogs.set(id, dialogRef);
    return id;
  }

  static close(dialogID: React.Key) {
    Dialog.dialogs.get(dialogID)?.onCancel();
  }

  static closeAll() {
    for (const [key] of Dialog.dialogs) {
      Dialog.close(key);
    }
  }

  node: any;

  state = {
    visible: true,
    iSFinish: false,
    loading: false,
  };
  onCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { type = 'from', title, content, onOK, onCancel, afterClose, ...other } = this.props;
    const { visible, loading, iSFinish } = this.state;
    const Content =
      type === 'from'
        ? React.cloneElement(content, { ref: (node: any) => (this.node = node) })
        : content;
    return (
      <Form.Provider
        onFormFinish={async (name: string, info: FormFinishInfo) => {
          try {
            this.setState({ loading: true, iSFinish: true });
            await onOK?.(name, info);
            this.setState({
              loading: false,
              visible: false,
            });
          } catch (e) {
            this.setState({
              loading: false,
            });
          }
        }}
      >
        <Modal
          {...other}
          afterClose={afterClose}
          title={title}
          visible={visible}
          onOk={() => {
            if (type === 'from') {
              this.node?.submit?.();
            } else {
              this.setState({ visible: false });
              onOK?.();
            }
          }}
          destroyOnClose
          confirmLoading={loading}
          onCancel={() => {
            onCancel?.(iSFinish);
            this.onCancel?.();
          }}
        >
          {Content}
        </Modal>
      </Form.Provider>
    );
  }
}
