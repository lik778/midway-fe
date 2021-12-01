import React, { useState, useEffect, FC } from 'react';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { ShopInfo, ShopStatus } from '@/interfaces/shop';
import BasisHeader from '../../../components/basis-header';
import SeoTab from '../../components/seo-tab';
import { ShopBasisType, ShopTDKType, ShopTDKPosition } from '@/enums';
import { errorMessage } from '@/components/message';
import { useParams } from 'umi';
import { RouteParams, TdkDetail, TdkNav, TdkSaveMeta } from '@/interfaces/shop';
import { getMetaDetailApi } from '@/api/shop';
import Loading from '@/components/loading';
import './index.less'
import TdkForm from './components/page-form'
import AreaForm from './components/area-form'
import Optimization from './components/optimization'
import { mockData } from '@/utils';

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
  const [editData, setEditData] = useState<TdkDetail | any>()
  const [loading, setLoading] = useState<any>(true)
  const [nav, setNav] = useState<TdkNav[]>([])
  const [isPageSeo] = useState<boolean>([ShopTDKType.INDEX, ShopTDKType.PRODUCT, ShopTDKType.ARTICLE].includes(pageType))

  const getMetaDetail = async () => {
    const res = await getMetaDetailApi(shopId, {
      position: pagePosition!
    })
    if (res.success) {
      const tkd = res.data.tkd
      const navigation = res.data.navigation
      setNav(navigation)
      setEditData(tkd)
      setLoading(false)
    } else {
      errorMessage(res.message)
    }
  }

  const getAreaDetail = async () => {
    const res = await mockData('data', {
      area: ['地区1', '地区2', '地区3', '地区4'],
      suffix: ['后缀1', '后缀2', '后缀3', '后缀4']
    })
    if (res.success) {
      setNav([])
      setEditData(res.data)
      setLoading(false)
    } else {
      errorMessage(res.message)
    }
  }

  const getBtnStatus = async () => {
    const res = await mockData('data', {
      area: ['地区1', '地区2', '地区3', '地区4'],
      suffix: ['后缀1', '后缀2', '后缀3', '后缀4']
    })
    if (res.success) {
      setNav([])
      setEditData(res.data)
      setLoading(false)
    } else {
      errorMessage(res.message)
    }
  }

  useEffect(() => {
    if (isPageSeo) {
      getMetaDetail()
    } else if (pageType === ShopTDKType.AREA) {
      getAreaDetail()
    } else if (pageType === ShopTDKType.OPTIMIZATION) {
      getBtnStatus()
    }
  }, [])


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
          {
            loading && <Loading />
          }
          {
            !loading && <div className="t-content">
              <div className="t-menu">
                <SeoTab curShopInfo={curShopInfo} shopStatus={shopStatus} type={pageType} nav={nav} />
              </div>
              <div className="t-form">
                {
                  isPageSeo && <TdkForm curShopInfo={curShopInfo} id={params.id} editData={editData!} pagePosition={pagePosition!} pageType={pageType}></TdkForm>
                }
                {
                  pageType === ShopTDKType.AREA && <AreaForm id={params.id} curShopInfo={curShopInfo} onSubmitSuccess={handleAreaSuffixUpdateSuccess}></AreaForm>
                }
                {
                  pageType === ShopTDKType.OPTIMIZATION && <Optimization id={params.id} curShopInfo={curShopInfo} onSubmitSuccess={handleOptimizationSuccess}></Optimization>
                }
              </div>
            </div>
          }
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
