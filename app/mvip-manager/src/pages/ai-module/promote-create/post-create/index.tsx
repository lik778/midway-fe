import React, { FC, useEffect, useRef, useState, useContext } from 'react';
import { Button, Form, Spin, Input, FormInstance } from 'antd';
import { useHistory } from 'umi'
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { promoteCreateForm, fromLabelCol } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { USER_NAMESPACE } from '@/models/user';
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less';
import { createCollection, getCollection, updateCollection, getSecondCategories } from '@/api/ai-module'
import { CollectionDetail, UpdataCollectionParams, InitCollectionForm, SecondCategoriesListItem } from '@/interfaces/ai-module'
import { MetasItem, UserEnterpriseInfo } from '@/interfaces/user';
import SelectImage from './components/select-image'
import { CollectionStatus } from '@/enums/ai-module';
import AiModuleContext from '../context'
import PostPreviewTitle from '../components/post-preview-title'
import SetText from './components/set-text'

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
  const { selectedVipResources } = postToolData
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  // 当前任务内容
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(promoteCreateForm));
  // 当前表单的id
  const [collectionId, setCollectionId] = useState<number>(Number(id))
  // 当前任务内容转的表单内容
  const [formData, setFormData] = useState<InitCollectionForm | null>(null)
  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })
  const [disabled, setDisabled] = useState<boolean>(false)
  const [previewTitleVisible, setPreviewTitleVisible] = useState<boolean>(false)
  const [secondCategoriesList, setSecondCategoriesList] = useState<SecondCategoriesListItem[]>([])

  // 初始化表单的数据
  const initComponent = async () => {
    if (!collection) return
    if (!selectedVipResources) return
    const { form } = formRef.current
    const draftCollectionData = postToolData.formData[`draftCollection_${id}`]
    let newFormData: InitCollectionForm | null = null

    if ([CollectionStatus.COLLECTION_REJECT_STATUS, CollectionStatus.COLLECTION_DRAFT_STATUS, CollectionStatus.COLLECTION_ADVANCE_STATUS].includes(collection.status) && draftCollectionData) {
      newFormData = draftCollectionData
    } else {
      newFormData = {
        name: collection.name,
        metas: [{
          key: selectedVipResources.vipTypeName,
          value: selectedVipResources.vipTypeName,
          label: selectedVipResources.vipTypeName,
        }, {
          key: collection.categoryName,
          value: collection.categoryId,
          label: collection.categoryName,
        }, collection.thirdMeta.map(item => item.id)],
      }
    }
    setFormData(newFormData)
    form?.setFieldsValue(draftCollectionData)
  }

  useEffect(() => {
    initComponent()
  }, [collection])

  // 获取当前任务详情
  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getCollection({ id })
    const collection = res.data
    setCollection(collection)
    setGetDataLoading(false)
    // 在这里判断是否能禁用表单
    setDisabled([CollectionStatus.COLLECTION_PUBLISH_STATUS, CollectionStatus.COLLECTION_FINISHED_STATUS, CollectionStatus.COLLECTION_PENDING_STATUS, CollectionStatus.COLLECTION_PAUSED_STATUS].includes(collection.status))
  }

  useEffect(() => {
    if (collectionId) {
      getDetail()
    }
  }, [collectionId])

  // 更新表单的配置
  const updateConfigData = () => {
    if (secondCategoriesList.length < 0) return
    if (!selectedVipResources) return
    const newChildren = config.children.map(item => {
      //  这里需要请求来一级类目
      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.type === 'MetaSelect') {
        // 这里的一级选择器是没有任何用处的摆设 请勿使用
        const options: MetasItem[] = [{
          key: selectedVipResources!.vipTypeName,
          value: selectedVipResources!.vipType.toString(),
          label: selectedVipResources!.vipTypeName,
        }]
        const secondCategoriesArr = secondCategoriesList.map(item => ({
          key: item.name,
          value: item.value,
          label: item.name,
        }))
        if (options.length > 0 && secondCategoriesArr.length > 0) {
          options[0].children = secondCategoriesArr
        }
        item.options = options
      }
      return item
    })
    setConfig({ ...config, children: newChildren })
  }

  useEffect(() => {
    updateConfigData()
  }, [secondCategoriesList])

  const createCollectionFc = async () => {
    setUpDataLoading(true)
    const res = await createCollection()
    history.replace(`${history.location.pathname}?id=${res.data.id}`)
    setCollectionId(res.data.id)
    setUpDataLoading(false)
  }

  const getFormConfig = async () => {
    const res = await getSecondCategories({ productLine: selectedVipResources!.productLine, vipType: selectedVipResources!.vipType })
    if (res.success) {
      setSecondCategoriesList(res.data)
    }
  }

  useEffect(() => {
    if (selectedVipResources) {
      getFormConfig()
    }
  }, [selectedVipResources])

  useEffect(() => {
    // 不存在id则创建一个id
    if (!collectionId) {
      createCollectionFc()
    }
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
    // console.log('formChange', arg)
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
            <Form.Item label={'公司名称'} labelCol={fromLabelCol}>
              <Input style={{ width: 260 }} disabled value={companyInfo?.companyName || ''} size={'large'}></Input>
            </Form.Item>
            <Form.Item label={'标题'} labelCol={fromLabelCol} required={true}>
              <div className={styles['add-title']}>
                <Button className={styles['add-title-btn']} onClick={handleClickCreateTitle}>批量添加</Button>
                <span className={styles['preview-title']} onClick={() => setPreviewTitleVisible(true)}>预览标题</span>
              </div>
            </Form.Item>
            <SelectImage collectionId={collectionId}></SelectImage>
            <SetText collectionId={collectionId}></SetText>
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
