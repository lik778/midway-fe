import React, { FC, useState, useEffect } from 'react';
import { SelectProductListItem, SelectArticleListItem, ConfigItemType } from '../../../../data';
import styles from './index.less'
import { AuditStatus } from '@/enums';
import { auditStatusText } from '@/constants';
import { formatTime } from '@/utils/index'

interface Props {
  index: number,
  type: ConfigItemType,
  content: SelectProductListItem | SelectArticleListItem
  actionConfig?: {
    delete: boolean,
    select: boolean,
    draggable: boolean
  },
  selectNum?: number,
  handleChangeSelect?: (selected: boolean, content: SelectProductListItem | SelectArticleListItem) => void
  handleClickDelete?: (content: SelectProductListItem | SelectArticleListItem) => void
  handleDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  handleDragOver?: React.DragEventHandler<HTMLDivElement>
  handleDrop?: (e: React.DragEvent<HTMLDivElement>, endIndex: number) => void
}

const ContentItem: FC<Props> = (props) => {
  const { index, type, content, actionConfig, selectNum, handleChangeSelect, handleClickDelete, handleDragStart, handleDragOver, handleDrop } = props
  const [localActionConfig, setLocalActionConfig] = useState(() => {
    const localActionConfig = {
      delete: false,
      select: false,
      draggable: false
    }
    return {
      ...localActionConfig,
      ...(actionConfig || {})
    }
  })

  const handleClickSelect = () => {
    handleChangeSelect!(!Boolean(selectNum), content)
  }


  return <div className={`${styles['content-container']} ${styles[type]}`} title={content.name && content.name.length > 25 ? content.name : undefined} draggable={localActionConfig.draggable} onDragStart={(e) => handleDragStart!(e, index)} onDrop={(e) => handleDrop!(e, index)} onDragOver={handleDragOver} >
    {
      type === 'product' && <div className={styles['content']}>
        <div className={styles['img-box']}>
          {
            ((content.status !== AuditStatus.APPROVE) || (localActionConfig.select && selectNum)) && <div className={styles['mask']}></div>
          }
          {
            localActionConfig.delete && <img className={styles['delete']} src="//file.baixing.net/202108/46964751270fa2badbdefc08a4577ad0.png" onClick={() => { handleClickDelete!(content) }}></img>
          }
          {
            content.status === AuditStatus.APPROVE && localActionConfig.select && <>
              {
                !selectNum && <div className={styles['select-box']} onClick={handleClickSelect}></div>
              }
              {
                selectNum && <>
                  <div className={`${styles['select-box']} ${styles['selected']}`} onClick={handleClickSelect}>
                    {selectNum}
                  </div>
                </>
              }
            </>
          }
          {
            content.status !== AuditStatus.APPROVE && <div className={styles['status']}>
              <div className={styles['title']}>
                {
                  auditStatusText[content.status]
                }
              </div>
              <div className={styles['memo']}>
                {
                  content.memo || ''
                }
              </div>
            </div>
          }
          <img className={styles['img']} src={content.headImg || '//file.baixing.net/202011/722f557a62889f098f7843fd3481e22b.png'}></img>
        </div>
        <div className={styles['text-box']}>
          <div className={styles['name']}>{content.name}</div>
          <div className={styles['price']}>价格：{(content as SelectProductListItem).price || '暂无价格'}</div>
        </div>
      </div>
    }
    {
      type === 'article' && <>
        <div className={styles['content']}>
          {
            content.status === AuditStatus.APPROVE && localActionConfig.select && <>
              {
                selectNum && <div className={`${styles['select-box']} ${styles['selected']}`} onClick={handleClickSelect}>
                  {selectNum}
                </div>
              }
              {
                !selectNum && <div className={styles['select-box']} onClick={handleClickSelect}></div>
              }
            </>
          }
          <div className={styles['name']}>{content.name}</div>
          <div className={styles['time']}>{formatTime(content.createdTime)}</div>
          {
            localActionConfig.delete && <div className={styles['delete']} onClick={() => { handleClickDelete!(content) }}>删除</div>
          }
        </div>
        {
          content.status !== AuditStatus.APPROVE && <div className={styles['status']}>
            状态：{auditStatusText[content.status]}&nbsp;&nbsp;{content.memo || ''}
          </div>
        }
      </>
    }
  </div>
}

export default ContentItem