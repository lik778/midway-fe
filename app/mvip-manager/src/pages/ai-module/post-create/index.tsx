import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Spin, Input } from 'antd';
import { useHistory } from 'umi'
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { postForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { connect } from 'dva';
import { userMapStateToProps, userMapDispatchToProps } from '@/models/user';
import { ConnectState } from '@/models/connect';
import { USER_NAMESPACE } from '@/models/user';
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less';
import { objToTargetObj } from '@/utils';
import { createCollection, getCollection, updateCollection } from '@/api/ai-module'
import { CollectionDetail, UpdataCollectionParams, InitCollectionForm } from '@/interfaces/ai-module'
import { MetasItem, UserEnterpriseInfo } from '@/interfaces/user';
import SelectImage from './components/select-image'
interface Props {
  companyInfo: UserEnterpriseInfo | null,
  loadingUser: boolean
}

const CreatePost: FC<Props> = (props) => {
  const { companyInfo, loadingUser } = props
  const history = useHistory<{ query: { id?: string } }>()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { id } = history.location.query
  const [getDataLoading, setGetDataLoading] = React.useState<boolean>(false);
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionDetail | null>()
  const [enterpriseInfo, setEnterpriseInfo] = useState<InitCollectionForm | null>(null)
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(postForm));
  const [collectionId, setCollectionId] = useState<number>(Number(id))

  const updateConfigData = () => {
    if (!collection) {
      setGetDataLoading(true)
      return
    }
    const { categoryId, categoryName } = collection
    const newChildren = config.children.map(item => {
      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.type === 'MetaSelect') {
        console.log(item)
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

  const initComponent = async () => {
    if (!collection) return
    setEnterpriseInfo({
      name: collection.name,
      metas: [{
        key: '服务',
        value: 'fuwu',
        label: '服务'
      }, undefined, collection.thirdMeta.map(item => item.id)],
    })
    updateConfigData()
  }

  useEffect(() => {
    if (collection) {
      initComponent()
    }
  }, [collection])

  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getCollection({ id })
    setCollection(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    if (collectionId > 0) {
      getDetail()
    }
  }, [collectionId])

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
    console.log(arg)
  }

  return (
    <>
      <MainTitle title="帖子AI任务填写" showJumpIcon />
      <div className={`${styles['post-create-container']} container`}>
        <Spin spinning={getDataLoading || loadingUser}>
          <div className={styles['form-container']}>
            <WildcatForm
              editDataSource={enterpriseInfo}
              submit={sumbit}
              config={config}
              formChange={formChange}
            />
            <Form.Item label={'公司名称'} labelCol={{ span: 2 }}>
              <Input style={{ width: 260 }} disabled value={companyInfo?.companyName || ''} size={'large'}></Input>
            </Form.Item>
            <SelectImage collectionId={collectionId}></SelectImage>
          </div>
        </Spin>
      </div>
    </>)
}


export default connect((state: ConnectState) => {
  const { companyInfo } = state[USER_NAMESPACE]
  const { loading } = state
  return { companyInfo, loadingUser: loading.models.user }
})(CreatePost)
