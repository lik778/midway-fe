import React, { useState } from 'react';
import  CarouselImg from '@/components/carousel-img';
import ShopBasisTab from '@/components/shop-basis-tab';
import { ShopBasisType } from '@/enums';
export default (props: any) => {
  const [current, setCurrent] = useState('nav')
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };

  return (
      <div>
        <ShopBasisTab type={ShopBasisType.CAROUSEL}/>
       <div className="container">
          <CarouselImg/>
       </div>
      </div>
    );
}


