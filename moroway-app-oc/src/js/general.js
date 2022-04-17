//NOTIFICATIONS
function notify(elem, message, prio, timeout, actionHandler, actionText, minHeight, channel) {
    var settings = getSettings(false);
    var notificationContainer = document.querySelector(elem);
    if (notificationContainer == undefined || notificationContainer == null) {
        return false;
    }
    if (prio == undefined || prio == null) {
        prio = NOTIFICATION_PRIO_DEFAULT;
    }
    if (channel == undefined || channel == null) {
        channel = NOTIFICATION_CHANNEL_DEFAULT;
    }
    if (notificationContainer.queue == undefined) {
        notificationContainer.queue = [];
    }
    if (notificationContainer.active == undefined) {
        notificationContainer.active = false;
    }
    if (notificationContainer.show == undefined) {
        notificationContainer.show = function (elem) {
            elem.active = true;
            elem.style.visibility = "";
            elem.querySelector("button").style.display = "none";
            if (elem.queue.length > 0) {
                var obj = elem.queue[0];
                elem.querySelector("span").textContent = obj.message;
                elem.style.visibility = "visible";
                if (obj.actionHandler != null && obj.actionText != null) {
                    elem.querySelector("button").textContent = obj.actionText;
                    elem.querySelector("button").onclick = obj.actionHandler;
                    elem.querySelector("button").style.display = "";
                }
                elem.queue.shift();
                elem.showTimeoutFunction = function () {
                    elem.show(elem);
                    elem.showTimeoutFunction = null;
                };
                elem.showTimeout = window.setTimeout(elem.showTimeoutFunction, obj.timeout);
            } else {
                elem.active = false;
            }
        };
    }
    if (notificationContainer.hide == undefined) {
        notificationContainer.hide = function (elem, stopFollowing) {
            stopFollowing = stopFollowing === true;
            elem.active = false;
            elem.style.visibility = "";
            if (elem.showTimeout !== undefined && elem.showTimeout !== null) {
                window.clearTimeout(elem.showTimeout);
            }
            if (typeof elem.showTimeoutFunction == "function" && !stopFollowing) {
                elem.showTimeoutFunction();
            }
        };
    }
    if (notificationContainer.sameChannelNo == undefined) {
        notificationContainer.sameChannelNo = function (elem, ch, pr) {
            for (var i = elem.queue.length - 1; i >= 0; i--) {
                if (elem.queue[i].channel == ch && elem.queue[i].prio <= pr) {
                    return i;
                }
            }
            return false;
        };
    }
    if (prio > NOTIFICATION_PRIO_LOW || (notificationContainer.queue.length == 0 && !notificationContainer.active)) {
        var obj = {message: message, timeout: timeout, prio: prio, channel: channel, actionHandler: actionHandler, actionText: actionText};
        if (prio === NOTIFICATION_PRIO_HIGH || (minHeight >= notificationContainer.offsetHeight - 15 && settings.showNotifications)) {
            var chNo = notificationContainer.sameChannelNo(notificationContainer, channel, prio);
            if (channel != NOTIFICATION_CHANNEL_DEFAULT && chNo !== false) {
                notificationContainer.queue[chNo] = obj;
            } else {
                notificationContainer.queue.push(obj);
            }
            if (!notificationContainer.active) {
                notificationContainer.show(notificationContainer);
            }
        } else if (APP_DATA.debug) {
            console.log(message);
        }
    }
}

//COPY & PASTE
function copy(selector) {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(document.querySelector(selector));
    selection.addRange(range);
    if (document.execCommand("copy")) {
        return true;
    } else if (typeof navigator.permissions == "object") {
        navigator.permissions
            .query({name: "clipboard-write"})
            .then(function (status) {
                if (status.state == "granted") {
                    var text = document.querySelector(selector).textContent;
                    navigator.clipboard.writeText(text).then(
                        function () {
                            return true;
                        },
                        function () {
                            return false;
                        }
                    );
                } else {
                    return false;
                }
            })
            .catch(function (error) {
                return false;
            });
    }
    return false;
}

//HANDLE OBJECTS
function copyJSObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

//HANDLE QUERY String
function getQueryString(key) {
    var value = "";
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (part) {
            if (part.indexOf("=") > 0 && part.substr(0, part.indexOf("=")) == key) {
                value = part.substr(part.indexOf("=") + 1);
            }
        });
    return value;
}

//HANDLE LINKS
function getShareLink(id, key) {
    return formatJSString("https://app.moroway.de/{{0}}/{{1}}", id, key);
}
function getShareLinkServerName() {
    return "https://app.moroway.de/";
}
function getServerLink(protocol) {
    return (protocol == undefined ? PROTOCOL_HTTP : protocol) + "://herrmann-engel.de/projekte/moroway/moroway-app/server";
}
function getServerRedirectLink(key) {
    const SERVER_REDIRECT_LINK = getServerLink() + "/redirect_to/index.php";
    return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
function getServerHTMLLink(key, showCloseButton) {
    const SERVER_HTML_LINK = getServerLink() + "/html_content/index.php";
    if (showCloseButton === undefined) {
        showCloseButton = "";
    }
    return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=" + showCloseButton;
}
function getServerDataLink(path) {
    const SERVER_DATA_LINK = getServerLink() + "/data";
    return SERVER_DATA_LINK + path;
}
function handleServerJSONValues(key, func) {
    const SERVER_JSON_LINK = getServerLink() + "/json_content/index.php";
    if (typeof fetch == "function") {
        fetch(SERVER_JSON_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                if (APP_DATA.debug) {
                    console.log("Fetch-Error:", error);
                }
            })
            .then(function (response) {
                if (typeof response == "object" && response != null && typeof response.error == "undefined") {
                    func(response);
                } else if (APP_DATA.debug) {
                    console.log(typeof response != "undefined" && response != null && typeof response.error != "undefined" ? "ERROR: " + response.error : "ERROR: Can't handle request!");
                }
            });
    } else if (APP_DATA.debug) {
        console.log("Fetch-Error: fetch not supported");
    }
}
function getServerNote(func) {
    function getServerNoteImage(id, background) {
        return getServerDataLink("/server-note/img/") + id + (background ? "-background-image" : "-image") + ".png";
    }
    if (typeof window.localStorage != "undefined" && (window.localStorage.getItem("morowayAppLastServerNoteLastQuery") == null || Date.now() - parseInt(window.localStorage.getItem("morowayAppLastServerNoteLastQuery"), 10) >= 86400000 || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == 1)) {
        window.localStorage.setItem("morowayAppLastServerNoteLastQuery", Date.now());
        handleServerJSONValues("news-msg", function (serverMsg) {
            if (typeof serverMsg == "object" && serverMsg.id != undefined && typeof serverMsg.id == "number" && serverMsg.title != undefined && typeof serverMsg.title == "string" && serverMsg.text != undefined && typeof serverMsg.text == "string" && serverMsg.validUntil != undefined && typeof serverMsg.validUntil == "number" && Date.now() / 1000 <= serverMsg.validUntil && (window.localStorage.getItem("morowayAppLastServerNoteShown") != serverMsg.id || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == 1)) {
                window.localStorage.setItem("morowayAppLastServerNoteShown", serverMsg.id);
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", 0);
                if (serverMsg.image != undefined && serverMsg.image === true) {
                    serverMsg.imageSrc = getServerNoteImage(serverMsg.id, false);
                    delete serverMsg.image;
                }
                if (serverMsg.backgroundImage != undefined && serverMsg.backgroundImage === true) {
                    serverMsg.backgroundImageSrc = getServerNoteImage(serverMsg.id, true);
                    delete serverMsg.backgroundImage;
                }
                func(serverMsg);
            }
        });
    }
}
function showServerNote() {
    if (document.querySelector("#server-note") != null) {
        getServerNote(function (serverMsg) {
            document.querySelector("#server-note").style.display = "block";
            document.querySelector("#server-note-title").textContent = serverMsg.title;
            document.querySelector("#server-note-text").textContent = serverMsg.text;
            document.querySelector("#server-note #server-note-later-box").checked = false;
            document.querySelector("#server-note #server-note-later").addEventListener("click", function () {
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", document.querySelector("#server-note #server-note-later-box").checked ? 1 : 0);
            });
            document.querySelector("#server-note #server-note-button-no").addEventListener("click", function () {
                document.querySelector("#server-note").style.display = "";
            });
            if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
                document.querySelector("#server-note #server-note-button-go").style.display = "block";
                document.querySelector("#server-note #server-note-button-go").addEventListener("click", function () {
                    followLink(getServerRedirectLink(serverMsg.link), "_blank", LINK_STATE_NORMAL);
                });
            }
            if (serverMsg.imageSrc != undefined && typeof serverMsg.imageSrc == "string") {
                document.querySelector("#server-note #server-note-img").style.display = "flex";
                document.querySelector("#server-note #server-note-img img").src = serverMsg.imageSrc;
                if (serverMsg.imageLink != undefined && serverMsg.imageLink != null && typeof serverMsg.imageLink == "string") {
                    document.querySelector("#server-note #server-note-img img").style.cursor = "pointer";
                    document.querySelector("#server-note #server-note-img img").addEventListener("click", function () {
                        followLink(getServerRedirectLink(serverMsg.imageLink), "_blank", LINK_STATE_NORMAL);
                    });
                }
            }
            if (serverMsg.backgroundImageSrc != undefined && typeof serverMsg.backgroundImageSrc == "string") {
                document.querySelector("#server-note").style.backgroundImage = "url(" + serverMsg.backgroundImageSrc + ")";
            }
        });
    }
}

