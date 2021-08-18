import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'umi';
import { Button, Row, Col, Spin } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { selectItemFrom } from './config'
import { Detail } from './data'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import SelectItem from '../components/select-item'
import { ConfigItemType, ConfigKey } from '../components/select-item/data'
import { ModuleArticleInfo, ModuleProductInfo, ModulePageType, ModuleComponentId, ModuleArticleInfoParam, ModuleProductInfoParam } from '@/interfaces/shop'
import { getModuleInfoApi, setModuleProductInfoApi, setModuleArticleInfoApi } from '@/api/shop'
import styles from './index.less'
import { mockData } from '@/utils';
import { errorMessage, successMessage } from '@/components/message';
interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId,
  type: ConfigItemType,
  configKey: ConfigKey
}

const AboutUs: FC<Props> = (props) => {
  const params = useParams<{ id: string }>()
  const { position, pageModule, type, configKey } = props
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
      node: <SelectItem key={`${type}List`} configKey={configKey}></SelectItem>
    }]
    return config
  });

  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getModuleInfoApi<ModuleArticleInfo | ModuleProductInfo>(Number(params.id), {
      position, pageModule
    })
    setDetail(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = async (values: ModuleArticleInfo | ModuleProductInfo) => {
    console.log(values)
    setUpDataLoading(true)
    let res
    if (type === "product") {
      res = await setModuleProductInfoApi(Number(params.id), {
        ...values,
        productIdList: (values as ModuleProductInfo).productList.map(item => item.id),
        position, pageModule
      })
    } else {
      res = await setModuleArticleInfoApi(Number(params.id), {
        ...values,
        articleIdList: (values as ModuleArticleInfo).articleList.map(item => item.id),
        position, pageModule
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