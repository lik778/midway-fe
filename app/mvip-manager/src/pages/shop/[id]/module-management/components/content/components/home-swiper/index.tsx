import React, { FC, useState, useEffect } from 'react';
import styles from './index.less'
import PcSwiper from './components/pc'
import WapSwiper from './components/wap'

const HomeSwiper: FC = () => {
  return <div className={styles['home-swiper-container']}>
    <PcSwiper></PcSwiper>
    <WapSwiper></WapSwiper>
  </div>
}

export default HomeSwiper