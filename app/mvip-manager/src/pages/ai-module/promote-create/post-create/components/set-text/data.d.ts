export interface FormItemConfig {
  label: string,
  min?: number,
  max: number,
  tip: string,
  type: 'companyInfo' | 'productInfo' | 'qaInfo',
  showInfoModal: boolean
}