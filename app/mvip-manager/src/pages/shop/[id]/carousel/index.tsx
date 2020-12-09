import React, { useState } from 'react';
import  CarouselImg from '@/components/carousel-img';
import ShopBasisTab from '@/components/shop-basis-tab';
import { ShopBasisType } from '@/enums';
import './index.less'
export default (props: any) => {
  const [current, setCurrent] = useState('nav')
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
      <div>
        <ShopBasisTab type={ShopBasisType.CAROUSEL}/>
       <div className="container">
          <div className="c-main">
            <div className="c-pc">
              <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过1M, 建议上传尺寸1920*360'} txt={'PC端轮播图'}/>
            </div>
            <div className="c-wap">
              <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过1M, 建议上传尺寸*360'} txt={'WAP端轮播图'}/>
            </div>
          </div>
       </div>
      </div>
    );
}


