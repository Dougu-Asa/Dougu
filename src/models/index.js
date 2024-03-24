// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserOrStorage = {
  "USER": "USER",
  "STORAGE": "STORAGE"
};

const { Organization, User, OrgUserStorage, Equipment } = initSchema(schema);

export {
  Organization,
  User,
  OrgUserStorage,
  Equipment,
  UserOrStorage
};