export type PageType = 'homePage' | 'productListPage' | 'articleListPage' | 'articleInfoPage' | 'aboutPage'

export type ComponentId = 'banner' | 'productRecommend' | 'autoConfig' | 'about' | 'articleRecommend'


export interface PageItemOption {
  key: PageType,
  label: string
}
export interface MenuItemOption {
  id: ComponentId,
  name: string,
  thumbnail: string,
  max?: number,
}

