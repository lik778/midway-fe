import React, { useEffect, FC, useState, useMemo, ReactNode } from 'react';
import WildcatForm from '@/components/wildcat-form';
import { ShopInfo } from '@/interfaces/shop';
import { getMetaSaveApi } from '@/api/shop';
import { ShopTDKPosition, ProductType, ShopTDKType } from '@/enums';
import { TdkDetail, TdkSaveMeta } from '@/interfaces/shop';
import { successMessage, errorMessage } from '@/components/message';
import { tdkForm } from './config'
import { getMetaDetailApi } from '@/api/shop';
import { getseoAutoFillApi } from '@/api/seo-setting';
import { Button} from 'antd';
interface Props {
  id: string,
  curShopInfo: ShopInfo | null
  pagePosition: ShopTDKPosition
  pageType: ShopTDKType
}

const SeoForm: FC<Props> = (props) => {
  const { id, curShopInfo, pagePosition, pageType } = props
  useEffect(() => {
    console.log(props)
  }, [])
  const [editData, setEditData] = useState<TdkDetail>()
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
  const formConfig = useMemo(() => {
    return tdkForm(curShopInfo?.type === ProductType.B2B, pageType)
  }, [curShopInfo])

  const getMetaDetail = async () => {
    const res = await getMetaDetailApi(Number(id), {
      position: pagePosition!
    })
    if (res.success) {
      const tkd = res.data.tkd
      setEditData(tkd)
    } else {
      errorMessage(res.message)
    }
  }
  const getseoAutoFill = async () =>{
    const res = await getseoAutoFillApi(Number(id), {
      shopId:Number(id),
      position: pagePosition!
    })
    if (res.success) {
      const { data } = res
      return data
    } else {
      errorMessage(res.message)
    }
  }
  const fillContent=async(type:number,callback:(newValue: string, name: string) => void)=>{
    callback('HAHAHA', 'title')
    // const data = await getseoAutoFill()
    
  }
  useEffect(() => {
    getMetaDetail()
    
  }, [])
  
  const sumbit = async (values: TdkSaveMeta) => {
    values.position = pagePosition
    values.title = (values.title || '').replace(/｜/g, '|')
    setUpDateLoading(true)
    const res = await getMetaSaveApi(Number(id), values)
    setUpDateLoading(false)
    if (res?.success) {
      successMessage('保存成功')
    } else {
      errorMessage(res.message)
    }
  }

  return <WildcatForm
    editDataSource={editData}
    config={formConfig}
    submit={sumbit}
    loading={upDateLoading}
    pageType={ShopTDKType.PRODUCT}
    >
     {
       
        (lable: string | ReactNode,type:number,callBack:(newValue: string, name: string) => void) =>(type==3||type==0)?<p className={'recommended-box'}>为您推荐：<Button onClick={(()=>fillContent(type,callBack))}>一键填充{lable}</Button></p>:''
     }   
    </WildcatForm>
}
export default SeoForm
