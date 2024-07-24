// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserOrStorage = {
  "USER": "USER",
  "STORAGE": "STORAGE"
};

const { Organization, User, OrgUserStorage, Container, Equipment, AuditLog } = initSchema(schema);

export {
  Organization,
  User,
  OrgUserStorage,
  Container,
  Equipment,
  AuditLog,
  UserOrStorage
};