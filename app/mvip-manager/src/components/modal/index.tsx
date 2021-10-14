import { Modal } from 'antd';
import React, { ReactNode } from 'react';
import './index.less'

export enum ModalType {
  info = "info",
  warning = 'warning',
  superWarning = 'superWarning',
  error = 'error',
  success = 'success',
}

interface Props {
  title: ReactNode;
  content: ReactNode;
  visible: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  type?: ModalType;
  footer?: any;
  confirmLoading?: boolean;
  onOk(): void;
  onCancel(): void;
  width?: number
}
export default (props: Props) => {
  const { visible, onOk, onCancel, title, content, type, footer, closable, maskClosable,
    confirmLoading, width } = props

  const createTitle = (type: ModalType = ModalType.superWarning) => {
    if (type === ModalType.info) {
      return <p className="quit-form-box">
        <span className="title-content">{title || '确认关闭'}</span></p>
    } else if (type === ModalType.superWarning) {
      return <p className="quit-form-box quit-form-superWarning-box">
        <img className="icon" src="//file.baixing.net/202012/4be6ac60292a17970a45b2ea61e6ae34.png" />
        <span className="title-content">{title || '确认关闭'}</span></p>
    } else if (type === ModalType.warning) {
      return <p className="quit-form-box quit-form-warning-box">
        <img className="icon" src="//file.baixing.net/202012/05b9d68b0a6ab2fcc19c571ccdb34829.png" />
        <span className="title-content">{title || '确认关闭'}</span></p>
    } else {
      return <p>没有类型</p>
    }
  }

  return <Modal
    className="my-modal-box"
    title={createTitle(type)}
    closable={closable === false ? false : true}
    maskClosable={maskClosable === false ? false : true}
    footer={footer}
    onCancel={onCancel}
    onOk={onOk}
    confirmLoading={confirmLoading}
    visible={visible}
    width={width}
  >

    <div>{content}</div>
  </Modal>
}
