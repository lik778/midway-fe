import React, { useState, useContext } from 'react'
import { Checkbox, Modal } from "antd"
import { PartitionOutlined, DeleteOutlined, LoadingOutlined, DownOutlined, EditOutlined } from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { moveMediaAssets, delMediaAssets, setMediaCatesCover } from '@/api/shop'

import CardsPageContext from '../../context/cards-page'
import AlbumNamesContext from '../../context/album-names'

import { MediaAssetsItem } from "@/interfaces/shop"
import { CustomCardItemProps } from '../../cards-page/cards-container/index'

import styles from './index.less'

export default function ImageCardWrapper(props: any) {
  const { curScope, lists, selection, setSelection, editVideo, refresh } = props
  const { directoryType, subDirectoryLabel, selectAlbum } = useContext(CardsPageContext)
  const { } = useContext(AlbumNamesContext)
  const [setCoverItem, setSetCoverItem] = useState<MediaAssetsItem | null>()

  // 编辑视频名称
  const editVideoName = async (e: any, video: MediaAssetsItem) => {
    e.stopPropagation()
    await editVideo(video)
  }

  // 设置封面图片
  const setCoverImage = async (e: any, image: MediaAssetsItem) => {
    e.stopPropagation()
    setSetCoverItem(image)
    const { id } = image
    const { item } = curScope
    setMediaCatesCover({ id, mediaCateId: item.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('设置成功')
        } else {
          throw new Error(res.message || "出错啦，请稍后重试")
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
      .finally(() => {
        setSetCoverItem(null)
      })
  }

  // 移动图片
  const moveImage = async (e: any, image: MediaAssetsItem) => {
    e.stopPropagation()
    const { id } = image
    const album = await selectAlbum({
      exclude: curScope.item ? [curScope?.item?.id] : []
    })
    const resetRefreshPagi = lists.length === 1
    moveMediaAssets({ id, mediaCateId: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功')
          setSelection(selection.filter((x: number) => x !== id))
          refresh(resetRefreshPagi)
        } else {
          throw new Error(res.message || "出错啦，请稍后重试")
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
  }

  // 删除图片
  const delImage = async (e: any, image: MediaAssetsItem) => {
    e.stopPropagation()
    const { id } = image
    await Modal.confirm({
      title: '确认删除',
      content: `${subDirectoryLabel}删除后无法恢复，确认删除？`,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          const query = {
            ids: [id],
            mediaCateId: curScope!.item!.id,
            source: directoryType
          }
          delMediaAssets(query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功')
                setSelection(selection.filter((x: number) => x !== id))
                refresh(lists.length === 1)
                resolve(res.success)
              } else {
                throw new Error(res.message || "出错啦，请稍后重试")
              }
            })
            .catch((error: any) => {
              errorMessage(error.message)
              setTimeout(reject, 1000)
            })
        })
      }
    })
  }

  return (props: CustomCardItemProps) => {
    const card = props.card
    return (
      <ImageCard
        {...props}
        setCoverItem={setCoverItem}
        setCoverImage={setCoverImage}
        editVideoName={editVideoName}
        moveImage={moveImage}
        delImage={delImage}
        key={card.id}
      />
    )
  }
}

type ImageCardProps = CustomCardItemProps & {
  setCoverItem: MediaAssetsItem | null | undefined
  editVideoName: (e: any, image: MediaAssetsItem) => any
  setCoverImage: (e: any, image: MediaAssetsItem) => void
  moveImage: (arg: any, image: MediaAssetsItem) => void
  delImage: (arg: any, image: MediaAssetsItem) => void
}

