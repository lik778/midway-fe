import { TemplateType } from '../interfaces/template'

export const TEMPLATE_TYPES: {
  [key in TemplateType]: string
} = {
  KNOWLEDGE: '小知识',
  SHOP_ARTICLE: '文章',
  QUESTION_D: '问答D',
  QUESTION_ANSWER: '问答素材'
}
