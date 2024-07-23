# 7-23-24

## Search and SOrting
Since I am not very familiar with testing, my idea is to build from the ground up with unit -> component -> integration -> e2e tests (that's a lot!). So, I think the best place to start for unit testing using jest would be DataStoreUtils.tsx. Recalling a lesson from an audiobook about the life of Elon Musk, however, before automating testing I would first like to make sure that my DataStoreUtils is actually properly designed. Therefore, I first plan on implementing searching and sorting functionality since that could potentially shape the way I return my data in the utils.

As part of search and sorting, I decided to add react-native-elements for the searchbar. I also believe that it will be valuable in setting upt he overall theming and styles of the project as a whole, since my current CSS is a bit of a mess.