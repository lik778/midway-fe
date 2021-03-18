import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopBasisType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
interface Props {
  type: ShopBasisType;
}

export default (props: Props) => {
  const params: RouteParams = useParams();
  const menuList = [
    {
      link: `/shop/${params.id}/${ShopBasisType.NAV}`,
      label: "导航设置",
      key: ShopBasisType.NAV,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.CAROUSEL}`,
      label: "轮播图设置",
      key: ShopBasisType.CAROUSEL,
    },
    // {
    //   link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
    //   label: "SEO设置",
    //   key: ShopBasisType.SEO,
    // }
  ]
  const [current, setCurrent] = useState(props.type)
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
    <div>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="a-menu">
        {menuList.map(item => {
          return  <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
    </div>
  );
}
