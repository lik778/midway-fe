import React from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { ShopModuleType, ProductType } from '@/enums';
import { Link } from 'umi';
import { connect } from 'dva';
import { ShopInfo } from '@/interfaces/shop';
import { BaseProps } from '@/interfaces/base';

interface Props extends BaseProps {
  type: ShopModuleType;
  onChangeType(type:ProductType):void;
  shopInfo?: ShopInfo | null;
}

const ContentHeader = (props: Props) => {
  const { type, shopInfo } = props
  return (
    <div className="content-header">
      { shopInfo?.name && <Link className="arrow" to="/shop"></Link> }
      { shopInfo?.name && <MainTitle title={shopInfo?.name}/> }
      { shopInfo?.name && <a className="visit-online"href={shopInfo?.shopDomain} target="_blank">访问线上</a>}
      <ShopModuleTab type={type} tabType={shopInfo?.type === ProductType.B2B ? '产品' : '服务'}/>
    </div>
  );
}

const mapStateToProps = (state: any): any => {
  const { shopInfo } = state.shop;
  return { shopInfo }
}

export default connect(mapStateToProps)(ContentHeader)
