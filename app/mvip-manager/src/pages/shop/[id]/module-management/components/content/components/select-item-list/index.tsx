import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'umi';
import { Button, Row, Col, Spin } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { selectItemFrom } from './config'
import { Detail } from './data'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import SelectItem from '../components/select-item'
import { ConfigItemType, ConfigKey } from '../components/select-item/data'
import { ModuleArticleInfo, ModuleProductInfo, ModulePageType, ModuleComponentId, ModuleArticleInfoParam, ModuleProductInfoParam, ModuleHomeArticleListInfo } from '@/interfaces/shop'
import { getModuleInfoApi, setModuleProductInfoApi, setModuleHomeArticleListApi, setModuleArticleInfoApi } from '@/api/shop'
import styles from './index.less'
import { mockData } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';
interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId,
  type: ConfigItemType,
  configKey: ConfigKey,
  itemMaxLength?: number // 因为b2c的首页文章长度和b2b不一样 不想在这里接入model 所以加个参数传值
}

const AboutUs: FC<Props> = (props) => {
  const params = useParams<{ id: string }>()
  const { position, pageModule, type, configKey, itemMaxLength } = props
  const [detail, setDetail] = useState<ModuleArticleInfo | ModuleProductInfo>({
    name: '',
    productList: [],
    articleList: []
  })

  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const [config, setConfig] = useState<FormConfig>(() => {
    const config = selectItemFrom()
    // 下面的key是为了保证循环的唯一key 
    // 真正的key在SelectItem的config文件里
    config.customerFormItemList = [{
      index: 2,
      key: `${type}List`,
      node: <SelectItem key={`${type}List`} configKey={configKey} itemMaxLength={itemMaxLength}></SelectItem>
    }]
    return config
  });

  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getModuleInfoApi<ModuleArticleInfo | ModuleHomeArticleListInfo | ModuleProductInfo>(Number(params.id), {
      position, pageModule
    })
    //  首页文章列表的数据和其他推荐的文章数据格式不一样做一次转化 都改成相同的模型输入
    let data = res.data
    if (position === 'homePage' && pageModule === 'articleList') {
      (data as ModuleArticleInfo).articleList = (data as ModuleHomeArticleListInfo).articleList?.result || []
    }
    setDetail(data as ModuleArticleInfo | ModuleProductInfo)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = async (values: ModuleArticleInfo | ModuleProductInfo) => {
    setUpDataLoading(true)
    let res
    if (type === "product") {
      res = await setModuleProductInfoApi(Number(params.id), {
        ...values,
        productIdList: (values as ModuleProductInfo).productList.map(item => item.id),
        position, pageModule,
      })
    } else if (position === 'homePage' && pageModule === 'articleList') {
      res = await setModuleHomeArticleListApi(Number(params.id), {
        ...values,
        articleIdList: (values as ModuleArticleInfo).articleList.map(item => item.id),
        position, pageModule,
      })
    } else {
      res = await setModuleArticleInfoApi(Number(params.id), {
        ...values,
        articleIdList: (values as ModuleArticleInfo).articleList.map(item => item.id),
        position, pageModule,
      })
    }
    if (res.success) {
      successMessage(res.message)
    } else {
      errorMessage(res.message)
    }
    setUpDataLoading(false)
  }

  return <div className={styles["home-hot-product-container"]}>
    <Spin spinning={getDataLoading || upDataLoading}>
      <WildcatForm
        editDataSource={detail}
        submit={handleSubmit}
        config={config}
        submitBtn={
          <Row className={styles["home-hot-product-submit-box"]}>
            <Col span={2}></Col>
            <Col className={styles['home-hot-product-content']}>
              <Button loading={upDataLoading} className={styles['btn']}
                type="primary" size="large" htmlType="submit">保存</Button>
            </Col>
          </Row>
        }
      />
    </Spin>
  </div>
}

export default AboutUs