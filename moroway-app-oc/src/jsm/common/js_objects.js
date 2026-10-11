/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./app_data.js";
//HANDLE OBJECTS
export function copyJSObject(object) {
    try {
        return structuredClone(object);
    }
    catch (error) {
        if (APP_DATA.debug) {
            console.error(error);
        }
        return JSON.parse(JSON.stringify(object));
    }
}
export function deepFreeze(object) {
    if (typeof object == "object") {
        Object.keys(object).forEach(function (key) {
            if (typeof object[key] == "object") {
                deepFreeze(object[key]);
            }
        });
        Object.freeze(object);
    }
}
