import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import MyModal, { ModalType } from '@/components/modal';
import EmptyStatus from './components/empty-status'
import MainTitle from '@/components/main-title';
import ShopBox from './components/shop-box';
import Loading from '@/components/loading';
import { postApiData } from '@/api/base';
import { notEmptyObject } from '@/utils';
import {
  GET_SHOP_LIST_ACTION,
  GET_SHOP_TOTAL_ACTION,
  SET_SHOP_LIST_ACTION,
  SET_SHOP_TOTAL_ACTION,
  SHOP_NAMESPACE,
} from '@/models/shop';
import { ShopInfo } from '@/interfaces/shop';
import './index.less';
import { ConnectState } from '@/models/connect';

// 空状态基本配置
const emptyMsg = {
  btn: '新建店铺',
  msg: '暂无店铺',
  img: "//file.baixing.net/202012/ead8b543db23259dc9838e753f865732.png",
}

function ShopPage(props: any) {
  const { shopStatus, shopList, shopTotal } = props
  // isLoaded
  const [isLoading, setIsLoading] = useState(true)
  // 弹窗显示隐藏
  const [visible, setVisible] = useState(false)
  // 弹窗错误显示
  const [err, setError] = useState('')
  // 显示弹窗的来源
  const [shopOperateStatus, setOperate] = useState(0)
  // 是否是后缀域名(前缀B2B，后缀服务)
  const [isSuffix, setIsSuffix] = useState(true)
  // 是否是后缀域名(前缀B2B，后缀服务)
  const [isNewShopDisabled, setIsNewShopDisabled] = useState(false)
  // 弹窗报错
  const [isInputErr, setInputErr] = useState({
    key: '',
    isRequired: false
  })

  // 输入框值初始状态
  const [oSite, setOSite] = useState({
    name: '',
    domain: '',
  })

  const [editVisible, setEditVisible] = useState<boolean>(false)
  // 弹窗接口返回
  const [shopSiteRes, setShopSiteRes] = useState({
    success: false,
    message: '',
    data: {},
  })

  // 相关文案和参数处理
  // 弹窗文案
  const operateShopTxt = shopOperateStatus === 0 ? '新建店铺' : '修改店铺'
  const isDomainDisabled = shopOperateStatus === 1 ? true : false
  const nameL = oSite?.name?.length || 0
  const domainL = oSite?.domain?.length || 0

  // 接口列表
  // 创建店铺
  const createShop = async (params: any) => {
    const data = await postApiData('midway/backend/shop/create', params)
    setShopSiteRes(data)
  }

  // 修改店铺
  const updateShop = async (params: any) => {
    const data = await postApiData('midway/backend/shop/update', params)
    setShopSiteRes(data)
  }

  const notInterceptCreateShop = (): boolean => {
    setEditVisible(!shopStatus.isUserPerfect)
    return shopStatus.isUserPerfect || false
  }

  // 显示弹窗
  const showModal = (e: any, state: number, modalBody?: any) => {
    if (notInterceptCreateShop()) {
      setError('')
      setOperate(state)
      setVisible(true)
      setOSite(modalBody)
    }
  };

  // 弹窗确定
  const handleOk = (e: any) => {
    if (!nameL) {
      setInputErr({
        key: 'name',
        isRequired: true
      })
      return
    }

    if (!domainL) {
      setInputErr({
        key: 'domain',
        isRequired: true
      })
      return
    }

    if (domainL < 4) {
      setError('请输入大于4个字符的域名')
      return
    }

    if (shopOperateStatus) {
      updateShop(oSite)
    } else {
      createShop(oSite)
    }
  };

  const obtainShopList = () => {
    props.dispatch({ type: `${SHOP_NAMESPACE}/${GET_SHOP_LIST_ACTION}` })
    props.dispatch({ type: `${SHOP_NAMESPACE}/${GET_SHOP_TOTAL_ACTION}` })
  }

  useEffect(() => obtainShopList(), [])

  useEffect(() => {
    if (shopList) setIsLoading(false)
  }, [shopList]);

  useEffect(
    () => {
      if (shopSiteRes?.success) {
        setVisible(false)
        if (shopOperateStatus != 1) {
          // 由于es返回慢，改用前端新增数据
          const newData = shopSiteRes?.data || null
          props.dispatch({ type: `${SHOP_NAMESPACE}/${SET_SHOP_LIST_ACTION}`, payload: [newData, ...shopList] })
          props.dispatch({ type: `${SHOP_NAMESPACE}/${SET_SHOP_TOTAL_ACTION}`, payload: shopTotal + 1 })
        } else {
          obtainShopList()
        }
      } else {
        setError(shopSiteRes && shopSiteRes.message || '')
      }
    },
    [shopSiteRes]
  )

  console.log(props)
  useEffect(() => {
    if (shopStatus !== null && notEmptyObject(shopStatus)) {
      setEditVisible(!shopStatus.isUserPerfect)
      setIsSuffix(shopStatus.domainType === 'SUFFIX')
      setIsNewShopDisabled(!(shopStatus?.isTicketAvailable))
    }
  }, [shopStatus])

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
    switch (name) {
      case 'name':
        if (nameL) {
          setInputErr({
            key: name,
            isRequired: false
          })
        }

        setOSite({ ...oSite, [name]: value })
        break;
      case 'domain':
        if (domainL) {
          setInputErr({
            key: name,
            isRequired: false
          })
        }

        if (domainL >= 4) {
          setError('')
        }
        setOSite({ ...oSite, [name]: value.replace(/[^a-z0-9]/g, '') })
        break;
    }
  }


  // 输入框必选
  const inputIsRequired = (str: string) => {
    if (isInputErr.key === str) {
      return isInputErr.isRequired ? 'input-error' : ''
    }
    return ''
  }

  // 店铺站点页面主功能块
  const shopSitePage = () => {
    if (isLoading) {
      return <Loading />
    }
    // 店铺列表
    if (shopTotal) {
      return (
        <div className="my-shop-list">
          <Button type="primary" className="primary-btn p-btn btn" onClick={(ev: any) => { showModal(ev, 0) }} disabled={isNewShopDisabled}>+新建店铺</Button>
          <div className="shop-list">
            {
              shopList.map((shopInfo: ShopInfo, index: number) => {
                return (
                  <ShopBox dispatch={props.dispatch} notInterceptCreateShop={notInterceptCreateShop} shopInfo={shopInfo} key={index} index={index}
                    onClick={(ev: any) => { showModal(ev, 1, shopInfo) }} />
                )
              })}
          </div>
        </div>
      )
    } else {
      // 无列表状态
      return (
        <div className="shop-create">
          <EmptyStatus emptyMsg={emptyMsg} onClick={(ev: any) => { showModal(ev, 0) }} />
        </div>
      )
    }
  }

  const domainPage = () => {
    if (isSuffix) {
      return (
        <div className="site-byte f-input">
          <span className="domain">shop.baixing.com/</span>
          <Input placeholder="请输入名称，4~20个字符" id="domain" name="domain" className={inputIsRequired('domain')} minLength={4} maxLength={20} onChange={handleChange} value={oSite && oSite.domain} disabled={isDomainDisabled} />
          <span className="f-len">{domainL}/20</span>
          <p className="shop-warning">注：20个字符以内，填写英文/数字，不支持中文，<i className="error">提交后不支持更改</i></p>
        </div>
      )
    } else {
      return (
        <div className="site-byte f-input prefix">
          <Input placeholder="请输入名称，4~20个字符" id="domain" name="domain" className={inputIsRequired('domain')} minLength={4} maxLength={20} onChange={handleChange} value={oSite && oSite.domain} disabled={isDomainDisabled} />
          <span className="f-len">{domainL}/20</span>
          <span className="domain">.shop.baixing.com</span>
          <p className="shop-warning">注：20个字符以内，填写英文/数字，不支持中文，<i className="error">提交后不支持更改</i></p>
        </div>
      )
    }
  }

  // 我的店铺
  return (
    <div>
      <MainTitle title="我的店铺" />
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
            <Input placeholder="请输入名称，1~20个字符" id="name" name="name" className={inputIsRequired('name')} maxLength={20} onChange={handleChange} value={oSite && oSite.name} />
            <span className="f-len">{nameL}/20</span>
          </li>
          <li>
            <label htmlFor="domain">店铺域名</label>
            {domainPage()}
          </li>
        </ul>
      </Modal>
      <MyModal
        title="去完善信息"
        content="您的企业资料还未填写，请完善您的企业资料"
        type={ModalType.info}
        closable={false}
        maskClosable={false}
        onCancel={() => setEditVisible(true)}
        onOk={() => history.push('/company-info/base')}
        visible={editVisible} />
      <div className="container">
        {shopSitePage()}
      </div>
    </div>
  )
}

export default connect((state: ConnectState) => {
  const { shopList, shopTotal, shopStatus } = state[SHOP_NAMESPACE]
  return { shopList, shopTotal, shopStatus }
})(ShopPage)

