import * as React from 'react'
import { FC, useEffect, useState } from 'react'
import { Modal } from 'antd';
import './index.css'

interface Props {
  visible: boolean,
  url: string,
  onClose: () => void
}

const PreviewImage: FC<Props> = (props) => {
  const { visible, url, onClose } = props

  return <Modal
    wrapClassName="image-preview-modal"
    width="100vw"
    footer={null}
    visible={visible}
    onCancel={onClose}
  >
    <div className={"image-wrapper"}>
      <img src={url} alt="预览图片" />
    </div>
  </Modal>
}

export default PreviewImage