import React, { useState, useEffect, useMemo } from 'react';
import { Menu } from 'antd';
import { Link, useHistory } from 'umi';
import { ShopBasisType, ShopTDKType, ProductType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams, ShopInfo } from '@/interfaces/shop';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { ShopStatus } from '@/interfaces/shop';
interface Props {
  type: ShopBasisType;
  curShopInfo: ShopInfo | null;
  shopStatus: ShopStatus | null
  dispatch?: any;
  getShopStatus: () => Promise<any>
}

const BasisTab = (props: Props) => {
  const { shopStatus, curShopInfo, getShopStatus } = props
  const params: RouteParams = useParams();
  const history = useHistory()
  const [current, setCurrent] = useState(props.type)
  const menuList = [
    {
      link: `/shop/${params.id}/${ShopBasisType.NAV}`,
      label: "导航设置",
      key: ShopBasisType.NAV,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.CAROUSEL}`,
      label: "轮播图设置",
      key: ShopBasisType.CAROUSEL,
      display: true,
    }, {
      link: `/shop/${params.id}/${ShopBasisType.CUSTOMER}`,
      label: "自定义设置",
      key: ShopBasisType.CUSTOMER,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
      label: "SEO设置",
      key: ShopBasisType.SEO,
      display: false,
    }, {
      // TODO 基础资料设置只有游龙工单申请过，加入白名单的用户才能使用
      link: `/shop/${params.id}/${ShopBasisType.INFO}`,
      label: "基础资料设置",
      key: ShopBasisType.INFO,
      display: false,
    }
  ]

  //只有B2B的店铺，才会有SEO设置
  // 只有shopStatus.hasMultiShopRights 为true 才会有基础设置
  const menuListNow = useMemo(() => {
    if (curShopInfo && typeof shopStatus?.hasMultiShopRights === 'boolean') {
      const { type } = curShopInfo;
      const isB2B = Boolean(type === ProductType.B2B)
      const { hasMultiShopRights } = shopStatus;
      return menuList.map(item => {
        if (isB2B && item.key === ShopBasisType.SEO) {
          item.display = true
        }
        if (hasMultiShopRights && item.key === ShopBasisType.INFO) {
          item.display = true
        } else if(history.location.pathname.includes('/info')){
          // 如果该用户不是白名单用户 还出现在info页面 则跳到首页
          history.replace('/shop')
        }
        return item
      })
    } else {
      return menuList
    }
  }, [curShopInfo, shopStatus])

  useEffect(() => {
    getShopStatus()
  }, [])

  const handleClick = (e: { key: any; }) => { setCurrent(e.key) };

  return (
    <div>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="a-menu">
        {menuListNow.filter(x => x.display).map(item => {
          return <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
    </div>
  );
}
//取状态管理里的当前店铺信息，用于判断店铺类型，是否显示SEO设置
export default connect((state: ConnectState) => {
  const { curShopInfo, shopStatus } = state[SHOP_NAMESPACE]
  return { curShopInfo, shopStatus }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(BasisTab)
