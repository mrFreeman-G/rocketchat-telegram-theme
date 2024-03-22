/* -- -- -- -- -- -- -- -- -- -- -- --
local use (user from browser extension)
-- -- -- -- -- -- -- -- -- -- -- -- */
const isLocal = false; // true
const defaultTheme = "telegram";  // rocketchat / flat / telegram

if (isLocal) {
	/* -- -- -- -- -- -- -- -- -- -- -- --
	FOR BROWSER USE.
	local user must wait until DOM loaded.
	-- -- -- -- -- -- -- -- -- -- -- -- */
	window.addEventListener("DOMContentLoaded", start);
} else {
	/* -- -- -- -- -- -- -- -- -- -- -- --
	FOR SERVER USE.
	server loads JS in already loaded DOM.
	-- -- -- -- -- -- -- -- -- -- -- -- */
	start();
}

console.log(' --- CUSTOM JS LOADED --- ');


const root = document.documentElement;
const allChatsLabel = "all chats";
const personalChatsLabel = "personal";
const settingsLabel = "settings";
const reservedNames = [allChatsLabel, settingsLabel, personalChatsLabel];
const chatFolders = getLocalStorageChatFolders();
const preparedFolders = {};
const generalFolderUnreadChats = {};
const customEmojis = [];
let loaderTimeout;

const buttonDarkClassName = "theme-dark-button";
const buttonClassName = "rcx-box rcx-box--full rcx-box--animated rcx-button--small rcx-button--primary rcx-button add-folder-button";


function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function isElement(element) {
	return element instanceof Element || element instanceof Document;
}

function getLocalStorageChatFolders() {
	let chatFolders = JSON.parse(localStorage.getItem("chatFolders"));
	if (!chatFolders) {
		chatFolders = {};
		localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
	}
	return chatFolders;
}

function setLocalStorageChatFolder(folderName) {
	let formattedFolderName = folderName.trim();
	let chatFolders = getLocalStorageChatFolders();
	if (reservedNames.indexOf(formattedFolderName.toLowerCase()) !== -1) {
		return false;
	}
	chatFolders[formattedFolderName] = [];
	localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
	return true;
}

function removeLocalStorageChatFolder(folderName) {
	let chatFolders = getLocalStorageChatFolders();
	delete chatFolders[folderName];
	localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
	return true;
}

function addChatToLocalStorageChatFolder(folderName, chatName) {
	let chatFolders = getLocalStorageChatFolders();
	if (chatFolders[folderName] && chatFolders[folderName].indexOf(chatName) === -1) {
		chatFolders[folderName].push(chatName);
		localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
		return true;
	}
	return false;
}

function removeChatFromLocalStorageChatFolder(folderName, chatName) {
	let chatFolders = getLocalStorageChatFolders();
	if (chatFolders[folderName]) {
		let index = chatFolders[folderName].indexOf(chatName);
		if (index !== -1) {
			chatFolders[folderName].splice(index, 1);
			localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
			return true;
		}
	}
	return false;
}

function getLocalStorageThemeSettings() {
  defaultThemeSettings = {
    "theme": defaultTheme,
    "bg": "bg-1",
    "palette-light": "palette-green",
    "palette-dark": "palette-dark",
    "extended-avatars-size": 45,
    "regular-avatars-size": 35,
    "compact-avatars-size": 20
  };
	let themeSettings = JSON.parse(localStorage.getItem("themeSettings"));
	if (!themeSettings) {
		themeSettings = defaultThemeSettings;
		localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
	}
  // ensure that all keys in user settings
  for (const [key, value] of Object.entries(defaultThemeSettings)) {
    if (!themeSettings.hasOwnProperty(key)) {
      themeSettings[key] = value;
		  localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
    }
  }
	return themeSettings;
}

function setLocalStorageThemeSettings(data) {
	let themeSettings = getLocalStorageThemeSettings();
	for (let [key, value] of Object.entries(data)) {
		themeSettings[key] = value;
	}
	localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
}

function updateThemeSettingsHtml(data) {
	root.setAttribute("data-theme", data["theme"]);
	root.setAttribute("data-bg", data["bg"]);
	root.setAttribute("data-palette-light", data["palette-light"]);
	root.setAttribute("data-palette-dark", data["palette-dark"]);
	root.setAttribute("data-bg-opacity-light", data["bg-opacity-light"]);
	root.setAttribute("data-bg-opacity-dark", data["bg-opacity-dark"]);
	root.setAttribute("data-extended-avatars-size", data["extended-avatars-size"]);
	root.setAttribute("data-regular-avatars-size", data["regular-avatars-size"]);
	root.setAttribute("data-compact-avatars-size", data["compact-avatars-size"]);
  if (data["extended-avatars-size"]) {
    root.style.setProperty("--extended-avatars-size", data["extended-avatars-size"] + "px");
  }
  if (data["regular-avatars-size"]) {
    root.style.setProperty("--regular-avatars-size", data["regular-avatars-size"] + "px");
  }
  if (data["compact-avatars-size"]) {
    root.style.setProperty("--compact-avatars-size", data["compact-avatars-size"] + "px");
  }
  console.debug("Theme settings updated.");
}

function getFolderIconSvg() {
	const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	iconSvg.classList.add("folder-svg-icon");
	iconSvg.setAttribute("viewBox", "0 0 24 24");
	iconSvg.innerHTML = `
		<path d="
			M3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536
			10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046
			20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17Z
		"/>
	`;
	return iconSvg;
}

