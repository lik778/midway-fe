import React, { FC, useEffect, useRef, useState, useContext } from 'react';
import { Button, Form, Spin, Input, FormInstance, Modal } from 'antd';
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
import { createCollection, getCollection, updateCollection, getSecondCategories, getCompanyMetas } from '@/api/ai-module'
import { CollectionDetail, UpdataCollectionParams, InitCollectionForm, SecondCategoriesListItem, CompanyMetas } from '@/interfaces/ai-module'
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
  const [categoryId, setCategoryId] = useState<string>('')
  const [companyMetas, setCompanyMetas] = useState<CompanyMetas | null>(null)

  // TODO;
  const getCompanyMetasFn = useDebounce(async () => {
    setGetDataLoading(true)
    const res = await getCompanyMetas({ categoryId })
    console.log(res)
    if (res.success) {
      setCompanyMetas(res.data.companyMetas)
    } else {
      errorMessage(res.message || ' ')
    }
    setGetDataLoading(false)
  }, 100)

  useEffect(() => {
    if (categoryId) {
      getCompanyMetasFn()
    }
  }, [categoryId])

  // 初始化表单的数据
  const initComponent = async () => {
    if (!collection) return
    if (!selectedVipResources) return
    const { form } = formRef.current
    const draftCollectionData = postToolData.formData[id]
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
      // 初始化好就存一份到缓存中
      postToolData.formData[id] = { ...newFormData }
      handleChangeContextData({ postToolData })
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
    if (res.success) {
      const collection = res.data
      setCollection(collection)
      setCategoryId(collection.categoryId)
      const disabled = [CollectionStatus.COLLECTION_PUBLISH_STATUS, CollectionStatus.COLLECTION_FINISHED_STATUS, CollectionStatus.COLLECTION_PENDING_STATUS, CollectionStatus.COLLECTION_PAUSED_STATUS].includes(collection.status)
      // 在这里判断是否能禁用表单
      setDisabled(disabled)
      postToolData.disabled = disabled
      handleChangeContextData({
        postToolData
      })
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

  const formChange = (changeTarget: any, value: InitCollectionForm) => {
    console.log('formChange', changeTarget, value)
    if (changeTarget.metaCascaderValue && changeTarget.metaCascaderValue[1] && changeTarget.metaCascaderValue[1].value) {
      setCategoryId(changeTarget.metaCascaderValue[1].value)
    }
  }

  const handleClickCreateTitle = async () => {
    const { form } = formRef.current
    try {
      await form?.validateFields()
      const values = form?.getFieldsValue()
      postToolData.formData[id] = values
      handleChangeContextData({ postToolData })
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
      successMessage(res.message)
      setTimeout(() => {
        history.goBack()
      }, 1500)
    } else {
      errorMessage(res.message)
      setUpDataLoading(false)
    }
  }

  const handleClickUpdate = async (action: CollectionAction.AUDIT | CollectionAction.DRAFT) => {

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
    console.log(values)
    const requestData = {
      id: collectionId,
      name: values.name,
      categoryId: values.metas[1].value,
      thirdMetaIds: values.metas[2].join(','),
      action,
      metas: {
        [companyMetas?.name || '公司名称']: companyMetas?.value || ''
      }
    }
    if (companyMetas) {
      requestData.metas = {
        [companyMetas.name || '公司名称']: companyMetas.value || '123'
      }
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
          <div className={styles['form-container']}>
            <WildcatForm
              ref={formRef}
              disabled={disabled}
              editDataSource={formData}
              config={config}
              formChange={formChange}
            />
            <Form.Item label={'公司名称'} labelCol={fromLabelCol}>
              <Input style={{ width: 260 }} disabled value={companyMetas?.value || ''} size={'large'} placeholder={'请选择类目'}></Input>
            </Form.Item>
            <Form.Item label={'标题'} labelCol={fromLabelCol} required={true}>
              <div className={styles['add-title']}>
                {
                  !disabled && <Button className={styles['blue-btn']} onClick={handleClickCreateTitle}>批量添加</Button>
                }
                <span className={styles['preview-title']} onClick={() => handlePreviewTitle()}>预览标题</span>
              </div>
            </Form.Item>
            <SelectImage collectionId={collectionId}></SelectImage>
            <SetText collectionId={collectionId}></SetText>
          </div>
        </Spin>
        {
          !disabled && <div className={styles['btn-line']}>
            <Button className={`${styles['draft-btn']} ${styles['white-btn']}`} disabled={getDataLoading || upDataLoading} loading={upDataLoading} onClick={() => handleClickUpdate(CollectionAction.DRAFT)}>保存草稿</Button>
            <Button className={styles['blue-btn']} disabled={getDataLoading || upDataLoading} loading={upDataLoading} onClick={() => handleClickUpdate(CollectionAction.AUDIT)}>提交审核</Button>
          </div>
        }
      </div>
      <CatchComponent visible={previewTitleVisible}>
        <PostPreviewTitle action='see' taskId={id} visible={previewTitleVisible} onCancel={setPreviewTitleVisible} ></PostPreviewTitle>
      </CatchComponent>
    </>)
}

CreatePost.wrappers = ['@/wrappers/path-auth']

export default CreatePost
