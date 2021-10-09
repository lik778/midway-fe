import { CollectionFragmentsType } from '@/enums/ai-module'
export interface FormItemConfig {
  label: string,
  min?: number,
  max: number,
  tip: string,
  type: CollectionFragmentsType,
  showInfoModal: boolean
}