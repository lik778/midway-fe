import { Modal } from 'antd';
import React from 'react';

export default (props: any) => {
  const { visible, onOk, onCancel } = props
  return <Modal title={<span style={{ color: '#F1492C' }}>确认关闭</span>}
                onCancel={onCancel}
                onOk={onOk}
                visible={visible}>
        <p>您还没有提交，退出后当前页面的内容不会保存，确认退出？</p>
    </Modal>
}
