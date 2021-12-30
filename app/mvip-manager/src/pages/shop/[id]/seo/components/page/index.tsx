import React, { useState, useEffect, FC } from 'react';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { ShopInfo, ShopStatus } from '@/interfaces/shop';
import BasisHeader from '../../../components/basis-header';
import SeoTab from '../../components/seo-tab';
import { ShopBasisType, ShopTDKType, ShopTDKPosition } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import './index.less'
import TdkForm from './components/page-form'
import AreaForm from './components/area-form'
import Optimization from './components/optimization'


interface Props {
  pagePosition?: ShopTDKPosition
  pageType: ShopTDKType,
  curShopInfo?: ShopInfo | null
  shopStatus?: ShopStatus | null
  getShopList?: (data?: { reloadList?: boolean }) => any
  getCurShopInfo?: (id: number, data?: { reloadData?: boolean }) => any
}
const SeoPage: FC<Props> = (props) => {
  const { pageType, pagePosition, curShopInfo = null, shopStatus = null, getShopList, getCurShopInfo } = props
  const params: RouteParams = useParams();
  const shopId = Number(params.id)
  const [isPageSeo] = useState<boolean>([ShopTDKType.INDEX, ShopTDKType.PRODUCT, ShopTDKType.ARTICLE].includes(pageType))

  // 因为setCurShopInfo真懒改，请求两个吧。累了。
  // 地址提交后更新model里的数据
  const handleAreaSuffixUpdateSuccess = () => {
    Promise.all([getShopList!({ reloadList: true }), getCurShopInfo!(shopId, { reloadData: true })])
  }

  // 优化成功后更新model里的数据
  const handleOptimizationSuccess = () => {
    Promise.all([getShopList!({ reloadList: true }), getCurShopInfo!(shopId, { reloadData: true })])
  }

  return (
    <>
      <BasisHeader {...props} type={ShopBasisType.SEO} />
      <div className="container">
        <div className="tdk-box">
          <h4>
            分页设置TDK
          </h4>
          <div className="t-content">
            <div className="t-menu">
              <SeoTab curShopInfo={curShopInfo} shopStatus={shopStatus} type={pageType} />
            </div>
            <div className="t-form">
              {
                isPageSeo && <TdkForm curShopInfo={curShopInfo} id={params.id} pagePosition={pagePosition!} pageType={pageType}></TdkForm>
              }
              {
                pageType === ShopTDKType.AREA && <AreaForm id={params.id} curShopInfo={curShopInfo} onSubmitSuccess={handleAreaSuffixUpdateSuccess}></AreaForm>
              }
              {
                pageType === ShopTDKType.OPTIMIZATION && <Optimization id={params.id} curShopInfo={curShopInfo} onSubmitSuccess={handleOptimizationSuccess}></Optimization>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default connect((state: ConnectState) => {
  const { curShopInfo, shopStatus } = state[SHOP_NAMESPACE];
  return { curShopInfo, shopStatus }
}, (dispatch: Dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(SeoPage)
