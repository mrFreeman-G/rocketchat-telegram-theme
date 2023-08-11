
# Telegram theme for Rocketchat
> "Is it telegram?! No it's rocketchat :("


![Peek 2023-07-30 21-16](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/9b941018-18b4-423b-a464-6357a48236a3)



### FYI:  I'm more backend then frontend developer, so feel free to improve JS code.

- If you dont have permissions to change css and js on server side, you can use Browser Extension [User JavaScript and CSS](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld) to use theme in your browser
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
 - [x] system messages style
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
- click on extension icon in your browser when you in rockerchat tab
- click "add"
- copy/past js and css code from repository into sections
- in js code change `isLocal` variable to `true`
- save & reload rocketchat window
#### for server:
- go to `Workspace > Settings > Layout`
- copy/paste css code into `Custom CSS` section
- copy/paste js code into `Custom Scripts > Custom Script for Logged In Users`
- in js code change `isLocal` variable to `false`


## Previews

### thread's
![thread_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/802babaa-011f-4205-b24a-f89876331f78)
![thread_-_dark](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/d722b9ab-2563-46e0-9386-af19719c515a)

### poll's
![poll_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/26b08131-6860-4d56-87ac-5b390164f52c)

### chat room / messages
![main_with_thread_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/19da027f-9179-470c-8f24-bc721287ae89)
![main_with_thread_-_dark](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/155e627c-764e-4f37-95a7-37213243078f)

### stickers
![stickers_-_light](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/99ab2c1a-992e-49b7-a5f1-44b0f21c442d)
![stickers_-_dark](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/cadb7abb-2363-42a7-9706-1cd7da0c86dd)

### sidebar
- 1 - add folder 
- 2 - add current chat in folder
- 3 - remove current chat from folder
- 4 - remove folder from sidebar
  
![sidebar](https://github.com/mrFreeman-G/rocketchat-telegram-theme/assets/109005425/7d00ef0a-0fbe-4306-a4ec-8305b7a88764)

