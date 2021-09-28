import React, { FC, useEffect, useRef, useState, useContext } from 'react';
import { Button, Form, Spin, Input, FormInstance } from 'antd';
import { useHistory } from 'umi'
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { postForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { USER_NAMESPACE } from '@/models/user';
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less';
import { createCollection, getCollection, updateCollection } from '@/api/ai-module'
import { CollectionDetail, UpdataCollectionParams, InitCollectionForm } from '@/interfaces/ai-module'
import { MetasItem, UserEnterpriseInfo } from '@/interfaces/user';
import SelectImage from './components/select-image'
import { CollectionStatus } from '@/enums/ai-module';
import AiModuleContext from '../context'
import PostPreviewTitle from '../components/post-preview-title'


interface Props {
  companyInfo: UserEnterpriseInfo | null,
  loadingUser: boolean
}

const CreatePost = (props: Props) => {
  const { companyInfo, loadingUser } = props
  const history = useHistory()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { id } = history.location.query
  const { postToolData, handleChangeContextData } = useContext(AiModuleContext)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionDetail | null>()
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(postForm));
  const [collectionId, setCollectionId] = useState<number>(Number(id))
  const [formData, setFormData] = useState<InitCollectionForm | null>(null)
  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })
  const [disabled, setDisabled] = useState<boolean>(false)
  const [previewTitleVisible, setPreviewTitleVisible] = useState<boolean>(false)

  // 初始化表单的数据
  const initComponent = async (collection: CollectionDetail) => {
    if (!collection) return
    const { form } = formRef.current
    const draftCollectionData = postToolData.formData[`draftCollection_${id}`]
    console.log(postToolData, draftCollectionData)
    let newFormData: InitCollectionForm | null = null

    if ([CollectionStatus.COLLECTION_REJECT_STATUS, CollectionStatus.COLLECTION_DRAFT_STATUS, CollectionStatus.COLLECTION_ADVANCE_STATUS].includes(collection.status) && draftCollectionData) {
      newFormData = draftCollectionData
    } else {
      // TODO;
      newFormData = {
        name: collection.name,
        metas: [{
          key: '服务',
          value: 'fuwu',
          label: '服务'
        }, undefined, collection.thirdMeta.map(item => item.id)],
      }
    }
    console.log(newFormData)
    setFormData(newFormData)
    form?.setFieldsValue(draftCollectionData)
  }

  // 获取当前任务详情
  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getCollection({ id })
    const collection = res.data
    setCollection(collection)
    setGetDataLoading(false)
    // 在这里判断是否能禁用表单
    setDisabled([CollectionStatus.COLLECTION_PUBLISH_STATUS, CollectionStatus.COLLECTION_FINISHED_STATUS, CollectionStatus.COLLECTION_PENDING_STATUS, CollectionStatus.COLLECTION_PAUSED_STATUS].includes(collection.status))
    initComponent(collection)
  }

  useEffect(() => {
    if (collectionId) {
      getDetail()
    }
  }, [collectionId])

  // 更新表单的配置
  const updateConfigData = () => {
    const newChildren = config.children.map(item => {
      //  这里需要请求来一级类目
      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.type === 'MetaSelect') {
        const options: MetasItem[] = [{
          key: '服务',
          value: 'fuwu',
          label: '服务'
        }]
        // const secondCategoriesArr = [{ key: categoryId, value: categoryId, label: categoryName }]
        // if (options.length > 0 && secondCategoriesArr.length > 0) {
        //   options[0].children = secondCategoriesArr
        // }
        item.options = options
      }
      return item
    })
    setConfig({ ...config, children: newChildren })
  }

  const createCollectionFc = async () => {
    setUpDataLoading(true)
    const res = await createCollection()
    history.replace(`${history.location.pathname}?id=${res.data.id}`)
    setCollectionId(res.data.id)
    setUpDataLoading(false)
  }

  useEffect(() => {
    // 不存在id则创建一个id
    if (!collectionId) {
      createCollectionFc()
    }
    // 更新下表单的配置项
    updateConfigData()
  }, [])

  const sumbit = async (values: UpdataCollectionParams) => {
    setUpDataLoading(true)
    const { success, message, data } = await updateCollection({
      ...values as any
    })
    if (success) {
      successMessage('保存成功')
    } else {
      errorMessage(message || '出错了')
    }
    setUpDataLoading(false)
  }

  const formChange = (...arg: any) => {
    // console.log(arg)
  }

  const handleClickCreateTitle = async () => {
    const { form } = formRef.current
    try {
      await form?.validateFields()
      const values = form?.getFieldsValue()
      postToolData.formData[`draftCollection_${id}`] = values
      handleChangeContextData({ postToolData })
      history.push(`/ai-module/promote-create/post-title-create?id=${id}`)
    } catch (e) {
      errorMessage('请检查素材包名称与类目')
    }
  }

  return (
    <>
      <MainTitle title="帖子AI任务填写" showJumpIcon />
      <div className={`${styles['post-create-container']} container`}>
        <Spin spinning={getDataLoading || loadingUser}>
          <div className={styles['form-container']}>
            <WildcatForm
              ref={formRef}
              disabled={disabled}
              editDataSource={formData}
              submit={sumbit}
              config={config}
              formChange={formChange}
            />
            <Form.Item label={'公司名称'} labelCol={{ span: 2 }}>
              <Input style={{ width: 260 }} disabled value={companyInfo?.companyName || ''} size={'large'}></Input>
            </Form.Item>
            <Form.Item label={'标题'} labelCol={{ span: 2 }} required={true}>
              <div className={styles['add-title']}>
                <Button className={styles['add-title-btn']} onClick={handleClickCreateTitle}>批量添加</Button>
                <span className={styles['preview-title']} onClick={() => setPreviewTitleVisible(true)}>预览标题</span>
              </div>
            </Form.Item>
            <SelectImage collectionId={collectionId}></SelectImage>
          </div>
        </Spin>
      </div>
      <PostPreviewTitle action='see' taskId={id} visible={previewTitleVisible} onCancel={setPreviewTitleVisible} ></PostPreviewTitle>
    </>)
}

CreatePost.wrappers = ['@/wrappers/path-auth']

const CreatePostConnect = connect((state: ConnectState) => {
  const { companyInfo } = state[USER_NAMESPACE]
  const { loading } = state
  return { companyInfo, loadingUser: loading.models.user }
})(CreatePost)

CreatePostConnect.wrappers = ['@/wrappers/path-auth']

export default CreatePostConnect
