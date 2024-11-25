export type AuthEntity = {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: {
    id: string
    url: string
  }
  role: {
    id: string
    doUser: boolean
    doAdmin: boolean
    doDevelop: boolean
  }
}
