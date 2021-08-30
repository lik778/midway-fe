import React, { useMemo, useContext, FC, useRef } from 'react'
import { UploadFile } from 'antd/lib/upload/interface';
import styles from './index.less'
import { Modal } from 'antd'
import { useEffect } from 'react';
interface Props {
  previewMedia?: UploadFile,
  previewVisible: boolean,
  handleCloseModal: () => void
}

const PreviewModal: FC<Props> = (props) => {
  const { previewMedia, previewVisible, handleCloseModal } = props
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const handleCloseModalFc = () => {
    handleCloseModal()
  }

  useEffect(() => {
    if (videoRef.current) {
      if (previewVisible) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }

  }, [previewVisible])

  return <Modal
    title="预览图片"
    width={800}
    visible={previewVisible}
    onOk={handleCloseModalFc}
    onCancel={handleCloseModalFc}
    footer={null}
  >
    {
      previewMedia?.type === 'IMAGE' && <img alt="example" style={{ width: '100%' }} src={previewMedia.preview} />
    }
    {
      previewMedia?.type === 'VIDEO' && <video ref={videoRef} style={{ width: '100%', height: '600px' }} controls autoPlay src={previewMedia.url} />
    }
  </Modal>
}

export default PreviewModal