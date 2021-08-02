export type PageType = 'home' | 'product' | 'product-detail' | 'article' | 'article-detail' | 'about'

export type ComponentId = 'swiper' | 'hotProduct' | 'customer' | 'aboutUs'

export interface MenuItemConfig {
  id: ComponentId,
  name: string,
  thumbnail: string
}