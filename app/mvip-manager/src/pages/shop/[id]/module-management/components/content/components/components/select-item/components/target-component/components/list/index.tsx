import React, { FC, useState, useEffect } from 'react';
import { ConfigItem, SelectArticleListItem, SelectProductListItem, ConfigItemType } from '../../../../data';
import ContentItem from '../content-item'
import styles from './index.less'

interface Props {
  value?: SelectArticleListItem[] | SelectProductListItem[]
  componentConfig: ConfigItem
}

const List: FC<Props> = (props) => {
  const { value, componentConfig } = props
  return <div className={styles['list-container']}>
    {
      (value || []).map(item => <ContentItem type={componentConfig.type} content={item} key={item.id}></ContentItem>)
    }
  </div>
}

export default List