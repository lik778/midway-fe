import React, { FC, useEffect, useState, useRef } from 'react';
import { Form } from 'antd';
import { formItemConfig } from './config'
import { FragmentsListItem } from '@/interfaces/ai-module'
import PreviewBlock from './components/preview-block'
import RichTextEdit from './components/rich-text-edit'
import { CollectionFragmentsType } from '@/enums/ai-module';
interface Props {
  collectionId: number
}

const SetText: FC<Props> = (props) => {
  const { collectionId } = props
  const previewBlockRef = useRef<{
    [key in CollectionFragmentsType]: {
      onChangeData: (richTextEditType: CollectionFragmentsType, newCollection: FragmentsListItem, oldCollection: FragmentsListItem | null) => void
    }
  }>({
    companyInfo: { onChangeData: () => { } },
    productInfo: { onChangeData: () => { } },
    qaInfo: { onChangeData: () => { } },
  })

  const [editFragments, setEditFragments] = useState<FragmentsListItem | null>(null)
  const [richTextEditType, setRichTextEditType] = useState<CollectionFragmentsType | ''>('')
  const [richTextEditVisible, setRichTextEditVisible] = useState<boolean>(false)

  const onShowRichTextModal = (type: CollectionFragmentsType, fragment: FragmentsListItem | null) => {
    setEditFragments(fragment)
    setRichTextEditType(type)
    setRichTextEditVisible(true)
  }

  const richTextEditCancel = () => {
    setEditFragments(null)
    setRichTextEditType('')
    setRichTextEditVisible(false)
  }

  const richTextEditOk = (fragment: FragmentsListItem) => {
    if (!richTextEditType) return
    previewBlockRef.current[richTextEditType].onChangeData(richTextEditType, fragment, editFragments)
    richTextEditCancel()
  }

  return <>
    {
      formItemConfig.map((item) => <PreviewBlock ref={(ref) => previewBlockRef.current[item.type] = ref} collectionId={collectionId} config={item} key={item.type} onShowRichTextModal={onShowRichTextModal}></PreviewBlock>)
    }
    <RichTextEdit collectionId={collectionId} type={richTextEditType} visible={richTextEditVisible} fragments={editFragments} onCancel={richTextEditCancel} onOk={richTextEditOk}></RichTextEdit>
  </>
}

export default SetText