import React, { FC, useState, useEffect } from 'react';
import { ConfigItem, SelectArticleListItem, SelectProductListItem, ConfigItemType } from '../../../../data';
import ContentItem from '../content-item'
import styles from './index.less'

interface Props {
  value?: SelectArticleListItem[] | SelectProductListItem[]
  onChange?: (value: SelectProductListItem[] | SelectArticleListItem[]) => void; // Form.Item提供
  componentConfig: ConfigItem
}

const List: FC<Props> = (props) => {
  const { value, onChange, componentConfig } = props

  const handleClickDelete = (content: SelectArticleListItem | SelectProductListItem) => {
    onChange!((value || []).filter(item => item.id !== content.id))
  }

  return <>
    {
      value && value.length > 0 && <div className={styles['list-container']}>
        {
          value.map((item: SelectArticleListItem | SelectProductListItem) => <ContentItem type={componentConfig.type} content={item} key={item.id} actionConfig={{
            delete: true,
            select: false
          }} handleClickDelete={handleClickDelete}></ContentItem>)
        }
      </div>
    }
  </>
}

export default List