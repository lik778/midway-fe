import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopBasisType } from '@/enums';

const menuList = [
  {
    link: ShopBasisType.NAV,
    label: "导航设置",
    key: ShopBasisType.NAV,
  },
  {
    link: ShopBasisType.CAROUSEL,
    label: "轮播图设置",
    key: ShopBasisType.CAROUSEL,
  },
  {
    link: ShopBasisType.SEO,
    label: "SEO设置",
    key: ShopBasisType.SEO,
  }
]

interface Props {
  type: ShopBasisType;
}

export default (props: Props) => {
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
