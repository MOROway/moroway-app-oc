/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "../../jsm_platform/common/follow_links.js";
import { APP_DATA } from "./app_data.js";
import { getString, getLanguageList, setCurrentLang, CURRENT_LANG } from "./string_tools.js";
import { notify, NOTIFICATION_PRIO_HIGH, NOTIFICATION_PRIO_LOW } from "./notify.js";
import { isGameSaved, removeSavedGame } from "./saved_game.js";
//SETTINGS
export function getSettings() {
    var values = {};
    try {
        values = JSON.parse(window.localStorage.getItem(SETTINGS_NAME) || "{}");
    }
    catch (e) { }
    var defaults = { showNotifications: true, classicUI: true, alwaysShowSelectedTrain: true, cursorascircle: true, burnTheTaxOffice: true, saveGame: true, reduceOptMenu: false, reduceOptMenuHideGraphicalInfoToggle: false, reduceOptMenuHideTrainControlCenter: false, reduceOptMenuHideCarControlCenter: false, reduceOptMenuHideAudioToggle: false, reduceOptMenuHideDemoMode: false, startDemoMode: false, lockOrientationLandscape: false, showVersionNoteAgain: false, reduceOptMenuHide3DViewToggle: false, reduceOptMenuHide3DViewNightToggle: false, reduceOptMenuHideExit: false };
    var dependencies = { alwaysShowSelectedTrain: ["classicUI"], reduceOptMenuHideGraphicalInfoToggle: ["reduceOptMenu"], reduceOptMenuHideTrainControlCenter: ["reduceOptMenu"], reduceOptMenuHideCarControlCenter: ["reduceOptMenu"], reduceOptMenuHideAudioToggle: ["reduceOptMenu"], reduceOptMenuHideDemoMode: ["reduceOptMenu"], reduceOptMenuHide3DViewToggle: ["reduceOptMenu"], reduceOptMenuHide3DViewNightToggle: ["reduceOptMenu"], reduceOptMenuHideExit: ["reduceOptMenu"] };
    var hardware = { cursorascircle: ["mouse"] };
    var platforms = { reduceOptMenuHideDemoMode: ["snap", "web", "windows"], reduceOptMenuHideExit: ["android"], startDemoMode: ["snap", "windows"], lockOrientationLandscape: ["android"], showVersionNoteAgain: ["android"] };
    Object.keys(defaults).forEach(function (key) {
        if (typeof values[key] !== "boolean") {
            values[key] = defaults[key];
        }
    });
    Object.keys(values).forEach(function (key) {
        if (typeof defaults[key] !== "boolean") {
            delete values[key];
        }
    });
    return { values: values, dependencies: dependencies, hardware: hardware, platforms: platforms };
}
function isSettingActive(a) {
    var settingsComplete = getSettings();
    var isSettingActive = true;
    if (settingsComplete.dependencies[a] != null) {
        settingsComplete.dependencies[a].forEach(function (key) {
            if (!getSetting(key)) {
                isSettingActive = false;
            }
        });
    }
    return isSettingActive;
}
function isHardwareAvailable(a) {
    var settingsComplete = getSettings();
    var isHardwareAvailable = true;
    if (settingsComplete.hardware[a] != null) {
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
function isInPlatformList(a) {
    var settingsComplete = getSettings();
    var isInPlatformList = true;
    if (settingsComplete.platforms[a] != null) {
        isInPlatformList = settingsComplete.platforms[a].indexOf(APP_DATA.platform) > -1;
    }
    return isInPlatformList;
}
export function setSettingsHTML(elem, standalone) {
    function displaySettingsOpts() {
        var settings = getSettings().values;
        for (var i = 0; i < Object.keys(settings).length; i++) {
            var settingId = Object.keys(settings)[i];
            var settingElem = document.querySelector("li[data-settings-id='" + settingId + "']");
            if (settingElem !== null) {
                var leftButton = settingElem.querySelector(".settings-opts-left-button");
                if (Object.values(settings)[i]) {
                    leftButton.style.backgroundColor = "black";
                    leftButton.style.transform = "rotate(360deg)";
                }
                else {
                    leftButton.style.backgroundColor = "";
                    leftButton.style.transform = "rotate(0deg)";
                }
                if (isSettingActive(settingId) && isHardwareAvailable(settingId) && isInPlatformList(settingId)) {
                    settingElem.style.setProperty("max-height", "");
                    settingElem.style.setProperty("margin", "");
                    settingElem.style.setProperty("border", "");
                    settingElem.style.setProperty("padding", "");
                    settingElem.style.setProperty("opacity", "");
                }
                else {
                    settingElem.style.setProperty("max-height", "0");
                    settingElem.style.setProperty("margin", "0");
                    settingElem.style.setProperty("border", "0");
                    settingElem.style.setProperty("padding", "0");
                    settingElem.style.setProperty("opacity", "0.5");
                }
            }
        }
    }
    function displaySettingsButtons() {
        var settings = getSettings().values;
        var btnSaveGameDeleteGame = document.querySelector("#saveGameDeleteGame");
        if (btnSaveGameDeleteGame == undefined || btnSaveGameDeleteGame == null) {
            return false;
        }
        if (settings.saveGame || !isGameSaved() || !standalone) {
            btnSaveGameDeleteGame.style.display = "";
        }
        else {
            btnSaveGameDeleteGame.style.display = "inline";
        }
        var reduceOptMenuHideItems = document.querySelectorAll(".reduce-opt-menu-hide-item");
        for (var i = 0; i < reduceOptMenuHideItems.length; i++) {
            if (!settings.reduceOptMenu) {
                reduceOptMenuHideItems[i].style.display = "";
            }
            else {
                reduceOptMenuHideItems[i].style.display = "inline";
                reduceOptMenuHideItems[i].style.textDecoration = "";
                reduceOptMenuHideItems[i].textContent = getString("optButton_morowayApp_" + reduceOptMenuHideItems[i].dataset.settingsId);
                if (settings[reduceOptMenuHideItems[i].dataset.settingsId]) {
                    reduceOptMenuHideItems[i].style.textDecoration = "line-through";
                }
            }
        }
    }
    function changeSetting(event, idOnElement) {
        if (idOnElement === void 0) { idOnElement = false; }
        var id = idOnElement ? event.target.dataset.settingsId : event.target.parentNode.parentNode.dataset.settingsId;
        setSetting(id, !getSetting(id));
        displaySettingsOpts();
        displaySettingsButtons();
        notify(".notify", getString("optApply", "."), NOTIFICATION_PRIO_LOW, 900, null, null, window.innerHeight);
    }
    if (elem == undefined || elem == null) {
        return false;
    }
    if (standalone == undefined || standalone == null) {
        standalone = true;
    }
    elem.classList.add("settings");
    var root = document.createElement("ul");
    var rootId = "settings-list-" + SETTINGS_NAME;
    var existingRoot = elem.querySelector("#" + rootId);
    if (existingRoot != undefined) {
        elem.removeChild(existingRoot);
    }
    root.className = "settings-list";
    root.id = rootId;
    var settings = getSettings().values;
    for (var i = 0; i < Object.keys(settings).length; i++) {
        var opt = Object.keys(settings)[i];
        if (getString("optTitle_" + SETTINGS_NAME + "_" + opt) != "undefined") {
            var optElem = document.createElement("li");
            optElem.dataset.settingsId = opt;
            var child = document.createElement("div");
            child.className = "settings-opts-wrapper";
            var kid = document.createElement("i");
            kid.textContent = "settings";
            kid.className = "settings-opts-left-button material-icons";
            kid.addEventListener("click", function (event) {
                changeSetting(event);
            });
            child.appendChild(kid);
            kid = document.createElement("span");
            kid.textContent = getString("optTitle_" + SETTINGS_NAME + "_" + opt);
            kid.className = "settings-opts-text-button";
            kid.addEventListener("click", function (event) {
                changeSetting(event);
            });
            child.appendChild(kid);
            optElem.appendChild(child);
            child = document.createElement("div");
            child.className = "settings-hints-wrapper";
            if (getString("optDesc_" + SETTINGS_NAME + "_" + opt) != "undefined") {
                kid = document.createElement("span");
                kid.textContent = getString("optDesc_" + SETTINGS_NAME + "_" + opt);
                child.appendChild(kid);
            }
            if (getString("optDesc_" + SETTINGS_NAME + "_" + opt) != "undefined" && getString("optInfo_" + SETTINGS_NAME + "_" + opt) != "undefined") {
                kid = document.createElement("br");
                child.appendChild(kid);
            }
            if (getString("optInfo_" + SETTINGS_NAME + "_" + opt) != "undefined") {
                kid = document.createElement("i");
                kid.textContent = getString("optInfo_" + SETTINGS_NAME + "_" + opt);
                child.appendChild(kid);
            }
            optElem.appendChild(child);
            if (opt == "saveGame") {
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
            else if (opt == "reduceOptMenu") {
                child = document.createElement("div");
                child.className = "settings-buttons-wrapper";
                var kidNames = ["reduceOptMenuHideGraphicalInfoToggle", "reduceOptMenuHideTrainControlCenter", "reduceOptMenuHideCarControlCenter", "reduceOptMenuHideAudioToggle", "reduceOptMenuHideDemoMode", "reduceOptMenuHide3DViewToggle", "reduceOptMenuHide3DViewNightToggle", "reduceOptMenuHideExit"];
                kidNames.forEach(function (kidName) {
                    if (isHardwareAvailable(kidName) && isInPlatformList(kidName)) {
                        kid = document.createElement("button");
                        kid.className = "settings-button reduce-opt-menu-hide-item";
                        kid.dataset.settingsId = kidName;
                        kid.addEventListener("click", function (event) {
                            changeSetting(event, true);
                        });
                        child.appendChild(kid);
                    }
                });
                optElem.appendChild(child);
            }
            root.appendChild(optElem);
        }
    }
    elem.appendChild(root);
    var root2 = document.createElement("div");
    var rootId2 = "langoption";
    var existingRoot2 = elem.querySelector("#" + rootId2);
    if (existingRoot2 != undefined) {
        elem.removeChild(existingRoot2);
    }
    root2.id = rootId2;
    child = document.createElement("div");
    child.id = "langoptioninfo";
    child.textContent = getString("optLangSelectInfo", ":");
    root2.appendChild(child);
    getLanguageList().forEach(function (val) {
        var childButton = document.createElement("button");
        childButton.className = "langvalue";
        childButton.textContent = getString("langName", "", "", val);
        childButton.dataset.langCode = val;
        if (val == CURRENT_LANG) {
            childButton.id = "clang";
        }
        else {
            childButton.addEventListener("click", function () {
                setCurrentLang(val);
                notify(".notify", getString("optLangSelectChange", "!", "upper", val), NOTIFICATION_PRIO_HIGH, 10000, function () {
                    followLink(window.location.href, "_self", LINK_STATE_INTERNAL_HTML);
                }, getString("optLangSelectChangeButton", "", "upper", val));
            });
        }
        root2.appendChild(childButton);
    });
    elem.appendChild(root2);
    displaySettingsOpts();
    displaySettingsButtons();
    var event = new CustomEvent("moroway-app-after-set-settings-html", { detail: { elem: elem, standalone: standalone } });
    document.dispatchEvent(event);
}
export function getSetting(key) {
    if (!key) {
        return false;
    }
    return getSettings().values[key] && isSettingActive(key) && isHardwareAvailable(key) && isInPlatformList(key);
}
export function setSetting(key, value) {
    var settings = getSettings().values;
    if (isSettingActive(key) && isHardwareAvailable(key) && isInPlatformList(key)) {
        settings[key] = value;
        window.localStorage.setItem(SETTINGS_NAME, JSON.stringify(settings));
    }
}
var SETTINGS_NAME = "morowayApp";
var AVAILABLE_HARDWARE = [];
if (window.matchMedia("(pointer: fine)").matches) {
    AVAILABLE_HARDWARE[AVAILABLE_HARDWARE.length] = "mouse";
}
