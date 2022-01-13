/**
 * @name: tableImgCall
 * @user: cfj
 * @date: 2022/1/13 16:26
 */
import type { ImageProps } from 'rc-image';
import { Image } from 'antd';
import imgError from '@/assets/images/imgError.png';
import React from 'react';

type IProps = Omit<ImageProps, 'height' | 'fallback' | 'preview'> & { images?: IProps[] };
const TableImgCall = function (props: IProps) {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(false);
  const { images, ...other } = props;
  return (
    <div className={'table-img'}>
      <Image
        height={45}
        preview={images ? { visible: false } : undefined}
        fallback={imgError}
        {...other}
        onError={() => {
          setError(true);
        }}
        onClick={() => !error && images && setVisible(true)}
      />
      {images && (
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
            {images.map((image) => (
              <Image key={image.src} height={45} fallback={imgError} {...image} />
            ))}
          </Image.PreviewGroup>
        </div>
      )}
    </div>
  );
};

export default TableImgCall;
