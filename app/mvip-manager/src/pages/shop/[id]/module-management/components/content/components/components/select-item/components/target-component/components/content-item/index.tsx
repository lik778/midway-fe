import React, { FC, useState, useEffect } from 'react';
import { SelectArticleListItem, SelectProductListItem, ConfigItemType } from '../../../../data';
import styles from './index.less'

interface Props {
  type: ConfigItemType,
  content: SelectProductListItem | SelectArticleListItem
  actionConfig?: {
    delete: boolean,
    select: boolean
  },
  selectNum?: number,
  handleChangeSelect?: (selected: boolean, content: SelectProductListItem | SelectArticleListItem) => void
  handleClickDelete?: (content: SelectProductListItem | SelectArticleListItem) => void
}

const ContentItem: FC<Props> = (props) => {
  const { type, content, actionConfig, selectNum, handleChangeSelect, handleClickDelete } = props
  const [localActionConfig, setLocalActionConfig] = useState(() => {
    const localActionConfig = {
      delete: false,
      select: false
    }
    return {
      ...localActionConfig,
      ...(actionConfig || {})
    }
  })

  const handleClickSelect = () => {
    handleChangeSelect!(!Boolean(selectNum), content)
  }

  return <div className={styles['content-container']}>
    <div className={styles['content']}>
      {
        type === 'product' && <img className={styles['img']} src={(content as SelectProductListItem).headImg}></img>
      }
      <div className={styles['text-box']}>
        <div className={styles['name']}>{content.name}</div>
        {
          type === 'product' && <div className={styles['price']}>{(content as SelectProductListItem).price || '暂无价格'}</div>
        }
      </div>
    </div>
    <div className={styles['action']}>
      {
        localActionConfig.select && <>
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
      {
        localActionConfig.delete && <div className={styles['delete']} onClick={() => { handleClickDelete!(content) }}>删除</div>
      }
    </div>
  </div>
}

export default ContentItem