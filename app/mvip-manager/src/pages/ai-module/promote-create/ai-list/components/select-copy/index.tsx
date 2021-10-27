import React, { FC, useEffect, useState, useContext } from 'react';
import { Radio, RadioChangeEvent } from 'antd'
import { useHistory } from 'umi'
import MyModal, { ModalType } from '@/components/modal'
import { ModuleKey } from '../../../data';
import AiModuleContext from '@/pages/ai-module/promote-create/context'

interface Props {
  visible: boolean,
  onClose: () => void
}

const SelectCopy: FC<Props> = (props) => {
  const { onClose, visible } = props
  const history = useHistory()
  const { auth, pageInfo, handleChangeContextData } = useContext(AiModuleContext)
  const [moduleKey, setModuleKey] = useState<ModuleKey>('postTool')
  const handleClickCancel = () => {
    onClose()
    handleChangeContextData('copyId', null)
    handleChangeContextData('copyIdType', null)
  }

  const handleClickOk = () => {
    onClose()
    switch (moduleKey) {
      case 'postTool':
        history.push('/ai-module/promote-create/post-create')
        break
      case 'shop':
        history.push('/ai-module/promote-create/shop-create')
        break
      case 'zhidao':
        history.push('/ai-module/promote-create/zhidao-create')
        break
    }
    // 复制过来的需要跳转到对应的列表
    handleChangeContextData('activeModuleKey', moduleKey)
    handleChangeContextData('pageInfo', {
      ...pageInfo,
      [moduleKey]: {
        page: 1,
        dataTotal: 1
      }
    })
  }

  const handleChangeModuleKey = (e: RadioChangeEvent) => {
    setModuleKey(e.target.value as ModuleKey)
  }

  return <MyModal
    type={ModalType.info}
    title="请选择要发布的产品"
    content={<>
      <Radio.Group onChange={handleChangeModuleKey} value={moduleKey}>
        {
          auth?.postTool && <Radio value={'postTool'}>帖子</Radio>
        }
        {
          auth?.zhidao && <Radio value={'zhidao'}>知道</Radio>
        }
        {
          auth?.shop && <Radio value={'shop'}>店铺文章</Radio>
        }
      </Radio.Group>
    </>}
    onCancel={handleClickCancel}
    onOk={handleClickOk}
    visible={visible}
  />
}

export default SelectCopy
