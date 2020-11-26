import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Space, Button } from 'antd';
import EmptyStatus from '@/components/empty-status'
import MainTitle from '@/components/main-title';
import ShopBox from '@/components/shop-box'
import './index.less';
import { postApiData } from '@/api/base';

// 空状态基本配置
const emptyMsg = {
  btn: '新建店铺',
  msg: '暂无店铺',
  img: "//file.baixing.net/202011/ead8b543db23259dc9838e753f865732.png",
}

export default (props: any) => {
 
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const [err, setError] = useState('')
  const [shopListData, setShopList] = useState([])
  const [totalCount, setCount] = useState(0)
  const [shopOperateStatus, setOperate] = useState(0)
  
  const createShop = async (params: any) => { 
    const data = await postApiData('shop/create',params)
    
  }

  const getShopListing = async () => {
    const data = await postApiData('shop/listing', JSON.stringify({ page: 1, size: 10 }))
    if(data.code === 200) {
      const resData = data.data
      const result = resData.result && resData.result.slice(0,2)  || []
      console.log('result', result)
      setShopList(result)
      setCount(resData.totalRecord)
    }
  }
  
  useEffect(() => {
    getShopListing()
  }, []);


  const showModal = (e:any, state: number) => {
    setOperate(state)
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
        
      </div>
    )
  }

  const isNewShopDisabled = totalCount > 2 ? true : false
  const operateShopTxt = shopOperateStatus === 0 ? '新建店铺' : '修改店铺'

  return (
    <div>
      <MainTitle title="我的店铺"/>
      <Modal
          title={operateShopTxt}
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
      <div className="container">
        <div className="my-shop-list">
          <Button type="primary" className="primary-btn btn" onClick={(ev) => {showModal(ev, 0)}} disabled={isNewShopDisabled}>+新建店铺</Button>
          <div className="shop-list">
            {
              shopListData.map((shopChild, index) => {
               return (
                <ShopBox shopChild={shopChild} key={index}/>
               )
            })}
          </div>
        </div>        
      </div>
    </div>
  )
}



