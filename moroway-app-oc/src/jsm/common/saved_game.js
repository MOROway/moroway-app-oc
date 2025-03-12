/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
//SAVED GAME
import { APP_DATA } from "./app_data.js";
export function getVersionCode() {
    return APP_DATA.version.major * 10000 + APP_DATA.version.minor * 100 + APP_DATA.version.patch;
}
export function isGameSaved() {
    var keys = Object.keys(window.localStorage);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("morowayAppSaved") === 0) {
            return true;
        }
    }
    return false;
}
export function updateSavedGame() {
    function updateSavedGameElem(regexOld, old, newItem) {
        var elemKeys = savedGameKeys.filter(function (elem) {
            return elem.search(regexOld) === 0 || elem == old;
        });
        elemKeys.sort(function (elem1, elem2) {
            if (elem1 == old) {
                return 1;
            }
            else if (elem2 == old) {
                return -1;
            }
            else {
                return parseInt(elem2.replace(regexOld, "$1"), 10) - parseInt(elem1.replace(regexOld, "$1"), 10);
            }
        });
        if (elemKeys.length > 0 && (elemKeys[0] == old || getVersionCode() >= parseInt(elemKeys[0].replace(regexOld, "$1"), 10))) {
            var newVal = window.localStorage.getItem(elemKeys[0]);
            if (APP_DATA.version.beta == 0) {
                elemKeys.forEach(function (key) {
                    window.localStorage.removeItem(key);
                });
            }
            window.localStorage.setItem(newItem, newVal);
        }
    }
    var localStorageKeys = Object.keys(window.localStorage);
    var savedGameKeys = localStorageKeys.filter(function (elem) {
        return elem.indexOf("morowayAppSaved") === 0;
    });
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Bg$/, "morowayAppSavedBg", "morowayAppSavedGame_v-" + getVersionCode() + "_Bg");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Trains$/, "morowayAppSavedGameTrains", "morowayAppSavedGame_v-" + getVersionCode() + "_Trains");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Switches$/, "morowayAppSavedGameSwitches", "morowayAppSavedGame_v-" + getVersionCode() + "_Switches");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Cars$/, "morowayAppSavedCars", "morowayAppSavedGame_v-" + getVersionCode() + "_Cars");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_CarParams$/, "morowayAppSavedCarParams", "morowayAppSavedGame_v-" + getVersionCode() + "_CarParams");
    if (APP_DATA.version.beta == 0) {
        savedGameKeys.forEach(function (key) {
            if (key == "morowayAppSavedWithVersion") {
                window.localStorage.removeItem(key);
            }
        });
    }
}
export function removeSavedGame() {
    Object.keys(window.localStorage).forEach(function (key) {
        if (key.indexOf("morowayAppSaved") === 0) {
            window.localStorage.removeItem(key);
        }
    });
}
