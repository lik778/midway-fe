import React, { forwardRef, Ref, useImperativeHandle } from 'react';
import { ShopInfo, ModulePageType, ModuleComponentId } from '@/interfaces/shop'
import { ShopBasisType, DeviceType, ProductType } from '@/enums';
import styles from './index.less'
import CarouselImg from '../../../components/carousel-img'
interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
  curShopInfo: ShopInfo // model里传过来
}

// 这个组件可以抹去，但是防止b2b与b2c之间真的有区别，所以还是保留着
const WapSwiper = (props: Props, parentRef: Ref<any>) => {
  const { curShopInfo, position, pageModule } = props

  return <div className={styles['wap-container']}>
    <CarouselImg
      ref={parentRef}
      tip={<span>最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸750*304<br />视频建议尺寸：16:9，大小100M以内，视频时长最短3S，最长60S</span>}
      txt={'移动端轮播图'}
      type={DeviceType.WAP}
      position={position}
      aspectRatio={750 / 304}
      autoUpdata={false}
    />
  </div>
}

export default forwardRef(WapSwiper)
