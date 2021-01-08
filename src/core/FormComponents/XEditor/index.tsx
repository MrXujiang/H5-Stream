import React, { useState, useEffect, memo } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './index.less';

const controls = [
  {
    key: 'bold',
    text: <b>加粗</b>,
  },
  'undo',
  'redo',
  'emoji',
  'list-ul',
  'list-ol',
  'blockquote',
  'text-align',
  'font-size',
  'line-height',
  'letter-spacing',
  'text-color',
  'italic',
  'underline',
  'link',
  'media',
];

export default memo(function XEditor(props: any) {
  const [editorState, setEditorState] = useState(
    BraftEditor.createEditorState(),
  );

  const { value, onChange } = props;

  const submitContent = () => {
    const htmlContent = editorState.toHTML();
    onChange && onChange(htmlContent);
  };

  const handleEditorChange = (editorState: any) => {
    // 零时解决方案, 主要解决键盘快捷键和富文本删除复制的冲突
    window.dr_stop = 1;

    setEditorState(editorState);
    if (onChange) {
      const htmlContent = editorState.toHTML();
      onChange(htmlContent);
    }
  };

  useEffect(() => {
    const htmlContent = value || '';
    setEditorState(BraftEditor.createEditorState(htmlContent));
  }, []);
  return (
    <BraftEditor
      value={editorState}
      controls={controls}
      onChange={handleEditorChange}
      onSave={submitContent}
    />
  );
});
