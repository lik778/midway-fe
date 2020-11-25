import React, { useState } from 'react';
import { Modal, Input, message, Space, Button } from 'antd';
import EmptyStatus from '@/components/empty-status'
import MainTitle from '@/components/main-title';
import ShopBox from '@/components/shop-box'
import './index.less';

// 空状态基本配置
const emptyMsg = {
  btn: '新建店铺',
  msg: '暂无店铺',
  img: "//file.baixing.net/202011/ead8b543db23259dc9838e753f865732.png",
}

const shopList = [
  {
    id: 1,
    img: '//file.baixing.net/202011/7f14b8c736a614c75fda50d1d1615640.png',
    status: 1,
  }
]

export default (props: any) => {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const [err, setError] = useState('')

  const showModal = () => {
    setVisible(true)
  };

  const handleOk = (e: any) => {
    setVisible(false)
  };

  const handleCancel = (e: any) => {
    setVisible(false)
  };

  const handleChange = (e: any) => {
    let value = e.target.value
    setValue(value.replace(/[^a-zA-Z0-9]/g,''))
  }

  const shopCreate = () =>{
    return (
      <div className="shop-create">
        <EmptyStatus emptyMsg={emptyMsg} onClick={showModal}/>
        <Modal
          title="新建店铺"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          className="create-shop-box"
          width={532}
        >
          <p className="error">{err}</p>
          <ul className="shop-site">
            <li>
              <label>店铺名称</label>
              <Input placeholder="请输入名称，1~20个字符" maxLength={20}/>
            </li>
            <li>
              <label>店铺域名</label>
              <div className="site-byte">
                <span>shop.baixing.com/</span>
                <Input placeholder="请输入名称，1~20个字符" maxLength={20} onChange={handleChange} value={value}/>
                <p className="shop-warning">注：20个字符以内，填写英文/数字，不支持中文，<i className="error">提交后不支持更改</i></p>
              </div>
            </li>
          </ul>
        </Modal>
      </div>
    )
  }

  const shopList = () => {}

  return (
    <div>
      <MainTitle title="我的店铺"/>
      <div className="container">
        <div className="shop-list">
          <ShopBox/>
        </div>
      </div>
      
    </div>
    
    
  )
}



