export const NAME_FIELD_KEY: keyof IUser = "name";

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
}

export function getEntityField<Entity>(
  entities: Entity[],
  fieldName: keyof Entity
): unknown[] {
  return entities.map((entity) => entity[fieldName]);
}

export function getUsersName(users: IUser[]): string[] {
  return getEntityField(users, NAME_FIELD_KEY) as string[];
}

const result = getUsersName(users);