import React, { FC, useEffect, useState, useMemo } from 'react';
import { Form, Modal, Button, Tag } from 'antd';
import { TagListItem } from './data'
import styles from './index.less'
interface Props {
  visible: boolean
  onTagChange: (tags: string[]) => void
}

const MaterialTag: FC<Props> = (props) => {
  const { visible, onTagChange } = props
  const [dataList, setDataList] = useState<TagListItem[]>([])
  const [checkDataList, setCheckDataList] = useState<TagListItem[]>([])

  useEffect(() => {
    onTagChange(checkDataList.filter(item => item.show).map(item => item.text))
  }, [checkDataList])

  // 这我是真没办法 要有联动怎么连三级类目的数据也要联动...
  const getTagsData = () => {
    const checkboxs = [...document.querySelectorAll('#promoteCreateForm .ant-checkbox-group-item')]
    console.log(checkboxs)
    const dataList: TagListItem[] = []
    const checkDataList: TagListItem[] = []
    checkboxs.map(item => {
      const checked = [...item.classList].includes('ant-checkbox-wrapper-checked')
      checkDataList.push({
        text: item.textContent || '',
        show: checked
      })
      dataList.push({
        text: item.textContent || '',
        show: !checked
      })
    })
    setDataList(dataList)
    setCheckDataList(checkDataList)
  }

  useEffect(() => {
    console.log(visible)
    if (visible) {
      getTagsData()
    }
  }, [visible])

  const delTag = (tag: TagListItem) => {
    setCheckDataList(checkDataList.map(item => {
      if (item.text !== tag.text) {
        return item
      } else {
        return {
          ...item,
          show: false
        }
      }
    }))
    setDataList(dataList.map(item => {
      if (item.text !== tag.text) {
        return item
      } else {
        return {
          ...item,
          show: true
        }
      }
    }))
  }

  const addTag = (tag: TagListItem) => {
    setCheckDataList(checkDataList.map(item => {
      if (item.text !== tag.text) {
        return item
      } else {
        return {
          ...item,
          show: true
        }
      }
    }))
    setDataList(dataList.map(item => {
      if (item.text !== tag.text) {
        return item
      } else {
        return {
          ...item,
          show: false
        }
      }
    }))
  }

  return <>
    <div className={styles['tag-box']}>
      {
        checkDataList.filter(item => item.show).map(tag => {
          return <Tag className={styles['tag-item']} closable={true} onClose={() => delTag(tag)} color="blue" key={tag.text}>{tag.text}</Tag>
        })
      }
    </div>
    <div className={styles['tag-box']}>
      {
        dataList.filter(item => item.show).map(tag => {
          return <Tag className={styles['tag-item']} key={tag.text} onClick={() => addTag(tag)}>{tag.text}</Tag>
        })
      }
    </div>
  </>
}

export default MaterialTag