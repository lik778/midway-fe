export type AlbumItem = {
  type: 'album'
  id: number,
  name: string,
  url: string,
  count: number
}

export type ImageItem = {
  type: 'image'
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
