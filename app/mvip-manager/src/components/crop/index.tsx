import React, { FC, useEffect, useMemo, useState, useRef } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styles from './index.less'
import { Button } from 'antd';
import { errorMessage } from '../message';
import { upImageToYoupai } from '@/api/common'
import { CropProps } from './data'
import { Spin } from 'antd'
interface Props {
  cropProps: CropProps,
  url?: string,
  handleCropSuccess: (uid: string, previewUrl: string) => void
}

const Crop: FC<Props> = (props) => {
  const { cropProps, url, handleCropSuccess } = props
  const [prevUrl, setPrevUrl] = useState<string>('')
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [cropper, setCropper] = useState<Cropper>();
  const [timestamp] = useState<number>(() => new Date().getTime())
  const [reloadLoading, setReloadLoading] = useState<boolean>(false)
  // 初始化 或者替换图片时需要恢复图片位置
  useEffect(() => {
    if (cropper && url) {
      // 当图片太大，cropper可能对新图片还没准备好，所以给个延时再重置
      if (url !== prevUrl) {
        setReloadLoading(true)
        setPrevUrl(url)
        setTimeout(() => {
          cropper.reset()
          setReloadLoading(false)
        }, 1000)
      }
    }
  }, [url, cropper])

  useEffect(() => {
    return () => {
      cropper?.destroy()
    }
  }, [])

  // 确认裁剪
  const handleConfirmCropper = async () => {
    if (!cropper) {
      return
    }
    cropper.getCroppedCanvas({
      maxWidth: 3840,
      maxHeight: 2580
    }).toBlob(async (blob) => {
      // 创建formData数据,因为图片上传的请求支持格式
      if (!blob) return
      setUpDataLoading(true)
      const base64 = cropper.getCroppedCanvas().toDataURL(blob.type)
      const suffix = blob.type.split('/')[1] || 'jpeg'
      const formData = new FormData()
      formData.append('policy', window.__upyunImgConfig?.uploadParams?.policy)
      formData.append('signature', window.__upyunImgConfig?.uploadParams?.signature)
      formData.append('file', blob, `${new Date().getDate()}-${Math.random()}.${suffix}`)
      const res = await upImageToYoupai(formData)
      handleCropSuccess(res.data.url, base64)
      setUpDataLoading(false)
    }, undefined, 0.75);
  };

  return <Spin spinning={reloadLoading}> <div className={styles["crop-container"]}>
    <div className={styles["crop-content"]}>
      <Cropper
        initialAspectRatio={cropProps.autoAspectRatio ? cropProps.aspectRatio : undefined}
        aspectRatio={cropProps.autoAspectRatio ? undefined : cropProps.aspectRatio}
        src={url}
        style={{ width: 800, height: 500 }}
        preview={`.img-preview-${timestamp}`}
        guides={true}
        autoCropArea={0.8}
        movable={true} // 是否允许移动图片
        zoomTo={1}
        viewMode={2}
        minCropBoxHeight={50}
        minCropBoxWidth={50}
        background={false}
        responsive={true}
        cropBoxResizable={true}
        cropBoxMovable={true}
        dragMode='move'
        crossOrigin={"anonymous"} // 跨域设置
        checkCrossOrigin={true}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
    </div>
    <div className={styles["crop-preview"]}>
      <div className={styles["title"]}>图片预览</div>
      <div className={styles["preview-box"]}>
        <div className={`${styles["img-preview"]} img-preview-${timestamp}`} />
      </div>
      <Button size="large" type="primary" onClick={handleConfirmCropper} disabled={upDataLoading} loading={upDataLoading}>确认裁剪</Button>
    </div>
  </div>
  </Spin>
}
export default Crop