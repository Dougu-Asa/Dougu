/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrganization = /* GraphQL */ `
  query GetOrganization($id: ID!) {
    getOrganization(id: $id) {
      id
      name
      accessCode
      equipment {
        nextToken
        startedAt
        __typename
      }
      UserOrStorages {
        nextToken
        startedAt
        __typename
      }
      manager {
        userId
        name
        email
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      organizationManagerUserId
      __typename
    }
  }
`;
export const listOrganizations = /* GraphQL */ `
  query ListOrganizations(
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrganizations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        accessCode
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncOrganizations = /* GraphQL */ `
  query SyncOrganizations(
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOrganizations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        accessCode
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      userId
      name
      email
      organizations {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $userId: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      userId: $userId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userId
        name
        email
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        userId
        name
        email
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getOrgUserStorage = /* GraphQL */ `
  query GetOrgUserStorage($id: ID!) {
    getOrgUserStorage(id: $id) {
      id
      organization {
        id
        name
        accessCode
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      type
      user {
        userId
        name
        email
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      equipment {
        nextToken
        startedAt
        __typename
      }
      details
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      organizationUserOrStoragesId
      userOrganizationsUserId
      __typename
    }
  }
`;
export const listOrgUserStorages = /* GraphQL */ `
  query ListOrgUserStorages(
    $filter: ModelOrgUserStorageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrgUserStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationUserOrStoragesId
        userOrganizationsUserId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncOrgUserStorages = /* GraphQL */ `
  query SyncOrgUserStorages(
    $filter: ModelOrgUserStorageFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOrgUserStorages(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        type
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationUserOrStoragesId
        userOrganizationsUserId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getEquipment = /* GraphQL */ `
  query GetEquipment($id: ID!) {
    getEquipment(id: $id) {
      id
      name
      organization {
        id
        name
        accessCode
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      lastUpdatedDate
      assignedTo {
        id
        type
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationUserOrStoragesId
        userOrganizationsUserId
        __typename
      }
      parent {
        id
        name
        lastUpdatedDate
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationEquipmentId
        orgUserStorageEquipmentId
        equipmentChildrenId
        __typename
      }
      children {
        nextToken
        startedAt
        __typename
      }
      details
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      organizationEquipmentId
      orgUserStorageEquipmentId
      equipmentChildrenId
      __typename
    }
  }
`;
export const listEquipment = /* GraphQL */ `
  query ListEquipment(
    $filter: ModelEquipmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEquipment(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        lastUpdatedDate
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationEquipmentId
        orgUserStorageEquipmentId
        equipmentChildrenId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncEquipment = /* GraphQL */ `
  query SyncEquipment(
    $filter: ModelEquipmentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEquipment(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        lastUpdatedDate
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationEquipmentId
        orgUserStorageEquipmentId
        equipmentChildrenId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
