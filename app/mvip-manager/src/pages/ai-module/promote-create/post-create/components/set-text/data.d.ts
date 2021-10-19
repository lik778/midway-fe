import { CollectionFragmentsType } from '@/enums/ai-module'
export interface FormItemConfig {
  label: string,
  tip: string,
  type: CollectionFragmentsType,
  showInfoModal: boolean
}