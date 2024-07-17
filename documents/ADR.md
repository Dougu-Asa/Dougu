# Architectural Decision Record:
- Chose to utilize github organizations for its project feature, since from CSE110 it was a helpful way to keep track of tasks to accomplish
- I chose to add Sentry to the project in anticipation for when the app is pre-released for Asa Members to test. Sentry should allow all errors, whether on Apple or Android, to come towards a central location in Sentry.io. 
- Decided to add ESLint to solidify naming conventions and coding styles, as I occasionally have issues with that. Additionally can help 
- Added TypeScript due to type ambiguity, especially during DataStore calls. Since this is a relatively large-scale app, I decided TypeScript's reliability would be beneficial.