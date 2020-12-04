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
  // 弹窗显示隐藏
  const [visible, setVisible] = useState(false)
  // 弹窗错误显示
  const [err, setError] = useState('')
  // 弹窗列表显示
  const [shopListData, setShopList] = useState<any[]>([])
  // 弹窗总数
  const [totalCount, setCount] = useState(0)
  // 显示弹窗的来源
  const [shopOperateStatus, setOperate] = useState(0)
  // 弹窗报错
  const [isInputErr, setInputErr] = useState({
    key:'',
    isRequired: false
  })
  // 输入框值初始状态
  const [oSite, setOSite] = useState({
    name: '',
    domain: '',
  })

  // 弹窗接口返回
  const [shopSiteRes, setShopSiteRes] = useState({
    success: false,
    message: '',
    data: {},
  })

  // 相关文案和参数处理
  // 限制只显示2个
  const isNewShopDisabled = totalCount >= 2 ? true : false
  // 弹窗文案
  const operateShopTxt = shopOperateStatus === 0 ? '新建店铺' : '修改店铺'
  const isDomainDisabled = shopOperateStatus === 1 ? true : false
  const nameL = oSite?.name?.length || 0
  const domainL = oSite?.domain?.length || 0

  // 接口列表
  // 创建店铺
  const createShop = async (params:any) => {
    const data = await postApiData('shop/create',params)
    setShopSiteRes(data)
  }

  // 修改店铺
  const updateShop = async (params:any) => {
    const data = await postApiData('shop/update',params)
    setShopSiteRes(data)
  }


  // 获取店铺列表
  const getShopListing = async () => {
    const data = await postApiData('shop/listing', { page: 1, size: 10 })
    if(data && data.code === 200) {
      const resData = data.data
      const result = resData.result || []
      setShopList(result)
      setCount(resData.totalRecord)
    }
  }




  // 显示弹窗
  const showModal = (e:any, state: number, modalBody?: any) => {
    setError('')
    setOperate(state)
    setVisible(true)
    setOSite(modalBody)
  };

  // 弹窗确定
  const handleOk = (e: any) => {
    if(!nameL) {
      setInputErr({
        key: 'name',
        isRequired: true
      })
      return
    }

    if(!domainL) {
      setInputErr({
        key: 'domain',
        isRequired: true
      })
      return
    }

    if(shopOperateStatus) {
      updateShop(oSite)
    }else {
      createShop(oSite)
    }
  };

  useEffect(() => {
    getShopListing()
  }, []);

  useEffect(
    () => {
      if(shopSiteRes?.success) {
        setVisible(false)
        if(shopOperateStatus != 1) {
          // 由于es返回慢，改用前端新增数据
          const newData = shopSiteRes?.data || null
          setShopList([newData, ...shopListData])
          setCount(totalCount+1)
        }else {
          getShopListing()
        }

      }else {
        setError(shopSiteRes && shopSiteRes.message || '')
      }
    },
    [shopSiteRes]
  )


  // bindEvent
  // 弹窗取消
  const handleCancel = (e: any) => {
    setVisible(false)
  };

  // 输入框
  const handleChange = (e: any) => {
    const target = e.target
    const name = target.name
    const value = target.value
    switch(name) {
      case 'name':
        if(nameL){
          setInputErr({
            key: name,
            isRequired: false
          })
        }

        setOSite({...oSite, [name]:value})
      break;
      case 'domain':
        if(domainL){
          setInputErr({
            key: name,
            isRequired: false
          })
        }
        setOSite({...oSite, [name]:value.replace(/[^a-z0-9]/g,'')})
      break;
    }
  }


  // 输入框必选
  const inputIsRequired = (str: string) => {
    if(isInputErr.key === str) {
      return isInputErr.isRequired? 'input-error' : ''
    }
    return ''
  }

  // 店铺站点页面主功能块
  const shopSitePage = () => {
    // 店铺列表
    if(totalCount) {
      return (
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
      )
    }else {
      // 无列表状态
      return (
        <div className="shop-create">
          <EmptyStatus emptyMsg={emptyMsg} onClick={(ev: any) => {showModal(ev, 0)}}/>
        </div>
      )
    }
  }

  // 我的店铺
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
            <li className="f-input">
              <label htmlFor="name">店铺名称</label>
              <Input placeholder="请输入名称，1~20个字符" id="name" name="name" className={inputIsRequired('name')} maxLength={20} onChange={handleChange} value={oSite && oSite.name}/>
              <span className="f-len">{nameL}/20</span>
            </li>
            <li>
              <label htmlFor="domain">店铺域名</label>
              <div className="site-byte f-input">
                <span>shop.baixing.com/</span>
                <Input placeholder="请输入名称，1~20个字符" id="domain" name="domain" className={inputIsRequired('domain')} maxLength={20} onChange={handleChange} value={oSite && oSite.domain} disabled={isDomainDisabled}/>
                <span className="f-len">{domainL}/20</span>
                <p className="shop-warning">注：20个字符以内，填写英文/数字，不支持中文，<i className="error">提交后不支持更改</i></p>
              </div>
            </li>
          </ul>
        </Modal>
        <div className="container">
          {shopSitePage()}
        </div>
    </div>
  )
}



