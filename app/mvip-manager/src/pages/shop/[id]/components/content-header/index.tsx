import React, { useEffect, useState } from 'react'
import MainTitle from '@/components/main-title'
import ShopModuleTab from '../shop-module-tab'
import { ShopModuleType, ProductType } from '@/enums'
import { Link, useParams } from 'umi'
import { connect, Dispatch } from 'dva'
import { AdviceRecord, RouteParams, ShopInfo } from '@/interfaces/shop'
import { BaseProps } from '@/interfaces/base'
import { GET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop'
import { setAdviceRecordApi } from '@/api/shop'
import { errorMessage, successMessage } from '@/components/message'
import AdivceRecord from '../advice-record'

interface Props extends BaseProps {
  type: ShopModuleType;
  onChangeType(type: ProductType): void;
  curShopInfo?: ShopInfo | null;
  dispatch: Dispatch;
}

const ContentHeader = (props: Props) => {
  const { type, curShopInfo } = props
  const { id } = useParams<{ id: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const params: RouteParams = useParams();
  useEffect(() => {
    props.dispatch({ type: `${SHOP_NAMESPACE}/${GET_CUR_SHOP_INFO_ACTION}`, id: Number(id) })
  }, [])
  const showModal = () => {
    setIsModalVisible(true)
  }
  const onCancel = () => {
    setIsModalVisible(false)
  }
  const sumbit = async (values: AdviceRecord) => {
    setFormLoading(true)
    const res = await setAdviceRecordApi(Number(params.id), values)
    setFormLoading(false)
    if (res?.success) {
      successMessage('提交成功')
    } else {
      errorMessage('提交失败')
    }
    setIsModalVisible(false)
  }
  return (
    <>
      <div className="content-header">
        {
          curShopInfo?.name && <>
            <Link className="arrow" to="/shop"></Link>
            <MainTitle title={curShopInfo?.name} />
            <a className="feed-back" href="#" onClick={showModal}>我要吐槽</a>
            <a className="visit-online" href={curShopInfo?.shopDomain} target="_blank">访问线上</a>
          </>
        }
        <ShopModuleTab
          type={type}
          tabType={curShopInfo?.type === ProductType.B2B ? '产品' : '服务'}
        />
      </div>
      <AdivceRecord isModalVisible={isModalVisible} sumbit={sumbit} onCancel={onCancel} loading={formLoading} />
    </>
  );
}

const mapStateToProps = (state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}

export default connect(mapStateToProps)(ContentHeader)
