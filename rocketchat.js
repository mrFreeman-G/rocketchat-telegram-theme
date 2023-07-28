window.addEventListener("DOMContentLoaded", start);


const root = document.documentElement;
const folders = {
	"HR_DEV": [
		"HR Tech Bots",
		"HR-Tech: Leads",
		"HR-Tech: Releases",
		"HR-Tech: Dev",
		"HR-Tech: Core",
		"HR-Tech: Backend",
		"HR-Tech: Развитие и целеполагание",
	],
	"HR_etc": [
		"HR-Tech: Интеграции",
		"HR-Tech: Руководитель",
		"HR-Tech: Сотрудник",
		"HR-Tech: Моделирование ШР",
		"HR-Tech: Support",
		"HR-Tech: News",
		"HR-Tech: Offtopic",
		"HR-Tech: 1C",
		"HR-Tech",
	],
	"DEVOPS": [
		"Platform_RE",
		"Platform_Kafka",
		"Platform_Monitoring",
		"Platform",
		"Platform_News",
		"Platform_Infra",
		"New_Kafka_HRD",
		"Postgres",
		"10D-DevOps-channel",
	],
	"Samolet": [
		"community-python",
	],
	"test": [
		"10D-DevOps-channel",
	],
};
const preparedFolders = {};
const generalFolderUnreadedChats = {};
const chatFolders = getLocalStorageChatFolders();


function getLocalStorageChatFolders() {
	let chatFolders = JSON.parse(localStorage.getItem("chatFolders"));
	// chatFolders = null;
	if (!chatFolders) {
		chatFolders = {};
		// chatFolders = folders;
		localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
	}
	return chatFolders;
}

function setLocalStorageChatFolder(folderName) {
	let chatFolders = getLocalStorageChatFolders();
	chatFolders[folderName] = [];
	localStorage.setItem("chatFolders", JSON.stringify(chatFolders));
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


function handlePopups() {
	window.addEventListener("click", ({ target }) => {
		const popup = target.closest(".custom-popup");
		const clickedOnClosedPopup = popup && !popup.classList.contains("show");
		if (clickedOnClosedPopup) popup.classList.toggle("show");
		[...document.getElementsByClassName("custom-popup")].forEach((p) => {
			if (popup != p) p.classList.remove("show");
		});
	});
}


function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}


function getIconSvg() {
	const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const iconPath = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	iconSvg.classList.add("folder-svg-icon");
	iconSvg.setAttribute("width", "100px");
	iconSvg.setAttribute("height", "100px");
	iconSvg.setAttribute("fill", "currentColor");
	iconSvg.setAttribute("viewBox", "0 0 24 24");
	iconPath.setAttribute(
		"d",
		"M3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17Z"
	);
	// iconPath.setAttribute("stroke", "#000000");
	iconPath.setAttribute("stroke", "none");
	iconPath.setAttribute("stroke-linecap", "round");
	iconPath.setAttribute("stroke-linejoin", "round");
	iconSvg.appendChild(iconPath);
	return iconSvg;
}


function changeFolder(folderName) {
	const mainFolderArea = document.querySelector("div[folder-label-area='all']");
	mainFolderArea.style.paddingTop = "0px";
	mainFolderArea.parentNode.parentNode.scrollTop = 0;

	const allFolderIcons = document.querySelectorAll("div[folder-label]");
	const folderIcon = document.querySelector(
		`div[folder-label="${folderName}"]`
	);
	allFolderIcons.forEach((element) => {
		element.classList.remove("folder-selected");
	});
	folderIcon.classList.add("folder-selected");

	const allFolderAreas = document.querySelectorAll("div[folder-label-area]");
	const folderArea = document.querySelector(
		`div[folder-label-area="${folderName}"]`
	);
	allFolderAreas.forEach((element) => {
		element.style.display = "none";
	});
	folderArea.style.display = "block";
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

	let navBarAllItems = document.querySelectorAll(
		"nav.rcx-sidebar div[data-index]:has(a.rcx-sidebar-item)"
	);
	let navBarAllSectionItems = document.querySelectorAll(
		"nav.rcx-sidebar div[data-index]:has(.rcx-sidebar-section)"
	);

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
	navbarItemsContainerParent.style.height = totalSidebarHeight + "px";

	return navBarAllItems;
}