function ImageCard(props: ImageCardProps) {
  const {
    selection, setCoverItem, loading,
    handleSelectCard, preview,
    setCoverImage, moveImage, delImage, editVideoName
  } = props
  const card = props.card as MediaAssetsItem
  const { directoryType } = useContext(CardsPageContext)
  const isImage = directoryType === 'IMAGE'

  const { id, imgUrl, title, decodeStatus, checkStatus } = card
  const isChecked = selection.find((y: number) => y === id)
  const inSetCoverLoading = setCoverItem && setCoverItem.id === id
  const inMachineAudit = checkStatus === 'DEFAULT'
  const inEncoding = decodeStatus === 'DECODING'
  const isSuccess = decodeStatus === 'SUCCESS'
  const isError = !isSuccess && !inEncoding
  const isVideoError = directoryType === "VIDEO" && isError
  // 应该是数据流动的问题，导致如果不检测 decodeStatus 就会显示 ErrorMask
  const showVideoMask = directoryType === 'VIDEO' && card.hasOwnProperty('decodeStatus') && !loading

  const stopEvent = (e: any) => e.stopPropagation()

  return (
    <div
      className={isImage ? styles["image-card"] : styles["video-card"]}
      key={`image-card-${id}`}
      onClick={() => preview(card)}
    >
      {showVideoMask && (
        inEncoding ? (
          <div className={styles["mask"] + ' ' + styles['full']}>
            <LoadingOutlined />
            <span>正在转码中，请稍等</span>
            <span className={styles["reason"]}>转码完成后第一时间通知您</span>
          </div>
        ) : inMachineAudit ? (
          <div className={styles["mask"] + ' ' + styles['full']}>
            <LoadingOutlined />
            <span>正在审核中，请稍等</span>
            <span className={styles["reason"]}></span>
          </div>
        ) : isError ? (
          <div className={styles["mask"] + ' ' + styles['full']}>
            <ErrorIcon />
            <span>转码失败</span>
            <span className={styles["reason"]}>转码失败，请删除重试</span>
          </div>
        ) : null
      )}
      <div className={styles["selection"] + ' ' + styles['auto-hide']} onClick={() => preview(card)}>
        <div className={styles["action-wrapper"]}>
          <div className={styles["checkbox-wrapper"] + ' ' + (isChecked ? styles["checked"] : '')}>
            <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} onClick={e => stopEvent(e)} />
          </div>
          <div className={styles["anticon-down-con"]}>
            <div className={styles["anticon-down"]}>
              <DownOutlined />
            </div>
            <div className={styles["down-actions"]} onClick={e => moveImage(e, card)}>
              {!isError && directoryType === 'VIDEO' && (
                <div className={styles["anticon-down-item"]} onClick={e => editVideoName(e, card)}>
                  <EditOutlined />
                  <span>编辑</span>
                </div>
              )}
              {!isVideoError && (
                <div className={styles["anticon-down-item"]}>
                  <MoveIcon customStyle={{ width: 12, transform: 'scale(2.5)' }} />
                  <span>移动</span>
                </div>
              )}
              <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card)}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              {(directoryType === 'IMAGE') && (
                <div className={styles["anticon-down-item"]} onClick={e => setCoverImage(e, card)}>
                  {inSetCoverLoading ? <LoadingOutlined /> : <EditOutlined />}
                  <span>设为封面</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {(!loading && imgUrl) && (
        <div className={styles["cover-con"]}>
          <img className={styles["cover"]} src={imgUrl} alt="cover" />
        </div>
      )}
      {(!loading && imgUrl && directoryType === 'VIDEO') && (
        <div className={styles["header"]}>
          <span className={styles["name"]} title={title}>{title || '未命名视频'}</span>
        </div>
      )}
    </div>
  )
}

function ErrorIcon() {
  return (
    <svg className={styles['anticon']} xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 22 22" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-317.000000, -486.000000)">
          <g transform="translate(317.000000, 486.000000)">
            <circle fill="#F1492C" cx="11" cy="11" r="11" />
            <path d="M10.8217593,5.72916667 C11.2084864,5.72916667 11.5219907,6.04267098 11.5219907,6.42939815 L11.5211667,10.1211667 L15.2141204,10.1215278 C15.6008475,10.1215278 15.9143519,10.4350321 15.9143519,10.8217593 C15.9143519,11.2084864 15.6008475,11.5219907 15.2141204,11.5219907 L11.5211667,11.5211667 L11.5219907,15.2141204 C11.5219907,15.6008475 11.2084864,15.9143519 10.8217593,15.9143519 C10.4350321,15.9143519 10.1215278,15.6008475 10.1215278,15.2141204 L10.1211667,11.5211667 L6.42939815,11.5219907 C6.04267098,11.5219907 5.72916667,11.2084864 5.72916667,10.8217593 C5.72916667,10.4350321 6.04267098,10.1215278 6.42939815,10.1215278 L10.1211667,10.1211667 L10.1215278,6.42939815 C10.1215278,6.04267098 10.4350321,5.72916667 10.8217593,5.72916667 Z" id="形状结合" fill="#FFFFFF" transform="translate(10.821759, 10.821759) rotate(-45.000000) translate(-10.821759, -10.821759) " />
          </g>
        </g>
      </g>
    </svg>
  )
}

