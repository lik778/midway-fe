import React, { useEffect, useRef, useState, useContext } from 'react';
import { Button, Form, Spin, Input, FormInstance, Modal } from 'antd';
import { useHistory } from 'umi'
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { promoteCreateForm, fromLabelCol } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less';
import { createCollection, getCollection, updateCollection, getSecondCategories, getCompanyMeta } from '@/api/ai-module'
import { CollectionDetail, UpdataCollectionParams, InitCollectionForm, SecondCategoriesListItem, CompanyMeta } from '@/interfaces/ai-module'
import { ShopMetas } from '@/interfaces/user'
import { MetasItem, UserEnterpriseInfo } from '@/interfaces/user';
import SelectImage from './components/select-image'
import { CollectionStatus, CollectionAction } from '@/enums/ai-module';
import AiModuleContext from '../context'
import PostPreviewTitle from '../components/post-preview-title'
import SetText from './components/set-text'
import CatchComponent from '@/components/cache-component'
import { useDebounce } from '@/hooks/debounce';
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

interface Props {
}

const CreatePost = (props: Props) => {
  const history = useHistory()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { id } = history.location.query
  const { selectedVipResources, postToolFormData, handleChangeContextData } = useContext(AiModuleContext)
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
  const [disabled, setDisabled] = useState<boolean>(true)
  const [previewTitleVisible, setPreviewTitleVisible] = useState<boolean>(false)
  const [secondCategoriesList, setSecondCategoriesList] = useState<SecondCategoriesListItem[]>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [companyMeta, setCompanyMeta] = useState<CompanyMeta | null>(null)
  const [init, setInit] = useState<boolean>(false)
  const ImageRef = useRef<{
    validateFc: () => Promise<any>
  }>({
    validateFc: async () => { }
  })

  const textRef = useRef<{
    validateFc: () => Promise<any>
  }>({
    validateFc: async () => { }
  })

  const getCompanyMetaFn = useDebounce(async () => {
    setGetDataLoading(true)
    const res = await getCompanyMeta({ categoryId })
    if (res.success) {
      console.log(res.data)
      res.data.companyMeta.value = res.data.companyMeta.value || ' '
      setCompanyMeta(res.data.companyMeta)
    } else {
      errorMessage(res.message || ' ')
    }
    setGetDataLoading(false)
  }, 100)

  useEffect(() => {
    if (categoryId) {
      getCompanyMetaFn()
    }
  }, [categoryId])

  // 初始化表单的数据
  const initComponent = async () => {
    if (!collection) return
    if (!selectedVipResources) return
    const { form } = formRef.current
    const draftCollectionData = postToolFormData[id]
    let newFormData: InitCollectionForm | null = null

    if ([CollectionStatus.COLLECTION_REJECT_STATUS, CollectionStatus.COLLECTION_DRAFT_STATUS, CollectionStatus.COLLECTION_ADVANCE_STATUS].includes(collection.status) && draftCollectionData) {
      newFormData = draftCollectionData
    } else {
      let metas: ShopMetas = [undefined, undefined, []]
      if (collection.categoryId) {
        metas = [{
          key: selectedVipResources.vipTypeName,
          value: selectedVipResources.vipTypeName,
          label: selectedVipResources.vipTypeName,
        }, {
          key: collection.categoryName,
          value: collection.categoryId,
          label: collection.categoryName,
        }, collection.thirdMeta.map(item => item.id)]
      }
      newFormData = {
        name: collection.name,
        metas,
      }
      // 初始化好就存一份到缓存中
      postToolFormData[id] = { ...newFormData }
      handleChangeContextData('postToolFormData', postToolFormData)
    }
    setFormData(newFormData)
    form?.setFieldsValue(draftCollectionData)
    setInit(true)
  }

  useEffect(() => {
    initComponent()
  }, [collection, selectedVipResources])

  // 获取当前任务详情
  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getCollection({ id })
    if (res.success) {
      const collection = res.data
      setCollection(collection)
      setCategoryId(collection.categoryId)
      const disabled = [CollectionStatus.COLLECTION_PUBLISH_STATUS, CollectionStatus.COLLECTION_FINISHED_STATUS, CollectionStatus.COLLECTION_PENDING_STATUS, CollectionStatus.COLLECTION_PAUSED_STATUS].includes(collection.status)
      // 在这里判断是否能禁用表单
      setDisabled(disabled)
      handleChangeContextData('postToolFormDisabled', disabled)
    } else {
      errorMessage(res.message)
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    if (collectionId) {
      getDetail()
    }
  }, [collectionId])

  // 更新输入表单
  const addCompanyInput = () => {
    if (!companyMeta || !collection) return
    config.customerFormItemList = [{
      key: 'companyName',
      index: 4,// 决定当前这个自定义组件放在第几位 不填就是最后
      node: <Form.Item
        name='companyName'
        label={companyMeta.name}
        required={companyMeta.required}
        rules={[{ required: companyMeta.required, message: `请填写${companyMeta.name}` }]}
        initialValue={(collection.metas && collection.metas[companyMeta.name]) || companyMeta.value}
        key='companyName'>
        <Input style={{ width: 260 }} disabled={companyMeta.readonly} value={companyMeta.value} size={'large'} placeholder={'请输入公司名称'} maxLength={Number(companyMeta.maxlength) || 30} autoComplete="off"></Input>
      </Form.Item >// 自定义的组件
    }]
    setConfig({ ...config })
  }

  useEffect(() => {
    addCompanyInput()
  }, [companyMeta, collection])

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
    track({
      eventType: BXMAINSITE,
      data: {
        site_id: 'post_tool',
        tracktype: 'pageview',
        pageId: '素材包编辑主界面',
        _refer: document.referrer
      }
    })
  }, [])

  const handlePreviewTitle = () => {
    setPreviewTitleVisible(true)
    track({
      eventType: BXMAINSITE,
      data: {
        site_id: 'post_tool',
        tracktype: 'event',
        button_name: '预览已添加的标题',
        page_id: '素材包编辑主界面',
        _refer: document.referrer
      }
    })
  }

  const formChange = (changeTarget: any, values: InitCollectionForm) => {
    postToolFormData[id] = values
    handleChangeContextData('postToolFormData', postToolFormData)
    if (changeTarget.metaCascaderValue && changeTarget.metaCascaderValue[1] && changeTarget.metaCascaderValue[1].value) {
      setCategoryId(changeTarget.metaCascaderValue[1].value)
    }
  }

  const handleClickCreateTitle = async () => {
    const { form } = formRef.current
    try {
      await form?.validateFields()
      const values = form?.getFieldsValue()
      postToolFormData[id] = values
      handleChangeContextData('postToolFormData', postToolFormData)
      history.push(`/ai-module/promote-create/post-title-create?id=${id}`)
    } catch (e) {
      errorMessage('请检查素材包名称与类目')
    }
  }

  const updateCollectionFn = async (values: Partial<UpdataCollectionParams> & {
    id: number;
  }) => {
    setUpDataLoading(true)
    const res = await updateCollection(values)
    if (res.success) {
      successMessage('操作成功')
      setTimeout(() => {
        history.goBack()
      }, 1500)
    } else {
      errorMessage(res.message)
      setUpDataLoading(false)
    }
  }

  const validateForm = () => {
    return Promise.all([formRef.current.form?.validateFields(), ImageRef.current.validateFc(), textRef.current.validateFc()])
  }

  const handleClickUpdate = async (action: CollectionAction.AUDIT | CollectionAction.DRAFT) => {
    if (action === CollectionAction.AUDIT) {
      await validateForm()
    } else {
      await formRef.current.form?.validateFields()
    }
    track({
      eventType: BXMAINSITE,
      data: {
        site_id: 'post_tool',
        tracktype: 'event',
        button_name: action === CollectionAction.AUDIT ? '提交审核' : '保存草稿',
        page_id: '素材包编辑主界面',
        _refer: document.referrer
      }
    })

    const { form } = formRef.current
    const values = form?.getFieldsValue()
    const requestData = {
      id: collectionId,
      name: values.name,
      categoryId: values.metas[1].value,
      thirdMetaIds: values.metas[2].join(','),
      action,
      metas: {
        [companyMeta?.name || '公司名称']: values.companyName || ''
      },
      wordId: collection?.wordId
    }

    if (action === CollectionAction.AUDIT) {
      const res = await getCollection({ id })
      Modal.confirm({
        content: `您本次预估消耗${res.data.adsTotal}个发帖点，审核通过后素材包将无法修改，确认提交审核吗?`,
        onOk() { updateCollectionFn(requestData) },
      })
    } else {
      updateCollectionFn(requestData)
    }
  }


  return (
    <>
      <MainTitle title="帖子AI任务填写" showJumpIcon />
      <div className={`${styles['post-create-container']} container`}>
        <Spin spinning={getDataLoading}>
          {
            init && <>
              <div className={styles['form-container']}>
                <WildcatForm
                  ref={formRef}
                  disabled={disabled}
                  editDataSource={formData}
                  config={config}
                  formChange={formChange}
                />
                <Form.Item label={'标题'} labelCol={fromLabelCol} required={true}>
                  <div className={styles['add-title']}>
                    {
                      !disabled && <Button className={styles['blue-btn']} onClick={handleClickCreateTitle}>批量添加</Button>
                    }
                    <span className={styles['preview-title']} onClick={() => handlePreviewTitle()}>预览标题</span>
                  </div>
                </Form.Item>
                <SelectImage collectionId={collectionId} ref={ImageRef}></SelectImage>
                <SetText collectionId={collectionId} ref={textRef}></SetText>
                {
                  !disabled && <Form.Item label={' '} colon={false} labelCol={fromLabelCol}>
                    <Button className={`${styles['draft-btn']} ${styles['white-btn']}`} disabled={getDataLoading || upDataLoading} onClick={() => handleClickUpdate(CollectionAction.DRAFT)}>保存草稿</Button>
                    <Button className={styles['blue-btn']} disabled={getDataLoading || upDataLoading} onClick={() => handleClickUpdate(CollectionAction.AUDIT)}>提交审核</Button>
                  </Form.Item>
                }
              </div>
            </>
          }
        </Spin>
      </div>
      <CatchComponent visible={previewTitleVisible}>
        <PostPreviewTitle page='formPage' action={disabled ? 'see' : 'edit'} taskId={id} visible={previewTitleVisible} onCancel={setPreviewTitleVisible} ></PostPreviewTitle>
      </CatchComponent>
    </>)
}

CreatePost.wrappers = ['@/wrappers/path-auth']

export default CreatePost
