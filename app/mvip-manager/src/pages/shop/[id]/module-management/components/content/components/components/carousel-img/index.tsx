import React, { FC, useCallback, useState, useEffect, useMemo, Ref, useImperativeHandle } from "react";
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
import { forwardRef } from "react";
import { ModulePageType } from '@/interfaces/shop'
interface Props {
  autoUpdata?: boolean, // 是否操作后自动更新数据
  type: DeviceType,
  position: ModulePageType,
  txt: string,
  tip: string,
  aspectRatio: number
}

const CarouselItem = (props: Props, parentRef: Ref<any>) => {
  const { autoUpdata = true, type, txt, tip, position, aspectRatio } = props
  const [bannerList, setBannerList] = useState<BannerListItem[]>([])
  // 当前banner是否被修改过
  const [changeFlag, setChangeFlag] = useState<boolean>(false)
  // 需要删除的bannerId
  const [delBannerIds, setDelBannerIds] = useState<number[]>([])
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

  const createBannerImg = async (url: string) => {
    setUpDataLoading(true)
    // 原有逻辑是权重控制排序
    // 现在每次修改都会更具图片id排次序所以可以忽略了权重
    const maxWeight = (bannerList.length
      ? Math.max(...bannerList.map(x => +x.weight || 0))
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

    let localValues: { id?: number, url: string, preview: string }[] = fileList.map(item => ({
      url: item.url!,
      preview: item.preview!
    }))

    const localBannerList = [...bannerList]
    const newBannerList: BannerListItem[] = []
    localValues.forEach(item => {
      const index = localBannerList.findIndex(oItem => oItem.displayImgUrl === item.url)
      if (index !== -1) {
        const dItem = localBannerList.splice(index, 1)[0]
        newBannerList.push(dItem)
      } else {
        newBannerList.push({
          ...item,
          displayImgUrl: item.preview,
          hrefUrl: '',
          imgUrl: item.url,
          position,
          status: NaN,
          weight: NaN,
          id: NaN
        })
      }
    })
    const newDelBannerIds = [...new Set([...delBannerIds, ...localBannerList.filter(item => item.id).map(item => item.id)])]
    if (autoUpdata) {
      handleUpData('all', newBannerList, newDelBannerIds)
    } else {
      setBannerList(newBannerList)
      setDelBannerIds(newDelBannerIds)
      setChangeFlag(true)
    }
  }

  // 移动事件
  const handleMove = useCallback(async (file: UploadFile, fileList: UploadFile[], order: number) => {
    const newBannerList = [...bannerList]
    const index = fileList.findIndex(item => item.uid === file.uid)
    const item = newBannerList[index]
    newBannerList[index] = newBannerList[index + order]
    newBannerList[index + order] = item
    if (autoUpdata) {
      handleUpData('move', newBannerList, [])
    } else {
      setBannerList(newBannerList)
      setChangeFlag(true)
    }
  }, [bannerList])

  // 提交函数 单个move还是从弹窗中选择了多个图, 
  // 分自动更新还是手动更新，对应的数据源不同
  // 自动更新需要传 nowBannerList nowDelBannerIds
  const handleUpData = useCallback(async (type: 'move' | 'all', nowBannerList?: BannerListItem[], nowDelBannerIds?: number[]) => {
    // 当手动控制更新 则判断是否有修改过顺序等信息
    if (!autoUpdata && !changeFlag) {
      console.log('没有修改')
      return
    }
    if (type === 'move') {
      await handleOrdersChange((autoUpdata ? nowBannerList! : bannerList).map(x => x.id))
    } else if (type === 'all') {
      // 这里的ids会混入删除接口传进来的空，所以下面要过滤
      const ids = await Promise.all([...(autoUpdata ? nowBannerList! : bannerList).map(item => {
        if (item.id) {
          return Promise.resolve(item.id)
        } else {
          return createBannerImg(item.imgUrl)
        }
      }), ...(autoUpdata ? nowDelBannerIds! : delBannerIds).map(item => deleteBannerImg(item))])
      await handleOrdersChange(ids.filter(item => typeof item === 'number') as number[])
      // 进行一次全量数据更新后需要置空删除标识符
      setDelBannerIds([])
    }
    // 重置修改标识
    if (!autoUpdata) {
      setChangeFlag(false)
    }
    await getBannerList()
  }, [changeFlag, bannerList, delBannerIds])

  // 将提交的函数放到上层控制
  useImperativeHandle(parentRef, () => ({
    handleUpData,
    disabled: upDataLoading || getDataLoading
  }), [upDataLoading, getDataLoading, handleUpData])

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
      <Spin wrapperClassName={styles["content"]} spinning={upDataLoading || getDataLoading}>
        <p className={`${styles['tip']} ${styles['red-tip']}`}>严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担</p>
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
      </Spin>
    </div >
  );
}

export default forwardRef(CarouselItem)