//HANDLE STRINGS
function getString(prop, punctuationMark, caseType, lang) {
    if (typeof lang == "undefined") {
        lang = CURRENT_LANG;
    }
    var str;
    if (Array.isArray(prop)) {
        if (prop.length == 2 && typeof prop[0] == "string" && typeof prop[1] == "number") {
            if (typeof STRINGS[lang] != "undefined" && typeof STRINGS[lang][prop[0]] != "undefined") {
                str = STRINGS[lang][prop[0]][prop[1]];
            } else if (typeof STRINGS[DEFAULT_LANG] != "undefined" && typeof STRINGS[DEFAULT_LANG][prop[0]] != "undefined") {
                str = STRINGS[DEFAULT_LANG][prop[0]][prop[1]];
            } else {
                return "undefined";
            }
        } else {
            return "undefined";
        }
    } else {
        str = typeof STRINGS[lang] == "undefined" || typeof STRINGS[lang][prop] == "undefined" ? (typeof STRINGS[DEFAULT_LANG] == "undefined" || typeof STRINGS[DEFAULT_LANG][prop] == "undefined" ? "undefined" : STRINGS[DEFAULT_LANG][prop]) : STRINGS[lang][prop];
    }
    str += typeof punctuationMark == "string" ? punctuationMark : "";
    return typeof caseType == "string" && caseType == "upper" ? str.toUpperCase() : typeof caseType == "string" && caseType == "lower" ? str.toLowerCase() : str;
}

function formatJSString(str) {
    if (typeof str !== "string") {
        return str;
    }
    for (var i = 0; i < arguments.length - 1; i++) {
        if (str.indexOf("{{" + i + "}}") !== -1 && (typeof arguments[i + 1] == "number" || typeof arguments[i + 1] == "string")) {
            var replace = new RegExp("{{[" + i + "]}}", "g");
            str = str.replace(replace, arguments[i + 1]);
        }
    }
    var replace = new RegExp("{{[0-9]+}}", "g");
    str = str.replace(replace, "");
    return str;
}

