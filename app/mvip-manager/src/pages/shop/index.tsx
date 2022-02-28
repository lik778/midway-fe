import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Popover } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import { AnyAction, Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { CreateShopParams, ShopInfo, ShopStatus } from '@/interfaces/shop';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import MyModal, { ModalType } from '@/components/modal';
import ShopBox from './components/shop-box';
import EmptyStatus from './components/empty-status';
import { notEmptyObject } from '@/utils';
import ShopInfoForm from './components/form';
import { ShopIndustryType } from '@/enums';
import styles from './index.less';
import { AppSourceEnum, TicketType } from '@/enums/shop';
import { renewShopApi } from '@/api/shop';
import { errorMessage, successMessage } from '@/components/message';
import { InfoCircleOutlined } from '@ant-design/icons';

interface Props {
  dispatch: Dispatch<AnyAction>;
  shopTotal: number | undefined;
  shopList: ShopInfo[] | null;
  shopStatus: ShopStatus | null;
  loadingShop: boolean,
  getShopStatus: () => Promise<any>
  getShopList: (data?: { reloadList?: boolean }) => Promise<any>
  setShopList: (list: ShopInfo[]) => void
  setCurShopInfo: (ShopInfo: ShopInfo) => Promise<any>
}

const ShopPage: FC<Props> = (props) => {
  const { shopStatus, shopList, shopTotal, loadingShop, getShopStatus, getShopList, setShopList, setCurShopInfo } = props

  // 创建按钮禁用
  const [createShopDisabled, setCreateShopDisabled] = useState<boolean>(true)

  // 控制两个弹窗
  const [modalGotoVisible, setModalGotoVisible] = useState<boolean>(false)
  const [modalInfoVisible, setModalInfoVisible] = useState<boolean>(false)
  const [modalTicketVisible, setModalTicketVisible] = useState<boolean>(false)
  const [modalActionType, setModalActionType] = useState<'add' | 'edit' | ''>('')
  const shopInfoModalTitle = useMemo(() => modalActionType === 'add' ? '新建店铺' : modalActionType === 'edit' ? '修改店铺' : '', [modalActionType])
  // 弹窗的初始化数据
  const [modalInitData, setModalInitData] = useState<CreateShopParams | null>(null)
  // 店铺ticket
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.CREATE)
  const [shopId, setShopId] = useState<number>(0)
  const [ticketId, setTicketId] = useState<number>(0)
  const [submitRenewLoading, setSubmitRenewLoading] = useState<boolean>(false)
  // 店铺ticket可用
  const shopTicketValid = shopStatus && shopStatus.userValidTickets && shopStatus.userValidTickets.length
  // 空状态基本配置
  const emptyMsg = useMemo(() => ({
    btn: '新建店铺',
    msg: '暂无店铺',
    img: "//file.baixing.net/202012/ead8b543db23259dc9838e753f865732.png",
    disabled: createShopDisabled
  }), [createShopDisabled])


  useEffect(() => {
    if (shopStatus && notEmptyObject(shopStatus)) {
      setModalGotoVisible(!shopStatus.isUserPerfect)
      setCreateShopDisabled(!(shopStatus?.isTicketAvailable))
    }
  }, [shopStatus])

  useEffect(() => {
    if (shopTicketValid) {
      const defaultTicketId = shopStatus && shopStatus.userValidTickets
        && shopStatus.userValidTickets.length && shopStatus.userValidTickets[0].id
      setTicketId(defaultTicketId || 0)
    }
  }, [shopTicketValid])


  const initPage = () => {
    Promise.all([getShopStatus(), getShopList({ reloadList: true })])
  }

  useEffect(() => {
    initPage()
  }, [])

  const handleCloseModal = () => {
    setModalInfoVisible(false)
    setModalActionType('')
    setModalInitData(null)
  }

  // 表单信息更新后需要操作
  const handleChangeData = () => {
    setModalInfoVisible(false)
    // 因为model里做了店铺数据的缓存 无法重新请求 所以 下次再改
    // initPage()
    window.location.reload()
  }

  const handleCreateShop = () => {
    if (shopStatus?.isUserPerfect) {
      setTicketType(TicketType.CREATE)
      setModalTicketVisible(true)
    } else {
      setModalGotoVisible(true)
    }
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

  // 续费
  const renewHandle = async () => {
    if (ticketType === TicketType.CREATE) {
      setModalTicketVisible(false)
      setModalInfoVisible(true)
      setModalActionType('add')
    } else if (ticketType === TicketType.RENEW) {
      setSubmitRenewLoading(true)
      const { success, message } = await renewShopApi({ shopId, ticketId })
      setSubmitRenewLoading(false)
      if (success) {
        successMessage('续费成功')
        setModalTicketVisible(false)
        initPage()
      } else {
        errorMessage(message)
      }
    }
  }

  return <>
    <MainTitle title="我的店铺" />
    <div className={styles["shop-container"]}>
      {
        loadingShop ? <Loading /> : shopTotal && shopTotal > 0 ? <>
          <div className={styles['header']}>
            <Button type="primary" className={`${styles['add-btn']} primary-btn`} disabled={createShopDisabled} onClick={handleCreateShop}>+新建店铺</Button>
            <div className={styles['add-tip']}>
              {
                shopStatus?.userValidTickets?.length ? `（您当前还有 ${shopStatus?.userValidTickets?.length} 个店铺创建额度）` : <></>
              }
            </div>
          </div>

          <div className={styles["shop-list"]}>
            {
              shopStatus && shopList && shopList.map((shopInfo: ShopInfo, index: number) =>
                <ShopBox shopList={shopList} shopInfo={shopInfo} shopStatus={shopStatus} key={index} handleEditShop={handleEditShop} setShopList={setShopList} setCurShopInfo={setCurShopInfo}
                  setTicketModal={(shopId: number) => {
                    setTicketType(TicketType.RENEW)
                    setModalTicketVisible(true)
                    setShopId(shopId)
                  }} getShopList={getShopList} />)}
          </div>
        </>
          : <div className={styles["shop-create"]} >
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
        (modalActionType === 'edit' || modalActionType === 'add') && <ShopInfoForm ticketId={ticketId} shopInfoData={modalInitData} actionType={modalActionType} onCancal={handleCloseModal} handleChangeData={handleChangeData}></ShopInfoForm>
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
    <Modal
      width={650}
      className={styles["my-modal-box"]}
      title={'选择可用的店铺额度'}
      maskClosable={false}
      okText={"确定"}
      okButtonProps={{ disabled: !shopTicketValid }}
      onOk={renewHandle}
      confirmLoading={submitRenewLoading}
      onCancel={() => setModalTicketVisible(false)}
      visible={modalTicketVisible}
    >
      {shopTicketValid ?
        <div className={styles["ticket-list"]} >
          {shopStatus?.userValidTickets?.map((t, index) => {
            return (
              <div onClick={() => t.quota.seoQuota ? '' : setTicketId(t.id)} className={`${styles['ticket-list-item']} ${t.quota.seoQuota ? styles['ticket-list-item_diable'] : ''} ${ticketId === t.id ? styles['active-item'] : ''}`} key={index} data-id={t.id}>
                <span className="item">钻石店铺时长：<strong>{ticketType === TicketType.CREATE ? t.createDays : t.renewDays}</strong>天</span>
                (<span className="item">发文数量：<strong>{t.quota.postQuota}</strong>篇</span>
                <span className="item">AI发文数：<strong>{t.quota.maxAiArticles}</strong></span>
                {t.quota.seoQuota ? <span className="item">SEO时长：<strong>{t.quota.seoQuota}天</strong></span> : null})
                {t.quota.seoQuota ? <Popover content={<><p>1.当前店铺的seo云推广正在服务期，暂不支持连续使用</p><p>2.如有多个seo云推广权益的店铺额度请分别新建店铺使用</p></>} title="说明：">
                    <InfoCircleOutlined />
                </Popover> : null}
              </div>
            )
          })}
        </div> :
        '暂无可选择额度'}
    </Modal>
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
