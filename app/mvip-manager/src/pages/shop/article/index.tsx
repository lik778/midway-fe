import React from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ModuleEmpty from '@/components/shop-module-empty';
import ArticleBox from '@/components/article-box';
import { ShopModuleType } from '@/enums';
import './index.less';

export default (props: any) => {
  const hasData = true;
  let containerComponent;
  if (hasData) {
    containerComponent = (
      <div className="container">
        <ArticleBox/>
      </div>
    )
  } else {
    containerComponent = <ModuleEmpty type={props.type}/>
  }
  return (<div>
    <MainTitle title="百姓网店铺"/>
    <ShopModuleTab type={ShopModuleType.article}/>
    <div className="container">
      { containerComponent }
    </div>
  </div>)
}
