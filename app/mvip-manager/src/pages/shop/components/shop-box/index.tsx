
import React from 'react';
import { history } from 'umi';
import './index.less';
import moment from 'moment';
import { SET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop';
import { ShopInfo, ShopStatus } from '@/interfaces/shop';

interface Props {
  shopInfo: ShopInfo,
  shopStatus: ShopStatus
  handleEditShop: (shopInfo: ShopInfo) => void
  setCurShopInfo: (shopInfo: ShopInfo) => void
}

export default (props: Props) => {
  const { shopInfo, handleEditShop, shopStatus, setCurShopInfo } = props
  const status = shopInfo.status === 1 ? 's-active' : 's-offline'
  const statusTxt = shopInfo.status === 1 ? '生效中' : (shopInfo.status === 2 ? '审核驳回' : '已下线')

  const linkTo = (link: string) => {
    if (shopStatus.isUserPerfect || false) {
      setCurShopInfo(shopInfo)
      history.push(link)
    }
  }

  const genEditBtn = () => {
    if (shopInfo.status === 1 || shopInfo.status === 2) {
      return (<span className="s-edit" onClick={() => {
        handleEditShop(shopInfo)
      }}></span>)
    }
  }

  const genLinkPanel = () => {
    if (shopInfo.status === 1 || shopInfo.status === 2) {
      return (<div className="s-btn">
        <span onClick={() => linkTo(`/shop/${shopInfo.id}/nav`)} >基础设置</span>
        <span onClick={() => linkTo(`/shop/${shopInfo.id}/product`)}>内容管理</span>
      </div>)
    }
  }

  return (
    <div className="shop-box">
      <div className="s-img">
        <a href={shopInfo.shopDomain} target="_blank">
          <img src={shopInfo.thumb} />
          <div className={`s-status ${status}`}>{statusTxt}</div>
        </a>
      </div>
      <div className="s-title" >
        <a href={shopInfo.shopDomain} target="_blank">{shopInfo.name}</a>
        {genEditBtn()}
      </div>
      <div className="dead-time">
        到期时间：{moment(shopInfo.expiredTime * 1000).format('YYYY/MM/DD')}
      </div>
      { genLinkPanel()}
    </div>
  );
}
