import React, { useState, useEffect } from 'react';
import CarouselImg from './components/carousel-img';
import BasisHeader from '../components/basis-header';
import { ShopBasisType, DeviceType, ProductType  } from '@/enums';
import './index.less';
import { connect } from 'dva';
import { SHOP_NAMESPACE } from '@/models/shop';
import { RouteParams, ShopInfo } from '@/interfaces/shop';


const ShopCarouselPage = (props: any) => {
  const [imgContainer, setImgContainer] = useState<React.ReactNode>()
  const b2cImgContainer = () => {
    return (
      <div className="c-main">
        <div className="c-pc">
          <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸1920*540'} txt={'PC端首页轮播图'} type={DeviceType.PC} position={1}/>
          <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸1920*360'} txt={'PC端内容轮播图'} type={DeviceType.PC} position={3}/>
        </div>
        <div className="c-wap">
          <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸750*750'} txt={'WAP端首页轮播图'} type={DeviceType.WAP} position={1}/>
          <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸750*304'} txt={'WAP端内容轮播图'} type={DeviceType.WAP} position={3}/>
        </div>
      </div>
    )
  }

  const b2bImgContainer = () => {
    return (
      <div className="c-main">
        <div className="c-pc">
          <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸1920*540'} txt={'PC端轮播图'} type={DeviceType.PC} position={1}/>
        </div>
        <div className="c-wap">
          <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过3M, 建议上传尺寸750*304'} txt={'WAP端轮播图'} type={DeviceType.WAP} position={1}/>
        </div>
      </div>
    )
  }

  //当前店铺是B2B,B2C，展示不同的上传图片组件
  const { curShopInfo } = props
  useEffect(()=>{
    if (curShopInfo) {
      const { type } = curShopInfo
      if (type === ProductType.B2B){
        setImgContainer(b2bImgContainer)
      }else{
        setImgContainer(b2cImgContainer)
      }
    }
  },[curShopInfo])


  return (
    <>
      <BasisHeader {...props} type={ShopBasisType.CAROUSEL} />
      <div className="container">
        {imgContainer}
      </div>
    </>
  );
}

ShopCarouselPage.wrappers = ['@/wrappers/path-auth']

//export default ShopCarouselPage

//取状态管理里的当前店铺信息，用于判断店铺类型
export default connect<{ curShopInfo: ShopInfo }>((state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(ShopCarouselPage)
