import React, { useState, useEffect } from 'react';
import  CarouselImg from '@/components/carousel-img';
import ShopBasisTab from '@/components/shop-basis-tab';
import { ShopBasisType, DeviceType } from '@/enums';
import './index.less'
import { getBannerListApi } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import Loading from '@/components/loading-status';
import EmptyStatus from '@/components/empty-status'

export default (props: any) => {
  const [wapBannerList, setWapBannerList] = useState<any[]>([])
  const [pcBannerList, setPCBannerList] = useState<any[]>([])
  // 获取店铺id
  const params: RouteParams = useParams();
  // isLoaded
  const [isWapLoading, setIsWapLoading] = useState(true)
  const [isPcLoading, setIsPcLoading] = useState(true)
  const getBannerList = async (type: DeviceType)=> {
    const res = await getBannerListApi(Number(params.id), {
      page: 1,
      size: 5,
      status: 1,
      type,
    })
    if(res?.success) {
      const list = res.data.result
      list.map((l:any) => {
        l['uid'] = l.id.toString()
        l['url'] = l.displayImgUrl
        l['status'] = 'done'
      })
      if(type === DeviceType.PC) {
        setPCBannerList(list)
        setIsPcLoading(false)
      } else if(type === DeviceType.WAP) {
        setWapBannerList(list)
        setIsWapLoading(false)
      }
      
    }
  }

  const onChange = (type: DeviceType) => {
    getBannerList(type)
  }

  const imgContainer = () =>{
    if(isWapLoading || isPcLoading) {
      return <Loading />
    }else {
      return (
          <div className="c-main">
            <div className="c-pc">
              <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过1M, 建议上传尺寸1920*360'} txt={'PC端轮播图'} type={DeviceType.PC} fileList={pcBannerList} onChange={onChange}/>
            </div>
            <div className="c-wap">
              <CarouselImg tip={'最多上传5张轮播图，图片格式：jpg/jpeg/png,大小不超过1M, 建议上传尺寸375*152'} txt={'WAP端轮播图'} type={DeviceType.WAP} fileList={wapBannerList} onChange={onChange}/>
            </div>
            {/* <EmptyStatus emptyMsg={img:'&#xe618;'}/> */}
          </div>
      )
    }
  }

  useEffect(() => {
    getBannerList(DeviceType.PC)
    getBannerList(DeviceType.WAP)
  }, [])

  return (
      <div>
        <ShopBasisTab type={ShopBasisType.CAROUSEL}/>
        <div className="container">
          {imgContainer()}
        </div>    
      </div>
    );
}


