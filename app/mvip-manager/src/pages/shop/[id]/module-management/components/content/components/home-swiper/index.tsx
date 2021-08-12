import React, { FC, useState, useEffect, useRef, } from 'react';
import { Spin, Button } from 'antd'
import { connect } from 'dva';
import { SHOP_NAMESPACE } from '@/models/shop';
import { ShopInfo } from '@/interfaces/shop';
import { ConnectState } from '@/models/connect';
import styles from './index.less'
import PcSwiper from './components/pc'
import WapSwiper from './components/wap'
import { ModulePageType, ModuleComponentId, } from '@/interfaces/shop'
import { successMessage } from '@/components/message';

interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
  [key: string]: any
}

const HomeSwiper: FC<Props> = (props) => {
  const { curShopInfo, loadingShopModel, position, pageModule } = props

  const pcRef = useRef<{
    handleUpData: () => Promise<void>,
    disabledFc: () => boolean,
  }>({
    handleUpData: async () => { },
    disabledFc: () => false
  })

  const wapRef = useRef<{
    handleUpData: (type: 'all') => Promise<void>,
    disabled: boolean,
  }>({
    handleUpData: async () => { },
    disabled: false
  })

  const handleClickSubmit = async () => {
    if (pcRef.current.disabledFc() || wapRef.current.disabled) {
      return
    }
    await Promise.all([pcRef.current.handleUpData(), wapRef.current.handleUpData('all')])
  }

  return <Spin spinning={loadingShopModel}>
    <div className={styles['home-swiper-container']}>
      {
        curShopInfo && <> <div className={styles['component-box']}>
          <PcSwiper ref={pcRef} curShopInfo={curShopInfo} position={position} pageModule={pageModule}></PcSwiper>
          <WapSwiper ref={wapRef} curShopInfo={curShopInfo} position={position} pageModule={pageModule}></WapSwiper>
        </div>
          <Button className={styles['btn']}
            size="large" onClick={handleClickSubmit}>保存</Button>
        </>
      }
    </div>
  </Spin>
}

//export default ShopCarouselPage

//取状态管理里的当前店铺信息，用于判断店铺类型
export default connect<any, any, Props>((state: any) => {
  const { loading } = (state as ConnectState)
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo, loadingShopModel: loading.models.shop }
})(HomeSwiper)