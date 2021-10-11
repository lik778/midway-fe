import React, { FC, useEffect, useState, useContext, Ref, forwardRef, useImperativeHandle } from 'react';
import { Form, Button } from 'antd';
import { FormItemConfig } from '../../data';
import { fromLabelCol } from '../../../../config'
import { getCollectionFragments, deleteFragments } from '@/api/ai-module'
import { FragmentsListItem } from '@/interfaces/ai-module'
import ScrollBox from '@/components/scroll-box'
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { CollectionFragmentsType } from '@/enums/ai-module'
import AiModuleContext from '../../../../../context'
import SpeedAdd from './components/speed-add'
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

interface Props {
  collectionId: number,
  config: FormItemConfig,
  onShowRichTextModal: (type: CollectionFragmentsType, fragment: FragmentsListItem | null) => void
}

const PreviewBlock = (props: Props, parentRef: Ref<any>) => {
  const { collectionId, config, onShowRichTextModal } = props
  const { postToolData } = useContext(AiModuleContext)
  const { formData, disabled } = postToolData
  const [validateStatus, setValidateStatus] = useState<'' | 'error'>('')
  const [help, setHelp] = useState<string>('')
  const [dataList, setDataList] = useState<FragmentsListItem[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);

  const [speedAddVisible, setSpeedAddVisible] = useState<boolean>(false)

  const getData = async () => {
    setGetDataLoading(true)
    const res = await getCollectionFragments({ id: collectionId, type: config.type })
    if (res.success) {
      setDataList(res.data)
    }
    setGetDataLoading(false)
  }

  const onChangeData = (richTextEditType: CollectionFragmentsType, newFragment: FragmentsListItem, oldFragment: FragmentsListItem | null) => {
    if (oldFragment) {
      setDataList(dataList.map(item => {
        if (item.id === oldFragment.id) {
          return newFragment
        } else {
          return item
        }
      }))
    } else {
      setDataList([newFragment, ...dataList])
    }
  }

  useImperativeHandle(parentRef, () => {
    return {
      onChangeData
    }
  }, [])


  const handleClickAddItem = () => {
    onShowRichTextModal(config.type, null)
  }

  const handleClickEditItem = (fragment: FragmentsListItem) => {
    onShowRichTextModal(config.type, fragment)
    track({
      eventType: BXMAINSITE,
      data: {
        site_id: 'post_tool',
        tracktype: 'event',
        button_name: '编辑',
        page_id: '素材包编辑主界面',
        position: config.label,
        _refer: document.referrer
      }
    })
  }

  const handleClickDelItem = async (fragment: FragmentsListItem) => {

    track({
      eventType: BXMAINSITE,
      data: {
        site_id: 'post_tool',
        tracktype: 'event',
        button_name: '删除',
        page_id: '素材包编辑主界面',
        position: config.label,
        _refer: document.referrer
      }
    })

    setUpDataLoading(true)
    const res = await deleteFragments({ id: fragment.id, type: config.type })
    if (res.success) {
      successMessage(res.message)
      setDataList(dataList.filter(item => item.id !== fragment.id))
    }
    setUpDataLoading(false)
  }

  const handleClickSpeedAdd = () => {
    if (!formData[collectionId] || !formData[collectionId].metas || !formData[collectionId].metas[1]) {
      errorMessage('请选择类目')
      return
    }
    setSpeedAddVisible(true)
  }

  useEffect(() => {
    getData()
  }, [])

  const speedAddFragment = (fragments: FragmentsListItem[]) => {
    setDataList([...fragments, ...dataList])
  }

  const speedAddCancel = () => {
    setSpeedAddVisible(false)
  }

  return <>
    <Form.Item labelCol={fromLabelCol} wrapperCol={{ span: 20 }} label={config.label} required={true} help={help} validateStatus={validateStatus}>
      <div>
        {
          !disabled && <>
            <Button className={styles['add-text-btn']} onClick={handleClickAddItem}>添加</Button>
            {
              config.type === 'qaInfo' && <Button className={styles['add-text-btn']} onClick={handleClickSpeedAdd}>快速批量添加</Button>
            }
          </>
        }
        <span>{config.tip}</span>
      </div>
      <div>已填写：{dataList.length}</div>
      <ScrollBox className={styles['textarea-block']} height="220px" scrollY>
        {
          dataList.map(item => <div className={styles['textarea-item']} key={item.id}>
            <div className={`${styles['textarea-box']} ${disabled ? styles['width-auto'] : ''}`} dangerouslySetInnerHTML={{ __html: item.content }}></div>
            {
              !disabled && <div className={styles['button']}>
                <Button className={styles['edit-text-btn']} disabled={upDataLoading} loading={upDataLoading} onClick={() => handleClickEditItem(item)}>编辑</Button>
                <Button className={styles['del-text-btn']} disabled={upDataLoading} loading={upDataLoading} onClick={() => handleClickDelItem(item)}> 删除</Button>
              </div>
            }
          </div>)
        }
      </ScrollBox>
    </Form.Item>
    {
      config.type === 'qaInfo' && <SpeedAdd collectionId={collectionId} type={config.type} addFragment={speedAddFragment} visible={speedAddVisible} onCancel={speedAddCancel}></SpeedAdd>
    }
  </>
}

export default forwardRef(PreviewBlock)