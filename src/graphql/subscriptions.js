/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization(
    $filter: ModelSubscriptionOrganizationFilterInput
  ) {
    onCreateOrganization(filter: $filter) {
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
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization(
    $filter: ModelSubscriptionOrganizationFilterInput
  ) {
    onUpdateOrganization(filter: $filter) {
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
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization(
    $filter: ModelSubscriptionOrganizationFilterInput
  ) {
    onDeleteOrganization(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateOrgStorage = /* GraphQL */ `
  subscription OnCreateOrgStorage(
    $filter: ModelSubscriptionOrgStorageFilterInput
  ) {
    onCreateOrgStorage(filter: $filter) {
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
export const onUpdateOrgStorage = /* GraphQL */ `
  subscription OnUpdateOrgStorage(
    $filter: ModelSubscriptionOrgStorageFilterInput
  ) {
    onUpdateOrgStorage(filter: $filter) {
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
export const onDeleteOrgStorage = /* GraphQL */ `
  subscription OnDeleteOrgStorage(
    $filter: ModelSubscriptionOrgStorageFilterInput
  ) {
    onDeleteOrgStorage(filter: $filter) {
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
export const onCreateEquipment = /* GraphQL */ `
  subscription OnCreateEquipment(
    $filter: ModelSubscriptionEquipmentFilterInput
  ) {
    onCreateEquipment(filter: $filter) {
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
export const onUpdateEquipment = /* GraphQL */ `
  subscription OnUpdateEquipment(
    $filter: ModelSubscriptionEquipmentFilterInput
  ) {
    onUpdateEquipment(filter: $filter) {
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
export const onDeleteEquipment = /* GraphQL */ `
  subscription OnDeleteEquipment(
    $filter: ModelSubscriptionEquipmentFilterInput
  ) {
    onDeleteEquipment(filter: $filter) {
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