function setupFolder(foldersContainer, folderName) {
	const folderDiv = document.createElement("div");
	const folderNameP = document.createElement("p");
	const folderUnreadedChatsCounter = document.createElement("span");
	folderUnreadedChatsCounter.className = "unreaded-chats-counter";

	const iconSvg = getIconSvg();
	folderDiv.appendChild(iconSvg);

	folderNameP.innerHTML = folderName;
	folderDiv.classList.add("sidebar-folder");
	if (folderName == "all") folderDiv.classList.add("folder-selected");
	folderDiv.setAttribute("folder-label", folderName);
	folderDiv.appendChild(folderNameP);
	folderDiv.addEventListener("click", handleChangeFolderEvent);
	folderDiv.appendChild(folderUnreadedChatsCounter);

	const mainFolderButton = document.querySelector(`div.sidebar-folder[folder-label="all"]`);
	if (mainFolderButton) {
		mainFolderButton.before(folderDiv);
	} else {
		foldersContainer.append(folderDiv);
	}
}


function setupAddFolderButton(navbarItemsContainer, foldersContainer) {
	const folderDiv = document.createElement("div");
	const folderNameP = document.createElement("p");

	// POPUP
	const popupDiv = document.createElement("div");
	popupDiv.classList.add("popup-window");

	let form = document.createElement("form");
	form.className = "add-folder-form";
	form.id = "add-folder-form";
	form.autocomplete = "off";

	let textInput = document.createElement("input");
	textInput.placeholder = "Folder name";
	textInput.name = "folder-name";
	textInput.className = "add-folder-input";
	textInput.id = "add-folder-input";
	form.appendChild(textInput);

	let submitButton = document.createElement("input");
	submitButton.value = "Add folder";
	submitButton.type = "submit";
	submitButton.className = "rcx-box rcx-box--full rcx-box--animated rcx-button--small rcx-button--primary rcx-button add-folder-button";
	form.appendChild(submitButton);

	popupDiv.append(form);
	folderDiv.append(popupDiv);

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		let addFolderInput = document.getElementById("add-folder-input");
		let newFolderName = addFolderInput.value ? addFolderInput.value : null;
		if (newFolderName) {
			setupFolder(foldersContainer, addFolderInput.value);
			setupFolderArea(navbarItemsContainer, addFolderInput.value, []);
			setLocalStorageChatFolder(addFolderInput.value);
			addFolderInput.value == "";
			form.reset();
			folderDiv.classList.remove("show");
		}
	});
	// /POPUP

	// const iconSvg = getIconSvg();
	// folderDiv.appendChild(iconSvg);

	folderNameP.innerHTML = "+";
	folderDiv.classList.add("sidebar-folder");
	folderDiv.classList.add("sidebar-folder--add-folder");
	folderDiv.classList.add("custom-popup");
	folderDiv.appendChild(folderNameP);
	foldersContainer.append(folderDiv);
}


/*
	MANAGE FOLDER BUTTONS
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
		let mainFolderDiv = document.querySelector(`div[folder-label-area="all"]`);
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

function setupManageFolderButtons() {
	const manageFolderDiv = document.createElement("div");
	manageFolderDiv.className = "manage-folder-buttons ";
	const addCurrentChatButton = document.createElement("button");
	const deleteCurrentChatButton = document.createElement("button");
	const deleteCurrentFolderButton = document.createElement("button");
	addCurrentChatButton.id = "add-chat";
	// addCurrentChatButton.innerHTML = "Add current chat";
	addCurrentChatButton.innerHTML = "+";
	deleteCurrentChatButton.id = "delete-chat";
	// deleteCurrentChatButton.innerHTML = "Remove current chat";
	deleteCurrentChatButton.innerHTML = "-";
	deleteCurrentFolderButton.id = "delete-folder";
	// deleteCurrentFolderButton.innerHTML = "Remove folder";
	deleteCurrentFolderButton.innerHTML = "x";
	[addCurrentChatButton, deleteCurrentChatButton, deleteCurrentFolderButton].forEach((button) => {
		button.className = "rcx-box rcx-box--full rcx-box--animated rcx-button--small rcx-button--primary rcx-button";
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
					changeFolder("all");
					break;
			}
		});
	});

	return manageFolderDiv;
}
/*
	/MANAGE FOLDER BUTTONS
*/


