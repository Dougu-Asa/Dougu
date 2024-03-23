/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    createOrganization(input: $input, condition: $condition) {
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
export const updateOrganization = /* GraphQL */ `
  mutation UpdateOrganization(
    $input: UpdateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    updateOrganization(input: $input, condition: $condition) {
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
export const deleteOrganization = /* GraphQL */ `
  mutation DeleteOrganization(
    $input: DeleteOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    deleteOrganization(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createOrgStorage = /* GraphQL */ `
  mutation CreateOrgStorage(
    $input: CreateOrgStorageInput!
    $condition: ModelOrgStorageConditionInput
  ) {
    createOrgStorage(input: $input, condition: $condition) {
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
export const updateOrgStorage = /* GraphQL */ `
  mutation UpdateOrgStorage(
    $input: UpdateOrgStorageInput!
    $condition: ModelOrgStorageConditionInput
  ) {
    updateOrgStorage(input: $input, condition: $condition) {
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
export const deleteOrgStorage = /* GraphQL */ `
  mutation DeleteOrgStorage(
    $input: DeleteOrgStorageInput!
    $condition: ModelOrgStorageConditionInput
  ) {
    deleteOrgStorage(input: $input, condition: $condition) {
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
export const createEquipment = /* GraphQL */ `
  mutation CreateEquipment(
    $input: CreateEquipmentInput!
    $condition: ModelEquipmentConditionInput
  ) {
    createEquipment(input: $input, condition: $condition) {
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
export const updateEquipment = /* GraphQL */ `
  mutation UpdateEquipment(
    $input: UpdateEquipmentInput!
    $condition: ModelEquipmentConditionInput
  ) {
    updateEquipment(input: $input, condition: $condition) {
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
export const deleteEquipment = /* GraphQL */ `
  mutation DeleteEquipment(
    $input: DeleteEquipmentInput!
    $condition: ModelEquipmentConditionInput
  ) {
    deleteEquipment(input: $input, condition: $condition) {
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
