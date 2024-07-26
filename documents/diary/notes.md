
Create Org:
  user: 
  operation: CREATE
  entityId: org Id
  entityName: orgName
  time:
  details:

Update Org:
  user: 
  operation: UPDATE
  entityId: org Id
  entityName: orgName
  time:
  details: What field did you change?

Delete Org:
  user: 
  operation: DELETE
  entityId: org Id
  entityName: orgName
  time:
  details:

Create OrgUserStorage:
  user: 
  operation: CREATE
  entityId: orgUserStorage Id
  entityName: orgUserStorageName
  organization: org Name
  time:
  details:

Update OrgUserStorage:
  user: 
  operation: UPDATE
  entityId: orgUserStorage Id
  entityName: orgUserStorageName
  organization: org Name
  time:
  details: What field did you change?

Delete OrgUserStorage:
  user: 
  operation: DELETE
  entityId: orgUserStorage Id
  entityName: orgUserStorageName
  organization: org Name
  time:
  details:

Create Container:
  user: 
  operation: CREATE
  entityId: container Id
  entityName: containerName
  organization: org Name
  to: orgUserStorage Id
  toName: orgUserStorageName
  time:
  details:

Update Container:
  user: 
  operation: UPDATE
  entityId: container Id
  entityName: containerName
  organization: org Name
  time:
  details: What field did you change?

Delete Container:
  user: 
  operation: DELETE
  entityId: container Id
  entityName: containerName
  organization: org Name
  time:
  details:

Move Container:
  user: 
  operation: SWAP
  entityId: container Id
  entityName: containerName
  organization: org Name
  to: orgUserStorage Id
  toName: orgUserStorageName
  time:
  details: What field did you change?

Create Equipment:
  user: 
  operation: CREATE
  entityId: equipment Id
  entityName: equipmentName
  organization: org Name
  to: orgUserStorage Id
  toName: orgUserStorageName
  time:
  details:

Update Equipment:
  user: 
  operation: UPDATE
  entityId: equipment Id
  entityName: equipmentName
  organization: org Name
  time:
  details: What field did you change?

Delete Equipment:
  user: 
  operation: DELETE
  entityId: equipment Id
  entityName: equipmentName
  organization: org Name
  time:
  details:

Swap Equipment:
  user: 
  operation: SWAP
  entityId: equipment Id
  entityName: equipmentName
  organization: org Name
  to: orgUserStorage Id
  toName: orgUserStorageName
  time:
  details: What field did you change?