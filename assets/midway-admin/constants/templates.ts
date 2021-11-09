import { TemplateType } from '../interfaces/template'

export const TEMPLATE_TYPES: {
  [key in TemplateType]: string
} = {
  KNOWLEDGE: '小知识',
  SHOP_ARTICLE: '文章',
  QUESTION_D: '问答D',
  QUESTION_ANSWER: '问答素材'
}

export const TEMPLATE_FILENAMES: {
  [key in TemplateType]: string
} = {
  KNOWLEDGE: 'jiadianweixiu空调维修.xlsx',
  SHOP_ARTICLE: '文章模板.xlsx',
  QUESTION_D: '问答回答模板.xlsx',
  QUESTION_ANSWER: '问答D词模板.xlsx'
}
