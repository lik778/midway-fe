import React, { ReactElement, useEffect, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface';
import { Upload, Modal, Button, } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { errorMessage } from '@/components/message';
import Crop from "@/components/crop";
import { CropProps } from "@/components/crop/data";
import _ from 'lodash'

import './index.less'

// ! TODO
// ! 店铺轮播图设置中的裁剪迁移到 @/components/img-upload 没有其它文件依赖本图片上传时可删除此文件

const getBase64 = function (file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface Props {
  text: string;
  imgType?: "text" | "picture-card" | "picture" | undefined;
  maxLength: number;
  disableBtn?: boolean | undefined;
  onChange(url: string, status: number): void;
  onOrdersChange(ids: number[]): void;
  fileList?: any[];
}
export const BannerImgUpload = (props: Props) => {
  const list = props.fileList || []
  const { onChange, onOrdersChange } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<any[]>([])
  const [orderList, setOrderList] = useState<number[]>([])

  const uploadButton = (isDisable?: boolean | undefined) => {
    const txt = props.text || '上传'
    const cls = isDisable ? 'upload-btn disabled' : 'upload-btn'
    return (
      <Button className={cls} disabled={isDisable}>
        <PlusOutlined />
        <div className='upload-img'>{txt}</div>
      </Button>
    );
  }

  // 初始化
  useEffect(() => {
    setFileList(list)
  }, [list])

  // fileList 顺序改变时，上传顺序
  useEffect(() => {
    const newOrderList = fileList.map(x => +x.id);
    const isChanged = !_.isEqual(orderList, newOrderList);
    if (isChanged) {
      if (orderList.length && orderList.length === newOrderList.length) {
        onOrdersChange(newOrderList)
      }
      setOrderList(newOrderList);
    }
  }, [fileList])

  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = async (e: any) => {
    if (!!e.file.status) {
      if (e.file.status === 'done') {
        const { url } = e.file.response
        onChange(`${url.slice(1,)}${window.__upyunImgConfig.imageSuffix}`, 1);
      }
      setFileList(e.fileList)
    }
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      errorMessage('请上传jpg、jpeg、png格式的图片');
    }
    const isLt3M = file.size < 1024 * 1024 * 3;
    if (!isLt3M && isJpgOrPng) {
      errorMessage('请上传不超过3M的图片');
    }
    return isJpgOrPng && isLt3M;
  }

  const handleRemove = (file: any) => {
    const tempFileList = [...fileList];
    const index = tempFileList.findIndex(x => x === file);
    tempFileList.splice(index, 1);
    setFileList(tempFileList);
    onChange(`${file.id}`, 2);
  }

  // 移动，正数向后移动，负数向前移动
  const handleMove = (file: any, order: number) => {
    const tempFileList = [...fileList]
    const index = tempFileList.findIndex(x => x === file)
    const length = tempFileList.length
    tempFileList.splice(index, 1)
    tempFileList.splice(
      Math.min(length, Math.max(0, index + order)),
      0,
      file
    )
    setFileList(tempFileList)
  }

  // 渲染上传列表
  const renderItem = (
    originNode: ReactElement,
    file: UploadFile,
    fileList?: UploadFile[],
  ) => {
    // 防止类型报错
    if (!fileList) {
      fileList = []
    }
    const isFirstOrder = file === fileList[0]
    const isLastOrder = file === fileList[fileList.length - 1]
    const isUploading = file?.status === "uploading";

    let emptyPlaceholder = null
    if (isUploading) {
      emptyPlaceholder = <span>正在上传 ...</span>
    }
    if (!file.url) {
      emptyPlaceholder = <span>正在上传 ...</span>
    }

    return (
      <div className="upload-wrapper" key={file.url}>
        {emptyPlaceholder || (<>
          <img src={file.url} className="image" />
          <div className="mask">
            <EyeOutlined onClick={() => handlePreview(file)} />
            <DeleteOutlined onClick={() => handleRemove(file)} />
            {!isLastOrder && <DownOutlined onClick={() => handleMove(file, 1)} />}
            {!isFirstOrder && <UpOutlined onClick={() => handleMove(file, -1)} />}
          </div>
        </>)}
      </div>
    );
  }

  return (
    <div className="img-upload banner-img-upload">
      <Upload
        action={window.__upyunImgConfig?.uploadUrl}
        data={{
          policy: window.__upyunImgConfig?.uploadParams?.policy,
          signature: window.__upyunImgConfig?.uploadParams?.signature,
        }}
        showUploadList={{ showRemoveIcon: true }}
        listType="picture-card"
        fileList={fileList}
        itemRender={renderItem}
        isImageUrl={() => {
          return true;
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {fileList?.length >= props.maxLength
          ? props.disableBtn
            ? uploadButton(props?.disableBtn)
            : null
          : uploadButton()}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}
