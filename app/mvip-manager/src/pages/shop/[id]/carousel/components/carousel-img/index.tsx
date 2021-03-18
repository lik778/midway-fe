
import React from 'react';
import './index.less';
import { BannerImgUpload } from '../banner-img-upload';
import { createBannerApi, deleteBannerApi } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { DeviceType } from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
interface Props {
  onChange(type: DeviceType): void;
  fileList:any[];
  type:DeviceType,
  txt: string,
  tip: string,
}
export default (props: Props) => {
  const { onChange, fileList, type, txt, tip } = props
  // 获取店铺id
  const params: RouteParams = useParams();
  const createBannerImg = async (url: string) => {
    const res = await createBannerApi(Number(params.id), {
      url,
      type,
    })
    if(res?.success){
      successMessage('上传成功');
      onChange(type)
    }else{
      errorMessage(`上传失败:${res?.message}`);
    }
  }

  const deleteBannerImg = async (id: number) => {
    const res = await deleteBannerApi(Number(params.id), {
      id,
    })
    if(res?.success){
      successMessage('删除成功');
      onChange(type)
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
  return (
    <div className="all-img">
      <span className="title">{txt}: </span>
      <div className="img-list">
        <p className="tip">{tip}</p>
        <BannerImgUpload imgType={'text'} text={'上传图片'} maxLength={5} disableBtn={true} onChange={onImgChange} fileList={fileList}/>
      </div>
    </div>

  );
}
