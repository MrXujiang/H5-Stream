import React, { memo, useCallback } from 'react';
import { Button } from 'zarm';
import BaseForm from './BaseForm';
import { IFormConfig } from './schema';
import styles from './index.less';

interface FormPropTypes extends IFormConfig {
  isTpl: boolean;
}

const FormComponent = (props: FormPropTypes) => {
  const {
    title,
    bgColor,
    fontSize,
    titColor,
    titWeight,
    btnColor,
    btnTextColor,
    api,
    formControls,
    tplImg,
  } = props;

  const formData: Record<string, any> = {};
  formControls.map(item => {
    formData[item.label] = '';
  });

  const handleChange = useCallback(
    (item, v) => {
      if (item.options) {
        formData[item.label] = v;
        return;
      }
      formData[item.label] = v;
    },
    [formData],
  );

  const handleSubmit = () => {
    let isPass = Object.values(formData).every(item => !!item);
    if (isPass) {
      fetch(api, {
        body: JSON.stringify(formData),
        cache: 'no-cache',
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
      });
    } else {
      alert('请将表单填写完整');
    }
  };

  const isEditorPage = window.location.pathname.indexOf('editor') > -1;

  return props.isTpl ? (
    <div>
      <img style={{ width: '100%' }} src={tplImg} alt="" />
    </div>
  ) : (
    <div
      className={styles.formWrap}
      style={{
        backgroundColor: bgColor,
        pointerEvents: isEditorPage ? 'none' : 'initial',
      }}
    >
      {title && (
        <div
          className={styles.title}
          style={{ fontSize, fontWeight: +titWeight, color: titColor }}
        >
          {title}
        </div>
      )}
      <div className={styles.formContent}>
        {formControls.map(item => {
          const FormItem = BaseForm[item.type];
          return (
            <FormItem
              onChange={handleChange.bind(this, item)}
              {...item}
              key={item.id}
            />
          );
        })}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Button
            theme="primary"
            size="sm"
            block
            onClick={handleSubmit}
            style={{
              backgroundColor: btnColor,
              borderColor: btnColor,
              color: btnTextColor,
            }}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(FormComponent);
