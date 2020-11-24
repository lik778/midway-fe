import React, { useState } from 'react';
import { Menu } from 'antd';

const menuList = [
  {
    link: "/nav",
    label: "导航设置",
    key: 'nav',
  },
  {
    link: "/carousel",
    label: "轮播图设置",
    key: 'carousel',
  },
  {
    link: "/seo",
    label: "SEO设置",
    key: 'seo',
  }
]
export default (props: any) => {
  const [current, setCurrent] = useState('nav')
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        {menuList.map(item => {
          return  <Menu.Item key={item.key}>
                {item.label}
            </Menu.Item>
        })}
       </Menu>
    );
}


