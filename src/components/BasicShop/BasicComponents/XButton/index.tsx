import React, { memo } from 'react';
import styles from './index.less';
import { IButtonConfig } from './schema';

interface IProps extends IButtonConfig {
  isTpl: boolean;
}

const XButton = memo((props: IProps) => {
  const {
    isTpl,
    bgColor,
    round,
    marginTop,
    text,
    width,
    fontSize,
    color,
    tplImg,
  } = props;

  return isTpl ? (
    <div>
      <img style={{ width: '100%' }} src={tplImg} alt=""></img>
    </div>
  ) : (
    <div style={{ textAlign: 'center', padding: '6px', marginTop }}>
      <div
        className={styles.btn}
        style={{ backgroundColor: bgColor, borderRadius: round, width }}
      >
        <a className={styles.text} style={{ fontSize, color }}>
          {text}
        </a>
      </div>
    </div>
  );
});
export default XButton;
