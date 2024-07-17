
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

# 7-8-24
## Directory and Context change
First, I chose to try to simplify the directory structure of the application by grouping similar sections. I decided to group /Member as all MemberTabs screens pertaining to the individual, and /Organization for Organization information that is more geared towards the manager. This is part of my overall goal of a cleaner project structure. Future improvements are planned for the components directory.

After contemplation, I decided to try using the UserContext idea I've already had. While I considered using Redux or events, I think the userContext only truly needs the 3 variables: user, org, userOrg, so it's best not to overcomplicate. Therefore, I got to work implementing it into Login.js, CreateAcc.js, DrawerNav.js, HomeScreen.js, and App.js.

# 7-15-24
## Further Context Changes
My guiding principle right now is to make it so that **any screens in /Member or /Organization should have user, org, and userOrg context updated**. They should not have to worry about setting or updating those values. And **any screens in /drawer should have user updated, that the user should already be logged in**.

Also, to organize the /components directory, I chose to have it mirror /screens in that there is also a /member and /organization where any components in /components/member are used in /screens/member. Any components not in these are global components.

# 7-16-24
## Context and Pages
- I decided to have UserContext automatically handle updating the orgUserStorage on its own side, so that the context handles its own functionality.
- I created a custom error handler for greater clarity or error origin and avoiding redundancy
- Broke down large functions into smaller chunks for JoinOrgScreen and CreateOrgScreen

Potential Future Things to Add:
[Adding TypeScript](https://reactnative.dev/docs/typescript?package-manager=npm)
[Adding ESLint](https://eslint.org/docs/latest/use/getting-started)
[Testing](https://reactnative.dev/docs/testing-overview)

# 7-17-24
## TypeScript
In order to remove ambiguity in objects, I decided to add TypeScript for the entire app. This initiated a couple of key changes, especially in defining types for navigators in react-native-navigation and for contexts (LoadingContext, UserContext). 

When working on types for Contexts, I created custom ContextTypes with fields for each of the values they provide. Additionally, each context's use hook (useLoad, useUser) had a check to ensure a non-null context. By doing so, it ensured that the fields the contexts distributes are reliable.

When working on Typing for react-native-navigation, I first had to create a custom type for each navigator. Then, each screen also contains a custom type that the navigator prop in the screen file imports. It makes `navigation.navigate()` a little more complex, but it is a good way to ensure all the paths are valid at compile-time.

These links seem important for linking native nfc scanner with my app:
[Custom Native Code](https://docs.expo.dev/workflow/customizing/)  
[Example](https://docs.expo.dev/modules/native-module-tutorial/)