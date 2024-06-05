export default interface IUser {
  id?: any | null;
  username?: string | null;
  email?: string;
  password?: string;
  name?: String;
  surname?: String;
  phonenumber?: string;
  city?: String;
  country?: String;
  roles?: Array<string>;
}

export interface IRole {
  id: string | null;
  name?: string | null;
}
