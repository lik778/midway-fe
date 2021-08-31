import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'umi';
import { Button, Row, Col, Spin, message } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { aboutUsForm } from './config'
import { ModuleABoutABoutInfo, ModulePageType, ModuleComponentId, ModuleABoutABoutInfoParam, InitModuleABoutABoutInfo } from '@/interfaces/shop'
import { getModuleInfoApi, setModuleABoutInfoApi } from '@/api/shop'
import { mockData } from '@/utils';
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { useDebounce } from '@/hooks/debounce';

interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
}

const AboutUs: FC<Props> = (props) => {
  const params = useParams<{ id: string }>()
  const { position, pageModule } = props
  const [detail, setDetail] = useState<InitModuleABoutABoutInfo>({
    backImg: ''
  })

  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getModuleInfoApi<ModuleABoutABoutInfo>(Number(params.id), {
      position, pageModule
    })
    setDetail({
      ...res.data,
      backImg: getImgUploadValueModel('IMAGE', res.data.backImg)
    })
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = useDebounce(async (values: InitModuleABoutABoutInfo) => {
    setUpDataLoading(true)
    const res = await setModuleABoutInfoApi(Number(params.id), {
      ...values,
      backImg: getImgUploadModelValue(values.backImg),
      position, pageModule
    })
    if (res.success) {
      successMessage(res.message)
    } else {
      errorMessage(res.message)
    }
    setUpDataLoading(false)
  }, 300)

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
              <Button loading={upDataLoading} disabled={upDataLoading} className={styles['btn']}
                type="primary" size="large" htmlType="submit">保存</Button>
            </Col>
          </Row>
        }
      />
    </Spin>
  </div>
}

export default AboutUs