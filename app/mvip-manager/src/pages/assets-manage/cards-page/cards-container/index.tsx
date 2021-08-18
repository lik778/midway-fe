import React, { useEffect, useRef, useState, useCallback } from "react"
import { Spin, Modal } from "antd"
import { LeftOutlined, RightOutlined, LoadingOutlined } from "@ant-design/icons"
import { debounce } from 'lodash'

import { TabScopeItem, CardItem, ImageItem, AlbumNameListItem } from "@/interfaces/shop"
import { PaginationSetting } from '@/hooks/pagination'

import styles from "./index.less"

export type CustomCardItemProps = {
  curScope: TabScopeItem
  card: CardItem
  selection: any[]
  loading: boolean
  lists: CardItem[]
  refresh: (resetPagi?: boolean) => void
  setSelection: (ids: number[]) => void
  previewImage: (image: ImageItem) => any
  handleSelectCard: (e: any, card: CardItem) => any
}

interface CardsContainerProps {
  shopId: number
  lists: CardItem[]
  selection: any[]
  curScope: TabScopeItem | undefined
  allAlbumLists: AlbumNameListItem[]
  loading: boolean
  pagiConf: any
  setPagiConf: (conf: Partial<PaginationSetting>) => void
  select: (id: number | number[]) => void
  setSelection: (ids: number[]) => void
  unselect: (id: number | number[]) => void
  refresh: (resetPagi?: boolean) => void
  emptyTip: JSX.Element | null
  cardItem?: (props: CustomCardItemProps) => (JSX.Element | null)
}

export default function CardsContainer(props: CardsContainerProps) {

  /***************************************************** States */

  const {
    shopId, lists, selection, curScope, allAlbumLists, loading, pagiConf,
    setPagiConf, setSelection, select, unselect, refresh,
    emptyTip, cardItem
  } = props

  const [previewItem, setPreviewItem] = useState<ImageItem | undefined>()
  const [previewModal, setPreviewModal] = useState(false)

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

  const saveCardsContainerRef = useCallback((el: HTMLElement) => {
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

  /***************************************************** Renders */

  const renderCard = (card: CardItem) => {
    if (cardItem && curScope) {
      return cardItem({
        curScope,
        card,
        selection,
        loading,
        lists,
        setSelection,
        refresh,
        previewImage,
        handleSelectCard
      })
    } else {
      return null
    }
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
        <div className={styles["cards-con"]} ref={el => el && saveCardsContainerRef(el)}>
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
    </>
  )
}

/**
 * 图片预览模态框
 */

declare global {
  interface Window {
    __page_imageset_preview_modal_keycatch_tick: any | null
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
