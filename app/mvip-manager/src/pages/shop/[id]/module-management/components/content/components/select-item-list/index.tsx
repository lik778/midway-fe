import React, { FC, useState, useEffect } from 'react';
import { Button, Row, Col, Spin } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { selectItemFrom } from './config'
import { PageType, ComponentId } from '../../../../data'
import { Detail } from './data'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import SelectItem from '../components/select-item'
import { ConfigItemType, ConfigKey } from '../components/select-item/data'
import styles from './index.less'
import { mockData } from '@/utils';
interface Props {
  position: PageType,
  pageModule: ComponentId,
  type: ConfigItemType,
  configKey: ConfigKey
}

const AboutUs: FC<Props> = (props) => {
  const { position, pageModule, type, configKey } = props
  const [detail, setDetail] = useState<Detail>({
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
    const res = await mockData<Detail>('data', {
      "name": `${type === 'product' ? '产品' : '文章'}详情`,
      "productList": [
        {
          "id": 2120,
          "name": "dfas",
          "price": "面议",
          "headImg": "http://img5.baixing.net/dc03a3ea825652047f4cc43e420e46dc.png_sv1",
          "urlSuffix": "http://shop.baixing.cn/dfjasidfjjs/p-2120.html"
        },
        {
          "id": 2124,
          "name": "抗日游行1",
          "price": "面议",
          "headImg": "http://img6.baixing.net/5b9c77aac2d80436484c7935ccfd000a.png_sv1",
          "urlSuffix": "http://shop.baixing.cn/version/p-2124.html"
        },
        {
          "id": 2125,
          "name": "抗日游行",
          "price": "面议",
          "headImg": "http://img6.baixing.net/8f6230f586c0937a27f83c3155f97325.png_sv1",
          "urlSuffix": "http://shop.baixing.cn/version/p-2125.html"
        }
      ],
      "articleList": [
        {
          "id": 1586,
          "name": "抗日游行",
          "urlSuffix": "http://b2bcc4.shop.baixing.cn/n-1586.html"
        },
        {
          "id": 1584,
          "name": "抗日游行1",
          "urlSuffix": "http://b2bcc4.shop.baixing.cn/n-1584.html"
        },
        {
          "id": 1599,
          "name": "抗日游行",
          "urlSuffix": "http://b2bcc4.shop.baixing.cn/n-1599.html"
        }
      ]
    })
    setDetail(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = (values: Detail) => {
    console.log(values)
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