function setupFolderArea(navbarItemsContainer, folderName, items) {
	const navbarItemsContainerParent = navbarItemsContainer.parentNode;
	const folderItemsContainer = document.createElement("div");
	folderItemsContainer.classList.add("sidebar-folder-container");
	folderItemsContainer.setAttribute("folder-label-area", folderName);

	html = "";
	for (let item of items) {
		item = formatExtendedNavbarItems(item);
		html += item.outerHTML;
		// folderItemsContainer.appendChild(item);
	}
	folderItemsContainer.innerHTML = html;

	let manageFolderDiv = setupManageFolderButtons();
	folderItemsContainer.prepend(manageFolderDiv);

	navbarItemsContainerParent.append(folderItemsContainer);
}





















// TODO: refactoring

let chatsUnreadStatusDataDiv = document.createElement("div");
chatsUnreadStatusDataDiv.className = "chats-unread-status-data";
chatsUnreadStatusDataDiv.style.display = "none";
document.body.appendChild(chatsUnreadStatusDataDiv);

let observer = new MutationObserver(function (mutations) {
	let chatsUnreadStatusData = generalFolderUnreadedChats;
	// let chatsUnreadStatusData = getLocalStorageChatsUnreadStatus();
	if (chatsUnreadStatusData) {
		let unreadChats = Object.values(chatsUnreadStatusData).filter((v) => v === true).length;

		// set counter
		let folderName = "all";
		let folderBadge = document.querySelector(`div[folder-label="${folderName}"] span.unreaded-chats-counter`);
		if (unreadChats == 0) {
			folderBadge.style.display = "none";
		} else {
			folderBadge.style.display = "flex";
			folderBadge.innerHTML = unreadChats;
		}

	}
});
observer.observe(chatsUnreadStatusDataDiv, { attributes: true, childList: true, characterData: true, subtree: true });






























function formatExtendedNavbarItems(item) {
	// sidebar: messages formatting (extended view)
	if (!item) {
		return item;
	}

	let isHighlighted = item.querySelectorAll(".rcx-sidebar-item--highlighted");
	let isChat = item.querySelector("[aria-label]");
	if (isChat) {
		let chatLabel = item.querySelector("[aria-label]").getAttribute("aria-label");
		if (isHighlighted.length) {
			generalFolderUnreadedChats[chatLabel] = true;
		} else {
			generalFolderUnreadedChats[chatLabel] = false;
		}
		chatsUnreadStatusDataDiv.innerHTML = JSON.stringify(generalFolderUnreadedChats);
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
			message = message;
			messageSpan.innerHTML = `<span class="message-author">${author}:</span> <span class="message-body-text">${message}</span>`;
		} else {
			messageSpan.innerHTML = `<span class="message-author">${author}</span> `;
		};
	};

	return item;
}


