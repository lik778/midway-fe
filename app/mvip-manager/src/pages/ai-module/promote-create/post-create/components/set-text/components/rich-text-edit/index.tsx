import React, { FC, useEffect, useState, useMemo } from 'react';
import { Form, Modal, Button, } from 'antd';
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import { FragmentsListItem } from '@/interfaces/ai-module';
import { CollectionFragmentsType, } from '@/enums/ai-module';
import { collectionFragmentsTypeMap } from '@/constants/ai-module'
import { createFragments, updateFragments } from '@/api/ai-module'
import { reactQuillToolbar } from './config'
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

interface Props {
  collectionId: number
  type: CollectionFragmentsType | '',
  visible: boolean,
  fragments: FragmentsListItem | null,
  onCancel: () => void
  onOk: (item: FragmentsListItem) => void
}

const RichTextEdit: FC<Props> = (props) => {
  const { collectionId, type, visible, fragments, onCancel, onOk } = props
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>('')

  useEffect(() => {
    if (visible && fragments) {
      setLocalValue(fragments.content)
    } else {
      setLocalValue('')
    }
  }, [visible])

  const handleChangeValue = (value: string) => {
    setLocalValue(value)
  }

  const createFragmentsFn = async () => {
    setUpDataLoading(true)
    const res = await createFragments({ id: collectionId, type: type as CollectionFragmentsType, content: localValue })
    if (res.success) {
      successMessage(res.message)
      onOk(res.data)
    } else {
      errorMessage(res.message)
    }
    setUpDataLoading(false)
  }

  const updateFragmentsFn = async () => {
    setUpDataLoading(true)
    const res = await updateFragments({ id: fragments!.id, content: localValue })
    if (res.success) {
      successMessage(res.message)
      onOk({
        ...res.data,
        content: localValue
      })
    } else {
      errorMessage(res.message)
    }
    setUpDataLoading(false)
  }

  const handleClickSubmit = () => {
    if (localValue.replace(/<[^>]+>/gi, "").length < 20) {
      errorMessage('内容至少20个字以上');
      return;
    }
    if (localValue.length >= 6000) {
      errorMessage('您填写的信息描述过长，请修改后重新发布');
      return;
    }
    if (fragments) {
      updateFragmentsFn()
    } else {
      createFragmentsFn()
    }
  }

  const handleClickCancel = () => {
    Modal.confirm({
      content: '您有编辑的内容未保存，需要保存后再关闭界面吗？',
      cancelText: '丢弃',
      onCancel: () => {
        onCancel()
        track({
          eventType: BXMAINSITE,
          data: {
            site_id: 'post_tool',
            tracktype: 'event',
            button_name: '不保存',
            page_id: '素材包编辑主界面',
            _refer: document.referrer
          }
        })
      },
      onOk: () => {
        track({
          eventType: BXMAINSITE,
          data: {
            site_id: 'post_tool',
            tracktype: 'event',
            button_name: '保存',
            page_id: '素材包编辑主界面',
            _refer: document.referrer
          }
        })
      }
    })
  }

  return <Modal
    width={600}
    title={type ? collectionFragmentsTypeMap[type] : ''}
    footer={
      <div className={styles['btn-group']}>
        <Button className={styles['btn']} disabled={upDataLoading} onClick={handleClickCancel}>取消</Button>
        <Button className={styles['btn']} disabled={upDataLoading} loading={upDataLoading} onClick={handleClickSubmit} type="primary">
          确认添加
        </Button>
      </div>
    }
    visible={visible}
    onCancel={onCancel}
    maskClosable={false}>
    <ReactQuill className={styles['quill']} value={localValue} onChange={handleChangeValue} modules={{
      toolbar: reactQuillToolbar,
    }} theme="snow" />
    <p className={styles['tip']}>说明：内容必须超过20个字；内容禁止添加任何联系方式、网址、邮箱等；请不要填写与公司、产品、服务不相关的内容。</p>
  </Modal>
}


export default RichTextEdit