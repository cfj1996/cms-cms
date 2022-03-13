/**
 * @name: upload
 * @user: cfj
 * @date: 2021/12/24
 * @description:
 */
import axios from 'axios';
import type { UploadProps } from 'antd';
import { Button, message, Upload as UploadFileC } from 'antd';
import { useEffect } from 'react';
import { upFile } from '@/services/user/login';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import type { UploadFile } from 'antd/lib/upload/interface';
import type { AssetsType } from '@/services/nft/nfts';
import { useImmer } from 'use-immer';

type Value = string | string[];

interface IProps {
  value?: Value;
  type?: keyof typeof AssetsType;
  onChange?: (value: Value) => void;
}

const Upload = function (props: UploadProps & IProps) {
  console.log(props);
  const { value, onChange, type = 'image', ...other } = props;
  console.log('Upload value', value);
  const defaultFileList: any = value
    ? Array.isArray(value)
      ? value.map((i) => ({
          uid: i,
          name: i,
          status: 'done',
          url: i,
          thumbUrl: i,
        }))
      : [
          {
            uid: value,
            name: value,
            status: 'done',
            url: value,
          },
        ]
    : [];
  const [fileList, setFileList] = useImmer<UploadFile[]>(defaultFileList);
  const valueString = Array.isArray(value) ? value.join('') : value;
  useEffect(() => {
    if (!value || value?.length === 0) {
      setFileList([]);
    }
  }, [valueString]);
  return (
    <UploadFileC
      {...other}
      accept={type === 'image' ? 'image/*' : 'video/*'}
      method={'PUT'}
      listType="picture"
      defaultFileList={defaultFileList}
      isImageUrl={() => type === 'image'}
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
          option.onSuccess?.({ url: actions?.viewingURL, thumbUrl: actions?.viewingURL });
        } catch (err: any) {
          message.error('上传失败，请删除后重新上传文件');
          option.onError?.(err);
        }
      }}
      fileList={fileList}
      onChange={({ file, fileList }) => {
        console.log('fileList', file);
        setFileList(fileList as any);
        if (file.response?.url) {
          file.url = file.response.url;
        }
        const urls = fileList.filter((i) => i.url).map((i) => i.url!);

        if (!other.multiple) {
          onChange?.(urls[0]);
        } else {
          if (urls.join('') !== (Array.isArray(value) ? value.join('') : '')) {
            onChange?.(urls);
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
