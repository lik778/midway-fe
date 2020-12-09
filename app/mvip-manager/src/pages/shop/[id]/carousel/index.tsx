import React, { useState, useEffect } from 'react';
import  CarouselImg from '@/components/carousel-img';
import ShopBasisTab from '@/components/shop-basis-tab';
import { ShopBasisType, DeviceType } from '@/enums';
import './index.less'
import { getBannerList } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';

export default (props: any) => {
  const [wapBannerList, setWapBannerList] = useState<any[]>([])
  const [pcBannerList, setPCBannerList] = useState<any[]>([])
  // 获取店铺id
  const params: RouteParams = useParams();

  const getWapBannerList = async () => {
    const res = await getBannerList(Number(params.id), {
      page: 1,
      size: 5,
      status: 1,
      type: DeviceType.WAP
    })
    if(res?.success) {
      const list = res.data.result
      list.map((l:any) => {
        l['uid'] = l.id.toString()
        l['url'] = l.displayImgUrl
        l['status'] = 'done'
      })
      setWapBannerList(list)
    }
  }

  const getPcBannerList = async () => {
    const res = await getBannerList(Number(params.id), {
      page: 1,
      size: 5,
      status: 1,
      type: DeviceType.PC
    })
    if(res?.success) {
      const list = res.data.result
      list.map((l:any) => {
        l['uid'] = l.id.toString()
        l['url'] = l.displayImgUrl
        l['status'] = 'done'
      })
      setPCBannerList(list)
    }
  }

  useEffect(() => {
    getWapBannerList()
    getPcBannerList()
  }, [])

  return (
      <div>
        <ShopBasisTab type={ShopBasisType.CAROUSEL}/>
       <div className="container">
          <div className="c-main">
            <div className="c-pc">
              <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过1M, 建议上传尺寸1920*360'} txt={'PC端轮播图'} type={1} fileList={pcBannerList}/>
            </div>
            <div className="c-wap">
              <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过1M, 建议上传尺寸*360'} txt={'WAP端轮播图'} type={2} fileList={wapBannerList}/>
            </div>
          </div>
       </div>
      </div>
    );
}


