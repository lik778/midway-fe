import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import { ShopTDKType } from '@/enums';

const menuList = [
  {
    link: ShopTDKType.INDEX,
    label: "首页",
    key: ShopTDKType.INDEX,
  },
  {
    link: ShopTDKType.PRODUCT,
    label: "服务页面",
    key: ShopTDKType.PRODUCT,
  },
  {
    link: ShopTDKType.ARTICLE,
    label: "文章页面",
    key: ShopTDKType.ARTICLE,
  }
]

interface Props {
  type: ShopTDKType;
}

export default (props: Props) => {
  const [current, setCurrent] = useState(props.type)
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
    <div>
      <Menu onClick={handleClick} selectedKeys={[current]}  className="a-menu">
        {menuList.map(item => {
          return  <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
    </div>
  );
}
