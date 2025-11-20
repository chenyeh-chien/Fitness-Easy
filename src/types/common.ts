export type UserInfo = {
  uid: string,
  email: string | null,
  name: string | null,
  avatar: string | null,
  provider: string | undefined,
  emailVerified: boolean
}