function getSettingsIconSvg() {
	const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	iconSvg.classList.add("folder-svg-icon");
	iconSvg.setAttribute("viewBox", "0 0 24 24");
	iconSvg.innerHTML = `
		<path d="
			M13.3535 8.75H4C3.58579 8.75 3.25 8.41421 3.25 8C3.25 7.58579 3.58579
			7.25 4 7.25H13.3535C13.68 6.09575 14.7412 5.25 16 5.25C17.2588 5.25
			18.32 6.09575 18.6465 7.25H20C20.4142 7.25 20.75 7.58579 20.75 8C20.75
			8.41421 20.4142 8.75 20 8.75H18.6465C18.32 9.90425 17.2588 10.75 16
			10.75C14.7412 10.75 13.68 9.90425 13.3535 8.75ZM14.75 8C14.75 7.30964
			15.3096 6.75 16 6.75C16.6904 6.75 17.25 7.30964 17.25 8C17.25 8.69036
			16.6904 9.25 16 9.25C15.3096 9.25 14.75 8.69036 14.75 8Z
		" fill="#000000" fill-rule="evenodd" clip-rule="evenodd"
		/>
		<path d="
			M10.6465 16.75H20C20.4142 16.75 20.75 16.4142 20.75 16C20.75
			15.5858 20.4142 15.25 20 15.25H10.6465C10.32 14.0957 9.25878 13.25
			8 13.25C6.74122 13.25 5.67998 14.0957 5.35352 15.25H4C3.58579 15.25 3.25
			15.5858 3.25 16C3.25 16.4142 3.58579 16.75 4 16.75H5.35352C5.67998 17.9043
			6.74122 18.75 8 18.75C9.25878 18.75 10.32 17.9043 10.6465 16.75ZM6.75 16C6.75
			15.3096 7.30964 14.75 8 14.75C8.69036 14.75 9.25 15.3096 9.25 16C9.25 16.6904
			8.69036 17.25 8 17.25C7.30964 17.25 6.75 16.6904 6.75 16Z
		" fill="#000000" clip-rule="evenodd" fill-rule="evenodd"/>
	`;
	return iconSvg;
}

function getPersonalIconSvg() {
	const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	iconSvg.classList.add("folder-svg-icon");
	iconSvg.setAttribute("viewBox", "0 0 516 516");
	iconSvg.innerHTML = `
		<path d="
			M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48ZM205.78,164.82
			C218.45,151.39,236.28,144,256,144s37.39,7.44,50.11,20.94
			C319,178.62,325.27,197,323.79,216.76,320.83,256,290.43,288,256,288s-64.89-32-67.79-71.25
			C186.74,196.83,193,178.39,205.78,164.82ZM256,432a175.49,175.49,0,0,1-126-53.22,122.91,122.91,0,0,1,35.14-33.44
			C190.63,329,222.89,320,256,320s65.37,9,90.83,25.34A122.87,122.87,0,0,1,382,378.78,175.45,175.45,0,0,1,256,432Z
		"/>
	`;
	return iconSvg;
}

function getChatsIconSvg() {
	const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	iconSvg.classList.add("folder-svg-icon");
	iconSvg.setAttribute("viewBox", "-10 -25 120 120");
	iconSvg.innerHTML = `
		<path d="M80.145,38.58c0-15.485-17.977-28.083-40.072-28.083C17.976,10.497,0,23.095,0,38.58c0,8.789,5.646,16.851,15.52,22.209 c-1.65,6.028-4.281,13.786-7.717,17.933C7.573,79,7.532,79.389,7.701,79.709c0.155,0.294,0.46,0.478,0.79,0.478 c0.027,0,0.055-0.002,0.082-0.004c0.75-0.068,18.359-1.805,29.629-13.552c0.62,0.019,1.243,0.031,1.87,0.031 C62.168,66.662,80.145,54.065,80.145,38.58z"/>
		<path d="M98.34,46.237c0-10.3-7.955-19.314-19.781-24.202c4.424,5.02,7.002,10.981,7.002,17.378 c0,17.781-19.846,32.25-44.239,32.25c-0.014,0-0.03,0-0.044,0c5.162,1.699,10.919,2.656,16.99,2.656 c0.627,0,1.25-0.012,1.87-0.032c11.271,11.75,28.88,13.483,29.63,13.552c0.026,0.003,0.053,0.004,0.082,0.004 c0.329,0,0.635-0.182,0.789-0.476c0.17-0.321,0.129-0.71-0.102-0.986c-3.436-4.147-6.066-11.903-7.717-17.935 C92.693,63.09,98.34,55.026,98.34,46.237z"/>
	`;
	return iconSvg;
}


function handlePopups() {
	window.addEventListener("click", ({ target }) => {
		const popupButton = target.closest(".custom-popup");
		const clickedOnClosedPopup = popupButton && !popupButton.classList.contains("show");
		if (clickedOnClosedPopup) popupButton.classList.toggle("show");
		[...document.getElementsByClassName("custom-popup")].forEach((p) => {
			if (popupButton != p) p.classList.remove("show");
		});
	});
}


