export type AvatarEntity = {
  id: string
  url: string
}

export type RoleEntity = {
  id: string
  doProf: boolean
  doInst: boolean
  doAdmin: boolean
}

export type UserEntity = {
  id: string
  email: string
  firsName: string
  lastName: string
  password: string
  isVerified: boolean
  tokenVerif: string
  avatar: AvatarEntity
  role: RoleEntity
}
