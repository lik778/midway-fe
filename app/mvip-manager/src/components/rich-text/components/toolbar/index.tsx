import React, { FC } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import { Tooltip } from 'antd'
import { MediaItem } from '@/components/img-upload/data'
import ImgUpload from '@/components/img-upload';
import './index.less'
interface Props {
  handleClickFullScreen: (e: any) => void
  handleSelectedImg: (values: "" | MediaItem | MediaItem[], fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => void,
  fullScreenFlag: boolean
}

const RichTextToolbar: FC<Props> = (props) => {
  const { handleClickFullScreen, handleSelectedImg , fullScreenFlag } = props
  return <div id="toolbar" className='toolbar'>
    <Tooltip  placement="right" title="标题">
      <span className="ql-formats">
        <select className="ql-header" defaultValue="default">
          <option value="default"></option>
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
        </select>
      </span>
    </Tooltip>
    <Tooltip  placement="right" title="字号">
      <span className="ql-formats">
        <select className="ql-size" defaultValue="default">
          <option value="small"></option>
          <option value="default"></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
      </span>
    </Tooltip>
    <span className="ql-formats">
      <Tooltip  placement="right" title="加粗"><button className="ql-bold"></button></Tooltip>
      <Tooltip  placement="right" title="斜体"><button className="ql-italic"></button></Tooltip>
      <Tooltip  placement="right" title="下划线"><button className="ql-underline"></button></Tooltip>
      <Tooltip  placement="right" title="删除线"><button className="ql-strike"></button></Tooltip>
    </span>
    <Tooltip  placement="right" title="对齐方式">
      <span className="ql-formats">
        <select className="ql-align"></select>
      </span>
    </Tooltip>
    <span className="ql-formats">
      <Tooltip  placement="right" title="数字列表"><button className="ql-list" value="ordered"></button></Tooltip>
      <Tooltip  placement="right" title="点列表"><button className="ql-list" value="bullet"></button></Tooltip>
      <Tooltip  placement="right" title="向左缩进"><button className="ql-indent" value="-1"></button></Tooltip>
      <Tooltip  placement="right" title="向右缩进"><button className="ql-indent" value="+1"></button></Tooltip>
    </span>
    <Tooltip  placement="right" title="字体颜色">
      <span className="ql-formats">
        <select className="ql-color"></select>
      </span>
    </Tooltip>
    <Tooltip  placement="right" title="背景颜色">
      <span className="ql-formats">
        <select className="ql-background"></select>
      </span>
    </Tooltip>
    <span className="ql-formats">
      {/* 图片插件 */}
      <ImgUpload uploadType={3} maxLength={100} cropProps={{
        notSelectCrop: true,
        autoAspectRatio: true,
        aspectRatio: 1 / 1,
      }} onChange={handleSelectedImg}
      uploadBtnText="上传图片"
      >
        <Tooltip  placement="right" title="图片"><button className='ql-image'></button></Tooltip>
      </ImgUpload>
    </span>
    <span className="ql-formats">
      <Tooltip  placement="right" title={ fullScreenFlag ? '退出全屏' : '全屏' }><button className="full-screen-btn" type="button" onClick={handleClickFullScreen}>
        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10463"><path d="M243.2 780.8v-179.2H153.6v179.2c0 49.28 40.32 89.6 89.6 89.6h179.2v-89.6H243.2zM780.8 153.6h-179.2v89.6h179.2v179.2h89.6V243.2c0-49.28-40.32-89.6-89.6-89.6zM243.2 243.2h179.2V153.6H243.2c-49.28 0-89.6 40.32-89.6 89.6v179.2h89.6V243.2z m537.6 537.6h-179.2v89.6h179.2c49.28 0 89.6-40.32 89.6-89.6v-179.2h-89.6v179.2z" p-id="10464" fill="#000000"></path></svg>
      </button></Tooltip>
    </span>
    <span className="ql-formats">
      <Tooltip  placement="right" title="清除格式"><button className="ql-clean"></button></Tooltip>
    </span>
  </div>
}

export default RichTextToolbar
