# 7-25-2024
## UserGroups
One issue I realized when working on `DataStore.start()` is that it would automatically sync the entire datastore locally, which is not ideal as the application gets bigger. Even though my application isn't big enough for it to really be a problem right now and that it might be a bit excessive, I think it's worth setting up a system where users are added to userGroups by organizations. In doing so, it would allow for more selective syncing, and better graphQL security rules. Additionally, it would be difficult to migrate the data and models to this new schema if this actually becomes a problem.
[Controlling AWS From API](https://docs.aws.amazon.com/IAM/latest/APIReference/welcome.html)
[UserGroup Authentication](https://docs.amplify.aws/gen1/react-native/build-a-backend/graphqlapi/customize-authorization-rules/#user-group-based-data-access)
 - Keep users to less than 5 user groups!