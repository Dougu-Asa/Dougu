# 8-3-24 -> 
## Displaying Containers
Containers are very similar to folders on the app store, and so today I setup a system to create containers and have it be rendered. After creating a quick method to create containers, I had to overhaul the current equipmentItem context and system of distributing data. Since I valued having a generic item class that encompasses both equipment and container for dragging reusability and sorting items by their label, I created an Item interface. Then, I changed the equipment context to distribute a map of Items rather than of just Equipment. Therefore, on render, all I would need to do is check the item.type and then decide whether to render an equipmentItem or container. 

## Container Styling
Over the container overlay, I came to notice that implementing blur is very difficult due to troubles with Android, so I likely will not be implementing it. Additionally, I decided to merge the overlay as part of the container item itself for now instead of having a separated title as in most apps due to the added complexity of creating a custom overlay component. For now, I want to focus more on the gestures of containers.

## Detecting Containers and Opening Modals
After a lot of thought and contemplation, I figured out a way to track if a user has hovered over a modal for an extended period of time. In the interest of trying to keep the process efficient, I first setup a layout where the screen will only show 4 items at a time, spaced equally apart. And the scrollview locks such that the four items are always in the same place. Then, I keep track of the horizontal offset and calculate which square the current hover is in by doing ceiling((x + horizontalOffset) / scrollOffset). And so, by keeping tracking of which grid squares are active through onLayout, I can quickly check if the user is currently over a container square.

- Switching characters and hovering where the container used to be still opens the modal

After this, I had to setup a method to open the modal, though I quickly noticed that the modal overlaps the dragging Item. Therefore, I needed to develop a custom modal popup and it inside swapEquipmentScreen for the draggingItem to cover. However, now 

- Modal no longer works on equipment, team, and orgInfo