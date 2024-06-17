
# 6-16-24:
## Fix Project Directory Structure
I chose to move all the javascript files into /src, such that all project folders can be contained within one directory instead of across the project root. As such, I needed to modify package.json main such that instead of using node_modules/expo/AppEntry.js it uses ./src/App.js.