function MoveIcon(props: any) {
  const { customStyle } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" version="1.1" style={customStyle || {}}>
      <defs>
        <filter x="-9.1%" y="-11.8%" width="118.2%" height="123.5%" filterUnits="objectBoundingBox" id="filter-1">
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.199191434 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1" />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-367.000000, -377.000000)" fill="currentColor" fillRule="nonzero">
          <g filter="url(#filter-1)" transform="translate(256.000000, 352.000000)">
            <g transform="translate(105.000000, 8.000000)">
              <g transform="translate(15.000000, 26.000000)">
                <path d="M13.8850517,6.72050597 L11.6671907,4.50248833 L11.6671907,4.50248835 C11.5147699,4.35005684 11.2676472,4.35005684 11.1152264,4.5024883 C10.9628056,4.65491982 10.9628056,4.90206004 11.1152263,5.05449156 C11.1152263,5.05449156 11.1152263,5.05449156 11.1152263,5.05449156 L12.6661329,6.60650615 L7.39147228,6.60650615 L7.39147228,1.33446871 L8.9423788,2.88548476 L8.94237878,2.88548474 C9.09479954,3.03819257 9.34214662,3.0384169 9.49484367,2.88598478 C9.64754071,2.73355326 9.64776503,2.48618871 9.49534368,2.33348088 L7.27748265,0.115463235 L7.27748265,0.115463234 C7.12586889,-0.0375209049 6.87895402,-0.0386234095 6.72598068,0.113000997 C6.72515634,0.113818073 6.72433565,0.114638832 6.72351862,0.115463234 L4.5056576,2.33447942 L4.50565758,2.33447944 C4.35323682,2.48718727 4.35346114,2.73455182 4.50615758,2.88698334 C4.65885463,3.03941486 4.90620171,3.03919053 5.05862247,2.8864833 L6.60952899,1.33446871 L6.60952899,6.60650614 L1.3348684,6.60650614 L2.88577492,5.05449155 L2.88577495,5.05449153 C3.0381957,4.90206001 3.0381957,4.65491979 2.88577489,4.50248827 C2.73335414,4.35005675 2.48623137,4.35005675 2.33381061,4.50248833 L0.114951114,6.72050597 L0.114951143,6.72050594 C-0.0377459029,6.87240809 -0.0383983316,7.11934313 0.113492534,7.27205096 C0.113977432,7.27253847 0.114463617,7.27302469 0.114951088,7.27350962 L2.33381059,9.49152726 L2.33381059,9.49152727 C2.48623134,9.64395878 2.73335411,9.64395878 2.88577487,9.49152727 C3.03819562,9.33909575 3.03819562,9.09195553 2.88577487,8.93952401 C2.88577487,8.93952401 2.88577487,8.93952401 2.88577487,8.93952401 L1.33486835,7.38850797 L6.60952894,7.38850797 L6.60952894,12.6665367 L5.05862242,11.1155206 L5.05862241,11.1155206 C4.90620166,10.9628128 4.65885457,10.9625885 4.50615753,11.1150206 C4.35346048,11.2674522 4.35323617,11.5148167 4.50565756,11.6675245 L6.72551554,13.8855422 L6.72551552,13.8855422 C6.8776846,14.0379737 7.1246022,14.0381789 7.27702296,13.8859991 C7.27717538,13.8858469 7.27732768,13.8856946 7.27747985,13.8855422 L9.49534087,11.6675246 L9.49534086,11.6675246 C9.64776162,11.5148167 9.6475373,11.2674522 9.49484091,11.1150207 C9.34214386,10.9625892 9.09479678,10.9628135 8.94237602,11.1155207 L7.3914695,12.6665367 L7.3914695,7.38750945 L12.6661301,7.38750945 L11.1152236,8.94052258 L11.1152236,8.94052259 C10.9628028,9.09295411 10.9628028,9.34009433 11.1152236,9.49252585 C11.2676443,9.64495736 11.5147671,9.64495736 11.6671878,9.49252584 L13.8850489,7.2745082 L13.8850489,7.2745082 C14.0377459,7.12260605 14.0383983,6.87567101 13.8865074,6.72296318 C13.8860225,6.72247568 13.8855363,6.72198946 13.8850489,6.72150452 L13.8850517,6.72050597 Z" id="路径" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
