export interface DocsEntity {
  id: number
  title: string
  typeDoc: string
  document: string
}

export interface DocsData extends DocsEntity {
  resources: {
    id: string
    url: string
  }
}
