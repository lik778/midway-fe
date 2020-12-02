import React, { ReactComponentElement, useState } from 'react';
import MainTitle from '@/components/main-title';
import ArticleBox from '@/components/article-box';
import ModuleList from '@/components/shop-module-list';
import ModuleEmpty from '@/components/shop-module-empty';
import { Menu } from 'antd';
import { Link } from 'umi';
import './index.less'
import { ShopModuleType } from '@/enums';

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

interface Props {
  type: ShopModuleType;
}

export default (props: Props) => {
  const [current, setCurrent] = useState(props.type)
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };
  const hasData = true;
  let containerComponent;
  if (hasData) {
    containerComponent = (
      <div className="container">
        <ArticleBox/>
        <ModuleList/>
      </div>
    )
  } else {
    containerComponent = <ModuleEmpty type={props.type}/>
  }

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
        { containerComponent }
      </div>
    </div>
  );
}