async function setupNavbar(navbarItemsContainer) {
	navbarItemsContainer.setAttribute("folder-label-area", "all");

	const sidebarWidth = getComputedStyle(root).getPropertyValue("--sidebar-width");
	const sidebarFoldersWidth = getComputedStyle(root).getPropertyValue("--sidebar-folders-width");

	// set sidebar width
	const newSidebarWidth = `calc(${sidebarWidth} + ${sidebarFoldersWidth})`;
	if (sidebarWidth != newSidebarWidth) {
		root.style.setProperty("--sidebar-width", newSidebarWidth);
	}

	// setup folders sidebar container
	const channelsContainer = document.querySelector('nav.rcx-sidebar div[aria-label][role="region"]');
	// const channelsContainer = document.querySelector("nav.rcx-sidebar div[aria-label='Каналы']");
	const foldersContainer = document.createElement("div");
	foldersContainer.classList.add("sidebar-folders");
	channelsContainer.prepend(foldersContainer);

	// setup items
	const navbarItems = await parseNavbarItems(navbarItemsContainer);
	for (let [folderName, itemLabels] of Object.entries(chatFolders)) {
		preparedFolders[folderName] = [];
		for (let item of navbarItems) {
			let elemDataAttr = item.firstChild.getAttribute("aria-label");
			if (itemLabels.includes(elemDataAttr)) {
				preparedFolders[folderName].push(item.cloneNode(true));
				// preparedFolders[folderName].push(item);
			}
		}
	}

	// setup folders.
	for (let [folderName, items] of Object.entries(preparedFolders)) {
		setupFolder(foldersContainer, folderName);
		setupFolderArea(navbarItemsContainer, folderName, items);
	}
	// setup "all" folder.
	setupFolder(foldersContainer, "all");
	navbarItems.forEach((element) => { formatExtendedNavbarItems(element) });
	setupAddFolderButton(navbarItemsContainer, foldersContainer);





	// setup chats loader (on chats switch).
	const mainContainer = document.querySelector("main.rcx-box--full");
	const loaderDiv = document.createElement("div");
	loaderDiv.className = "chat-area-loader";
	loaderDiv.innerHTML = "<div class='chat-loader'></div>";
  mainContainer.before(loaderDiv);

	let timeout;
	let loaderObserver = new MutationObserver(function (mutations) {



		let mainContainerCurrent = document.querySelector("main.rcx-box--full");
		if (mainContainerCurrent) {
			let roomIsLoaded = mainContainerCurrent.getAttribute("data-qa-rc-room");
			if (roomIsLoaded) {
				if (!timeout)
					timeout = setTimeout(() => {
						// wait for load (hide ugly skeleton)
						// TODO: watch DOM instead of timeout
						loaderDiv.style.display = "none";
						timeout = null;
					}, 1000);
			} else {
				loaderDiv.style.display = "block";
			}
		}




		let notFormattedStickerMessages = document.querySelectorAll(".rcx-message:not(.is-sticker-message)");
		notFormattedStickerMessages.forEach(message => {
			let isSequential = Array.from(message.classList).includes("rcx-message--sequential");
			let messageBodyContainer = message.querySelector(".rcx-message-container:not(.rcx-message-container--left)");
			if (!messageBodyContainer) return;
			let messageBody = messageBodyContainer.querySelector(".rcx-message-body");
			if (!messageBody) return;
			let messageEmoji = messageBody.querySelectorAll(".rcx-message__emoji");
			if (!messageEmoji) return;
			let withReactions = messageBodyContainer.querySelector(".rcx-message-reactions__container");
			if (
				(
					// при последовательных всего 2 блока
					isSequential && messageBodyContainer.childElementCount === 2
					// при последовательных с реакциями всего 3 блока
					|| isSequential && withReactions && messageBodyContainer.childElementCount === 3
					// при НЕ последовательных всего 3 блока
					|| !isSequential && messageBodyContainer.childElementCount === 3
					// при НЕ последовательных с реакциями всего 4 блока
					|| !isSequential&& withReactions && messageBodyContainer.childElementCount === 4
				)
				&& messageBody.childElementCount === 1
				&& messageEmoji.length === 1
			) {

				let messageText = messageBody.innerText;
				let emojiText = messageEmoji[0].innerText;
				let isOnlyEmoji = messageText.replace(emojiText, "");
				if (!isOnlyEmoji.length) message.classList.add("is-sticker-message");
				// if (!isOnlyEmoji.length) messageBodyContainer.firstChild.remove();
			}
		});




	});
	loaderObserver.observe(document.body, { attributes: true, childList: true, characterData: true, subtree: true });


}


function countFolderUnreadedChats(folderContainer, isGeneralFolder) {
	if (isGeneralFolder) return;  // TODO: temp

	let folderUnreadedChats = 0;
	let allChats = folderContainer.querySelectorAll("a[aria-label]");
	allChats.forEach(element => {
		/*
			`.rcx-sidebar-item--highlighted` jumping from element to element
			in different chat views (compact/regular/extended)
		 */
		let isUnreadedChat = element.querySelectorAll(".rcx-sidebar-item--highlighted");
		if (isUnreadedChat.length) folderUnreadedChats += 1;
	});

	// set counter
	let folderName = isGeneralFolder ? "all" : folderContainer.getAttribute("folder-label-area");
	let folderBadge = document.querySelector(`div[folder-label="${folderName}"] span.unreaded-chats-counter`);
	if (folderUnreadedChats == 0) {
		folderBadge.style.display = "none";
	} else {
		folderBadge.style.display = "flex";
		folderBadge.innerHTML = folderUnreadedChats;
	}

	return folderUnreadedChats;
}

