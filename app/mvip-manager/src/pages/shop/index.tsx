import React, { FC, useEffect, useMemo, useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import {
  SHOP_NAMESPACE,
} from '@/models/shop';
import { CreateShopParams, ShopInfo, ShopStatus } from '@/interfaces/shop';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import MyModal, { ModalType } from '@/components/modal';
import ShopBox from './components/shop-box';
import EmptyStatus from './components/empty-status'
import { shopMapDispatchToProps } from '@/models/shop'
import { notEmptyObject } from '@/utils';
import ShopInfoForm from './components/form'
import { ShopIndustryType } from '@/enums';
interface Props {
  dispatch: Dispatch<AnyAction>;
  shopTotal: number | undefined;
  shopList: ShopInfo[] | null;
  shopStatus: ShopStatus | null;
  loadingShop: boolean,
  getShopStatus: () => Promise<any>
  getShopList: () => Promise<any>
  setCurShopInfo: (ShopInfo: ShopInfo) => Promise<any>
}

const ShopPage: FC<Props> = (props) => {
  const { shopStatus, shopList, shopTotal, loadingShop, getShopStatus, getShopList, setCurShopInfo } = props

  // 创建按钮禁用
  const [createShopDisabled, setCreateShopDisabled] = useState<boolean>(true)

  // 控制两个弹窗
  const [modalGotoVisible, setModalGotoVisible] = useState<boolean>(false)
  const [modalInfoVisible, setModalInfoVisible] = useState<boolean>(false)
  const [modalActionType, setModalActionType] = useState<'add' | 'edit' | ''>('')
  const shopInfoModalTitle = useMemo(() => modalActionType === 'add' ? '新建店铺' : modalActionType === 'edit' ? '修改店铺' : '', [modalActionType])
  // 弹窗的初始化数据
  const [modalInitData, setModalInitData] = useState<CreateShopParams | null>(null)

  // 空状态基本配置
  const emptyMsg = useMemo(() => ({
    btn: '新建店铺',
    msg: '暂无店铺',
    img: "//file.baixing.net/202012/ead8b543db23259dc9838e753f865732.png",
    disabled: createShopDisabled
  }), [createShopDisabled])

  const initPage = () => {
    Promise.all([getShopStatus(), getShopList()])
  }

  useEffect(() => {
    if (shopStatus && notEmptyObject(shopStatus)) {
      setModalGotoVisible(!shopStatus.isUserPerfect)
      setCreateShopDisabled(!(shopStatus?.isTicketAvailable))
    }
  }, [shopStatus])

  useEffect(() => {
    initPage()
  }, [])

  const handleCloseModal = () => {
    setModalInfoVisible(false)
    setModalActionType('')
  }

  // 表单信息更新后需要操作
  const handleChangeData = () => {
    setModalInfoVisible(false)
    // 因为model里做了店铺数据的缓存 无法重新请求 所以 下次再改
    // initPage()
    window.location.reload()
  }

  const handleCreateShop = () => {
    setModalInfoVisible(true)
    setModalActionType('add')
  }

  const handleEditShop = (shopInfo: ShopInfo) => {
    setModalInitData({
      id: shopInfo.id,
      name: shopInfo.name,
      /** 行业属性 */
      shopType: shopInfo.type as ShopIndustryType,
      /** 域名类型 */
      domainType: shopInfo.domainType,
      /** 店铺域名 */
      domain: shopInfo.domain,
    })
    setModalInfoVisible(true)
    setModalActionType('edit')
  }

  return <>
    <MainTitle title="我的店铺" />
    <div className="container">
      {
        loadingShop ? <Loading /> : shopTotal && shopTotal > 0 ? <div className="my-shop-list">
          <Button type="primary" className="primary-btn p-btn btn" disabled={createShopDisabled} onClick={handleCreateShop}>+新建店铺</Button>
          <div className="shop-list">
            {
              shopStatus && shopList && shopList.map((shopInfo: ShopInfo, index: number) => <ShopBox shopInfo={shopInfo} shopStatus={shopStatus} key={index} handleEditShop={handleEditShop} setCurShopInfo={setCurShopInfo} />)}
          </div>
        </div>
          : <div className="shop-create">
            <EmptyStatus emptyMsg={emptyMsg} onClick={handleCreateShop} />
          </div>
      }
    </div>
    <Modal
      title={shopInfoModalTitle}
      visible={modalInfoVisible}
      onCancel={handleCloseModal}
      width={532}
      footer={null}
      destroyOnClose={true}
    >
      {
        (modalActionType === 'edit' || modalActionType === 'add') && <ShopInfoForm shopInfoData={modalInitData} actionType={modalActionType} onCancal={handleCloseModal} handleChangeData={handleChangeData}></ShopInfoForm>
      }
    </Modal>
    <MyModal
      title="去完善信息"
      content="您的企业资料还未填写，请完善您的企业资料"
      type={ModalType.info}
      closable={true}
      maskClosable={true}
      onCancel={() => setModalGotoVisible(false)}
      onOk={() => history.push('/company-info/base')}
      visible={modalGotoVisible} />
  </>
}

const WrapperShopPage: any = connect((state: ConnectState) => {
  const { shopList, shopTotal, shopStatus, } = state[SHOP_NAMESPACE]
  const { loading } = state
  return { shopList, shopTotal, shopStatus, loadingShop: loading.models.shop }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(ShopPage)

WrapperShopPage.wrappers = ['@/wrappers/path-auth']

export default WrapperShopPage
