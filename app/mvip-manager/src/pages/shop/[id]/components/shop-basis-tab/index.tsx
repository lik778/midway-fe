import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'umi';
import { ShopBasisType, ShopTDKType, ProductType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams, ShopInfo } from '@/interfaces/shop';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import styles from './index.less'
import { ShopStatus } from '@/interfaces/shop';
interface Props {
  type: ShopBasisType;
  // curShopInfo: ShopInfo | null;
  // shopStatus: ShopStatus | null
  // getShopStatus: () => Promise<any>
  [key: string]: any
}

const BasisTab = (props: Props) => {
  const { shopStatus, curShopInfo, getShopStatus } = props
  const params: RouteParams = useParams();
  const history = useHistory()
  const [current, setCurrent] = useState(props.type)
  const menuList = [
    {
      link: `/shop/${params.id}/${ShopBasisType.NAV}`,
      label: "页头设置",
      key: ShopBasisType.NAV,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
      label: "SEO设置",
      key: ShopBasisType.SEO,
      display: true,
    }, {
      // tip: 基础资料设置只有游龙工单申请过，加入白名单的用户才能使用
      link: `/shop/${params.id}/${ShopBasisType.INFO}`,
      label: "基础资料设置",
      key: ShopBasisType.INFO,
      display: false,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.MODULE}`,
      label: "模块管理",
      key: ShopBasisType.MODULE,
      display: true,
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
        if (item.key === ShopBasisType.INFO) {
          if (hasMultiShopRights) {
            item.display = true
          } else if (history.location.pathname.includes(ShopBasisType.INFO)) {
            console.log(JSON.stringify(shopStatus))
            // 如果该用户不是白名单用户 还出现在info页面 则跳到首页
            history.replace('/shop')
          }
        }
        return item
      })
    } else {
      return menuList
    }
  }, [curShopInfo, shopStatus])

  useEffect(() => {
    if (!shopStatus || (shopStatus && Object.keys(shopStatus).length === 0)) {
      getShopStatus()
    }
  }, [])

  const handleClick = (e: { key: any; }) => { setCurrent(e.key) };

  return (
    <div className={styles['tab-container']}>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="a-menu">
        {menuListNow.filter(x => x.display).map(item => {
          return <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
      <Tooltip color='#fff' overlayStyle={{ maxWidth: 600 }} overlayInnerStyle={{ color: '#999', padding: '10px 20px' }} title={<img style={{ width: '500px' }} src="//file.baixing.net/202112/ad8e1bd75395e197bd2d3f32cf7f386f.png" />} placement='bottomLeft'>
        <div className={styles['tip']}>
          <QuestionCircleOutlined className={styles['icon']} />使用指引
        </div>
      </Tooltip>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  const { curShopInfo, shopStatus } = (state as ConnectState)[SHOP_NAMESPACE]
  return { curShopInfo, shopStatus }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
};

//取状态管理里的当前店铺信息，用于判断店铺类型，是否显示SEO设置
export default connect<any, any, Props>(
  mapStateToProps,
  mapDispatchToProps
)(BasisTab)
