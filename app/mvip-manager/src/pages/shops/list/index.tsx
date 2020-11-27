import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
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
  const [visible, setVisible] = useState(true)
  const [err, setError] = useState('')
  const [shopListData, setShopList] = useState([])
  const [totalCount, setCount] = useState(0)
  const [shopOperateStatus, setOperate] = useState(0)
  const [oSite, setOSite] = useState({
    name: '',
    domain: '',
  })

  // 创建店铺
  const createShop = async (params:any, callback?:any) => {
    const data = await postApiData('shop/create',params)
    if(data && data.code === 200) {
      callback(data.success)
    }else {
      callback(data)
    }
  }

  // 修改店铺
  const updateShop = async (params:any, callback?:any) => {
    const data = await postApiData('shop/update',params)
    if(data && data.code === 200) {
      callback(data.success)
    }else {
      callback(data)
    }
  }


  // 获取店铺列表
  const getShopListing = async () => {
    const data = await postApiData('shop/listing', { page: 1, size: 10 })
    if(data && data.code === 200) {
      const resData = data.data
      const result = resData.result && resData.result.slice(0,2)  || []
      setShopList(result)
      setCount(resData.totalRecord)
    }
  }
  
  useEffect(() => {
    getShopListing()
  }, []);


  const showModal = (e:any, state: number, modalBody?: any) => {
    setOperate(state)
    setVisible(true)
    setOSite(modalBody)
  };

  const handleOk = (e: any) => {
    if(oSite.name)
    if(shopOperateStatus) {
      updateShop(oSite, (status: boolean)=> {

      })
    }else {
      createShop(oSite, (status:boolean) => {

      })
    }
  };

  const handleCancel = (e: any) => {
    setVisible(false)
  };

  const handleChange = (e: any) => {
    const target = e.target
    const name = target.name
    const value = target.value
    switch(name) {
      case 'name':
        setOSite({...oSite, [name]:value})
      break;
      case 'domain':
        setOSite({...oSite, [name]:value.replace(/[^a-zA-Z0-9]/g,'')})
      break;
    }
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
  const isDomainDisabled = shopOperateStatus === 1 ? true : false
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
              <label htmlFor="name">店铺名称</label>
              <Input placeholder="请输入名称，1~20个字符" name="name" maxLength={20} onChange={handleChange} value={oSite.name}/>
            </li>
            <li>
              <label htmlFor="domain">店铺域名</label>
              <div className="site-byte">
                <span>shop.baixing.com/</span>
                <Input placeholder="请输入名称，1~20个字符" name="domain" maxLength={20} onChange={handleChange} value={oSite.domain} disabled={isDomainDisabled}/>
                <p className="shop-warning">注：20个字符以内，填写英文/数字，不支持中文，<i className="error">提交后不支持更改</i></p>
              </div>
            </li>
          </ul>
        </Modal>
      <div className="container">
        <div className="my-shop-list">
          <Button type="primary" className="primary-btn btn" onClick={(ev: any) => {showModal(ev, 0)}} disabled={isNewShopDisabled}>+新建店铺</Button>
          <div className="shop-list">
            {
              shopListData.map((shopChild, index) => {
               return (
                <ShopBox shopChild={shopChild} key={index} onClick={(ev: any) => {showModal(ev, 1, shopChild)}}/>
               )
            })}
          </div>
        </div>        
      </div>
    </div>
  )
}



