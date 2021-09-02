import React, { useContext, FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less'
interface Props {
  text?: string
  disabled?: boolean
  itemWidth?: number,
  uploadType: 1 | 2,
  handleChangeAlbumVisible?: (albumVisible: boolean) => void
}

const UploadBtn: FC<Props> = (props) => {
  const { text, disabled, itemWidth, uploadType, handleChangeAlbumVisible } = props
  const handleClick = () => {
    if (uploadType === 2) {
      handleChangeAlbumVisible && handleChangeAlbumVisible(true)
    }
  }

  return (
    <div className={styles['img-upload-btn-container']} style={{ width: itemWidth }} onClick={handleClick}>
      <div className={`${styles['img-upload-btn']} ${disabled ? styles['disabled'] : ''}`} style={{ width: itemWidth }}>
        <PlusOutlined className={styles['icon']} />
        <div className={styles['tip']}>{text}</div>
      </div>
    </div>
  );
}

export default UploadBtn