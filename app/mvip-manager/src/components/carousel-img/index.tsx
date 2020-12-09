
import React from 'react';
import './index.less';
import {ImgUpload} from '../wildcat-form/components/img-upload';
export default (props: any) => {
  return (
    <div className="all-img">
      <span className="title">{props.txt}: </span>
      <div className="img-list">
        <p className="tip">{props.tip}</p>
        <ImgUpload imgType={'text'} txt={'上传图片'} maxLength={5} disableBtn={true}/>
      </div>
    </div>
   
  );
}
