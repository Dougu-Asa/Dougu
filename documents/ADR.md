# Architectural Decision Record:
- Chose to utilize github organizations for its project feature, since from CSE110 it was a helpful way to keep track of tasks to accomplish
- src/ is intended to contain all the necessary files to build the project
- I chose to add Sentry to the project in anticipation for when the app is pre-released for Asa Members to test. Sentry should allow all errors, whether on Apple or Android, to come towards a central location in Sentry.io. 