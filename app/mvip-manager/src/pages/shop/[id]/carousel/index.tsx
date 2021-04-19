import React, { useState, useEffect } from 'react';
import  CarouselImg from './components/carousel-img';
import BasisHeader from '../components/basis-header';
import { ShopBasisType, DeviceType } from '@/enums';
import './index.less'
import { getBannerListApi } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import Loading from '@/components/loading';
import EmptyStatus from '@/pages/shop/components/empty-status';
import WrapperShopPage from '@/pages/shop';

const ShopCarouselPage =  (props: any) => {
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

  const emptyImgs = () => {
    if(wapBannerList.length === 0 && pcBannerList.length === 0) {
      const emptyMsg = {
        img:'//file.baixing.net/202012/c201a04d7d3ac516b3598eb3eb6bd4c1.png',
        msg: '暂无图片，建议上传自己的品牌图片'
      }
      return <EmptyStatus emptyMsg={emptyMsg}/>
    }
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
            {emptyImgs()}
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
        <BasisHeader {...props} type={ShopBasisType.CAROUSEL}/>
        <div className="container">
          {imgContainer()}
        </div>
      </div>
    );
}


ShopCarouselPage.wrappers = ['@/wrappers/path-auth']

export default ShopCarouselPage
