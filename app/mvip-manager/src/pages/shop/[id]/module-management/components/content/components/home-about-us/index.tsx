import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'umi';
import { Button, Row, Col, Spin } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import WildcatForm from '@/components/wildcat-form';
import { aboutUsForm } from './config'
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE } from '@/models/shop';
import { connect } from 'dva';
import { ModuleHomeABoutInfo, ModulePageType, ModuleComponentId, ShopInfo, InitModuleHomeABoutInfo } from '@/interfaces/shop'
import { getModuleInfoApi, setModuleHomeABoutInfoApi } from '@/api/shop'
import { mockData } from '@/utils';
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import { useMemo } from 'react';
import { ShopIndustryType } from '@/enums';
import { getImgUploadModelValue, getImgUploadValueModel } from '@/components/img-upload';
import { MediaItem } from '@/components/img-upload/data';

interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId,
  curShopInfo?: ShopInfo | null
}

const TipNode = () => {
  return <div className={styles['tip-content']}>
    <div>
      <span className={styles['text']}>仅在电脑端展示</span>
      <QuestionCircleOutlined className={styles['icon']} />
      <img className={styles['img']} src="//file.baixing.net/202108/a4a1b6fc624ae157500620d340244724.png" alt="" />
    </div>
    <div className={styles['text']}>图片格式：jpg、jpeg、png，大小不超过3M，图片比例16：9，建议最小尺寸：432*243</div>
  </div>
}

const AboutUs: FC<Props> = (props) => {
  const params = useParams<{ id: string }>()
  const { position, pageModule, curShopInfo } = props
  const [detail, setDetail] = useState<InitModuleHomeABoutInfo>({
    name: '',
    tags: [],
    media: '',
  })

  const config = useMemo(() => {
    // ShopIndustryType
    if (curShopInfo && curShopInfo.type) {
      return aboutUsForm(curShopInfo.type, <TipNode></TipNode>)
    } else {
      return aboutUsForm(ShopIndustryType.SALE, <TipNode></TipNode>)
    }
  }, [curShopInfo])

  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const getDetail = async () => {
    setGetDataLoading(true)
    const res = await getModuleInfoApi<ModuleHomeABoutInfo>(Number(params.id), {
      position, pageModule
    })
    const { videoUrl, media } = res.data
    setDetail({
      ...res.data,
      media: res.data.videoUrl ? getImgUploadValueModel('VIDEO', videoUrl, media) : getImgUploadValueModel('IMAGE', media)
    })
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = async (values: InitModuleHomeABoutInfo) => {
    console.log(values)
    // 因为tag组件默认传出来的是 逗号拼接的string
    setUpDataLoading(true)
    const res = await setModuleHomeABoutInfoApi(Number(params.id), {
      ...values,
      media: values.media ? values.media.mediaType === 'IMAGE' ? getImgUploadModelValue(values.media) as string : getImgUploadModelValue(values.media, true) as string : '',
      videoUrl: values.media ? values.media.mediaType === 'IMAGE' ? '' : getImgUploadModelValue(values.media) as string : '',
      tags: Array.isArray(values.tags) ? values.tags : (values.tags as any).split(','),
      position, pageModule
    })
    if (res.success) {
      successMessage(res.message)
    } else {
      errorMessage(res.message)
    }
    setUpDataLoading(false)
  }

  return <div className={styles["about-us-container"]}>
    <Spin spinning={getDataLoading || upDataLoading}>
      <WildcatForm
        editDataSource={detail}
        submit={handleSubmit}
        config={config}
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

export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(AboutUs)