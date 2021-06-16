
import React from 'react';
import { history } from 'umi';
import './index.less';
import moment from 'moment';
import { ShopStatus as ShopStatusEnum } from '@/enums/shop';
import { ShopInfo, ShopStatus } from '@/interfaces/shop';

interface Props {
  shopInfo: ShopInfo,
  shopStatus: ShopStatus
  handleEditShop: (shopInfo: ShopInfo) => void
  setCurShopInfo: (shopInfo: ShopInfo) => void
  setTicketModal: (shopId: number) => void
}

export default (props: Props) => {
  const { shopInfo, handleEditShop, shopStatus, setCurShopInfo, setTicketModal } = props

  const getStatusClassName = (status: any) => {
    switch (status) {
      case ShopStatusEnum.ONLINE:
        return 's-active';
        break;
      case ShopStatusEnum.EXPIRED:
        return 's-expired';
        break;
      default:
        return 's-offline';
        break;
    }
  }
  const getStatusTxt = (status: any) => {
    switch (status) {
      case ShopStatusEnum.ONLINE:
        return '生效中';
        break;
      case ShopStatusEnum.OFFLINE_SENSITIVE:
        return '审核驳回';
        break;
      case ShopStatusEnum.EXPIRED:
        return '已失效';
        break;
      default:
        return '已下线';
        break;
    }
  }

  const linkTo = (link: string) => {
    if (shopStatus.isUserPerfect || false) {
      setCurShopInfo(shopInfo)
      history.push(link)
    }
  }

  const genEditBtn = () => {
    if ([ShopStatusEnum.ONLINE, ShopStatusEnum.OFFLINE_SENSITIVE].includes(shopInfo.status)) {
      return (<span className="s-edit" onClick={() => {
        handleEditShop(shopInfo)
      }}></span>)
    }
  }

  const genLinkPanel = () => {
    if ([ShopStatusEnum.ONLINE, ShopStatusEnum.OFFLINE_SENSITIVE].includes(shopInfo.status)) {
      return (<div className="s-btn">
        <span onClick={() => linkTo(`/shop/${shopInfo.id}/nav`)} >基础设置</span>
        <span onClick={() => linkTo(`/shop/${shopInfo.id}/product`)}>内容管理</span>
      </div>)
    }
  }

  const genRenewBtn = (shopInfo: ShopInfo) => {
    if (shopInfo.status === ShopStatusEnum.ONLINE) {
      return <span onClick={() => setTicketModal(shopInfo.id)} className="renew-btn">续费</span>
    } else if (shopInfo.status === ShopStatusEnum.EXPIRED) {
      return <span onClick={() => setTicketModal(shopInfo.id)} className="renew-btn locked">解锁</span>
    }
  }

  return (
    <div className="shop-box">
      <div className="s-img">
        <a href={shopInfo.shopDomain} target="_blank">
          <img src={shopInfo.thumb} />
          <div className={`s-status ${ getStatusClassName(shopInfo.status) }`}>{ getStatusTxt(shopInfo.status) }</div>
        </a>
      </div>
      <div className="s-title" >
        <a href={shopInfo.shopDomain} target="_blank">{shopInfo.name}</a>
        {genEditBtn()}
      </div>
      <div className="dead-time">
        到期时间：{ moment(shopInfo.expiredTime * 1000).format('YYYY/MM/DD') }
        { genRenewBtn(shopInfo) }
      </div>
      { genLinkPanel()}
    </div>
  );
}
