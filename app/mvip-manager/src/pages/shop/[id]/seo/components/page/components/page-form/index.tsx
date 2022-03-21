import React, { useEffect, FC, useState, useMemo, ReactNode } from 'react';
import WildcatForm from '@/components/wildcat-form';
import { ShopInfo } from '@/interfaces/shop';
import { getMetaSaveApi } from '@/api/shop';
import { ShopTDKPosition, ProductType, ShopTDKType } from '@/enums';
import { TdkDetail, TdkSaveMeta } from '@/interfaces/shop';
import { successMessage, errorMessage } from '@/components/message';
import { tdkForm } from './config'
import { getMetaDetailApi, getseoAutoFillApi } from '@/api/shop';
import { Button} from 'antd';
import style from './index.less';
interface Props {
  id: string,
  curShopInfo: ShopInfo | null
  pagePosition: ShopTDKPosition
  pageType: ShopTDKType
}
const fillContentType = ['title', 'description']
const fillContentPageType = [ShopTDKType.INDEX, ShopTDKType.PRODUCT]
const SeoForm: FC<Props> = (props) => {
  const { id, curShopInfo, pagePosition, pageType } = props
  const [editData, setEditData] = useState<TdkDetail>()
  const [templateData, setTemplateData] = useState<TdkDetail>()
  const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
  const formConfig = useMemo(() => {
    return tdkForm(curShopInfo?.type === ProductType.B2B, pageType, (data: TdkDetail) => {
        const newEditData = {...editData, ...data}
        setEditData({...newEditData})
    })
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
      position: pagePosition!
    })
    if (res.success) {
      const { data } = res
      return data || editData
    } else {
      errorMessage(res.message)
    }
  }
  const fillContent=async(name: string | null, callback:(newValue: string, name: string) => void)=>{
    if(!templateData){
        const data = await getseoAutoFill()
        setTemplateData(data)
        callback(data[name], name)
    } else {
        callback(templateData[name], name)
    }
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
       (lable: string | ReactNode, name: string, callBack:(newValue: string, name: string) => void) => curShopInfo?.type === ProductType.B2B && fillContentType.includes(name) && fillContentPageType.includes(pageType) && <p className={style['recommended-box']}>为您推荐：<Button shape="round" onClick={(()=>fillContent(name,callBack))}>一键填充{lable}</Button></p>
     }   
    </WildcatForm>
}
export default SeoForm
