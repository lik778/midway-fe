import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopBasisType, ShopTDKType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';


interface Props {
  type: ShopTDKType;
}

export default (props: Props) => {
  const params: RouteParams = useParams();
  const [current, setCurrent] = useState(props.type)
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  const menuList = [
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
      label: "首页",
      key: ShopTDKType.INDEX,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.PRODUCT}`,
      label: "服务页面",
      key: ShopTDKType.PRODUCT,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.ARTICLE}`,
      label: "文章页面",
      key: ShopTDKType.ARTICLE,
    }
  ]

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
