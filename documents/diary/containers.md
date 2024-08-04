# 8-3-24 -> 
## Displaying Containers
Containers are very similar to folders on the app store, and so today I setup a system to create containers and have it be rendered. After creating a quick method to create containers, I had to overhaul the current equipmentItem context and system of distributing data. Since I valued having a generic item class that encompasses both equipment and container for dragging reusability and sorting items by their label, I created an Item interface. Then, I changed the equipment context to distribute a map of Items rather than of just Equipment. Therefore, on render, all I would need to do is check the item.type and then decide whether to render an equipmentItem or container. 

## Container Styling
Over the container overlay, I came to notice that implementing blur is very difficult due to troubles with Android, so I likely will not be implementing it. However, I want to develop the UI further first and test to see how it looks before deciding. 