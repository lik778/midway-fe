import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import EmptyStatus from '@/components/empty-status'

export default (props: any) => {
  // 空状态所需信息
  const emptyMsg = {
    btn: '新建店铺',
    msg: '暂无店铺',
    img: "//file.baixing.net/202011/ead8b543db23259dc9838e753f865732.png",
  }

  const [visible, setVisible] = useState(true)

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = (e: any) => {
    setVisible(false)
  };

  const handleCancel = (e: any) => {
    setVisible(false)
  };
  return (
    <div>
      <div className="shop-create">
        <EmptyStatus emptyMsg={emptyMsg} onClick={showModal}/>
        <Modal
          title="新建店铺"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <ul>
            <li>
              <label>店铺名称</label>
              <Input placeholder="请输入名称，1~20个字符" />
            </li>
            <li>
              <label>店铺域名</label>
              <div>
                <span>shop.baixing.com/</span>
                <Input placeholder="请输入名称，1~20个字符" />
                <span>注：20个字符以内，填写英文/数字，不支持中文，<i className="error">提交后不支持更改</i></span>
              </div>
            </li>
          </ul>
        </Modal>
      </div>
      <div className="shop-list">
      </div>
    </div>
    
    
  )
}



