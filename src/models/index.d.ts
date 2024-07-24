import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier, CustomIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum UserOrStorage {
  USER = "USER",
  STORAGE = "STORAGE"
}



type EagerOrganization = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Organization, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly accessCode: string;
  readonly image: string;
  readonly equipment?: (Equipment | null)[] | null;
  readonly UserOrStorages?: (OrgUserStorage | null)[] | null;
  readonly containers?: (Container | null)[] | null;
  readonly manager: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationManagerUserId: string;
}

type LazyOrganization = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Organization, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly accessCode: string;
  readonly image: string;
  readonly equipment: AsyncCollection<Equipment>;
  readonly UserOrStorages: AsyncCollection<OrgUserStorage>;
  readonly containers: AsyncCollection<Container>;
  readonly manager: AsyncItem<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationManagerUserId: string;
}

export declare type Organization = LazyLoading extends LazyLoadingDisabled ? EagerOrganization : LazyOrganization

export declare const Organization: (new (init: ModelInit<Organization>) => Organization) & {
  copyOf(source: Organization, mutator: (draft: MutableModel<Organization>) => MutableModel<Organization> | void): Organization;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<User, 'userId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly userId: string;
  readonly name: string;
  readonly email: string;
  readonly image: string;
  readonly organizations?: (OrgUserStorage | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<User, 'userId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly userId: string;
  readonly name: string;
  readonly email: string;
  readonly image: string;
  readonly organizations: AsyncCollection<OrgUserStorage>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerOrgUserStorage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OrgUserStorage, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly organization: Organization;
  readonly type: UserOrStorage | keyof typeof UserOrStorage;
  readonly image: string;
  readonly user?: User | null;
  readonly equipment?: (Equipment | null)[] | null;
  readonly containers?: (Container | null)[] | null;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationUserOrStoragesId?: string | null;
  readonly userOrganizationsUserId?: string | null;
}

type LazyOrgUserStorage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OrgUserStorage, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly organization: AsyncItem<Organization>;
  readonly type: UserOrStorage | keyof typeof UserOrStorage;
  readonly image: string;
  readonly user: AsyncItem<User | undefined>;
  readonly equipment: AsyncCollection<Equipment>;
  readonly containers: AsyncCollection<Container>;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationUserOrStoragesId?: string | null;
  readonly userOrganizationsUserId?: string | null;
}

export declare type OrgUserStorage = LazyLoading extends LazyLoadingDisabled ? EagerOrgUserStorage : LazyOrgUserStorage

export declare const OrgUserStorage: (new (init: ModelInit<OrgUserStorage>) => OrgUserStorage) & {
  copyOf(source: OrgUserStorage, mutator: (draft: MutableModel<OrgUserStorage>) => MutableModel<OrgUserStorage> | void): OrgUserStorage;
}

type EagerContainer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Container, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly organization: Organization;
  readonly lastUpdatedDate: string;
  readonly assignedTo: OrgUserStorage;
  readonly image: string;
  readonly equipment?: (Equipment | null)[] | null;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationContainersId?: string | null;
  readonly orgUserStorageContainersId?: string | null;
}

type LazyContainer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Container, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly organization: AsyncItem<Organization>;
  readonly lastUpdatedDate: string;
  readonly assignedTo: AsyncItem<OrgUserStorage>;
  readonly image: string;
  readonly equipment: AsyncCollection<Equipment>;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationContainersId?: string | null;
  readonly orgUserStorageContainersId?: string | null;
}

export declare type Container = LazyLoading extends LazyLoadingDisabled ? EagerContainer : LazyContainer

export declare const Container: (new (init: ModelInit<Container>) => Container) & {
  copyOf(source: Container, mutator: (draft: MutableModel<Container>) => MutableModel<Container> | void): Container;
}

type EagerEquipment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Equipment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly organization: Organization;
  readonly lastUpdatedDate: string;
  readonly assignedTo: OrgUserStorage;
  readonly image: string;
  readonly parent?: Container | null;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationEquipmentId?: string | null;
  readonly orgUserStorageEquipmentId?: string | null;
  readonly containerEquipmentId?: string | null;
}

type LazyEquipment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Equipment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly organization: AsyncItem<Organization>;
  readonly lastUpdatedDate: string;
  readonly assignedTo: AsyncItem<OrgUserStorage>;
  readonly image: string;
  readonly parent: AsyncItem<Container | undefined>;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly organizationEquipmentId?: string | null;
  readonly orgUserStorageEquipmentId?: string | null;
  readonly containerEquipmentId?: string | null;
}

export declare type Equipment = LazyLoading extends LazyLoadingDisabled ? EagerEquipment : LazyEquipment

export declare const Equipment: (new (init: ModelInit<Equipment>) => Equipment) & {
  copyOf(source: Equipment, mutator: (draft: MutableModel<Equipment>) => MutableModel<Equipment> | void): Equipment;
}

type EagerAuditLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuditLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly orgUser: string;
  readonly organization: string;
  readonly operation: string;
  readonly entity: string;
  readonly entityId: string;
  readonly timestamp: string;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAuditLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AuditLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly orgUser: string;
  readonly organization: string;
  readonly operation: string;
  readonly entity: string;
  readonly entityId: string;
  readonly timestamp: string;
  readonly details?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AuditLog = LazyLoading extends LazyLoadingDisabled ? EagerAuditLog : LazyAuditLog

export declare const AuditLog: (new (init: ModelInit<AuditLog>) => AuditLog) & {
  copyOf(source: AuditLog, mutator: (draft: MutableModel<AuditLog>) => MutableModel<AuditLog> | void): AuditLog;
}