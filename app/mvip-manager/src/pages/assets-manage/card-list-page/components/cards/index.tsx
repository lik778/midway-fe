import React, { useEffect, useRef, useState, useCallback } from "react"
import { Spin, Button, Result, Checkbox, Modal } from "antd"
import {
  LeftOutlined,
  RightOutlined,
  PartitionOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  LoadingOutlined
} from "@ant-design/icons"
import { debounce } from 'lodash'

import { successMessage, errorMessage } from "@/components/message"
import { delImagesetImage, delImagesetFailedImage, moveImagesetImage } from '@/api/shop'
import { useSelectAlbumListsModal } from '../select-album-modal'

import { TabScope, TabScopeItem, CardItem, AlbumItem, ImageItem, AlbumNameListItem } from "@/interfaces/shop"
import { PaginationSetting } from '../../hooks/pagination'

import styles from "./index.less"

export type CustomCardItemProps = {
  card: CardItem
  selection: any[]
  loading: boolean
  lists: CardItem[]
  refresh: (resetPagi?: boolean) => void
  setSelection: (ids: number[]) => void
  previewImage: (image: ImageItem) => any
  handleSelectCard: (e: any, card: CardItem) => any
  moveImage: (e: any, image: ImageItem) => any
  delImage: (e: any, image: ImageItem) => any
}

interface CardsProps {
  shopId: number;
  lists: CardItem[];
  selection: any[];
  curScope: TabScopeItem | undefined;
  allAlbumLists: AlbumNameListItem[];
  loading: boolean;
  pagiConf: any;
  setPagiConf: (conf: Partial<PaginationSetting>) => void;
  select: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  unselect: (id: number | number[]) => void;
  goTabScope: (scope: TabScopeItem) => void;
  refresh: (resetPagi?: boolean) => void;
  emptyTip: JSX.Element | null
  cardItem?: (props: CustomCardItemProps) => (JSX.Element | null)
}
export default function Cards(props: CardsProps) {

  /***************************************************** States */

  const {
    shopId, lists, selection, curScope, allAlbumLists, loading, pagiConf,
    setPagiConf, setSelection, select, unselect, goTabScope, refresh,
    emptyTip, cardItem
  } = props;

  const [$selectAlbumModal, selectAlbum] = useSelectAlbumListsModal({ allAlbumLists })

  const [previewItem, setPreviewItem] = useState<ImageItem | undefined>();
  const [previewModal, setPreviewModal] = useState(false);

  const [countInLine, setCountInLine] = useState(0)
  const cardsRef = useRef<HTMLElement | undefined>()

  // 计算 cards 区域的宽度一行能放几个卡片，
  // 依次设置分页参数
  const checkMaxCountInLine = useCallback((width?: number) => {
    if (width) {
      const cardWidth = 220
      const gapMax = 46
      const gapMin = 36
      const tryCount = [3, 4, 5, 6, 7, 8]
      // FIXME type
      const result = tryCount.reduce((h, c) => {
        if (!h) {
          const maxWidthLimit = (cardWidth + gapMax) * c - gapMax
          const minWidthLimit = (cardWidth + gapMin) * c - gapMin
          const isFit = ((width > minWidthLimit) && (width < maxWidthLimit))
          if (isFit) return c
          const isBigger = width < minWidthLimit
          if (isBigger) {
            const last = tryCount.find((x, i) => tryCount[i+1] === c)
            return last
          }
        }
        return h
      }, 0) || tryCount[0]
      if (countInLine !== result) {
        setCountInLine(result)
      }
      const countInPage = result * 2
      if (pagiConf.pageSize !== countInPage) {
        // FIXME 100ms 会导致空列表提示一闪而过
        debounce(() => {
          setPagiConf({
            pageSize: countInPage,
            pageSizeOptions: [
              String(countInPage),
              String(countInPage * 2),
              String(countInPage * 4),
            ]
          })
        }, 100)
      }
    }
  }, [countInLine])

  const saveCardsRef = useCallback((el: HTMLElement) => {
    cardsRef.current = el
    checkMaxCountInLine(cardsRef.current.offsetWidth)
  }, [checkMaxCountInLine])

  // 视窗宽度变化后自动重设每行最大卡片数量
  useEffect(() => {
    const reCalcWidth = debounce(() => {
      const $el = cardsRef.current
      if ($el) {
        checkMaxCountInLine($el.offsetWidth)
      }
    }, 300)
    window.addEventListener('resize', reCalcWidth)
    return () => {
      window.removeEventListener('resize', reCalcWidth)
    }
  }, [])

  /***************************************************** Interaction Fns */

  const previewImage = (image: ImageItem) => {
    setPreviewItem(image)
    setPreviewModal(true)
  }
  const closePreviewModal = () => {
    setPreviewItem(undefined)
    setPreviewModal(false)
  }

  // 选中/取消选中卡片
  const handleSelectCard = (e: any, card: CardItem) => {
    e.stopPropagation()
    const { id } = card
    if (e.target.checked) {
      select(id)
    } else {
      unselect(id)
    }
  }

  /***************************************************** API Calls */

  // 删除确认 Modal
  const delCallback = useCallback(async (api: any, query: any, info: string, callback?: () => void) => {
    Modal.confirm({
      title: '确认删除',
      content: info,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          api(shopId, query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功');
                callback && callback()
                resolve(res.success)
              } else {
                throw new Error(res.message || "出错啦，请稍后重试");
              }
            })
            .catch((error: any) => {
              errorMessage(error.message)
              setTimeout(reject, 1000)
            })
        })
      }
    })
  }, [lists])

  // 删除图片
  const delImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const delMethod = curScope?.type === 'image'
      ? delImagesetImage
      : delImagesetFailedImage
    const info = `图片删除后无法恢复，确认删除？`
    await delCallback(delMethod, { ids: [id], mediaCateId: curScope?.item?.id }, info, () => {
      setSelection(selection.filter(x => x !== id))
      refresh(lists.length === 1)
    })
  }, [selection, lists, curScope, refresh])

  // 移动图片
  const moveImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    if (!curScope) {
      return
    }
    const { id } = image
    const album = await selectAlbum({
      exclude: curScope.item ? [curScope?.item?.id] : []
    })
    const resetRefreshPagi = lists.length === 1
    moveImagesetImage(shopId, { id, mediaCateId: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功');
          setSelection(selection.filter(x => x !== id))
          refresh(resetRefreshPagi)
        } else {
          throw new Error(res.message || "出错啦，请稍后重试");
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
  }, [shopId, selection, curScope, lists, refresh])

  /***************************************************** Renders */

  const renderCard = (card: CardItem) => {
    if (cardItem) {
      return cardItem({
        card,
        selection,
        loading,
        lists,
        setSelection,
        refresh,
        previewImage,
        handleSelectCard,
        moveImage,
        delImage
      })
    } else {
      return null
    }
    console.error('[ERR] Error TabScope Rendered')
  }

  // 填充 flex 布局中未满的区域
  const renderFlexPadding = useCallback(() => {
    if (countInLine) {
      const padCount = countInLine - (lists.length % countInLine)
      if (padCount > 0 && padCount < countInLine) {
        return Array(padCount).fill('').map((x, i) => {
          return <div className={styles["padding-card"]} key={i} />
        })
      }
    }
  }, [countInLine, lists])

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles["cards-con"]} ref={el => el && saveCardsRef(el)}>
          {lists.map((x: any) => renderCard(x))}
          {renderFlexPadding()}
          {(lists.length === 0 && !loading) && emptyTip}
        </div>
      </Spin>
      <PreviewModal
        lists={lists}
        previewItem={previewItem}
        previewModal={previewModal}
        closePreviewModal={closePreviewModal}
        previewImage={previewImage}
      />
      {$selectAlbumModal}
    </>
  )
}

