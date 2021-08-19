import React, { useEffect } from "react"
import { Modal } from "antd"
import { LeftOutlined, RightOutlined, LoadingOutlined } from "@ant-design/icons"

import { CardItem, ImageItem } from "@/interfaces/shop"

declare global {
  interface Window {
    __page_imageset_preview_modal_keycatch_tick: any | null
  }
}

type PreviewModalProps = {
  lists: CardItem[]
  previewItem: ImageItem | undefined
  previewModal: boolean
  closePreviewModal: () => any
  preview: (image: ImageItem) => any
  customPreview?: (card: CardItem) => (JSX.Element | null)
}
export default function PreviewModal(props: PreviewModalProps) {
  const { lists, previewItem, previewModal, closePreviewModal, preview, customPreview } = props
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
        preview(prev as ImageItem)
      }
      if ((e?.code === 'ArrowRight') && next) {
        preview(next as ImageItem)
      }
    }
    window.addEventListener('keyup', handlePreview)
    window.__page_imageset_preview_modal_keycatch_tick = handlePreview
    return () => {
      window.removeEventListener('keyup', handlePreview)
      window.__page_imageset_preview_modal_keycatch_tick = null
    }
  }, [lists, prev, next])

  const $customPreview = customPreview && customPreview(previewItem)

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
        {$customPreview || <img src={previewItem.imgUrl} alt="预览图片" />}
        {prev && <LeftOutlined title="上一张" onClick={() => preview(prev as ImageItem)} />}
        {next && <RightOutlined title="下一张" onClick={() => preview(next as ImageItem)} />}
      </div>
    </Modal>
  )
}
