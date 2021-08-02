import React, { FC, useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { aboutUsForm } from './config'
import { Detail } from './data'
import styles from './index.less'
interface Props {

}

const AboutUs: FC<Props> = (props) => {
  const { } = props
  const [detail] = useState<Detail>({
    name: '',
    tags: [],
    img: ''
  })

  const [updataLoading, setUpdataLoading] = useState<boolean>(false)

  const handleSubmit = (values: Detail) => {
    console.log(values)
  }

  return <div className={styles["about-us-container"]}>
    <WildcatForm
      editDataSource={detail}
      submit={handleSubmit}
      config={aboutUsForm}
      submitBtn={
        <Row className={styles["about-us-submit-box"]}>
          <Col span={2}></Col>
          <Col>
            <Button loading={updataLoading} className={styles['btn']}
              type="primary" size="large" htmlType="submit">保存</Button>
          </Col>
        </Row>
      }
    />
  </div>
}

export default AboutUs