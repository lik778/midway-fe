
import React, { useState, useEffect } from 'react';
import './index.less';
import { BannerImgUpload } from '../banner-img-upload';
import { createBannerApi, getBannerListApi, deleteBannerApi } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { DeviceType, PositionType} from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
import Loading from '@/components/loading';
import EmptyStatus from '@/pages/shop/components/empty-status';

interface Props {
  type:DeviceType,
  position: number,
  txt: string,
  tip: string,
}

export default (props: Props) => {
  const [bannerList, setBannerList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {type, txt, tip, position } = props
  // 获取店铺id
  const params: RouteParams = useParams();

  const createBannerImg = async (url: string) => {
    const res = await createBannerApi(Number(params.id), {
      url,
      type,
      position
    })
    if(res?.success){
      successMessage('上传成功');
    }else{
      errorMessage(`上传失败:${res?.message}`);
    }
  }

  const getBannerList = async () => {
    const res = await getBannerListApi(Number(params.id), {
      page: 1,
      size: 5,
      status: 1,
      type,
      position
    })
    if (res?.success) {
      const list = res.data.result
      list.map((l: any) => {
        l['uid'] = l.id.toString()
        l['url'] = l.displayImgUrl
        l['status'] = 'done'
      })
        setBannerList(list)
        setIsLoading(false)
    }
  }

  const deleteBannerImg = async (id: number) => {
    const res = await deleteBannerApi(Number(params.id), {
      id,
    })
    if(res?.success){
      successMessage('删除成功');
      getBannerList()
    }else{
      errorMessage(res?.message);
    }
  }

  const onImgChange = (url: string, status: number)=> {
    if(status === 1) { // 创建
      createBannerImg(url)
    }else if(status === 2){ // 删除
      const id = parseInt(url)
      deleteBannerImg(id)
    }
  }
  useEffect(() => {
    getBannerList()
  }, [])

  //const emptyImgs = () => {
  //  if (bannerList.length === 0) {
  //    const emptyMsg = {
  //      img: '//file.baixing.net/202012/c201a04d7d3ac516b3598eb3eb6bd4c1.png',
  //      msg: '暂无图片，建议上传自己的品牌图片'
  //    }
  //    return <EmptyStatus emptyMsg={emptyMsg} />
  //  }
  //}

  if (isLoading) {
    return <Loading />
  } else {
    return (
      <div className="all-img">
        <span className="title">{txt}: </span>
        <div className="img-list">
          <p className="red-tip tip">严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担</p>
          <p className="tip">{tip}</p>
          <BannerImgUpload imgType={'text'} text={'上传图片'} maxLength={5} disableBtn={true} onChange={onImgChange} fileList={bannerList}/>
          {/*{emptyImgs()}*/}
        </div>
      </div>
    );
    }}
