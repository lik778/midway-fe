import React, { FC, useEffect, useState } from 'react';
import ShopBasisTab from '../shop-basis-tab';
import ShopModuleTab from '../shop-module-tab'
import MainTitle from '@/components/main-title';
import { ShopBasisType, ShopModuleType, ProductType } from '@/enums';
import { Link, useParams } from 'umi';
import { ShopInfo } from '@/interfaces/shop';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { BaseProps } from '@/interfaces/base'
import { GET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop';

import AdivceRecord from '../advice-record/index'
interface Props extends BaseProps {
  type: ShopBasisType | ShopModuleType;
  curShopInfo?: ShopInfo | null;
  dispatch: Dispatch;
}

const BasicHeader: FC<Props> = (props) => {
  const { type, curShopInfo } = props
  const { id } = useParams<{ id: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    props.dispatch({ type: `${SHOP_NAMESPACE}/${GET_CUR_SHOP_INFO_ACTION}`, id: Number(id) })
  }, [])
  const showModal = () => {
    setIsModalVisible(true)
  }
  const onCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <div className={`${styles["basis-header"]}`}>
        {
          curShopInfo?.name && <>
            <Link className={`${styles["arrow"]}`} to="/shop"></Link>
            <MainTitle title={curShopInfo?.name} />
            <a className={`${styles["feed-back"]}`} href="#" onClick={showModal}>我要吐槽</a>
            <a className={`${styles["visit-online"]}`} href={curShopInfo?.shopDomain} target="_blank">访问线上</a>
          </>
        }
        {
          Object.values(ShopBasisType).includes(type as ShopBasisType) && <ShopBasisTab {...props} type={type as ShopBasisType} />
        }
        {
          Object.values(ShopModuleType).includes(type as ShopModuleType) && <ShopModuleTab
            type={type as ShopModuleType}
            tabType={curShopInfo?.type === ProductType.B2B ? '产品' : '服务'}
          />
        }
      </div>
      <AdivceRecord id={id} isModalVisible={isModalVisible} onCancel={onCancel} />
    </>
  );
}

const mapStateToProps = (state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}

export default connect<{ curShopInfo: ShopInfo }>(mapStateToProps)(BasicHeader)
