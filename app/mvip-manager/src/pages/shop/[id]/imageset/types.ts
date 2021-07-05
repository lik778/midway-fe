export type AlbumItem = {
  id: number,
  name: string,
  url: string,
  count: string
}

export type ImageItem = {
  id: number,
  name: string,
  url: string,
}

export type CardItem = AlbumItem | ImageItem

export type TabScopeItem = {
  item: CardItem | null
  type: 'album' | 'image'
}
export type TabScope = TabScopeItem[]
