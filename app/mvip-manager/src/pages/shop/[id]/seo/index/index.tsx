import React, { useState, useEffect } from 'react';
import BasisHeader from '../../components/basis-header';
import SeoTab from '../components/seo-tab';
import WildcatForm from '@/components/wildcat-form';
import { ShopBasisType, ShopTDKType, ShopTDKPosition } from '@/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { tdkForm } from '../config';
import { Form } from 'antd';
import { useParams } from 'umi';
import { RouteParams, TdkSaveMeta } from '@/interfaces/shop';
import { getMetaDetailApi, getMetaSaveApi } from '@/api/shop';
import Loading from '@/components/loading';
import { errorMessage, successMessage } from '@/components/message';
import '../index.less'

export default (props: any) => {
  const [formConfig, setformConfig] = useState<FormConfig>(tdkForm)
  const [editData, setEditData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [nav, setNav] = useState<any[]>([])
  const params: RouteParams = useParams();

  const getMetaDetail = async () => {
    const res = await getMetaDetailApi(Number(params.id), {
      position: ShopTDKPosition.INDEX
    })
    if (res?.success) {
      const tkd = res.data.tkd
      const navigation = res?.data?.navigation
      setNav(navigation)
      setEditData(tkd)
      setLoading(false)
    }
  }



  useEffect(() => {
    getMetaDetail()
  }, [])


  const sumbit = async (values: TdkSaveMeta) => {
    values.position = ShopTDKPosition.INDEX
    if (values?.keywords?.length < 3) {
      errorMessage('请输入大于三个的关键词')
      return
    }
    if (!(values.keywords instanceof Array)) {
      let kw: string = values.keywords
      values.keywords = kw.split(',')
    }
    setFormLoading(true)
    const res = await getMetaSaveApi(Number(params.id), values)
    setFormLoading(false)
    if (res?.success) {
      successMessage('保存成功')
    } else {
      errorMessage(res.message)
    }
  }

  const formPage = () => {
    if (loading) {
      return <Loading />
    } else {
      return (
        <div className="t-content">
          <div className="t-menu">
            <SeoTab type={ShopTDKType.INDEX} nav={nav} />
          </div>
          <div className="t-form">
            <Form.Item>
              <WildcatForm
                editDataSource={editData}
                config={formConfig}
                submit={sumbit}
                loading={formLoading} />

            </Form.Item>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <BasisHeader {...props} type={ShopBasisType.SEO} />
      <div className="container">
        <div className="tdk-box">
          <h4>
            分页设置TDK
           </h4>
          {formPage()}
        </div>
      </div>
    </div>
  );
}





