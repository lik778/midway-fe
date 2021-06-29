import React, { useState, useEffect } from 'react';
import _ from "lodash";

import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { changeBannerOrderApi, createBannerApi, getBannerListApi, deleteBannerApi } from '@/api/shop';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { DeviceType } from '@/enums';
import { errorMessage } from '@/components/message';
import Loading from '@/components/loading';
import { ImgUpload } from "@/components/img-upload";
import { ActionBtnListItem } from '@/components/img-upload/data';

import "./index.less";

interface Props {
  type: DeviceType,
  position: number,
  txt: string,
  tip: string,
}

export default (props: Props) => {
  const { type, txt, tip, position } = props
  const [bannerList, setBannerList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const itemRenderWidth = type === 1 ? 531 : 264
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    getBannerList()
  }, [])

  const getBannerList = async () => {
    const res = await getBannerListApi(Number(params.id), {
      page: 1,
      size: 5,
      status: 1,
      type,
      position
    })
    if (res?.success) {
      const list = res.data.result
      list.map((l: any) => {
        l['uid'] = l.id.toString()
        l['url'] = l.displayImgUrl
        l['status'] = 'done'
      })
      console.log('bannerList: ', list)
      setBannerList(list)
      setIsLoading(false)
    } else {
      errorMessage(`获取图片失败，请稍后重试。`);
    }
  }

  const createBannerImg = async (url: string) => {
    const maxWeight = bannerList.length
      ? Math.max(...bannerList.map(x => +x.weight))
      : 0
    return await createBannerApi(Number(params.id), {
      url,
      type,
      position,
      // weight 字段越大排序越靠后
      weight: maxWeight + 1
    })
  }

  const deleteBannerImg = async (id: number) => {
    return await deleteBannerApi(Number(params.id), {id})
  }

  // 目前受控数据每次变动的范围只有一个子项（新增或删除），
  // 图片裁剪也是只改了一个子项（新增且删除），
  // 后期如果 img-upload API 变动，这个地方需要重新确认，
  // 比如涉及到多图片上传时的交互，部分失败的情况
  const handleValueChange = (url: string | string[]) => {
    const urls = url instanceof Array ? [...url] : [url]
    const toRemoves = bannerList
      .filter(x => !urls.find(y => isSameImage(x, y)))
      .filter(notNull)
    const toCreates = urls
      .filter(x => !bannerList.find(y => isSameImage(x, y)))
      .filter(notNull)
    console.log('handleValueChange : ', toRemoves, toCreates, bannerList, urls);
    const resRemoves = toRemoves.map(x => deleteBannerImg(x.id))
    const resCreates = toCreates.map(x => createBannerImg(x))

    Promise
      .all([...resRemoves, ...resCreates])
      .then(res => {
        const isSuccess = res.every(x => x.success)
        if (isSuccess) {
          getBannerList()
        } else {
          errorMessage(`上传失败: ${res[0].message}`)
        }
      })
      .catch(error => {
        errorMessage(`上传失败: ${error}`)
      })
  }

  // 改变轮播图顺序
  // 后端根据图片 ID 自动获取轮播图类型
  const handleOrdersChange = _.debounce(
    async (ids: number[]) => {
      await changeBannerOrderApi(+params.id, ids)
      await getBannerList()
    },
    500
  )

  // 移动，正数向后移动，负数向前移动
  const handleMove = async (file: any, order: number) => {
    const tempFileList = [...bannerList]
    const index = tempFileList.findIndex(x => x === file)
    const length = tempFileList.length
    tempFileList.splice(index, 1)
    tempFileList.splice(
      Math.min(length, Math.max(0, index + order)),
      0,
      file
    )
    setBannerList(tempFileList)
    await handleOrdersChange(tempFileList.map(x => x.id))
  }

  const renderIcons: ActionBtnListItem[] = [
    {
      title: "move-up",
      action: (file: any) => handleMove(file, -1),
      icon: (file: any) => {
        const isFirstOrder = file === bannerList[0]
        return isFirstOrder ? null : <UpOutlined />
      },
    },
    {
      title: "move-down",
      action: (file: any) => handleMove(file, 1),
      icon: (file: any) => {
        const isLastOrder = file === bannerList[bannerList.length - 1]
        return isLastOrder ? null : <DownOutlined />
      },
    },
  ]

  if (isLoading) {
    return <Loading />
  } else {
    return (
      <div className="all-img page-shop-carousel">
        <span className="title">{txt}: </span>
        <div className="img-list">
          <p className="red-tip tip">
            严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担
          </p>
          <p className="tip">{tip}</p>
          <ImgUpload
            imgType="text"
            text="上传图片"
            maxSize={3}
            maxLength={5}
            fileList={bannerList}
            itemWidth={itemRenderWidth}
            cropProps={{ aspectRatio: 1920 / 450 }}
            actionBtn={renderIcons}
            onChange={handleValueChange}
          />
        </div>
      </div>
    );
  }
}

// * wuhu 这个函数和 Props 同样混乱
function isSameImage (x: any, y: any) {
  x = typeof x === 'string' ? { url: x } : x
  y = typeof y === 'string' ? { url: y } : y
  if (+x.id && +y.id) {
    return +y.id === +x.id
  }
  if (x.url && y.url) {
    // remove '#' in uploaded image url string
    const xurl = x.url.split("#")[0]
    const yurl = y.url.split("#")[0]
    return xurl === yurl ||
      xurl.includes(yurl) ||
      yurl.includes(xurl)
  }
  console.warn("[ERROR] in isSameImage", x, y)
}

function notNull (arg: any) {
  return !!arg
}
