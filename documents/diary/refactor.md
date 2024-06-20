
# 6-16-24:
## Fix Project Directory Structure
I chose to move all the javascript files into /src, such that all project folders can be contained within one directory instead of across the project root. As such, I needed to modify package.json main such that instead of using node_modules/expo/AppEntry.js it uses ./src/App.js. Changing directory structure also required fixing some imports of files.

# 6-19-24:
## Refactoring Context
Currently, I notice that the current method of getting the current user, organization, and userorganization involves a convolued process like so:
```
const user = await Auth.currentAuthenticatedUser();
const key = user.attributes.sub + ' currOrg';
const org = await AsyncStorage.getItem(key);
const orgJSON = JSON.parse(org);
const dataOrg = await DataStore.query(Organization, orgJSON.id);
const orgUserStorage = await DataStore.query(OrgUserStorage, assignUser.id);
```
I think that instead, I'm going to create a userContext that keeps track of userId, orgId, and orgUserStorageId that listens for Auth firing events. Then, I can simply use those ids to query from DataStore. Also, storing userId + 'currOrg' and userId + 'currOrgUser' should hopefully help me keep track of the necessary variables for use with offline sync. Amplify keeps track of user, I will keep track of currOrg and currOrgUser. 