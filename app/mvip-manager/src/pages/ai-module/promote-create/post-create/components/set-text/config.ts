import { FormItemConfig } from './data'
import { CollectionFragmentsType } from '@/enums/ai-module'
import { collectionFragmentsTypeMap } from '@/constants/ai-module'

export const formItemConfig: FormItemConfig[] = [{
  label: collectionFragmentsTypeMap[CollectionFragmentsType.COMPANY_INFO],
  tip: '说明：公司介绍和产品/服务介绍之和最少5个，最多100个。可以填写公司介绍、公司优势、荣誉证书、公司业绩、公司发展史 等内容。',
  type: CollectionFragmentsType.COMPANY_INFO,
  showInfoModal: false
}, {
  label: collectionFragmentsTypeMap[CollectionFragmentsType.PRODUCT_INFO],
  tip: '说明：公司介绍和产品/服务介绍之和最少5个，最多100个。可以填写公司有哪些产品，提供哪些服务，做什么业务，每个业务可以独立进行一段内容介绍等。',
  type: CollectionFragmentsType.PRODUCT_INFO,
  showInfoModal: false
}, {
  label: collectionFragmentsTypeMap[CollectionFragmentsType.QA_INFO],
  tip: '说明：小知识/问答最少15个，最多50个。请填写行业、业务、产品、服务相关的小知识、问答、文章内容。',
  type: CollectionFragmentsType.QA_INFO,
  showInfoModal: false
}]