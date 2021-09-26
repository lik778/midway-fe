import React, { FC, useEffect, useState, useMemo } from 'react';
import { Form } from 'antd'
import ImgUpload, { getImgUploadValueModel } from '@/components/img-upload'
import { MediaItem } from '@/components/img-upload/data'
import { UploadFile } from 'antd/lib/upload/interface'
import { getCollectionImages, addCollectionImages, addCollectionImage, deleteCollectionImage } from '@/api/ai-module'
import { CollectionImageListItem } from '@/interfaces/ai-module'
import styles from './index.less'

interface Props {
  collectionId: number
}

const SelectImage: FC<Props> = (props) => {
  const { collectionId } = props
  const [getDataLoading, setGetDataLoading] = React.useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<CollectionImageListItem[]>([])
  const initEditData = useMemo(() => {
    return dataList.map((item) => getImgUploadValueModel('IMAGE', item.content) as MediaItem)
  }, [dataList])

  const getImageUrl = async (dataList: CollectionImageListItem[]): Promise<CollectionImageListItem[]> => {
    return dataList.map(item => ({
      ...item,
      content: `http://img4.baixing.net${item.content}_bi`
    }))
  }

  const getImage = async () => {
    // TODO; 图片转完整
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
    // TODO; 图片转完整
    const res = await addCollectionImages({ id: collectionId, content: imageUrls })
    const data = await getImageUrl(res.data)
    return data
  }

  const handleChangeImg = (values: "" | MediaItem | MediaItem[], fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => {
    // oldFileList 对应bannerLiet的文件 ，且顺序相同。
    // 找到fileList与oldFileList的交集a。
    // 维持localValues的顺序等于values，并将已有的id记录在localValues里
    // 删除oldFileList中不存在于a的项
    // 新增localValues中不存在id的项
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
  }

  return <Form.Item labelCol={{ span: 2 }} label="图片" required={true}>
    <div className={styles['img-upload-container']}>
      <ImgUpload editData={initEditData} uploadType={2} unique={true} uploadBtnText={'选择照片'} maxSize={2} maxLength={30} cropProps={{ aspectRatio: 1024 / 768 }} onChange={handleChangeImg} />
    </div>
  </Form.Item>
}

export default SelectImage
