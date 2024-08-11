# 8-10-24 -> 
## Breaking down SwapEquipment
After my previous failed attempt to breaking down swapEquipment, I began to take it seriously this time and learned about the usage of custom hook components in react. Being able to easily create components that accept state and output state makes it much easier to break down a large file. While my break down of swap Equipment isn't going to be perfectly designed, it will help a lot with maintanability. I broke SwapGestures down into:
- useAnimateOverlay
- useItemCounts
- useScroll
- useSwap