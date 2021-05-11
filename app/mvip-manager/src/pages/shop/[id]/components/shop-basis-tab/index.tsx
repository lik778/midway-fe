import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopBasisType, ShopTDKType, ProductType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams, ShopInfo } from '@/interfaces/shop';
import { SHOP_NAMESPACE } from '@/models/shop';
import { connect } from 'dva';
interface Props {
  type: ShopBasisType;
  curShopInfo: ShopInfo | undefined;
  dispatch?: any;
}

const BasisTab = (props: Props) => {
  const params: RouteParams = useParams();
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
    }
  ]
  const [current, setCurrent] = useState(props.type)
  const [menuListNow, setMenuList] = useState(menuList)
  const handleClick = (e: { key: any; }) => { setCurrent(e.key) };

  //只有B2B的店铺，才会有SEO设置
  const { curShopInfo } = props
  useEffect(() => {
    if (curShopInfo) {
      const { type } = curShopInfo
      if (type === ProductType.B2B) {
        setMenuList([...menuList.map(item => {
          if (item.key === ShopBasisType.SEO) {
            item.display = true
          }
          return item
        })])
      }
    }
  }, [curShopInfo]);


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
export default connect<{ curShopInfo: ShopInfo }>((state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(BasisTab)
