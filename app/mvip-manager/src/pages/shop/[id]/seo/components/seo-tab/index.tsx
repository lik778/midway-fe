import React, { useState, useEffect, useMemo } from 'react';
import { Menu } from 'antd';
import { Link, useParams } from 'umi';
import { ShopInfo, ShopStatus } from '@/interfaces/shop';
import { ProductType, ShopBasisType, ShopTDKType } from '@/enums';
import { RouteParams } from '@/interfaces/shop';

interface Props {
  type: ShopTDKType;
  curShopInfo: ShopInfo | null,
  shopStatus: ShopStatus | null
}



const SeoTab = (props: Props) => {
  const { type, curShopInfo, shopStatus } = props
  console.log('curShopInfo', curShopInfo)
  const params: RouteParams = useParams();

  const menuList = useMemo(() => {
    let menuList = [
      {
        link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
        label: "首页",
        key: ShopTDKType.INDEX,
        position: 'homePage',
      },
      {
        link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.PRODUCT}`,
        label: "产品服务",
        key: ShopTDKType.PRODUCT,
        position: 'productListPage',
      },
      {
        link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.ARTICLE}`,
        label: "新闻资讯",
        key: ShopTDKType.ARTICLE,
        position: 'articleListPage',
      }

    ]

    if (curShopInfo && curShopInfo.type === ProductType.B2B) {
      menuList.push({
        link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.AREA}`,
        label: "通用地域/后缀",
        key: ShopTDKType.AREA,
        position: ''
      })
      if (curShopInfo && curShopInfo.canSeoFlag) {
        menuList.push({
          link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.OPTIMIZATION}`,
          label: "SEO优化",
          key: ShopTDKType.OPTIMIZATION,
          position: ''
        })
      }
    }

    return menuList
  }, [curShopInfo, shopStatus])

  return (
    <Menu selectedKeys={[type]} className="a-menu">
      {
        menuList.map(item => <Menu.Item key={item.key}>
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>)
      }
    </Menu>
  );
}

export default SeoTab
