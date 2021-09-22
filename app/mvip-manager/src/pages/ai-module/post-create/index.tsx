import React, { FC, useEffect, useState } from 'react';
import { Button, Row, Col, Spin } from 'antd';
import { useHistory } from 'umi'
import MainTitle from '@/components/main-title';
import { cloneDeepWith } from 'lodash';
import { postForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';

import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less';
import { objToTargetObj } from '@/utils';
import { createCollection, getCollection, updateCollection } from '@/api/ai-module'
import { CollectionDetail, UpdataCollectionParams, InitCollectionForm } from '@/interfaces/ai-module'
import { MetasItem } from '@/interfaces/user';

const CreatePost: FC = (props: any) => {
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
  const [companyInfo, setCompanyInfo] = useState<any>()




  const updateConfigData = () => {
    console.log(123456)
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
      }, {
        key: collection.categoryId,
        value: collection.categoryId,
        label: collection.categoryId,
      }, collection.thirdMeta.map(item => item.id)],
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
    console.log(res)
    setCollection(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    console.log(collectionId)
    if (collectionId > 0) {
      getDetail()
    }
  }, [collectionId])

  const createCollectionFc = async () => {
    setUpDataLoading(true)
    const res = await createCollection()
    console.log(res)
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
    //console.log(arg)
  }

  return (
    <>
      <MainTitle title="问答素材" />
      <div className="container">
        <Spin spinning={getDataLoading}>
          <WildcatForm
            editDataSource={enterpriseInfo}
            submit={sumbit}
            config={config}
            formChange={formChange}
          />
        </Spin>
      </div>
    </>)
}

export default CreatePost
