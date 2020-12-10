
import React from 'react';
import './index.less';
import { BannerImgUpload } from '@/components/banner-img-upload';
import { createBannerApi, deleteBannerApi } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';

export default (props: any) => {
  // 获取店铺id
  const params: RouteParams = useParams();
  const type = props.type
  const createBannerImg = async (url: string) => {
    const res = await createBannerApi(Number(params.id), {
      url,
      type,
    })
    console.log('create', res)
  }

  const deleteBannerImg = async (id: number) => {
    const res = await deleteBannerApi(Number(params.id), {
      id,
    })
    console.log('delete', res)
  }
  const onChange = (url: string)=> {
    createBannerImg(url)
  }
  return (
    <div className="all-img">
      <span className="title">{props.txt}: </span>
      <div className="img-list">
        <p className="tip">{props.tip}</p>
        <BannerImgUpload imgType={'text'} text={'上传图片'} maxLength={5} disableBtn={true} onChange={onChange} fileList={props.fileList}/>
      </div>
    </div>

  );
}
