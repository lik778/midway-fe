export type TemplateType = "SHOP_ARTICLE" | "QUESTION_ANSWER" | "QUESTION_D" | "KNOWLEDGE"

export interface Template {
  createdTime: string
  fileName: string
  id: number
  num: number
  operator: string
  status: "DELETED" | "NORMAL"
  type: TemplateType
}
