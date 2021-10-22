import React, { FC, useEffect, useState, useMemo, forwardRef, Ref, useImperativeHandle } from 'react';
import { Form } from 'antd'
import ImgUpload, { getImgUploadValueModel } from '@/components/img-upload'
import { MediaItem } from '@/components/img-upload/data'
import { UploadFile } from 'antd/lib/upload/interface'
import { getCollectionImages, addCollectionImages, addCollectionImage, deleteCollectionImage, getImgWholeUrl } from '@/api/ai-module'
import { CollectionImageListItem } from '@/interfaces/ai-module'
import { fromLabelCol } from '../../config'
import styles from './index.less'

interface Props {
  collectionId: number,
  disabled: boolean
}

const SelectImage = (props: Props, parentRef: Ref<any>) => {
  const { collectionId, disabled } = props
  const [getDataLoading, setGetDataLoading] = React.useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<CollectionImageListItem[]>([])
  const initEditData = useMemo(() => {
    return dataList.map((item) => getImgUploadValueModel('IMAGE', item.content) as MediaItem)
  }, [dataList])
  const [validateStatus, setValidateStatus] = useState<'' | 'error'>('')
  const [help, setHelp] = useState<string | undefined>()
  const [minLength] = useState<number>(5)
  const [maxLength] = useState<number>(30)
  const [maxSize] = useState<number>(3)

  useImperativeHandle(parentRef, () => ({
    validateFc
  }))

  const getImageUrl = async (dataList: CollectionImageListItem[]) => {
    if (dataList.length > 0) {
      const res = await getImgWholeUrl({
        images: dataList.map(item => item.content),
        suffix: '_bi'
      })
      return dataList.map((item, index) => ({
        ...item,
        content: res.data[index].ext
      }))
    } else {
      return dataList
    }
  }

  const getImage = async () => {
    setGetDataLoading(true)
    const res = await getCollectionImages({ id: collectionId })
    const data = await getImageUrl(res.data)
    setDataList(data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    if (collectionId) {
      getImage()
    }
  }, [])

  // 需要删除的Id
  const delImage = async (imageId: number,) => {
    const res = await deleteCollectionImage({ id: imageId })
    return res.data
  }

  const addImage = async (imageUrls: { content: string }[]) => {
    if (imageUrls.length === 0) return
    const res = await addCollectionImages({ id: collectionId, content: imageUrls })
    const data = await getImageUrl(res.data)
    return data
  }

  const handleChangeImg = (values: "" | MediaItem | MediaItem[], fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => {
    const localDataList = [...dataList]
    const newDataList: CollectionImageListItem[] = []
    fileList.forEach(item => {
      const index = localDataList.findIndex(oItem => {
        return oItem.content === item.url
      })
      if (index !== -1) {
        const dItem = localDataList.splice(index, 1)[0]
        newDataList.push(dItem)
      } else {
        newDataList.push({
          id: NaN,
          status: '',
          content: item.url!
        })
      }
    })
    const newDelIds = [...new Set(localDataList.filter(item => item.id).map(item => item.id))]
    handleUpData(newDataList, newDelIds)
  }

  const handleUpData = async (nowDataList: CollectionImageListItem[], nowDelIds: number[]) => {
    setUpDataLoading(true)
    const addDataList = nowDataList.filter(item => !item.id)
    // 这里的ids会混入删除接口传进来的空，所以下面要过滤
    const [addData, ...delData] = await Promise.all([addImage(addDataList.map(item => ({ content: item.content }))), ...nowDelIds.map(item => delImage(item))])
    // 进行一次全量数据更新
    addData?.forEach((item, index) => {
      addDataList[index].id = item.id
      addDataList[index].status = item.status
      addDataList[index].content = item.content
    })
    setDataList(nowDataList)
    setUpDataLoading(false)
    validateFc(nowDataList)
  }

  const validateFc = async (nowDataList?: CollectionImageListItem[]) => {
    const validate = nowDataList || dataList
    if (validate.length < minLength) {
      setValidateStatus('error')
      setHelp(`图片数量：${minLength}张及以上`)
      return Promise.reject()
    } else {
      setValidateStatus('')
      setHelp(undefined)
      return Promise.resolve()
    }
  }

  return <Form.Item labelCol={fromLabelCol} label="图片" required={true} help={help} validateStatus={validateStatus}>
    <div className={styles['img-upload-container']}>
      <ImgUpload editData={initEditData} uploadType={2} unique={true} uploadBtnText={'选择照片'} maxSize={maxSize} maxLength={maxLength} cropProps={{ aspectRatio: 1024 / 768 }} onChange={handleChangeImg} disabled={disabled} />
    </div>
    <div className={styles['tip']}>{`图片格式：jpg、jpeg、png，大小不超过${maxSize}M；图片数量：最少上传${minLength}张，最多${maxLength}张；建议最佳尺寸1024*768`} </div>
  </Form.Item>
}

export default forwardRef(SelectImage)
