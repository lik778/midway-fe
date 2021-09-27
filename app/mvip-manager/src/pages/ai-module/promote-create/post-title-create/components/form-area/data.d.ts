import { CollectionTitleApiParams } from '@/interfaces/ai-module'
import { Rule } from '../../data'

export interface SelectConfig {
  key: keyof CollectionTitleApiParams,
  label: string,
  tip: string,
  rules: Rule[]
}

export interface SelectListItem {
  label: string,
  value: string,
  children?: SelectListItem[]
}