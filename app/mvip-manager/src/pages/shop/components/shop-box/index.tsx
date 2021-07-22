
import React from 'react';
import { history } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons'
import styles from './index.less';
import moment from 'moment';
import { ShopStatus as ShopStatusEnum, ShopVersionStatusEnum } from '@/enums/shop';
import { ShopInfo, ShopStatus } from '@/interfaces/shop';
import { useMemo } from 'react';
import { updateShopVersionApi } from '@/api/shop'

interface Props {
  shopList: ShopInfo[]
  shopInfo: ShopInfo,
  shopStatus: ShopStatus
  handleEditShop: (shopInfo: ShopInfo) => void
  setCurShopInfo: (shopInfo: ShopInfo) => void
  setTicketModal: (shopId: number) => void
  getShopList: (data?: { reloadList?: boolean }) => Promise<any>
  setShopList: (list: ShopInfo[]) => void
}

const ShopBox = (props: Props) => {
  const { shopList, shopInfo, handleEditShop, shopStatus, setCurShopInfo, setTicketModal, getShopList, setShopList } = props

  // 1 待发布 2审核中 3 审核驳回  4 审核通过  0 无审核
  const versionStatus = useMemo(() => {
    if (shopInfo.status === ShopStatusEnum.ONLINE && shopInfo.newestDataVersion) {
      switch (shopInfo.newestDataVersion.status) {
        case ShopVersionStatusEnum.INIT:
          return 1;
        case ShopVersionStatusEnum.VERIFY:
          return 2;
        case ShopVersionStatusEnum.MACHINE_REJECT:
        case ShopVersionStatusEnum.HUMAN_REJECT:
          return 3;
        case ShopVersionStatusEnum.APPROVE:
          return 4;
      }
    } else {
      return 0
    }
  }, [shopInfo])

  const versionRejectTip = useMemo(() => {
    if (versionStatus === 3) {
      const memo = shopInfo.newestDataVersion?.memo.slice(0, 19)
      return <div className={styles['version-reject-tip']}>
        <ExclamationCircleFilled className={styles['icon']} />
        <div className={styles['content']}>
          <div className={styles['title']}>最新修改未通过审核</div>
          <div className={styles['text']}>{`${memo ? memo + (memo.length >= 20 ? '...' : '') : ''}`}</div>
          <div className={styles['text']}>站内信查看详情</div>
        </div>
      </div>
    } else {
      return <></>
    }
  }, [versionStatus])

  const StatusBox = useMemo(() => {
    switch (shopInfo.status) {
      case ShopStatusEnum.ONLINE:
        if (shopInfo.newestDataVersion) {
          switch (shopInfo.newestDataVersion.status) {
            case ShopVersionStatusEnum.INIT:
              return <></>;
            case ShopVersionStatusEnum.VERIFY:
              return <div className={`${styles['s-status']} ${styles["s-red"]}`}>审核中</div>;
            case ShopVersionStatusEnum.MACHINE_REJECT:
            case ShopVersionStatusEnum.HUMAN_REJECT:
              return <div className={`${styles['s-status']} ${styles["s-red"]}`}>修改未生效</div>;
            case ShopVersionStatusEnum.APPROVE:
              return <div className={`${styles['s-status']} ${styles["s-green"]}`}>生效中</div>;
          }
        } else {
          return <div className={`${styles['s-status']} ${styles["s-green"]}`}>生效中</div>;
        }
      case ShopStatusEnum.OFFLINE_SENSITIVE:
        return <div className={`${styles['s-status']} ${styles["s-red"]}`}>审核驳回</div>;
      case ShopStatusEnum.EXPIRED:
        return <div className={`${styles['s-status']} ${styles["s-red"]}`}>已失效</div>;
      default:
        return <div className={`${styles['s-status']} ${styles["s-gray"]}`}>已下线</div>;
    }
  }, [shopInfo])

  const linkTo = (link: string) => {
    if (shopStatus.isUserPerfect || false) {
      setCurShopInfo(shopInfo)
      history.push(link)
    }
  }

  const genEditBtn = useMemo(() => {
    if ([ShopStatusEnum.ONLINE, ShopStatusEnum.OFFLINE_SENSITIVE].includes(shopInfo.status)) {
      return (<span className={styles["s-edit"]} onClick={() => {
        handleEditShop(shopInfo)
      }}></span>)
    }
  }, [shopInfo, handleEditShop])

  const genLinkPanel = useMemo(() => {
    if ([ShopStatusEnum.ONLINE, ShopStatusEnum.OFFLINE_SENSITIVE].includes(shopInfo.status)) {
      return (<div className={styles["s-btn"]} >
        <span onClick={() => linkTo(`/shop/${shopInfo.id}/nav`)} >基础设置</span>
        <span onClick={() => linkTo(`/shop/${shopInfo.id}/product`)}>内容管理</span>
      </div>)
    }
  }, [shopInfo])

  const genRenewBtn = useMemo(() => {
    if (shopInfo.status === ShopStatusEnum.ONLINE) {
      return <span onClick={() => setTicketModal(shopInfo.id)} className={styles["renew-btn"]} >续费</span>
    } else if (shopInfo.status === ShopStatusEnum.EXPIRED) {
      return <span onClick={() => setTicketModal(shopInfo.id)} className={`${styles["renew-btn"]} ${styles["locked"]}`} >解锁</span>
    }
  }, [shopInfo])

  const handleClickSubmit: React.MouseEventHandler<HTMLSpanElement> = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    const res = await updateShopVersionApi(shopInfo.newestDataVersion!.id, shopInfo.id)
    if (res.success) {
      setShopList(shopList.map(item => {
        if (item.id === shopInfo.id) {
          return {
            ...shopInfo,
            newestDataVersion: res.data
          }
        } else {
          return item
        }
      }))
    }
  }

  return (
    <div className={styles["shop-box"]}>
      <div className={styles["s-img"]} >
        <a href={shopInfo.shopDomain} target="_blank">
          <img src={shopInfo.thumb} />
          {StatusBox}
          {versionRejectTip}
        </a>
      </div>
      <div className={styles["s-title"]}  >
        <a href={shopInfo.shopDomain} target="_blank">
          {shopInfo.name}
          {
            versionStatus === 1 && <span className={styles['submit']} onClick={handleClickSubmit}>发布</span>
          }
        </a>
        {genEditBtn}
      </div>
      <div className={styles["dead-time"]}>
        到期时间：{moment(shopInfo.expiredTime * 1000).format('YYYY/MM/DD')}
        {genRenewBtn}
      </div>
      {genLinkPanel}
    </div>
  );
}

export default ShopBox
