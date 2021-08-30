import React, { useContext, useEffect, useRef, useState, useCallback } from "react"
import { Spin } from "antd"
import { debounce } from 'lodash'

import PreviewModal from './preview-modal'

import { TabScopeItem, CardItem, MediaAssetsItem } from "@/interfaces/shop"
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
  preview: (image: MediaAssetsItem) => any
  handleSelectCard: (e: any, card: CardItem) => any
}

interface CardsContainerProps {
  lists: CardItem[]
  selection: any[]
  curScope: TabScopeItem
  loading: boolean
  pagiConf: any
  setPagiConf: (conf: Partial<PaginationSetting>) => void
  select: (id: number | number[]) => void
  setSelection: (ids: number[]) => void
  unselect: (id: number | number[]) => void
  refresh: (resetPagi?: boolean) => void
  emptyTip: JSX.Element | null
  cardItem: (props: CustomCardItemProps) => (JSX.Element | null)
  customPreview?: null | ((card: CardItem) => (JSX.Element | null))
}

/**
 * 卡片列表容器
 * 主要用来展现列表，负责页面宽度自适应和 flex 布局填充
 */
export default function CardsContainer(props: CardsContainerProps) {

  /***************************************************** States */

  const {
    lists, selection, curScope, loading, pagiConf,
    setPagiConf, setSelection, select, unselect, refresh,
    emptyTip, cardItem, customPreview
  } = props

  const [previewItem, setPreviewItem] = useState<MediaAssetsItem | undefined>()
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

  const preview = (image: MediaAssetsItem) => {
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
    return cardItem({
      curScope,
      card,
      selection,
      loading,
      lists,
      setSelection,
      refresh,
      preview,
      handleSelectCard
    })
  }

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
          {/* 渲染卡片列表 */}
          {lists.map((x: any) => renderCard(x))}
          {/* 填充卡片列表（防止 flex 布局塌陷） */}
          {renderFlexPadding()}
          {(lists.length === 0 && !loading) && emptyTip}
        </div>
      </Spin>
      <PreviewModal
        lists={lists}
        previewItem={previewItem}
        previewModal={previewModal}
        closePreviewModal={closePreviewModal}
        preview={preview}
        customPreview={customPreview}
      />
    </>
  )
}
