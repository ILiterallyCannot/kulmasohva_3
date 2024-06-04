export default interface IUser {
  id?: any | null;
  username?: string | null;
  email?: string;
  password?: string;
  roles?: Array<string>;
}

export interface IRole {
  id: string | null;
  name?: string | null;
}
