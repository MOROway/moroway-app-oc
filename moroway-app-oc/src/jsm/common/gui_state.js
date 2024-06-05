/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
//GUI STATE
function validateGuiState(item, test) {
    if (items.hasOwnProperty(item)) {
        return items[item].validate(test);
    }
    return false;
}
function getGuiStates() {
    var guiState = {};
    try {
        guiState = JSON.parse(window.localStorage.getItem("morowayAppGuiState") || "{}");
    }
    catch (e) {
        guiState = {};
    }
    return guiState;
}
export function getGuiState(item, overrideValue) {
    if (overrideValue === void 0) { overrideValue = undefined; }
    var value = getGuiStates()[item];
    if (overrideValue !== undefined && validateGuiState(item, overrideValue)) {
        return overrideValue;
    }
    else if (validateGuiState(item, value)) {
        return value;
    }
    else if (items.hasOwnProperty(item)) {
        return items[item].default;
    }
    return undefined;
}
export function setGuiState(item, value) {
    var guiState = getGuiStates();
    if (validateGuiState(item, value)) {
        guiState[item] = value;
    }
    window.localStorage.setItem("morowayAppGuiState", JSON.stringify(guiState));
}
var items = {
    "3d": {
        default: false,
        validate: function (test) {
            return typeof test == "boolean";
        }
    },
    "3d-night": {
        default: false,
        validate: function (test) {
            return typeof test == "boolean";
        }
    },
    "3d-rotation-speed": {
        default: 50,
        validate: function (test) {
            return typeof test == "number" && !Number.isNaN(test) && test >= 0 && test <= 100;
        }
    }
};
