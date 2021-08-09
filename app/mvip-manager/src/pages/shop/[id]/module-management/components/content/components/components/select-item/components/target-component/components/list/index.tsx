import React, { FC, useState, useEffect } from 'react';
import { ConfigItem, SelectArticleListItem, SelectProductListItem, ConfigItemType } from '../../../../data';
import ProductItem from '../product-item'
import ArticleItem from '../article-item'
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
      componentConfig.type === 'product' && value && value.length > 0 && <div className={styles['product-list-container']}>
        {
          (value as SelectProductListItem[]).map((item) => <ProductItem type={componentConfig.type} content={item} key={item.id} actionConfig={{
            delete: true,
            select: false
          }} handleClickDelete={handleClickDelete}></ProductItem>)
        }
      </div>
    }
    {
      componentConfig.type === 'article' && value && value.length > 0 && <div className={styles['article-list-container']}>
        {
          value.map((item: SelectArticleListItem) => <ArticleItem type={componentConfig.type} content={item} key={item.id} actionConfig={{
            delete: true,
            select: false
          }} handleClickDelete={handleClickDelete}></ArticleItem>)
        }
      </div>
    }
  </>
}

export default List