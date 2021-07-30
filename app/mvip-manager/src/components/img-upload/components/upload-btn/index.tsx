import React, { useContext, FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ImgUploadContext  from '@/components/img-upload/context'
import styles from './index.less'
interface Props {
  text?: string
  disabled?: boolean
  itemWidth?: number
}

const UploadBtn: FC<Props> = (props) => {
  const { text, disabled, itemWidth } = props
  const context = useContext(ImgUploadContext)
  const { initConfig, handleChangeAlbumVisible } = context
  const handleClick = () => {
    if (initConfig.uploadType) {
      handleChangeAlbumVisible(true)
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