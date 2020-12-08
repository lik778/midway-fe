
import React from 'react';
import './index.less';
import {ImgUpload} from '../wildcat-form/components/img-upload';
export default (props: any) => {
  return (
    <div className="img-module">
      <ImgUpload imgType={'text'} txt={'上传图片'}/>
    </div>
  );
}