function countFolderUnreadedChatsInitial(navbarItemsContainer) {
	const foldersUnreadedChatsCount = { "all": 0 };
	Object.keys(chatFolders).forEach((folderName) => {
		foldersUnreadedChatsCount[folderName] = 0;
	});

	let allChats = navbarItemsContainer.querySelectorAll("a[aria-label]");
	allChats.forEach(element => {
		/*
			`.rcx-sidebar-item--highlighted` jumping from element to element
			in different chat views (compact/regular/extended)
		 */
		let isUnreadedChat = element.querySelectorAll(".rcx-sidebar-item--highlighted");
		if (isUnreadedChat.length) {
			foldersUnreadedChatsCount["all"] += 1;
			let label = element.getAttribute("aria-label");
			for (let [folderName, itemLabels] of Object.entries(chatFolders)) {
				if (itemLabels.includes(label)) {
					foldersUnreadedChatsCount[folderName] += 1;
				}
			}
		}
	});

	for (let [folderName, unreadedChatsCount] of Object.entries(foldersUnreadedChatsCount)) {
		let folderBadge = document.querySelector(`div.sidebar-folder[folder-label="${folderName}"] span.unreaded-chats-counter`);
		if (unreadedChatsCount == 0) {
			folderBadge.style.display = "none";
		} else {
			folderBadge.style.display = "flex";
			folderBadge.innerHTML = unreadedChatsCount;
		}
	}

}


function syncNavbarItemsToFoldes(mutation) {
	if (!mutation.target) return;
	let sourceElem = mutation.target.closest("div[data-index]");
	if (!sourceElem && (mutation.type == "childList" && mutation.addedNodes.length > 0)) {
		sourceElem = mutation.addedNodes[0].closest("div[data-index]");
	}
	formatExtendedNavbarItems(sourceElem);
	if (sourceElem) {
		let sourceElementAnchor = sourceElem.querySelector("a[aria-label]");
		let sourceElementAriaLabel = sourceElementAnchor ? sourceElementAnchor.getAttribute("aria-label") : null;
		let folderElems = document.querySelectorAll("div.sidebar-folder-container div[data-index]");
		folderElems.forEach(element => {
			let elementAnchor = element.querySelector("a[aria-label]");
			let elementAriaLabel = elementAnchor ? elementAnchor.getAttribute("aria-label") : "null";
			if (elementAriaLabel === sourceElementAriaLabel) {
				element.innerHTML = sourceElem.innerHTML;
			}
		});
	};
}


function startObserveNavbarItems(navbarItemsContainer) {
	// console.log(`navbarItemsContainer - `, navbarItemsContainer);
	let observer = new MutationObserver(function (mutations) {
		// console.log("observer.takeRecords() - ", observer.takeRecords());
		// countFolderUnreadedChatsInitial(navbarItemsContainer); // FIXME: observe на каждую папку отдельно!
		mutations.forEach(function (mutation) {
			syncNavbarItemsToFoldes(mutation);
		});
	});
	observer.observe(navbarItemsContainer, { attributes: true, childList: true, characterData: true, subtree: true });
}


function startObserveFolderItems(folderItemsContainer, isGeneralFolder) {
	let observer = new MutationObserver(function (mutations) {
		countFolderUnreadedChats(folderItemsContainer, isGeneralFolder);
	});
	observer.observe(folderItemsContainer, { attributes: true, childList: true, characterData: true, subtree: true });
}


