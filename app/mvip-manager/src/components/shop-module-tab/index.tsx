import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopModuleType } from '@/enums';

const menuList = [
  {
    link: ShopModuleType.PRODUCT,
    label: "服务模块",
    key: ShopModuleType.PRODUCT
  },
  {
    link: ShopModuleType.ARTICLE,
    label: "文章模块",
    key: ShopModuleType.ARTICLE
  }
]

interface Props {
  type: ShopModuleType;
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
