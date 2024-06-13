## 6-13-2024
Today I managed to get `npx expo start` to run and open the app, however I have been getting: 
```
[ERROR] 36:54.579 DataStore - Sync processor retry error: {"data": {}, "errors": [[GraphQLError: Request failed with status code 401]]}
 WARN  [WARN] 36:54.635 DataStore - User is unauthorized to query syncUsers with auth mode API_KEY. No data could be returned.
 ```
 Hopefully `amplify update api` will fix it.
