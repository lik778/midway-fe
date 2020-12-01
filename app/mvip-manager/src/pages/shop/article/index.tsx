import React, { useState } from 'react';
import MainTitle from '@/components/main-title';
import ArticleBox from '@/components/article-box';
import { Menu } from 'antd';
import './index.less';


const menuList = [
  {
    link: "/service",
    label: "服务模块",
    key: 'nav',
  },
  {
    link: "/article",
    label: "文章模块",
    key: 'article',
  }
]
export default (props: any) => {
  const [current, setCurrent] = useState('article')
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
    <div>
      <MainTitle title="xx店铺"/>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="a-menu">
        {menuList.map(item => {
          return  <Menu.Item key={item.key}>
                {item.label}
            </Menu.Item>
        })}
       </Menu>
       <div className="container">
          <ArticleBox />
       </div>
      </div>
    );
}


