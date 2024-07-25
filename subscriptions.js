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
      image
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
      containers {
        nextToken
        startedAt
        __typename
      }
      manager {
        userId
        name
        email
        image
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
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization(
    $filter: ModelSubscriptionOrganizationFilterInput
  ) {
    onUpdateOrganization(filter: $filter) {
      id
      name
      accessCode
      image
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
      containers {
        nextToken
        startedAt
        __typename
      }
      manager {
        userId
        name
        email
        image
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
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization(
    $filter: ModelSubscriptionOrganizationFilterInput
  ) {
    onDeleteOrganization(filter: $filter) {
      id
      name
      accessCode
      image
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
      containers {
        nextToken
        startedAt
        __typename
      }
      manager {
        userId
        name
        email
        image
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      userId
      name
      email
      image
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      userId
      name
      email
      image
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      userId
      name
      email
      image
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
export const onCreateOrgUserStorage = /* GraphQL */ `
  subscription OnCreateOrgUserStorage(
    $filter: ModelSubscriptionOrgUserStorageFilterInput
  ) {
    onCreateOrgUserStorage(filter: $filter) {
      id
      name
      organization {
        id
        name
        accessCode
        image
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      type
      image
      user {
        userId
        name
        email
        image
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
      containers {
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
export const onUpdateOrgUserStorage = /* GraphQL */ `
  subscription OnUpdateOrgUserStorage(
    $filter: ModelSubscriptionOrgUserStorageFilterInput
  ) {
    onUpdateOrgUserStorage(filter: $filter) {
      id
      name
      organization {
        id
        name
        accessCode
        image
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      type
      image
      user {
        userId
        name
        email
        image
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
      containers {
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
export const onDeleteOrgUserStorage = /* GraphQL */ `
  subscription OnDeleteOrgUserStorage(
    $filter: ModelSubscriptionOrgUserStorageFilterInput
  ) {
    onDeleteOrgUserStorage(filter: $filter) {
      id
      name
      organization {
        id
        name
        accessCode
        image
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationManagerUserId
        __typename
      }
      type
      image
      user {
        userId
        name
        email
        image
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
      containers {
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
export const onCreateContainer = /* GraphQL */ `
  subscription OnCreateContainer(
    $filter: ModelSubscriptionContainerFilterInput
  ) {
    onCreateContainer(filter: $filter) {
      id
      name
      organization {
        id
        name
        accessCode
        image
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
        name
        type
        image
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
      image
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
      organizationContainersId
      orgUserStorageContainersId
      __typename
    }
  }
`;
export const onUpdateContainer = /* GraphQL */ `
  subscription OnUpdateContainer(
    $filter: ModelSubscriptionContainerFilterInput
  ) {
    onUpdateContainer(filter: $filter) {
      id
      name
      organization {
        id
        name
        accessCode
        image
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
        name
        type
        image
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
      image
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
      organizationContainersId
      orgUserStorageContainersId
      __typename
    }
  }
`;
export const onDeleteContainer = /* GraphQL */ `
  subscription OnDeleteContainer(
    $filter: ModelSubscriptionContainerFilterInput
  ) {
    onDeleteContainer(filter: $filter) {
      id
      name
      organization {
        id
        name
        accessCode
        image
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
        name
        type
        image
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
      image
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
      organizationContainersId
      orgUserStorageContainersId
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
        image
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
        name
        type
        image
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
      image
      parent {
        id
        name
        lastUpdatedDate
        image
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationContainersId
        orgUserStorageContainersId
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
      containerEquipmentId
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
        image
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
        name
        type
        image
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
      image
      parent {
        id
        name
        lastUpdatedDate
        image
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationContainersId
        orgUserStorageContainersId
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
      containerEquipmentId
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
        image
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
        name
        type
        image
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
      image
      parent {
        id
        name
        lastUpdatedDate
        image
        details
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        organizationContainersId
        orgUserStorageContainersId
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
      containerEquipmentId
      __typename
    }
  }
`;
export const onCreateAuditLog = /* GraphQL */ `
  subscription OnCreateAuditLog($filter: ModelSubscriptionAuditLogFilterInput) {
    onCreateAuditLog(filter: $filter) {
      id
      orgUser
      organization
      operation
      entity
      entityId
      timestamp
      details
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateAuditLog = /* GraphQL */ `
  subscription OnUpdateAuditLog($filter: ModelSubscriptionAuditLogFilterInput) {
    onUpdateAuditLog(filter: $filter) {
      id
      orgUser
      organization
      operation
      entity
      entityId
      timestamp
      details
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteAuditLog = /* GraphQL */ `
  subscription OnDeleteAuditLog($filter: ModelSubscriptionAuditLogFilterInput) {
    onDeleteAuditLog(filter: $filter) {
      id
      orgUser
      organization
      operation
      entity
      entityId
      timestamp
      details
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
