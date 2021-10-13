import React, { FC, useEffect, useState, useRef, forwardRef, useImperativeHandle, Ref, useCallback } from 'react';
import { Form } from 'antd';
import { formItemConfig } from './config'
import { FragmentsListItem } from '@/interfaces/ai-module'
import PreviewBlock from './components/preview-block'
import RichTextEdit from './components/rich-text-edit'
import { CollectionFragmentsType } from '@/enums/ai-module';
interface Props {
  collectionId: number
}

interface BlockInfoItem {
  help: string,
  validateStatus: '' | 'error',
  min: number,
  max: number,
}

type BlockInfo = {
  [key in CollectionFragmentsType]: BlockInfoItem
}

const SetText = (props: Props, parentRef: Ref<any>) => {
  const { collectionId } = props

  const [companyInfoConfig, setCompanyInfoConfig] = useState<BlockInfoItem>({ help: '', validateStatus: '', min: 5, max: 100 })
  const [productInfoConfig, setProductInfoConfig] = useState<BlockInfoItem>({ help: '', validateStatus: '', min: 5, max: 100 })
  const [qaInfoConfig, setQaInfoConfig] = useState<BlockInfoItem>({ help: '', validateStatus: '', min: 15, max: 100 })

  const previewBlockRef = useRef<{
    [key in CollectionFragmentsType]: {
      onChangeData: (richTextEditType: CollectionFragmentsType, newCollection: FragmentsListItem, oldCollection: FragmentsListItem | null) => void, dataList: FragmentsListItem[]
    }
  }>({
    companyInfo: { onChangeData: () => { }, dataList: [] },
    productInfo: { onChangeData: () => { }, dataList: [] },
    qaInfo: { onChangeData: () => { }, dataList: [] },
  })


  const [editFragments, setEditFragments] = useState<FragmentsListItem | null>(null)
  const [richTextEditType, setRichTextEditType] = useState<CollectionFragmentsType | ''>('')
  const [richTextEditVisible, setRichTextEditVisible] = useState<boolean>(false)

  useImperativeHandle(parentRef, () => ({
    validateFc
  }))

  const validateCP = async () => {
    let flag = true
    const newCompanyInfoConfig: BlockInfoItem = {
      ...companyInfoConfig,
      help: '',
      validateStatus: ''
    }
    const newProductInfoConfig: BlockInfoItem = {
      ...productInfoConfig,
      help: '',
      validateStatus: ''
    }
    const companyInfoLength = previewBlockRef.current.companyInfo.dataList.length
    const productInfoLength = previewBlockRef.current.productInfo.dataList.length
    if (companyInfoLength + productInfoLength < 5) {
      newCompanyInfoConfig.help = '公司介绍和产品/服务介绍之和最少5个'
      newCompanyInfoConfig.validateStatus = 'error'
      newProductInfoConfig.help = '公司介绍和产品/服务介绍之和最少5个'
      newProductInfoConfig.validateStatus = 'error'
      flag = false
    }
    if (companyInfoLength + productInfoLength > 100) {
      newCompanyInfoConfig.help = '公司介绍和产品/服务介绍之和最多100个'
      newCompanyInfoConfig.validateStatus = 'error'
      newProductInfoConfig.help = '公司介绍和产品/服务介绍之和最多100个'
      newProductInfoConfig.validateStatus = 'error'
      flag = false
    }
    newCompanyInfoConfig.min = productInfoLength >= 5 ? 0 : 5 - productInfoLength
    newProductInfoConfig.min = companyInfoLength >= 5 ? 0 : 5 - companyInfoLength
    newProductInfoConfig.max = 100 - productInfoLength
    newProductInfoConfig.min = 100 - companyInfoLength

    setCompanyInfoConfig(newCompanyInfoConfig)
    setProductInfoConfig(newProductInfoConfig)
    if (flag) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  }

  const validateQ = async () => {
    let flag = true
    const newQaInfoConfig: BlockInfoItem = {
      ...qaInfoConfig,
      help: '',
      validateStatus: ''
    }
    const qaInfoDataListLength = previewBlockRef.current.qaInfo.dataList.length
    if (qaInfoDataListLength < 15) {
      newQaInfoConfig.help = '小知识/问答最少15个'
      newQaInfoConfig.validateStatus = 'error'
      flag = false
    }
    if (qaInfoDataListLength > 50) {
      newQaInfoConfig.help = '小知识/问答最多50个'
      newQaInfoConfig.validateStatus = 'error'
      flag = false
    }
    setQaInfoConfig(newQaInfoConfig)
    if (flag) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  }
  const validateFc = async () => {
    try {
      await Promise.all([validateCP(), validateQ()])
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }

  const onShowRichTextModal = (type: CollectionFragmentsType, fragment: FragmentsListItem | null) => {
    setEditFragments(fragment)
    setRichTextEditType(type)
    setRichTextEditVisible(true)
  }

  const richTextEditClose = () => {
    setEditFragments(null)
    setRichTextEditType('')
    setRichTextEditVisible(false)
  }

  const richTextEditOk = (fragment: FragmentsListItem) => {
    if (!richTextEditType) return
    previewBlockRef.current[richTextEditType].onChangeData(richTextEditType, fragment, editFragments)
    richTextEditClose()
  }

  const handleChangeBlockData = async (key: CollectionFragmentsType): Promise<void> => {
    try {
      if (key === 'companyInfo') {
        await validateCP()
      } else if (key === 'productInfo') {
        await validateCP()
      } else if (key === 'qaInfo') {
        await validateQ()
      }
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }

  const blockInfo: BlockInfo = {
    companyInfo: companyInfoConfig,
    productInfo: productInfoConfig,
    qaInfo: qaInfoConfig,
  }

  return <>
    {
      formItemConfig.map((item) => <PreviewBlock ref={(ref) => previewBlockRef.current[item.type] = ref} collectionId={collectionId} config={item} key={item.type} onShowRichTextModal={onShowRichTextModal} blockInfo={blockInfo[item.type]} handleChangeBlockData={handleChangeBlockData} ></PreviewBlock>)
    }
    <RichTextEdit collectionId={collectionId} type={richTextEditType} visible={richTextEditVisible} fragments={editFragments} onCancel={richTextEditClose} onOk={richTextEditOk}></RichTextEdit>
  </>
}

export default forwardRef(SetText)