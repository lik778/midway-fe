import React, { FC, useState, useEffect } from 'react';
import { Button, Row, Col, Spin } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { aboutUsForm } from './config'
import { Detail } from './data'
import { mockData } from '@/utils';
import styles from './index.less'

interface Props {

}

const AboutUs: FC<Props> = (props) => {
  const { } = props
  const [detail, setDetail] = useState<Detail>({
    name: '',
    tags: [],
    media: ''
  })

  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)



  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await mockData<Detail>('data', {
      "name": "成磊测试",
      "tags": [
        "a",
        "b",
        "c",
        "d"
      ],
      "media": ""
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

  return <div className={styles["about-us-container"]}>
    <Spin spinning={getDataLoading || upDataLoading}>
      <WildcatForm
        editDataSource={detail}
        submit={handleSubmit}
        config={aboutUsForm}
        submitBtn={
          <Row className={styles["about-us-submit-box"]}>
            <Col span={2}></Col>
            <Col className={styles['about-us-content']}>
              <div className={styles['about-us-tip']}>注：【公司名称】和【公司简介】读取企业资料相关字段的内容</div>
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