function matchPallete(paletteElem) {
	let bgGradientMainLight = getComputedStyle(root).getPropertyValue("--bg-gradient-light");
	let bgGradientMainDark = getComputedStyle(root).getPropertyValue("--bg-gradient-dark");

	let bgGradientThreadLight = getComputedStyle(root).getPropertyValue("--bg-gradient-thread-light");
	let bgGradientThreadDark = getComputedStyle(root).getPropertyValue("--bg-gradient-thread-dark");

	let metricsBgColorLight = getComputedStyle(root).getPropertyValue("--metrics-bg-color-light");
	let metricsBgColorDark = getComputedStyle(root).getPropertyValue("--metrics-bg-color-dark");

	let messageBgColorMineLight = getComputedStyle(root).getPropertyValue("--message-bg-color-mine-light");
	let messageBgColorMineDark = getComputedStyle(root).getPropertyValue("--message-bg-color-mine-dark");

	let messageBgColorThreadMineLight = getComputedStyle(root).getPropertyValue("--message-bg-color-thread-mine-light");
	let messageBgColorThreadMineDark = getComputedStyle(root).getPropertyValue("--message-bg-color-thread-mine-dark");

	let reactionMineBgColorLight = getComputedStyle(root).getPropertyValue("--reaction-mine-bg-color-light");
	let reactionMineBgColorDark = getComputedStyle(root).getPropertyValue("--reaction-mine-bg-color-dark");

	let mentionBgColorLight = getComputedStyle(root).getPropertyValue("--mention-bg-color-light");
	let mentionBgColorDark = getComputedStyle(root).getPropertyValue("--mention-bg-color-dark");

	let mentionMeBgColorLight = getComputedStyle(root).getPropertyValue("--mention-me-bg-color-light");
	let mentionMeBgColorDark = getComputedStyle(root).getPropertyValue("--mention-me-bg-color-dark");

	let mentionFontColorLight = getComputedStyle(root).getPropertyValue("--mention-color-light");
	let mentionFontColorDark = getComputedStyle(root).getPropertyValue("--mention-color-dark");

	let mentionMeFontColorLight = getComputedStyle(root).getPropertyValue("--mention-me-color-light");
	let mentionMeFontColorDark = getComputedStyle(root).getPropertyValue("--mention-me-color-dark");

	let quoteBgColorLight = getComputedStyle(root).getPropertyValue("--quote-bg-color-light");
	let quoteBgColorDark = getComputedStyle(root).getPropertyValue("--quote-bg-color-dark");

	let quoteBgColorMineLight = getComputedStyle(root).getPropertyValue("--quote-bg-color-mine-light");
	let quoteBgColorMineDark = getComputedStyle(root).getPropertyValue("--quote-bg-color-mine-dark");

	let quoteBorderColorLight = getComputedStyle(root).getPropertyValue("--quote-border-color-light");
	let quoteBorderColorDark = getComputedStyle(root).getPropertyValue("--quote-border-color-dark");

	let buttonBgColorLight = getComputedStyle(root).getPropertyValue("--button-bg-color-light");
	let buttonBgColorDark = getComputedStyle(root).getPropertyValue("--button-bg-color-dark");

	let linkColorLight = getComputedStyle(root).getPropertyValue("--link-color-light");
	let linkColorDark = getComputedStyle(root).getPropertyValue("--link-color-dark");

	let announcementBgColorLight = getComputedStyle(root).getPropertyValue("--announcement-bg-color-light");
	let announcementBgColorDark = getComputedStyle(root).getPropertyValue("--announcement-bg-color-dark");

	let charHighlightedColorLight = getComputedStyle(root).getPropertyValue("--chat-box-shadow-highlighted-color-light");
	let charHighlightedColorDark = getComputedStyle(root).getPropertyValue("--chat-box-shadow-highlighted-color-dark");

	let messagesFontColorLight = getComputedStyle(root).getPropertyValue("--messages-font-color-light");
	let messagesFontColorDark = getComputedStyle(root).getPropertyValue("--messages-font-color-dark");

	if (paletteElem && paletteElem.innerHTML.length > 200) {
		// dark theme
		root.style.setProperty("--bg-gradient-main", bgGradientMainDark);
		root.style.setProperty("--bg-gradient-thread-main", bgGradientThreadDark);
		root.style.setProperty("--metrics-bg-color-main", metricsBgColorDark);
		root.style.setProperty("--message-bg-color-mine-main", messageBgColorMineDark);
		root.style.setProperty("--message-bg-color-thread-mine-main", messageBgColorThreadMineDark);
		root.style.setProperty("--reaction-mine-bg-color-main", reactionMineBgColorDark);
		root.style.setProperty("--mention-bg-color-main", mentionBgColorDark);
		root.style.setProperty("--mention-me-bg-color-main", mentionMeBgColorDark);
		root.style.setProperty("--mention-color-main", mentionFontColorDark);
		root.style.setProperty("--mention-me-color-main", mentionMeFontColorDark);
		root.style.setProperty("--quote-bg-color-main", quoteBgColorDark);
		root.style.setProperty("--quote-bg-color-mine-main", quoteBgColorMineDark);
		root.style.setProperty("--quote-border-color-main", quoteBorderColorDark);
		root.style.setProperty("--button-bg-color-main", buttonBgColorDark);
		root.style.setProperty("--link-color-main", linkColorDark);
		root.style.setProperty("--announcement-bg-color-main", announcementBgColorDark);
		root.style.setProperty("--chat-box-shadow-highlighted-color-main", charHighlightedColorDark);
		root.style.setProperty("--messages-font-color-main", messagesFontColorDark);
	} else {
		// light theme
		root.style.setProperty("--bg-gradient-main", bgGradientMainLight);
		root.style.setProperty("--bg-gradient-thread-main", bgGradientThreadLight);
		root.style.setProperty("--metrics-bg-color-main", metricsBgColorLight);
		root.style.setProperty("--message-bg-color-mine-main", messageBgColorMineLight);
		root.style.setProperty("--message-bg-color-thread-mine-main", messageBgColorThreadMineLight);
		root.style.setProperty("--reaction-mine-bg-color-main", reactionMineBgColorLight);
		root.style.setProperty("--mention-bg-color-main", mentionBgColorLight);
		root.style.setProperty("--mention-me-bg-color-main", mentionMeBgColorLight);
		root.style.setProperty("--mention-color-main", mentionFontColorLight);
		root.style.setProperty("--mention-me-color-main", mentionMeFontColorLight);
		root.style.setProperty("--quote-bg-color-main", quoteBgColorLight);
		root.style.setProperty("--quote-bg-color-mine-main", quoteBgColorMineLight);
		root.style.setProperty("--quote-border-color-main", quoteBorderColorLight);
		root.style.setProperty("--button-bg-color-main", buttonBgColorLight);
		root.style.setProperty("--link-color-main", linkColorLight);
		root.style.setProperty("--announcement-bg-color-main", announcementBgColorLight);
		root.style.setProperty("--chat-box-shadow-highlighted-color-main", charHighlightedColorLight);
		root.style.setProperty("--messages-font-color-main", messagesFontColorLight);
	}
}


