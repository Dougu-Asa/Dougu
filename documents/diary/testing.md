# 7-23-24
## DataStoreUtils testing

### Search and SOrting
Since I am not very familiar with testing, my idea is to build from the ground up with unit -> component -> integration -> e2e tests (that's a lot!). So, I think the best place to start for unit testing using jest would be DataStoreUtils.tsx. Recalling a lesson from an audiobook about the life of Elon Musk, however, before automating testing I would first like to make sure that my DataStoreUtils is actually properly designed. Therefore, I first plan on implementing searching and sorting functionality since that could potentially shape the way I return my data in the utils.

As part of search and sorting, I decided to add react-native-elements for the searchbar. I also believe that it will be valuable in setting upt he overall theming and styles of the project as a whole, since my current CSS is a bit of a mess.

Ultimately, I implemented searching in TeamEquipment.js only, and sorted any members or equipment lists in alphabetical order (ignore upper/lower case). It should also be able to handle special characters.

### Refactoring GraphQL Schema
Similar to how I wanted to implemented searching and sorting, I also came to realize that since I may change the graphQl schema, it may change DataStoreUtils and therefore I should update the schema and fianlize how I want it to work. My current concerns are breaking down OrgUserStorage, handling containers, and implementing custom images.