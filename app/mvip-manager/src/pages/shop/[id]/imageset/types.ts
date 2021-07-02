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

export type TabScope = 'album' | 'image'
