/**
 * @name: upload
 * @user: cfj
 * @date: 2021/12/24
 * @description:
 */
import axios from 'axios';
import type { UploadProps } from 'antd';
import { Upload as UploadFileC } from 'antd';
import { useState } from 'react';
import { upFile } from '@/services/user/login';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import type { UploadFile } from 'antd/lib/upload/interface';

interface IProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const Upload = function (props: UploadProps & IProps) {
  const { value, onChange, ...out } = props;
  const defaultFileList: any =
    value?.map((i) => ({
      uid: i,
      name: i,
      status: 'success',
      url: i,
    })) || [];
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);
  return (
    <UploadFileC
      {...out}
      method={'PUT'}
      customRequest={async (option: RcCustomRequestOptions) => {
        try {
          const { size, name, type } = option.file as any;
          const actions = await upFile(type, size, name);
          await axios.put(actions.uploadURL, option.file, {
            headers: { 'Content-Type': type },
            onUploadProgress(e) {
              if (e.total > 0) {
                e.percent = (e.loaded / e.total) * 100;
              }
              option.onProgress?.(e);
            },
          });
          option.onSuccess?.({ url: actions?.viewingURL });
        } catch (err: any) {
          option.onError?.(err);
        }
      }}
      fileList={fileList}
      onChange={({ file, fileList }) => {
        if (file.response?.url) {
          file.url = file.response.url;
        }
        setFileList(fileList as any);
        console.log('fileList', fileList);
        const urls = fileList.filter((i) => i.url).map((i) => i.url!);
        if (urls.length) {
          console.log('urls', urls);
          onChange?.(urls);
        } else {
          if (value?.length) {
            onChange?.([]);
          }
        }
      }}
    >
      <Button disabled={props.disabled} icon={<UploadOutlined />}>
        Click to Upload
      </Button>
    </UploadFileC>
  );
};
export default Upload;
