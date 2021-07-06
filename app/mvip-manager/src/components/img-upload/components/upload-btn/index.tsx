import React, { FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less'
interface Props {
  text?: string
  disabled?: boolean
  itemWidth?: number
  onClick?: () => void
}

const UploadBtn: FC<Props> = (props) => {
  const { text, disabled, itemWidth, onClick } = props
  return (
    <div className={styles['img-upload-btn-container']} style={{ width: itemWidth }} onClick={onClick}>
      <div className={`${styles['img-upload-btn']} ${disabled ? styles['disabled'] : ''}`}>
        <PlusOutlined className={styles['icon']} />
        <div className={styles['tip']}>{text}</div>
      </div>
    </div>
  );
}

export default UploadBtn