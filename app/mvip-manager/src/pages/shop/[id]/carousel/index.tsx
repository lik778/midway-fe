import React from 'react';
import CarouselImg from './components/carousel-img';
import BasisHeader from '../components/basis-header';
import { ShopBasisType, DeviceType } from '@/enums';
import './index.less'

const ShopCarouselPage = (props: any) => {
  const imgContainer = () => {
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
  return (
    <>
      <BasisHeader {...props} type={ShopBasisType.CAROUSEL} />
      <div className="container">
        {imgContainer()}
      </div>
    </>
  );
}

ShopCarouselPage.wrappers = ['@/wrappers/path-auth']

export default ShopCarouselPage
