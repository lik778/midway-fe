
import React from 'react';
import ShopBasisTab from '@/components/shop-basis-tab';
import MainTitle from '@/components/main-title';
import { ShopBasisType } from '@/enums';
import { Link } from 'umi';
import { ShopInfo } from '@/interfaces/shop';
import './index.less';
import { connect } from 'dva';

interface Props {
  type: ShopBasisType;
  shopInfo?: ShopInfo | null;
}

const BasicHeader = (props: Props) => {
  const { type, shopInfo } = props
  return (
    <div className="basis-header">
      { shopInfo?.name && <Link className="arrow" to="/shop"></Link> }
      { shopInfo?.name && <MainTitle title={shopInfo?.name}/> }
      { shopInfo?.name && <a className="visit-online"href={shopInfo?.shopDomain} target="_blank">访问线上</a> }
      <ShopBasisTab type={type}/>
    </div>
  );
}

const mapStateToProps = (state: any): any => {
  const { shopInfo } = state.shop;
  return { shopInfo }
}

export default connect(mapStateToProps)(BasicHeader)
