import React, { FC, useState, useEffect } from 'react';
import { ConfigItem, SelectArticleListItem, SelectProductListItem, ConfigItemType } from '../../../../data';
import ContentItem from '../content-item'
import styles from './index.less'
import { getRenderPropValue } from 'antd/es/_util/getRenderPropValue';

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


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("json", `${index}`)
  }


  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    // 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式。这要通过调用ondragover 事件的 event.preventDefault()
    // 如果不阻止dragover的默认行为，drop就不会触发
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, endIndex: number) => {
    e.preventDefault()
    e.persist()
    const newValue = [...(value || [])]
    const startIndex = Number(e.dataTransfer.getData("json"))
    //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    if (startIndex > endIndex) {
      newValue.splice(endIndex, 0, newValue[startIndex]);
      newValue.splice(startIndex + 1, 1)
    }
    else {
      //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
      //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
      newValue.splice(endIndex + 1, 0, newValue[startIndex]);
      newValue.splice(startIndex, 1)
    }

    onChange!(newValue)
  }


  return <>
    {
      value && value.length > 0 && <div className={styles[`${componentConfig.type}-list-container`]}>
        {
          (value).map((item: SelectArticleListItem | SelectProductListItem, index: number) => <ContentItem index={index} type={componentConfig.type} content={item} key={item.id} actionConfig={{
            delete: true,
            select: false,
            draggable: true
          }} handleClickDelete={handleClickDelete} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}></ContentItem>)
        }
      </div>
    }
  </>
}

export default List