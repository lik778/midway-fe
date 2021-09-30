import React, { useEffect } from 'react'
import MainTitle from '@/components/main-title'
import ShopModuleTab from '../shop-module-tab'
import { ShopModuleType, ProductType } from '@/enums'
import { Link, useParams } from 'umi'
import { connect, Dispatch } from 'dva'
import { ShopInfo } from '@/interfaces/shop'
import { BaseProps } from '@/interfaces/base'
import { GET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop'

interface Props extends BaseProps {
  type: ShopModuleType;
  curShopInfo?: ShopInfo | null;
  dispatch: Dispatch;
}

const ContentHeader = (props: Props) => {
  const { type, curShopInfo } = props
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    props.dispatch({ type: `${SHOP_NAMESPACE}/${GET_CUR_SHOP_INFO_ACTION}`, id: Number(id) })
  }, [])
  return (
    <div className="content-header">
      {
        curShopInfo?.name && <>
          <Link className="arrow" to="/shop"></Link>
          <MainTitle title={curShopInfo?.name} />
          <a className="visit-online" href={curShopInfo?.shopDomain} target="_blank">访问线上</a>
        </>
      }
      <ShopModuleTab
        type={type}
        tabType={curShopInfo?.type === ProductType.B2B ? '产品' : '服务'}
      />
    </div>
  );
}

const mapStateToProps = (state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}

export default connect(mapStateToProps)(ContentHeader)