function formatHTMLString(str) {
    if (typeof str !== "string") {
        return str;
    }
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function setHTMLStrings() {
    var elems = document.querySelectorAll("*[data-stringid-content]");
    for (var i = 0; i < elems.length; i++) {
        var args = [];
        args[0] = typeof elems[i].dataset.stringidContentArrayno == "string" ? getString([elems[i].dataset.stringidContent, parseInt(elems[i].dataset.stringidContentArrayno, 10)], elems[i].dataset.stringidContentPunctuation, elems[i].dataset.stringidContentCase) : getString(elems[i].dataset.stringidContent, elems[i].dataset.stringidContentPunctuation, elems[i].dataset.stringidContentCase);
        var argsNo = 1;
        do {
            var elCArg = elems[i].dataset["stringidContentArgisstringref" + argsNo] == "1" ? getString(elems[i].dataset["stringidContentArg" + argsNo]) : elems[i].dataset["stringidContentArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elems[i].textContent = formatJSString.apply(null, args);
    }
    elems = document.querySelectorAll("*[data-stringid-title]");
    for (var i = 0; i < elems.length; i++) {
        var args = [];
        args[0] = typeof elems[i].dataset.stringidTitleArrayno == "string" ? getString([elems[i].dataset.stringidTitle, parseInt(elems[i].dataset.stringidTitleArrayno, 10)], elems[i].dataset.stringidTitlePunctuation, elems[i].dataset.stringidTitleCase) : getString(elems[i].dataset.stringidTitle, elems[i].dataset.stringidTitlePunctuation, elems[i].dataset.stringidTitleCase);
        var argsNo = 1;
        do {
            var elCArg = elems[i].dataset["stringidTitleArgisstringref" + argsNo] == "1" ? getString(elems[i].dataset["tringidTitleArg" + argsNo]) : elems[i].dataset["tringidTitleArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elems[i].title = formatJSString.apply(null, args);
    }
    elems = document.querySelectorAll("*[data-stringid-alt]");
    for (var i = 0; i < elems.length; i++) {
        var args = [];
        args[0] = typeof elems[i].dataset.stringidAltArrayno == "string" ? getString([elems[i].dataset.stringidAlt, parseInt(elems[i].dataset.stringidAltArrayno, 10)], elems[i].dataset.stringidAltPunctuation, elems[i].dataset.stringidAltCase) : getString(elems[i].dataset.stringidAlt, elems[i].dataset.stringidAltPunctuation, elems[i].dataset.stringidAltCase);
        var argsNo = 1;
        do {
            var elCArg = elems[i].dataset["stringidAltArgisstringref" + argsNo] == "1" ? getString(elems[i].dataset["stringidAltArg" + argsNo]) : elems[i].dataset["stringidAltArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elems[i].alt = formatJSString.apply(null, args);
    }
}

function setCurrentLang(lang) {
    if (typeof window.localStorage != "undefined") {
        window.localStorage.setItem("morowayAppLang", lang);
    }
}
//LOCAL APP DATA COPY
function getLocalAppDataCopy() {
    var localAppDataCopy = {};

    if (typeof window.localStorage != "undefined") {
        try {
            localAppDataCopy = JSON.parse(window.localStorage.getItem("morowayAppData") || "{}");
        } catch (e) {
            localAppDataCopy = {};
        }
    }

    return Object.keys(localAppDataCopy).length === 0 ? null : localAppDataCopy;
}

function setLocalAppDataCopy() {
    if (typeof window.localStorage != "undefined") {
        window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
    }
}

//SETTINGS
function getSettings(asObject, storageArea) {
    asObject = asObject == undefined ? false : asObject;
    storageArea = storageArea == undefined || storageArea == null ? "morowayApp" : storageArea;

    var values = {};
    if (typeof window.localStorage != "undefined") {
        try {
            values = JSON.parse(window.localStorage.getItem(storageArea) || "{}");
        } catch (e) {
            settings = {};
        }
    }

    var dependencies, hardware;
    switch (storageArea) {
        default:
            dependencies = {alwaysShowSelectedTrain: ["classicUI"]};
            hardware = {cursorascircle: ["mouse"]};
            if (typeof values.showNotifications != "boolean") {
                values.showNotifications = true;
            }
            if (typeof values.classicUI != "boolean") {
                values.classicUI = true;
            }
            if (typeof values.alwaysShowSelectedTrain != "boolean") {
                values.alwaysShowSelectedTrain = true;
            }
            if (typeof values.cursorascircle != "boolean") {
                values.cursorascircle = true;
            }
            if (typeof values.burnTheTaxOffice != "boolean") {
                values.burnTheTaxOffice = true;
            }
            if (typeof values.saveGame != "boolean") {
                values.saveGame = true;
            }
    }
    Object.keys(values).forEach(function (value) {
        if (dependencies[value] == undefined) {
            dependencies[value] = null;
        }
        if (hardware[value] == undefined) {
            hardware[value] = null;
        }
    });

    return asObject ? {values: values, dependencies: dependencies, hardware: hardware} : values;
}

function setSettings(settings, asObject, storageArea) {
    asObject = asObject == undefined ? false : asObject;
    storageArea = storageArea == undefined || storageArea == null ? "morowayApp" : storageArea;

    window.localStorage.setItem(storageArea, JSON.stringify(asObject ? settings.values : settings));
}

function isSettingActive(a, storageArea) {
    storageArea = storageArea == undefined || storageArea == null ? "morowayApp" : storageArea;
    var settingsComplete = getSettings(true, storageArea);
    var isSettingActive = true;
    if (settingsComplete.dependencies[a] !== null) {
        settingsComplete.dependencies[a].forEach(function (key) {
            if (!getSettings(false, storageArea)[key]) {
                isSettingActive = false;
            }
        });
    }
    return isSettingActive;
}

function isHardwareAvailable(a, storageArea) {
    storageArea = storageArea == undefined || storageArea == null ? "morowayApp" : storageArea;
    var settingsComplete = getSettings(true, storageArea);
    var isHardwareAvailable = true;
    if (settingsComplete.hardware[a] !== null) {
        settingsComplete.hardware[a].forEach(function (current) {
            Array(current).forEach(function (key) {
                if (AVAILABLE_HARDWARE.indexOf(key) == -1) {
                    isHardwareAvailable = false;
                }
            });
        });
    }
    return isHardwareAvailable;
}

function setSettingsHTML(elem, standalone, storageArea, showLang) {
    function displaySettingsOpts() {
        var settings = getSettings(false, storageArea);
        for (var i = 0; i < Object.keys(settings).length; i++) {
            var a = Object.values(settings)[i];
            var b = Object.keys(settings)[i];
            var elem = document.querySelector("[data-settings-id='" + b + "'][data-settings-storage-area='" + storageArea + "']");
            if (elem !== null) {
                var leftButton = document.querySelector("[data-settings-id='" + b + "'][data-settings-storage-area='" + storageArea + "']").querySelector(".settings-opts-left-button");
                var textButton = document.querySelector("[data-settings-id='" + b + "'][data-settings-storage-area='" + storageArea + "']").querySelector(".settings-opts-text-button");

                if (a) {
                    leftButton.style.backgroundColor = "black";
                    leftButton.style.transform = "rotate(360deg)";
                } else {
                    leftButton.style.backgroundColor = "";
                    leftButton.style.transform = "rotate(0deg)";
                }
                if (isSettingActive(b, storageArea) && isHardwareAvailable(b, storageArea)) {
                    elem.style.setProperty("display", "block");
                } else {
                    elem.style.setProperty("display", "none");
                }
            }
        }
    }

    function displaySettingsButtons() {
        if (storageArea == "morowayApp") {
            var settings = getSettings(false, storageArea);
            var btnSaveGameDeleteGame = document.querySelector("#saveGameDeleteGame");
            if (btnSaveGameDeleteGame == undefined || btnSaveGameDeleteGame == null) {
                return false;
            }
            if (settings.saveGame || !isGameSaved() || !standalone) {
                btnSaveGameDeleteGame.style.display = "";
            } else {
                btnSaveGameDeleteGame.style.display = "inline";
            }
        }
    }

    function changeSetting() {
        var settings = getSettings(false, storageArea);
        if (isSettingActive(event.target.parentNode.parentNode.dataset.settingsId, storageArea)) {
            settings[event.target.parentNode.parentNode.dataset.settingsId] = !settings[event.target.parentNode.parentNode.dataset.settingsId];
            setSettings(settings, false, storageArea);
            displaySettingsOpts();
            displaySettingsButtons();
            notify(".notify", getString("optApply", "."), NOTIFICATION_PRIO_LOW, 900, null, null, window.innerHeight);
        }
    }

    if (elem == undefined || elem == null) {
        return false;
    }
    if (standalone == undefined || standalone == null) {
        standalone = true;
    }
    if (showLang == undefined || showLang == null) {
        showLang = true;
    }
    if (storageArea == undefined || storageArea == null) {
        storageArea = "morowayApp";
    }
    elem.classList.add("settings");
    var rootId = "settings-list-" + storageArea;
    var existingRoot = elem.querySelector("#" + rootId);
    if (existingRoot != undefined) {
        elem.removeChild(existingRoot);
    }
    var root = document.createElement("ul");
    root.className = "settings-list";
    root.id = rootId;
    var settings = getSettings(false, storageArea);
    for (var i = 0; i < Object.keys(settings).length; i++) {
        var opt = Object.keys(settings)[i];
        if (getString("optTitle_" + storageArea + "_" + opt) != "undefined") {
            var optElem = document.createElement("li");
            optElem.dataset.settingsId = opt;
            optElem.dataset.settingsStorageArea = storageArea;
            var child = document.createElement("div");
            child.className = "settings-opts-wrapper";
            var kid = document.createElement("i");
            kid.textContent = "settings";
            kid.className = "settings-opts-left-button material-icons";
            kid.addEventListener("click", function (event) {
                changeSetting();
            });
            child.appendChild(kid);
            kid = document.createElement("span");
            kid.textContent = getString("optTitle_" + storageArea + "_" + opt);
            kid.className = "settings-opts-text-button";
            kid.addEventListener("click", function (event) {
                changeSetting();
            });
            child.appendChild(kid);
            optElem.appendChild(child);
            child = document.createElement("div");
            child.className = "settings-hints-wrapper";
            if (getString("optDesc_" + storageArea + "_" + opt) != "undefined") {
                kid = document.createElement("span");
                kid.textContent = getString("optDesc_" + storageArea + "_" + opt);
                child.appendChild(kid);
            }
            if (getString("optDesc_" + storageArea + "_" + opt) != "undefined" && getString("optInfo_" + storageArea + "_" + opt) != "undefined") {
                kid = document.createElement("br");
                child.appendChild(kid);
            }
            if (getString("optInfo_" + storageArea + "_" + opt) != "undefined") {
                kid = document.createElement("i");
                kid.textContent = getString("optInfo_" + storageArea + "_" + opt);
                child.appendChild(kid);
            }
            optElem.appendChild(child);
            if (storageArea == "morowayApp" && opt == "saveGame") {
                child = document.createElement("div");
                child.className = "settings-buttons-wrapper";
                kid = document.createElement("button");
                kid.className = "settings-button";
                kid.id = "saveGameDeleteGame";
                kid.textContent = getString("optButton_morowayApp_saveGame_delete");
                kid.addEventListener("click", function () {
                    removeSavedGame();
                    displaySettingsButtons();
                });
                child.appendChild(kid);
                optElem.appendChild(child);
            }
            root.appendChild(optElem);
        }
    }
    elem.appendChild(root);
    if (showLang) {
        rootId = "langoption";
        root = document.createElement("div");
        existingRoot = elem.querySelector("#" + rootId);
        if (existingRoot != undefined) {
            elem.removeChild(existingRoot);
        }
        root.id = rootId;
        child = document.createElement("div");
        child.id = "langoptioninfo";
        child.textContent = getString("optLangSelectInfo", ":");
        root.appendChild(child);
        Object.keys(STRINGS).forEach(function (val) {
            child = document.createElement("button");
            child.className = "langvalue";
            child.textContent = getString("langName", "", "", val);
            child.dataset.langCode = val;
            if (val == CURRENT_LANG) {
                child.id = "clang";
            } else {
                child.addEventListener("click", function () {
                    setCurrentLang(val);
                    notify(
                        ".notify",
                        getString("optLangSelectChange", "!", "upper", val),
                        NOTIFICATION_PRIO_HIGH,
                        5000,
                        function () {
                            window.location.reload();
                        },
                        getString("optLangSelectChangeButton", "", "upper", val)
                    );
                });
            }
            root.appendChild(child);
        });
        elem.appendChild(root);
    }
    displaySettingsOpts();
    displaySettingsButtons();
    if (typeof setSettingsHTMLLocal == "function") {
        setSettingsHTMLLocal(elem, standalone, storageArea, showLang);
    }
}

//SAVED GAME
function getVersionCode() {
    return APP_DATA.version.major * 10000 + APP_DATA.version.minor * 100 + APP_DATA.version.patch;
}

function isGameSaved() {
    Object.keys(window.localStorage).forEach(function (key) {
        if (key.indexOf("morowayAppSaved") === 0) {
            return true;
        }
    });
    return false;
}
function updateSavedGame() {
    function updateSavedGameElem(regexOld, old, newItem) {
        var elemKeys = savedGameKeys.filter(function (elem) {
            return elem.search(regexOld) === 0 || elem == old;
        });
        elemKeys.sort(function (elem1, elem2) {
            if (elem1 == old) {
                return 1;
            } else if (elem2 == old) {
                return -1;
            } else {
                return parseInt(elem2.replace(regexOld, "$1"), 10) - parseInt(elem1.replace(regexOld, "$1"), 10);
            }
        });
        if (elemKeys.length > 0 && (elemKeys[0] == old || getVersionCode() >= parseInt(elemKeys[0].replace(regexOld, "$1"), 10))) {
            var newVal = window.localStorage.getItem(elemKeys[0]);
            elemKeys.forEach(function (key) {
                window.localStorage.removeItem(key);
            });
            window.localStorage.setItem(newItem, newVal);
        }
    }
    if (typeof window.localStorage != "undefined") {
        var localStorageKeys = Object.keys(window.localStorage);
        var savedGameKeys = localStorageKeys.filter(function (elem) {
            return elem.indexOf("morowayAppSaved") === 0;
        });
        updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Bg$/, "morowayAppSavedBg", "morowayAppSavedGame_v-" + getVersionCode() + "_Bg");
        updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Trains$/, "morowayAppSavedGameTrains", "morowayAppSavedGame_v-" + getVersionCode() + "_Trains");
        updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Switches$/, "morowayAppSavedGameSwitches", "morowayAppSavedGame_v-" + getVersionCode() + "_Switches");
        updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Cars$/, "morowayAppSavedCars", "morowayAppSavedGame_v-" + getVersionCode() + "_Cars");
        updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_CarParams$/, "morowayAppSavedCarParams", "morowayAppSavedGame_v-" + getVersionCode() + "_CarParams");
        savedGameKeys.forEach(function (key) {
            if (key == "morowayAppSavedWithVersion") {
                window.localStorage.removeItem(key);
            }
        });
    }
}
function removeSavedGame() {
    if (typeof window.localStorage != "undefined") {
        Object.keys(window.localStorage).forEach(function (key) {
            if (key.indexOf("morowayAppSaved") === 0) {
                window.localStorage.removeItem(key);
            }
        });
    }
}

//WINDOW
function measureViewspace(a) {
    var b = [{hasTouch: "ontouchstart" in document.documentElement}, {isSmallDevice: window.innerHeight < 290 || window.innerWidth < 750}, {isTinyDevice: window.innerHeight < 250 || window.innerWidth < 600}];
    return a == -1 ? b : a < b.length && a >= 0 ? b[a] : false;
}

//GLOBAL CONSTANTS
const LINK_STATE_NORMAL = 0;
const LINK_STATE_INTERNAL_HTML = 1;
const LINK_STATE_INTERNAL_LICENSE_FILE = 2;

const PROTOCOL_HTTP = "https";
const PROTOCOL_WS = "wss";

const NOTIFICATION_PRIO_LOW = 0;
const NOTIFICATION_PRIO_DEFAULT = 1;
const NOTIFICATION_PRIO_HIGH = 2;

const NOTIFICATION_CHANNEL_DEFAULT = 0;
const NOTIFICATION_CHANNEL_TRAIN_SWITCHES = 1;
const NOTIFICATION_CHANNEL_CLASSIC_UI_TRAIN_SWITCH = 2;
const NOTIFICATION_CHANNEL_TEAMPLAY_CHAT = 3;

const STRINGS = {de:{"appScreenAMillionFrames": "{{0}} Millionen Frames gezeigt","appScreenCarAutoModeChange": "Automatische Autosteuerung {{0}}","appScreenCarAutoModeCrash": "Automatischer Modus: Autounfall! Schalte um auf manuelle Steuerung. Viel Glück!","appScreenCarAutoModeInit": "gestartet","appScreenCarAutoModeParking": "Autos fahren zurück zur Ursprungsposition","appScreenCarAutoModePause": "gestoppt","appScreenCarControlCenterAutoModeActivate": "Starte automatischen Modus","appScreenCarControlCenterAutoModeBackToRoot": "Autos parken","appScreenCarControlCenterAutoModePause": "Pause","appScreenCarControlCenterAutoModeResume": "Weiter","appScreenCarControlCenterStartCar": "„{{0}}“ starten","appScreenCarControlCenterTitle": "Autokontrollzentrum","appScreenCarIcons": ["🏎️","🚗","🚕"],"appScreenCarNames": ["Rotes Auto","Weißes Auto","Gelbes Auto"],"appScreenCarParking": "{{0}} fährt zurück zur Ursprungsposition","appScreenCarStepsBack": "{{0}} setzt zurück","appScreenControlCenterClose": "schließen","appScreenControlCenterSpeedOff": "gestoppt","appScreenControlCenterTitle": "Zugkontrollzentrum","appScreenFurtherInformation": "Mehr Informationen","appScreenHasLoaded": "Anwendung geladen","appScreenHasUpdated": "Neue Version","appScreenIsFail": "Ein Fehler ist aufgetreten","appScreenKonami": "Super - Sie haben den Konamicode geknackt","appScreenKonamiAnimals": ["🐢","🦔"],"appScreenKonamiIconRow": "🚂🚂🚂","appScreenNoCanvas": "Bitte aktualisieren Sie Ihren Browser","appScreenObjectChangesDirection": "{{0}}: Richtung gewechselt","appScreenObjectHasCrashed": "Crash zwischen {{0}} und {{1}}","appScreenObjectStarts": "{{0}} fährt los","appScreenObjectStops": "{{0}} hält an","appScreenSaveGameError": "Fehler beim Speichern des Spieles","appScreenSettingsApplyAndClose": "Anwenden und schließen","appScreenSwitchTurns": "Weiche gestellt","appScreenTeamplayChatClear": "Chat leeren","appScreenTeamplayChatClose": "Chat ausblenden","appScreenTeamplayChatMe": "Ich","appScreenTeamplayChatNoEmojis": "Emojis könnten auf Ihrem Gerät nicht unterstützt sein.","appScreenTeamplayChatNone": "Noch keine Nachrichten. Schreiben Sie etwas Nettes …","appScreenTeamplayChatSend": "Senden","appScreenTeamplayChatSendAction": "Zugbild senden","appScreenTeamplayChatSendReaction": "Reaktion senden","appScreenTeamplayChatSendReactionSmiley": "Emoji","appScreenTeamplayChatSendReactionSmileyHeart": "❤️","appScreenTeamplayChatSendReactionSmileyLaugh": "🤣","appScreenTeamplayChatSendReactionSmileySmile": "🙂","appScreenTeamplayChatSendReactionSmileyThumbsDown": "👎","appScreenTeamplayChatSendReactionSmileyThumbsUp": "👍","appScreenTeamplayChatSendReactionSmileyUnhappy": "😢","appScreenTeamplayChatSendReactionSticker": "Sticker","appScreenTeamplayChatSendTitle": "Nachricht senden","appScreenTeamplayChatStickerEmojis": ["😺","😻","😿","❓","❗","💕","🚂"],"appScreenTeamplayChatStickerNote": "{{0}}-Sticker","appScreenTeamplayChatTitle": "Chat","appScreenTeamplayConnectionError": "Fehler: Keine Verbindung möglich oder Verbindung verloren","appScreenTeamplayCreateError": "Spiel konnte nicht erstellt werden","appScreenTeamplayGamePaused": "Spiel angehalten","appScreenTeamplayGameResumed": "Spiel fortgesetzt","appScreenTeamplayGameStart": "Sobald Sie und alle Ihre Mitspieler auf „Start“ geklickt haben, startet das Spiel. Sobald ein Spieler diese Schaltfläche bedient hat, kann niemand mehr dem Spiel beitreten. Zur Zeit sind {{0}} Spieler (inklusive Ihnen) beigetreten.","appScreenTeamplayGameStartButton": "Start","appScreenTeamplayJoinError": "Beitritt zum Spiel nicht möglich (voll oder obsolet)","appScreenTeamplayJoinTeammateError": "Ihr Mitspieler konnte dem Spiel nicht beitreten","appScreenTeamplayLeaveDialog": "Mehrspielermodus verlassen?","appScreenTeamplayLeaveDialogNo": "Nein","appScreenTeamplayLeaveDialogYes": "Ja","appScreenTeamplayNoWebsocket": "Mehrspieler-Funktionen können nicht geladen werden – bitte aktualisieren Sie Ihren Browser","appScreenTeamplaySetupCreateLink": "Neues Spiel erstellen","appScreenTeamplaySetupInit": "Namen eingeben","appScreenTeamplaySetupInitButton": "Los","appScreenTeamplaySetupInitDetail": "Erlaubte Zeichen: Buchstaben und Zahlen.","appScreenTeamplaySetupStart": "Laden Sie Ihre(n) Mitspieler über folgenden Link ein","appScreenTeamplaySetupStartButton": "Kopieren","appScreenTeamplaySetupStartButtonError": "Fehler: Link konnte nicht kopiert werden","appScreenTeamplaySomebodyLeft": "Ein Mitspieler hat das Spiel verlassen","appScreenTeamplayStartError": "Spiel konnte nicht gestartet werden","appScreenTeamplaySyncError": "Spielsynchronisation fehlgeschlagen!","appScreenTeamplayTeammateLeft": "Ein Mitspieler hat das Spiel verlassen. Das Spiel ist obsolet","appScreenTeamplayTeammateReady": "Ihr Mitspieler ist bereit. Sie auch","appScreenTeamplayTeammateWait": "Bitte warten sie auf Ihren Mitspieler …","appScreenTeamplayTitle": "Mehrspielermodus","appScreenTeamplayUnknownRequest": "Der Server konnte die Anfrage nicht verarbeiten","appScreenTeamplayUnsetTitle": "Einzelspielermodus","appScreenTeamplayUpdateError": "App-Aktualisierung erforderlich","appScreenTeamplayUpdateNote": "App-Aktualisierung empfohlen","appScreenTrainCarIcon": "🚃","appScreenTrainIcons": ["🚂","🚅","🚋","🚅","🚃","🚈"],"appScreenTrainNames": ["Dampflok","TGV Duplex","Schi-Stra-Bus","Thalys","Straßenbahn","Regionalzug"],"appScreenTrainSelected": "{{0}} {{1}}ausgewählt","appScreenTrainSelectedAuto": "automatisch","errorScreenErrorAnimate": "Animations Web Worker","errorScreenErrorAnimateGeneral": "„Web Worker“-Fehler","errorScreenErrorAnimateGeneralPs": ["Der Thread für den Animations-„Web Worker“ konnte nicht erstellt werden oder es trat während der Laufzeit ein Fehler auf. Ist Ihr Browser aktuell?"],"errorScreenErrorMissing": "Fehlende Elemente","errorScreenErrorMissingPics": "Bilder","errorScreenErrorMissingPicsPs": ["Sie könnten Probleme mit Ihrer Internetverbindung haben oder die Bilddatei könnte bei Ihnen blockiert worden sein.","Sollte hingegen ein Serverproblem vorliegen, müssen Sie sich gedulden, bis dieses behoben ist."],"errorScreenErrorTeamplay": "Fehler beim Mehrspielermodus","errorScreenErrorTeamplayConnection": "Verbindung kann nicht hergestellt werden","errorScreenErrorTeamplayConnectionPs": ["Probleme beim Verbinden können verschiedene Ursachen haben. Bitte stellen Sie sicher, dass Sie mit dem Internet verbunden sind, einen aktuellen Browser und die neuste Version der MOROway App verwenden.","Sollte dies nicht helfen, kann es sich um einen Serverfehler handeln. Hier ist folglich Geduld gefragt, bis der Server repariert ist."],"errorScreenErrorTeamplayJoin": "Kein Spielbeitritt möglich","errorScreenErrorTeamplayJoinPs": ["Wenn Sie einem Spiel nicht beitreten können, ist dies entweder voll, obsolet oder bereits gestartet. Erstellen Sie ein neues Spiel."],"errorScreenErrorTeamplayUpdate": "Update erforderlich","errorScreenErrorTeamplayUpdatePs": ["Sie benötigen die neuste Version der MOROway App."],"generalBack": "Zurück","generalNoDOMStorageSupport": "Leider wird DOM-Speicher nicht unterstützt","generalServerNoteButtonGo": "Mehr erfahren","generalServerNoteButtonLater": "Nochmals einblenden","generalServerNoteButtonNo": "Okay","generalServerNoteInfoLater": "Funktioniert nur, wenn diese Nachricht gültig bleibt.","generalTitle": "MOROway App","generalTitleErrorScreen": "Bekannte Probleme","generalTitleHelpScreen": "Hilfe / Informationen","generalTitleSettingsScreen": "Einstellungen","generalTitleWhatsNewScreen": "Versionsgeschichte","helpScreenContact": "Kontakt","helpScreenContactBackupLink": "Zu den Kontaktdaten","helpScreenContactBackupLinkNotification": "Kontaktdaten geöffnet","helpScreenContactFeedback": "Feedback {{0}}","helpScreenContactFeedbackBugs": "Bugreport","helpScreenContactFeedbackIcon": "📫","helpScreenContactFeedbackPs": ["Sie kennen uns unbekannte Bugs? Sie haben Vorschläge, Feedback, Lob, Kritik, Fragen oder ein anderes Anliegen, dass Sie kommunizieren möchten? Hier sind die Kontaktdaten!"],"helpScreenContactFeedbackSend": "Feedback senden","helpScreenContactFeedbackSendNotification": "Feedback-Seite geöffnet","helpScreenContactImprintTitle": "Kontaktinformationen","helpScreenDownload": "Downloads","helpScreenDownloadApps": "Apps {{0}}","helpScreenDownloadAppsAndroid": "Android","helpScreenDownloadAppsAndroidButton": "Play Store","helpScreenDownloadAppsAndroidPs": ["Laden Sie sich die App auf Ihr Android Gerät über den Google Play Store oder über F-Droid."],"helpScreenDownloadAppsFdroidButton": "F-Droid","helpScreenDownloadAppsIcon": "💾","helpScreenDownloadAppsLinux": "Linux","helpScreenDownloadAppsLinuxPs": ["Laden Sie sich die App auf Ihren Linux Laptop bzw. PC über Ubuntu's Snap Store."],"helpScreenDownloadAppsSnapButton": "Snap Store","helpScreenDownloadAppsWindows": "Windows","helpScreenDownloadAppsWindowsButton": "Microsoft Store","helpScreenDownloadAppsWindowsPs": ["Laden Sie sich diese App auf Ihren Windows Laptop bzw. PC über den Microsoft Store."],"helpScreenDownloadTranslations": "Übersetzungen {{0}}","helpScreenDownloadTranslationsButtonTranslations": "Weblate","helpScreenDownloadTranslationsIcon": "🌍","helpScreenDownloadTranslationsPic": "Verfremdeter Text","helpScreenDownloadTranslationsPs": ["Die Übersetzungen werden mit Weblate verwaltet."],"helpScreenDownloadViewSource": "Quelltext {{0}}","helpScreenDownloadViewSourceButtonSource": "GitHub","helpScreenDownloadViewSourceCodePic": "Beispiel-Code","helpScreenDownloadViewSourceIcon": "🔍️","helpScreenDownloadViewSourcePs": ["Den Quelltext dieser Anwendung finden Sie auf GitHub."],"helpScreenGeneral": "Allgemeines","helpScreenGeneralCars": "Autos {{0}}","helpScreenGeneralCarsIcon": "🚗","helpScreenGeneralCarsPs": ["Sie können die drei links neben dem Bahnhof geparkten Autos (gelbes Cabrio, rotes Cabrio, weißer VW-Bus) jeweils per Klick auf das Fahrzeug zum Fahren bringen. Um alle Autos automatisch fahren zu lassen, aktivieren Sie durch Touchen und halten bzw. Doppelklicken eines Autos den automatischen Modus.","Sofern sie den automatischen Modus nicht aktiviert haben lassen sich die Autos getrennt per Klick starten und stoppen. Starten Sie mehrere Autos, riskieren Sie einen Frontalzusammenstoß. Um die betroffenen Autos hiernach erneut starten zu können, setzten Sie ein Auto durch Touchen und halten bzw. Doppelklicken des Autos zurück.","Touchen oder Klicken auf den leeren Parkplatz eines angehaltenen Autos bringt es dorthin zurück.","Sie können ein Autokontrollzentrum aufrufen durch Drei-Finger-Touch / Rechtsklick auf den Hintergrund des Zugkontrollzentrums. Alternativ können Sie auch das Symbol im Optionsmenü unter der Anlage verwenden."],"helpScreenGeneralTeamplay": "Mehrspielermodus {{0}}","helpScreenGeneralTeamplayIcon": "🎮","helpScreenGeneralTeamplayPs": ["Um ein Spiel mit Freunden zu starten, wählen Sie den Mehrspielermodus in der Hauptansicht.","Hier ist ein Spitzname einzugeben.","Nun ist ein Spiel erstellt und kann mit bis zu drei Freunden geteilt werden. Ein Schließen der App zerstört das Spiel. Nach einiger Zeit wird der Link ungültig.","Sobald Sie und all Ihre Mitspieler „Start“ gedrückt haben, startet das Spiel. Drücken Sie nicht auf Start, bevor alle Spieler dem Spiel beigetreten sind, da von nun an kein Beitritt mehr möglich ist.","Ab jetzt werden alle Aktionen synchronisiert und Sie können gemeinsam spielen. Außerdem steht Ihnen ein Chat zur Verfügung."],"helpScreenGeneralTrains": "Eisenbahnen {{0}}","helpScreenGeneralTrainsIcon": "🚂","helpScreenGeneralTrainsPs": ["Zur Zeit lassen sich sechs Züge steuern; eine Dampflok, ein TGV Duplex, ein Schienen-Straßen-Bus, ein Thalys, ein Regionalzug und eine Straßenbahn. Das Starten bzw. Stoppen eines Zuges erfolgt durch Touch bzw. Klick auf den gewünschten Zug oder mit Hilfe der ausblendbaren klassischen Steuerelemente. Um einen Zug zu wenden, halten Sie den Zug an und touchen und halten bzw. doppelklicken Sie ihn.","Um mittels der klassischen Steuerelemente zu fahren, wählen Sie zunächst einen Zug aus, indem Sie den Schalter unten links im Appbildschirm betätigen, bis der Name des gewünschten Zuges eingeblendet wird. Durch Anklicken des Transformators unten rechts im Appbildschirm wird der jeweils ausgewählte Zug gestartet und gestoppt. Ob ein Zug fahrbereit ist, lässt sich an der roten Leuchte am Transformator ablesen.","Wenn Sie einen größeren Bildschirm verwenden, so können Sie die Geschwindigkeit des Zuges beeinflussen, indem Sie den Regler des Transformators an die gewünschte Position ziehen, ihn an unterschiedlichen Stellen anklicken oder über ihm am Mausrad drehen. Auf kleinen Bildschirmen wird unabhängig hiervon eine mittlere Geschwindigkeit eingestellt. Sie können diese Beschränkung durch Heranzoomen des Transformators umgehen.","Um die Richtung des jeweils ausgewählten Zuges am Transformator zu ändern, klicken Sie auf das Symbol mit den gespiegelten Pfeilen unten rechts im Transformator an. Die ausgewählte Richtung wird relativ zu den unteren Gleisen hervorgehoben. Wenn der Zug nicht komplett angehalten ist, kann die Richtung nicht gewechselt werden und das Pfeilsymbol ist ausgeblichen. Auf kleineren Bildschirmen kann die Richtung hier nicht verändert werden.","Auch können Sie einige Weichen stellen. Das Stellen einer Weiche erfolgt durch Klick auf das farbige Symbol der jeweiligen Weiche. Die Position der Symbole kann durch langen Klick bzw. Touch auf den Hintergrund der Anlage ermittelt werden. Der Zug befährt immer den rot oder grün eingefärbten Weg.","Sie können durch Drei-Finger-Touch / Rechtsklick auf den Hintergrund ein Zugkontrollzentrum aufrufen. Alternativ können Sie auch das Symbol im Optionsmenü unter der Anlage verwenden."],"helpScreenGeneralWelcome": "Willkommen {{0}}","helpScreenGeneralWelcomeButtonWhatsNew": "Neuigkeiten","helpScreenGeneralWelcomeIcon": "🏡","helpScreenGeneralWelcomePs": ["Hallo! Sie benutzen die MOROway App. Der Hintergrund stellt eine Luftaufnahme der Modellbahn MOROway aus dem Jahre 2011 dar; 2021 wurde der Abschnitt mit den zentralen Abstellgleisen neu aufgenommen, um diese befahrbar zu machen. Viel Fahrspaß!"],"helpScreenGeneralWelcomeVersion": "Sie verwenden aktuell die am {{5}}. {{4}}. {{3}} erstellte Version {{0}}.{{1}}.{{2}}{{6}}","helpScreenGraphical": "Grafische Hilfe","helpScreenGraphicalDescription": "Grafische Erläuterung {{0}}","helpScreenGraphicalDescriptionIcon": "🎈","helpScreenGraphicalDescriptionPic": "Beschreibendes Bild","helpScreenGraphicalDescriptionPs": ["1: Animierte Züge.","2: Animierte Autos.","3: Animiertes brennendes Finanzamt.","4: Zugauswahl.","5: Ausgewählter Zug.","6: Transformator.","7: Zugrichtungswechsel.","8: Weichen."],"helpScreenLegal": "Lizenzen","helpScreenLegalAppOC": "MOROway App OC {{0}}","helpScreenLegalAppOCCordova": "Apache Cordova","helpScreenLegalAppOCCordovaPs": ["Die MOROway App OC Variante basiert auf Apache Cordova erstellt von der Apache Software Foundation."],"helpScreenLegalAppOCDialogs": "cordova-plugin-dialogs","helpScreenLegalAppOCDialogsPs": ["Die MOROway App OC Variante nutzt das „Dialogs Plugin“ erstellt von der Apache Software Foundation."],"helpScreenLegalAppOCIcon": "📱","helpScreenLegalAppOCInsomnia": "Insomnia","helpScreenLegalAppOCInsomniaPs": ["Die MOROway App OC Variante nutzt das „Insomnia-PhoneGap-Plugin“ erstellt von Eddy Verbruggen."],"helpScreenLegalAppOCSplashscreen": "cordova-plugin-splashscreen","helpScreenLegalAppOCSplashscreenPs": ["Die MOROway App OC Variante nutzt das „Splashscreen Plugin“ erstellt von der Apache Software Foundation."],"helpScreenLegalAppOCWebintent": "Webintent","helpScreenLegalAppOCWebintentPs": ["Die MOROway App OC Variante nutzt das „WebIntent Android Plugin for Cordova“ erstellt von Boris Smus und Beitragenden."],"helpScreenLegalAppSnap": "MOROway snApp {{0}}","helpScreenLegalAppSnapCordova": "Apache Cordova","helpScreenLegalAppSnapCordovaPs": ["Die MOROway „snApp“ Variante basiert auf Apache Cordova mit der Plattform Electron von der Apache Software Foundation."],"helpScreenLegalAppSnapIcon": "💻","helpScreenLegalFonts": "Verwendete Schriften {{0}}","helpScreenLegalFontsIcon": "🌐","helpScreenLegalFontsMaterialIcons": "Material Icon Font","helpScreenLegalFontsMaterialIconsPs": ["Wir verwenden an einigen Stellen die „Material Icons“ Schrift der Google Inc."],"helpScreenLegalFontsRoboto": "Roboto","helpScreenLegalFontsRobotoPs": ["Wir verwenden an einigen Stellen die Schriftart „Roboto“ der Google Inc."],"helpScreenLegalOwn": "MOROway App {{0}}","helpScreenLegalOwnCode": "Allgemein","helpScreenLegalOwnCodePs": ["Sie dürfen die MOROway App unter den Bedingungen der Apache License Version 2.0 weiterverwenden."],"helpScreenLegalOwnIcon": "✌️","helpScreenLegalOwnPics": "Medieninhalte","helpScreenLegalOwnPicsPs": ["Sie dürfen unsere Medieninhalte auch unter der Creative Commons Attribution 4.0 International-Lizenz weiterverwenden."],"helpScreenLegalStrCopyright": "Copyright","helpScreenLegalStrLicense": "Lizenz","helpScreenMOROmore": "Mehr über MOROway","helpScreenMOROmoreAbout": "Über MOROway {{0}}","helpScreenMOROmoreAboutIcon": "📜","helpScreenMOROmoreWebsite": "MOROway-Website {{0}}","helpScreenMOROmoreWebsiteButtonLink": "Webseite","helpScreenMOROmoreWebsiteIcon": "🛤️","helpScreenMOROmoreWebsitePs": ["Besuchen Sie die MOROway Webseite …"],"helpScreenPrivacy": "Datenschutz","helpScreenPrivacyStatement": "Datenschutzerklärung","helpScreenPrivacyStatementBackupLink": "Datenschutzerklärung öffnen","helpScreenPrivacyStatementBackupLinkNotification": "Link geöffnet","helpScreenPrivacyStatementIcon": "🦮","langName": "Deutsch","optApply": "Einstellungen aktualisiert","optButton_morowayApp_saveGame_delete": "Gespeichertes Spiel jetzt löschen","optDesc_morowayApp_alwaysShowSelectedTrain": "Zeigt den Namen des ausgewählten Zuges immer an.","optDesc_morowayApp_burnTheTaxOffice": "Zeigt Animationen zum brennenden Finanzamt.","optDesc_morowayApp_classicUI": "Zeigt die klassischen Steuerelemente wie Trafo und Zugauswahlbutton.","optDesc_morowayApp_cursorascircle": "Zeigt statt dem Mauszeiger einen Farbkreis.","optDesc_morowayApp_saveGame": "Speichert den Zustand des jeweils aktuellen Spieles für das nächste Spiel.","optDesc_morowayApp_showNotifications": "Zeigt Texteinblendungen bei verschiedenen Aktionen an.","optInfo_morowayApp_alwaysShowSelectedTrain": "Funktioniert nicht auf kleinen Bildschirmen. Erfodert aktivierte „Klassische Steuerelemente“.","optInfo_morowayApp_cursorascircle": "Funktioniert nicht auf Touchscreens.","optInfo_morowayApp_saveGame": "Wird im Mehrspieler-Modus ignoriert.","optInfo_morowayApp_showNotifications": "Einige Benachrichtigungen werden trotz Deaktivierung dieser Einstellung angezeigt. Funktioniert nicht auf einigen Bildschirm-Seitenverhältnissen.","optLangSelectChange": "Sprachwahl gespeichert - Neuladen, um anzuwenden","optLangSelectChangeButton": "Neuladen","optLangSelectInfo": "Sprache wählen (erfordert Neuladen)","optTitle_morowayApp_alwaysShowSelectedTrain": "Ausgewählter Zug","optTitle_morowayApp_burnTheTaxOffice": "Brennendes Finanzamt animieren","optTitle_morowayApp_classicUI": "Klassische Steuerelemente","optTitle_morowayApp_cursorascircle": "Mauszeiger als Farbe darstellen","optTitle_morowayApp_saveGame": "Spiel speichern","optTitle_morowayApp_showNotifications": "Benachrichtigungen","platformOcAppUpdate": "Es sind neue Funktionen verfügbar!","platformOcAppUpdateNo": "Ignorieren","platformOcAppUpdateTitel": "App-Update","platformOcAppUpdateYes": "Ansehen","platformOcGameLeave": "Verlassen und Spiel zerstören?","platformOcGameLeaveNo": "Abbrechen!","platformOcGameLeaveTitel": "Sind Sie sich sicher?","platformOcGameLeaveYes": "Verlassen!","platformOcStartGame": "Spielen","platformOcStartGameOnline": "Mehrspieler","platformOcStartHelp": "Hilfe/Credits","platformOcStartSettings": "Einstellungen","platformSnapAppExit": "App verlassen","platformWindowsLinkError": "Fehler - Link konnte nicht geöffnet werden.","whatsNewScreenVersionIsNew": "Neu","whatsNewScreenVersionNumber": "Version {{0}}","whatsNewScreenVersionNumberMinor": "Neu in Version {{0}}.{{1}}",whatsNewScreenByVersionMa1Mi0: ["2011","Die animierte Dampflok stellt den Beginn der MOROway App dar."],whatsNewScreenByVersionMa2Mi0: ["2011","﻿Ein neuer Zug, der TGV, wurde hinzugefügt.","Erstes animiertes Auto."],whatsNewScreenByVersionMa3Mi0: ["2011","Verbesserter TGV-Pfad in umgekehrter Richtung.","Verbesserter Pfad für das erste Auto.","Zweites Auto wurde hinzugefügt.","Beide Autos sind nun steuerbar."],whatsNewScreenByVersionMa3Mi1: ["2011","Erste Version eines Infotextes."],whatsNewScreenByVersionMa3Mi2: ["2011","Ein Intro mit dem MOROway Logo wurde eingebaut.","Beide Züge sind individuell steuerbar.","Steuerung des Infotext wurde ergänzt."],whatsNewScreenByVersionMa4Mi0: ["2015","{{0}} Update von Action-Script 2 auf Action-Script 3.","{{0}} Einfügen von Wagen für die Dampflok.","{{0}} Zweiter Zug im Innenkreis (Schi-Stra-Bus).","{{0}} Steuerung durch Klick auf Zug ist nun möglich.","Überarbeiteter Hintergrund.","Überarbeitete Kreisführung für die Autos.","Veränderter Vorspann.","Veränderte Bedienelemente und neuer Hilfetext.","Fehlerkorrekturen."],whatsNewScreenByVersionMa5Mi0: ["2018","{{0}} Neuer Hintergrund (u.a. verbesserter Bildausschnitt).","{{0}} Variable Zuggeschwindigkeit.","{{0}} Richtungswechsel für alle Züge möglich.","{{0}} Kurzzeitig eingeblendete Benachrichtigungen informieren über Events.","{{0}} Basiseinstellungen.","{{0}} Neuer Vorspann.","{{0}} Animation des brennenden Finanzamtes.","Optimierte Objekte (Züge, Autos, Trafo,...).","Optimierte Objektpfade (\"Zugstrecken\", \"Autostrecken\").","Optimierte Objektsteuerung (Züge und Autos).","Optimierte User-Interface.","Optimierte Hilfeseiten.","Nativer HTML-, JavaScript- und CSS-Code (statt Flash-Action-Script).","Offline-Support als Progressive-Web-App.","Einbau diverser Open-Source-Komponenten.","Neue Lizenzierung des eigenen Codes."],whatsNewScreenByVersionMa5Mi1: ["2018","{{0}} Einige Weichen können gestellt werden.","Optimierte Zugstrecken.","Fehlerkorrekturen."],whatsNewScreenByVersionMa5Mi2: ["2018","{{0}} Die Züge starten und halten zeitvergözert.","{{0}} Autos können automatisch fahren.","{{0}} Kurzes Zurücksetzen der Autos möglich.","Optimierte  Objektsteuerung (Züge und Autos)."],whatsNewScreenByVersionMa5Mi3: ["2018","{{0}} Drittes, gelbes Auto.","{{0}} Englische Version.","Verbesserte Weichensymbole.","Fehlerkorrekturen."],whatsNewScreenByVersionMa5Mi4: ["2018","Neue Lizenzierung des eigenen Codes (Apache License Version 2 statt Two-Clause-BSD)."],whatsNewScreenByVersionMa5Mi5: ["2018","Verlinkung zur Website von MOROway in Hilfeseite eingebaut."],whatsNewScreenByVersionMa5Mi6: ["2018","Autos: Verbesserungen an der automatischen Steuerung.","Nur aktive Einstellungen werden angezeigt."],whatsNewScreenByVersionMa6Mi0: ["2019","{{0}} Spielen Sie mit Freunden über den neuen Mehrspielermodus.","Fehlerkorrekturen."],whatsNewScreenByVersionMa6Mi1: ["2020","{{0}} Multithreading.","Entfernen der Option, die Anzeige der Weichen zu deaktivieren."],whatsNewScreenByVersionMa6Mi2: ["2020","{{0}} Verarbeiten des Spielfeldzooms mit Touch-Gesten, Tastatur und Mausrad.","{{0}} Spielfeld \"Control Center\" für Züge."],whatsNewScreenByVersionMa6Mi3: ["2020","﻿Hohe Präzision beim Weichenstellen."],whatsNewScreenByVersionMa6Mi4: ["2020","{{0}} Autos können wieder einparken.","{{0}} \"Control Center\" für Autos.","Verbesserte Performance.","Verbessertes Cursor-Verhalten.","Fehlerkorrekturen."],whatsNewScreenByVersionMa7Mi0: ["2021","{{0}} Drei zusätzliche Züge: Thalys, Regionalzug und Straßenbahn.","{{0}} Zentrale Abstellgleise sind nutzbar.","{{0}} Option, den Zustand des Spieles zu speichern.","Fehlerkorrekturen."],whatsNewScreenByVersionMa7Mi1: ["2021","Entfernen des Material Design Lite."],whatsNewScreenByVersionMa7Mi2: ["2021","{{0}} Mehrspielermodus: Text-Chat."],whatsNewScreenByVersionMa7Mi3: ["2021","Verbesserte Zugstrecken","Verbessertes Rangieren","Verbesserte Zoomgesten"],whatsNewScreenByVersionMa7Mi4: ["2022","Größe Darstellung des Optionsmenüs und der klassischen Steuerelemente auf kleinen Bildschirmen.","Verbesserte klassische Steuerelemente.","Fehlerkorrekturen."]},en:{"appScreenAMillionFrames": "{{0}} million frames shown","appScreenCarAutoModeChange": "Automatic car control {{0}}","appScreenCarAutoModeCrash": "Auto mode: car crash! Switching over to manual control. Good luck!","appScreenCarAutoModeInit": "activated","appScreenCarAutoModeParking": "Cars move back to initial position","appScreenCarAutoModePause": "paused","appScreenCarControlCenterAutoModeActivate": "Start auto mode","appScreenCarControlCenterAutoModeBackToRoot": "Park cars","appScreenCarControlCenterAutoModePause": "Pause","appScreenCarControlCenterAutoModeResume": "Resume","appScreenCarControlCenterStartCar": "Start “{{0}}”","appScreenCarControlCenterTitle": "Car Control Center","appScreenCarIcons": ["🏎️","🚗","🚕"],"appScreenCarNames": ["Red car","White car","Yellow car"],"appScreenCarParking": "{{0}} moves back to initial position","appScreenCarStepsBack": "{{0}} reverses","appScreenControlCenterClose": "close","appScreenControlCenterSpeedOff": "paused","appScreenControlCenterTitle": "Train Control Center","appScreenFurtherInformation": "More information","appScreenHasLoaded": "App ready","appScreenHasUpdated": "New version","appScreenIsFail": "An error occurred","appScreenKonami": "You cracked the Konami Code","appScreenKonamiAnimals": ["🐢","🦔"],"appScreenKonamiIconRow": "🚂🚂🚂","appScreenNoCanvas": "Please update your browser","appScreenObjectChangesDirection": "{{0}}: Direction change","appScreenObjectHasCrashed": "Crash between {{0}} and {{1}}","appScreenObjectStarts": "{{0}} starts","appScreenObjectStops": "{{0}} stops","appScreenSaveGameError": "Error saving game","appScreenSettingsApplyAndClose": "Apply and close","appScreenSwitchTurns": "Switch turned","appScreenTeamplayChatClear": "Clear chat","appScreenTeamplayChatClose": "Close chat","appScreenTeamplayChatMe": "Me","appScreenTeamplayChatNoEmojis": "Emojis might not be supported on your device.","appScreenTeamplayChatNone": "No messages yet. Write something nice…","appScreenTeamplayChatSend": "Send","appScreenTeamplayChatSendAction": "Send train picture","appScreenTeamplayChatSendReaction": "Send reaction","appScreenTeamplayChatSendReactionSmiley": "Emoji","appScreenTeamplayChatSendReactionSmileyHeart": "❤️","appScreenTeamplayChatSendReactionSmileyLaugh": "🤣","appScreenTeamplayChatSendReactionSmileySmile": "🙂","appScreenTeamplayChatSendReactionSmileyThumbsDown": "👎","appScreenTeamplayChatSendReactionSmileyThumbsUp": "👍","appScreenTeamplayChatSendReactionSmileyUnhappy": "😢","appScreenTeamplayChatSendReactionSticker": "Sticker","appScreenTeamplayChatSendTitle": "Send message","appScreenTeamplayChatStickerEmojis": ["😺","😻","😿","❓","❗","💕","🚂"],"appScreenTeamplayChatStickerNote": "{{0}}-Sticker","appScreenTeamplayChatTitle": "Chat","appScreenTeamplayConnectionError": "Error: Couldn't connect or connection lost","appScreenTeamplayCreateError": "Couldn't create game","appScreenTeamplayGamePaused": "Game paused","appScreenTeamplayGameResumed": "Game resumed","appScreenTeamplayGameStart": "Using the “start” button will start the game as soon as you and each teammate clicked the button. As soon as anyone clicks the button it is impossible to join for further teammates. Currently {{0}} player(s) (including you) joined the game.","appScreenTeamplayGameStartButton": "Start","appScreenTeamplayJoinError": "Couldn't join. Game is full or obsolete","appScreenTeamplayJoinTeammateError": "Teammate couldn't join game","appScreenTeamplayLeaveDialog": "Leave multiplayer mode?","appScreenTeamplayLeaveDialogNo": "No","appScreenTeamplayLeaveDialogYes": "Yes","appScreenTeamplayNoWebsocket": "Can't load multiplayer functions - please update your browser","appScreenTeamplaySetupCreateLink": "Create a new game","appScreenTeamplaySetupInit": "Enter name","appScreenTeamplaySetupInitButton": "Go","appScreenTeamplaySetupInitDetail": "Allowed characters: Letters and numbers.","appScreenTeamplaySetupStart": "Invite your teammate(s) using the following link","appScreenTeamplaySetupStartButton": "Copy","appScreenTeamplaySetupStartButtonError": "Error: Couldn't copy game link","appScreenTeamplaySomebodyLeft": "Teammate left","appScreenTeamplayStartError": "Couldn't start game","appScreenTeamplaySyncError": "Game sync failed!","appScreenTeamplayTeammateLeft": "Teammate left. Game is obsolete","appScreenTeamplayTeammateReady": "Your teammate is ready. Are you, too","appScreenTeamplayTeammateWait": "Please wait for teammate to get ready…","appScreenTeamplayTitle": "Multiplayer","appScreenTeamplayUnknownRequest": "Server couldn't handle request","appScreenTeamplayUnsetTitle": "Single-player","appScreenTeamplayUpdateError": "App update required","appScreenTeamplayUpdateNote": "App update recommended","appScreenTrainCarIcon": "🚃","appScreenTrainIcons": ["🚂","🚅","🚋","🚅","🚃","🚈"],"appScreenTrainNames": ["Steam engine","TGV Duplex","Railbus","Thalys","Street car","Local train"],"appScreenTrainSelected": "{{0}} {{1}}selected","appScreenTrainSelectedAuto": "auto","errorScreenErrorAnimate": "Animation – Web Worker","errorScreenErrorAnimateGeneral": "Web worker error","errorScreenErrorAnimateGeneralPs": ["An error with the animation web worker thread occurred. Either it couldn't be registered or a runtime error occurred. Is your browser up to date?"],"errorScreenErrorMissing": "Missing elements","errorScreenErrorMissingPics": "Images","errorScreenErrorMissingPicsPs": ["You might have problems with your internet connection, firewall or media blocker.","If there is a problem with the server delivering the image, you will have to wait for us to fix it."],"errorScreenErrorTeamplay": "Multiplayer errors","errorScreenErrorTeamplayConnection": "Can't establish connection","errorScreenErrorTeamplayConnectionPs": ["If you can't establish a connection to the game server, it can have multiple reasons. First of all make sure, you are connected to the Internet, use a modern browser and an up-to-date version of MOROway App.","If following these steps does not help there might be a server problem. If so, try again later."],"errorScreenErrorTeamplayJoin": "Can't join game","errorScreenErrorTeamplayJoinPs": ["If you can't join a game, it might be full, obsolete or already running. Please create a new game."],"errorScreenErrorTeamplayUpdate": "Update required","errorScreenErrorTeamplayUpdatePs": ["You have to update to the newest version of MOROway App."],"generalBack": "Back","generalNoDOMStorageSupport": "Sorry – DOM storage not supported","generalServerNoteButtonGo": "show me more","generalServerNoteButtonLater": "show again","generalServerNoteButtonNo": "okay","generalServerNoteInfoLater": "Only works if this message remains valid.","generalTitle": "MOROway App","generalTitleErrorScreen": "Known issues","generalTitleHelpScreen": "Legal / Help","generalTitleSettingsScreen": "Settings","generalTitleWhatsNewScreen": "Changelog","helpScreenContact": "Contact","helpScreenContactBackupLink": "Open contact information","helpScreenContactBackupLinkNotification": "Contact information opened","helpScreenContactFeedback": "Feedback {{0}}","helpScreenContactFeedbackBugs": "Report a bug","helpScreenContactFeedbackIcon": "📫","helpScreenContactFeedbackPs": ["Get in touch using the contact information displayed below!"],"helpScreenContactFeedbackSend": "Send feedback","helpScreenContactFeedbackSendNotification": "Feedback page opened","helpScreenContactImprintTitle": "Contact info","helpScreenDownload": "Downloads","helpScreenDownloadApps": "Apps {{0}}","helpScreenDownloadAppsAndroid": "Android","helpScreenDownloadAppsAndroidButton": "Play Store","helpScreenDownloadAppsAndroidPs": ["You can download this app via Google Play Store or F-Droid."],"helpScreenDownloadAppsFdroidButton": "F-Droid","helpScreenDownloadAppsIcon": "💾","helpScreenDownloadAppsLinux": "Linux","helpScreenDownloadAppsLinuxPs": ["You can download this app to your Laptop / PC via Ubuntu's Snap Store."],"helpScreenDownloadAppsSnapButton": "Snap Store","helpScreenDownloadAppsWindows": "Windows","helpScreenDownloadAppsWindowsButton": "Microsoft Store","helpScreenDownloadAppsWindowsPs": ["You can download this app to your Windows Laptop / PC via Microsoft Store."],"helpScreenDownloadTranslations": "Translations {{0}}","helpScreenDownloadTranslationsButtonTranslations": "Weblate","helpScreenDownloadTranslationsIcon": "🌍","helpScreenDownloadTranslationsPic": "alienated text","helpScreenDownloadTranslationsPs": ["Translations are handled using Weblate."],"helpScreenDownloadViewSource": "Source Code {{0}}","helpScreenDownloadViewSourceButtonSource": "GitHub","helpScreenDownloadViewSourceCodePic": "Sample code","helpScreenDownloadViewSourceIcon": "🔍️","helpScreenDownloadViewSourcePs": ["Get the source code from GitHub."],"helpScreenGeneral": "General","helpScreenGeneralCars": "Cars {{0}}","helpScreenGeneralCarsIcon": "🚗","helpScreenGeneralCarsPs": ["By touching / clicking one of the three cars left to the main station it starts. By touching and holding / double-clicking one of them they enter automatic mode, which means they navigate automatically.","If you haven't enabled automatic mode and operate more than one car, you risk a head-on collision. If this happens touch and hold / double-click one of the involved cars to move it back.","Touching or clicking on a stopped car's parking lot will navigate it back there.","You may access a car control center by touching with three fingers / right-clicking the background of the train control center. Alternatively you may use the options menu icon below the virtual model railroad."],"helpScreenGeneralTeamplay": "Multiplayer mode {{0}}","helpScreenGeneralTeamplayIcon": "🎮","helpScreenGeneralTeamplayPs": ["If you wish to play together with your friends use the multiplayer mode.","First you have to enter a nick name.","Now a new game is created and the link can be shared with up to three friends. Please note: Closing the app will destroy the game. The link expires after a while.","After your teammate(s) joined you should touch / click “start” and the game will start as soon as all your teammates touched / clicked the button. If you invited more than just one teammate, do not start the game before everyone joined, because after you or a teammate pressed the button nobody can join anymore.","Now all actions are synced and you can play together. Furthermore a text chat is available."],"helpScreenGeneralTrains": "Trains {{0}}","helpScreenGeneralTrainsIcon": "🚂","helpScreenGeneralTrainsPs": ["You may operate six trains; an steam engine, two high speed trains, an railbus, an local train and an street car. Start or stop a train by touching / clicking on it. Touch and hold / double-click a train to change it's direction.","To navigate by using “Classic UI”, select a train by touching / clicking on the button on the lower-left side. Start or stop the selected train by operating the transformer.","On larger devices you are also able to control the trains's speed using the transformer. Small devices use a medium speed, but you may zoom in on the transformer to avoid this restriction.","To change a train's direction use the arrow symbol in the lower right corner of the transformer; this is not possible on small devices.","You may turn some switches. Touch / click and hold the background to located the switches. Touch / click on a switch to turn it. The train takes the red or green colored way.","You may access a train control center by touching with three fingers / right-clicking the background. Alternatively you may use the options menu icon below the virtual model railroad."],"helpScreenGeneralWelcome": "Welcome {{0}}","helpScreenGeneralWelcomeButtonWhatsNew": "Changelog","helpScreenGeneralWelcomeIcon": "🏡","helpScreenGeneralWelcomePs": ["Hello, you use MOROway App. The background image is a aerial view of the MOROway model railroad taken 2011. The central sidings have been newly taken in 2021 to make them usable. Enjoy!"],"helpScreenGeneralWelcomeVersion": "Current version: {{0}}.{{1}}.{{2}}{{6}} ({{3}}-{{4}}-{{5}})","helpScreenGraphical": "Graphical help","helpScreenGraphicalDescription": "Graphical explanation {{0}}","helpScreenGraphicalDescriptionIcon": "🎈","helpScreenGraphicalDescriptionPic": "Descriptive image","helpScreenGraphicalDescriptionPs": ["1: Animated trains.","2: Animated cars.","3: Animated burning tax office.","4: Train selection.","5: Selected train.","6: Transformer.","7: Change train direction.","8: Switches."],"helpScreenLegal": "Licenses","helpScreenLegalAppOC": "MOROway App OC {{0}}","helpScreenLegalAppOCCordova": "Apache Cordova","helpScreenLegalAppOCCordovaPs": ["The MOROway App OC variant is based upon Apache Cordova by the Apache Software Foundation."],"helpScreenLegalAppOCDialogs": "cordova-plugin-dialogs","helpScreenLegalAppOCDialogsPs": ["The MOROway App OC variant uses the “Dialogs Plugin” by the Apache Software Foundation."],"helpScreenLegalAppOCIcon": "📱","helpScreenLegalAppOCInsomnia": "Insomnia (prevent screen sleep)","helpScreenLegalAppOCInsomniaPs": ["The MOROway App OC variant uses the “Insomnia-PhoneGap-Plugin” by Eddy Verbruggen."],"helpScreenLegalAppOCSplashscreen": "cordova-plugin-splashscreen","helpScreenLegalAppOCSplashscreenPs": ["The MOROway App OC variant uses the “Splashscreen Plugin“ by the Apache Software Foundation."],"helpScreenLegalAppOCWebintent": "cordova-webintent","helpScreenLegalAppOCWebintentPs": ["The MOROway App OC variant uses the “WebIntent Android Plugin for Cordova” by Boris Smus and contributors."],"helpScreenLegalAppSnap": "MOROway snApp {{0}}","helpScreenLegalAppSnapCordova": "Apache Cordova","helpScreenLegalAppSnapCordovaPs": ["The MOROway “snApp” variant is based upon Apache Cordova with platform Electron by The Apache Software Foundation."],"helpScreenLegalAppSnapIcon": "💻","helpScreenLegalFonts": "Fonts {{0}}","helpScreenLegalFontsIcon": "🌐","helpScreenLegalFontsMaterialIcons": "Material Icon Font","helpScreenLegalFontsMaterialIconsPs": ["This app uses the “Material Icon” font by Google Inc."],"helpScreenLegalFontsRoboto": "Roboto","helpScreenLegalFontsRobotoPs": ["This app uses “Roboto” font by Google Inc."],"helpScreenLegalOwn": "MOROway App {{0}}","helpScreenLegalOwnCode": "General","helpScreenLegalOwnCodePs": ["MOROway App is licensed under the Apache License Version 2.0."],"helpScreenLegalOwnIcon": "✌️","helpScreenLegalOwnPics": "Media files","helpScreenLegalOwnPicsPs": ["Our media files are also licensed under the Creative Commons Attribution 4.0 International-License."],"helpScreenLegalStrCopyright": "Copyright","helpScreenLegalStrLicense": "License","helpScreenMOROmore": "More about MOROway","helpScreenMOROmoreAbout": "About MOROway {{0}}","helpScreenMOROmoreAboutIcon": "📜","helpScreenMOROmoreWebsite": "MOROway Website {{0}}","helpScreenMOROmoreWebsiteButtonLink": "Website","helpScreenMOROmoreWebsiteIcon": "🛤️","helpScreenMOROmoreWebsitePs": ["Visit the MOROway website…"],"helpScreenPrivacy": "Privacy","helpScreenPrivacyStatement": "Privacy statement","helpScreenPrivacyStatementBackupLink": "Open privacy statement","helpScreenPrivacyStatementBackupLinkNotification": "Link opened","helpScreenPrivacyStatementIcon": "🦮","langName": "English","optApply": "New configuration saved","optButton_morowayApp_saveGame_delete": "Delete saved game now","optDesc_morowayApp_alwaysShowSelectedTrain": "Displays the name of the selected train.","optDesc_morowayApp_burnTheTaxOffice": "Shows some animations on the burning tax office.","optDesc_morowayApp_classicUI": "Displays control elements like transformer and train selection button.","optDesc_morowayApp_cursorascircle": "Replaces the cursor with a colored circle.","optDesc_morowayApp_saveGame": "Saves the game's current state for the next game.","optDesc_morowayApp_showNotifications": "Displays on-screen text notifications.","optInfo_morowayApp_alwaysShowSelectedTrain": "Requires “Classic UI”. Does not work on small screens.","optInfo_morowayApp_cursorascircle": "Does not work on touch screens.","optInfo_morowayApp_saveGame": "Ignored on multiplayer games.","optInfo_morowayApp_showNotifications": "Some notifications are shown even if deactivated. Does not work on some display aspect ratios.","optLangSelectChange": "Preferences saved - reload app to apply","optLangSelectChangeButton": "reload","optLangSelectInfo": "Language selection (requires reload)","optTitle_morowayApp_alwaysShowSelectedTrain": "Selected train","optTitle_morowayApp_burnTheTaxOffice": "Animate burning tax office","optTitle_morowayApp_classicUI": "Classic UI","optTitle_morowayApp_cursorascircle": "Display cursor as color","optTitle_morowayApp_saveGame": "Save Game","optTitle_morowayApp_showNotifications": "Notifications","platformOcAppUpdate": "New features available!","platformOcAppUpdateNo": "Ignore","platformOcAppUpdateTitel": "App-Update","platformOcAppUpdateYes": "View","platformOcGameLeave": "Leave and destroy game?","platformOcGameLeaveNo": "Cancel!","platformOcGameLeaveTitel": "Are you sure?","platformOcGameLeaveYes": "Leave!","platformOcStartGame": "Play","platformOcStartGameOnline": "Multiplayer","platformOcStartHelp": "Help/Legal","platformOcStartSettings": "Settings","platformSnapAppExit": "Exit app","platformWindowsLinkError": "Error! Couldn't open link.","whatsNewScreenVersionIsNew": "New","whatsNewScreenVersionNumber": "Version {{0}}","whatsNewScreenVersionNumberMinor": "New in version {{0}}.{{1}}",whatsNewScreenByVersionMa1Mi0: ["2011","First release featuring steam locomotive."],whatsNewScreenByVersionMa2Mi0: ["2011","{{0}} TGV Duplex.","{{0}} First car."],whatsNewScreenByVersionMa3Mi0: ["2011","{{0}} Second car.","Car controls added.","Improved paths."],whatsNewScreenByVersionMa3Mi1: ["2011","Info section added."],whatsNewScreenByVersionMa3Mi2: ["2011","Short intro added.","Train controls added."],whatsNewScreenByVersionMa4Mi0: ["2015","{{0}} Update from Action-Script 2 to Action-Script 3.","{{0}} Added cars to steam engine.","{{0}} Third train (railbus).","{{0}} Start/stop train by clicking them.","Improved background.","Improved car paths.","New intro.","Improved controls and info text","Bugfixes."],whatsNewScreenByVersionMa5Mi0: ["2018","{{0}} Better background.","{{0}} Custom train speed.","{{0}} Change train direction.","{{0}} Notifications.","{{0}} Option menu added.","{{0}} Better intro.","{{0}} Animated burning tax office.","Improved objects.","Improved object paths.","Improved controls.","Optimized GUI.","Improved help section.","HTML/JS/CSS replaces Flash Action Script.","Offline-Support as Progressive-Web-App.","Use of Open-Source-Components.","Own code is licensed differently."],whatsNewScreenByVersionMa5Mi1: ["2018","{{0}} Turn switches.","Improved train paths.","Bugfixes."],whatsNewScreenByVersionMa5Mi2: ["2018","{{0}} Trains: Acceleration delay.","{{0}} Cars: auto mode added.","{{0}} Cars: Option to move back a bit.","Improved controls."],whatsNewScreenByVersionMa5Mi3: ["2018","{{0}} Third car (yellow car).","{{0}} English Version","Better switch symbols","Bugfixes."],whatsNewScreenByVersionMa5Mi4: ["2018","Own code is licensed differently. (Apache License Version 2 replaces Two-Clause-BSD)."],whatsNewScreenByVersionMa5Mi5: ["2018","Added website link in help section."],whatsNewScreenByVersionMa5Mi6: ["2018","Cars: Improvements for auto mode.","Only display active settings."],whatsNewScreenByVersionMa6Mi0: ["2019","{{0}} Play with your friends using the new multiplayer mode.","Bugfixes."],whatsNewScreenByVersionMa6Mi1: ["2020","{{0}} Multithreading.","Removed option to disable switches."],whatsNewScreenByVersionMa6Mi2: ["2020","{{0}} Allow gameplay zoom by touch gestures, keyboard and mousewheel.","{{0}} Gameplay \"Control Center\" for trains"],whatsNewScreenByVersionMa6Mi3: ["2020","High precision handling of switches."],whatsNewScreenByVersionMa6Mi4: ["2020","{{0}} Cars can move back to parking lot","{{0}} \"Control Center\" for cars","Improved performance","Improved cursor behavior","Bugfixes"],whatsNewScreenByVersionMa7Mi0: ["2021","{{0}} Three additional trains: Thalys, local train and street car.","{{0}} Central sidings may be used.","{{0}} Option to save game state.","Bugfixes."],whatsNewScreenByVersionMa7Mi1: ["2021","Remove Material Design Lite dependency."],whatsNewScreenByVersionMa7Mi2: ["2021","{{0}} Multiplayer: Text chat."],whatsNewScreenByVersionMa7Mi3: ["2021","Improved train paths","Improved shunting","Improved zoom gestures"],whatsNewScreenByVersionMa7Mi4: ["2022","Bigger menu and \"Classic UI\" display on small screens.","Improved \"Classic UI\".","Bugfixes."]}};
Object.freeze(STRINGS);
const DEFAULT_LANG = "en";
const CURRENT_LANG = typeof window.localStorage != "undefined" && typeof window.localStorage.getItem("morowayAppLang") == "string" ? window.localStorage.getItem("morowayAppLang") : typeof window.navigator.language != "undefined" && STRINGS.hasOwnProperty(window.navigator.language.substr(0, 2)) ? window.navigator.language.substr(0, 2) : DEFAULT_LANG;

var AVAILABLE_HARDWARE = [];
if (window.matchMedia("(pointer: fine)").matches) {
    AVAILABLE_HARDWARE[AVAILABLE_HARDWARE.length] = "mouse";
}

//Browser Compatibility
if (typeof Object.values == "undefined") {
    Object.values = function (obj) {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    };
}
