import React, { FC, useState, useEffect } from 'react';
import { SelectArticleListItem, SelectProductListItem, ConfigItemType } from '../../../../data';
import styles from './index.less'

interface Props {
  type: ConfigItemType,
  content: SelectProductListItem | SelectArticleListItem
}

const ContentItem: FC<Props> = (props) => {
  const { type, content } = props
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
      这里是操作
    </div>
  </div>
}

export default ContentItem