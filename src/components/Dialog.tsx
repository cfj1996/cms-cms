/**
 * @name: Dialog
 * @user: cfj
 * @date: 2021/12/11 23:05
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ConfigProvider, Form, Modal } from 'antd';
import type { FormFinishInfo } from 'rc-field-form/lib/FormContext';
import type { ModalProps } from 'antd/lib/modal/Modal';
import zhCN from 'antd/lib/locale/zh_CN';

export const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
};
export type IProps = {
  type?: 'form' | 'view';
  dialogRef: (ref: Dialog) => void;
  title: string;
  content?: React.ReactElement;
  onOK?: (name?: string, info?: FormFinishInfo) => Promise<void> | void;
  onCancel?: (iSFinish?: boolean) => void;
  onError?: (error: Error) => void;
} & Omit<ModalProps, 'visible' | 'title' | 'content' | 'onOk' | 'onCancel'>;
let id = 0;
export default class Dialog extends React.Component<IProps> {
  static dialogs = new Map<React.Key, Dialog | null>();

  static open(options: Omit<IProps, 'dialogRef'>) {
    id++;
    const div = document.createElement('div');
    const dom = document.documentElement.appendChild(div);
    let dialogRef: Dialog | null = null;
    ReactDOM.render(
      <Dialog
        {...options}
        dialogRef={(ref) => {
          dialogRef = ref;
        }}
        afterClose={() => {
          document.documentElement.removeChild(dom);
        }}
      />,
      dom,
    );
    Dialog.dialogs.set(id, dialogRef);
    return id;
  }

  static close(dialogID: React.Key) {
    console.log(Dialog.dialogs.get(dialogID));
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

  componentWillUnmount() {}

  onCancel() {
    this.setState({
      visible: false,
    });
  }

  componentDidMount() {
    this.props.dialogRef(this);
  }

  render() {
    const {
      type = this.props.onOK ? 'from' : 'view',
      title,
      content,
      onOK,
      onCancel,
      afterClose,
      onError,
      ...other
    } = this.props;
    const { visible, loading, iSFinish } = this.state;
    const Content =
      type === 'from'
        ? React.cloneElement(content!, { ref: (node: any) => (this.node = node) })
        : content;

    return (
      <ConfigProvider locale={zhCN}>
        <Form.Provider
          onFormFinish={async (name: string, info: FormFinishInfo) => {
            try {
              this.setState({ loading: true, iSFinish: true });
              await onOK?.(name, info);
              this.setState({
                loading: false,
                visible: false,
              });
            } catch (error: any) {
              onError?.(error);
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
            footer={
              !onOK
                ? [
                    <Button
                      key={'1'}
                      onClick={() => {
                        this.setState({ visible: false });
                      }}
                    >
                      关闭
                    </Button>,
                  ]
                : undefined
            }
            onOk={
              onOK
                ? async () => {
                    console.log('type', type, this.props.footer);
                    if (type === 'from' || this.props.footer) {
                      this.node?.submit?.();
                    } else {
                      await this.setState({ visible: false, loading: undefined });
                      await onOK();
                    }
                  }
                : undefined
            }
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
      </ConfigProvider>
    );
  }
}
