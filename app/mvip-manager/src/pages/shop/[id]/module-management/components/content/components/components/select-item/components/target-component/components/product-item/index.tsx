import React, { FC, useState, useEffect } from 'react';
import { SelectProductListItem, ConfigItemType } from '../../../../data';
import styles from './index.less'

interface Props {
  type: ConfigItemType,
  content: SelectProductListItem
  actionConfig?: {
    delete: boolean,
    select: boolean
  },
  selectNum?: number,
  handleChangeSelect?: (selected: boolean, content: SelectProductListItem) => void
  handleClickDelete?: (content: SelectProductListItem) => void
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
      <div className={styles['img-box']}>
        {
          localActionConfig.select && <>
            {
              !selectNum && <div className={styles['select-box']} onClick={handleClickSelect}></div>
            }
            {
              selectNum && <>
                <div className={styles['selected-mask']} onClick={handleClickSelect}></div>
                <div className={`${styles['select-box']} ${styles['selected']}`} onClick={handleClickSelect}>
                  {selectNum}
                </div>
              </>
            }
          </>
        }
        {
          localActionConfig.delete && <div className={styles['delete']} onClick={() => { handleClickDelete!(content) }}>删除</div>
        }
        <img className={styles['img']} src={content.headImg}></img>
      </div>
      <div className={styles['text-box']}>
        <div className={styles['name']}>{content.name}</div>
        <div className={styles['price']}>{(content as SelectProductListItem).price || '暂无价格'}</div>
      </div>
    </div>
    <div className={styles['action']}>

    </div>
  </div>
}

export default ContentItem