function startObserveMainPalette() {
	const paletteElem = document.querySelector("style#main-palette");
	matchPallete(paletteElem);
	let observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			matchPallete(paletteElem);
		});
	});
	observer.observe(paletteElem, { characterData: true, subtree: true });
}


async function start() {
	let onLoadInterval = setInterval(getSideBarElems, 500);

	async function getSideBarElems() {
		let navbar = document.querySelector("nav.rcx-sidebar");
		if (navbar) {
			let navbarItemsContainer = navbar.querySelector("div[style*='box-sizing']");
			let navBarItems = navbar.querySelectorAll("div[data-index]:has(a.rcx-sidebar-item)");
			if (navBarItems.length != 0 && navbarItemsContainer) {
				// reactDOM loaded
				clearInterval(onLoadInterval);

				await setupNavbar(navbarItemsContainer);
				startObserveNavbarItems(navbarItemsContainer);
				countFolderUnreadedChatsInitial(navbarItemsContainer);
				startObserveMainPalette();
				handlePopups();
				let folders = document.querySelectorAll("div.sidebar-folder-container");
				folders.forEach((folderItemsContainer) => {
					startObserveFolderItems(folderItemsContainer, false);
				});
				startObserveFolderItems(navbarItemsContainer, true);
			}
		}
	}

}
