
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

# 6-24-24
## Planning for refactoring helper functions
I realized that before I create a userContext, I should first look at how I'm going to modularize and simplify the Datastore functions. So I compiled them into Storage.js for now, where I plan to split it up into Equipment, Organization, Storage, and basically one for each module. I also want to centralize Error Handling, where I found [this article](https://medium.com/@jimmyalbert/handle-errors-in-react-native-897713baf166) explaining how I might do so. Definitely sending error messages to a service like Sentry would be pretty nice. 

# 6-27-24
## Adding Sentry
Sentry has now been added to the application, such that any errors on devices can be sent to a more central location. Managing both Apple and Android can be tough, so I think this will be helpful when I release the app to others. Currently Sentry is only setup on login.js, as I need to have Sentry capture the exception too.