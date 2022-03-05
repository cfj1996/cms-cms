/**
 * @name: Quill
 * @user: cfj
 * @date: 2022/2/17 16:37
 */
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useRef } from 'react';
import { upFile } from '@/services/user/login';
import axios from 'axios';

const Quill = function (props: any) {
  const quillRef = useRef<ReactQuill>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', function () {
        fileRef.current?.click();
      });
      return () => {
        toolbar.handlers.image = undefined;
      };
    }
    return () => {};
  }, []);
  return (
    <>
      <input
        ref={fileRef}
        type="file"
        style={{ display: 'none' }}
        accept={'.jpg, .jpeg, .png'}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          const quill = quillRef.current?.getEditor();
          if (quill && file) {
            const actions = await upFile(file.type, file.size, file.name);
            await axios.put(actions.uploadURL, file, {
              headers: { 'Content-Type': file.type },
            });
            const select = quill.getSelection(true);
            quill.insertEmbed(select.index, 'image', actions.viewingURL);
          }
        }}
      />
      <ReactQuill
        {...props}
        ref={quillRef}
        placeholder={'如需嵌入图片请使用网络图片，或使用上传图片功能。'}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 切换按钮
            ['blockquote'],
            [{ header: 1 }, { header: 2 }], // 用户自定义按钮值
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 减少缩进/缩进
            [{ direction: 'rtl' }], // 文本下划线
            ['image'], // 清除格式
          ],
        }}
        theme="snow"
      />
    </>
  );
};

export default Quill;