/**
 * 图片预览模态框
 */

declare global {
  interface Window {
    __page_imageset_preview_modal_keycatch_tick: any | null;
  }
}

type PreviewModalProps = {
  lists: CardItem[]
  previewItem: ImageItem|undefined
  previewModal: boolean
  closePreviewModal: () => any
  previewImage: (image: ImageItem) => any
}
function PreviewModal(props: PreviewModalProps) {
  const { lists, previewItem, previewModal, closePreviewModal, previewImage } = props
  const clear = () => {
    if (window.__page_imageset_preview_modal_keycatch_tick) {
      window.removeEventListener('keyup', window.__page_imageset_preview_modal_keycatch_tick)
      window.__page_imageset_preview_modal_keycatch_tick = null
    }
  }
  if (!previewItem) {
    clear()
    return null
  }
  if (lists && lists.length === 0) {
    clear()
    return null
  }

  const target = lists.find(x => x.id === previewItem.id)
  if (!target) {
    clear()
    return null
  }

  const targetIDX = lists.findIndex(x => x === target)
  const prev = lists[targetIDX - 1]
  const next = lists[targetIDX + 1]

  useEffect(() => {
    const handlePreview = (e: any) => {
      if ((e?.code === 'ArrowLeft') && prev) {
        previewImage(prev as ImageItem)
      }
      if ((e?.code === 'ArrowRight') && next) {
        previewImage(next as ImageItem)
      }
    }
    window.addEventListener('keyup', handlePreview)
    window.__page_imageset_preview_modal_keycatch_tick = handlePreview
    return () => {
      window.removeEventListener('keyup', handlePreview)
      window.__page_imageset_preview_modal_keycatch_tick = null
    }
  }, [lists, prev, next])

  return (
    <Modal
      wrapClassName="image-preview-modal"
      width="100vw"
      footer={null}
      visible={previewModal}
      onCancel={closePreviewModal}
    >
      <div className={"image-wrapper " + ((previewModal && previewItem) ? 'active' : '')}>
        {/* FIXME 图片太小的话遮不住这个框框 */}
        <LoadingOutlined />
        <img src={previewItem.imgUrl} alt="预览图片" />
        {prev && <LeftOutlined title="上一张" onClick={() => previewImage(prev as ImageItem)} />}
        {next && <RightOutlined title="下一张" onClick={() => previewImage(next as ImageItem)} />}
      </div>
    </Modal>
  )
}
