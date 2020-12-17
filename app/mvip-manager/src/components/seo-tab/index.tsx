import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopBasisType, ShopTDKType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';


interface Props {
  type: ShopTDKType;
  nav: any[];
}

export default (props: Props) => {
  const params: RouteParams = useParams();
  const [current, setCurrent] = useState(props.type)
  const [nav, setNav] = useState(props.nav)
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  useEffect(() => {
    setNav(props.nav)
  }, [nav]);

  let menuList = [
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
      label: "首页",
      key: ShopTDKType.INDEX,
      position: 'homePage',
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.PRODUCT}`,
      label: "服务页面",
      key: ShopTDKType.PRODUCT,
      position: 'productListPage',
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.ARTICLE}`,
      label: "文章页面",
      key: ShopTDKType.ARTICLE,
      position: 'articleListPage',
    }
  ]

  nav.forEach((n, i) => {
    menuList.map(m => {
      if(m.position === n.position) {
        m.label = n.name
      }
    })
  })


  
  return (
      <Menu onClick={handleClick} selectedKeys={[current]}  className="a-menu">
        {menuList.map(item => {
          return  <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
  );
}
