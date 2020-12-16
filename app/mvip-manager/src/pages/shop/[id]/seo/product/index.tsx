import React, { useState, useEffect } from 'react';
import BasisHeader from '@/components/basis-header';
import SeoTab from '@/components/seo-tab';
import WildcatForm from '@/components/wildcat-form';
import { ShopBasisType, ShopTDKType, ShopTDKPosition } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { tdkForm } from '@/config/form';
import { Form, message } from 'antd';
import { useParams } from 'umi';
import { RouteParams, TdkSaveMeta } from '@/interfaces/shop';
import { getMetaDetailApi, getMetaSaveApi } from '@/api/shop';
import LoadingStatus from '@/components/loading-status';
export default (props: any) => {
  const [formConfig, setformConfig] = useState<FormConfig>(tdkForm)
  const [editData, setEditData] = useState<any>(null)
  const params: RouteParams = useParams();
  const [Loading, setLoading] = useState<any>(true)

  const getMetaDetail = async () => {
    const res = await getMetaDetailApi(Number(params.id), {
      position: ShopTDKPosition.PRODUCT
    })
    if(res?.success) {
      const tkd = res?.data?.tkd
      setEditData(tkd)
      setLoading(false)
    }
  }



  useEffect(() => {
    getMetaDetail()
  }, [])


  const sumbit = async (values: TdkSaveMeta) => {
    values.position = ShopTDKPosition.PRODUCT
    if(values?.keywords?.length<3) {
      message.error('请输入大于三个的关键词')
      return
    }
    if(!(values.keywords instanceof Array)) {
      let kw: string = values.keywords
      values.keywords = kw.split(',')
    }
    const res = await getMetaSaveApi(Number(params.id), values)
    if(res?.success) {
      message.success(res.message)
    }else{
      message.error(res.message)
    }
  }

  const formPage = ()=>{
    if(Loading) {
      return <LoadingStatus />
    }else{
      return (
        <Form.Item>
          <WildcatForm
            editDataSource={editData}
            config={formConfig}
            submit={sumbit}/>
        </Form.Item>
      )
    }
  }

  return (
      <div>
        <BasisHeader type={ShopBasisType.SEO}/>
       <div className="container">
         <div className="tdk-box">
           <h4>
             分页设置TDK
           </h4>
           <div className="t-content">
              <div className="t-menu">
                <SeoTab type={ShopTDKType.PRODUCT}/>
              </div>
            <div className="t-form">
              {formPage()}
            </div>
           </div>
         </div>
       </div>
      </div>
    );
}




