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
        __typename
      }
      storages {
        nextToken
        __typename
      }
      manager {
        id
        name
        isStorage
        details
        createdAt
        updatedAt
        organizationStoragesId
        userOrganizationsId
        __typename
      }
      createdAt
      updatedAt
      organizationManagerId
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
        organizationManagerId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      organizations {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getOrgStorage = /* GraphQL */ `
  query GetOrgStorage($id: ID!) {
    getOrgStorage(id: $id) {
      id
      name
      isStorage
      organization {
        id
        name
        accessCode
        createdAt
        updatedAt
        organizationManagerId
        __typename
      }
      user {
        id
        name
        email
        createdAt
        updatedAt
        __typename
      }
      equipment {
        nextToken
        __typename
      }
      details
      createdAt
      updatedAt
      organizationStoragesId
      userOrganizationsId
      __typename
    }
  }
`;
export const listOrgStorages = /* GraphQL */ `
  query ListOrgStorages(
    $filter: ModelOrgStorageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrgStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        isStorage
        details
        createdAt
        updatedAt
        organizationStoragesId
        userOrganizationsId
        __typename
      }
      nextToken
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
        organizationManagerId
        __typename
      }
      lastUpdatedDate
      assignedTo {
        id
        name
        isStorage
        details
        createdAt
        updatedAt
        organizationStoragesId
        userOrganizationsId
        __typename
      }
      parent {
        id
        name
        lastUpdatedDate
        details
        createdAt
        updatedAt
        organizationEquipmentId
        orgStorageEquipmentId
        equipmentChildrenId
        __typename
      }
      children {
        nextToken
        __typename
      }
      details
      createdAt
      updatedAt
      organizationEquipmentId
      orgStorageEquipmentId
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
        organizationEquipmentId
        orgStorageEquipmentId
        equipmentChildrenId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
