import React, { useCallback, useState, useEffect, useMemo } from "react";
import _ from "lodash";
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { changeBannerOrderApi, createBannerApi, getBannerListApi, deleteBannerApi } from '@/api/shop';
import { useParams } from 'umi';
import { BannerListItem, RouteParams } from '@/interfaces/shop';
import { DeviceType } from '@/enums';
import { errorMessage } from '@/components/message';
import Loading from '@/components/loading';
import ImgUpload from "@/components/img-upload";
import { ActionBtnListItem } from '@/components/img-upload/data';
import { UploadFile } from "antd/lib/upload/interface";
import { Spin } from 'antd'
import styles from './index.less'

interface Props {
  type: DeviceType,
  position: number,
  txt: string,
  tip: string,
  aspectRatio: number
}

export default (props: Props) => {
  const { type, txt, tip, position, aspectRatio } = props
  const [bannerList, setBannerList] = useState<BannerListItem[]>([])
  const editData = useMemo(() => {
    if (bannerList.length === 0) {
      return ''
    } else if (bannerList.length === 1) {
      return bannerList[0].displayImgUrl
    } else {
      return bannerList.map(item => item.displayImgUrl)
    }
  }, [bannerList])
  const [getDataLoading, setGetDataLoading] = useState(true)
  const [upDataLoading, setUpDataLoading] = useState(false)
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    getBannerList()
  }, [])

  const getBannerList = async () => {
    setGetDataLoading(true)
    const res = await getBannerListApi(Number(params.id), {
      page: 1,
      size: 5,
      status: 1,
      type,
      position
    })
    if (res?.success) {
      setBannerList(res.data.result!)
    } else {
      errorMessage(`获取图片失败，请稍后重试。`)
    }
    setGetDataLoading(false)
  }

  const createBannerImg = async (url: string, maxWeightNum?: number) => {
    setUpDataLoading(true)
    const maxWeight = maxWeightNum || (bannerList.length
      ? Math.max(...bannerList.map(x => +x.weight))
      : 0) + 1
    const res = await createBannerApi(Number(params.id), {
      url,
      type,
      position,
      // weight 字段越大排序越靠后
      weight: maxWeight
    })
    setUpDataLoading(false)
    if (res.success) {
      return res.data
    } else {
      errorMessage(`上传失败: ${res.message}`)
      return null
    }
  }

  const deleteBannerImg = async (id: number) => {
    setUpDataLoading(true)
    const res = await deleteBannerApi(Number(params.id), { id })
    if (res.success) {
    } else {
      errorMessage(`上传失败: ${res.message}`)
    }
    setUpDataLoading(false)
    return null
  }

  // 改变轮播图顺序
  // 后端根据图片 ID 自动获取轮播图类型
  const handleOrdersChange = async (ids: number[]) => {
    setUpDataLoading(true)
    await changeBannerOrderApi(Number(params.id), ids)
    setUpDataLoading(false)
  }

  // 目前可以同时操纵多个图片 可同时新增删除

  const handleChange = async (values: string | string[], fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => {
    // oldFileList 对应bannerLiet的文件 ，且顺序相同。
    // 找到fileList与oldFileList的交集a。
    // 维持localValues的顺序等于values，并将已有的id记录在localValues里
    // 删除oldFileList中不存在于a的项
    // 新增localValues中不存在id的项

    // 这里是因为图片组件的values传值问题
    let localValues: { id?: number, url: string }[] = []
    if (typeof values === 'string') {
      if (values.length !== 0) {
        localValues.push({
          url: values,
        })
      }
    } else {
      localValues = values.map(item => ({
        url: item
      }))
    }
    const localBannerList = [...bannerList]
    localValues.forEach(item => {
      const index = localBannerList.findIndex(oItem => oItem.displayImgUrl === item.url)
      if (index !== -1) {
        const dItem = localBannerList.splice(index, 1)[0]
        item.id = dItem.id
      }
    })
    // 这里的ids会混入删除接口传进来的空，所以下面要过滤
    const ids = await Promise.all([...localValues.map(item => {
      if (item.id) {
        return Promise.resolve(item.id)
      } else {
        return createBannerImg(item.url)
      }
    }), ...localBannerList.map(item => deleteBannerImg(item.id))])
    await handleOrdersChange(ids.filter(item => typeof item === 'number') as number[])
    await getBannerList()
  }

  const handleMove = useCallback(async (file: UploadFile, fileList: UploadFile[], order: number) => {
    const newBannerList = [...bannerList]
    const index = fileList.findIndex(item => item.uid === file.uid)
    const item1 = newBannerList[index]
    newBannerList[index] = newBannerList[index + order]
    newBannerList[index + order] = item1
    setBannerList(newBannerList)
    await handleOrdersChange(newBannerList.map(x => x.id))
    await getBannerList()
  }, [bannerList])

  // // 移动，正数向后移动，负数向前移动
  // const  = useDebounce(handleMoveA,
  //   500
  // )

  const renderIcons: ActionBtnListItem[] = useMemo(() => {
    return [
      {
        title: "move-up",
        action: (file, fileList) => handleMove(file, fileList, -1),
        icon: (file, fileList) => {
          return fileList.findIndex(item => item.uid === file.uid) === 0 ? null : <UpOutlined />
        },
      },
      {
        title: "move-down",
        action: (file, fileList) => handleMove(file, fileList, 1),
        icon: (file, fileList) => {
          return fileList.findIndex(item => item.uid === file.uid) === fileList.length - 1 ? null : <DownOutlined />
        },
      },
    ]
  }, [handleMove])

  return (
    <div className={styles['carousel-img']} >
      <div className={styles["title"]}>{txt}: </div>
      <Spin spinning={upDataLoading || getDataLoading}>
        <div className={styles["content"]}>
          <p className={`${styles['tip']} ${styles['red-tip']}`}>
            严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担
        </p>
          <p className={styles["tip"]}>{tip}</p>
          <div className={styles['upload-container']}>
            <ImgUpload
              uploadType={2}
              editData={editData}
              uploadBtnText="上传图片"
              maxSize={3}
              maxLength={5}
              aspectRatio={aspectRatio}
              cropProps={{ aspectRatio }}
              actionBtn={renderIcons}
              onChange={handleChange}
            />
          </div>
        </div>
      </Spin>
    </div >
  );
}
