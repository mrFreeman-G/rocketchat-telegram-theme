
# Telegram theme for Rocketchat
> "Is it telegram?! No it's rocketchat :("
--

### FYI:  I'm more backend then frontend developer, so feel free to improve JS code.

- JS and CSS code was developed from user position (when you dont have permissions to change css and js on server side), so to make this works you need to install Browser Extension [User JavaScript and CSS](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld)
- works on Rocket.Chat 6.0.0+ server version (tested on 6.0.0 - 6.2.11)

### Current features:
- **General telegram themes**
 - [x] light
 - [x] dark
- **Chat folders**
 - [x] add / remove folder
 - [x] add / remove chat in folder
 - [x] unread chats counters
- **Chat in sidebar**
 - [x] more noticeable highlighting on unread chats
 - [x] scaled avatars
 - [x] message formatting on extended view (coloring author)
- **Char room / Chat messages**
 - [x] new messages / threads style
 - [x] system messages removed
 - [x] chat room leader in header removed
 - [x] last message in thread removed (in general messages list)
 - [x] messages formatted (useless information removed)
 - [x] messages positioning adjusted
 - [x] ugly poll's style improved
 - [x] emojis window restyled
 - [x] chat room loader (skeleton css on load room is hidden)
 - [x] **there is stickers now!** (if message contains only 1 emoji - it appears like sticker)


### Known issues:
 - [ ] chat management popups doesnt work in folders (even though it appears on hover)
 - [ ] no adaptation on narrow screen size (WIP)
 - [ ] there may be problems with a slower Internet connection (WIP)

### Hot ot install:
#### for user:
- install Browser Extension [User JavaScript and CSS](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld)
- click on extension icon in your browser
- click "add"
- copy/past js and css code from repository into sections
- in js code change `isLocal` variable to `true`
- in js code change `messageReadReceiptEnabled` variable to `true` or `false` if it's enabled on your server (required for correct work of stickers)
- save & reload rocketchat window
#### for server:
- go to `Workspace > Settings > Layout`
- copy/paste css code into `Custom CSS` section
- copy/paste js code into `Custom Scripts > Custom Script for Logged In Users`
- in js code change `isLocal` variable to `false`
- in js code change `messageReadReceiptEnabled` variable to `true` or `false` if it's enabled on your server (required for correct work of stickers)


`messageReadReceiptEnabled` - it's a checkbox in messages:
![image](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/39b3968c-0c71-4db2-b83c-e36c19cee5fa)

for administrator this option can be found in `Workspace > Settings > Message > Read Receipts`: 
![image](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/67c3d7b1-222e-4178-9932-c56ce260d657)



## Previews

### thread's
![thread_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/3e58b8ed-fe20-499a-b9b8-23e7b3a7a323)
![thread_-_dark](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/71cd8742-0b56-46cf-8c7b-8cad2d3ae9bc)

### poll's
![poll_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/7e86703a-e975-4185-b47f-6d3583baa24f)

### chat room / messages
![main_with_thread_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/6383c447-4182-461f-90a2-d146ad56740e)
![main_with_thread_-_dark](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/00425d99-1b2e-48ab-94ea-9b7fb99c4bf6)

### stickers
![stickers_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/fd302e2a-f9ab-4d36-8d9e-11fb776a1dfc)
![stickers_-_dark](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/3fa39a90-782f-4a54-affb-54463a3700ae)

### sidebar
- 1 - add folder 
- 2 - add current chat in folder
- 3 - remove current chat from folder
- 4 - remove folder from sidebar
  
![sidebar](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/208fe57c-2e50-43ec-95c6-cc85b048dda0)