function exportSettingsHandler() {
  const exportSettingsLink = document.getElementById("export-settings-link");
  exportSettingsLink.addEventListener("click", function (e) {
    e.preventDefault();
    const settings = {
      foldersSettings: getLocalStorageChatFolders(),
      themeSettings: getLocalStorageThemeSettings(),
    };
    const link = document.createElement("a");
    link.href = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(settings))}`;
    link.download = "settings.json";
    link.click();
  });
}


function importSettingsHandler() {
  const importSettingsForm = document.getElementById("import-settings-form");
  importSettingsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const files = document.getElementById("selectFiles").files;
    if (files.length <= 0) {
      alert("Choose settings file to upload.");
      return false;
    }
    // read file.
    const fr = new FileReader();
    fr.onload = function (e) {
      let settings;
      try {
        settings = JSON.parse(e.target.result);
        if (settings["foldersSettings"] === undefined) throw new Error("Incorrect settings file.");
        if (settings["themeSettings"] === undefined) throw new Error("Incorrect settings file.");
      } catch (err) {
        alert("Incorrect settings file.");
        return false;
      }
      // save new settings.
      setLocalStorageThemeSettings(settings["themeSettings"]);
      for (let [folderName, chatsList] of Object.entries(settings["foldersSettings"])) {
        setLocalStorageChatFolder(folderName);
        for (chatName of chatsList) {
          addChatToLocalStorageChatFolder(folderName, chatName);
        }
      }
      // reload window.
      location.reload();
    };
    fr.readAsText(files.item(0));
  });
}


function changeFolder(folderName) {
	// scroll main section on top to listen events
	const mainFolderArea = document.querySelector("div[style*='box-sizing']");
	mainFolderArea.style.paddingTop = "0px";
	mainFolderArea.parentNode.parentNode.scrollTop = 0;

	// toggle folder icon selection
	const allFolderIcons = document.querySelectorAll("div[folder-label]");
	const folderIcon = document.querySelector(`div[folder-label="${folderName}"]`);
	allFolderIcons.forEach((element) => {
		element.classList.remove("folder-selected");
	});
	folderIcon.classList.add("folder-selected");

	const allFolderAreas = document.querySelectorAll("div[folder-label-area]");
	const selectedFolderArea = document.querySelector(`div[folder-label-area="${folderName}"]`);
	allFolderAreas.forEach((element) => {
		element.style.display = "none";
	});
	selectedFolderArea.style.display = "block";
}


function handleChangeFolderEvent(e) {
	const folderLabel = e.target.closest("div[folder-label]").getAttribute("folder-label");
	changeFolder(folderLabel);
}


async function parseNavbarItems(navbarItemsContainer) {
	const navbarItemsContainerParent = navbarItemsContainer.parentNode;
	// expand container to get all elements (lazy react dom)
	navbarItemsContainerParent.style.height = "1000%";
	// waiting DOM.
	await delay(1000);

	let navBarAllItems = document.querySelectorAll("nav.rcx-sidebar div[data-index]:has(a.rcx-sidebar-item)");
	let navBarAllSectionItems = document.querySelectorAll("nav.rcx-sidebar div[data-index]:has(.rcx-sidebar-section)");

	let totalSidebarHeight = 0;
	navBarAllItems.forEach((element) => {
		let elemHeight = element.getAttribute("data-known-size");
		totalSidebarHeight += parseInt(elemHeight);
	});
	navBarAllSectionItems.forEach((element) => {
		let elemHeight = element.getAttribute("data-known-size");
		totalSidebarHeight += parseInt(elemHeight);
	});

	// set container size back.
	// TODO: tmp not resetting size.
	// navbarItemsContainerParent.style.height = totalSidebarHeight + "px";

	return navBarAllItems;
}


function setupFolderButton(foldersContainer, folderName) {
	if (folderName == settingsLabel) return setupThemeSettingsButton(foldersContainer);;

	const folderDiv = document.createElement("div");
	const folderNameP = document.createElement("p");
	folderNameP.innerHTML = folderName;
	const folderUnreadedChatsCounter = document.createElement("span");
	folderUnreadedChatsCounter.className = "unread-chats-counter";

	let iconSvg;
	switch (folderName) {
		case allChatsLabel:
			iconSvg = getChatsIconSvg();
			break;
		case personalChatsLabel:
			iconSvg = getPersonalIconSvg();
			break;
		default:
			iconSvg = getFolderIconSvg();
	}
	folderDiv.appendChild(iconSvg);

	folderDiv.classList.add("sidebar-folder");
	if (folderName == allChatsLabel) {
		folderDiv.classList.add("folder-selected");
		folderDiv.classList.add("general-folder");
	}
	folderDiv.setAttribute("folder-label", folderName);
	folderDiv.appendChild(folderNameP);
	folderDiv.addEventListener("click", handleChangeFolderEvent);
	folderDiv.appendChild(folderUnreadedChatsCounter);

	const mainFolderButton = document.querySelector(`div.sidebar-folder[folder-label="${allChatsLabel}"]`);
	const personalChatsFolderButton = document.querySelector(`div.sidebar-folder[folder-label="${personalChatsLabel}"]`);
	if (personalChatsFolderButton) {
		personalChatsFolderButton.before(folderDiv);
	} else if (mainFolderButton) {
		mainFolderButton.before(folderDiv);
  } else {
		foldersContainer.append(folderDiv);
  }
}


function setupThemeSettingsButton(foldersContainer) {
	const settingsDiv = document.createElement("div");
	const settingsNameP = document.createElement("p");
	settingsNameP.innerHTML = settingsLabel;

	const iconSvg = getSettingsIconSvg();
	settingsDiv.appendChild(iconSvg);

	settingsDiv.classList.add("sidebar-folder");
	settingsDiv.setAttribute("folder-label", settingsLabel);
	settingsDiv.appendChild(settingsNameP);
	settingsDiv.addEventListener("click", handleChangeFolderEvent);

	foldersContainer.append(settingsDiv);
}


function chatsUnreadStatusDataDivSetup() {
	let chatsUnreadStatusDataDiv = document.createElement("div");
	chatsUnreadStatusDataDiv.className = "chats-unread-status-data";
	chatsUnreadStatusDataDiv.style.display = "none";
	document.body.appendChild(chatsUnreadStatusDataDiv);

	let observer = new MutationObserver(function (mutations) {
		if (generalFolderUnreadChats) {
			let unreadChats = Object.values(generalFolderUnreadChats).filter((v) => v === true).length;

			// set counter
			let folderBadge = document.querySelector(`div[folder-label="${allChatsLabel}"] span.unread-chats-counter`);
			if (unreadChats == 0) {
				folderBadge.style.display = "none";
			} else {
				folderBadge.style.display = "flex";
				folderBadge.innerHTML = unreadChats;
			}
		}
	});
	observer.observe(chatsUnreadStatusDataDiv, { attributes: true, childList: true, characterData: true, subtree: true });
}


function setupAllChatsFolderArea() {
	const defaultChatsContainer = document.querySelector('nav.rcx-sidebar div[aria-label][role="navigation"]');
	const defaultFolderArea = defaultChatsContainer.querySelector('div:has( [tabindex="0"])');
	defaultFolderArea.setAttribute("folder-label-area", allChatsLabel);
}


function setupFolderArea(folderName, items) {
	if (folderName == allChatsLabel) return setupAllChatsFolderArea();
	if (folderName == settingsLabel) return setupThemeSettingsArea();

	const folderItemsContainer = document.createElement("div");
	folderItemsContainer.classList.add("sidebar-folder-container");
	folderItemsContainer.setAttribute("folder-label-area", folderName);

	let html = "";
	for (let item of items) {
		item = formatExtendedNavbarItems(item);
		html += item.outerHTML;
		// folderItemsContainer.appendChild(item);
	}
	folderItemsContainer.innerHTML = html;

	// add folder manage buttons.
	if (!(folderName == personalChatsLabel)) {
		let manageFolderDiv = setupFolderManageButtons();
		folderItemsContainer.prepend(manageFolderDiv);
	}

	const defaultChatsContainer = document.querySelector('nav.rcx-sidebar div[aria-label][role="navigation"]');
	defaultChatsContainer.append(folderItemsContainer);
}


function setupThemeSettingsArea() {
	const settingsContainer = document.createElement("div");
	settingsContainer.style.display = "none";
	settingsContainer.classList.add("sidebar-folder-container");
	settingsContainer.setAttribute("folder-label-area", settingsLabel);

	const themeSettings = getLocalStorageThemeSettings();
	updateThemeSettingsHtml(themeSettings);
	const checked = (param, value) => { return themeSettings[param] == value ? 'checked="checked"' : "" }
	const getThemeParam = (param, defaultValue) => { return themeSettings[param] ? themeSettings[param] : defaultValue }

	let addFolderFormHtml = `
		<form class="add-folder-form" id="add-folder-form" autocomplete="off">
			<h2>Add new folder</h2>
			<div>
				<input placeholder="Folder name" name="folder-name" class="add-folder-input" id="add-folder-input">
			</div>
			<div>
				<input type="submit" value="Add folder" class="${buttonDarkClassName} ${buttonClassName} add-folder-button">
			</div>
		</form>
	`;

	let settingsFormHtml = `
		<form id="form-theme-settings">
			<h2>Theme settings</h2>
			<fieldset>
				<legend>Theme style</legend>
				<div>
					<label for="theme-rocketchat" class="big-radio">
						<input type="radio" id="theme-rocketchat" name="theme" value="rocketchat" ${checked("theme", "rocketchat")} />
						RocketChat
					</label>
				</div>
				<div>
					<label for="theme-flat" class="big-radio">
						<input type="radio" id="theme-flat" name="theme" value="flat" ${checked("theme", "flat")} />
						Flat
					</label>
				</div>
				<div>
					<label for="theme-telegram" class="big-radio">
						<input type="radio" id="theme-telegram" name="theme" value="telegram" ${checked("theme", "telegram")} />
						Telegram
					</label>
				</div>
			</fieldset>

			<fieldset>
				<legend>Background's</legend>
				<div>
					<input type="radio" id="bg-1" name="bg" value="bg-1" ${checked("bg", "bg-1")}/>
					<label for="bg-1">Background 1</label>
				</div>
				<div>
					<input type="radio" id="bg-2" name="bg" value="bg-2" ${checked("bg", "bg-2")} disabled />
					<label for="bg-2">Background 2</label>
				</div>
				<div>
					<input type="radio" id="bg-3" name="bg" value="bg-3" ${checked("bg", "bg-3")} disabled />
					<label for="bg-3">Background 3</label>
				</div>
			</fieldset>

			<fieldset>
				<legend>Background palette (light)</legend>
				<div>
					<input type="radio" id="palette-light-1" name="palette-light" value="palette-green" ${checked("palette-light", "palette-green")}/>
					<label for="palette-light-1">Palette green</label>
				</div>
				<div>
					<input type="radio" id="palette-light-2" name="palette-light" value="palette-blue" ${checked("palette-light", "palette-blue")}/>
					<label for="palette-light-2">Palette blue</label>
				</div>
				<div>
					<input type="radio" id="palette-light-3" name="palette-light" value="palette-azure" ${checked("palette-light", "palette-azure")}/>
					<label for="palette-light-3">Palette azure</label>
				</div>
				<div>
					<input type="radio" id="palette-light-4" name="palette-light" value="palette-orange" ${checked("palette-light", "palette-orange")}/>
					<label for="palette-light-4">Palette orange</label>
				</div>
			</fieldset>

			<fieldset>
				<legend>Background palette (dark)</legend>
				<div>
					<input type="radio" id="palette-dark-1" name="palette-dark" value="palette-dark" ${checked("palette-dark", "palette-dark")}/>
					<label for="palette-dark-1">Palette dark</label>
				</div>
				<div>
					<input type="radio" id="palette-dark-2" name="palette-dark" value="palette-darker" ${checked("palette-dark", "palette-darker")}/>
					<label for="palette-dark-2">Palette darker</label>
				</div>
			</fieldset>

      <fieldset>
        <legend>Sidebar avatars size</legend>
        <div style="justify-content: center;">
          <label for="extended-avatars-size">
            extended
            <input
              style="width: 100%;"
              type="range"
              min="30"
              max="65"
              value="${getThemeParam('extended-avatars-size', 45)}"
              name="extended-avatars-size"
              id="extended-avatars-size"
            >
          </label>
          <label for="regular-avatars-size">
            regular
            <input
              style="width: 100%;"
              type="range"
              min="20"
              max="45"
              value="${getThemeParam('regular-avatars-size', 32)}"
              name="regular-avatars-size"
              id="regular-avatars-size"
            >
          </label>
          <label for="compact-avatars-size">
            compact
            <input
              style="width: 100%;"
              type="range"
              min="20"
              max="30"
              value="${getThemeParam('compact-avatars-size', 20)}"
              name="compact-avatars-size"
              id="compact-avatars-size"
            >
          </label>
        </div>
      </fieldset>
		</form>
	`;

  let exportImportSettingsFormHtml = `
  	<form id="import-settings-form">
  		<h2>Export settings</h2>
  		<a href="#" id="export-settings-link" class="${buttonClassName} ${buttonDarkClassName}">Export settings file</a>
      <br>
  		<h2>Import settings</h2>
      <input type="file" id="selectFiles" value="Import" />
      <button id="import" class="${buttonClassName} ${buttonDarkClassName}">Import settings file</button>
  	</form>
  `;

	settingsContainer.innerHTML += addFolderFormHtml;
	settingsContainer.innerHTML += settingsFormHtml;
	settingsContainer.innerHTML += exportImportSettingsFormHtml;

	const defaultChatsContainer = document.querySelector('nav.rcx-sidebar div[aria-label][role="navigation"]');
	defaultChatsContainer.append(settingsContainer);

  exportSettingsHandler();
  importSettingsHandler();

	// ----------- Settings form handler -----------
	const settingsForm = document.querySelector("#form-theme-settings");
	settingsForm.addEventListener("change", (e) => {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(settingsForm).entries());
    console.debug(" --- settings form data --- ");
    console.debug(data);
		setLocalStorageThemeSettings(data);
		updateThemeSettingsHtml(data);
	});
	// ----------- /Settings form handler -----------

	// ----------- Add folder form handler -----------
	const foldersContainer = document.querySelector("div.sidebar-folders");
	const addFolderForm = document.querySelector("#add-folder-form");
	addFolderForm.addEventListener("submit", (e) => {
		e.preventDefault();
		let addFolderInput = document.getElementById("add-folder-input");
		let newFolderName = addFolderInput.value ? addFolderInput.value : null;
		if (newFolderName) {
			let success = setLocalStorageChatFolder(addFolderInput.value);
			if (!success) {
				// reserved names can not be created as folders.
				addFolderInput.value == "";
				addFolderForm.reset();
				return;
			}
			setupFolderButton(foldersContainer, addFolderInput.value);
			setupFolderArea(addFolderInput.value, []);
			addFolderInput.value == "";
			addFolderForm.reset();
		}
	});
	// ----------- /Add folder form handler -----------
}


/*
---------------------- FOLDER MANAGE BUTTONS ----------------------
*/
function removeFolder(folderName) {
	removeLocalStorageChatFolder(folderName);
	let folderButton = document.querySelector(`div.sidebar-folder[folder-label="${folderName}"]`);
	let folderContainer = document.querySelector(`div.sidebar-folder-container[folder-label-area="${folderName}"]`);
	folderButton.remove();
	folderContainer.remove();
}

function addChatToFolder(FolderName, chatName) {
	let success = addChatToLocalStorageChatFolder(FolderName, chatName);
	if (success) {
		let folderDiv = document.querySelector(`div.sidebar-folder-container[folder-label-area="${FolderName}"]`);
		let mainFolderDiv = document.querySelector(`div[folder-label-area="${allChatsLabel}"]`);
		let chatElem = mainFolderDiv.querySelector(`div[data-index]:has(a[aria-label="${chatName}"])`);
		folderDiv.append(chatElem.cloneNode(true));
		// folderDiv.innerHTML += chatElem.outerHTML;
	}
}

function removeChatFromFolder(FolderName, chatName) {
	let success = removeChatFromLocalStorageChatFolder(FolderName, chatName);
	if (success) {
		let folderDiv = document.querySelector(`div.sidebar-folder-container[folder-label-area="${FolderName}"]`);
		let chatElem = folderDiv.querySelector(`div[data-index] a[aria-label="${chatName}"]`);
		chatElem ? chatElem.remove() : null;
	}
}

function setupFolderManageButtons() {
	const manageFolderDiv = document.createElement("div");
	manageFolderDiv.className = "manage-folder-buttons ";
	const addCurrentChatButton = document.createElement("button");
	const deleteCurrentChatButton = document.createElement("button");
	const deleteCurrentFolderButton = document.createElement("button");
	addCurrentChatButton.id = "add-chat";
	// addCurrentChatButton.innerHTML = "Add current chat";
	addCurrentChatButton.innerHTML = "+";
	addCurrentChatButton.label = "+";
	deleteCurrentChatButton.id = "delete-chat";
	// deleteCurrentChatButton.innerHTML = "Remove current chat";
	deleteCurrentChatButton.innerHTML = "-";
	deleteCurrentChatButton.label = "-";
	deleteCurrentFolderButton.id = "delete-folder";
	// deleteCurrentFolderButton.innerHTML = "Remove folder";
	deleteCurrentFolderButton.innerHTML = "x";
	deleteCurrentFolderButton.label = "x";
	[addCurrentChatButton, deleteCurrentChatButton, deleteCurrentFolderButton].forEach((button) => {
		button.className = "rcx-box rcx-box--full rcx-button--small rcx-button--primary rcx-button";
		manageFolderDiv.append(button);
		button.addEventListener("click", (e) => {
			let action = e.target.id;
			let currentFolder = e.target.closest(".sidebar-folder-container");
			let currentFolderName = currentFolder ? currentFolder.getAttribute("folder-label-area") : null;
			let currentChat = document.querySelector("header h1");
			let currentChatName = currentChat ? currentChat.textContent : null;
			switch (action) {
				case "add-chat":
					addChatToFolder(currentFolderName, currentChatName);
					break;
				case "delete-chat":
					removeChatFromFolder(currentFolderName, currentChatName);
					break;
				case "delete-folder":
					removeFolder(currentFolderName);
					changeFolder(allChatsLabel);
					break;
			}
		});
	});

	return manageFolderDiv;
}
/*
---------------------- /FOLDER MANAGE BUTTONS ----------------------
*/


async function setupChatsLoader() {
	// setup chats loader (on chats switch).
	const loaderDiv = document.createElement("div");
	loaderDiv.className = "chat-area-loader";
	loaderDiv.innerHTML = "<div class='chat-loader'></div>";
	await delay(1000);
	const mainContainer = document.querySelector("main.rcx-box--full");
	if (mainContainer) {
		mainContainer.before(loaderDiv);
	}
}


function formatExtendedNavbarItems(item) {
	// sidebar: messages formatting (extended view)
	if (!item) return item;

	let isHighlighted = item.querySelectorAll(".rcx-sidebar-item--highlighted");
	let isChat = item.querySelector("[aria-label]");
	if (isChat) {
		let chatLabel = item.querySelector("[aria-label]").getAttribute("aria-label");
		if (isHighlighted.length) {
			generalFolderUnreadChats[chatLabel] = true;
		} else {
			generalFolderUnreadChats[chatLabel] = false;
		}
		let chatsUnreadStatusDataDiv = document.querySelector(".chats-unread-status-data");
		if (chatsUnreadStatusDataDiv) {
			chatsUnreadStatusDataDiv.innerHTML = JSON.stringify(generalFolderUnreadChats);
		}
	}

	let messageSpan = item.querySelector("span.message-body--unstyled");
	if (!messageSpan || messageSpan.querySelector(".message-author")) {
		// !messageSpan - no message (not extended view).
		// messageSpan.querySelector(".message-author") - already formatted.
		return item;
	}

	let author = messageSpan.innerHTML.split(":", 1);
	if (author.length) {
		author = author[0];
		let message = messageSpan.innerHTML.slice(author.length + 1);
		if (message.length) {
			messageSpan.innerHTML = `<span class="message-author">${author}:</span> <span class="message-body-text">${message}</span>`;
		} else {
			messageSpan.innerHTML = `<span class="message-author">${author}</span>`;
		};
	};

	return item;
}


function formatStickerMessages() {
	let notFormattedStickerMessages = document.querySelectorAll(".rcx-message:not(.is-sticker-message)");
	notFormattedStickerMessages.forEach(message => {
    let messageContainer = message.querySelector(".rcx-message-container:not(.rcx-message-container--left)");
		if (!messageContainer) return;
		let messageBody = messageContainer.querySelector(".rcx-message-body");
		if (!messageBody) return;
		let messageEmoji = messageBody.querySelectorAll(".rcx-message__emoji");
		if (!messageEmoji) return;
		let isSequential = Array.from(message.classList).includes("rcx-message--sequential");
		let withReactions = !!messageContainer.querySelector(".rcx-message-reactions__container") ? 1 : 0;
		let withThread = !!messageContainer.querySelector(".rcx-message-metrics__content-item") ? 1 : 0;
		let withMessageReadReceipt = !!messageContainer.querySelector("i.rcx-icon--name-check") ? 1 : 0;
		let withCustomElements = !!messageContainer.querySelector(".new-header-container") ? 1 : 0;

		const childElementByCondition = {
			// if withMessageReadReceipt -> messageContainer has different child elements count (+1)
			// if withThread -> messageContainer has different child elements count (+1)
			// if withReactions -> messageContainer has different child elements count (+1)
			cond_1: 1 + withReactions + withThread + withMessageReadReceipt + withCustomElements,
			cond_2: 2 + withReactions + withThread + withMessageReadReceipt + withCustomElements,
			cond_3: 2 + withReactions + withThread + withMessageReadReceipt + withCustomElements,
			cond_4: 3 + withReactions + withThread + withMessageReadReceipt + withCustomElements,
		};
		if (
			(
				// in sequential
				isSequential && messageContainer.childElementCount === childElementByCondition["cond_1"]
				// in sequential with reactions
				|| isSequential && withReactions && messageContainer.childElementCount === childElementByCondition["cond_2"]

				// in NOT sequential
				|| !isSequential && messageContainer.childElementCount === childElementByCondition["cond_3"]
				// in NOT sequential with reactions
				|| !isSequential && withReactions && messageContainer.childElementCount === childElementByCondition["cond_4"]
			)
			&& messageBody.childElementCount === 1
			&& messageEmoji.length === 1
		) {
			let messageText = messageBody.innerText;
			let emojiText = messageEmoji[0].innerText;
			let isOnlyEmoji = messageText.replace(emojiText, "");
			if (!isOnlyEmoji.length) message.classList.add("is-sticker-message");
		}
	});
}


function handleChatLoader() {
	let loaderDiv = document.querySelector(".chat-area-loader");
	if (!loaderDiv) return;
	let mainContainerCurrent = document.querySelector("main.rcx-box--full");
	if (mainContainerCurrent) {
		let roomIsLoaded = mainContainerCurrent.getAttribute("data-qa-rc-room");
		let pageNotFound = mainContainerCurrent.querySelector(":has( .rcx-states)");
		let blankHomePage = mainContainerCurrent.getAttribute("data-qa");
		let homePage = document.querySelector('section[data-qa="page-home"]');
		if (roomIsLoaded) {
			if (!loaderTimeout)
				loaderTimeout = setTimeout(() => {
					// wait for load (hide ugly skeleton)
					// TODO: watch DOM instead of timeout
					loaderDiv.style.display = "none";
					loaderTimeout = null;
				}, 1000);
		} else if (blankHomePage || homePage || pageNotFound) {
      loaderDiv.style.display = "none";
    } else {
      loaderDiv.style.display = "block";
    }
	}
}


function formatMessageRoleBadges(message) {
  // move roles from header to avatar container
  let is_formatted = false;
  let rolesContainer = message.querySelector(".rcx-box.rcx-box--full.rcx-message-header__roles");
  if (rolesContainer) {
    let avatarBlock = message.querySelector(".rcx-message-container--left")
    if (avatarBlock) {
      let newRolesContainer = rolesContainer.cloneNode(true);
      newRolesContainer.classList.add("new-roles-container");
      if (avatarBlock.querySelector(".new-roles-container") === null) {
        avatarBlock.append(newRolesContainer);
      }
      is_formatted = true;
    }
  }
	return is_formatted;
}


function formatOwnMessageHeader(message) {
  // move header to bottom in own-messages
  let is_formatted = false;
  let isOwnMessage = message.getAttribute("data-own") == "true";
  if (isOwnMessage) {
    let header = message.querySelector(".rcx-message-header");
    let messageContainer = message.querySelector(".rcx-message-container:nth-child(2):not(.rcx-message-container--left)");
    // messageContainer.append(header);
    let newHeader = header.cloneNode(true);
    newHeader.classList.add("new-header-container");
    if (messageContainer.querySelector(".new-header-container") === null) {
      messageContainer.append(newHeader);
    }
    is_formatted = true;
  }
	return is_formatted;
}


function formatPollMessage(message) {
  // format polls.
  let is_formatted = false;
  let isPollMessage = message.querySelector(".rcx-message-container--left:has(img[src*='poll.bot'])") !== null;
  if (isPollMessage) {

    let potensionalVotesInfoBlocks = message.querySelectorAll(".rcx-box.rcx-box--full > span");
    potensionalVotesInfoBlocks.forEach(elem => {
      let innerText = elem.innerText;
      let isVotesInfoBlock = innerText.indexOf("vote -") !== -1 || innerText.indexOf("votes -") !== -1;
      if (isVotesInfoBlock) {
        elem.parentNode.classList.add("poll-votes-info-block");
        elem.parentNode.style.setProperty("display", "none", "important");
      }
    })

    let toggleVotesInfoElem = document.createElement("a");
    toggleVotesInfoElem.innerHTML = "<span class='poll-show-votes-info-button'>show votes</span>";
    toggleVotesInfoElem.addEventListener('click', (e) => {
      e.preventDefault();
      let votesInfoBlocks = e.target.parentNode.parentNode.querySelectorAll(".poll-votes-info-block");
      votesInfoBlocks.forEach(elem => {
        let value = elem.style.display === "none" ? "flex" : "none";
        elem.style.setProperty("display", value, "important");
      })
    })

    let pollBlock = message.querySelector(".rcx-message-block--width-fixed");
    pollBlock.parentNode.append(toggleVotesInfoElem);

    is_formatted = true;

  }
	return is_formatted;
}


function formatMessages() {
	// reformat messages.
	let messages = document.querySelectorAll(".rcx-message[data-id]:not(.rcx-message--sequential):not(.is-formatted-message):not(.is-processed-message)");
	messages.forEach(message => {
		// move roles from header to avatar container
		let is_formatted_badges = formatMessageRoleBadges(message);

		// move header to bottom in own-messages
		let is_formatted_header = formatOwnMessageHeader(message);

		// format polls.
		// let is_formatted_poll = formatPollMessage(message);  // TODO.

		let result = [
			is_formatted_badges,
			is_formatted_header,
			// is_formatted_poll,  // TODO.
		]
		message.classList.add("is-processed-message");
		if (result.some(elem => !!elem)) message.classList.add("is-formatted-message");
  })
}


function loaderAndMessagesHandler() {
	let bodyObserver = new MutationObserver(function (mutations) {
		formatStickerMessages();
		formatMessages();
		handleChatLoader();
	});
	bodyObserver.observe(document.body, { attributes: true, childList: true, characterData: true, subtree: true });
}


async function setupNavbar(navbarItemsContainer) {
	const sidebarWidth = getComputedStyle(root).getPropertyValue("--sidebar-width");
	const sidebarWidthMd = getComputedStyle(root).getPropertyValue("--sidebar-md-width");
	const sidebarWidthLg = getComputedStyle(root).getPropertyValue("--sidebar-lg-width");
	const sidebarFoldersWidth = getComputedStyle(root).getPropertyValue("--sidebar-folders-width");
	const sidebarAdditionalWidth = 0;  // TODO
	const sidebarAdditionalWidthMd = 35;  // TODO
	const sidebarAdditionalWidthLg = 115;  // TODO

	// set sidebar width
	const newSidebarWidth = `calc(calc(${sidebarWidth} + ${sidebarFoldersWidth}) + ${sidebarAdditionalWidth}px)`;
	const newSidebarWidthMd = `calc(calc(${sidebarWidthMd} + ${sidebarFoldersWidth}) + ${sidebarAdditionalWidthMd}px)`;
	const newSidebarWidthLg = `calc(calc(${sidebarWidthLg} + ${sidebarFoldersWidth}) + ${sidebarAdditionalWidthLg}px)`;
	root.style.setProperty("--sidebar-width", newSidebarWidth);
	root.style.setProperty("--sidebar-md-width", newSidebarWidthMd);
	root.style.setProperty("--sidebar-lg-width", newSidebarWidthLg);

	// setup folders sidebar container
	const chatsContainer = document.querySelector('nav.rcx-sidebar div[aria-label][role="navigation"]');
	const foldersIsReady = chatsContainer.querySelector(".sidebar-folders");
	if (foldersIsReady) return;

	const foldersContainer = document.createElement("div");
	foldersContainer.classList.add("sidebar-folders");
	chatsContainer.prepend(foldersContainer);

	// setup items
	const personalChats = [];
	const navbarItems = await parseNavbarItems(navbarItemsContainer);

  if (Object.keys(chatFolders).length === 0) {
    /* initial start - no chatFolders exists yet. */
		for (let item of navbarItems) {
      // prepare personal chats
      let elemHref = item.firstChild.getAttribute("href");
      if (elemHref.indexOf("direct/") !== -1 && personalChats.indexOf(item) === -1) {
        personalChats.push(item);
      }
    }
  }

	for (let [folderName, itemLabels] of Object.entries(chatFolders)) {
		preparedFolders[folderName] = [];
		for (let item of navbarItems) {
			// prepare folders chats
			let elemAriaLabel = item.firstChild.getAttribute("aria-label");
			if (itemLabels.includes(elemAriaLabel)) {
				preparedFolders[folderName].push(item.cloneNode(true));
			}
			// prepare personal chats
			let elemHref = item.firstChild.getAttribute("href");
			if (elemHref.indexOf("direct/") !== -1 && personalChats.indexOf(item) === -1) {
				personalChats.push(item);
			}
		}
	}

	// setup folders.
	for (let [folderName, items] of Object.entries(preparedFolders)) {
		setupFolderButton(foldersContainer, folderName);
		setupFolderArea(folderName, items);
	}

	// setup "all" folder.
	setupFolderButton(foldersContainer, allChatsLabel);
	setupFolderArea(allChatsLabel, null);
	navbarItems.forEach((element) => { formatExtendedNavbarItems(element) });

	// setup "personal" folder.
	setupFolderButton(foldersContainer, personalChatsLabel);
	setupFolderArea(personalChatsLabel, personalChats);

	// setup "Settings" folder & area.
	setupFolderButton(foldersContainer, settingsLabel);
	setupFolderArea(settingsLabel, null);
}


function countFolderUnreadChatsAndReorder(folderContainer, isGeneralFolder) {
	if (isGeneralFolder) return;  // TODO: temp

	let folderUnreadedChats = 0;
	let prevChatHasNoNewMessages;
	let manageButtons = folderContainer.querySelector("div.manage-folder-buttons");
	let folderChatsLinks = folderContainer.querySelectorAll("a[aria-label]");

	folderChatsLinks.forEach(chatLink => {
		/* `.rcx-sidebar-item--highlighted` jumping from element to element in different chat views (compact/regular/extended) */
		let isUnreadChat = chatLink.querySelectorAll(".rcx-sidebar-item--highlighted");
		if (isUnreadChat.length) {
			// count for badges
			folderUnreadedChats += 1;
			if (prevChatHasNoNewMessages === true) {
				/* prev elem has no unread messages - reorder.
						[chat: prev]  <-- no new messages
						[chat: current *unread messages*]  <-- move this chat on top
				*/
				let chat = chatLink.closest("div[data-index]")
				if (manageButtons) {
					manageButtons.after(chat);
				} else {
					folderContainer.prepend(chat);
				}
			}
			prevChatHasNoNewMessages = false;
		} else {
			prevChatHasNoNewMessages = true;
		}
	});

	// set counter
	let folderName = isGeneralFolder ? allChatsLabel : folderContainer.getAttribute("folder-label-area");
	let folderBadge = document.querySelector(`div[folder-label="${folderName}"] span.unread-chats-counter`);




  // FIXME
  if (!folderBadge) return;





	if (folderUnreadedChats == 0) {
		folderBadge.style.display = "none";
	} else {
		folderBadge.style.display = "flex";
		folderBadge.innerHTML = folderUnreadedChats;
	}

	return folderUnreadedChats;
}

function countFolderUnreadedChatsInitial(navbarItemsContainer) {
	const foldersUnreadedChatsCount = {};
	Object.keys(chatFolders).forEach((folderName) => {
		foldersUnreadedChatsCount[folderName] = 0;
	});
	foldersUnreadedChatsCount[allChatsLabel] = 0;

	let allChats = navbarItemsContainer.querySelectorAll("a[aria-label]");
	allChats.forEach(element => {
		/* `.rcx-sidebar-item--highlighted` jumping from element to element in different chat views (compact/regular/extended) */
		let isUnreadedChat = element.querySelectorAll(".rcx-sidebar-item--highlighted");
		if (isUnreadedChat.length) {
			foldersUnreadedChatsCount[allChatsLabel] += 1;
			let label = element.getAttribute("aria-label");
			for (let [folderName, itemLabels] of Object.entries(chatFolders)) {
				if (itemLabels.includes(label)) {
					foldersUnreadedChatsCount[folderName] += 1;
				}
			}
		}
	});

	for (let [folderName, unreadedChatsCount] of Object.entries(foldersUnreadedChatsCount)) {
		let folderBadge = document.querySelector(`div.sidebar-folder[folder-label="${folderName}"] span.unread-chats-counter`);
		if (unreadedChatsCount == 0) {
			folderBadge.style.display = "none";
		} else {
			folderBadge.style.display = "flex";
			folderBadge.innerHTML = unreadedChatsCount;
		}
	}
}


function syncNavbarItemsToFoldes(mutation) {
  // get navbar chat elem
	let sourceElem = mutation.target.closest("div[data-index]");
	if (!sourceElem && (mutation.type == "childList" && mutation.addedNodes.length > 0)) {
    // mutation on inner elements -> take closest parent
		sourceElem = mutation.addedNodes[0].closest("div[data-index]");
	}
  // formatting messages in navbar chats
	formatExtendedNavbarItems(sourceElem);
  // copy chats into folders
	if (sourceElem) {
		let sourceElementLink = sourceElem.querySelector("a[aria-label]");
		let sourceElementAriaLabel = sourceElementLink ? sourceElementLink.getAttribute("aria-label") : null;  // not str!
		let allFoldersItems = document.querySelectorAll("div.sidebar-folder-container div[data-index]");
		allFoldersItems.forEach(folderItem => {
      // iterate over all folders items (chats) and compare them with sourceElem
			let folderItemLink = folderItem.querySelector("a[aria-label]");
			let folderItemAriaLabel = folderItemLink ? folderItemLink.getAttribute("aria-label") : "null";  // str!
			if (folderItemAriaLabel === sourceElementAriaLabel) {
        // sourceElem same as folderElem -> replace folderItem with sourceElem
				folderItem.innerHTML = sourceElem.innerHTML;
			}
		});
	};
}


function startObserveDefaultNavbarItems(navbarItemsContainer) {
	let observer = new MutationObserver(function (mutations) {
		// console.log("observer.takeRecords() - ", observer.takeRecords());
		// countFolderUnreadedChatsInitial(navbarItemsContainer); // FIXME: observe на каждую папку отдельно
		mutations.forEach(function (mutation) {
      // no changes on children
      if (mutation.type == "childList" && mutation.addedNodes.length == 0 && mutation.removedNodes.length == 0) return;
      // no target or target not DOM Element
      if (!mutation.target || !isElement(mutation.target)) return;
      // syncing chats into folders
			syncNavbarItemsToFoldes(mutation);
		});
	});
	observer.observe(navbarItemsContainer, { attributes: true, childList: true, characterData: true, subtree: true });
}


function startObserveFolderItems(folderItemsContainer, isGeneralFolder) {
	let observer = new MutationObserver(function (mutations) {
		countFolderUnreadChatsAndReorder(folderItemsContainer, isGeneralFolder);
	});
	observer.observe(folderItemsContainer, { attributes: true, attributeOldValue: true, childList: true, characterData: true, characterDataOldValue: true, subtree: true });
}


function matchPalette(paletteElem) {
  const darkPaletteLengthMin = 6000;  // new
  // const darkPaletteLength = 200;  // old
	if (paletteElem && paletteElem.innerHTML.length > darkPaletteLengthMin) {
    // dark theme
    root.classList.add("dark-theme");
  } else {
    // light theme
    root.classList.remove("dark-theme");
  }
}


function startObserveMainPalette() {
	const paletteElem = document.querySelector("style#main-palette");
	matchPalette(paletteElem);
	let observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			matchPalette(paletteElem);
		});
	});
	observer.observe(paletteElem, { characterData: true, subtree: true });
}


async function start() {
	let onLoadInterval = setInterval(getSideBarElems, 500);

	async function getSideBarElems() {
		let navbar = document.querySelector("nav.rcx-sidebar");
		if (navbar) {
			let defaultNavbarItemsContainer = navbar.querySelector("div[style*='box-sizing']");
			let defaultNavBarItems = navbar.querySelectorAll("div[data-index]:has(a.rcx-sidebar-item)");
			if (defaultNavBarItems.length != 0 && defaultNavbarItemsContainer) {
				// reactDOM loaded
				clearInterval(onLoadInterval);

				chatsUnreadStatusDataDivSetup();
				await setupNavbar(defaultNavbarItemsContainer);
				await setupChatsLoader();
				loaderAndMessagesHandler();
				startObserveDefaultNavbarItems(defaultNavbarItemsContainer);
				countFolderUnreadedChatsInitial(defaultNavbarItemsContainer);
				startObserveMainPalette();
				handlePopups();

				let allFolderContainers = document.querySelectorAll("div.sidebar-folder-container");
				allFolderContainers.forEach((folderItemsContainer) => {
					startObserveFolderItems(folderItemsContainer, false);
				});
				startObserveFolderItems(defaultNavbarItemsContainer, true);




				// await setupOneClickStickers();
        // startObserveMainElement();




			}
		}
	}

	// TODO: refactoring.
	let pushState = history.pushState;
	history.pushState = function () {
		pushState.apply(history, arguments);
		handleChatLoader();
	}

}
