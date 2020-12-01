import React, { useState } from 'react';
import MainTitle from '@/components/main-title';
import ArticleBox from '@/components/article-box';
import { Menu } from 'antd';
import { Link } from 'umi';
import './index.less'

const menuList = [
  {
    link: "category",
    label: "服务模块",
    key: 'category',
  },
  {
    link: "article",
    label: "文章模块",
    key: 'article',
  }
]
export default (props: any) => {
  const path = props.location.pathname.split('/')
  const [current, setCurrent] = useState(path[2])
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
    <div>
      <MainTitle title="百姓网店铺"/>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="a-menu">
        {menuList.map(item => {
          return  <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
      <div className="container">
        <ArticleBox />
      </div>
    </div>
  );
}

